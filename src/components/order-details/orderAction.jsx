import React from 'react';
import { Phone } from 'lucide-react';
import { useTheme } from '@emotion/react';

const OrderActions = ({ storeName = "WITS ONDC TEST STORE", storePhone = "1234567890" }) => {
      const theme = useTheme();
  const handleDownloadInvoice = () => {
    // Handle invoice download
    console.log('Downloading invoice...');
  };

  const handleCallStore = () => {
    window.location.href = `tel:${storePhone}`;
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: window.innerWidth < 640 ? 'column' : 'row',
    gap: '12px'
  };

  const baseButtonStyle = {
    padding: '8px 16px',
    color: 'white', // blue-600
    border: theme.palette.primary.main,
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: 500,
    backgroundColor: theme.palette.primary.main,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    outline: 'none'
  };

  const callButtonStyle = {
    ...baseButtonStyle,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = '#cb5601'; // darker shade on hover
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = theme.palette.primary.main; // back to original color
  };

  return (
    <div style={containerStyle}>
      <button
        onClick={handleDownloadInvoice}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        style={baseButtonStyle}
      >
        Download Invoice
      </button>
      
      <button
        onClick={handleCallStore}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        style={callButtonStyle}
      >
        <Phone size={18} />
        <span>Call {storeName}</span>
      </button>
    </div>
  );
};

export default OrderActions;