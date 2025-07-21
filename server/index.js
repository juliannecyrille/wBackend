//backend
    const express = require('express');
    const cors = require('cors');
    const path = require('path');
    const multer = require('multer'); // Import multer
    const fs = require('fs'); // Import fs module for file system operations
    const os = require('os'); // Import os module to get network interfaces
    const nodemailer = require('nodemailer'); // Import nodemailer
    const port = 5000;
    const pool = require('./database'); // Import the PostgreSQL connection pool
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

    app.use(cors()); // Enable CORS for development
    app.use(express.json()); // For parsing JSON request bodies (for non-file uploads)
    // Note: express.json() is not needed for multipart/form-data, multer handles it.

    // Serve static files from the 'dist' directory (if building a production frontend)
    app.use(express.static(path.join(__dirname, 'dist')));
    // Serve uploaded files statically
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


    // Nodemailer transporter setup
    // IMPORTANT: Replace with your actual email service details and credentials.
    // For Gmail, you might need to enable "Less secure app access" or use an "App password" if 2FA is on.
    //
    // **TROUBLESHOOTING GMAIL AUTHENTICATION (535-5.7.8 error):**
    // If you are encountering the "Invalid login: 535-5.7.8 Username and Password not accepted" error,
    // it's almost always due to incorrect Gmail security settings or credentials.
    //
    // 1.  **Check Credentials:** Double-check that 'juliannecyrille.jc@gmail.com' and the password below are absolutely correct.
    // 2.  **App Passwords (RECOMMENDED for 2-Factor Authentication):**
    //     If you have 2-Factor Authentication (2FA) enabled on your Gmail account, you *cannot* use your
    //     regular Gmail password directly. You *must* generate a special "App password" for Nodemailer.
    //     * Go to your Google Account: `myaccount.google.com`
    //     * Navigate to `Security` > `How you sign in to Google` > `App passwords`.
    //         (If you don't see "App passwords", it means 2FA is not enabled for your account).
    //     * You might need to sign in again.
    //     * Under "Select app" choose `Mail`. Under "Select device" choose `Other (Custom name)`.
    //     * Enter a custom name (e.g., "Nodemailer App") and click "Generate".
    //     * A 16-character code will be generated. **Use this 16-character code in the `pass` field below.**
    //         Do NOT include any spaces when copying it.
    // 3.  **Less Secure App Access (Older/Deprecated Method for NO 2FA):**
    //     If you *do not* have 2FA enabled, you might have needed to enable "Less secure app access" in the past.
    //     Google is phasing this out, but if it's still an option for your account, you can check it at:
    //     `myaccount.google.com/lesssecureapps`. Ensure it's turned `ON`.
    // 4.  **Firewall/Network Issues:** Ensure your server's firewall or network settings aren't blocking
    //     outgoing connections on port 465 (SMTPS) or 587 (Submission) which Gmail uses.
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or 'Outlook', 'SendGrid', etc.
        auth: {
            user: 'juliannecyrille.jc@gmail.com', // Replace with your email address (e.g., 'your.email@gmail.com')
            pass: 'maimaiiloveyou21'  // Replace with your email password or the generated App password
        }
    });

    // Function to send email
    async function sendEmail(to, subject, htmlContent) {
        try {
            let info = await transporter.sendMail({
                from: '"Your Registrar Office" PLM', // Sender address
                to: to, // List of receivers
                subject: subject, // Subject line
                html: htmlContent, // html body
            });
            console.log("Backend: Message sent: %s", info.messageId);
            return true;
        } catch (error) {
            console.error("Backend: Error sending email:", error);
            return false;
        }
    }


    // API endpoint to test backend connectivity
    app.get('/server/test', (req, res) => {
      res.json({ message: 'Hello Welcome to the backend API!' });
    });

    // API endpoint to test database connection
    app.get('/database', async(req,res) => {
      try{
        const result = await pool.query('SELECT NOW()')
        res.json(result.rows[0])
      } catch (error) {
        console.error('Backend: Database Connection failed:', error);
        res.status(500).json({error:'Database Connection failed whawha'})
      }
    });

    // UPDATED API endpoint: Search student credentials by name and birthdate (exact match)
    app.get('/api/studentCredentials/search', async (req, res) => {
      const { firstName, lastName, middleName, birthDate } = req.query;
      console.log(`Backend: Searching student credentials for: ${firstName} ${middleName} ${lastName}, BirthDate: ${birthDate}`);

      // First name, last name, and birth date are required for search
      if (!firstName || !lastName || !birthDate) {
        return res.status(400).json({ error: 'First name, last name, and birth date are required for search.' });
      }

      try {
        // Convert input parameters to lowercase for case-insensitive comparison
        const lowerFirstName = firstName.toLowerCase();
        const lowerLastName = lastName.toLowerCase();
        const lowerMiddleName = middleName ? middleName.toLowerCase() : ''; // Handle null/empty middleName

        let query = `
          SELECT * FROM incoming.studentCredentials
          WHERE LOWER(firstName) = $1 AND LOWER(lastName) = $2 AND birthDate = $3
        `;
        let values = [lowerFirstName, lowerLastName, birthDate];
        let paramIndex = 4; // Start index for additional parameters

        // Only add middleName to the query if it is provided and not empty
        if (middleName && middleName.trim() !== '') {
          query += ` AND LOWER(middleName) = $${paramIndex}`;
          values.push(lowerMiddleName);
        } else {
            // If middleName is not provided or empty, ensure the DB field is null or empty
            query += ` AND (middleName IS NULL OR middleName = '')`;
        }

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
        res.status(500).json({ error: 'Internal server error', details: err.message });
      }
    });


    // API endpoint to get all requested forms (example)
    app.get('/api/incoming.requestForm', async (req, res) => {
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

    // POST: Save applicant form data (main request)
    app.post('/api/incoming.requestForm', async (req, res) => {
      try {
        console.log('Backend: 📥 Incoming requestForm payload:', req.body);

        const {
          formRequestId,
          studentNumber, firstName, lastName, middleName, degreeProgram,
          selectedCollege, ayAdmitted, semAdmitted, graduationDate,
          birthDate, // Corrected to camelCase to match frontend state
          phoneNumber, emailAddress,
          streetName, barangay, municipality, province,
          purposeOfRequest,
          // NEW: Destructure the new fields from the frontend payload for email generation
          selectedDocumentsForEmail,
          calculatedDocStampAmount,
          finalTotalAmountDue
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
            -- Note: selectedDocumentsForEmail, calculatedDocStampAmount, finalTotalAmountDue are not stored in requestForm table.
            -- They are used only for email generation.
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

        console.log('Backend: ✅ Request Form inserted, ID:', result.rows[0].formrequestid);

        // --- Email Sending Logic ---
        const userEmail = emailAddress; // User's email from the form
        const cashierEmail = 'cashier@example.com'; // Replace with actual cashier email
        const fullUserName = `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`;

        // Get current date for "Date Generated"
        const dateGenerated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // Construct the document details table for the email
        let documentDetailsTableHtml = `
            <table style="width:100%; border-collapse: collapse; margin-top: 15px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Document Type</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;

        selectedDocumentsForEmail.forEach(doc => {
            documentDetailsTableHtml += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">
                        ${doc.documentType}
                        ${doc.specificSubject ? ` (Subject: ${doc.specificSubject})` : ''}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${doc.quantity}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">P${doc.totalAmount.toFixed(2)}</td>
                </tr>
            `;
        });

        // Add Doc Stamp row if applicable
        if (calculatedDocStampAmount > 0) {
            documentDetailsTableHtml += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">Doc Stamp</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${(calculatedDocStampAmount / 30).toFixed(0)}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">P${calculatedDocStampAmount.toFixed(2)}</td>
                </tr>
            `;
        }

        documentDetailsTableHtml += `
                </tbody>
            </table>
        `;

        // User Email Content (resembling the receipt)
        const userEmailSubject = `Official Payment Receipt - Document Request ${formRequestId}`;
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #eee; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="https://placehold.co/100x100/A00000/FFFFFF?text=PLM%20Logo" alt="PLM Logo" style="max-width: 80px; margin-bottom: 10px;">
                    <p style="margin: 0; font-size: 14px; color: #555;">PAMANTASAN NG LUNGSOD NG MAYNILA</p>
                    <p style="margin: 0; font-size: 12px; color: #777;">University of the City of Manila</p>
                    <p style="margin: 0; font-size: 12px; color: #777;">Intramuros, Manila</p>
                    <h2 style="color: #333; margin-top: 20px;">OFFICIAL PAYMENT RECEIPT</h2>
                </div>

                <div style="margin-bottom: 15px;">
                    <p style="margin: 5px 0;"><strong>RECEIPT NO.:</strong> ${formRequestId}</p>
                    <p style="margin: 5px 0;"><strong>DATE GENERATED:</strong> ${dateGenerated}</p>
                </div>

                <h3 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px;">RECEIPT DETAILS</h3>
                ${documentDetailsTableHtml}

                <div style="margin-top: 20px; text-align: right; font-size: 1.1em;">
                    <p style="margin: 5px 0;"><strong>TOTAL AMOUNT DUE: P${finalTotalAmountDue.toFixed(2)}</strong></p>
                </div>

                <div style="margin-top: 40px; text-align: center; font-size: 0.9em; color: #777;">
                    <p style="margin: 5px 0;">Thank you for your payment!</p>
                    <p style="margin: 5px 0;">Please keep this receipt for your records.</p>
                </div>

                <div style="margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px; text-align: center; font-size: 0.8em; color: #999;">
                    <p>For inquiries, please contact the Office of the University Registrar at +(632) 85284574 or registrar@plm.edu.ph.</p>
                </div>
            </div>
        `;

        // Cashier Email Content (can remain simpler or be updated similarly)
        const cashierEmailSubject = `New Document Request Submitted - ${formRequestId}`;
        const cashierEmailHtml = `
            <p>Dear Cashier,</p>
            <p>A new document request has been submitted:</p>
            <ul>
                <li><strong>Reference No.:</strong> ${formRequestId}</li>
                <li><strong>Applicant Name:</strong> ${fullUserName}</li>
                <li><strong>Student Number:</strong> ${studentNumber}</li>
                <li><strong>Email:</strong> ${emailAddress}</li>
                <li><strong>Phone:</strong> ${phoneNumber}</li>
                <li><strong>Total Amount Due:</strong> P${finalTotalAmountDue.toFixed(2)}</li>
            </ul>
            <p><strong>Requested Documents:</strong></p>
            ${documentDetailsTableHtml}
            <p>Please check the system for full details and payment processing.</p>
            <p>Thank you.</p>
        `;

        // Send emails asynchronously, but don't block the response
        sendEmail(userEmail, userEmailSubject, userEmailHtml);
        sendEmail(cashierEmail, cashierEmailSubject, cashierEmailHtml);
        // --- End Email Sending Logic ---

        res.json({
          message: 'Request form saved successfully! Emails sent.',
          requestId: result.rows[0].formrequestid
        });

      } catch (error) {
        console.error('Backend: ❌ Unexpected backend error during requestForm insertion:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      }
    });


    // POST: Save individual requested documents
    app.post('/api/incoming.documentRequested', async (req, res) => {
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
        let parsedAttachmentFile;
        try {
            parsedAttachmentFile = JSON.parse(attachmentFile);
            console.log('Backend:   attachmentFile (parsed JSON):', parsedAttachmentFile);
            console.log('Backend:   Type of attachmentFile (parsed):', typeof parsedAttachmentFile);
            console.log('Backend:   Is parsedAttachmentFile an array?', Array.isArray(parsedAttachmentFile));
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


    // POST: Save receipt details submission with file upload
    app.post('/api/incoming.receiptDetailsSubmission', upload.single('originalReceipt'), async (req, res) => {
      console.log('Backend: Received request for receipt details submission.');
      console.log('Backend: req.file for originalReceipt:', req.file);

      const {
        orNumber, // Actual OR number from user input
        formRequestId, // Foreign key linking to the main requestform
        firstName,
        lastName,
        middleName,
        studentNumber,
        dateOfPayment // ADDED: Destructure dateOfPayment from req.body
      } = req.body; // Text fields are in req.body when using multer

      // --- ADDED LOGS HERE ---
      console.log(`Backend: Receipt submission received for formRequestId: ${formRequestId}`);
      console.log(`Backend: Received dateOfPayment: ${dateOfPayment}`);


      // Construct the web-accessible URL for the receipt using the dynamically determined IP
      const originalReceiptFileUrl = req.file ? `http://${serverIp}:${port}/uploads/${req.file.filename}` : null;
      console.log('Backend: Received originalReceiptFileUrl for receiptDetailsSubmission:', originalReceiptFileUrl);
      console.log('Backend: Type of originalReceiptFileUrl:', typeof originalReceiptFileUrl);


      if (!originalReceiptFileUrl) {
        console.error('Backend: No original receipt file found in request.');
        return res.status(400).json({ error: 'No receipt file uploaded.' });
      }

      try {
        // Fetch ALL relevant document types and IDs for documents associated with this formRequestId
        const documentsQuery = `
          SELECT
            documentid,  -- Changed to lowercase
            documenttype, -- Changed to lowercase
            quantity,
            totalamount,
            "specificSubject"
          FROM incoming.documentRequested
          WHERE formrequestid = $1; -- Changed to lowercase
        `;
        console.log(`Backend: Querying documentRequested for formRequestId: ${formRequestId}`);
        const documentsResult = await pool.query(documentsQuery, [formRequestId]);
        const requestedDocuments = documentsResult.rows; // This will be an array of objects

        console.log('Backend: Concatenated document types and IDs into comma-separated strings');
        const documentTypesString = requestedDocuments.map(doc => doc.documenttype).join(', '); // Use lowercase property name
        const documentIdsString = requestedDocuments.map(doc => doc.documentid).join(', ');     // Use lowercase property name

        console.log('Backend: Concatenated documentTypesString:', documentTypesString);
        console.log('Backend: Concatenated documentIdsString:', documentIdsString);


        const query = `
          INSERT INTO incoming.receiptDetailsSubmission (
            orNumber, formRequestId, firstName, lastName, middleName, studentNumber, originalReceipt,
            documenttype, -- This column will store concatenated document types
            documentid,   -- This column will store concatenated document IDs
            dateOfPayment
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING orNumber;
        `;
        const values = [
          orNumber, formRequestId, firstName, lastName, middleName,
          studentNumber, originalReceiptFileUrl,
          documentTypesString, // Store concatenated document types
          documentIdsString,   // Store concatenated document IDs
          dateOfPayment
        ];
        console.log('Backend: Values for receiptDetailsSubmission insertion:', values);

        const result = await pool.query(query, values);
        console.log('Backend: Receipt details saved successfully! orNumberId:', result.rows[0].orNumber, 'FilePath:', originalReceiptFileUrl);
        res.status(200).json({ message: 'Receipt details saved!', orNumber: result.rows[0].orNumber, filePath: originalReceiptFileUrl });
      } catch (error) {
        console.error('Backend: Error saving receipt details submission:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
      }
    });

    // NEW API endpoint: Fetch document types by formRequestId (from previous request)
    app.get('/api/incoming.documentTypesByRequestId/:formRequestId', async (req, res) => {
      const { formRequestId } = req.params;
      try {
        console.log(`Backend: Fetching document types for formRequestId: ${formRequestId}`);
        const query = `
          SELECT documentid, documenttype, quantity, totalamount, "specificSubject" -- Corrected casing
          FROM incoming.documentRequested
          WHERE formrequestid = $1; -- Corrected casing
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


    // Start the server
    app.listen(port, () => {
      console.log(`Server listening at http://${serverIp}:${port}`);
    });