import React from 'react';
import { Box, CircularProgress, Backdrop } from '@mui/material';

const LoadingOverlay = ({ open }) => {
  return (
    <Backdrop 
      open={open} 
      sx={{ 
        color: '#fff',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)'
      }}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  );
};

export default LoadingOverlay;