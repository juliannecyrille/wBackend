import React, { useState } from 'react';
import './App.css';

import plmLogo from './assets/plm_logo.svg';

function App() {
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const toggleForm = () => {
    setIsFormExpanded(!isFormExpanded);
    if (showDatePicker) setShowDatePicker(false);
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
      <header className={`app-header ${isFormExpanded ? 'app-header-minimized' : ''}`}>
        <div className="header-content-wrapper">
          {isFormExpanded ? (
            <>
              <img
                src={plmLogo}
                alt="PLM Logo"
                className="university-logo"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/002060/FFFFFF?text=Error+Loading+Logo"; }}
              />
              <div className="university-info">
                <h1 className="university-name">PAMANTASAN NG LUNGSOD NG MAYNILA</h1>
                <p className="university-tagline">University of the City of Manila</p>
              </div>
            </>
          ) : (
            <>
              <div className="university-info">
                <h1 className="university-name">PAMANTASAN NG LUNGSOD NG MAYNILA</h1>
                <p className="university-tagline">University of the City of Manila</p>
              </div>
              <img
                src={plmLogo}
                alt="PLM Logo"
                className="university-logo"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/002060/FFFFFF?text=Error+Loading+Logo"; }}
              />
            </>
          )}
        </div>
        <div className="office-info">
          <h2 className="office-title">Office of the</h2>
          <p className="office-title2">University Registrar</p>
        </div>
      </header>

      <main className="main-content">
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
                  <div className="form-group">
                    <label className="form-label" htmlFor="first-name">First Name</label>
                    <input className="form-input" type="text" id="first-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="last-name">Last Name</label>
                    <input className="form-input" type="text" id="last-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="middle-name">Middle Name</label>
                    <input className="form-input" type="text" id="middle-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="degree-program">Degree Program/Course</label>
                    <select className="form-select" id="degree-program">
                      <option value="">Select Course</option>
                      <option value="BSIT">BS Information Technology</option>
                      <option value="BSBA">BS Business Administration</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="college">College</label>
                    <input className="form-input" type="text" id="college" />
                  </div>
                  <div className="form-group form-group-inline">
                    <div>
                      <label className="form-label" htmlFor="ay-admitted">AY admitted</label>
                      <input className="form-input" type="text" id="ay-admitted" />
                    </div>
                    <div>
                      <label className="form-label" htmlFor="sem-admitted">Sem/AY last admitted</label>
                      <input className="form-input" type="text" id="sem-admitted" />
                    </div>
                  </div>
                  <div className="form-group form-group-vertical">
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
                      <div className="date-picker-modal-overlay" onClick={() => setShowDatePicker(false)}>
                        <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
                          <div className="date-picker-header">
                            <button className="nav-button" onClick={goToPreviousMonth}>&#x2039;</button>
                            <span>{monthNames[currentMonth]} {currentYear}</span>
                            <button className="nav-button" onClick={goToNextMonth}>&#x203A;</button>
                          </div>
                          <div className="calendar-weekdays">
                            {weekDays.map(day => <div key={day} className="weekday-cell">{day}</div>)}
                          </div>
                          <div className="calendar-grid">
                            {daysInCalendar.map((day, index) => (
                              <div
                                key={index}
                                className={`day-cell ${day === null ? 'empty' : ''} ${selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear ? 'selected' : ''}`}
                                onClick={() => handleDateSelect(day)}
                              >
                                {day}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="form-group form-group-vertical">
                    <label className="form-label" htmlFor="permanent-address">Permanent Address</label>
                    <input className="form-input" type="text" id="permanent-address" />
                  </div>
                  <div className="form-group form-group-vertical">
                    <label className="form-label" htmlFor="street-number">Street Number/Name</label>
                    <input className="form-input" type="text" id="street-number" />
                  </div>
                  <button className="submit-form-button">Submit Details</button>
                  <button className="close-form-button" onClick={toggleForm}>Close Form</button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      <footer className="browser-footer">
        <div className="footer-item">
          <span className="footer-text">AA</span>
        </div>
        <div className="footer-item url-display">
          <svg className="footer-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 15v2m-2-6V4m2 0h2m-2 0H8m0 0l-3 3m5-3L9 9m3 0l-3 3m0-6H9.5a1.5 1.5 0 010 3H12V7a1 1 0 00-1-1h-1.5m3 4H14v2.5a1.5 1.5 0 01-3 0V11H12zm0-6V4h2m-2 0H8"></path></svg>
          <span className="footer-url">web1.plm.edu.ph</span>
        </div>
        <div className="footer-actions">
          <svg className="footer-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 13a8 8 0 01-8 8H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-2h5.582m0 0a2 2 0 012 2v5.582m0 0a2 2 0 01-2 2H12"></path></svg>
          <svg className="footer-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <svg className="footer-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
        </div>
      </footer>
    </div>
  );
}

export default App;