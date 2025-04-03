import React from 'react';
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';

const FloatingContinueButton = ({ onClick }) => {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '16px',
        backgroundColor: theme.palette.background.default,
        borderTop: `1px solid ${theme.palette.divider}`,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0px -4px 10px rgba(0, 0, 0, 0)'
      }}
    >
      <Button
        variant="contained"
        color="primary"
        sx={{
          borderRadius: '8px',
          width: isSmall ? '100%' : '320px',
          height: '48px',
          textTransform: 'none',
          fontSize: '16px',
          fontWeight: 500
        }}
        onClick={onClick}
      >
        Continue
      </Button>
    </Box>
  );
};

export default FloatingContinueButton;