import React, { useState } from 'react';
// Import individual components
import Header from './components/Header/Header.jsx';
import DatePicker from './components/DatePicker/DatePicker.jsx'; // DatePicker is still a separate component
import Footer from './components/Footer/Footer.jsx';

function App() {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (showDatePicker) setShowDatePicker(false); // Close date picker if form is collapsed
  };

  const handleDateInputClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleClearDate = (e) => {
    e.stopPropagation();
    setSelectedDate(null);
    setShowDatePicker(false);
  };

  const handleDateSelect = (day) => {
    if (day === null) return;
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
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

  return (
    <div className="app-container">
      {/* Header component */}
      <Header isFormExpanded={isFormExpanded} />

      <main className={`main-content ${isFormExpanded ? 'main-content-expanded' : ''}`}>
        <section className={`privacy-section ${isFormExpanded ? 'privacy-section-expanded' : ''}`}>
          {!isFormExpanded ? (
            <>
              <p className="privacy-header">DATA PRIVACY AND NON-DISCLOSURE AGREEMENT</p>
              <label htmlFor="agree-checkbox" className="privacy-checkbox-label">
                <input type="checkbox" id="agree-checkbox" className="privacy-checkbox" />
                <span>I fully understand and agree to the <a href="#" className="privacy-link">Terms and Conditions</a> and <a href="#" className="privacy-link">Privacy Policy</a>.</span>
              </label>
              <button className="online-request-button" onClick={toggleForm}>
                Online Request
              </button>
            </>
          ) : (
            <>
              <div className="request-form-container">
                <div className="request-form-header">
                  <h3 className="request-form-title">Request Form</h3>
                </div>
                <div className="request-form-content">
                  <h4 className="form-section-title">Applicant's Information</h4>

                  <div className="form-group">
                    <label className="form-label" htmlFor="student-number">Student Number</label>
                    <input className="form-input" type="text" id="student-number" placeholder="202100098" />
                  </div>
                  <div className="form-group-triple-inline">
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="first-name">First Name</label>
                      <input className="form-input" type="text" id="first-name" />
                    </div>
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="last-name">Last Name</label>
                      <input className="form-input" type="text" id="last-name" />
                    </div>
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="middle-name">Middle Name</label>
                      <input className="form-input" type="text" id="middle-name" />
                    </div>
                  </div>
                  <div className="form-group-double-inline">
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="degree-program">Degree Program/Course</label>
                      <select className="form-select" id="degree-program">
                        <option value="">Select Course</option>
                        <option value="BSIT">BS Information Technology</option>
                        <option value="BSBA">BS Business Administration</option>
                      </select>
                    </div>
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="college">College</label>
                      <input className="form-input" type="text" id="college" />
                    </div>
                  </div>
                  <div className="form-group-triple-inline">
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="ay-admitted">AY admitted</label>
                      <input className="form-input" type="text" id="ay-admitted" />
                    </div>
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="sem-admitted">Sem/AY last admitted</label>
                      <input className="form-input" type="text" id="sem-admitted" />
                    </div>
                    <div className="form-group-vertical">
                      <label className="form-label" htmlFor="graduation-date">If graduated, date of graduation:</label>
                      <div className="date-input-container">
                        <input
                          className="form-input date-input"
                          type="text"
                          id="graduation-date"
                          placeholder="Choose Date"
                          readOnly
                          value={selectedDate ? selectedDate.toLocaleDateString() : ''}
                          onClick={handleDateInputClick}
                        />
                        <button className="date-picker-button" onClick={handleDateInputClick}>
                          <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path></svg>
                        </button>
                        {selectedDate && (
                          <button className="clear-date-button" onClick={handleClearDate}>
                            <svg className="clear-icon" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                          </button>
                        )}
                      </div>
                      {showDatePicker && (
                        <DatePicker
                          setShowDatePicker={setShowDatePicker}
                          selectedDate={selectedDate}
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
                  </div>

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

                  <button className="submit-form-button">Next Page</button>
                  <button className="close-form-button" onClick={toggleForm}>Close Form</button>
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