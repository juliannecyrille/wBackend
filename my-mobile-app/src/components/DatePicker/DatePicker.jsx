import React from 'react';
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
  return (
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
  );
}

export default DatePicker;