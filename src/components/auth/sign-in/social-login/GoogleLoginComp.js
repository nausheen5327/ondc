import React, { useEffect, useState } from 'react'
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router';
import CustomModal from '../../../custom-modal/CustomModal'
import OtpForm from '../../forgot-password/OtpForm'
import { toast } from 'react-hot-toast'
import { useVerifyPhone } from '@/hooks/react-query/otp/useVerifyPhone'
import { onErrorResponse } from '../../../ErrorResponse'
// import { googleClientId } from '@/utils/staticCredentials'
import { alpha, styled, Typography } from '@mui/material'
import OutlinedInput from '@mui/material/OutlinedInput'
import { Stack } from '@mui/system'
import { t } from 'i18next'
import CustomImageContainer from '../../../CustomImageContainer'
import googleLatest from '../../../../../public/static/Google Logo.png'
import { CustomStackFullWidth } from '../../../../styled-components/CustomStyles.style'
import { getGuestId } from '@/components/checkout-page/functions/getGuestUserId'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster'
import { RoundaboutLeft } from '@mui/icons-material';
// import { gapi } from 'gapi-scrip
// import { gapi } from 'gapi-script'
export const CustomGoogleButton = styled(Stack)(({ theme, width }) => ({
    width: '100%',
    backgroundColor: theme.palette.neutral[100],
    height: '45px',
    justifyContent: 'center',
    borderRadius: '10px',
    padding: '10px',
    color: theme.palette.neutral[600],
    boxShadow: `0px 2px 3px 0px rgba(0, 0, 0, 0.17), 0px 0px 3px 0px rgba(0, 0, 0, 0.08)`,
    //maxWidth: '355px',

    transition: 'box-shadow 0.3s',
    '&:hover': {
        boxShadow: `0px 5px 10px 0px rgba(0, 0, 0, 0.3), 0px 2px 5px 0px rgba(0, 0, 0, 0.15)`,
    },
}))
const GoogleLoginComp = (props) => {
    const {
        handleSuccess,
        signInWithGoogle,
        setModalFor,
        setMedium,
        all,
    } = props

    const router = useRouter()
    const [loginValue, setLoginValue] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [openOtpModal, setOpenOtpModal] = useState(false)
    const [otpData, setOtpData] = useState({ phone: '' })
    const [mainToken, setMainToken] = useState(null)

    // const { mutate } = usePostEmail()
    const auth = getAuth();
    const provider = new GoogleAuthProvider();


    // const clientId = googleClientId
    const handleToken = (response) => {
        if (response?.token) {
            handleSuccess(response.token)
        } else {
            setMedium('google')
            setModalFor('phone_modal')
            setOpenModal(true)
        }
    }

    useEffect(() => {
        if (otpData?.phone !== '') {
            setOpenOtpModal(true)
        }
    }, [otpData])

    
    const setButtonWidth = () => {
        const screenWidth = window.innerWidth
        return screenWidth <= 600 ? '236px' : all ? '267px' : '300px' // 600px is the breakpoint for 'xs' and 'md'
    }

    // const handleCallBackResponse = (res) => {
    //     console.log(res, "response from firebase");
    
    //     // Decode the JWT from Firebase if you have the ID token
    //     const userObj = jwtDecode(res.user.stsTokenManager.accessToken);
    //     setJwtToken(res.user.stsTokenManager.accessToken); // Use the access token for your JWT
    //     setUserInfo(userObj);
    //     localStorage.setItem('user',JSON.stringify(res.user.reloadUserInfo))
    
    //     // Create a temporary value object based on the payload structure
    //     const tempValue = {
    //         email: res.user.email, // Directly from the user object
    //         token: res.user.stsTokenManager.accessToken, // Use accessToken for authentication
    //         unique_id: res.user.uid, // Use Firebase UID
    //         medium: 'google', // Hardcoded as Google
    //         login_type: 'social', // Hardcoded as social
    //         guest_id: loginValue?.guest_id ?? getGuestId(), // Use existing guest ID or generate one
    //     };
    
    //     // Set the login value in your state
    //     setLoginValue(tempValue);
    
    //     //redirect
    //     handleTokenAfterSignIn(tempValue);

    //     // router.replace('/home'); // Use router.replace to redirect to the home page


    // };
    
    

    // const signInWithGoogle = () => {
    //     signInWithPopup(auth, provider)
    //         .then((result) => {
    //             handleCallBackResponse(result);
    //         })
    //         .catch((error) => {
    //             if (error.code !== "auth/popup-closed-by-user") {
    //                 const errorMessage = error.message;
    //                 CustomToaster('error',errorMessage);
    //               }
    //         })
    //         .finally(() => {
    //             // setIsLoading(false);
    //         });
    // };

   
    return (
        <Stack width={'100%'} maxWidth="355px">
            <div style={{ position: 'relative' }}>
                {/* <div
                    style={{
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        filter: 'opacity(0)',
                        zIndex: 999,
                    }}
                >
                    <div id="signInDiv"></div>
                </div> */}

                <CustomGoogleButton direction="row" spacing={1} onClick={signInWithGoogle}>
                    <CustomImageContainer
                        src={googleLatest.src}
                        alt="facebook"
                        height="24px"
                        width="24px"
                        objectFit="cover"
                        borderRadius="50%"
                    />
                    <Typography fontSize="14px" fontWeight="600">
                        {t('Continue with Google')}
                    </Typography>
                </CustomGoogleButton>
            </div>

            {/* <CustomModal
                openModal={openOtpModal}
                setModalOpen={setOpenOtpModal}
            >
                <OtpForm
                    data={otpData?.phone}
                    formSubmitHandler={formSubmitHandler}
                    isLoading={isLoading}
                    reSendOtp={handleCallBackResponse}
                    loginValue={loginValue}
                />
            </CustomModal> */}
        </Stack>
    )
}

GoogleLoginComp.propTypes = {}

export default GoogleLoginComp
