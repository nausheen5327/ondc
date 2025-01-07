import React, { useState } from "react";
import { Button, Grid, Stack, Typography } from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import CustomFormatedDateTime from "../date/CustomFormatedDateTime";
import CustomImageContainer from "../CustomImageContainer";
import ReviewSideDrawer from "@/components/order-details/ReviewSideDrawer";
import {
  CustomColouredTypography,
  CustomStackFullWidth,
} from "@/styled-components/CustomStyles.style";
import { setDeliveryManInfoByDispatch } from "@/redux/slices/searchFilter";
import startReview from "../../../public/static/star-review.png";
import { ISSUE_TYPES } from "@/utils/issueType";

const TicketCard = ({ order, index, offset, limit, refetch }) => {
  console.log("order issue", order);
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const serialNumber = (offset - 1) * limit + index + 1;

  // Format order details
  const currencySymbol = "₹";
  const getFormattedPrice = (amount) => {
    return `${currencySymbol}${Number(amount).toFixed(2)}`;
  };

  // Get all items excluding customizations
  const mainItems = order?.items?.filter((item) =>
    item.tags?.some(
      (tag) =>
        tag.code === "type" &&
        tag.list?.some((t) => t.code === "type" && t.value === "item")
    )
  );

  // Get customizations for each item
  const getCustomizations = (parentItemId) => {
    return order?.items?.filter(
      (item) =>
        item.tags?.some(
          (tag) =>
            tag.code === "type" &&
            tag.list?.some(
              (t) => t.code === "type" && t.value === "customization"
            )
        ) && item.parent_item_id === parentItemId
    );
  };

  const handleClick = () => {
    router.push(
      { pathname: "/info", query: { page: "order", orderId: order?.id } },
      undefined,
      { shallow: true }
    );
  };

  const handleClickSummary = () => {
    router.push({
      pathname: "/info",
      query: {
        page: "ticket",
        ticketId: order?.transaction_id,
      },
    });
  };

  const handleRateButtonClick = () => {
    dispatch(setDeliveryManInfoByDispatch(order?.delivery_man));
    setOpenReviewModal(true);
  };

  const getSubCategory = (category, subCategory) => {
    const categoryObj = ISSUE_TYPES.find(
      (item) => item.value.toLowerCase() === category.toLowerCase()
    );

    // Find the subcategory object
    if (categoryObj) {
      const subCategoryObj = categoryObj.subCategory.find(
        (sub) => sub.enums === subCategory
      );
      if (subCategoryObj) {
        return subCategoryObj.value;
      } else {
        return;
      }
    } else {
      return;
    }
  };

  return (
    <Card
      className="w-full p-4 mb-4 rounded-lg bg-white shadow-sm"
      style={{ padding: "4px",marginBottom:'20px' }}
    >
      <Grid container spacing={2}>
        {/* Restaurant Info Section */}
        <Grid item xs={12} md={6}>
          <CustomStackFullWidth direction="row" spacing={2}>
            <CustomImageContainer
              src={order?.order_details?.items[0]?.product?.descriptor?.images[0]}
              width="80px"
              height="80px"
              className="rounded-lg object-cover"
            />
            <Stack spacing={1} className="flex-grow">
              <Typography variant="h3" className="font-semibold text-base">
                {order?.order_details?.items[0]?.product?.name}
              </Typography>
              <Typography variant="body2" className="text-gray-600 text-sm">
                {
                  order?.order_details?.fulfillments[0]?.end?.location?.address
                    ?.locality
                }
                ,
                {
                  order?.order_details?.fulfillments[0]?.end?.location?.address
                    ?.city
                }
                ,
                {
                  order?.order_details?.fulfillments[0]?.end?.location?.address
                    ?.state
                }
                ,
                {
                  order?.order_details?.fulfillments[0]?.end?.location?.address
                    ?.area_code
                }
                ,
              </Typography>
              <Typography>
                {order?.category}: <b>{getSubCategory(order?.category,order?.sub_category)}</b>
              </Typography>
             
            </Stack>
          </CustomStackFullWidth>
        </Grid>

        {/* Order Details Section */}
        <Grid item xs={12} md={6}>
            <Stack direction={'row'}>
            
              <Typography>Status : &nbsp;
              </Typography>
              <CustomColouredTypography
                className="text-sm capitalize"
                color={
                  order?.issue_status === "delivered"
                    ? "success.main"
                    : "primary"
                }
              >
                {t(order?.issue_status)}
                
              </CustomColouredTypography>
            </Stack>
        
        <Typography variant="h5">Issue id: {order?.issueId}</Typography>
          <Stack spacing={2}>
            {/* Items List */}
           

            {/* Order Meta */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" className="text-gray-600">
                <b>
                  <CustomFormatedDateTime date={order?.created_at} />
                </b>
              </Typography>
              {
                <Button
                  variant="contained"
                  size="small"
                  onClick={handleClickSummary}
                  startIcon={''}
                  className="bg-primary"
                >
                  {t("View Summary")}
                </Button>
              }
            </Stack>
          </Stack>
        </Grid>
        
      </Grid>
    </Card>
  );
};

export default TicketCard;
