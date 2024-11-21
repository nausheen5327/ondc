import React from 'react'
import { Divider, Grid, Stack, Typography } from '@mui/material'
import {
    OrderFoodAmount,
    OrderFoodName,
    OrderFoodSubtitle,
} from '../CheckOut.style'
import {
    getAmount,
    getItemTotalWithoutDiscount,
    getSelectedAddOn,
    getVariation,
    handleProductValueWithOutDiscount,
} from '../../../utils/customFunctions'
import { useSelector } from 'react-redux'
import { ImageSource } from '../../../utils/ImageSource'
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
import Skeleton from '@mui/material/Skeleton'
import CustomImageContainer from '../../CustomImageContainer'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import VisibleVariations from '../../floating-cart/VisibleVariations'
import {handleTotalAmountWithAddonsFF} from "../../../utils/customFunctions";
const RegularOrders = (props) => {
    const theme = useTheme()
    const { t } = useTranslation()
    const { cartList } = useSelector((state) => state.cart)
    const { global, token } = useSelector((state) => state.globalSettings)
    let currencySymbol = '₹'
    let currencySymbolDirection = 'left'
    let digitAfterDecimalPoint = 2
//    console.log("cart item 123",cartList[1].item.product.descriptor.images[0]);
    const languageDirection = 'ltr'
    return (
        <>
            {cartList.length > 0 ? (
                cartList.map((item, index) => (
                    <CustomStackFullWidth
                        key={index}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        mt={index !== 0 && '1rem'}
                    >
                        <Stack position="relative">
                            <CustomImageContainer
                                height="90px"
                                width="90px"
                                src={item?.item?.product?.descriptor?.images[0]}
                                loading="lazy"
                                borderRadius="10px"
                                objectFit="cover"
                            />
                            <Stack
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    width: '100%',

                                    background: (theme) =>
                                        theme.palette.primary.overLay,
                                    opacity: '0.6',
                                    // color: (theme)=>theme.palette.neutral[100],
                                    padding: '10px',
                                    height: '30%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderBottomRightRadius: '10px',
                                    borderBottomLeftRadius: '10px',
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    align="center"
                                    color={theme.palette.neutral[100]}
                                >
                                    {item?.veg === 0 ? t('non-veg') : t('veg')}
                                </Typography>
                            </Stack>
                        </Stack>

                        {/*<img*/}
                        {/*    height="90px"*/}
                        {/*    width="95px"*/}
                        {/*    src={ImageSource(productBaseUrl, item.image)}*/}
                        {/*    loading="lazy"*/}
                        {/*    className="img-border"*/}
                        {/*/>*/}
                        <Stack
                            paddingRight={languageDirection === 'rtl' && '10px'}

                        >
                            <OrderFoodName>{item?.item?.product?.descriptor?.name}</OrderFoodName>
                            {item?.variations?.length > 0 && (
                                <VisibleVariations
                                    variations={item?.variations}
                                    t={t}
                                />
                            )}
                            {item?.selectedAddons?.length > 0 && (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={0.5}
                                >
                                    <OrderFoodSubtitle>
                                        {t('Addon')}
                                    </OrderFoodSubtitle>
                                    <OrderFoodSubtitle>:</OrderFoodSubtitle>
                                    <OrderFoodSubtitle>
                                        {getSelectedAddOn(item?.selectedAddons)}
                                    </OrderFoodSubtitle>
                                </Stack>
                            )}
                            <Stack
                                direction="row"
                                alignItems="center"
                                spacing={0.5}
                            >
                                <OrderFoodSubtitle>
                                    {t('Qty')}
                                </OrderFoodSubtitle>
                                <OrderFoodSubtitle>:</OrderFoodSubtitle>
                                <OrderFoodSubtitle>
                                    {item?.item?.quantity?.count}
                                </OrderFoodSubtitle>
                            </Stack>
                            <OrderFoodAmount>
                                {getAmount(
                                    handleTotalAmountWithAddonsFF(
                                        item?.item?.product?.price?.value,
                                        item?.selectedAddons
                                    ),
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                            </OrderFoodAmount>
                        </Stack>
                    </CustomStackFullWidth>
                ))
            ) : (
                <CustomStackFullWidth
                    direction="row"
                    alignItems="flex-start"
                    spacing={2}
                >
                    <Skeleton
                        variant="rectangular"
                        height="90px"
                        width="95px"
                    />
                    <Stack>
                        <Skeleton variant="text" width="50px" />
                        <Skeleton variant="text" width="50px" />
                        <Skeleton variant="text" width="50px" />
                    </Stack>
                </CustomStackFullWidth>
            )}
            <Grid item md={12} xs={12}>
                <Stack
                    width="100%"
                    sx={{
                        mt: '10px',
                        borderBottom: `2px solid ${theme.palette.neutral[300]}`,
                    }}
                ></Stack>
            </Grid>
        </>
    )
}

RegularOrders.propTypes = {}

export default RegularOrders
