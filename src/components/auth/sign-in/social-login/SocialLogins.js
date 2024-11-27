import React, { memo, useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import GoogleLoginComp from './GoogleLoginComp'
import FbLoginComp from './FbLoginComp'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'

const SocialLogins = (props) => {
    const {
        socialLogins,
        handleParentModalClose,
        setJwtToken,
        setUserInfo,
        handleSuccess,
        handleTokenAfterSignIn,
        setModalFor,
        setMedium,
        setLoginInfo,
        setForWidth,
        all,
        signInWithGoogle
    } = props
    const { global } = useSelector((state) => state.globalSettings)
    const [isSingle, setIsSingle] = useState(false)
    const { t } = useTranslation()
    useEffect(() => {
        if (socialLogins) {
            let length = 0
            socialLogins.map((item) => {
                if (item.status === true) {
                    length = length + 1
                }
            })
            if (length > 1) {
                setIsSingle(false)
            } else {
                setIsSingle(true)
            }
        }
    }, [])
    return (
        <CustomStackFullWidth
            alignItems="center"
            justifyContent="center"
            gap="1.5rem"
        >
            <GoogleLoginComp
                            handleSuccess={handleSuccess}
                            handleParentModalClose={handleParentModalClose}
                            global={global}
                            handleTokenAfterSignIn = {handleTokenAfterSignIn}
                            setJwtToken={setJwtToken}
                            setUserInfo={setUserInfo}
                            setModalFor={setModalFor}
                            setMedium={setMedium}
                            isSingle={isSingle}
                            setLoginInfo={setLoginInfo}
                            setForWidth={setForWidth}
                            all={all}
                            signInWithGoogle={signInWithGoogle}
                        />
        </CustomStackFullWidth>
    )
}

SocialLogins.propTypes = {}

export default memo(SocialLogins)
