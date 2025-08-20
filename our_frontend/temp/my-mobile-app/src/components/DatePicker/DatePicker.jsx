import React, { useState } from 'react';
import './DatePicker.css';

function DatePicker({
  setShowDatePicker,
  selectedDate,
  handleDateSelect,
  currentMonth,
  setCurrentMonth,
  currentYear,
  setCurrentYear,
  goToPreviousMonth,
  goToNextMonth,
  generateDaysInMonth,
  monthNames,
  weekDays,
  daysInCalendar
}) {
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  // Generate a range of years (e.g., 1980 to currentYear+5)
  const startYear = 1980;
  const endYear = new Date().getFullYear() + 5;
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);

  return (
    <div className="date-picker-modal-overlay" onClick={() => setShowDatePicker(false)}>
      <div className="date-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="calendar-header">
          <button onClick={goToPreviousMonth} disabled={showYearSelector || showMonthSelector}>&lt;</button>
          <span
            className="calendar-year-label"
            onClick={() => setShowYearSelector(true)}
            style={{ cursor: 'pointer', fontWeight: 'bold' }}
          >
            {monthNames[currentMonth]} {currentYear}
          </span>
          <button onClick={goToNextMonth} disabled={showYearSelector || showMonthSelector}>&gt;</button>
        </div>

        {showYearSelector ? (
          <div className="year-selector">
            {years.map((year) => (
              <button
                key={year}
                className={`year-option${year === currentYear ? ' selected' : ''}`}
                onClick={() => {
                  setCurrentYear(year);
                  setShowYearSelector(false);
                  setShowMonthSelector(true);
                }}
              >
                {year}
              </button>
            ))}
          </div>
        ) : showMonthSelector ? (
          <div className="month-selector">
            {monthNames.map((month, idx) => (
              <button
                key={month}
                className={`month-option${idx === currentMonth ? ' selected' : ''}`}
                onClick={() => {
                  setCurrentMonth(idx);
                  setShowMonthSelector(false);
                }}
              >
                {month}
              </button>
            ))}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export default DatePicker;