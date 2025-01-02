import React from 'react';

const CustomerDetails = ({ orderData }) => {
  const containerStyle = {
    fontFamily: 'Arial, sans-serif',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    maxWidth: '800px',
    margin: '10px auto',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '5px'
  };

  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: window.innerWidth > 640 ? '1fr 1fr' : '1fr',
    gap: '5px',
    marginBottom: '5px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: 'white',
    marginBottom: '4px',
    fontWeight: 'bold',

  };

  const valueStyle = {
    fontSize: '10px',
    color: 'white',
    fontWeight: '500'
  };

  const addressStyle = {
    ...valueStyle,
    // marginTop: '8px'
  };

  const sectionStyle = {
    marginBottom: '2px',
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' at');
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Customer Details</h2>
      
      <div style={gridContainerStyle}>
        <div style={sectionStyle}>
          <div style={labelStyle}>Order Number</div>
          <div style={valueStyle}>{orderData?.id}</div>
        </div>
        
        <div style={sectionStyle}>
          <div style={labelStyle}>Payment mode</div>
          <div style={valueStyle}>{orderData.payment?.type === 'ON-ORDER' ? 'Prepaid' : 'COD'}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Customer Name</div>
          <div style={valueStyle}>{orderData.billing?.name}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Phone Number</div>
          <div style={valueStyle}>{orderData.billing?.phone}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Date</div>
          <div style={valueStyle}>{formatDate(orderData.createdAt)}</div>
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={labelStyle}>Delivered To</div>
        <div style={addressStyle}>
          {`${orderData.billing?.address?.building}, ${orderData.billing?.address?.locality}, 
          ${orderData.billing?.address?.city}, ${orderData.billing?.address?.state} 
          ${orderData.billing?.address?.areaCode}`}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;