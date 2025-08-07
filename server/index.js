require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Import multer
const fs = require('fs'); // Import fs module for file system operations
const os = require('os'); // Import os module to get network interface
const nodemailer = require('nodemailer'); // Re-import nodemailer
const puppeteer = require('puppeteer'); // Import puppeteer for server-side PDF generation
const port = 5000;

const {Pool} = require('pg'); // Import the PostgreSQL connection pool
const pool = new Pool ({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,

  },
}); 

const app = express();

// Function to get the server's network IP address
function getServerIpAddress() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      // Filter out internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
return 'localhost'; // Fallback to localhost if no suitable IP is found
}

const serverIp = getServerIpAddress();
console.log(`Backend: Server will use IP address: ${serverIp}`);


// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Backend: Created uploads directory at ${uploadsDir}`);
  } catch (err) {
    console.error(`Backend: Error creating uploads directory: ${err.message}`);
    // Exit or handle gracefully if directory cannot be created
  }
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Backend: Multer destination function called.');
    console.log('Backend: Destination path:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename using timestamp and original extension
    const filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
    console.log('Backend: Multer generated filename:', filename);
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.get('/test', async (req, res) => {
try{
  const result = await pool.query('SELECT NOW()');
  res.json({success:true, time: result.rows[0].now});
} catch (error){
  console.error(error)
  res.status(500).json({error: 'Database Connecitonfailed'})
}}),

app.use(cors()); // Enable CORS for development
app.use(express.json()); // For parsing JSON request bodies (for non-file uploads)

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT, 10),
  secure: process.env.EMAIL_SECURE === 'true', // Converts "false" string to boolean false
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify transporter configuration (optional, but good for debugging)
transporter.verify(function (error, success) {
  if (error) {
    console.error("Backend: Nodemailer transporter verification failed:", error);
  } else {
    console.log("Backend: Nodemailer transporter is ready to send messages.");
  }
});

// Function to generate the HTML content for the email receipt
// This HTML will now be used by Puppeteer to generate a PDF, so client-side JS is removed.
function generateEmailReceiptHtml(requestDetails, selectedDocumentsForEmail, calculatedDocStampAmount, finalTotalAmountDue) {
  const {
    formRequestId,
    firstName,
    lastName,
    middleName,
    emailAddress,
    studentNumber,
    selectedCollege,
    degreeProgram,
    // Add other fields from requestDetails if needed for the email body
  } = requestDetails;

  // Debugging log: Check formRequestId inside the HTML generation function
  console.log(`Backend: generateEmailReceiptHtml - formRequestId received: ${formRequestId}`);

  // The formRequestId is directly used as the receipt number, ensuring it's an exact copy from the frontend.
  const dateGenerated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  let documentRowsHtml = '';
  selectedDocumentsForEmail.forEach(doc => {
    const specificSubjectText = doc.specificSubject ? ` (Subject: ${doc.specificSubject})` : '';
    documentRowsHtml += `
      <tr>
        <td>${doc.documentType}${specificSubjectText}</td>
        <td class="text-center">${doc.quantity}</td>
        <td class="text-right">P${doc.totalAmount.toFixed(2)}</td>
      </tr>
    `;
  });

  // Add Doc Stamp row if applicable
  if (calculatedDocStampAmount > 0) {
    documentRowsHtml += `
      <tr>
        <td>DOC STAMP</td>
        <td class="text-center">1</td>
        <td class="text-right">P${calculatedDocStampAmount.toFixed(2)}</td>
      </tr>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Official Payment Receipt</title>
        <style>
            /* Embedded styles for better email client compatibility and PDF rendering */
            body {
                font-family: 'Poppins', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                /* Background image for the receipt - ensure this path is accessible to Puppeteer if used */
                /* background-image: url('http://${serverIp}:${port}/uploads/your-uploaded-background-filename.png'); */
                background-repeat: no-repeat;
                background-position: center center;
                background-size: 80%;
                background-color: #ffffff;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 15px;
            }
            td, th {
                padding: 8px;
                text-align: left;
                vertical-align: top;
            }
            .header-logo {
                text-align: center;
                padding-bottom: 10px;
            }
            .header-logo img {
                max-width: 80px;
                height: auto;
            }
            .university-name {
                font-size: 18px;
                font-weight: bold;
                color: #8B4513;
                text-align: center;
                margin: 0;
            }
            .university-address {
                font-size: 12px;
                color: #555555;
                text-align: center;
                margin: 0;
            }
            .receipt-title {
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                padding: 5px 0;
                border-top: 0.5px solid #333;
                border-bottom: 0.5px solid #333;
                margin-bottom: 3px;
                text-transform: uppercase;
            }
            .detail-label {
                font-weight: bold;
                color: #333;
            }
            .receipt-table th, .receipt-table td {
                border-bottom: 1px dashed #eee;
                padding: 10px 0;
            }
            .receipt-table th {
                font-weight: bold;
                background-color: #f9f9f9;
            }
            .text-right {
                text-align: right;
            }
            .text-center {
                text-align: center;
            }
            .total-row {
                font-weight: bold;
                border-top: 2px solid #333;
            }
            .signature-line {
                border-top: 1px solid #333;
                padding-top: 40px;
                text-align: center;
                font-size: 12px;
                color: #555;
            }
        </style>
    </head>
    <body>
        <div class="container" id="receipt-content">
            <!-- Header Section -->
            <table>
                <tr>
                    <td class="header-logo">
                        <!-- PLM Logo inserted here -->
                        <img src="https://www.seekpng.com/png/full/100-1007713_seal-of-approval-png.png" alt="PLM Logo">
                        <p class="university-name">PAMANTASAN NG LUNGSOD NG MAYNILA</p>
                        <p class="university-address"><em>University of the City of Manila</em><br><em>Intramuros, Manila</em></p>
                    </td>
                </tr>
                <tr>
                    <td><div class="section-divider"></div></td>
                </tr>
            </table>

            <!-- Official Payment Receipt Title -->
            <table>
                <tr>
                    <td>
                        <p class="receipt-title">OFFICIAL PAYMENT RECEIPT</p>
                    </td>
                </tr>
            </table>

            <!-- Receipt Info (No. and Date) -->
            <table>
                <tr>
                    <td style="width: 40%;">
                        <span class="detail-label">REFERENCE NO. :</span> ${formRequestId}
                    </td>
                    <td style="width: 40%; text-align: right;">
                        <span class="detail-label">DATE GENERATED :</span> ${dateGenerated}
                    </td>
                </tr>
            </table>

            <!-- Receipt Details Table -->
            <table class="receipt-table">
                <thead>
                    <tr>
                        <th style="width: 40%;">DOCUMENT TYPE</th>
                        <th style="width: 20%; text-align: center;">QUANTITY</th>
                        <th style="width: 20%; text-align: right;">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    ${documentRowsHtml}
                </tbody>
                <tr class="total-row">
                    <td colspan="2" class="text-right">TOTAL AMOUNT DUE</td>
                    <td class="text-right">P${finalTotalAmountDue.toFixed(2)}</td>
                </tr>
            </table>

            <!-- Signature Lines -->
            <table>
                <tr>
                    <td style="width: 25%;">
                        <div class="signature-line">SIGNATURE</div>
                    </td>
                    <td style="width: 25%;">
                        <div class="signature-line">CASHIER SIGNATURE</div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding-top: 10px; text-align: right; font-size: 12px; color: #555;">
                        DATE: ${currentDate}
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
  `;
}


// API endpoint to test backend connectivity
app.get('/server/test', (req, res) => {
  console.log('Backend: /server/test endpoint hit.'); // Added log
  res.json({ message: 'Hello Welcome to the backend API!' });
});

// API endpoint to test database connection
app.get('/database', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ now: result.rows[0].now });
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// UPDATED API endpoint: Search student credentials by name and birthdate (exact match)
app.get('/api/studentCredentials/search', async (req, res) => {
  console.log('Backend: /api/studentCredentials/search endpoint hit.'); // Added log
  const { firstName, lastName, middleName, birthDate } = req.query;
  console.log(`Backend: Searching student credentials for: ${firstName} ${middleName} ${lastName}, BirthDate: ${birthDate}`);

  // First name, last name, and birth date are required for search
  if (!firstName || !lastName || !birthDate) {
    console.log('Backend: Missing required search parameters.'); // Added log
    return res.status(400).json({ error: 'First name, last name, and birth date are required for search.' });
  }

  try {
    // Convert input parameters to lowercase for case-insensitive comparison
    const lowerFirstName = firstName.toLowerCase();
    const lowerLastName = lastName.toLowerCase();
    const lowerMiddleName = middleName ? middleName.toLowerCase() : ''; // Handle null/empty middleName

    // MODIFIED: Use ILIKE for name matching to allow partial/fuzzy matches
    // Also, use '%' wildcards to match parts of the string
    let query = `
      SELECT * FROM incoming.studentCredentials
      WHERE LOWER(firstName) ILIKE $1 AND LOWER(lastName) ILIKE $2 AND birthDate = $3
    `;
    let values = [`%${lowerFirstName}%`, `%${lowerLastName}%`, birthDate];
    let paramIndex = 4; // Start index for additional parameters

    // Only add middleName to the query if it is provided and not empty
    if (middleName && middleName.trim() !== '') {
      query += ` AND LOWER(middleName) ILIKE $${paramIndex}`;
      values.push(`%${lowerMiddleName}%`);
    } else {
        // If middleName is not provided or empty, ensure the DB field is null or empty
        query += ` AND (middleName IS NULL OR middleName = '')`;
    }

    console.log('Backend: SQL Query for search:', query);
    console.log('Backend: Values for search query:', values); // ADDED LOG: Log the values array

    const result = await pool.query(query, values);

    if (result.rows.length > 0) {
      console.log('Backend: Student found:', result.rows[0]);
      res.json(result.rows[0]); // Return the first matching student
    } else {
      console.log('Backend: No student found with the provided name and birthdate.');
      res.status(404).json({ message: 'No student found with the provided name and birthdate.' });
    }
  } catch (err) {
    console.error('Backend: Error searching student credentials:', err.stack);
    // Ensure error response is always JSON
    res.status(500).json({ error: 'Internal server error during student search', details: err.message });
  }
});


// API endpoint to get all requested forms (example)
app.get('/api/incoming.requestForm', async (req, res) => {
  console.log('Backend: /api/incoming.requestForm endpoint hit.'); // Added log
  try {
    // Assuming 'requestform' is your table name for main requests
    const result = await pool.query('SELECT * FROM incoming.requestForm');
    res.json(result.rows);
  } catch (err) {
    console.error('Backend: Error executing query for requestForms:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to get a specific requested form by student number (example)
app.get('/api/incoming.requestForm/:studentNumber', async (req, res) => {
  console.log('Backend: /api/incoming.requestForm/:studentNumber endpoint hit.'); // Added log
  const { studentNumber } = req.params;
  try {
    const result = await pool.query('SELECT * FROM incoming.requestForm WHERE studentNumber = $1', [studentNumber]);
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Form not found' });
    }
  } catch (err) {
    console.error('Backend: Error executing query for specific requestForm:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: Save applicant form data (main request) AND send email with PDF attachment
app.post('/api/incoming.requestForm', async (req, res) => {
  console.log('Backend: POST /api/incoming.requestForm endpoint hit.'); // Added log
  try {
    console.log('Backend: 📥 Incoming requestForm payload:', req.body);
    // Debugging log: Check formRequestId immediately after receiving the payload
    console.log(`Backend: Received formRequestId from frontend: ${req.body.formRequestId}`);

    const {
      formRequestId,
      studentNumber, firstName, lastName, middleName, degreeProgram,
      selectedCollege, ayAdmitted, semAdmitted, graduationDate,
      birthDate,
      phoneNumber, emailAddress, // Ensure emailAddress is present for sending email
      streetName, barangay, municipality, province,
      purposeOfRequest,
      selectedDocumentsForEmail, // Data for email summary
      calculatedDocStampAmount,   // Data for email summary
      finalTotalAmountDue         // Data for email summary
    } = req.body;

    const query = `
      INSERT INTO incoming.requestForm (
        formRequestId,
        studentNumber, firstName, lastName, middleName, degreeProgram,
        selectedCollege, ayAdmitted, semAdmitted, graduationDate,
        "birthDate",
        phoneNumber, emailAddress,
        streetName, barangay, municipality, province,
        purposeOfRequest
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING studentNumber, formRequestId;
    `;

    const values = [
      formRequestId,
      studentNumber, firstName, lastName, middleName, degreeProgram,
      selectedCollege, ayAdmitted, semAdmitted, graduationDate, birthDate,
      phoneNumber, emailAddress, streetName, barangay, municipality, province,
      purposeOfRequest
    ];
    console.log('Backend: Values for requestForm insertion:', values);

    const result = await pool.query(query, values);
    const savedFormRequestId = result.rows[0].formrequestid;
    console.log('Backend: ✅ Request Form inserted, ID:', savedFormRequestId);

    // --- Send immediate response to frontend ---
    res.json({
      message: 'Request form saved successfully! Confirmation email will be sent shortly.',
      requestId: savedFormRequestId
    });
    console.log('Backend: Sent immediate response to frontend.');

    // --- ASYNCHRONOUSLY handle PDF Generation and Email Sending ---
    // Use an IIFE (Immediately Invoked Function Expression) or a separate function
    // to run this part in the background without blocking the main request.
    (async () => {
      let browser;
      try {
        if (emailAddress) {
          console.log('Backend: Starting asynchronous PDF generation and email sending...');
          // Generate HTML content for the PDF
          const receiptHtml = generateEmailReceiptHtml(
            { // Pass all necessary request details for the email template
              formRequestId, firstName, lastName, middleName, emailAddress,
              studentNumber, selectedCollege, degreeProgram
            },
            selectedDocumentsForEmail,
            calculatedDocStampAmount,
            finalTotalAmountDue
          );

          // Launch Puppeteer browser
          browser = await puppeteer.launch({
            headless: true, // Run in headless mode (no browser UI)
            args: ['--no-sandbox', '--disable-setuid-sandbox'] // Recommended for Docker/CI environments
          });
          const page = await browser.newPage();

          // Set the HTML content of the page
          await page.setContent(receiptHtml, { waitUntil: 'networkidle0' }); // Wait for network to be idle

          // Generate PDF
          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Include background colors/images
            margin: {
              top: '10mm',
              right: '10mm',
              bottom: '10mm',
              left: '10mm'
            }
          });
          console.log('Backend: ✅ PDF generated successfully (asynchronously).');

          const mailOptions = {
             from: `"PLM Registrar Office" <${process.env.EMAIL_USER}>`,
             to: emailAddress,
             subject: `Document Request Confirmation - TRN: ${formRequestId}`,
             html: `
                <p>Dear ${firstName} ${lastName},</p>
                <p>Greetings from Pamantasan ng Lungsod ng Maynila.</p>
                <p>We acknowledge receipt of your online request submitted on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. Please find attached the official payment receipt for your request.</p>
                <p><strong>IMPORTANT INSTRUCTIONS:</strong></p>
                <ol>
                    <li>Print this receipt and ensure all details are clearly visible.</li>
                    <li>Gather required attachments (if applicable to your specific request).</li>
                    <li>Visit the School Cashier during office hours (8AM to 12PM & 1PM to 4PM) to present the printed receipt along with any required supporting documents.</li>
                    <li>Pay the exact amount as indicated on the receipt.</li>
                </ol>
                <p>Please ensure all documents are complete before visiting the cashier to avoid delays in processing. Payment must be made within 15 days from the date of this notice.</p>
                <p>For any inquiries or clarifications, please contact the Registrar's Office at +(632) 85284574 or registrar@plm.edu.ph</p>
                <p>Thank you for your prompt attention to this matter.</p>
                <p>Respectfully,</p>
                <p>Our University of the Registrar<br>Pamantasan ng Lungsod ng Maynila<br></p>
                <p><em>This is an automated message. Please do not reply to this email.</em></p>
             `,
             attachments: [
               {
                 filename: `Official_Payment_Receipt_${formRequestId}.pdf`,
                 content: pdfBuffer,
                 contentType: 'application/pdf'
               }
             ]
          };

          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.error('Backend: ❌ Error sending email (asynchronously):', error);
            } else {
              console.log('Backend: ✅ Email sent successfully (asynchronously):', info.response);
            }
          });
        } else {
          console.warn('Backend: Email address not provided, skipping asynchronous email notification and PDF generation.');
        }
      } catch (asyncError) {
        console.error('Backend: ❌ Error in asynchronous PDF generation or email sending:', asyncError);
      } finally {
        if (browser) {
          await browser.close();
          console.log('Backend: Puppeteer browser closed (asynchronously).');
        }
      }
    })(); // Immediately invoke the async function
    // --- End ASYNCHRONOUS handling ---

  } catch (error) {
    console.error('Backend: ❌ Unexpected backend error during requestForm insertion (before async tasks):', error);
    // Only send error response if it hasn't been sent already
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  }
});


// POST: Save individual requested documents
app.post('/api/incoming.documentRequested', async (req, res) => {
  console.log('Backend: POST /api/incoming.documentRequested endpoint hit.'); // Added log
  const {
    formRequestId, // Foreign key linking to the main requestform
    studentNumber,
    firstName,
    lastName,
    middleName,
    degreeProgram,
    ayAdmitted,
    semAdmitted,
    documentType,
    unitPrice,
    quantity,
    attachmentFile, // This will now be a JSON string of URLs
    totalAmount, // Total for this specific document (unitPrice * quantity)
    specificSubject // ADDED: Destructure specificSubject from req.body
  } = req.body;

  try {
    const documentId = `DOC${Math.floor(100000 + Math.random() * 900000)}`;

    // ADDED LOGS: Check the attachmentFile value received by the backend
    console.log('Backend: Debugging attachmentFile for documentRequested insertion:');
    console.log('Backend:   attachmentFile from req.body (raw):', attachmentFile);
    console.log('Backend:   Type of attachmentFile (raw):', typeof attachmentFile);
    console.log('Backend:   Length of attachmentFile string (raw):', attachmentFile ? attachmentFile.length : 'N/A');
    // ADDED LOG: Log the specificSubject received
    console.log('Backend:   specificSubject from req.body:', specificSubject);


    // Attempt to parse the JSON string to inspect its content
    let parsedAttachmentFile = null; // Initialize to null
    try {
        parsedAttachmentFile = JSON.parse(attachmentFile);
        console.log('Backend:   attachmentFile (parsed JSON):', parsedAttachmentFile);
        console.log('Backend:   Type of attachmentFile (parsed):', typeof parsedAttachmentFile);
        if (Array.isArray(parsedAttachmentFile)) {
            console.log('Backend:   Number of paths in parsed array:', parsedAttachmentFile.length);
            if (parsedAttachmentFile.length > 0) {
                console.log('Backend:   First path in array:', parsedAttachmentFile[0]);
            }
        }
    } catch (jsonParseError) {
        console.error('Backend:   Error parsing attachmentFile as JSON:', jsonParseError.message);
        parsedAttachmentFile = `Error parsing: ${attachmentFile}`; // Store error message if parsing fails
    }


    const query = `
      INSERT INTO incoming.documentRequested (
        documentId, formRequestId, studentNumber, firstName, lastName, middleName, degreeProgram,
        ayAdmitted, semAdmitted, documentType, unitPrice, quantity, attachmentFile, totalAmount,
        "specificSubject" -- ADDED: Included double quotes around specificSubject
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING documentId;
    `;
    const values = [
      documentId, formRequestId, studentNumber, firstName, lastName, middleName,
      degreeProgram, ayAdmitted, semAdmitted, documentType,
      unitPrice, quantity, attachmentFile, totalAmount,
      specificSubject
    ];

    console.log('Backend: Values array for insertion (including specificSubject at $15):', values);


    const result = await pool.query(query, values);
    res.json({ message: 'Document saved!', documentId: result.rows[0].documentid });
    console.log('Backend: Document saved successfully, documentId:', result.rows[0].documentid);

  } catch (error) {
      console.error('Backend: Error saving document requested:', error);
      res.status(500).json({ error: 'Internal server error', details: error.message });
    }
  });

// NEW API endpoint for uploading individual document attachments
app.post('/api/incoming.uploadDocumentAttachment', upload.single('documentAttachment'), async (req, res) => {
  console.log('Backend: POST /api/incoming.uploadDocumentAttachment endpoint hit.'); // Added log
  console.log('Backend: Received request for document attachment upload.');
  console.log('Backend: req.file (from Multer):', req.file); // Crucial log to see if Multer processed the file
  console.log('Backend: req.body (for non-file fields, usually empty for single file uploads):', req.body);

  if (!req.file) {
    console.error('Backend: No document attachment file found in request. Multer might have failed or file was not sent.');
    return res.status(400).json({ error: 'No document attachment file uploaded or Multer error.' });
  }

  // Construct the web-accessible URL using the dynamically determined IP
  const fileUrl = `http://${serverIp}:${port}/uploads/${req.file.filename}`;
  console.log('Backend: Document attachment file uploaded successfully. Web URL:', fileUrl);
  // Return the web URL. The frontend will then use this to update the main document record.
  res.status(200).json({ message: 'File uploaded successfully', filePath: fileUrl });
});


app.post('/api/incoming.receiptDetailsSubmission', upload.single('originalReceipt'), async (req, res) => {
  console.log('Backend: POST /api/incoming.receiptDetailsSubmission endpoint hit.'); 
  console.log('Backend: Received request for receipt details submission.');
  console.log('Backend: req.file for originalReceipt:', req.file);

  const {
    orNumber,
    formRequestId,
    firstName,
    lastName,
    middleName,
    studentNumber,
    dateOfPayment
  } = req.body; 

  
  console.log(`Backend: Receipt submission received for formRequestId: ${formRequestId}`);
  console.log(`Backend: Received dateOfPayment: ${dateOfPayment}`);

  const originalReceiptFileUrl = req.file ? `http://${serverIp}:${port}/uploads/${req.file.filename}` : null;
  console.log('Backend: Received originalReceiptFileUrl for receiptDetailsSubmission:', originalReceiptFileUrl);
  console.log('Backend: Type of originalReceiptFileUrl:', typeof originalReceiptFileUrl);


  if (!originalReceiptFileUrl) {
    console.error('Backend: No original receipt file found in request.');
    return res.status(400).json({ error: 'No receipt file uploaded.' });
  }

  try {

    const documentsQuery = `
      SELECT
        documentid,
        documenttype,
        quantity,
        totalamount,
        "specificSubject"
      FROM incoming.documentRequested
      WHERE formrequestid = $1;
    `;
    console.log(`Backend: Querying documentRequested for formRequestId: ${formRequestId}`);
    const documentsResult = await pool.query(documentsQuery, [formRequestId]);
    const requestedDocuments = documentsResult.rows; 

    console.log('Backend: Concatenated document types and IDs into comma-separated strings');
    const documentTypesString = requestedDocuments.map(doc => doc.documenttype).join(', ');
    const documentIdsString = requestedDocuments.map(doc => doc.documentid).join(', ');

    console.log('Backend: Concatenated documentTypesString:', documentTypesString);
    console.log('Backend: Concatenated documentIdsString:', documentIdsString);

    const query = `
      INSERT INTO incoming.receiptDetailsSubmission (
        orNumber, formRequestId, firstName, lastName, middleName, studentNumber, originalReceipt,
        documenttype,
        documentid,
        dateOfPayment
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING orNumber;
    `;
    const values = [
      orNumber, formRequestId, firstName, lastName, middleName,
      studentNumber, originalReceiptFileUrl,
      documentTypesString,
      documentIdsString,
      dateOfPayment
    ];
    console.log('Backend: Values for receiptDetailsSubmission insertion:', values);

    const result = await pool.query(query, values);
    console.log('Backend: Receipt details saved successfully! orNumber:', result.rows[0].orNumber, 'FilePath:', originalReceiptFileUrl);
    res.status(200).json({ message: 'Receipt details saved!', orNumber: result.rows[0].orNumber, filePath: originalReceiptFileUrl });
  } catch (error) {
    console.error('Backend: Error saving receipt details submission:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

app.get('/api/incoming.documentTypesByRequestId/:formRequestId', async (req, res) => {
  console.log('Backend: /api/incoming.documentTypesByRequestId/:formRequestId endpoint hit.');
  const { formRequestId } = req.params;
  try {
    console.log(`Backend: Fetching document types for formRequestId: ${formRequestId}`);
    const query = `
      SELECT documentid, documenttype, quantity, totalamount, "specificSubject"
      FROM incoming.documentRequested
      WHERE formrequestid = $1;
    `;
    const result = await pool.query(query, [formRequestId]);

    if (result.rows.length > 0) {
      console.log(`Backend: Found ${result.rows.length} documents for formRequestId ${formRequestId}`);
      res.json(result.rows);
    } else {
      console.log(`Backend: No documents found for this request ID.`);
      res.status(404).json({ message: 'No documents found for this request ID.' });
    }
  } catch (err) {
    console.error('Backend: Error fetching document types by formRequestId:', err.stack);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, 'dist')));

app.use((err, req, res, next) => {
  console.error('Backend: Global Error Handler caught an error:', err.stack);
  res.status(500).json({
    error: 'An unexpected server error occurred.',
    details: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://${serverIp}:${port}`);
});

