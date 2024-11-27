import React from 'react';
import { alpha, Stack, Typography } from '@mui/material';
import { t } from 'i18next';
import { useTheme } from '@mui/styles';

const Line = ({ type }) => {
    const theme = useTheme();
    const isSignIn = type === 'signIn';

    return (
        <Stack
            position="relative"
            width={isSignIn ? { xs: '100%', sm: '100%', md: '2px' } : '100%'}
            height={isSignIn ? { xs: '2px', sm: '2px', md: '300px' } : '2px'}
            backgroundColor={alpha(theme.palette.neutral[400], 0.5)}
            marginInline={{ xs: '0px', sm: '0px', md: isSignIn ? '14px' : '0px' }}
        >
            <Stack
                position="absolute"
                minWidth="max-content"
                top="50%"
                left="50%"
                sx={{
                    transform: isSignIn
                        ? 'rotate(-90deg) translate(-50%, -50%)'
                        : 'translate(-50%, -50%)',
                    paddingInline: '12px',
                    transformOrigin: '0% 0%',
                    backgroundColor: theme.palette.background.paper,
                    [theme.breakpoints.down('md')]: {
                        transform: isSignIn ? 'rotate(0deg) translate(-50%, -50%)' : 'translate(-50%, -50%)',
                    },
                }}
            >
                <Typography
                    fontSize="14px"
                    color={theme.palette.neutral[400]}
                >
                    {isSignIn ? t('Or Login with') : t('Or Sign Up with')}
                </Typography>
            </Stack>
        </Stack>
    );
};

export default Line;
