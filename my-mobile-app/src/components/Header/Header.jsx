import React from 'react';
import './Header.css';
import plmLogo from '/plm_logo.svg'; // Directly reference from public folder

function Header({ isFormExpanded }) {
  return (
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
  );
}

export default Header;
