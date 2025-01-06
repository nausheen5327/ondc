import React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Box } from '@mui/material';

const AddressWarning = ({ address }) => {
  const isAddressIncomplete = !address?.address?.building || !address?.address?.street || !address?.address?.tag ;
  console.log('address in warning',address)
  if (!isAddressIncomplete) {
    return null;
  }

  return (
    <Box sx={{ margin: '16px 0' }}>
      <Alert 
        severity="error"
        icon={<ErrorOutlineIcon sx={{ 
          fontSize: '24px',
          color: '#d32f2f'
        }} />}
        sx={{
          backgroundColor: '#fdeded',
          color: '#d32f2f',
          border: '1px solid #ef5350',
          '& .MuiAlert-message': {
            padding: '8px 0',
          },
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <AlertTitle sx={{
          fontWeight: 600,
          marginBottom: '4px'
        }}>
          Incomplete Address
        </AlertTitle>
        Please complete your address details.
      </Alert>
    </Box>
  );
};

export default AddressWarning;