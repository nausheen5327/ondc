import React, { useState } from "react";
import { Button, Grid, Stack, Typography } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import CustomFormatedDateTime from '../date/CustomFormatedDateTime';
import CustomImageContainer from '../CustomImageContainer';
import ReviewSideDrawer from "@/components/order-details/ReviewSideDrawer";
import { CustomColouredTypography, CustomStackFullWidth } from "@/styled-components/CustomStyles.style";
import { setDeliveryManInfoByDispatch } from "@/redux/slices/searchFilter";
import startReview from '../../../public/static/star-review.png';

const OrderCard = ({ order, index, offset, limit, refetch }) => {
    const { t } = useTranslation();
    const router = useRouter();
    const theme = useTheme();
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'));
    const dispatch = useDispatch();
    
    const serialNumber = (offset - 1) * limit + index + 1;
    
    // Format order details
    const currencySymbol = '₹';
    const getFormattedPrice = (amount) => {
        return `${currencySymbol}${Number(amount).toFixed(2)}`;
    };

    // Get all items excluding customizations
    const mainItems = order?.items?.filter(item => 
        item.tags?.some(tag => 
            tag.code === "type" && 
            tag.list?.some(t => t.code === "type" && t.value === "item")
        )
    );

    // Get customizations for each item
    const getCustomizations = (parentItemId) => {
        return order?.items?.filter(item => 
            item.tags?.some(tag => 
                tag.code === "type" && 
                tag.list?.some(t => t.code === "type" && t.value === "customization")
            ) &&
            item.parent_item_id === parentItemId
        );
    };

    const handleClick = () => {
        router.push(
            { pathname: "/info", query: { page: "order", orderId: order?.id } },
            undefined,
            { shallow: true }
        );
    };

    const handleClickTrackOrder = () => {
        router.push({
            pathname: '/info',
            query: {
                page: "order",
                orderId: order?.id,
            },
        });
    };

    const handleRateButtonClick = () => {
        dispatch(setDeliveryManInfoByDispatch(order?.delivery_man));
        setOpenReviewModal(true);
    };

    return (
        <Card className="w-full p-4 mb-4 rounded-lg bg-white shadow-sm" style={{padding:'4px'}}>
            <Grid container spacing={2}>
                {/* Restaurant Info Section */}
                <Grid item xs={12} md={6}>
                    <CustomStackFullWidth direction="row" spacing={2}>
                        <CustomImageContainer
                            src={order?.provider?.descriptor?.symbol}
                            width="80px"
                            height="80px"
                            className="rounded-lg object-cover"
                        />
                        <Stack spacing={1} className="flex-grow">
                            <Typography variant="h6" className="font-semibold text-base">
                                {order?.provider?.descriptor?.name}
                            </Typography>
                            <Typography variant="body2" className="text-gray-600 text-sm">
                                {order?.fulfillments[0]?.end?.location?.address?.locality}, 
                                {order?.fulfillments[0]?.end?.location?.address?.city}, 
                                {order?.fulfillments[0]?.end?.location?.address?.state}, 
                                {order?.fulfillments[0]?.end?.location?.address?.area_code}, 
                            </Typography>
                            <CustomColouredTypography 
                                className="text-sm capitalize"
                                color={order?.order_status === 'delivered' ? 'success.main' : 'primary'}
                            >
                                {t(order?.state || 'Created')}
                            </CustomColouredTypography>
                        </Stack>
                    </CustomStackFullWidth>
                </Grid>

                {/* Order Details Section */}
                <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                        {/* Items List */}
                        {mainItems?.map((item, idx) => (
                            <Stack key={idx} className="border-b border-gray-100 pb-2">
                                <Typography className="font-medium">
                                    {item.product?.descriptor?.name}
                                </Typography>
                                {getCustomizations(item.parent_item_id)?.map((customization, cidx) => (
                                    <Typography key={cidx} variant="body2" className="text-gray-600 pl-4">
                                        + {customization.product?.item_details?.descriptor?.name}
                                    </Typography>
                                ))}
                                <Typography className="font-semibold">
                               Total Paid: <strong>{getFormattedPrice(order?.quote?.price?.value)}</strong>
                            </Typography>
                            </Stack>
                        ))}
                        
                        {/* Order Meta */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" className="text-gray-600">
                                <b><CustomFormatedDateTime date={order?.createdAt} /></b>
                            </Typography>
                            { (
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={handleClickTrackOrder}
                                    startIcon={<LocalShippingIcon />}
                                    className="bg-primary"
                                >
                                    {t('View Summary')}
                                </Button>
                            )}
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>

            <ReviewSideDrawer
                open={openReviewModal}
                onClose={() => setOpenReviewModal(false)}
                orderId={order?.id}
                refetch={refetch}
            />
        </Card>
    );
};

export default OrderCard;