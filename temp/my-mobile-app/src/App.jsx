

// App.jsx (Frontend React App)

import React, { useState, useEffect } from 'react';
import Header from './components/Header/Header.jsx';
import DatePicker from './components/DatePicker/DatePicker.jsx'; 
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/server/test')
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMsg(data.message);
        console.log("Backend message:", data.message);
      })
      .catch(error => {
        console.error("Error fetching from backend:", error);
        setMsg("Failed to connect to backend.");
      });
  }, []);
  
  const [activeForm, setActiveForm] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1); 

  // Form 1 states (Applicant's Information)
  const [studentNumber, setStudentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [selectedCollege, setSelectedCollege] = useState(''); 
  const [ayAdmitted, setAyAdmitted] = useState('');
  const [semAdmitted, setSemAdmitted] = useState('');
  const [graduationDate, setGraduationDate] = useState(null);

  // Contact Information states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [landline, setLandline] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [viber, setViber] = useState('');

  // Permanent Address states
  const [streetNumber, setStreetNumber] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [province, setProvince] = useState('');

  // Purpose of Request states
  const [purposeTorEvaluation, setPurposeTorEvaluation] = useState(false);
  const [purposeTorBoardExam, setPurposeTorBoardExam] = useState(false);
  const [purposeTorEmployment, setPurposeTorEmployment] = useState(false);
  const [purposeTorFurtherStudies, setPurposeTorFurtherStudies] = useState(false);
  const [purposeTorFurtherStudiesText, setPurposeTorFurtherStudiesText] = useState('');
  const [purposeCertificationsText, setPurposeCertificationsText] = useState('');

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  // const [showYearSelector, setShowYearSelector] = useState(false); // Not used in provided DatePicker

  // Form 2 states (Document Request)
  const [selectedDocuments, setSelectedDocuments] = useState({}); 
  const [totalAmount, setTotalAmount] = useState(0);
  const [transactionRef, setTransactionRef] = useState(''); // To store the generated transaction reference

  // Transaction Summary State
  const [transactionDetails, setTransactionDetails] = useState(null);

  // Data Privacy for Graduate/Alumni
  const [showGraduatePrivacy, setShowGraduatePrivacy] = useState(false);
  const [graduatePrivacyAgreed, setGraduatePrivacyAgreed] = useState(false);

  // Access Code for specific documents
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState('');
  const [accessCodeError, setAccessCodeError] = useState('');
  const [pendingSubmit, setPendingSubmit] = useState(false);

  // Original Receipt Submission Form states
  const [orStudentNumber, setOrStudentNumber] = useState('');
  const [orFirstName, setOrFirstName] = useState('');
  const [orLastName, setOrLastName] = useState('');
  const [orMiddleName, setOrMiddleName] = useState('');
  const [orReferenceNo, setOrReferenceNo] = useState(''); // This will be the transactionRef for OR submission
  const [orNumberInput, setOrNumberInput] = useState('');
  const [uploadReceiptFile, setUploadReceiptFile] = useState(null); // For the actual file object

  // Data for Colleges and Degree Programs
  const collegesAndPrograms = {
    "College of Accountancy": ["Bachelor of Science in Accountancy"],
    "College of Architecture And Sustainable Built Environments": ["Bachelor of Science in Architecture"],
    "College of Business Administration": [
      "Bachelor of Science in Entrepreneurship",
      "Bachelor of Science in Real Estate Management",
      "Bachelor of Science in Business Administration Major in Business Economics",
      "Bachelor of Science in Business Administration Major in Financial Management",
      "Bachelor of Science in Business Administration Major in Human Resource Management",
      "Bachelor of Science in Business Administration Major in Marketing Management",
      "Bachelor of Science in Business Administration Major in Operations Management",
      "Doctor of Business Administration",
      "Master in Business Administration"
    ],
    "College of Engineering": [
      "Bachelor of Science in Civil Engineering",
      "Bachelor of Science in Civil Engineering with Specialization in Construction Management",
      "Bachelor of Science in Civil Engineering with Specialization in Structural Engineering",
      "Bachelor of Science in Chemical Engineering",
      "Bachelor of Science in Computer Engineering",
      "Bachelor of Science in Electronics Engineering",
      "Bachelor of Science in Electrical Engineering",
      "Bachelor of Science in Mechanical Engineering",
      "Bachelor of Science in Manufacturing Engineering",
      "Master of Engineering with Specialization in Computer Engineering",
      "Master of Engineering Management with Specialization in Construction Management",
      "Master of Engineering with Specialization in Structural Engineering",
      "Master of Science in Management Engineering"
    ],
    "College of Education": [
      "Bachelor of Early Childhood Education",
      "Bachelor of Elementary Education",
      "Bachelor of Physical Education",
      "Bachelor of Secondary Education major in English",
      "Bachelor of Secondary Education major in Filipino",
      "Bachelor of Secondary Education major in Mathematics",
      "Bachelor of Secondary Education major in Sciences",
      "Bachelor of Secondary Education major in Social Studies",
      "Bachelor of Special Needs Education",
      "Professional Education",
      "Master of Arts in Education - Biological Sciences",
      "Master of Arts in Education in Education Administration",
      "Master of Arts in Education Major in Chemistry",
      "Master of Arts in Education Major in Educational Management and Leadership",
      "Master of Arts in Education Major in Mathematics Education",
      "Master of Arts in Education Major in Physics",
      "Master of Arts in Education Major in Social Sciences",
      "Master of Arts in Special Education with Specialization in Development Delays",
      "Doctor of Education in Education Administration",
      "Doctor of Education in Educational Management and Leadership"
    ],
    "College of Humanities, Arts And Social Sciences": [
      "Bachelor of Arts in Communication",
      "Bachelor of Arts in Communication with Specialization in Public Relations",
      "Bachelor of Music in Music Performance",
      "Bachelor of Science in Social Work",
      "Master of Arts in Communication Management",
      "Bachelor in Mass Communication",
      "Master of Social Work"
    ],
    "College of Information System And Technology Management": [
      "Bachelor of Science in Computer Science",
      "Bachelor of Science in Information Technology",
      "Master of Science In Information And Communications Technology",
      "Doctor of Information Technology"
    ],
    "College of Nursing": [
      "Bachelor of Science in Nursing",
      "Master of Arts in Nursing"
    ],
    "College of Public Administration": [
      "Bachelor of Science in Public Administration",
      "Master of Public Administration",
      "Doctor of Public Administration"
    ],
    "College of Physical Therapy": [
      "Bachelor of Science in Physical Therapy",
      "Master of Science in Physical Therapy"
    ],
    "College of Science": [
      "Bachelor of Science in Chemistry",
      "Bachelor of Science in Mathematics",
      "Bachelor of Science in Psychology",
      "Bachelor of Science in Biology Major in Cell and Molecular Biology",
      "Bachelor of Science in Biology Major in Ecology",
      "Bachelor of Science in Biology Major in Medical Biology",
      "Master of Arts in Psychology - Clinical Psychology",
      "Master of Arts in Psychology - Industrial Psychology"
    ],
    "College of Tourism And Hospitality Management": [
      "Bachelor of Science In Hospitality Management",
      "Bachelor of Science in Tourism Management"
    ],
    "College of Law": ["Juris Doctor"],
    "College of Medicine": ["Doctor of Medicine"],
    "School of Public Health": ["Master of Public Health"],
    "Graduate School of Law": ["Master of Laws"]
  };

  // Data for Document Details including pricing, messages, and attachments
  const documentDetails = {
    "Certificate of Candidacy for Graduation": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Enrollment": {
      "BACHELOR PROGRAM": { amount: 146, message: null, attachments: ["Printed SER"] },
      "MEDICINE": { amount: 146, message: null, attachments: ["Printed SER"] }
    },
    "CTC of SER": {
      "BACHELOR PROGRAM": { amount: 146, message: null, attachments: ["Printed SER"] },
      "MEDICINE": { amount: 146, message: null, attachments: ["Printed SER"] }
    },
    "Certificate of Grades": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Grades with GWA": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Units Earned": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Medium of Instruction": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of NSTP Serial No. (ROTC/CWTS)": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Course Description (All subjects taken)": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Course Description (Specific Subject Only)": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Course Syllabus": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "CTC of F137": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [] }
    },
    "Replacement of ID": {
      "BACHELOR PROGRAM": { amount: 100, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Affidavit of Loss (notarized)", attachments: [] },
      "MEDICINE": { amount: 100, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Affidavit of Loss (notarized)", attachments: [] }
    },
    "Transfer out/Honorable Dismissal": {
      "BACHELOR PROGRAM": { amount: 512, message: "Please see PLM Registrar Office \n and submit the following documents: \n \n 1. PLM/Student ID \n 2. 1.5 x 1.5 ID picture \n 3. Endorsement Letter from College \n 4. Clearance Form with complete signatures \n \n Payment Inclusions: \n Certificate of Grades \n Transcript of Records", attachments: [] },
      "MEDICINE": { amount: 512, message: "Please see PLM Registrar Office \n and submit the following documents: \n \n 1. PLM/Student ID \n 2. 1.5 x 1.5 ID picture \n 3. Endorsement Letter from College \n 4. Clearance Form with complete signatures  \n \n Payment Inclusions: \n Certificate of Grades \n Transcript of Records", attachments: []}
    },
    "Transcript of Record for Employment": {
      "BACHELOR PROGRAM": { amount: 220, message: "Please see PLM Registrar Office \n and submit the following documents: \n \n 1. PLM/Student ID or Affidavit of Loss (if loss ID) \n 2. 1.5 x 1.5 ID picture \n 3. Endorsement Letter from College \n 4. Clearance Form with complete signatures", attachments: [] },
      "MEDICINE": { amount: 220, message: "Please see PLM Registrar Office \n and submit the following documents: \n \n 1. PLM/Student ID or Affidavit of Loss (if loss ID) \n 2. 1.5 x 1.5 ID picture \n 3. Endorsement Letter from College \n 4. Clearance Form with complete signatures", attachments: []},
      "Student PT, Engr, Nursing, Arch, IT, CS": { amount: 241, message: "Please see PLM Registrar Office \n and submit the following documents: \n \n 1. PLM/Student ID or Affidavit of Loss (if loss ID) \n 2. 1.5 x 1.5 ID picture \n 3. Endorsement Letter from College \n 4. Clearance Form with complete signatures", attachments: [] }
    },
    "CAV for Abroad or DFA/CHED Authentication (Undergraduate - 2017 - Below)": {
      "BACHELOR PROGRAM": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "MEDICINE": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] }
    },
    "CAV for Abroad or DFA/CHED Authentication (Undergraduate - 2018 - Present)": {
      "BACHELOR PROGRAM": { amount: 584, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "MEDICINE": { amount: 584, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: []}
    },

    "CAV for Board Exam (Graduate - 2017 - Below)": {
      "Bachelor Program": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Medicine": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Grad School Program": { amount: 1095, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] }
    },
    "CAV for Board Exam (Graduate - 2018 - Present)": {
      "Bachelor Program": { amount: 584, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Medicine": { amount: 584, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Grad School Program": { amount: 876, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] }
    },
    "CAV for Abroad or DFA/CHED Authentication (Graduate - 2017 - Below)": {
      "Bachelor Program": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Medicine": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Grad School Program": { amount: 1095, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] }
    },
    
    "CAV for Abroad or DFA/CHED Authentication (Graduate - 2018 - Present)": {
      "Bachelor Program": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] },
      "Medicine": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)",  attachments: [] },
      "Grad School Program": { amount: 1095, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)", attachments: [] }
    },
    "Transcript of Records": {
      "Bachelor Program": { amount: 220, message: null, attachments: ["1.5 X 1.5 White Background w/ Nametag"] },
      "Medicine": { amount: 220, message: null, attachments: ["1.5 X 1.5 White Background w/ Nametag"] },
      "Grad School Program": { amount: 330, message: null, attachments: ["1.5 X 1.5 White Background w/ Nametag"] },
      "Student PT, Engr, Nursing, Arch, IT, CS": { amount: 241, message: null, attachments: ["1.5 X 1.5 White Background w/ Nametag"] }
    },
    "Certified True Copy of TOR": {
      "Bachelor Program": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Original copy of Diploma (to be presented upon request)\n 2. Photocopy of Original Diploma", attachments: [] },
      "Medicine": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Original copy of Diploma (to be presented upon request)\n 2. Photocopy of Original Diploma", attachments: [] },
      "Grad School Program": { amount: 219, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Original copy of Diploma (to be presented upon request)\n 2. Photocopy of Original Diploma", attachments: [] }
    },
    "CTC of Diploma": {
      "Bachelor Program": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Original copy of Diploma (to be presented upon request)\n 2. Photocopy of Original Diploma", attachments: [] },
      "Medicine": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Original copy of Diploma (to be presented upon request)\n 2. Photocopy of Original Diploma", attachments: [] },
      "Grad School Program": { amount: 219, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Original copy of Diploma (to be presented upon request)\n 2. Photocopy of Original Diploma", attachments: [] }
    },
    "Certificate of Graduation with special paper for loss diploma": {
      "Bachelor Program": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Notarized Affidavit of Loss (form is accessible at registrar office)", attachments: [] },
      "Medicine": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Notarized Affidavit of Loss (form is accessible at registrar office)", attachments: [] },
      "Grad School Program": { amount: 219, message: null, downloads: ["OUR Affidavit Form"], attachments: ["Notarized Affidavit of Loss", "OUR Affidavit Form"] }
    },
    "Certificate of Graduation": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Graduation w/ Latin Honor": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Medium of Instruction (Graduate)": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Units Earned (Graduate)": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of GWA": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of NSTP ROTC/CWTS": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Course Description (All subjects)": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: null, attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Course Description (Specific Subject Only)": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: null, attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Course Syllabus": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Completion": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of Ranking": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Certificate of No Objection": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "English Translation of Diploma": {
      "Bachelor Program": { amount: 96, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Photocopy of Tagalog Diploma \n 2. Original copy of Tagalog Diploma (to be presented upon request)", attachments: [] },
      "Medicine": { amount: 96, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Photocopy of Tagalog Diploma \n 2. Original copy of Tagalog Diploma (to be presented upon request)", attachments: [] },
      "Grad School Program": { amount: 96, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Photocopy of Tagalog Diploma \n 2. Original copy of Tagalog Diploma (to be presented upon request)", attachments: [] }
    },
    "Honorable Dismissal / Original TOR for other school / Transfer Credentials": {
      "Bachelor Program": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Request Letter (from other school)\n \n NOTE: Transfer Credentials can only be issued ONCE. Any subsequent requests will NOT be processed, and you will be notified via email accordingly.", attachments: [] },
      "Medicine": { amount: 146, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Request Letter (from other school)\n \n NOTE: Transfer Credentials can only be issued ONCE. Any subsequent requests will NOT be processed, and you will be notified via email accordingly.", attachments: [] },
      "Grad School Program": { amount: 219, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Request Letter (from other school)\n \n NOTE: Transfer Credentials can only be issued ONCE. Any subsequent requests will NOT be processed, and you will be notified via email accordingly.", attachments: [] }
    },
    "CTC F137 (Graduate)": {
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [] }
    },
    "Company Verification": {
      "Bachelor Program": { amount: 300, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 300, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 300, message: "No other attachment needed.", attachments: [] }
    },
    "First Copy of TOR": {
      "Bachelor Program": { amount: "FREE", message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: "FREE", message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: "FREE", message:"No other attachment needed.", attachments: [] }
    },
    "Doc Stamp": {
      "Bachelor Program": { amount: 30, message: "No other attachment needed.", attachments: [] },
      "Medicine": { amount: 30, message: "No other attachment needed.", attachments: [] },
      "Grad School Program": { amount: 30, message: "No other attachment needed.", attachments: [] }
    },
  };

  const isDiploma = (docName) => docName.toLowerCase().includes('diploma');

  // Count how many non-diploma documents are selected for Doc Stamp
  const docStampCount = Object.keys(selectedDocuments).filter(docName => !isDiploma(docName)).length;
  const docStampAmount = docStampCount * 30;

  // Helper to determine program type based on college, degree, and active form
  const getProgramType = (college, degree, activeForm, documentName) => {
    if (documentName === "Transcript of Records" && activeForm === 'graduate') {
      if (college === "College of Physical Therapy" && degree === "Bachelor of Science in Physical Therapy") {
        return "Student PT, Engr, Nursing, Arch, IT, CS";
      }
      if (college === "College of Engineering" && (
          degree === "Bachelor of Science in Civil Engineering" ||
          degree === "Bachelor of Science in Civil Engineering with Specialization in Construction Management" ||
          degree === "Bachelor of Science in Civil Engineering with Specialization in Structural Engineering" ||
          degree === "Bachelor of Science in Chemical Engineering" ||
          degree === "Bachelor of Science in Computer Engineering" ||
          degree === "Bachelor of Science in Electronics Engineering" ||
          degree === "Bachelor of Science in Electrical Engineering" ||
          degree === "Bachelor of Science in Mechanical Engineering" ||
          degree === "Bachelor of Science in Manufacturing Engineering"
      )) {
        return "Student PT, Engr, Nursing, Arch, IT, CS";
      }
      if (college === "College of Nursing" && degree === "Bachelor of Science in Nursing") {
        return "Student PT, Engr, Nursing, Arch, IT, CS";
      }
      if (college === "College of Architecture And Sustainable Built Environments" && degree === "Bachelor of Science in Architecture") {
        return "Student PT, Engr, Nursing, Arch, IT, CS";
      }
      if (college === "College of Information System And Technology Management" && (
          degree === "Bachelor of Science in Information Technology" ||
          degree === "Bachelor of Science in Computer Science"
      )) {
        return "Student PT, Engr, Nursing, Arch, IT, CS";
      }
    }

    if (college === "College of Medicine") {
      return "Medicine";
    }
    if (activeForm === 'graduate') {
      if (college === "Graduate School of Law" || college === "School of Public Health") {
        return "Grad School Program";
      }
      const gradSchoolDegrees = [
        "Doctor of Business Administration", "Master in Business Administration",
        "Master of Engineering with Specialization in Computer Engineering",
        "Master of Engineering Management with Specialization in Construction Management",
        "Master of Engineering with Specialization in Structural Engineering",
        "Master of Science in Management Engineering",
        "Master of Arts in Education - Biological Sciences",
        "Master of Arts in Education in Education Administration",
        "Master of Arts in Education Major in Chemistry",
        "Master of Arts in Education Major in Educational Management and Leadership",
        "Master of Arts in Education Major in Mathematics Education",
        "Master of Arts in Education Major in Physics",
        "Master of Arts in Education Major in Social Sciences",
        "Master of Arts in Special Education with Specialization in Development Delays",
        "Doctor of Education in Education Administration",
        "Doctor of Education in Educational Management and Leadership",
        "Master of Arts in Communication Management", "Master of Social Work",
        "Master of Science In Information And Communications Technology", "Doctor of Information Technology",
        "Master of Arts in Nursing",
        "Master of Public Administration", "Doctor of Public Administration",
        "Master of Science in Physical Therapy",
        "Master of Arts in Psychology - Clinical Psychology", "Master of Arts in Psychology - Industrial Psychology",
        "Master of Laws"
      ];
      if (gradSchoolDegrees.includes(degree)) {
        return "Grad School Program";
      }
      return "Bachelor Program";
    }
    return "BACHELOR PROGRAM";
  };

  const handleUndergraduateClick = () => {
    setActiveForm('undergraduate');
    setCurrentPage(1);
    setShowDatePicker(false);
  };

  const handleGraduateAlumniClick = () => {
    setShowGraduatePrivacy(true);
    setGraduatePrivacyAgreed(false);
    setActiveForm(null);
  };

  const handleGraduatePrivacyAgree = () => {
    setShowGraduatePrivacy(false);
    setGraduatePrivacyAgreed(true);
    setActiveForm('graduate');
    setCurrentPage(1);
    setShowDatePicker(false);
  };

  const handleSubmitOriginalReceiptClick = () => {
    setActiveForm('originalReceipt');
    setCurrentPage(1);
    setShowDatePicker(false);
  };

  const closeForm = () => {
    setActiveForm(null);
    setCurrentPage(1);
    // Clear all form data states
    setStudentNumber('');
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setDegreeProgram('');
    setSelectedCollege('');
    setAyAdmitted('');
    setSemAdmitted('');
    setGraduationDate(null);
    setPhoneNumber('');
    setLandline('');
    setEmailAddress('');
    setViber('');
    setStreetNumber('');
    setBarangay('');
    setMunicipality('');
    setProvince('');
    setPurposeTorEvaluation(false);
    setPurposeTorBoardExam(false);
    setPurposeTorEmployment(false);
    setPurposeTorFurtherStudies(false);
    setPurposeTorFurtherStudiesText('');
    setPurposeCertificationsText('');
    setSelectedDocuments({});
    setTotalAmount(0);
    setTransactionRef('');
    setShowDatePicker(false);
    setTransactionDetails(null);
    setOrStudentNumber('');
    setOrFirstName('');
    setOrLastName('');
    setOrMiddleName('');
    setOrReferenceNo('');
    setOrNumberInput('');
    setUploadReceiptFile(null);
  };

  const handleNextPage = () => {
    // Basic validation for Page 1 fields
    if (!firstName || !lastName || !middleName || !selectedCollege || !degreeProgram || !phoneNumber || !emailAddress || !streetNumber || !barangay || !municipality || !province) {
      alert('Please fill in all required fields (marked with *) before proceeding.');
      return;
    }
    if (activeForm === 'graduate' && !graduationDate) {
      alert('Please select a graduation date for graduate/alumni requests.');
      return;
    }
    if (purposeTorFurtherStudies && !purposeTorFurtherStudiesText.trim()) {
      alert('Please specify the College/University for further studies purpose.');
      return;
    }
    if (!purposeTorEvaluation && !purposeTorBoardExam && !purposeTorEmployment && !purposeTorFurtherStudies && !purposeCertificationsText.trim()) {
      alert('Please select at least one purpose for your request or specify a certification.');
      return;
    }

    setCurrentPage(2);
  };

  const handleBackToPage1 = () => {
    setCurrentPage(1);
  };

  const handleDateInputClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleClearDate = (e) => {
    e.stopPropagation();
    setGraduationDate(null);
    setShowDatePicker(false);
  };

  const handleDateSelect = (day) => {
    if (day === null) return;
    const newDate = new Date(currentYear, currentMonth, day);
    setGraduationDate(newDate);
    setShowDatePicker(false);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 0) {
        setCurrentYear(prevYear => prevYear - 1);
        return 11;
      }
      return prevMonth - 1;
    });
  };

  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 11) {
        setCurrentYear(prevYear => prevYear + 1);
        return 0;
      }
      return prevMonth + 1;
    });
  };

  const generateDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    const firstDayIndex = date.getDay();
    const numDaysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }

    for (let i = 1; i <= numDaysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysInCalendar = generateDaysInMonth(currentMonth, currentYear);

  const undergraduateDocuments = [
    "Certificate of Candidacy for Graduation",
    "Certificate of Enrollment",
    "CTC of SER",
    "Certificate of Grades",
    "Certificate of Grades with GWA",
    "Transfer out/Honorable Dismissal",
    "Certificate of Course Description (All subjects taken)",
    "Certificate of Course Description (Specific Subject Only)",
    "Certificate of NSTP Serial No. (ROTC/CWTS)",
    "Certificate of Units Earned",
    "Certificate of Medium of Instruction",
    "CTC of F137",
    "Replacement of ID",
    "Transcript of Record for Employment",
    "CAV for Abroad or DFA/CHED Authentication (Undergraduate - 2017 - Below)",
    "CAV for Abroad or DFA/CHED Authentication (Undergraduate - 2018 - Present)",
    "Certificate of Course Syllabus"
    ];

  const graduateAlumniDocuments = [
    "First Copy of TOR",
    "Transcript of Records",
    "Certified True Copy of TOR",
    "Certificate of Graduation",
    "Certificate of Graduation w/ Latin Honor",
    "Certificate of Graduation with special paper for loss diploma",
    "Certificate of GWA",
    "CTC of Diploma",
    "Certificate of Units Earned (Graduate)",
    "Certificate of Medium of Instruction (Graduate)",
    "CAV for Board Exam (Graduate - 2017 - Below)",
    "CAV for Board Exam (Graduate - 2018 - Present)",
    "CAV for Abroad or DFA/CHED Authentication (Graduate - 2017 - Below)",
    "CAV for Abroad or DFA/CHED Authentication (Graduate - 2018 - Present)",
    "CTC F137 (Graduate)",
    "Certificate of Completion",
    "Certificate of Ranking",
    "Course Description (All subjects)",
    "Course Description (Specific Subject Only)",
    "Course Syllabus",
    "Honorable Dismissal / Original TOR for other school / Transfer Credentials",
    "Certificate of NSTP ROTC/CWTS",
    "English Translation of Diploma",
    "Certificate of No Objection",
    "Company Verification"
  ];

  const handleDocumentCheckboxChange = (docName, isChecked) => {
    setSelectedDocuments(prev => {
      const newSelected = { ...prev };
      if (isChecked) {
        const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
        const docInfo = documentDetails[docName]?.[currentProgramType];
        const price = docInfo ? (docInfo.amount === "FREE" ? 0 : docInfo.amount) : 0;
        newSelected[docName] = { qty: 1, amount: price };
      } else {
        delete newSelected[docName];
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (docName, qty) => {
    setSelectedDocuments(prev => {
      const newSelected = { ...prev };
      if (newSelected[docName]) {
        let parsedQty = parseInt(qty, 10);
        if (isNaN(parsedQty) || parsedQty < 0) parsedQty = 0;
        if (parsedQty > 6) parsedQty = 6;
        const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
        const docInfo = documentDetails[docName]?.[currentProgramType];
        const price = docInfo ? (docInfo.amount === "FREE" ? 0 : docInfo.amount) : 0;
        newSelected[docName] = {
          ...newSelected[docName],
          qty: parsedQty,
          amount: parsedQty * price
        };
      }
      return newSelected;
    });
  };

  useEffect(() => {
    const calculatedTotal = Object.values(selectedDocuments).reduce((sum, doc) => sum + doc.amount, 0);
    setTotalAmount(calculatedTotal);
  }, [selectedDocuments]);

  // Function to generate a unique transaction reference number
  const generateTransactionRef = () => {
    const timestamp = Date.now().toString(36);
    const randomChars = Math.random().toString(36).substring(2, 8);
    return `TRN-${timestamp}-${randomChars}`.toUpperCase();
  };

  const accessCodeRequiredDocs = [
    "Transfer out/Honorable Dismissal",
    "Replacement of ID",
    "CAV for Abroad or DFA/CHED Authentication (Undergraduate - 2017 - Below)",
    "CAV for Abroad or DFA/CHED Authentication (Undergraduate - 2018 - Present)",
    "Certificate of Graduation with special paper for loss diploma",
    "CTC of Diploma",
    "Certified True Copy of TOR",
    "CAV for Board Exam (Graduate - 2017 - Below)",
    "CAV for Board Exam (Graduate - 2018 - Present)",
    "CAV for Abroad or DFA/CHED Authentication (Graduate - 2017 - Below)",
    "CAV for Abroad or DFA/CHED Authentication (Graduate - 2018 - Present)",
    "English Translation of Diploma",
    "Honorable Dismissal / Original TOR for other school / Transfer Credentials"
  ];

  const handleSubmitRequest = async () => {
    const needsAccessCode = Object.keys(selectedDocuments).some(doc =>
      accessCodeRequiredDocs.includes(doc)
    );

    if (Object.keys(selectedDocuments).length === 0) {
      alert('Please select at least one document to request.');
      return;
    }

    if (needsAccessCode && !pendingSubmit) {
      setShowAccessCodeModal(true);
      setAccessCodeInput('');
      setAccessCodeError('');
      setPendingSubmit(true);
      return;
    }

    const currentTransactionRef = generateTransactionRef();
    setTransactionRef(currentTransactionRef); // Store in state for later use - FIX APPLIED HERE

    try {
      // 1. Submit Request Form (Applicant's Information)
      const requestFormPayload = {
        formRequestId: transactionRef,
        studentNumber,
        firstName,
        lastName,
        middleName,
        degreeProgram,
        selectedCollege,
        ayAdmitted,
        semAdmitted,
        graduationDate: graduationDate ? graduationDate.toISOString().split('T')[0] : null, // Format date for DB
        phoneNumber,
        landline,
        emailAddress,
        viber,
        streetName: streetNumber, // Flatten address fields
        barangay,
        municipality,
        province,
        purposeOfRequest: JSON.stringify({
  evaluation: purposeTorEvaluation,
  boardExam: purposeTorBoardExam,
  employment: purposeTorEmployment,
  furtherStudies: purposeTorFurtherStudies,
  furtherStudiesText: purposeTorFurtherStudiesText,
  certificationsText: purposeCertificationsText
})

      };

      console.log('Submitting Request Form Payload:', requestFormPayload);

      const requestFormRes = await fetch('http://localhost:5000/api/incoming.requestForm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestFormPayload)
      });

    if (!requestFormRes.ok) {
      const contentType = requestFormRes.headers.get("content-type");
      let errorMessage = `Failed to save request form: ${requestFormRes.statusText}`;

      if (contentType && contentType.includes("application/json")) {
        const errorData = await requestFormRes.json();
        errorMessage = errorData.error || errorMessage;
      } else {
        const errorText = await requestFormRes.text();
        console.error("Unexpected response body:", errorText);
      }

      throw new Error(errorMessage);
    }

      const requestFormData = await requestFormRes.json();
      const formRequestId = requestFormData.requestId; // Get the ID of the newly created request form

      // 2. Submit Document Requested details (loop through selectedDocuments)
      for (const docName in selectedDocuments) {
        const doc = selectedDocuments[docName];
        const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
        const docInfo = documentDetails[docName]?.[currentProgramType];
        const unitPriceValue = docInfo ? (docInfo.amount === "FREE" ? 0 : docInfo.amount) : 0;

        const documentRequestedPayload = {
          formRequestId: transactionRef, // Link to the main request
          studentNumber,
          firstName,
          lastName,
          middleName,
          degreeProgram,
          ayAdmitted,
          semAdmitted,
          documentType: docName,
          unitPrice: unitPriceValue,
          quantity: doc.qty,
          attachmentFile: 'placeholder_attachment_path', // Placeholder, actual file upload needs FormData
          totalAmount: doc.amount, // Total for this specific document (qty * unitPrice)
          transactionRef: currentTransactionRef
        };

        console.log('Submitting Document Requested Payload:', documentRequestedPayload);

        const docReqRes = await fetch('http://localhost:5000/api/incoming.documentRequested', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(documentRequestedPayload)
        });

        if (!docReqRes.ok) {
          const errorData = await docReqRes.json();
          console.error(`Backend Error (Document ${docName}):`, errorData);
          alert(`Failed to save document ${docName}: ${errorData.error || docReqRes.statusText}`);
          // Decide whether to throw or continue based on desired error handling
        }
      }

      // 3. Update Transaction Summary for display
      setTransactionDetails({
        transactionRef: currentTransactionRef,
        name: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
        studentNumber,
        college: selectedCollege,
        degreeProgram,
        totalAmount: totalAmount + docStampAmount, // Include doc stamp in final total
        selectedDocuments,
        docStampCount
      });
      setCurrentPage(3);
      setPendingSubmit(false);

    } catch (err) {
      console.error('Submission error:', err);
      alert(`An error occurred during submission: ${err.message}. Please check console for details.`);
      setPendingSubmit(false);
    }
  };

  const handleSubmitOriginalReceiptForm = async () => {
    // Basic validation for OR form
    if (!orFirstName || !orLastName || !orMiddleName || !orReferenceNo || !orNumberInput || !uploadReceiptFile) {
      alert('Please fill in all required fields (marked with *) and upload the receipt before submitting.');
      return;
    }

    try {
      const receiptDetailsPayload = {
        orNumber: orNumberInput,
        formRequestId: transactionRef, // Assuming orReferenceNo is intended to be the transactionRef/formRequestId
        firstName: orFirstName,
        lastName: orLastName,
        middleName: orMiddleName,
        studentNumber: orStudentNumber,
        transactionRef: orReferenceNo, // Use the reference number as transactionRef
        originalReceipt: uploadReceiptFile ? uploadReceiptFile.name : 'no_file_uploaded' // Placeholder for file name
      };

      console.log('Submitting Receipt Details Payload:', receiptDetailsPayload);

      const receiptRes = await fetch('http://localhost:5000/api/incoming.receiptDetailsSubmission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(receiptDetailsPayload)
      });

      if (!receiptRes.ok) {
        const errorData = await receiptRes.json();
        console.error('Backend Error (Receipt Submission):', errorData);
        throw new Error(`Failed to save receipt details: ${errorData.error || receiptRes.statusText}`);
      }
      console.log('Receipt details submitted successfully!');
      setCurrentPage(4);
    } catch (err) {
      console.error('Receipt submission error:', err);
      alert(`An error occurred during receipt submission: ${err.message}. Please check console for details.`);
    }
  };

  const handleDownloadFile = (fileName) => {
    console.log(`Simulating download for: ${fileName}`);
    alert(`Downloading dummy file: ${fileName}`);
  };

  return (
    <div className="app-container">
      {msg && <p>Backend Status: {msg}</p>}
      <Header isFormExpanded={activeForm !== null} />

      <main className={`main-content ${activeForm !== null ? 'main-content-expanded' : ''}`}>
        <section className={`privacy-section ${activeForm !== null ? 'privacy-section-expanded' : ''}`}>
  {showGraduatePrivacy ? (
  <div className="privacy-section privacy-section-expanded">
    <div className="privacy-header">COMMITMENT TO COMPLY WITH <br /> THE DATA PRIVACY ACT OF 2012</div>
      <div className="privacy-content">
        <p>
I, hereby commit, in the performance of my official duties and functions, to strictly comply with and abide by Republic Act No. 10173 or the Data Privacy Act of 2012, its Implementing Rules and Regulations, and other pertinent issuances, rules and regulations issued by the National Privacy Commission and other government regulatory agencies. In particular, I shall: <br />
<p className='privacy-content-inside'>
1. Keep the confidentiality, privacy and privileged character of all personal information, records and documents in my custody. I shall not disclose, either deliberately or thru negligence, any personal or privileged information that may be passed to or through me for processing or storage;
</p><p className='privacy-content-inside'>
2. Not use or divulge confidential, privileged or classified information which are officially known to me by reason of my official position, in order to further my private interests or give undue patronage to anyone, or to prejudice the University's, the public's or anyone's interest;
</p><p className='privacy-content-inside'>
3. Disclose or process personal information only in instances authorized by law, such as when there is informed consent, or by virtue of a contractual obligation of the University, or for the protection of life and health, or by any other criteria provided under the Data Privacy Act of 2012;
</p><p className='privacy-content-inside'>
4. Strictly adhere to the data privacy principles of transparency, legitimate purpose and proportionality whenever I process personal information in the course of my official functions;
</p><p className='privacy-content-inside'>
5. Protect at all times the rights of the University's data subjects, including their right to information, right to access information, right to data portability, right to rectification, right to erasure or blocking of personal information, right to object, right to file a complaint, and right to damages;
</p><p className='privacy-content-inside'>
6. Ensure that the personal or privileged information stored, collected, and processed by me will not be misused, altered, maliciously disclosed, or improperly disposed of, by instituting reasonable and appropriate physical and technical measures for the protection of personal information; and
</p><p className='privacy-content-inside'>
7. Ensure the confidentiality, privacy and privileged character of information and documents that I may process or which may come into my custody in the course of my official functions, even after employment and/or service engagement with the Pamantasan ng Lungsod ng Maynila (PLM).
</p><p>
I fully understand that failure to comply with the above-mentioned obligations may subject me to possible criminal and/or administrative sanctions under the Data Privacy Act of 2012, the Code of Conduct and Ethical Standards for Public Officials and Employees, and/or other pertinent Civil Service rules and regulations. 
</p>
<p><strong><br />CONFORME:</strong></p>
</p>
        <label htmlFor="graduate-privacy-checkbox" className="privacy-checkbox-label">
          <input
            type="checkbox"
            id="graduate-privacy-checkbox"
            checked={graduatePrivacyAgreed}
            onChange={e => setGraduatePrivacyAgreed(e.target.checked)}
          />
          <span>I confirm that I or my designated representative will collect the documents within forty-five (45) calendar days of release, otherwise, OUR will dispose of unclaimed documents after the 45-day period.<br />
</span>
        </label>
        <button className="submit-form-button" onClick={handleGraduatePrivacyAgree} disabled={!graduatePrivacyAgreed}>
          Proceed
        </button>
        <button className="close-form-button" onClick={() => setShowGraduatePrivacy(false)}>
          Cancel
        </button>
      </div>
    </div>
  ) : activeForm === null ? (
            <>
              <div className="button-group-row">
                <button className="undergrad-button" onClick={handleUndergraduateClick}>
                  Undergraduate
                </button>
                <button className="graduate-button2" onClick={handleGraduateAlumniClick}>
                  Graduate / Alumni
                </button>
              </div>
              <button className="submit-button3" onClick={handleSubmitOriginalReceiptClick}>
                Submit Original Receipt
              </button>
            </>
          ) : activeForm === 'originalReceipt' && currentPage === 1 ? (
            <>
              <div className="request-form-container">
                <div className="request-form-header">
                  <h3 className="request-form-title">Original Receipt</h3>
                </div>
                <div className="request-form-content">
                  <div className="form-group">
                    <label className="form-label" htmlFor="student-number-or">Student Number</label>
                    <input className="form-input" type="text" id="student-number-or" value={orStudentNumber} onChange={e => setOrStudentNumber(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name-or">First Name
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="text" id="first-name-or" value={orFirstName} onChange={e => setOrFirstName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="last-name-or">Last Name
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="text" id="last-name-or" value={orLastName} onChange={e => setOrLastName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="middle-name-or">Middle Name
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="text" id="middle-name-or" value={orMiddleName} onChange={e => setOrMiddleName(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reference-no-or">Reference No.:
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="text" id="reference-no-or" value={orReferenceNo} onChange={e => setOrReferenceNo(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="or-number-or">OR Number:
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="text" id="or-number-or" value={orNumberInput} onChange={e => setOrNumberInput(e.target.value)} />
                  </div>
                  <div className="form-group form-group-vertical">
                    <label className="form-label" htmlFor="upload-receipt">Upload Scanned Copy of Original Receipt
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="file" id="upload-receipt" onChange={e => setUploadReceiptFile(e.target.files[0])} />
                  </div>
                  <button className="submit-or-button" onClick={handleSubmitOriginalReceiptForm}>Submit</button>
                  <button className="close-or-button" onClick={closeForm}>Close</button>
                </div>
              </div>
            </>
          ) : activeForm === 'originalReceipt' && currentPage === 4 ? (
            <div className="request-form-container">
              <div className="request-form-header">
                <h3 className="request-form-title">Confirmation</h3>
              </div>
              <div className="request-form-content transaction-summary-container">
                <h4 className="form-section-title">Your request will be processed.</h4>
                <p className="transaction-message">Please wait for 10-15 days for claiming.</p>
                <p className='message-below'>For more inquiries please contact landline of Office of the University Registrar at 01234567</p>
                <button className="close-form-button1" onClick={closeForm}>Close</button>
              </div>
            </div>
          ) : (
            <>
              <div className="request-form-container">
                <div className="request-form-header">
                  <h3 className="request-form-title">Request Form</h3>
                </div>
                <div className="request-form-content">
                  {currentPage === 1 && (
                    <>
                      <h4 className="form-section-title">Applicant's Information</h4>

                        <div className="form-group">
                        <label className="form-label" htmlFor="student-number">Student Number</label>
                        <input className="form-input" type="text" id="student-number" placeholder="202100098" value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)} />
                      </div>
  
                      <div className="form-group-triple-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="first-name">First Name
                            <span style={{color: 'red'}}>*</span>
                          </label>
                          <input className="form-input" type="text" id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
                        <div className="form-group-vertical">
                            <label className="form-label" htmlFor="last-name">
    {activeForm === 'graduate' ? 'Maiden Last Name' : 'Last Name'} <span style={{color: 'red'}}>*</span>
  </label>
                          
                          <input className="form-input" type="text" id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)}   />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="middle-name">Middle Name
                            <span style={{color: 'red'}}>*</span>
                          </label>
                          <input className="form-input" type="text" id="middle-name" value={middleName} onChange={(e) => setMiddleName(e.target.value)}  />
                        </div>
                      </div>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="college">College
                            <span style={{color: 'red'}}>*</span>
                          </label>
                          <select className="form-select" id="college" value={selectedCollege} onChange={(e) => { setSelectedCollege(e.target.value); setDegreeProgram(''); }}  >
                            <option value="">Select College</option>
                            {Object.keys(collegesAndPrograms).map((collegeName) => (
                              <option key={collegeName} value={collegeName}>{collegeName}</option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="degree-program">Degree Program/Course
                            <span style={{color: 'red'}}>*</span>
                          </label>
                          <select className="form-select" id="degree-program" value={degreeProgram} onChange={(e) => setDegreeProgram(e.target.value)} disabled={!selectedCollege}>
                            <option value="">Select Course</option>
                            {selectedCollege && collegesAndPrograms[selectedCollege]?.map((program) => (
                              <option key={program} value={program}>{program}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="ay-admitted">AY admitted</label>
                          <input className="form-input" type="text" id="ay-admitted" value={ayAdmitted} onChange={(e) => setAyAdmitted(e.target.value)} />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="sem-admitted">Sem/AY last admitted</label>
                          <input className="form-input" type="text" id="sem-admitted" value={semAdmitted} onChange={(e) => setSemAdmitted(e.target.value)} />
                        </div>
                      </div>

                      {activeForm === 'graduate' && (
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="graduation-date">If graduated, date of graduation:
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <div className="date-input-container">
                            <input
                              className="form-input date-input"
                              type="text"
                              id="graduation-date"
                              placeholder="Choose Date"
                              readOnly
                              value={graduationDate ? graduationDate.toLocaleDateString() : ''}
                              onClick={handleDateInputClick}
                            />
                            <button className="date-picker-button" onClick={handleDateInputClick}>
                              <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                            </button>
                            {graduationDate && (
                              <button className="clear-date-button" onClick={handleClearDate}>
                                <svg className="clear-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            )}
                          </div>
                          {showDatePicker && (
                            <DatePicker
                              setShowDatePicker={setShowDatePicker}
                              selectedDate={graduationDate}
                              handleDateSelect={handleDateSelect}
                              currentMonth={currentMonth}
                              setCurrentMonth={setCurrentMonth}
                              currentYear={currentYear}
                              setCurrentYear={setCurrentYear}
                              goToPreviousMonth={goToPreviousMonth}
                              goToNextMonth={goToNextMonth}
                              generateDaysInMonth={generateDaysInMonth}
                              monthNames={monthNames}
                              weekDays={weekDays}
                              daysInCalendar={daysInCalendar}
                            />
                          )}
                        </div>
                      )}

                      <hr className="form-divider" />

                      <h4 className="form-section-title">Contact Information</h4>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="phone-number">Phone Number
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <input className="form-input" type="text" id="phone-number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="email">Email Address
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <input className="form-input" type="text" id="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} />
                        </div>
                      </div>
                      <hr className="form-divider" />

                      <h4 className="form-section-title">Permanent Address</h4>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="street-number">Street Number/Name
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <input className="form-input" type="text" id="street-number" value={streetNumber} onChange={(e) => setStreetNumber(e.target.value)} />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="barangay">Barangay
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <input className="form-input" type="text" id="barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="municipality">Municipality
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <input className="form-input" type="text" id="municipality" value={municipality} onChange={(e) => setMunicipality(e.target.value)} />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="province">Province
                            <span style={{color: 'red'}}>*</span>

                          </label>
                          <input className="form-input" type="text" id="province" value={province} onChange={(e) => setProvince(e.target.value)} />
                        </div>
                      </div>

                      <hr className="form-divider" />

                      <h4 className="form-section-title">Purpose of Request
                            <span style={{color: 'red'}}>*</span>

                      </h4>
                      <p className="form-subtitle">The purpose of request should be indicated in the document requested.</p>

                      <div className="form-group-checkbox">
                        <p className="checkbox-section-title">A. Transcript of Records (TOR)</p>
                        <label className="checkbox-label">
                          <input type="checkbox" className="form-checkbox" checked={purposeTorEvaluation} onChange={e => setPurposeTorEvaluation(e.target.checked)} /> Evaluation
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" className="form-checkbox" checked={purposeTorBoardExam} onChange={e => setPurposeTorBoardExam(e.target.checked)} /> Board Exam
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" className="form-checkbox" checked={purposeTorEmployment} onChange={e => setPurposeTorEmployment(e.target.checked)} /> Employment or Promotion
                        </label>
                        <label className="checkbox-label checkbox-label-with-input">
                          <input type="checkbox" className="form-checkbox" checked={purposeTorFurtherStudies} onChange={e => setPurposeTorFurtherStudies(e.target.checked)} /> Further Studies (specify College/University)
                          <input type="text" className="form-input checkbox-input" value={purposeTorFurtherStudiesText} onChange={e => setPurposeTorFurtherStudiesText(e.target.value)} disabled={!purposeTorFurtherStudies} />
                        </label>
                      </div>

                      <div className="form-group-checkbox">
                        <label className="checkbox-label checkbox-label-with-input">
                          B. Certifications (specify):
                          <input type="text" className="form-input checkbox-input" value={purposeCertificationsText} onChange={e => setPurposeCertificationsText(e.target.value)} />
                        </label>
                      </div>

                      <button className="submit-form-button" onClick={handleNextPage}>Next</button>
                      <button className="close-form-button" onClick={closeForm}>Close</button>
                    </>
                  )}

                  {currentPage === 2 && (
                    <>
                      <h4 className="form-section-title">Document Request</h4>
                      <div className="documents-row-wrapper">
                        <div className="pre-filled-info">
                        <div className="info-item">
                          <span className="info-label">Student Number:</span>
                          <span className="info-value">{studentNumber}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Name:</span>
                          <span className="info-value">{`${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Degree Program/Course:</span>
                          <span className="info-value">{degreeProgram}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Ay Admitted:</span>
                          <span className="info-value">{ayAdmitted}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Last Ay/Sem Admitted:</span>
                          <span className="info-value">{semAdmitted}</span>
                        </div>
                      </div>
                      <div className="documents-requested-section">
                        <div className="documents-table-header">
                          <div className="document-name-header">Document Requested</div>
                          <div className="document-qty-header">Qty</div>
                          <div className="document-amount-header">Amount</div>
                        </div>
                        {(activeForm === 'undergraduate' ? undergraduateDocuments : graduateAlumniDocuments).map((doc, index) => (
                          <div key={index} className="documents-table-row">
                            <label className="document-name-label">
                              <input
                                type="checkbox"
                                className="form-checkbox"
                                checked={!!selectedDocuments[doc]}
                                onChange={(e) => handleDocumentCheckboxChange(doc, e.target.checked)}
                              />
                              {doc}
                            </label>
                            <input
                              type="number"
                              className="document-qty-input"
                              value={selectedDocuments[doc]?.qty || ''}
                              onChange={(e) => handleQuantityChange(doc, e.target.value)}
                              disabled={!selectedDocuments[doc]}
                              min="0"
                              max="6" 
                            />
                            <span className="document-amount-display">
                              {selectedDocuments[doc] ? `P${selectedDocuments[doc].amount.toFixed(2)}` : 'P0.00'}
                            </span>
                          </div>

                        ))}

{docStampCount > 0 && (
  <div className="documents-table-row">
    <label className="document-name-label" style={{ opacity: 0.7, pointerEvents: 'none' }}>
      Doc Stamp
    </label>
    <input
      type="number"
      className="document-qty-input"
      value={docStampCount}
      disabled
      style={{ background: '#f0f0f0', color: '#888' }}
    />
    <span className="document-amount-display">
      P{(docStampAmount).toFixed(2)}
    </span>
  </div>
)}
                        <div className="documents-table-total">
                          <span className="total-label">Total:</span>
                          <span className="total-value">P{(totalAmount + docStampAmount).toFixed(2)}</span>
                        </div>
                      </div>

                      {Object.keys(selectedDocuments).length > 0 && (
                        <div className="selected-documents-details">
                          <h4 className="form-section-title">Details of Selected Documents</h4>
                          {Object.keys(selectedDocuments).map((docName) => {
                            const docInfo = documentDetails[docName];
                            const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
                            const programSpecificDetails = docInfo?.[currentProgramType];

                            
                            if (!programSpecificDetails) {
                              return null; 
                            }
                            
                        
                            

                            return (
                              <div key={docName} className="document-detail-item">
                                <p className="document-detail-name">{docName}</p>
                                <div className="document-detail-info">
                                  <span className="info-label">College:</span>
                                  <span className="info-value">{selectedCollege || 'N/A'}</span>
                                </div>
                                <div className="document-detail-info">
                                  <span className="info-label">Degree Program/Course:</span>
                                  <span className="info-value">{degreeProgram || 'N/A'}</span>
                                </div>
                                <div className="document-detail-info">
                                  <span className="info-label">{currentProgramType}:</span>
                                  <span className="info-value">P{programSpecificDetails.amount}</span>
                                </div>
                                {programSpecificDetails.message && (
                                  <div className="document-detail-message">
                                    <span className="info-label">Message:</span>
                                    <span className="info-value">
                                      {programSpecificDetails.message.split('\n').map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          <br />
        </React.Fragment>
      ))}
                                    </span>
                                  </div>
                                )}
                                {programSpecificDetails.downloads && programSpecificDetails.downloads.length > 0 && (
                                  <div className="document-detail-downloads">
                                    <span className="info-label">Download File:</span>
                                    <div className="info-value">
                                      {programSpecificDetails.downloads.map((download, idx) => (
                                        <div key={idx} className="download-item-container">
                                          <p className="download-item">{download}</p>
                                          <button className="download-button" onClick={() => handleDownloadFile(download)}>Download</button>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {programSpecificDetails.attachments && programSpecificDetails.attachments.length > 0 && (
                                  <div className="document-detail-attachments">
                                    <span className="info-label">Attach File:</span>
                                    <div className="info-value">
                                      {programSpecificDetails.attachments.map((attachment, idx) => (
                                        <div key={idx} className="attachment-item-container">
                                          <p className="attachment-item">{attachment}</p>
                                          <input type="file" className="upload-file-input" />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      </div>

                      <button className="submit-form-button" onClick={handleSubmitRequest}>Submit</button>
                      <button className="back-button" onClick={handleBackToPage1}>Back</button>
                      <button className="close-form-button" onClick={closeForm}>Close</button>
                    </>
                  )}

                  {currentPage === 3 && transactionDetails && (
                    
                    <div className="transaction-summary-container">
                      <h4 className="form-section-title">Request Submitted!</h4>
                      <p className="transaction-message">Please proceed to PLM Cashier for payment.</p>
                      <p className='message-below2'>You will receive a confirmation email shortly with a summary of your request.</p>
                      <div className="summary-info-block">
                        <div className="info-item">
                          <span className="info-label">Transaction Reference No.:</span>
                          <span className="info-value transaction-ref">{transactionDetails.transactionRef}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Name:</span>
                          <span className="info-value">{transactionDetails.name}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Student Number:</span>
                          <span className="info-value">{transactionDetails.studentNumber}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">College:</span>
                          <span className="info-value">{transactionDetails.college || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-label">Degree Program/Course:</span>
                          <span className="info-value">{transactionDetails.degreeProgram || 'N/A'}</span>
                        </div>
                        <div className="info-item total-amount-summary">
                          <span className="info-label">Total Amount Due:</span>
                          <span className="info-value">P{transactionDetails.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <h5 className="summary-documents-title">Requested Documents:</h5>
                      <ul className="summary-documents-list">
  {Object.keys(transactionDetails.selectedDocuments).map((docName, index) => (
    <li key={index} className="summary-document-item">
      {docName} (Qty: {transactionDetails.selectedDocuments[docName].qty}) - P{transactionDetails.selectedDocuments[docName].amount.toFixed(2)}
    </li>
  ))}
  {transactionDetails.docStampCount > 0 && (
    <li className="summary-document-item">
      Doc Stamp (Qty: {transactionDetails.docStampCount}) - P{(transactionDetails.docStampCount * 30).toFixed(2)}
    </li>
  )}
</ul>
<p className='transaction-message2'>🔔 Important Note:</p>
                      <p className="message-below3">Please submit a scanned copy of your Original Receipt through the Office of the Registrar website by clicking the “Submit Original Receipt” button on the homepage.</p>
                      <p className='message-below4'>⚠️ Failure to do so will result in your request not being processed.</p>
                      

                      <button className="close-form-button" onClick={closeForm}>Close</button>
                    </div>
                  )}
                </div>
              </div>
              
            </>
          )}
        </section>
      </main>
      {showAccessCodeModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Access Code Required</h3>
      <p>One or more of your selected documents require an admin access code. Please enter the code to proceed.</p>
      <input
        type="password"
        value={accessCodeInput}
        onChange={e => setAccessCodeInput(e.target.value)}
        placeholder="Enter access code"
        className="access-code-input"
      />
      {accessCodeError && <div className="error-message">{accessCodeError}</div>}
      <div className="modal-actions">
        <button
          className="submit-form-button"
          onClick={() => {
            if (accessCodeInput === "@OUR2025") {
              setShowAccessCodeModal(false);
              setAccessCodeError('');
              handleSubmitRequest(); // Call again, now with pendingSubmit true
            } else {
              setAccessCodeError("Invalid access code. Please try again.");
            }
          }}
        >
          Submit
        </button>
        <button
          className="cancel-form-button"
          onClick={() => {
            setShowAccessCodeModal(false);
            setPendingSubmit(false);
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

      <Footer />
    </div>
  );
}


export default App;
