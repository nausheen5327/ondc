import React, { useEffect, useRef, useState } from 'react'
import { Stack } from '@mui/material'
import { ProfileApi } from '@/hooks/react-query/config/profileApi'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import AccountInformation from './AccountInformation'
import BasicInformationForm from './BasicInformationForm'
import CustomAlert from '../../alert/CustomAlert'
import { useTranslation } from 'react-i18next'
import {
    onErrorResponse,
    onSingleErrorResponse,
} from '@/components/ErrorResponse'
import { useDispatch, useSelector } from 'react-redux'
import { setEditProfile } from '@/redux/slices/editProfile'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import { auth } from '@/firebase'
import { useFireBaseOtpVerify } from '@/hooks/react-query/useFireBaseVerfify'
const BasicInformation = ({ data,handleSubmit }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false)
    const [openEmail, setOpenEmail] = React.useState(false)
    const [verificationId, setVerificationId] = useState(null)
    const [resData, setResData] = React.useState([])
    const [loginValue, setLoginValue] = useState(null)
    const { global } = useSelector((state) => state.globalSettings)
    const recaptchaWrapperRef = useRef(null)


   
    return (
        <Stack
            gap="20px"
            sx={{
                borderRadius: '10px',
            }}
        >
            <BasicInformationForm
                data={data}
                formSubmit={handleSubmit}
                open={open}
                setOpen={setOpen}
                setOpenEmail={setOpenEmail}
                openEmail={openEmail}
                fireBaseId="recaptcha-containera"
                resData={resData}
            />
        </Stack>
    )
}

export default BasicInformation
