import { onSingleErrorResponse } from "@/components/ErrorResponse";
import { CouponApi } from "@/hooks/react-query/config/couponApi";
// import { setSubscriptionSubTotal, setTotalAmount } from "@/redux/slices/cart";
import { setCouponType } from "@/redux/slices/global";
import {
    bad_weather_fees,
    getAmount,
    getCalculatedTotal,
    getCouponDiscount,
    getDeliveryFees,
    getProductDiscount,
    getReferDiscount,
    getSubTotalPrice,
    getTaxableTotalPrice,
    truncate
} from "@/utils/customFunctions";
import { Card, alpha } from "@material-ui/core";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, Divider, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import CustomDivider from "../../CustomDivider";
import { CalculationGrid, TotalGrid } from "../CheckOut.style";
import HaveCoupon from "../HaveCoupon";
// import { getSubscriptionOrderCount } from "../functions/getSubscriptionOrderCount";
import PlaceOrder from "./PlaceOrder";
import { CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import Skeleton from "@mui/material/Skeleton";
import { CustomTooltip } from "@/components/user-info/coupon/CustomCopyWithToolTip";
import InfoIcon from "@mui/icons-material/Info";

const OrderCalculation = (props) => {
    const {
        cartList,
        restaurantData,
        couponDiscount,
        taxAmount,
        distanceData,
        total_order_amount,
        global,
        orderType,
        couponInfo,
        deliveryTip,
        origin,
        destination,
        extraCharge,
        additionalCharge,
        usePartialPayment,
        walletBalance,
        totalAmount,
        placeOrder,
        orderLoading,
        offlinePaymentLoading,
        checked,
        setCouponDiscount,
        counponRemove,
        offlineFormRef,
        page,
        paymentMethodDetails,
        cashbackAmount,
        extraPackagingCharge,
        distanceLoading
    } = props;
    const { couponType, zoneData } = useSelector(
        (state) => state.globalSettings
    );
    const [couponCode, setCouponCode] = useState(null);
    const { offLineWithPartial } = useSelector((state) => state.offlinePayment);
    const { userData } = useSelector((state) => state.user);
    const { token } = useSelector((state) => state.userToken);
    const tempExtraCharge = extraCharge ?? 0;
    const { t } = useTranslation();
    const [freeDelivery, setFreeDelivery] = useState("false");
    const [anchorEl, setAnchorEl] = useState(null);
    const theme = useTheme();
    const cartContext = useSelector(state => state.cart.cartContext)

    let currencySymbol='₹'
    let currencySymbolDirection='left'
    let digitAfterDecimalPoint=2

    

    const languageDirection = 'ltr';
    
    // total product amount aftetr all discount
    const totalAmountForRefer = couponDiscount
        ? getSubTotalPrice(cartList) -
        getProductDiscount(cartList, restaurantData) -
        getCouponDiscount(couponDiscount, restaurantData, cartList)
        : getSubTotalPrice(cartList) -
        getProductDiscount(cartList, restaurantData);

    const referDiscount = getReferDiscount(
        totalAmountForRefer,
        userData?.discount_amount,
        userData?.discount_amount_type
    );

    const totalPrice = getCalculatedTotal(
        cartList,
        couponDiscount,
        restaurantData,
        global,
        distanceData,
        couponType,
        orderType,
        freeDelivery,
        deliveryTip,
        zoneData,
        origin,
        destination,
        tempExtraCharge,
        global?.additional_charge_status != 0 ? additionalCharge : 0,
        extraPackagingCharge,
        referDiscount
    );

    const handleDeliveryFee = () => {
        // const restaurantChargeInfo = zoneData?.find(
        //     (item) =>
        //         Number.parseInt(item.id) ===
        //         Number.parseInt(restaurantData?.data?.zone_id)
        // )
        let price = getDeliveryFees(
            restaurantData,
            global,
            cartList,
            distanceData?.data,
            couponDiscount,
            couponType,
            orderType,
            zoneData,
            origin,
            destination,
            tempExtraCharge
        );
        if (price === 0) {
            return <Typography variant="h4">{t("Free")}</Typography>;
        } else {
            return (
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={0.5}
                    width="100%"
                >
                    <Typography variant="h4">{"(+)"}</Typography>
                    <Typography variant="h4">
                        {restaurantData &&
                            getAmount(
                                price,
                                currencySymbolDirection,
                                currencySymbol,
                                digitAfterDecimalPoint
                            )}
                    </Typography>
                </Stack>
            );
        }
    };
    const handleCouponDiscount = () => {
        let couponDiscountValue = getCouponDiscount(
            couponDiscount,
            restaurantData,
            cartList
        );
        if (couponDiscount && couponDiscount.coupon_type === "free_delivery") {
            setFreeDelivery("true");
            return 0;
        } else {
            let discount = getAmount(
                couponDiscountValue,
                currencySymbolDirection,
                currencySymbol,
                digitAfterDecimalPoint
            );
            return discount;
        }
    };
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setCouponType(""));
    }, []);

    const handleOrderAmount = () => {
        let totalAmount = totalPrice;
        dispatch(setTotalAmount(totalAmount));
        return getAmount(
            userData?.is_valid_for_discount
                ? totalAmount - referDiscount
                : totalAmount,
            currencySymbolDirection,
            currencySymbol,
            digitAfterDecimalPoint
        );
    };
    const [quote, setQuote] = useState(null)
    console.log('cartlist in regualr order...', cartList)
    useEffect(() => {
        setQuote(cartContext?.message?.quote?.quote)
    }, [cartContext])
    const handleOrderAmountWithoutSubscription = () => {
        return getAmount(
            totalPrice,
            currencySymbolDirection,
            currencySymbol,
            digitAfterDecimalPoint
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

    

    const formatPrice = (value) => `₹${Number(value || 0).toFixed(2)}`;
   
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

    
    const totalAmountAfterPartial = totalPrice - walletBalance;

    const vat = t("VAT/TAX");
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const { isLoading, data, isError, error, refetch } = useQuery(
        ["coupon-list"],
        CouponApi.couponList,
        {
            enabled: !!token,
            retry: 1,
            onError: onSingleErrorResponse
        }
    );
    const getCouponCodeFromCard = (value) => {
        setCouponCode(value);
        handleClose();
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
    const restaurantChargeInfo = zoneData?.find(
        (item) =>
            Number.parseInt(item.id) ===
            Number.parseInt(restaurantData?.data?.zone_id)
    );
    const extraText = t("This charge includes extra vehicle charge");
    const badText = t("and bad weather charge");
    const deliveryToolTipsText = `${extraText} ${getAmount(
        tempExtraCharge,
        currencySymbolDirection,
        currencySymbol,
        digitAfterDecimalPoint
    )}${bad_weather_fees !== 0 ? ` ${badText} ${getAmount(
        bad_weather_fees,
        currencySymbolDirection,
        currencySymbol,
        digitAfterDecimalPoint
    )}` : ""}`;

// : (
//         <CustomStackFullWidth spacing={1}>
//             <CustomStackFullWidth
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//             >
//                 <Skeleton variant="text" width="50px" />
//                 <Skeleton variant="text" width="50px" />
//             </CustomStackFullWidth>
//             <CustomStackFullWidth
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//             >
//                 <Skeleton variant="text" width="50px" />
//                 <Skeleton variant="text" width="50px" />
//             </CustomStackFullWidth>
//             <CustomStackFullWidth
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//             >
//                 <Skeleton variant="text" width="50px" />
//                 <Skeleton variant="text" width="50px" />
//             </CustomStackFullWidth>
//             <CustomStackFullWidth
//                 direction="row"
//                 alignItems="center"
//                 justifyContent="space-between"
//             >
//                 <Skeleton variant="text" width="50px" />
//                 <Skeleton variant="text" width="50px" />
//             </CustomStackFullWidth>
//         </CustomStackFullWidth>
//     )

    return (
        <>
            <CalculationGrid container md={12} xs={12} spacing={1}>
            <Grid item md={8} xs={8}>
                    
                    {t("Subtotal")}
           </Grid>
           <Grid
               item
               md={4}
               xs={4}
               align={languageDirection === "rtl" ? "left" : "right"}
           >
               <Typography variant="h4">
                   {getAmount(
                       quote?.breakup?.reduce((sum, item) => {
                        if (item['@ondc/org/title_type'] === 'item' || 
                            (item['@ondc/org/title_type'] === 'tax' && !item.item?.tags?.some(tag => tag.code === 'quote'))) {
                            return sum + Number(item.price.value);
                        }
                        return sum;
                    }, 0),
                       currencySymbolDirection,
                       currencySymbol,
                       digitAfterDecimalPoint
                   )}
               </Typography>
           </Grid>
                <Grid item md={8} xs={8}>
                    
                         {t("Delivery Charges")}
                </Grid>
                <Grid
                    item
                    md={4}
                    xs={4}
                    align={languageDirection === "rtl" ? "left" : "right"}
                >
                    <Typography variant="h4">
                        {getAmount(
                            deliveryCharges,
                            currencySymbolDirection,
                            currencySymbol,
                            digitAfterDecimalPoint
                        )}
                    </Typography>
                </Grid>
                <Grid item md={8} xs={8}>
                    {t("Packaging Charges")}
                </Grid>
                <Grid item md={4} xs={4} align="right">
                    <Stack
                        width="100%"
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={0.5}
                    >
                        <Typography variant="h4">
                            {
                                getAmount(
                                    packingCharges,
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item md={8} xs={8}>
                    {t("Convinience Fees")}
                </Grid>
                <Grid item md={4} xs={4} align="right">
                    <Stack
                        width="100%"
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={0.5}
                    >
                        <Typography variant="h4">
                            {
                                getAmount(
                                    convenienceFee,
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item md={8} xs={8}>
                    {t("Tax")}
                </Grid>
                <Grid item md={4} xs={4} align="right">
                    <Stack
                        width="100%"
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={0.5}
                    >
                        <Typography variant="h4">
                            {
                                getAmount(
                                    taxOnDelivery,
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                        </Typography>
                    </Stack>
                </Grid>
                
                

                

                
                
               
                <CustomDivider />
               
                   
                

                <TotalGrid container md={12} xs={12} mt="1rem">
                    <Grid item md={8} xs={8} pl=".5rem">
                        <Typography color={theme.palette.primary.main}>
                            {t("Total")}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md={4}
                        xs={4}
                        align={languageDirection === "rtl" ? "left" : "right"}
                    >
                        {/* {!distanceLoading ? (<Typography color={theme.palette.primary.main}>
                            {restaurantData && cartList && handleOrderAmount()}
                        </Typography>) : (<Skeleton variant="text" width="50px" />)} */}

                        <Typography color={theme.palette.primary.main}>
                        {getAmount(
                                    quote?.price?.value,
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                        </Typography>

                    </Grid>
                </TotalGrid>
                
                
                
                <Grid md={12}>
                    <PlaceOrder
                        usePartialPayment={usePartialPayment}
                        placeOrder={placeOrder}
                        orderLoading={orderLoading}
                        checked={checked}
                        offlinePaymentLoading={offlinePaymentLoading}
                        offlineFormRef={offlineFormRef}
                        page={page}
                        paymentMethodDetails={paymentMethodDetails}
                        distanceLoading={distanceLoading}
                    />
                </Grid>
            </CalculationGrid>
        </>
    );
};

OrderCalculation.propTypes = {};

export default OrderCalculation;
