import React, { useState, useEffect } from 'react';
// Import individual components
import Header from './components/Header/Header.jsx';
import DatePicker from './components/DatePicker/DatePicker.jsx'; // DatePicker is still a separate component
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [activeForm, setActiveForm] = useState(null); // 'undergraduate', 'graduate', 'originalReceipt'
  const [currentPage, setCurrentPage] = useState(1); // 1 for applicant info, 2 for documents requested

  // Form 1 states
  const [studentNumber, setStudentNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [degreeProgram, setDegreeProgram] = useState('');
  const [college, setCollege] = useState('');
  const [ayAdmitted, setAyAdmitted] = useState('');
  const [semAdmitted, setSemAdmitted] = useState('');
  const [graduationDate, setGraduationDate] = useState(null);

  // Date picker states
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Form 2 states
  const [selectedDocuments, setSelectedDocuments] = useState({}); // { docName: { qty: 1, amount: 146 } }
  const [totalAmount, setTotalAmount] = useState(0);

  const handleUndergraduateClick = () => {
    setActiveForm('undergraduate');
    setCurrentPage(1); // Always start at page 1 for main forms
    setShowDatePicker(false);
  };

  const handleGraduateAlumniClick = () => {
    setActiveForm('graduate');
    setCurrentPage(1); // Always start at page 1 for main forms
    setShowDatePicker(false);
  };

  const handleSubmitOriginalReceiptClick = () => {
    setActiveForm('originalReceipt');
    setShowDatePicker(false);
  };

  const closeForm = () => {
    setActiveForm(null); // Reset active form when closing
    setCurrentPage(1); // Reset to page 1
    // Clear all form data
    setStudentNumber('');
    setFirstName('');
    setLastName('');
    setMiddleName('');
    setDegreeProgram('');
    setCollege('');
    setAyAdmitted('');
    setSemAdmitted('');
    setGraduationDate(null);
    setSelectedDocuments({});
    setTotalAmount(0);
    setShowDatePicker(false);
  };

  const handleNextPage = () => {
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
    "Certificate of Units Earned",
    "Certificate of Medium of Instruction",
    "Certificate of NSTP Serial No. (ROTC/CWTS)",
    "Certificate of Course Description (All subjects taken or Specific subject only)",
    "Certificate of Course Syllabus",
    "CTC of F137",
    "Replacement of ID",
    "Transfer out/Honorable Dismissal",
    "CAV for Abroad or DFA/CHED Authentication"
  ];

  const graduateAlumniDocuments = [
    "CAV for Board Exam",
    "CAV for Abroad or DFA/CHED Authentication",
    "Transcript of Records",
    "Certified True Copy of TOR",
    "Original TOR for other school or to transfer credentials",
    "CTC Diploma",
    "Certificate of Graduation with special paper for loss diploma",
    "Certificate of Graduation",
    "Certificate of Graduation w/ Latin Honor",
    "Certificate of Medium of Instruction",
    "Certificate of Units Earned",
    "Certificate of GWA",
    "Certificate of NSTP ROTC/CWTS",
    "Course Description (All subjects or Specific subject only)",
    "Course Syllabus (Selected Courses)",
    "Certificate of Completion",
    "Certificate of Ranking",
    "Certificate of No Objection",
    "English Translation of Diploma (For below 2017 Grad. They need to submit a copy of Tagalog Diploma)",
    "CTC F137",
    "Other forms that need to attach a copy of TOR"
  ];

  const DOCUMENT_PRICE = 146; // Dummy data for amount

  const handleDocumentCheckboxChange = (docName, isChecked) => {
    setSelectedDocuments(prev => {
      const newSelected = { ...prev };
      if (isChecked) {
        newSelected[docName] = { qty: 1, amount: DOCUMENT_PRICE };
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
        const parsedQty = parseInt(qty, 10);
        newSelected[docName] = {
          ...newSelected[docName],
          qty: isNaN(parsedQty) || parsedQty < 0 ? 0 : parsedQty,
          amount: (isNaN(parsedQty) || parsedQty < 0 ? 0 : parsedQty) * DOCUMENT_PRICE
        };
      }
      return newSelected;
    });
  };

  useEffect(() => {
    const calculatedTotal = Object.values(selectedDocuments).reduce((sum, doc) => sum + doc.amount, 0);
    setTotalAmount(calculatedTotal);
  }, [selectedDocuments]);


  return (
    <div className="app-container">
      {/* Header component */}
      <Header isFormExpanded={activeForm !== null} />

      <main className={`main-content ${activeForm !== null ? 'main-content-expanded' : ''}`}>
        <section className={`privacy-section ${activeForm !== null ? 'privacy-section-expanded' : ''}`}>
          {activeForm === null ? (
            <>
              <p className="privacy-header">DATA PRIVACY AND NON-DISCLOSURE AGREEMENT</p>
              <label htmlFor="agree-checkbox" className="privacy-checkbox-label">
                <input type="checkbox" id="agree-checkbox" className="privacy-checkbox" />
                <span>I acknowledge that I have reviewed the Terms and Conditions and Privacy Policy. I accept and agree to all terms outlined in both documents.<a href="#" className="privacy-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>.</span>
              </label>
              <div className="button-group-row">
                <button className="online-request-button" onClick={handleUndergraduateClick}>
                  Undergraduate
                </button>
                <button className="online-request-button2" onClick={handleGraduateAlumniClick}>
                  Graduate / Alumni
                </button>
              </div>
              <button className="online-request-button3" onClick={handleSubmitOriginalReceiptClick}>
                Submit Original Receipt
              </button>
            </>
          ) : activeForm === 'originalReceipt' ? (
            <>
              <div className="request-form-container">
                <div className="request-form-header">
                  <h3 className="request-form-title">Original Receipt</h3>
                </div>
                <div className="request-form-content">
                  <div className="form-group">
                    <label className="form-label" htmlFor="student-number-or">Student Number</label>
                    <input className="form-input" type="text" id="student-number-or" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name-or">First Name</label>
                    <input className="form-input" type="text" id="first-name-or" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="last-name-or">Last Name</label>
                    <input className="form-input" type="text" id="last-name-or" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="middle-name-or">Middle Name</label>
                    <input className="form-input" type="text" id="middle-name-or" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reference-no-or">Reference No.:</label>
                    <input className="form-input" type="text" id="reference-no-or" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="or-number-or">OR Number:</label>
                    <input className="form-input" type="text" id="or-number-or" />
                  </div>
                  <div className="form-group form-group-vertical">
                    <label className="form-label" htmlFor="upload-receipt">Upload Scanned Copy of Original Receipt</label>
                    <input className="form-input" type="file" id="upload-receipt" />
                  </div>
                  <button className="submit-form-button">Submit</button>
                  <button className="close-form-button" onClick={closeForm}>Close Form</button>
                </div>
              </div>
            </>
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
                          <label className="form-label" htmlFor="first-name">First Name</label>
                          <input className="form-input" type="text" id="first-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="last-name">Last Name</label>
                          <input className="form-input" type="text" id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="middle-name">Middle Name</label>
                          <input className="form-input" type="text" id="middle-name" value={middleName} onChange={(e) => setMiddleName(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="degree-program">Degree Program/Course</label>
                          <select className="form-select" id="degree-program" value={degreeProgram} onChange={(e) => setDegreeProgram(e.target.value)}>
                            <option value="">Select Course</option>
                            <option value="BSIT">BS Information Technology</option>
                            <option value="BSBA">BS Business Administration</option>
                          </select>
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="college">College</label>
                          <input className="form-input" type="text" id="college" value={college} onChange={(e) => setCollege(e.target.value)} />
                        </div>
                      </div>
                      {/* AY admitted and Sem/AY last admitted are needed for both undergraduate and graduate */}
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
                      {/* Conditionally render the graduation date field only for graduate */}
                      {activeForm === 'graduate' && (
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="graduation-date">If graduated, date of graduation:</label>
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


                      <h4 className="form-section-title">Permanent Address</h4>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="street-number">Street Number/Name</label>
                          <input className="form-input" type="text" id="street-number" />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="barangay">Barangay</label>
                          <input className="form-input" type="text" id="barangay" />
                        </div>
                      </div>
                      <div className="form-group-double-inline">
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="municipality">Municipality</label>
                          <input className="form-input" type="text" id="municipality" />
                        </div>
                        <div className="form-group-vertical">
                          <label className="form-label" htmlFor="province">Province</label>
                          <input className="form-input" type="text" id="province" />
                        </div>
                      </div>


                      <h4 className="form-section-title">Purpose of Request</h4>
                      <p className="form-subtitle">The purpose of request should be indicated in the document requested.</p>

                      <div className="form-group-checkbox">
                        <p className="checkbox-section-title">A. Transcript of Records (TOR)</p>
                        <label className="checkbox-label">
                          <input type="checkbox" className="form-checkbox" /> Evaluation
                        </label>
                        <label className="checkbox-label">
                          <input type="checkbox" className="form-checkbox" /> Employment or Promotion
                        </label>
                        <label className="checkbox-label checkbox-label-with-input">
                          <input type="checkbox" className="form-checkbox" /> Further Studies (specify the College/University)
                          <input type="text" className="form-input checkbox-input" />
                        </label>
                      </div>

                      <div className="form-group-checkbox">
                        <label className="checkbox-label checkbox-label-with-input">
                          B. Certifications (specify):
                          <input type="text" className="form-input checkbox-input" />
                        </label>
                      </div>

                      <button className="submit-form-button" onClick={handleNextPage}>Next Page</button>
                      <button className="close-form-button" onClick={closeForm}>Close Form</button>
                    </>
                  )}

                  {currentPage === 2 && (
                    <>
                      <h4 className="form-section-title">Document Request</h4>
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
                            />
                            <span className="document-amount-display">
                              {selectedDocuments[doc] ? `P${selectedDocuments[doc].amount.toFixed(2)}` : 'P0.00'}
                            </span>
                          </div>
                        ))}
                        <div className="documents-table-total">
                          <span className="total-label">Total:</span>
                          <span className="total-value">P{totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                      <button className="submit-form-button" onClick={handleBackToPage1}>Back</button>
                      <button className="close-form-button" onClick={closeForm}>Close Form</button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* Footer component */}
      <Footer />
    </div>
  );
}

export default App;
