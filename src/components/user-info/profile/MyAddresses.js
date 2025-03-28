import React from 'react'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from '../../../styled-components/CustomStyles.style'
import { Grid, IconButton, Stack, Typography, useMediaQuery } from '@mui/material'
import { CustomTypography } from '../../custom-tables/Tables.style'
import { t } from 'i18next'
import { PrimaryButton } from '../../products-page/FoodOrRestaurant'
import EditIcon from '@mui/icons-material/Edit'
import { useTheme } from '@mui/material/styles'
import deleteImg from '../../../../public/static/Vector (5).png'
import { useQuery } from 'react-query'
import { AddressApi } from '../../../hooks/react-query/config/addressApi'
import { onSingleErrorResponse } from '../../ErrorResponse'
import AddressCard from '../address/AddressCard'
import AddNewAddress from '../address/AddNewAddress'
import CustomEmptyResult from '../../empty-view/CustomEmptyResult'
import noData from '../../../../public/static/nodata.png'
import Skeleton from '@mui/material/Skeleton'
import { Scrollbar } from '../../Scrollbar'
import ScrollerProvider from '../../scroller-provider'
import { noAddressFound } from '../../../utils/LocalImages'
import AddLocationIcon from '@mui/icons-material/AddLocation';
import { useSelector } from 'react-redux'

const MyAddresses = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm"))
    const addresses = useSelector((state) => state.user.addressList);
console.log("are bhaiya addresses is", addresses)
    return (
        <CustomPaperBigCard padding={isXs ? "10px" : "15px 25px 25px"}>
            <CustomStackFullWidth>
                <CustomStackFullWidth
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    pb="10px"
                >
                    <CustomTypography fontWeight="500">
                        {t('My Addresses')}
                    </CustomTypography>
                    <AddNewAddress  />
                </CustomStackFullWidth>
                {addresses?.length === 0 ? (
                    <Stack
                        width="100%"
                        alignItems="center"
                        justifyContent="center"
                        paddingBottom="35px"
                    >
                        <CustomEmptyResult
                            label="No Address Found!"
                            subTitle="Please add your address for better experience!"
                            image={noAddressFound}
                            height={79}
                            width={94}
                        />
                    </Stack>
                ) : (
                    <Grid container spacing={1.5}>
                        {addresses?.length > 0
                            ? addresses.map((address) => (
                                <Grid item xs={12} md={6} key={address?.id}>
                                    <AddressCard
                                        address={address}
                                    />
                                </Grid>
                            ))
                            : isFetching && (
                                <>
                                    <Grid item xs={12} md={6}>
                                        <Skeleton
                                            variant="rounded"
                                            width="100%"
                                            height={150}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Skeleton
                                            variant="rounded"
                                            width="100%"
                                            height={150}
                                        />
                                    </Grid>
                                </>
                            )}
                    </Grid>
                )}
            </CustomStackFullWidth>
        </CustomPaperBigCard>
    )
}

export default MyAddresses
