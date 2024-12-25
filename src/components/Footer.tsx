
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={footerStyle}>
      <p>© 2024 Mbok Connect. All rights reserved.</p>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  padding: '20px',
  backgroundColor: '#333',
  color: '#fff',
  textAlign: 'center',
  position: 'fixed',
  bottom: '0',
  width: '100%',
};

export default Footer;
