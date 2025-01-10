// import React, { useState, useEffect } from 'react'
// import { DeliveryCaption, DeliveryTitle } from './CheckOut.style'
// import { useTranslation } from 'react-i18next'
// import { useDispatch, useSelector } from 'react-redux'
// import {
//     CustomPaperBigCard,
//     CustomStackFullWidth,
// } from "@/styled-components/CustomStyles.style"
// import { 
//     Typography,
//     TextField,
//     Button,
//     Box
// } from "@mui/material"
// import { setCustomerInfo } from '@/redux/slices/addressData'

// const CustomerInfoPage = () => {
//     const { t } = useTranslation()
//     const customerInfo = useSelector((state) => state.addressData.customerInfo)
//     const dispatch = useDispatch()
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         phone: ''
//     })
//     const [errors, setErrors] = useState({})
//     const [isEditing, setIsEditing] = useState(false)

//     // Auto-fill form when customerInfo data is present
//     useEffect(() => {
//         if (customerInfo?.customer) {
//             setFormData({
//                 name: customerInfo?.customer?.name || '',
//                 email: customerInfo?.customer?.email || '',
//                 phone: customerInfo?.customer?.phone || ''
//             })
//         }
//     }, [customerInfo])

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }))
//         // Clear error when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [name]: ''
//             }))
//         }
//     }

//     const validateForm = () => {
//         const newErrors = {}
//         if (!formData.name) newErrors.name = t('Name is required')
//         if (!formData.email) {
//             newErrors.email = t('Email is required')
//         } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//             newErrors.email = t('Invalid email format')
//         }
//         if (!formData.phone) {
//             newErrors.phone = t('Phone is required')
//         } else if (!/^\d{10}$/.test(formData.phone)) {
//             newErrors.phone = t('Invalid phone number')
//         }
//         return newErrors
//     }

//     const handleSubmit = () => {
//         const formErrors = validateForm()
//         if (Object.keys(formErrors).length === 0) {
//             const updatedCustomerInfo = {
//                 ...customerInfo,
//                 customer: {
//                     ...customerInfo?.customer,
//                     name: formData.name,
//                     email: formData.email,
//                     phone: formData.phone
//                 }
//             }
//             dispatch(setCustomerInfo(updatedCustomerInfo))
//             setIsEditing(false)
//         } else {
//             setErrors(formErrors)
//         }
//     }

//     const handleEdit = () => {
//         setIsEditing(true)
//     }


//     return (
//         <CustomPaperBigCard>
//             <CustomStackFullWidth spacing={3}>
//                 <DeliveryTitle>
//                     {t('CUSTOMER INFO')}
//                 </DeliveryTitle>
                
//                 {customerInfo?.customer?.name && customerInfo?.customer?.email && customerInfo?.customer?.phone && !isEditing ? (
//                     <>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                             {customerInfo.customer.name}
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                             {customerInfo.customer.email}
//                         </Typography>
//                         <Typography variant="body1" sx={{ fontWeight: 600 }}>
//                             {customerInfo.customer.phone}
//                         </Typography>
//                         <Button 
//                             variant="outlined" 
//                             color="primary"
//                             onClick={handleEdit}
//                             sx={{ mt: 2 }}
//                         >
//                             {t('Edit Information')}
//                         </Button>
//                     </>
//                 ) : (
//                     <Box component="form" sx={{ width: '100%' }} spacing={3}>
//                         <TextField
//                             fullWidth
//                             label={t('Name')}
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             error={!!errors.name}
//                             helperText={errors.name}
//                             margin="normal"
//                         />
//                         <TextField
//                             fullWidth
//                             label={t('Email')}
//                             name="email"
//                             type="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             error={!!errors.email}
//                             helperText={errors.email}
//                             margin="normal"
//                         />
//                         <TextField
//                             fullWidth
//                             label={t('Phone')}
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleChange}
//                             error={!!errors.phone}
//                             helperText={errors.phone}
//                             margin="normal"
//                         />
//                         <Button 
//                             variant="contained" 
//                             color="primary"
//                             fullWidth
//                             onClick={handleSubmit}
//                             sx={{ mt: 2 }}
//                             disabled={!formData.name || !formData.email || !formData.phone}
//                         >
//                             {t('Continue')}
//                         </Button>
//                     </Box>
//                 )}
//             </CustomStackFullWidth>
//         </CustomPaperBigCard>
//     )
// }

// export default React.memo(CustomerInfoPage)

import React, { useState, useEffect } from 'react'
import { DeliveryCaption, DeliveryTitle } from './CheckOut.style'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { User, Mail, Phone } from 'lucide-react'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style"
import { 
    Typography,
    TextField,
    Button,
    Box,
    InputAdornment
} from "@mui/material"
import { setCustomerInfo } from '@/redux/slices/addressData'

const CustomerInfoPage = () => {
    const { t } = useTranslation()
    const customerInfo = useSelector((state) => state.addressData.customerInfo)
    const dispatch = useDispatch()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    })
    const [errors, setErrors] = useState({})
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        if (customerInfo?.customer) {
            setFormData({
                name: customerInfo?.customer?.name || '',
                email: customerInfo?.customer?.email || '',
                phone: customerInfo?.customer?.phone || ''
            })
        }
    }, [customerInfo])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
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

    console.log("customer info",customerInfo)

    const handleSubmit = () => {
        const formErrors = validateForm()
        if (Object.keys(formErrors).length === 0) {
            const updatedCustomerInfo = {
                ...customerInfo,
                customer: {
                    ...customerInfo?.customer,
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone
                }
            }
            dispatch(setCustomerInfo(updatedCustomerInfo))
            setIsEditing(false)
        } else {
            setErrors(formErrors)
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
    }

    return (
        <CustomPaperBigCard>
            <CustomStackFullWidth spacing={1.5}>
                <DeliveryTitle>
                    {t('CUSTOMER INFO')}
                </DeliveryTitle>
                
                {customerInfo?.customer?.name && customerInfo?.customer?.email && customerInfo?.customer?.phone && !isEditing ? (
                    <>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,marginTop:'15px' }}>
                            <User size={20} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {customerInfo.customer.name}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1,marginTop:'15px' }}>
                            <Mail size={20} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {customerInfo.customer.email}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 ,marginTop:'15px'}}>
                            <Phone size={20} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                {customerInfo.customer.phone}
                            </Typography>
                        </Box>
                        <Button 
                            variant="outlined" 
                            color="primary"
                            onClick={handleEdit}
                            sx={{ mt: 2 }}
                        >
                            {t('Edit Information')}
                        </Button>
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <User size={20} />
                                    </InputAdornment>
                                ),
                            }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Mail size={20} />
                                    </InputAdornment>
                                ),
                            }}
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
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone size={20} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button 
                            variant="contained" 
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            sx={{ mt: 2 }}
                            disabled={!formData.name || !formData.email || !formData.phone}
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