import React from 'react'
import { alpha, Chip, Stack, Typography } from "@mui/material";
import { getAmount, getConvertDiscount } from '../../utils/customFunctions'
import {
    CustomChip,
    FoodTitleTypography,
    PricingCardActions,
} from '../food-card/FoodCard.style'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { CustomTypography } from '../custom-tables/Tables.style'
import { Box } from '@mui/system'
import { useTheme } from '@mui/material/styles'

const StartPriceView = (props) => {
    const theme = useTheme()
    const {
        data,
        hideStartFromText,
        fontSize,
        marginFoodCard,
        handleBadge,
        available_date_ends,
        selectedOptions
    } = props
    const { t } = useTranslation()
    const { global } = useSelector((state) => state.globalSettings)
    const bgColor = theme.palette.secondary.light
    const chipColor = theme.palette.neutral[100]
    const languageDirection = 'ltr'
    let currencySymbol = '₹'
    let currencySymbolDirection = 'left'
    let digitAfterDecimalPoint = 2

   console.log("data...",data.in_stock)

    const handleConvertedPrice = () => {
        if (data?.restaurant_discount === 0) {
            return getAmount(
                getConvertDiscount(
                    data.discount,
                    data.discount_type,
                    data.price,
                    data.restaurant_discount
                ),
                currencySymbolDirection,
                currencySymbol,
                digitAfterDecimalPoint
            )
        } else {
            let price =
                data?.item_details?.price?.value
            return getAmount(
                price,
                currencySymbolDirection,
                currencySymbol,
                digitAfterDecimalPoint
            )
        }
    }

    const handleDiscountedPriceView = () => {
        if (data?.discount > 0) {
            return (
                <CustomTypography variant={fontSize ? fontSize : 'h4'}>
                    {data?.item_details?.price?.value > 0 &&
                        getAmount(
                            data.price,
                            currencySymbolDirection,
                            currencySymbol,
                            digitAfterDecimalPoint
                        )}
                </CustomTypography>
            )
        }
    }
    return (
        <Stack
             direction="row"
            gap={hideStartFromText === 'false' ? 1 : 0.5}
            alignItems="center"
            flexWrap="wrap"
        >
            {hideStartFromText === 'false' && (
                <Typography>{t('Starts From:')}</Typography>
            )}
            <Typography
                display="flex"
                fontWeight="700"
                alignItems="center"
                color={theme.palette.primary.main}
                sx={{
                    fontSize: { xs: '13px', sm: '16px' },
                }}
            >
                {/* {data?.item_details?.price?.value > 0 && handleConvertedPrice()} */}
                { 
                    getAmount(
                        data?.item_details?.price?.value,
                        currencySymbolDirection,
                        currencySymbol,
                        digitAfterDecimalPoint
                    )
                }

            </Typography>
            {data?.in_stock==false && <Stack backgroundColor={alpha(theme.palette.error.light,.2)} padding='3px 6px' borderRadius="10px" alignItems="center" justifyContent="center" >
                <Typography color={theme.palette.error.main} fontSize="12px">{t("Out Of Stock")}</Typography>
            </Stack>}
        </Stack>
    )
}

StartPriceView.propTypes = {}

export default StartPriceView
