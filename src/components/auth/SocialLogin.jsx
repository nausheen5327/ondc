import React, { memo } from 'react'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import SocialLogins from '@/components/auth/sign-in/social-login/SocialLogins'
import { Stack } from '@mui/system'

const SocialLogin = (props) => {
    const {
        global,
        handleClose,
        setJwtToken,
        setUserInfo,
        setModalFor,
        handleSuccess,
        setMedium,
        loginMutation,
        handleTokenAfterSignIn,
        setLoginInfo,
        setForWidth,
        all,
        signInWithGoogle
    } = props
    return (
        <>
            
                <Stack
                    alignItems="center"
                    justifyContent="center"
                    spacing={1}
                    sx={{ marginTop: '15px !important' }}
                    width="100%"
                >
                    <SocialLogins
                        socialLogins={global?.social_login}
                        handleParentModalClose={handleClose}
                        setJwtToken={setJwtToken}
                        setUserInfo={setUserInfo}
                        handleSuccess={handleSuccess}
                        setModalFor={setModalFor}
                        handleTokenAfterSignIn = {handleTokenAfterSignIn}
                        setMedium={setMedium}
                        loginMutation={loginMutation}
                        setLoginInfo={setLoginInfo}
                        setForWidth={setForWidth}
                        all={all}
                        signInWithGoogle={signInWithGoogle}
                    />
                </Stack>
            
        </>
    )
}

export default memo(SocialLogin)
