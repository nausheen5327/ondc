import React, { useEffect, useReducer, useState } from 'react'
import { Grid, useTheme, useMediaQuery, Stack, Typography, IconButton } from '@mui/material'
import { useQuery } from 'react-query'
import CustomShimmerForProfile from '../../customShimmerForProfile/customShimmerForProfile'
import { ProfileApi } from "@/hooks/react-query/config/profileApi"
import { setUser } from "@/redux/slices/customer"
import { useDispatch, useSelector } from 'react-redux'
import { getAmount } from "@/utils/customFunctions"
import { CustomPaperBigCard, CustomStackFullWidth, SliderCustom } from "@/styled-components/CustomStyles.style"
import { t } from 'i18next'
import { useUserDelete } from "@/hooks/react-query/user-delete/useUserDelete"
import AuthModal from '../../auth'
import { useRouter } from 'next/router'
import { onSingleErrorResponse } from '../../ErrorResponse'
import { toast } from 'react-hot-toast'
import { setWalletAmount } from "@/redux/slices/cart"
import PersonalDetails from './PersonalDetails'
import MyAddresses from './MyAddresses'
import EditProfile from './EditProfile'
import Meta from '../../Meta'
import { removeToken } from "@/redux/slices/userToken"
import { PrimaryButton } from '../../products-page/FoodOrRestaurant'
import EditSvg from './EditSvg'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import MoreDotIcon from '../../../assets/images/icons/MoreDotIcon'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { setEditProfile } from "@/redux/slices/editProfile"
import { setCustomerInfo } from '@/redux/slices/addressData'

const PlayerDetailsPage = () => {   
    const { isEditProfile } = useSelector((state) => state.isEditProfile);
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const dispatch = useDispatch()
    const customerInfo = useSelector((state) => state.addressData.customerInfo)
    const addresses = useSelector((state) => state.user.addressList);
    let token = undefined
    if (typeof window != 'undefined') {
        token = localStorage.getItem('token')
    }
    

    const location = useSelector((state) => state.addressData.location)
            const [formData, setFormData] = useState({
                name: '',
                email: '',
                phone: ''
            })
            const [errors, setErrors] = useState({})
            const [isEditing, setIsEditing] = useState(false)
        
            useEffect(() => {
                // First check localStorage
                const storedCustomerInfo = localStorage.getItem('customerInfo')
                if (storedCustomerInfo) {
                    const parsedInfo = JSON.parse(storedCustomerInfo)
                    // dispatch(setCustomerInfo(parsedInfo))
                    setCustomerInfo(parsedInfo)
                    setFormData({
                        name: parsedInfo?.customer?.name || '',
                        email: parsedInfo?.customer?.email || '',
                        phone: parsedInfo?.customer?.phone || ''
                    })
                } else {
                    // If no localStorage data, use location descriptor and userDatafor
                    let userDatafor  =localStorage.getItem('userDatafor');
                    if(userDatafor)
                    {
                        userDatafor = JSON.parse(userDatafor)
                    }
                    setFormData({
                        name: location?.descriptor?.name || '',
                        email: location?.descriptor?.email || '',
                        phone: userDatafor?.phone || location?.descriptor?.phone
                    })
                }
            }, [location])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setDeleteModal(false)
        setAnchorEl(null)
    };

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
    
       
    
        console.log("customer info",customerInfo)
    
        const handleSubmit = (values) => {
            console.log("form data is",values);
                const updatedCustomerInfo = {
                    ...customerInfo,
                    customer: {
                        ...customerInfo?.customer,
                        name: values.name,
                        email: values.email,
                        phone: values.phone
                    }
                }
                localStorage.setItem('customerInfo', JSON.stringify(updatedCustomerInfo))
                dispatch(setCustomerInfo(updatedCustomerInfo))
                dispatch(setEditProfile(false))
            
        }
    
        const handleEdit = () => {
            setIsEditing(true)
        }
    
    const settings = {
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 2000,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 1600,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 1340,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 1075,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 999,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 670,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 540,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 450,
                settings: {
                    slidesToShow: 1.8,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 370,
                settings: {
                    slidesToShow: 1.5,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
            {
                breakpoint: 300,
                settings: {
                    slidesToShow: 1.3,
                    slidesToScroll: 1,
                    infinite: false,
                },
            },
        ],
    }
    console.log("form data is",formData);
    
    return (
        <>
            <Meta title={"Player Info on ONDC"} description="" keywords="" />
            {token  ? (
                <CustomStackFullWidth gap="15px">
                    <Stack gap={isEditProfile ? 0 : "15px"} paddingInline={{ xs: "0", sm: "2px 10px" }} >
                        <CustomPaperBigCard
                            padding={isSmall ? "10px" : "20px 25px"}
                            sx={{ minHeight: isEditProfile ? (!isSmall ? '558px' : "450px") : 0 }}
                        >
                            <Grid item xs={12} sm={12} md={12}>
                                <CustomStackFullWidth
                                    justifyContent={isSmall ? "end" : "space-between"}
                                    direction="row"
                                    alignItems="flex-start"
                                    paddingBottom="12px"
                                >
                                    {(!isSmall) &&
                                        <Typography fontSize="16px" fontWeight="500" padding="0">
                                            {t('Personal Details')}
                                        </Typography>
                                    }
                                    {isEditProfile === true ? (
                                        <Stack flexDirection="row" alignItems="center" marginTop={isSmall ? '0px' : '-5px'}>
                                            {!isSmall &&
                                                <Stack flexDirection="row" alignItems="center" sx={{ cursor: "pointer" }} onClick={() => dispatch(setEditProfile(false))}>
                                                    <IconButton sx={{ width: "30px", height: "30px", color: theme => theme.palette.primary.main }}>
                                                        <ArrowBackIosNewIcon sx={{ fontSize: "10px" }} />
                                                    </IconButton>
                                                    <Typography fontSize="13px" color={theme.palette.primary.main}>{t("Go Back")}</Typography>
                                                </Stack>
                                            }
                                            <IconButton onClick={handleClick} sx={{ padding: "0 0 0 16px" }}>
                                                <MoreDotIcon />
                                            </IconButton>
                                        </Stack>
                                    ) : (
                                        <Stack>
                                            <PrimaryButton
                                                variant="outlined"
                                                sx={{
                                                    marginTop: isSmall ? '0px' : '-5px',
                                                    borderRadius: '20px',
                                                    minWidth: "0"
                                                }}
                                                padding={isSmall ? "5px" : "5px 10px"}
                                                onClick={() => dispatch(setEditProfile(true))}
                                            >
                                                <Stack
                                                    direction="row"
                                                    spacing={0.5}
                                                    color={theme.palette.neutral[1000]}
                                                    alignItems="center"
                                                >
                                                    {!isSmall && (
                                                        <Typography
                                                            fontSize="14px"
                                                            fontWeight="400"
                                                        >
                                                            {t('Edit Profile')}
                                                        </Typography>
                                                    )}
                                                    <EditSvg />
                                                </Stack>
                                            </PrimaryButton>
                                        </Stack>
                                    )}
                                </CustomStackFullWidth>
                            </Grid>
                            {isEditProfile === true ? (
                                <EditProfile
                                    data={formData}
                                    handleSubmit={handleSubmit}
                                />
                            ) : (
                                <PersonalDetails
                                    data={customerInfo?.customer}
                                />
                            )}

                        </CustomPaperBigCard>
                        <CustomStackFullWidth>
                            {isEditProfile === false ? <MyAddresses /> : ""}
                        </CustomStackFullWidth>

                    </Stack>
                </CustomStackFullWidth>
            ) : (
                <CustomShimmerForProfile />
            )}
        </>
    )
}

export default PlayerDetailsPage
