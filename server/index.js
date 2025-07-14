// index.js (Backend Server)

const express = require('express');
const cors = require('cors');
const path = require('path');
const port = 5000;
const pool = require('./database'); // Import the PostgreSQL connection pool
const app = express();


app.use(cors()); // Enable CORS for development
app.use(express.json()); // For parsing JSON request bodies

// Serve static files from the 'dist' directory (if building a production frontend)
app.use(express.static(path.join(__dirname, 'dist')));

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
    console.error('Database Connection failed:', error);
    res.status(500).json({error:'Database Connection failed whawha'})
  }
});

// API endpoint to get all requested forms (example)
app.get('/api/incoming.requestForm', async (req, res) => {
  try {
    // Assuming 'requestform' is your table name for main requests
    const result = await pool.query('SELECT * FROM incoming.requestForm'); 
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query for requestForms:', err.stack);
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
    console.error('Error executing query for specific requestForm:', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST: Save applicant form data (main request)
app.post('/api/incoming.requestForm', async (req, res) => {
  try {
    console.log('📥 Incoming requestForm payload:', req.body);

    const {
      formRequestId,
      studentNumber, firstName, lastName, middleName, degreeProgram,
      selectedCollege, ayAdmitted, semAdmitted, graduationDate,
      phoneNumber, emailAddress,
      streetName, barangay, municipality, province,
      purposeOfRequest
    } = req.body;

        // Check for existing request
    const existing = await pool.query(
      'SELECT formRequestId FROM incoming.requestForm WHERE studentNumber = $1',
      [studentNumber]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: 'A request with this student number already exists.',
        formRequestId: existing.rows[0].formrequestid
      });
    }

    const query = `
      INSERT INTO incoming.requestForm (
        formRequestId,
        studentNumber, firstName, lastName, middleName, degreeProgram,
        selectedCollege, ayAdmitted, semAdmitted, graduationDate,
        phoneNumber, emailAddress,
        streetName, barangay, municipality, province,
        purposeOfRequest
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING studentNumber, formRequestId;
    `;

    const values = [
      formRequestId,
      studentNumber, firstName, lastName, middleName, degreeProgram,
      selectedCollege, ayAdmitted, semAdmitted, graduationDate,
      phoneNumber, emailAddress, streetName, barangay, municipality, province,
      purposeOfRequest
    ];

    const result = await pool.query(query, values);

    console.log('✅ Request Form inserted, ID:', result.rows[0].formrequestid);
    res.json({
      message: 'Request form saved successfully!',
      requestId: result.rows[0].formrequestid
    });

  } catch (error) {
    console.error('❌ Unexpected backend error:', error);
    res.status(500).json({ error: 'Unexpected internal server error' });
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
    attachmentFile, // Placeholder for file path/name
    totalAmount, // Total for this specific document (unitPrice * quantity)
  } = req.body;

  try {
    const documentId = `DOC${Math.floor(100000 + Math.random() * 900000)}`;
    const query = `
      INSERT INTO incoming.documentRequested (documentId,
        formRequestId, studentNumber, firstName, lastName, middleName, degreeProgram, ayAdmitted, semAdmitted, documentType, unitPrice, quantity, attachmentFile, totalAmount
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING documentId;
    `;
    const values = [documentId,
      formRequestId, studentNumber, firstName, lastName, middleName,
      degreeProgram, ayAdmitted, semAdmitted, documentType,
      unitPrice, quantity, attachmentFile, totalAmount
    ];
    const result = await pool.query(query, values);
    res.json({ message: 'Document saved!', documentId: result.rows[0].documentid });
    console.log('➡️ formRequestId received:', formRequestId);

    } catch (error) {
        console.error('Error saving document requested:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

// POST: Save receipt details submission
app.post('/api/incoming.receiptDetailsSubmission', async (req, res) => {
  const {
    orNumber, // Actual OR number from user input
    formRequestId, // Foreign key linking to the main requestform (or a new request if standalone)
    firstName,
    lastName,
    middleName,
    studentNumber,
    originalReceipt // Placeholder for file path/name
  } = req.body;

  try {
    const query = `
      INSERT INTO incoming.receiptDetailsSubmission (
        orNumber, formRequestId, firstName, lastName, middleName, studentNumber, originalReceipt
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING or_number_id;
    `;
    const values = [
      orNumber, formRequestId, firstName, lastName, middleName,
      studentNumber, originalReceipt
    ];
    const result = await pool.query(query, values);
    res.status(200).json({ message: 'Receipt details saved!', orNumberId: result.rows[0].or_number_id });
  } catch (error) {
    console.error('Error saving receipt details submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
