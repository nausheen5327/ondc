// import React from 'react'
// import { DeliveryCaption, DeliveryTitle } from './CheckOut.style'
// import { useTranslation } from 'react-i18next'
// import FormControl from '@mui/material/FormControl'
// import RadioGroup from '@mui/material/RadioGroup'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import Radio from '@mui/material/Radio'
// import DeliveryAddress from './DeliveryAddress'
// import {
//     CustomPaperBigCard,
//     CustomStackFullWidth,
// } from "@/styled-components/CustomStyles.style"
// import OrderType from './order-type'
// import AdditionalAddresses from './AdditionalAddresses'
// import { Typography } from "@mui/material";
// import CheckoutSelectedAddressGuest from "./guest-user/CheckoutSelectedAddressGuest";
// import { getToken } from "./functions/getGuestUserId";
// import useGetMostTrips from "@/hooks/react-query/useGetMostTrips";
// import { useSelector } from 'react-redux'

// const CustomerInfoPage = () => {
//     const { t } = useTranslation()
//     const location = useSelector((state)=>state.addressData.location)

//     console.log('location in cart',location);

    
//     return (
//         <CustomPaperBigCard>
//             <CustomStackFullWidth>
//                 <DeliveryTitle>
//                     {t('CUSTOMER INFO')}
//                 </DeliveryTitle>
//                 <Typography variant="body" sx={{ fontWeight: 600 }}>
//                 {location?.descriptor.name}
//               </Typography>
//               <Typography variant="body" sx={{ fontWeight: 600 }}>
//               {location.descriptor.email}
//               </Typography>
//             </CustomStackFullWidth>
//         </CustomPaperBigCard>
//     )
// }

// CustomerInfoPage.propTypes = {}

// export default React.memo(CustomerInfoPage)

import React, { useState } from 'react'
import { DeliveryCaption, DeliveryTitle } from './CheckOut.style'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import { 
    Typography,
    TextField,
    Button,
    Box
} from "@mui/material"

const CustomerInfoPage = () => {
    const { t } = useTranslation()
    const location = useSelector((state) => state.addressData.location)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [errors, setErrors] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.name) newErrors.name = t('Name is required')
        if (!formData.email) {
            newErrors.email = t('Email is required')
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = t('Invalid email format')
        }
        if (!formData.phone) {
            newErrors.phone = t('Phone is required')
        } else if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = t('Invalid phone number')
        }
        return newErrors
    }

    const handleSubmit = () => {
        const formErrors = validateForm()
        if (Object.keys(formErrors).length === 0) {
            // Handle form submission here
            console.log('Form submitted:', formData)
        } else {
            setErrors(formErrors)
        }
    }

    return (
        <CustomPaperBigCard>
            <CustomStackFullWidth spacing={3}>
                <DeliveryTitle>
                    {t('CUSTOMER INFO')}
                </DeliveryTitle>
                
                {location?.descriptor?.name && location?.descriptor?.email ? (
                    <>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {location.descriptor.name}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {location.descriptor.email}
                        </Typography>
                    </>
                ) : (
                    <Box component="form" sx={{ width: '100%' }} spacing={3}>
                        <TextField
                            fullWidth
                            label={t('Name')}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label={t('Email')}
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label={t('Phone')}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            margin="normal"
                        />
                        <Button 
                            variant="contained" 
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            sx={{ mt: 2 }}
                        >
                            {t('Continue')}
                        </Button>
                    </Box>
                )}
            </CustomStackFullWidth>
        </CustomPaperBigCard>
    )
}

export default React.memo(CustomerInfoPage)