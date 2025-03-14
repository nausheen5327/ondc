import { Modal, Box, IconButton, useTheme, Stack } from '@mui/material'
import React, { useEffect, useReducer, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/slices/customer'
import { useMutation, useQuery } from 'react-query'
import { ProfileApi } from '@/hooks/react-query/config/profileApi'
import { onErrorResponse, onSingleErrorResponse } from '../ErrorResponse'
import { setWishList } from '@/redux/slices/wishList'
import { useWishListGet } from '@/hooks/react-query/config/wish-list/useWishListGet'
import { toast } from 'react-hot-toast'
import { loginSuccessFull } from '@/utils/ToasterMessages'
import { setToken } from '@/redux/slices/userToken'
import { t } from 'i18next'
import PhoneInputForm from './sign-in/social-login/PhoneInputForm'
import ForgotPassword from './forgot-password/ForgotPassword'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import CloseIcon from '@mui/icons-material/Close'
import { CustomBoxForModal } from './auth.style'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import AddUserInfo from '@/components/auth/AddUserInfo'
import { useUpdateUserInfo } from '@/hooks/react-query/social-login/useUpdateUserInfo'
import ExitingUser from '@/components/auth/ExitingUser'
import { AuthApi } from '@/hooks/react-query/config/authApi'
import { getGuestId } from '@/components/checkout-page/functions/getGuestUserId'
import { auth } from '@/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

const SignInPage = dynamic(() => import('./sign-in'))

const SignUpPage = dynamic(() => import('./sign-up'))

export const setUpRecaptcha = () => {
    if (document.getElementById('recaptcha-container')) {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'recaptcha-container',
                {
                    size: 'invisible',
                    callback: (response) => {
                        console.log('Recaptcha verified', response)
                    },
                    'expired-callback': () => {
                        window.recaptchaVerifier?.reset()
                    },
                },
                auth
            )
        } else {
            window.recaptchaVerifier.clear()
            window.recaptchaVerifier = null
            // setUpRecaptcha()
        }
    }
}
const AuthModal = ({
    open,
    handleClose,
    signInSuccess,
    modalFor,
    setModalFor,
    cartListRefetch,
}) => {
    const { openMapDrawer, global } = useSelector(
        (state) => state.globalSettings
    )

    const theme = useTheme()
    const { userInfo: fbUserInfo, jwtToken: fbJwtToken } = useSelector(
        (state) => state.fbCredentialsStore
    )
    const [forWidth, setForWidth] = useState(true)
    const [loginInfo, setLoginInfo] = useState({})
    const [signInPage, setSignInPage] = useState(true)
    const [userInfo, setUserInfo] = useState(null)
    const [jwtToken, setJwtToken] = useState(null)
    const [medium, setMedium] = useState('')
    const [verificationId, setVerificationId] = useState(null)
    const user = medium === 'google' ? userInfo : fbUserInfo
    const jwt = medium === 'google' ? jwtToken : fbJwtToken
    const dispatch = useDispatch()
    const recaptchaWrapperRef = useRef(null)

    useEffect(() => {
        setUpRecaptcha()
        return () => {
            if (recaptchaWrapperRef.current) {
                recaptchaWrapperRef.current.clear() // Clear Recaptcha when component unmounts
                recaptchaWrapperRef.current = null
            }
        }
    }, [])

    
    const handleModal = () => {
        if (modalFor === 'sign-in') {
            return (
                <SignInPage
                    signInSuccess={signInSuccess}
                    handleClose={handleClose}
                    setModalFor={setModalFor}
                    setSignInPage={setSignInPage}
                    cartListRefetch={cartListRefetch}
                    setJwtToken={setJwtToken}
                    setUserInfo={setUserInfo}
                    setMedium={setMedium}
                    setForWidth={setForWidth}
                    setLoginInfo={setLoginInfo}
                    verificationId={verificationId}
                    fireBaseId="recaptcha-container"
                />
            )
        } else if (modalFor === 'phone_modal') {
            return (
                <>
                    {user && jwt?.clientId && (
                        <PhoneInputForm
                            userInfo={user}
                            jwtToken={jwt}
                            global={global}
                            medium={medium}
                            handleRegistrationOnSuccess={
                                handleRegistrationOnSuccess
                            }
                            setModalFor={setModalFor}
                            setForWidth={setForWidth}
                        />
                    )}
                </>
            )
        } else if (modalFor === 'forgot_password') {
            return <ForgotPassword setModalFor={setModalFor} />
        } else if (modalFor === 'user_info') {
            return (
                <AddUserInfo
                    global={global}
                    loginInfo={loginInfo}
                    formSubmitHandler={handleUpdateUserInfo}
                    isLoading={isLoading}
                    userInfo={user}
                />
            )
        } else if (modalFor === 'is_exist_user') {
            return (
                <ExitingUser
                    global={global}
                    loginInfo={loginInfo}
                    formSubmitHandler={handleSubmitExistingUser}
                    isLoading={isLoading}
                    setModalFor={setModalFor}
                    userInfo={user}
                    jwtToken={jwt}
                    medium={medium}
                />
            )
        } else {
            return (
                <SignUpPage
                    handleClose={handleClose}
                    setSignInPage={setSignInPage}
                    setModalFor={setModalFor}
                    setJwtToken={setJwtToken}
                    setUserInfo={setUserInfo}
                    handleSuccess={handleSuccess}
                    setMedium={setMedium}
                    verificationId={verificationId}
                    sendOTP={sendOTP}
                    setLoginInfo={setLoginInfo}
                    setForWidth={setForWidth}
                />
            )
        }
    }

    return (
        <Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <CustomBoxForModal
                    maxWidth={forWidth ? '757px' : '428px'}
                    padding="30px 64px 43px 64px "
                >
                    
                    <div ref={recaptchaWrapperRef}>
                        <div id="recaptcha-container"></div>
                    </div>
                    {handleModal()}
                </CustomBoxForModal>
            </Modal>
        </Box>
    )
}

export default AuthModal
