import React, { useMemo } from 'react';
import { FoodTitleTypography } from '../food-card/FoodCard.style';
import { Stack, Typography } from '@mui/material';
import { CustomTypographyGray } from '../error/Errors.style';

const calculateCustomizationPrice = (selectedOptions) => {
    return selectedOptions.reduce((total, option) => {
        return total + (option.price?.value || 0);
    }, 0);
};

const calculateTotalPrice = (item, quantity, selectedOptions) => {
    // Base price
    const basePrice = item?.item_details?.price?.value || 0;
    
    // Customization price
    const customizationPrice = calculateCustomizationPrice(selectedOptions);
    
    // Calculate total before discount
    const totalBeforeDiscount = (basePrice + customizationPrice) * quantity;
    
    // Get discount if applicable
    const discount = item?.item_details?.price?.discount?.value || 0;
    const discountType = item?.item_details?.price?.discount?.type || 'PERCENTAGE';
    
    // Calculate final price after discount
    if (discountType === 'PERCENTAGE') {
        return totalBeforeDiscount * (1 - (discount / 100));
    } else {
        return totalBeforeDiscount - discount;
    }
};

const TotalAmountVisibility = ({
    modalData,
    selectedOptions,
    quantity,
    currencySymbolDirection,
    currencySymbol,
    digitAfterDecimalPoint,
    t,
}) => {
    const totalAmount = useMemo(() => {
        if (!modalData?.[0]) return 0;
        return calculateTotalPrice(modalData[0], quantity, selectedOptions);
    }, [modalData, quantity, selectedOptions]);

    const originalAmount = useMemo(() => {
        if (!modalData?.[0]) return 0;
        const basePrice = modalData[0]?.item_details?.price?.value || 0;
        const customizationPrice = calculateCustomizationPrice(selectedOptions);
        return (basePrice + customizationPrice) * quantity;
    }, [modalData, quantity, selectedOptions]);

    const formatPrice = (amount) => {
        const formattedAmount = Number(amount).toFixed(digitAfterDecimalPoint);
        return currencySymbolDirection === 'left' 
            ? `${currencySymbol}${formattedAmount}`
            : `${formattedAmount}${currencySymbol}`;
    };

    const hasDiscount = modalData[0]?.item_details?.price?.discount?.value > 0;

    return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
            <FoodTitleTypography
                gutterBottom
                variant="h6"
                component="h6"
                sx={{
                    margin: '0',
                    alignItems: 'end',
                    justifyContent: 'flex-start',
                    padding: '0',
                    textAlign: 'left',
                }}
            >
                {t('Total')} :
                <Typography
                    fontSize="14px"
                    component="span"
                    fontWeight="600"
                    sx={{
                        color: (theme) => theme.palette.primary.main,
                        marginLeft: '4px',
                    }}
                >
                    {formatPrice(totalAmount)}
                </Typography>
            </FoodTitleTypography>

            {hasDiscount && (
                <CustomTypographyGray
                    nodefaultfont="true"
                    textdecoration="line-through"
                    sx={{ fontSize: '14px' }}
                >
                    ({formatPrice(originalAmount)})
                </CustomTypographyGray>
            )}
        </Stack>
    );
};

export default TotalAmountVisibility;