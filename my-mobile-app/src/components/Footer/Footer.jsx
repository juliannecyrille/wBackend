import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="browser-footer">
      <div className="footer-social-icons">
        <a href="https://www.facebook.com/PLMOfficialPage" target="_blank" rel="noopener noreferrer">
           <img src="/src/assets/fb.png" alt="Facebook" className="social-icon" />
        </a>
        <a href="https://www.instagram.com/PLM_Intramuros/" target="_blank" rel="noopener noreferrer">
         <img src="/src/assets/insta.png" alt="Instagram" className="social-icon" />
        </a>
        <a href="https://x.com/PLM_Manila" target="_blank" rel="noopener noreferrer">
              <img src="/src/assets/x.png" alt="X" className="social-icon" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
