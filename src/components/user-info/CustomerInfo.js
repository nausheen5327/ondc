import { Avatar, Typography, useTheme } from '@mui/material'
import { t } from 'i18next'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style"
import { useEffect, useState } from 'react'
const CustomerInfo = () => {
    const theme = useTheme()
    const { userData } = useSelector((state) => state.user)
    const [customerData, setCustomerData] = useState(null);
    useEffect(()=>{
        let customerInfo = localStorage.getItem('customerInfo');
        if(customerInfo)
        {
            customerInfo = JSON.parse(customerInfo);
            setCustomerData(customerInfo.customer);
        }
    },[])
    return (
        <CustomStackFullWidth
            direction="row"
            gap="9px"
            justifyContent="center"
            alignItems="center"
        >
            <Avatar
                sx={{
                    height: 68,
                    width: 70,
                    backgroundColor: userData?.image
                        ? (theme) => theme.palette.neutral[100]
                        : (theme) => theme.palette.neutral[400],
                }}
                src={userData?.image_full_url}
            />
            <CustomStackFullWidth>
                <Typography fontSize="1rem" fontWeight="600">
                    {' '}
                    {userData?.f_name?.concat(' ', userData?.l_name)}
                </Typography>
                <Typography
                    fontSize="0.75rem"
                    fontWeight="400"
                    color={theme.palette.neutral[500]}
                    sx={{ direction: theme.direction === 'rtl' ? 'rtl' : '' }}
                    textAlign={theme.direction === 'rtl'?"end":"start"}
                >
                    {userData?.phone}
                </Typography>
                <Typography
                    fontSize="1rem"
                    fontWeight="400"
                    color={theme.palette.neutral[500]}
                >
                    {customerData?.name}
                </Typography>
                <Typography
                    fontSize="0.8rem"
                    fontWeight="400"
                    color={theme.palette.neutral[500]}
                >
                    {customerData?.phone}
                </Typography>
            </CustomStackFullWidth>
        </CustomStackFullWidth>
    )
}

export default CustomerInfo
