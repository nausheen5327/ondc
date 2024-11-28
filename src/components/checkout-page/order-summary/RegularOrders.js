import React, { useEffect, useState } from 'react'
import {
    OrderFoodAmount,
    OrderFoodName,
    OrderFoodSubtitle,
} from '../CheckOut.style'
import CustomImageContainer from '../../CustomImageContainer'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@mui/material/styles'
import { useSelector } from 'react-redux'
import { CustomStackFullWidth } from '../../../styled-components/CustomStyles.style'
import { Stack, Typography, Grid, Card, Divider, Box } from '@mui/material';
const VegNonVegIndicator = ({ isVeg }) => (
    <Box
        sx={{
            border: `1px solid ${isVeg ? '#0f8a65' : '#e23744'}`,
            borderRadius: '4px',
            width: '10px',
            height: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: '2px'
        }}
    >
        <Box
            sx={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                bgcolor: isVeg ? '#0f8a65' : '#e23744'
            }}
        />
    </Box>
);
const RegularOrders = () => {
    // ... keep existing state and hooks ...
    const theme = useTheme()
    const { t } = useTranslation()
    const cartContext = useSelector(state => state.cart.cartContext)
    const cartList = useSelector(state => state.cart.cartList)
    const currencySymbol = '₹'
    const [quote, setQuote] = useState(null)
    console.log('cartlist in regualr order...', cartList)
    useEffect(() => {
        setQuote(cartContext?.message?.quote?.quote)
    }, [cartContext])

    const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;
    const isVeg = (item) => {
        // First check item.tags
        const mainItemVegStatus = item?.tags?.find(tag =>
            tag.code === 'veg_nonveg'
        )?.list?.find(item =>
            (item.code === 'veg' && item.value === 'yes') ||
            (item.code === 'non_veg' && item.value === 'yes')
        );

        if (mainItemVegStatus) {
            return mainItemVegStatus.code === 'veg';
        }

        // Then check product.tags
        const productVegStatus = item?.tags?.find(tag =>
            tag.code === 'veg_nonveg'
        )?.list?.find(item =>
            (item.code === 'veg' && item.value === 'yes') ||
            (item.code === 'non_veg' && item.value === 'yes')
        );

        if (productVegStatus) {
            return productVegStatus.code === 'veg';
        }

        return false;
    };



    const renderLineItem = (label, value, options = {}) => {
        const {
            indent = false,
            isRed = false,
            isGray = false,
            isBold = false
        } = options;

        return (
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{
                    pl: indent ? 3 : 0,
                    py: 0.2,
                    '& .MuiTypography-root': {
                        color: isRed ? 'error.main' :
                            isGray ? 'text.secondary' :
                                'text.primary',
                        fontWeight: isBold ? 600 : 400
                    }
                }}
            >
                <Typography variant="body2">{label}</Typography>
                <Typography variant="body2">{formatPrice(value)}</Typography>
            </Stack>
        );
    };

    const groupedItems = {};

    quote?.breakup?.forEach(item => {
        if (['delivery', 'packing', 'misc'].includes(item['@ondc/org/title_type'])) {
            return;
        }

        const parentId = item.item?.parent_item_id || item['@ondc/org/item_id'];

        if (!groupedItems[parentId]) {
            groupedItems[parentId] = {
                title: item.title,
                items: [],
                customizations: []
            };
        }

        // Check if it's a customization
        const isCustomization = item.item?.tags?.some(tag =>
            tag.code === 'type' &&
            tag.list?.some(l => l.code === 'type' && l.value === 'customization')
        );

        if (isCustomization) {
            groupedItems[parentId].customizations.push(item);
        } else {
            groupedItems[parentId].items.push(item);
        }
    });

    const items = {};
    let deliveryCharges = 0;
    let packingCharges = 0;
    let convenienceFee = 0;
    let taxOnDelivery = 0;

    quote?.breakup?.forEach(item => {
      if (item['@ondc/org/title_type'] === 'delivery') {
        deliveryCharges += Number(item.price.value);
      } else if (item['@ondc/org/title_type'] === 'packing') {
        packingCharges += Number(item.price.value);
      } else if (item['@ondc/org/title_type'] === 'misc') {
        convenienceFee += Number(item.price.value);
      } else if (item['@ondc/org/title_type'] === 'tax' && item.item?.tags?.some(tag => tag.code === 'quote')) {
        taxOnDelivery += Number(item.price.value);
      } else {
        const parentId = item.item?.parent_item_id || item['@ondc/org/item_id'];
        if (!items[parentId]) {
          items[parentId] = {
            title: item.title,
            details: []
          };
        }
        items[parentId].details.push(item);
      }
    });


    return (
        <Card sx={{
            p: 3, bgcolor: 'background.paper', height: '100%',
            '.simplebar-content-wrapper': {
                maxHeight: '100% !important', // Removes max height limitation
                height: '100%',              // Ensures full height
            }
        }}>
            <Stack spacing={2}>
                {/* Main Items with Customizations */}
                {Object.values(groupedItems).map((group, index) => group.title!=='Tax' &&(
                    <Stack key={index} spacing={0.5}>
                        {/* Add Product Image and Details */}
                        <Grid container spacing={2} alignItems="flex-start">
                            {/* Left side - Image and Veg/Non-veg */}
                            {<Grid item xs={3} sm={2}>
                                <Box position="relative">
                                    <CustomImageContainer
                                        src={cartList?.find(item => item?.item?.product?.descriptor?.name === group.title)
                                            ?.item?.product?.descriptor?.images?.[0]}
                                        height="30px"
                                        width="30px"
                                        borderRadius="8px"
                                        objectFit="cover"
                                    />
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'rgba(0, 0, 0, 0.6)',
                                            color: 'white',
                                            py: 0.5,
                                            textAlign: 'center',
                                            borderBottomLeftRadius: '8px',
                                            borderBottomRightRadius: '8px',
                                        }}
                                    >
                                        {console.log("cartItem inside ", group.title, cartList?.find(item =>
                                            item?.item?.product?.descriptor?.name === group.title
                                        ))}
                                        <VegNonVegIndicator
                                            isVeg={isVeg(cartList?.find(item =>
                                                item?.item?.product?.descriptor?.name === group.title
                                            )?.item)}
                                        />
                                    </Box>
                                </Box>
                            </Grid>}

                            {/* Right side - Original summary content */}
                            <Grid item xs={9} sm={10}>
                                <Stack spacing={0.5}>
                                    { <Typography variant="subtitle1">{group.title}</Typography>
                                    }
                                    {/* Base Item and Its Tax */}
                                    { group.items.map((item, idx) => {
                                        if (item['@ondc/org/title_type'] === 'item') {
                                            const quantity = item['@ondc/org/item_quantity']?.count || 1; // Get quantity or default to 1
        const basePrice = Number(item.price.value);
                                            return renderLineItem(
                                                `${quantity} * Base Price`,
                                                item.price.value
                                            );
                                        } else if (item['@ondc/org/title_type'] === 'tax') {
                                            return renderLineItem(
                                                'Tax',
                                                item.price.value,
                                                { isRed: true }
                                            );
                                        }
                                        return null;
                                    })}

                                    {/* Customizations */}
                                    {group.customizations.length > 0 && (
                                        <>
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                Customizations
                                            </Typography>
                                            {group.customizations.reduce((acc, item, idx) => {
                                                if (item['@ondc/org/title_type'] === 'item') {
                                                    acc.push(
                                                        <Typography
                                                            key={`custom-${idx}`}
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{ pl: 2 }}
                                                        >
                                                            {item.title}
                                                        </Typography>
                                                    );
                                                    const quantity = item['@ondc/org/item_quantity']?.count || 1; // Get quantity or default to 1
                                                    acc.push(
                                                        renderLineItem(
                                                            `${quantity} * Base Price`,
                                                            item.price.value,
                                                            { indent: true, isGray: true }
                                                        )
                                                    );
                                                } else if (item['@ondc/org/title_type'] === 'tax') {
                                                    acc.push(
                                                        renderLineItem(
                                                            'Tax',
                                                            item.price.value,
                                                            { indent: true, isRed: true }
                                                        )
                                                    );
                                                }
                                                return acc;
                                            }, [])}
                                        </>
                                    )}
                                </Stack>
                            </Grid>
                        </Grid>
                        <Divider sx={{ my: 1 }} />
                    </Stack>
                ))}

                {/* Keep existing total and additional charges sections */}
                {/* <Divider /> */}
                {renderLineItem('Total',
    quote?.breakup?.reduce((sum, item) => {
        if (item['@ondc/org/title_type'] === 'item' || 
            (item['@ondc/org/title_type'] === 'tax' && !item.item?.tags?.some(tag => tag.code === 'quote'))) {
            return sum + Number(item.price.value);
        }
        return sum;
    }, 0),
    { isBold: true }
)}

                
            </Stack>
        </Card>
    );
};

export default RegularOrders