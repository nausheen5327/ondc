import { useTheme } from '@emotion/react';
import React, { useEffect, useState } from 'react';

const OrderActionsGroup = ({handleCancelOrder,handleRaiseIssue,handleGetStatus,handleTrackIssue,trackIssue}) => {
    const theme  = useTheme();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    display: 'flex',
    justifyContent: isMobile?'center':'flex-start',
    alignItems: 'center',
    width: '100%',
    gap: '5px',
    padding: '10px 0'
  };

  const buttonStyle = {
    backgroundColor: theme.palette.primary.main, // primary color - you can adjust this
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    margin: '0px',
    minWidth: '100px',
    fontWeight: '500',
    transition: 'background-color 0.2s ease'
  };

  const handleMouseOver = (e) => {
    e.target.style.backgroundColor = '#cb5601'; // darker shade on hover
  };

  const handleMouseOut = (e) => {
    e.target.style.backgroundColor = theme.palette.primary.main; // back to original color
  };

  return (
    <>
    <div style={containerStyle}>
      <button 
        style={buttonStyle}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={trackIssue?handleTrackIssue:handleRaiseIssue}
      >
        {trackIssue?'Track Issue':'Raise Issue'}
      </button>
      <button 
        style={buttonStyle}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleGetStatus}
      >
        Get Status
      </button>
      <button 
        style={buttonStyle}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onClick={handleCancelOrder}
      >
        Cancel Order
      </button>
    </div>
    </>
  );
};

export default OrderActionsGroup;