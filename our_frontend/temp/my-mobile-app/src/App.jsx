import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import Header from './components/Header/Header.jsx';
// Removed: import DatePicker from './components/DatePicker/DatePicker.jsx';
import Footer from './components/Footer/Footer.jsx';

// Import the search icon (e.g., from Lucide React or define it as SVG)
// For simplicity, I'll use a simple text/emoji icon. For production, use a proper icon library.
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

function App() {
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Changed to relative path
    fetch(`https://wbackend-l7y3.onrender.com/server/test`)
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
  const [graduationDate, setGraduationDate] = useState(null); // Keep as null for initial state
  const [birthDate, setBirthDate] = useState(null); // NEW STATE: For birthdate

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

  // Removed Date picker states as DatePicker component is no longer used for graduationDate
  // const [showDatePicker, setShowDatePicker] = useState(false);
  // const [currentMonth, setCurrentMonth] = new Date().getMonth());
  // const [currentYear, setCurrentYear] = new Date().getFullYear());

  // Form 2 states (Document Request)
  const [selectedDocuments, setSelectedDocuments] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [formRequestId, setTransactionRef] = useState(''); // To store the generated transaction reference

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
  const[dateOfPayment, setOrDateofPayment]= useState('');
  // NEW STATE: For document-specific attachments
  const [documentAttachments, setDocumentAttachments] = useState({});

  // UPDATED STATE: For specific subject input (now an object) and its validation errors
  const [specificSubjects, setSpecificSubjects] = useState({});
  const [specificSubjectErrors, setSpecificSubjectErrors] = useState({});

  // NEW STATE: For student search status/message
  const [studentSearchMessage, setStudentSearchMessage] = useState('');


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
      "Doctor of Education in Educational Management and Leadership",
      "Master of Arts in Communication Management", "Master of Social Work",
      "Master of Science In Information And Communications Technology", "Doctor of Information Technology",
      "Master of Arts in Nursing",
      "Master of Public Administration", "Doctor of Public Administration",
      "Master of Science in Physical Therapy",
      "Master of Arts in Psychology - Clinical Psychology", "Master of Arts in Psychology - Industrial Psychology"
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
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [], requiresSubjectInput: true },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [], requiresSubjectInput: true }
    },
    "Certificate of Course Syllabus": {
      "BACHELOR PROGRAM": { amount: 146, message: "No other attachment needed.", attachments: [] },
      "MEDICINE": { amount: 146, message: "No other attachment needed.", attachments: [], requiresSubjectInput: true }
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
      "MEDICINE": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to to be presented upon request)", attachments: [] }
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
      "Bachelor Program": { amount: 730, message: "Please see PLM Registrar Office \n and submit the following document/s: \n \n 1. Certified True Copy of Transcript of Records \n 2. Certified True Copy of Diploma \n 3. Original copy of Diploma (to be presented upon request)\n 4. Original copy of Transcript of Record (to be presented upon request)",  attachments: [] },
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
      "Grad School Program": { amount: 146, message: "No other attachment needed.", attachments: [] }
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
      "Bachelor Program": { amount: 146, message: "No other attachment needed.", attachments: [], requiresSubjectInput: true },
      "Medicine": { amount: 146, message: null, attachments: [], requiresSubjectInput: true },
      "Grad School Program": { amount: 219, message: "No other attachment needed.", attachments: [], requiresSubjectInput: true }
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
    // Clear specific subject inputs and errors when switching forms
    setSpecificSubjects({});
    setSpecificSubjectErrors({});
    setStudentSearchMessage(''); // Clear search message
    // Clear autofilled fields when switching to undergraduate, in case graduate data was there
    clearAutofilledFields();
  };

  const handleGraduateAlumniClick = () => {
    setShowGraduatePrivacy(true);
    setGraduatePrivacyAgreed(false);
    setActiveForm(null);
    // Clear specific subject inputs and errors when switching forms
    setSpecificSubjects({});
    setSpecificSubjectErrors({});
    setStudentSearchMessage(''); // Clear search message
    // Clear autofilled fields when switching to graduate, as autofill is not applicable
    clearAutofilledFields();
  };

  const handleGraduatePrivacyAgree = () => {
    setShowGraduatePrivacy(false);
    setGraduatePrivacyAgreed(true);
    setActiveForm('graduate');
    setCurrentPage(1);
  };

  const handleSubmitOriginalReceiptClick = () => {
    setActiveForm('originalReceipt');
    setCurrentPage(1);
    // Clear specific subject inputs and errors when switching forms
    setSpecificSubjects({});
    setSpecificSubjectErrors({});
    setStudentSearchMessage(''); // Clear search message
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
    setBirthDate(null); // NEW: Clear birthDate
    setPhoneNumber('');
    setEmailAddress('');
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
    setTransactionDetails(null);
    setOrStudentNumber('');
    setOrFirstName('');
    setOrLastName('');
    setOrMiddleName('');
    setOrReferenceNo('');
    setOrDateofPayment('');
    setOrNumberInput('');
    setUploadReceiptFile(null);
    setDocumentAttachments({}); // Clear document attachments
    setSpecificSubjects({}); // Clear specific subjects
    setSpecificSubjectErrors({}); // Clear specific subject errors
    setStudentSearchMessage(''); // Clear search message
  };

  const handleNextPage = () => {
    // Basic validation for Page 1 fields
    if (!firstName || !lastName || !middleName || !selectedCollege || !degreeProgram || !phoneNumber || !emailAddress || !streetNumber || !barangay || !municipality || !province || !birthDate) { // NEW: Add birthDate to validation
      alert('Please fill in all required fields (marked with *) before proceeding.');
      return;
    }
    // Check if graduationDate is null or an empty string for graduate form
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
    setSpecificSubjectErrors({}); // Clear errors when going back
  };

  // Removed DatePicker related functions as the component is no longer used for graduationDate
  // const handleDateInputClick = () => {
  //   setShowDatePicker(!showDatePicker);
  // };
  // const handleClearDate = (e) => {
  //   e.stopPropagation();
  //   setGraduationDate(null);
  //   setShowDatePicker(false);
  // };
  // const handleDateSelect = (day) => {
  //   if (day === null) return;
  //   const newDate = new Date(currentYear, currentMonth, day);
  //   setGraduationDate(newDate);
  //   setShowDatePicker(false);
  // };
  // const goToPreviousMonth = () => {
  //   setCurrentMonth(prevMonth => {
  //     if (prevMonth === 0) {
  //       setCurrentYear(prevYear => prevYear - 1);
  //       return 11;
  //     }
  //     return prevMonth - 1;
  //   });
  // };
  // const goToNextMonth = () => {
  //   setCurrentMonth(prevMonth => {
  //     if (prevMonth === 11) {
  //       setCurrentYear(prevYear => prevYear + 1);
  //       return 0;
  //     }
  //     return prevMonth + 1;
  // });
  // };
  // const generateDaysInMonth = (month, year) => {
  //   const date = new Date(year, month, 1);
  //   const days = [];
  //   const firstDayIndex = date.getDay();
  //   const numDaysInMonth = new Date(year, month + 1, 0).getDate();
  //   for (let i = 0; i < firstDayIndex; i++) {
  //     days.push(null);
  //   }
  //   for (let i = 1; i <= numDaysInMonth; i++) {
  //     days.push(i);
  //   }
  //   return days;
  // };
  // const monthNames = ["January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];
  // const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  // const daysInCalendar = generateDaysInMonth(currentMonth, currentYear);

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

        // If a document requiring specific subject input is selected, initialize its entry
        if (docInfo && docInfo.requiresSubjectInput) {
          setSpecificSubjects(prevSubjects => ({
            ...prevSubjects,
            [docName]: '' // Initialize with empty string
          }));
          setSpecificSubjectErrors(prevErrors => ({
            ...prevErrors,
            [docName]: false // Clear error for this document
          }));
        }
      } else {
        delete newSelected[docName];
        // Also clear any attached files for this document if deselected
        setDocumentAttachments(prevAttachments => {
          const newAttachments = { ...prevAttachments };
          delete newAttachments[docName];
          return newAttachments;
        });
        // If a document requiring specific subject input is deselected, clear its input and error
        const docInfo = documentDetails[docName]?.[getProgramType(selectedCollege, degreeProgram, activeForm, docName)];
        if (docInfo && docInfo.requiresSubjectInput) {
          setSpecificSubjects(prevSubjects => {
            const newSubjects = { ...prevSubjects };
            delete newSubjects[docName];
            return newSubjects;
          });
          setSpecificSubjectErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[docName];
            return newErrors;
          });
        }
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

  // NEW FUNCTION: Handler for document-specific file attachments
  const handleDocumentAttachmentChange = (docName, attachmentType, file) => {
    console.log(`Frontend: File selected for ${docName} - ${attachmentType}:`, file);
    setDocumentAttachments(prev => ({
      ...prev,
      [docName]: {
        ...(prev[docName] || {}), // Preserve other attachments for this docName
        [attachmentType]: file
      }
    }));
  };

  // NEW FUNCTION: Function to upload a single file to the backend
  const uploadFile = async (file, docName, attachmentType) => {
      if (!file) return null;

      const formData = new FormData();
      formData.append('documentAttachment', file);

      console.log(`Frontend: Preparing to upload file for ${docName} - ${attachmentType}:`, file.name);

      try {
          // Changed to relative path
          const response = await fetch(`https://wbackend-l7y3.onrender.com/test/api/incoming.uploadDocumentAttachment`, {
              method: 'POST',
              body: formData,
          });

          console.log(`Frontend: Upload response status for ${docName} - ${attachmentType}:`, response.status);

          if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`File upload failed: ${response.status} ${response.statusText} - ${errorText}`);
          }

          const uploadResult = await response.json();
          console.log(`Frontend: Upload response body for ${docName} - ${attachmentType}:`, uploadResult);

          // Backend now returns 'filePath' with the direct web URL
          if (uploadResult.filePath) {
              console.log(`Frontend: Received web URL from backend for ${docName} - ${attachmentType}:`, uploadResult.filePath);
              return uploadResult.filePath;
          } else {
              console.error(`Frontend: Upload response missing filePath for ${docName} - ${attachmentType}:`, uploadResult);
              return null;
          }
      } catch (error) {
          console.error(`Frontend: Error uploading file for ${docName} - ${attachmentType}:`, error);
          alert(`Error uploading file: ${error.message}`); // Use alert as per user's original code
          return null;
      }
  };

  // UPDATED FUNCTION: Function to handle file downloads (now directly uses the web URL)
  const handleDownloadFile = (webUrl) => {
    if (!webUrl) {
      alert("No file URL provided for download.");
      return;
    }

    // Extract filename from the URL for the download attribute
    const fileName = webUrl.substring(webUrl.lastIndexOf('/') + 1);

    console.log(`Frontend: Attempting to download file from: ${webUrl}`);

    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = webUrl;
    link.download = fileName; // Suggest the original filename for download
    document.body.appendChild(link); // Append to body (required for Firefox)
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Clean up the temporary link
    alert(`Downloading: ${fileName}`); // Alert as per user's original code for consistency
  };

  useEffect(() => {
    const calculatedTotal = Object.values(selectedDocuments).reduce((sum, doc) => sum + doc.amount, 0);
    setTotalAmount(calculatedTotal);
  }, [selectedDocuments]);

  // Function to generate a unique transaction reference number
  const generateTransactionRef = () => {
    // Get current year
    const year = new Date().getFullYear();
    // Generate 6 random alphanumeric characters
    const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
    // Format: OUR-REQ-YYYY-XXXXXX (18 characters total)
    return `OUR-REQ-${year}-${randomChars}`;
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

  // Helper function to clear autofilled fields
  const clearAutofilledFields = () => {
    setStudentNumber('');
    // Only clear these if they were autofilled, or if we're explicitly resetting the form
    // For now, let's clear them as they are tied to the autofill functionality
    setDegreeProgram('');
    setSelectedCollege('');
    setAyAdmitted('');
    setSemAdmitted('');
    setPhoneNumber('');
    setEmailAddress('');
    setStreetNumber('');
    setBarangay('');
    setMunicipality('');
    setProvince('');
    setGraduationDate(null);
    setStudentSearchMessage('');
  };

  // Debounce utility function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  };

  // NEW FUNCTION: Autofill search logic
  // This function is now called manually when the search button is clicked.
  const performAutofillSearch = useCallback(async () => {
    // Only perform autofill for undergraduate form
    if (activeForm === 'graduate') {
      setStudentSearchMessage('Autofill is not available for Graduate/Alumni forms.');
      clearAutofilledFields(); // Ensure fields are clear if user somehow triggers this
      return;
    }

    // Only proceed if all required fields for autofill are present
    if (!firstName.trim() || !lastName.trim() || !middleName.trim() || !birthDate) {
      clearAutofilledFields(); // Clear if no all required fields are present
      setStudentSearchMessage('Please enter First Name, Last Name, Middle Name, and Birth Date, then click the search button.');
      return;
    }

    setStudentSearchMessage('Searching for student details...');
    try {
      const queryParams = new URLSearchParams({
        firstName: firstName.trim().toLowerCase(), // Convert to lowercase
        lastName: lastName.trim().toLowerCase(),   // Convert to lowercase
        middleName: middleName.trim().toLowerCase(), // Convert to lowercase
        birthDate: birthDate // birthDate from input type="date" is already in YYYY-MM-DD format
      }).toString();

      console.log('Frontend: Sending search query params:', queryParams); // ADDED LOG: Log query params

      // Changed to relative path
      const response = await fetch(`https://wbackend-l7y3.onrender.com/test/api/studentCredentials/search?${queryParams}`); // Corrected path

      const contentType = response.headers.get("content-type");

      if (response.ok && contentType && contentType.includes("application/json")) {
        const studentData = await response.json();
        console.log('Frontend: Student data found:', studentData);
        setStudentSearchMessage('Student details found and pre-filled!');

        // Populate form fields with fetched data
        setStudentNumber(studentData.studentnumber || '');
        setDegreeProgram(studentData.degreeprogram || '');
        setSelectedCollege(studentData.selectedcollege || '');
        setAyAdmitted(studentData.ayadmitted || '');
        setSemAdmitted(studentData.semadmitted || '');
        setPhoneNumber(studentData.phonenumber || '');
        setEmailAddress(studentData.emailaddress || '');
        setStreetNumber(studentData.streetname || '');
        setBarangay(studentData.barangay || '');
        setMunicipality(studentData.municipality || '');
        setProvince(studentData.province || '');
        setGraduationDate(studentData.graduationdate ? studentData.graduationdate.split('T')[0] : null);

      } else if (response.status === 404) {
        clearAutofilledFields(); // Clear if no match
        setStudentSearchMessage('No student found with the provided exact name and birthdate.');
      } else {
        // This is the block that will catch the SyntaxError if the response is not JSON
        const errorText = await response.text(); // fallback if not JSON
        console.error("Unexpected response from server:", errorText);
        setStudentSearchMessage("Unexpected server response. Please try again.");
      }
    } catch (error) {
      clearAutofilledFields(); // Clear on network error
      setStudentSearchMessage('An error occurred during search. Please try again.');
      console.error('Frontend: Network or unexpected error during student search:', error);
    }
  }, [firstName, lastName, middleName, birthDate, activeForm]); // Dependencies for useCallback

  // Removed the useEffect that triggered autofill automatically on input changes.
  // useEffect(() => {
  //   performAutofillSearch(firstName, lastName, middleName, birthDate);
  // }, [firstName, lastName, middleName, birthDate, performAutofillSearch]);


  const handleSubmitRequest = async () => {
    const needsAccessCode = Object.keys(selectedDocuments).some(doc =>
      accessCodeRequiredDocs.includes(doc)
    );

    if (Object.keys(selectedDocuments).length === 0) {
      alert('Please select at least one document to request.');
      return;
    }

    // --- UPDATED VALIDATION FOR SPECIFIC SUBJECT INPUT ---
    let hasSpecificSubjectErrors = false;
    const newSpecificSubjectErrors = {};

    Object.keys(selectedDocuments).forEach(docName => {
      const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
      const docInfo = documentDetails[docName]?.[currentProgramType];

      if (docInfo && docInfo.requiresSubjectInput) {
        if (!specificSubjects[docName] || specificSubjects[docName].trim() === '') {
          newSpecificSubjectErrors[docName] = true;
          hasSpecificSubjectErrors = true;
        } else {
          newSpecificSubjectErrors[docName] = false;
        }
      }
    });

    setSpecificSubjectErrors(newSpecificSubjectErrors); // Update error state for visual feedback

    if (hasSpecificSubjectErrors) {
      alert('Please fill in all required specific subject fields.');
      return;
    }
    // --- END UPDATED VALIDATION ---


    if (needsAccessCode && !pendingSubmit) {
      setShowAccessCodeModal(true);
      setAccessCodeInput('');
      setAccessCodeError('');
      setPendingSubmit(true);
      return;
    }

    const currentTransactionRef = generateTransactionRef();
    // No need to set state here, use the local variable directly for consistency
    // setTransactionRef(currentTransactionRef); // Removed this line to avoid async issues

    try {
      // 1. Submit Request Form (Applicant's Information)
      const requestFormPayload = {
        formRequestId: currentTransactionRef, // Use local variable
        studentNumber,
        firstName,
        lastName,
        middleName,
        degreeProgram,
        selectedCollege,
        ayAdmitted,
        semAdmitted,
        // For graduationDate, if it's a Date object, convert to ISO string. If it's already a string from native input, use as is.
        graduationDate: graduationDate ? (typeof graduationDate === 'string' ? graduationDate : graduationDate.toISOString().split('T')[0]) : null, // Format date for DB
        birthDate: birthDate ? (typeof birthDate === 'string' ? birthDate : birthDate.toISOString().split('T')[0]) : null, // NEW: Format birthDate for DB
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
        }),
        // NEW: Add selected documents details for email generation
        selectedDocumentsForEmail: Object.keys(selectedDocuments).map(docName => {
            const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
            const docInfo = documentDetails[docName]?.[currentProgramType];
            const unitPriceValue = docInfo ? (docInfo.amount === "FREE" ? 0 : docInfo.amount) : 0;
            const specificSubjectForDoc = (docInfo && docInfo.requiresSubjectInput) ? specificSubjects[docName] : null;

            // Calculate total amount for email summary, including doc stamp if applicable
            let emailItemTotal = unitPriceValue * selectedDocuments[docName].qty;
            if (!isDiploma(docName)) {
                emailItemTotal += 30 * selectedDocuments[docName].qty; // Add doc stamp per quantity of non-diploma document
            }

            return {
                documentType: docName,
                quantity: selectedDocuments[docName].qty,
                unitPrice: unitPriceValue,
                totalAmount: emailItemTotal, // Corrected: This total includes doc stamp for email display
                specificSubject: specificSubjectForDoc
            };
        }),
        calculatedDocStampAmount: docStampAmount,
        finalTotalAmountDue: totalAmount + docStampAmount // This is the overall total
      };

      console.log('Frontend: Submitting Request Form Payload:', requestFormPayload);

      // Changed to relative path
      const requestFormRes = await fetch(`https://wbackend-l7y3.onrender.com/api/incoming.requestForm`, {
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
        console.error("Frontend: Unexpected response body:", errorText);
      }

      throw new Error(errorMessage);
    }

      const requestFormData = await requestFormRes.json();
      // The backend returns the requestId, which should be the same as currentTransactionRef
      // const formRequestId = requestFormData.requestId; // No longer needed to extract here
      console.log('Frontend: Request Form submitted successfully, formRequestId:', currentTransactionRef);


      // 2. Submit Document Requested details (loop through selectedDocuments)
      for (const docName in selectedDocuments) {
        let attachedFileUrls = []; // Initialize for each document
        const doc = selectedDocuments[docName];
        const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
        const docInfo = documentDetails[docName]?.[currentProgramType];
        const unitPriceValue = docInfo ? (docInfo.amount === "FREE" ? 0 : docInfo.amount) : 0;

        // Calculate the total amount for this specific document for the database.
        // This will include the base price (unitPrice * quantity) and the doc stamp
        // if the document is not a diploma.
        let documentTotalAmountForDb = unitPriceValue * doc.qty;
        if (!isDiploma(docName)) {
            documentTotalAmountForDb += (doc.qty * 30); // Add 30 per quantity for non-diploma documents
        }

        // ADDED LOG FOR DEBUGGING "Replacement of ID"
        if (docName === "Replacement of ID") {
            console.log(`DEBUG: For "Replacement of ID", unitPriceValue: ${unitPriceValue}, qty: ${doc.qty}, isDiploma: ${isDiploma(docName)}, documentTotalAmountForDb: ${documentTotalAmountForDb}`);
        }


        // NEW LOG: Check the documentAttachments state for the current document
        console.log(`Frontend: Checking documentAttachments for ${docName}:`, documentAttachments[docName]);

        // Check if there are files attached for this specific document type
        if (documentAttachments[docName]) {
            console.log(`Frontend: Processing attachments for document: ${docName}`);
            for (const attachmentType in documentAttachments[docName]) {
                const fileToUpload = documentAttachments[docName][attachmentType];
                // NEW LOG: Log the file object itself
                console.log(`Frontend: File object for ${docName} - ${attachmentType}:`, fileToUpload);

                if (fileToUpload) {
                    // This will now return the direct web URL
                    const webUrl = await uploadFile(fileToUpload, docName, attachmentType);
                    if (webUrl) {
                        attachedFileUrls.push(webUrl); // Collect the web URL
                        console.log(`Frontend: Successfully processed attachment for ${docName} (${attachmentType}), URL: ${webUrl}`);
                    } else {
                        console.warn(`Frontend: Failed to get web URL for ${docName} (${attachmentType}). Skipping.`);
                    }
                } else {
                    console.log(`Frontend: No file object found for ${docName} - ${attachmentType}. Skipping upload.`);
                }
            }
        }

        console.log(`Frontend: Final attachedFileUrls (web URLs) for ${docName} before sending to DB:`, attachedFileUrls);
        console.log(`Frontend: JSON.stringify(attachedFileUrls) for ${docName}:`, JSON.stringify(attachedFileUrls));

        // UPDATED: Determine specific subject input and include it
        const specificSubjectForDoc = (docInfo && docInfo.requiresSubjectInput) ? specificSubjects[docName] : null;


        const documentRequestedPayload = {
          formRequestId: currentTransactionRef, // Use local variable
          studentNumber,
          firstName,
          lastName,
          middleName,
          degreeProgram,
          ayAdmitted,
          semAdmitted,
          documentType: docName,
          unitPrice: unitPriceValue, // Keep unitPrice as the base price without doc stamp
          quantity: doc.qty,
          attachmentFile: JSON.stringify(attachedFileUrls), // Store as JSON string of array of web URLs
          totalAmount: documentTotalAmountForDb, // MODIFIED: This will now include the doc stamp for non-diploma items
          specificSubject: specificSubjectForDoc // Include specific subject for THIS document
        };

        console.log('Frontend: Submitting Document Requested Payload:', documentRequestedPayload);

        // Changed to relative path
        const docReqRes = await fetch(`https://wbackend-l7y3.onrender.com/test/api/incoming.documentRequested`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(documentRequestedPayload)
        });

        if (!docReqRes.ok) {
          const errorData = await docReqRes.json();
          console.error(`Frontend: Backend Error (Document ${docName}):`, errorData);
          alert(`Failed to save document ${docName}: ${errorData.error || docReqRes.statusText}`);
          // Decide whether to throw or continue based on desired error handling
        } else {
            console.log(`Frontend: Document ${docName} saved successfully.`);
        }
      }

      // 3. Update Transaction Summary for display
      setTransactionDetails({
        formRequestId: currentTransactionRef, // Use local variable
        name: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`,
        studentNumber,
        college: selectedCollege,
        degreeProgram,
        totalAmount: totalAmount + docStampAmount, // Include doc stamp in final total
        selectedDocuments,
        docStampCount,
        specificSubjects // Pass specificSubjects to summary
      });
      setCurrentPage(3);
      setPendingSubmit(false);

    } catch (err) {
      console.error('Frontend: Submission error:', err);
      alert(`An error occurred during submission: ${err.message}. Please check console for details.`);
      setPendingSubmit(false);
    }
  };

  const handleSubmitOriginalReceiptForm = async () => {
  if (!orFirstName || !orLastName || !orMiddleName || !orReferenceNo || !orNumberInput || !uploadReceiptFile || !dateOfPayment) {
    alert('Please fill in all required fields (marked with *) and upload the receipt before submitting.');
    return;
  }

  console.log('Frontend: Selected receipt file:', uploadReceiptFile);
  // ADDED LOG: Check dateOfPayment right before appending to FormData
  console.log('Frontend: dateOfPayment before FormData append:', dateOfPayment);

  try {
    const formData = new FormData();
    formData.append('orNumber', orNumberInput);
    formData.append('firstName', orFirstName);
    formData.append('lastName', orLastName);
    formData.append('middleName', orMiddleName);
    formData.append('studentNumber', orStudentNumber);
    formData.append('formRequestId', orReferenceNo); // This is your transaction ref

    // ⬇️ Actual receipt file
    formData.append('originalReceipt', uploadReceiptFile);
    // ⬇️ Date of Payment - Ensure this is correctly appended
    formData.append('dateOfPayment', dateOfPayment); // Use the state variable here


    console.log('Frontend: Submitting Receipt Details Payload (FormData):', [...formData.entries()]);

    // Changed to relative path
    const receiptRes = await fetch(`https://wbackend-l7y3.onrender.com/test/api/incoming.receiptDetailsSubmission`, {
      method: 'POST',
      body: formData // Don't set Content-Type manually
    });

    console.log('Frontend: Receipt submission response status:', receiptRes.status);
    let receiptResult;
    try {
        receiptResult = await receiptRes.json(); // Try to parse JSON
        console.log('Frontend: Receipt submission response body:', receiptResult);
    } catch (jsonError) {
        const errorText = await receiptRes.text(); // If JSON parsing fails, get raw text
        console.error(`Frontend: Failed to parse JSON response for receipt submission. Raw response:`, errorText, 'Error:', jsonError);
        receiptResult = { error: `Invalid JSON response: ${errorText}` };
    }


    if (!receiptRes.ok) {
      console.error('Frontend: Backend Error (Receipt Submission):', receiptResult.error || 'Unknown error');
      throw new Error(`Failed to save receipt details: ${receiptResult.error || receiptRes.statusText}`);
    }

    console.log('Frontend: Receipt details submitted successfully!');
    setCurrentPage(4);
  } catch (err) {
    console.error('Frontend: Receipt submission error:', err);
    alert(`An error occurred during receipt submission: ${err.message}. Please check console for details.`);
  }
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
                  <div className="form-group">
                    <label className="form-label" htmlFor="date-of-payment-or-input">Date of Payment:
                      <span style={{color: 'red'}}>*</span>
                    </label>
                    <input className="form-input" type="date" id="date-of-payment-or-input" value={dateOfPayment} onChange={e => setOrDateofPayment(e.target.value)} />
                  </div>
                  <div className="form-group form-group-vertical">
                    <label className="form-label" htmlFor="upload-receipt">Upload Scanned Copy of Original Receipt
                      <span style={{color: 'red'}}>*</span>
                    </label>
                     <input
                          type="file"
                          accept=".pdf" // adjust based on allowed file types
                          onChange={(e) => setUploadReceiptFile(e.target.files[0])}
                        />
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
              <div className="request-form-content transaction-summary-container1">
                <h4 className="form-section-title1">SUCCESSFULLY SUBMITTED!</h4>
                <p className="transaction-message01">We have received your application and it is now in queue for processing. Your request will be processed within 10–15 working days.
<br />Please wait for a notification before proceeding to claim your documents.</p>
                <p className='message-below01'>What Happens Next?</p>
                <div className='message-below02'>
  <p>Here’s what to expect:</p>
  <ul className='steps-list'>
    <li>
      <span className='label'>1. <strong>Processing</strong></span>
      <span className='desc'>Our staff will verify and process your request.</span>
    </li>
    <li>
      <span className='label'>2. <strong>Notification</strong></span>
      <span className='desc'>You will receive an email or SMS once your request is ready.</span>
    </li>
    <li>
      <span className='label'>3. <strong>Claiming</strong></span>
      <span className='desc'>Follow the instructions in the notification to claim your document(s).</span>
    </li>
  </ul>
</div>
<div className="registrar-contact-info">
  <hr />
  <div className="contact-message">
    <p><strong>For More Information or Inquiries</strong></p>
    <p>Please contact the Office of the University Registrar.</p>
    <p>📞 Phone: <a href="tel:+63285284574">+(632) 85284574</a></p>
    <p>📧 Email: <a href="mailto:registrar@plm.edu.ph">registrar@plm.edu.ph</a></p>
    <p>🌐 Website: <a href="https://www.university.edu/registrar" target="_blank" rel="noopener noreferrer">www.university.edu/registrar</a></p>
    </div>
  <hr />
</div>

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
                          <div className="input-with-search">
                            <input className="form-input" type="text" id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                          </div>
                        </div>
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

                      {/* NEW: Birthdate field, always present */}
                      <div className="form-group-vertical">
                        <label className="form-label" htmlFor="birth-date">Date of Birth:
                          <span style={{color: 'red'}}>*</span>
                        </label>
                        <div className="input-with-search">
                          <input
                            className="form-input birth-date-input"
                            type="date"
                            id="birth-date"
                            value={birthDate || ''}
                            onChange={(e) => setBirthDate(e.target.value)}
                          />
                          {/* Search icon and button only for undergraduate */}
                          {activeForm === 'undergraduate' && (
                            <button
                              type="button"
                              className="search-button"
                              onClick={performAutofillSearch} // Call the autofill function on click
                              title="Search Student"
                            >
                              <SearchIcon />
                            </button>
                          )}
                        </div>
                      </div>
                      {studentSearchMessage && <p className="search-message">{studentSearchMessage}</p>}


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
                          {/* Changed to type="date" and removed custom date picker logic */}
                          <input
                            className="form-input graduation-date-input"
                            type="date"
                            id="graduation-date"
                            value={graduationDate || ''}
                            onChange={(e) => setGraduationDate(e.target.value)}
                          />
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
                                  <span className="info-label">Birth Date:</span> {/* Display Birth Date */}
                                  <span className="info-value">{birthDate || 'N/A'}</span>
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
                        {(activeForm === 'undergraduate' ? undergraduateDocuments : graduateAlumniDocuments).map((doc, index) => {
                          const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, doc);
                          const docInfo = documentDetails[doc]?.[currentProgramType];
                          const requiresSubjectInput = docInfo && docInfo.requiresSubjectInput;

                          return (
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
                              {requiresSubjectInput && selectedDocuments[doc] && (
                                <div className="specific-subject-input-container">
                                  <input
                                    type="text"
                                    placeholder="Specify Subject"
                                    className={`form-input specific-subject-input ${specificSubjectErrors[doc] ? 'input-error' : ''}`}
                                    value={specificSubjects[doc] || ''} // Use specificSubjects[doc]
                                    onChange={(e) => setSpecificSubjects(prev => ({ ...prev, [doc]: e.target.value }))} // Update specificSubjects[doc]
                                    required={requiresSubjectInput}
                                  />
                                  {specificSubjectErrors[doc] && ( // Use specificSubjectErrors[doc]
                                    <span className="error-message-inline">Please fill out this field</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}

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
                                          <input
                                            type="file"
                                            className="upload-file-input"
                                            onChange={(e) => handleDocumentAttachmentChange(docName, attachment, e.target.files[0])}
                                          />
                                          {/* Display selected file name if available */}
                                          {documentAttachments[docName]?.[attachment] && (
                                            <span className="file-name-display">
                                              {documentAttachments[docName][attachment].name}
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                {/* UPDATED: Display specific subject input value in details if applicable */}
                                {programSpecificDetails.requiresSubjectInput && specificSubjects[docName] && (
                                  <div className="document-detail-info">
                                    <span className="info-label">Specific Subject:</span>
                                    <span className="info-value">{specificSubjects[docName]}</span>
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
                          <span className="info-value transaction-ref">{transactionDetails.formRequestId}</span>
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
                          <span className="info-value">{degreeProgram || 'N/A'}</span>
                        </div>
                        <div className="info-item total-amount-summary">
                          <span className="info-label">Total Amount Due:</span>
                          <span className="info-value">P{transactionDetails.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>

                      <h5 className="summary-documents-title">Requested Documents:</h5>
                      <ul className="summary-documents-list">
  {Object.keys(transactionDetails.selectedDocuments).map((docName, index) => {
    const currentProgramType = getProgramType(selectedCollege, degreeProgram, activeForm, docName);
    const docInfo = documentDetails[docName]?.[currentProgramType];
    const specificSubject = (docInfo && docInfo.requiresSubjectInput) ? transactionDetails.specificSubjects[docName] : null; // Get the specific subject for THIS document

    return (
      <li key={index} className="summary-document-item">
        {docName} (Qty: {transactionDetails.selectedDocuments[docName].qty}) - P{transactionDetails.selectedDocuments[docName].amount.toFixed(2)}
        {specificSubject && ` (Subject: ${specificSubject})`}
      </li>
    );
  })}
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