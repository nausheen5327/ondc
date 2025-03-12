import React, { useEffect, useReducer, useState } from 'react'
import Typography from '@mui/material/Typography'

import OutlinedInput from '@mui/material/OutlinedInput'
import { useDispatch, useSelector } from 'react-redux'
import { useMutation, useQuery } from 'react-query'
import { useTheme } from '@mui/material/styles'
import { useWishListGet } from '@/hooks/react-query/config/wish-list/useWishListGet'
import 'react-phone-input-2/lib/material.css'
import { v4 as uuidv4 } from "uuid";
import { useTranslation } from 'react-i18next'
import {
    CustomColouredTypography,
    CustomLink,
    CustomStackFullWidth,
} from '@/styled-components/CustomStyles.style'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useRouter } from 'next/router'
import { setWishList } from '@/redux/slices/wishList'
import CustomImageContainer from '../../CustomImageContainer'
import { CustomTypography } from '../../custom-tables/Tables.style'
import { CustomBoxForModal, LoginWrapper } from '../auth.style'
import { ProfileApi } from '@/hooks/react-query/config/profileApi'
import { setUser } from '@/redux/slices/customer'
import { jwtDecode } from "jwt-decode";
import { RTL } from '../../RTL/RTL'
import { loginSuccessFull } from '@/utils/ToasterMessages'
import { onErrorResponse, onSingleErrorResponse } from '../../ErrorResponse'
import CustomModal from '../../custom-modal/CustomModal'
import OtpForm from '../forgot-password/OtpForm'
import { useVerifyPhone } from '@/hooks/react-query/otp/useVerifyPhone'
import { setToken } from '@/redux/slices/userToken'
import { getGuestId } from '../../checkout-page/functions/getGuestUserId'
// import { auth } from '@/firebase'
import { Stack, alpha, styled } from '@mui/material'
import { CustomToaster } from '@/components/custom-toaster/CustomToaster'
import OtpLogin from '@/components/auth/OtpLogin'
import ManualLogin from '@/components/auth/ManualLogin'
import SocialLogin from '@/components/auth/SocialLogin'
import Line from '@/components/auth/Line'
import googleLatest from '../../../../public/static/fi_6993593.png'
import { t } from 'i18next'
import { CustomGoogleButton } from '@/components/auth/sign-in/social-login/GoogleLoginComp'

import {
    loginInitialState,
    loginReducer,
    ACTIONS,
} from '@/components/auth/states'
import {
    getActiveLoginStatus,
    getLoginUserCheck,
} from '@/components/auth/loginHelper'
import { checkInput, formatPhoneNumber } from '@/utils/customFunctions'
import { RecaptchaVerifier, signInWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth'
import { useFireBaseOtpVerify } from '@/hooks/react-query/useFireBaseVerfify'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { AddCookie } from '@/utils/cookies'
import { setAuthModalOpen } from '@/redux/slices/global'
import { useAuthData } from '../authSuccessHandler'
import { postCall } from '@/api/MainApi'
import { setCustomerInfo, setlocation } from '@/redux/slices/addressData'
const auth = getAuth();
const provider = new GoogleAuthProvider().setCustomParameters({
    prompt: 'select_account'
});;

export const CustomSigninOutLine = styled(OutlinedInput)(
    ({ theme, width, borderradius }) => ({
        width: width || '355px',
        borderRadius: borderradius ?? '4px',
        '&.MuiOutlinedInput-root': {
            '& .MuiOutlinedInput-input': {
                padding: '12.5px 0px !important',
                fontSize: '14px',
                fontWeight: '400',
                alignItems: 'center',
                '&::placeholder': {
                    color: alpha(theme.palette.neutral[400], 0.7), // Set placeholder color to red
                },
            },
            '& fieldset': {
                borderColor: alpha(theme.palette.neutral[400], 0.5),
                borderWidth: '1px',
            },
            '&:hover fieldset': {
                borderColor: alpha(theme.palette.neutral[600], 0.7),
            },
            '&.Mui-focused fieldset': {
                borderColor: alpha(theme.palette.primary.main, 0.7),
                borderWidth: '1px',
            },
        },

        [theme.breakpoints.down('sm')]: {
            width: '100%',
        },
    })
)

const SignInPage = ({
    setSignInPage,
    handleClose,
    signInSuccess,
    setModalFor,
    setJwtToken,
    setUserInfo,
    handleSuccess,
    setMedium,
    setForWidth,
    setLoginInfo,
    verificationId,
    sendOTP,
    fireBaseId,
}) => {
    const { fetchUserData } = useAuthData();

    const [showPassword, setShowPassword] = useState(false)
    const { t } = useTranslation()
    const theme = useTheme()
    const dispatch = useDispatch()
    const { global } = useSelector((state) => state.globalSettings)
    const businessLogo = global?.base_urls?.business_logo_url
    const router = useRouter()
    const guestId = getGuestId()
    const [isRemember, setIsRemember] = useState(false)
    const [openOtpModal, setOpenOtpModal] = useState(false)
    const [otpData, setOtpData] = useState({ type: 'phone' })
    const [mainToken, setMainToken] = useState(null)
    const [loginValue, setLoginValue] = useState(null)
    const [state, loginDispatch] = useReducer(loginReducer, loginInitialState)
    const location = useSelector(state=>state.addressData.location)
    let userDatafor = undefined
    if (typeof window !== 'undefined') {
        userDatafor = JSON.parse(localStorage.getItem('userDatafor'))
    }
    const customerInfo = useSelector((state) => state.addressData.customerInfo)
    
    const loginFormik = useFormik({
        initialValues: {
            email_or_phone: '',
            password: userDatafor ? userDatafor.password : '',
            tandc: false,
        },
        validationSchema: Yup.object({
            email_or_phone: Yup.string()
                .required(t('Email or phone number is required'))
                .test(
                    'email-or-phone',
                    t('Must be a valid email or phone number'),
                    function (value) {
                        // Regular expressions for validation
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Basic email regex
                        const phoneRegex = /^\+?[1-9]\d{1,14}$/ // E.164 format for phone numbers

                        // Check if value matches either email or phone regex
                        return emailRegex.test(value) || phoneRegex.test(value)
                    }
                ),
            password: Yup.string()
                .min(8, t('Password is too short - should be 8 chars minimum.'))
                .required(t('Password is required')),
        }),
        onSubmit: async (values, helpers) => {
            try {
                if (isRemember) {
                    localStorage.setItem('userDatafor', JSON.stringify(values))
                }
                formSubmitHandler({ ...values, login_type: 'manual' })
            } catch (err) {}
        },
    })
    const otpLoginFormik = useFormik({
        initialValues: {
            phone: userDatafor? userDatafor.phone : `+91${location?.descriptor?.phone}`,
        },
        validationSchema: Yup.object({
            phone: Yup.string()
                .required(t('Please give a phone number'))
                .min(13, 'number must be 10 digits'),
        }),
        onSubmit: async (values, helpers) => {
            try {
                if (isRemember) {
                    localStorage.setItem('userDatafor', JSON.stringify(values))
                }
                formSubmitHandler({ ...values, login_type: 'otp' })
            } catch (err) {}
        },
    })
    const otpHandleChange = (value) => {
        otpLoginFormik.setFieldValue('phone', `${value}`)
    }

    const handleCallBackResponse = (res) => {
        console.log(res, "response from firebase");
    
        // Decode the JWT from Firebase if you have the ID token
        const userObj = jwtDecode(res.user.stsTokenManager.accessToken);
        setJwtToken(res.user.stsTokenManager.accessToken); // Use the access token for your JWT
        setUserInfo(userObj);
        localStorage.setItem('user',JSON.stringify(res.user.reloadUserInfo))
    
        const tempValue = {
            email: res.user.email, // Directly from the user object
            token: res.user.stsTokenManager.accessToken, // Use accessToken for authentication
            unique_id: res.user.uid, // Use Firebase UID
            medium: 'google', // Hardcoded as Google
            login_type: 'social', // Hardcoded as social
            guest_id: loginValue?.guest_id ?? getGuestId(), // Use existing guest ID or generate one
        };
    
        // Set the login value in your state
        setLoginValue(tempValue);
    
        //redirect
        handleTokenAfterSignIn(res);

        // router.replace('/home'); // Use router.replace to redirect to the home page


    };
    console.log('login value is...',loginValue)
    

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log('response from google', result)
                handleCallBackResponse(result);
            })
            .catch((error) => {
                if (error.code !== "auth/popup-closed-by-user") {
                    const errorMessage = error.message;
                    CustomToaster('error',errorMessage);
                  }
            })
            .finally(() => {
                // setIsLoading(false);
            });
    };

    
    

    // useEffect(() => {
    //     if (otpData?.type !== '') {
    //         setOpenOtpModal(true)
    //     }
    // }, [otpData])

    const handleTokenAfterSignIn = async (response) => {
        if (response) {
            localStorage.setItem("transaction_id", uuidv4());
            const { displayName, email, photoURL, uid } = response.user;
            const updatedCustomerInfo = {
                ...customerInfo,
                customer: {
                    ...customerInfo?.customer,
                    name: displayName,
                    email: email
                }
            }
            
            // Dispatch action to update Redux store
            dispatch(setCustomerInfo(updatedCustomerInfo))
            AddCookie("token", response.user.stsTokenManager.accessToken);
            AddCookie(
              "user",
              JSON.stringify({ name: displayName, id: uid, email, photoURL })
            );
            localStorage.setItem('token', response.user.stsTokenManager.accessToken)
            dispatch(setToken(response.user.stsTokenManager.accessToken));
            CustomToaster('success', loginSuccessFull)
            dispatch(setToken(response.token))
            dispatch(setAuthModalOpen(false));
            fetchUserData();
                // router.push('/')
        }
    }

    const formSubmitHandler = async(values) => {
        const numberOrEmail = checkInput(values?.email_or_phone)
        console.log("hello...",numberOrEmail, values)
        let newValues = {}
        if (values?.login_type === 'otp') {
            newValues = {
                ...values,
                type: 'phone',
            }
        } else {
            newValues = {
                ...values,
                field_type: numberOrEmail,
                type: numberOrEmail,
            }
        }
        setLoginValue(newValues)
        try {
            const data = await postCall('/auth/start',{
                p_n: values?.phone
              })
              console.log('response from generate is...',data);
            if(!data.i_s){
                CustomToaster('error',"Please recheck your phone number");
                return;
            }
            setMainToken(data?.token);
            setOpenOtpModal(true)
            console.log("response from api call is...", data);
        } catch (error) {
            CustomToaster('error', 'Failed to generate OTP, Please try again');
        }
        

    }

    const handleOnChange = (value) => {
        const isPlusCheck = formatPhoneNumber(value)
        loginFormik.setFieldValue('email_or_phone', `${isPlusCheck}`)
    }

    const gotoForgotPassword = () => {
        router.push('/forgot-password')
        handleClose()
    }
    const handleCheckbox = (e) => {
        loginFormik.setFieldValue('tandc', e.target.checked)
    }

    const rememberMeHandleChange = (e) => {
        if (e.target.checked) {
            setIsRemember(true)
        }
    }
    const handleClick = () => {
        window.open('https://policy.nazara.com/terms.html')
    }
   

  

    const handleLoginInfo = ( response,values) => {
        // Common logic to set login info based on response
        setLoginInfo({
            phone: values.phone,
            otp: values?.reset_token,
        })        
        // Determine which modal to show based on the response
            setOpenOtpModal(false)
            let token = mainToken.split(' ')[1];
            const userObj = jwtDecode(token);
            // setJwtToken(token); // Use the access token for your JWT
            // setUserInfo(userObj);
            localStorage.setItem('user',JSON.stringify(response.user))
            localStorage.setItem("transaction_id", uuidv4());
            const { displayName, email, uid } = response.user;
            AddCookie("token", token);
            AddCookie(
                "user",
                JSON.stringify({ name: displayName, id: uid, email })
              );
            localStorage.setItem('token',token )
            dispatch(setToken(token));
            CustomToaster('success', loginSuccessFull)
            dispatch(setAuthModalOpen(false));
            fetchUserData();
            // handleClose();
        
    }
    const otpFormSubmitHandler = async(values) => {
        let phone  = loginValue?.phone;
        phone = phone?.substring(3);
        try {
            const response = await postCall('/auth/validate',{
                p_n: phone,
                otp: values?.reset_token,
                user: {
                    uid: `user+${phone}`,
                    expiresIn: "3600",
                    idToken: mainToken?.split(" ")[1],
                    localId: `user+${phone}`,
                }
              })
              console.log("response from validation is", response)
             if(!response?.statusCode==='200'){
                CustomToaster('error','Invalid Otp')
                return;
             } 
            handleLoginInfo(response,{
                phone: phone,
                otp: values?.reset_token
            })
            //   handleLoginWithOtpInfo(res, values)
        } catch (error) {
            CustomToaster('error','Invalid OTP, please try again')
        }
    }

    const selectedOtp = () => {
        loginDispatch({
            type: ACTIONS.setActiveLoginType,
            payload: {
                otp: true,
                manual: false,
                social: false,
            },
        })
    }
    useEffect(() => {
            loginDispatch({
                type: ACTIONS.setActiveLoginType,
                payload: {
                    otp:  true,
                    manual:  true,
                    social:  true,
                   
                },
            })
        
    }, [])

    useEffect(() => {
        getActiveLoginStatus(state, setForWidth, loginDispatch)
    }, [state.activeLoginType])

    const handleSignup = () => {
        setForWidth(true)
        setModalFor('sign-up')
    }
    console.log(state.status,"test");
    const loginView = () => {
        const handleCloseAuth=()=>{
            console.log("helloooooooooooooooooooooooooooooo")
            dispatch(setAuthModalOpen(false));
        }
        return (
            <LoginWrapper direction={{ xs: 'column', md: 'row' }}>
                 <button 
                onClick={handleClose}
                style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '8px',
                    borderRadius: '50%',
                    border: 'none',
                    color: 'white',
                    background: 'transparent',
                    cursor: 'pointer',
                    zIndex: 1
                }}
                aria-label="Close"
            >
                ✕
            </button>
                <Stack
                    sx={{
                        flexGrow: { xs: 'none', sm: 'none', md: '1' },
                        width: { xs: '100%', sm: '100%', md: 0 },
                    }}
                >
                    <OtpLogin
                otpHandleChange={otpHandleChange}
                otpLoginFormik={otpLoginFormik}
                global={global}
                handleClick={handleClick}
                rememberMeHandleChange={rememberMeHandleChange}
                fireBaseId={fireBaseId}
            />
        
                </Stack>
                
            </LoginWrapper>
        )
    }

    const languageDirection = 'ltr'
    return (
        <Stack>
            <RTL direction={languageDirection}>
                <CustomStackFullWidth
                    alignItems="center"
                    spacing={{ xs: 0.5, md: 1 }}
                >
                    <CustomStackFullWidth spacing={{ xs: 1, md: 4 }}>
                        <CustomStackFullWidth alignItems="center">
                            <CustomImageContainer
                                src={process.env.NEXT_PUBLIC_LOGO}
                                width="50%"
                                height="70px"
                                alt="NazaraSDK"
                            />
                        </CustomStackFullWidth>
                        
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: '18px',
                                    paddingBottom: '5px',
                                    color: (theme) =>
                                        theme.palette.neutral[1000],
                                }}
                                textAlign="left"
                            >
                                {t('Login')}
                            </Typography>
                        
                    </CustomStackFullWidth>
                    <CustomStackFullWidth
                        alignItems="center"
                        spacing={{ xs: 1, md: 2 }}
                    >
                        {loginView()}
                    </CustomStackFullWidth>
                    {state.status === 'manual' && (
                        <CustomStackFullWidth
                            alignItems="center"
                            spacing={0.5}
                            sx={{ paddingTop: '10px !important' }}
                        >
                            <CustomStackFullWidth
                                direction="row"
                                alignItems="center"
                                justifyContent="center"
                                spacing={0.5}
                            >
                                <CustomTypography fontSize="14px">
                                    {t("Don't have an account?")}
                                </CustomTypography>
                                <CustomLink
                                    onClick={handleSignup}
                                    variant="body2"
                                >
                                    {t('Sign Up')}
                                </CustomLink>
                            </CustomStackFullWidth>
                        </CustomStackFullWidth>
                    )}
                </CustomStackFullWidth>
            </RTL>
            <CustomModal
                openModal={openOtpModal}
                setModalOpen={setOpenOtpModal}
            >
                <OtpForm
                    data={loginValue?.phone}
                    formSubmitHandler={otpFormSubmitHandler}
                    handleClose={() => setOpenOtpModal(false)}
                    reSendOtp={formSubmitHandler}
                    loginValue={loginValue}
                />
            </CustomModal>
        </Stack>
    )
}

export default SignInPage
