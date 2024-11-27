import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  useMediaQuery,
} from "@mui/material";
import { getAmount } from "@/utils/customFunctions";
import {
  CustomOrderStatus,
  ProductDetailsWrapper,
  InfoTypography,
  OrderFoodAmount,
  OrderFoodName,
  OrderSummaryGrid,
  TotalGrid,
} from "./OrderDetail.style";
import { Stack, Grid, Typography, NoSsr } from "@mui/material";
import Meta from "../Meta";
import CustomDivider from "../CustomDivider";
import { useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { CustomPaperBigCard } from "@/styled-components/CustomStyles.style";
import OrderDetailsBottom from "./OrderDetailsBottom";
import TrackingPage from "../order-tracking/TrackingPage";
import CustomImageContainer from "../CustomImageContainer";
import { getCall } from "@/api/MainApi";

const OrderDetails = () => {
  const [order, setOrder] = useState();
  const router = useRouter();
  const { orderId, phone, isTrackOrder, token } = router.query;
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();

  const getItemDetails = async () => {
    try {
      const url = `/clientApis/v2/orders/${orderId}`;
      const res = await getCall(url);
      setOrder(res[0]);
    } catch (error) {     
      console.log("Error fetching item:", error);
    }
  };

  useEffect(() => {
   if(orderId)getItemDetails();
  }, [orderId]);

  const getBreakupItemByType = (type) => {
    return order?.quote?.breakup?.find(
      (item) => item["@ondc/org/title_type"] === type
    );
  };

  const getDeliveryCharge = () => {
    const deliveryItem = getBreakupItemByType("delivery");
    return deliveryItem?.price?.value || 0;
  };

  const getPackingCharge = () => {
    const packingItem = getBreakupItemByType("packing");
    return packingItem?.price?.value || 0;
  };

  const getMiscCharge = () => {
    const miscItem = getBreakupItemByType("misc");
    return miscItem?.price?.value || 0;
  };

  if (isTrackOrder) {
    return <TrackingPage data={order} />;
  }

  return (
    <NoSsr>
      <Meta title={`Order details - ONDC`} />
      <CustomPaperBigCard>
        <Grid container>
          <Grid item xs={12} md={7} padding="20px">
            <Stack direction="row" gap="10px">
              <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
                {t("Order")} #{order?.id}
              </Typography>
            </Stack>
            <Stack direction="row" gap="10px">
              <CustomOrderStatus color={theme.palette.info.dark}>
                <Typography component="span" textTransform="capitalize">
                  {t(order?.state)}
                </Typography>
              </CustomOrderStatus>
              <OrderDetailsBottom
                id={order?._id}
                trackData={order}
                isTrackOrder={isTrackOrder}
              />
            </Stack>
            <Stack direction="row" gap="5px" alignItems="center">
              <Typography fontSize="12px">{t("Order date:")}</Typography>
              <Typography fontSize="12px">
                {new Date(order?.createdAt).toLocaleDateString()}
              </Typography>
            </Stack>
          </Grid>
        </Grid>

        <CustomDivider />

        <Grid container spacing={2} padding="15px">
          <Grid item xs={12} sm={7.3}>
            <ProductDetailsWrapper>
              {order?.items?.map((item, index) => (
                <Stack key={index}>
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" gap="17px">
                      <Stack>
                        <CustomImageContainer
                          src={item.product.descriptor.images[0]}
                          height="60px"
                          maxWidth="60px"
                          width="100%"
                          loading="lazy"
                          smHeight="50px"
                          borderRadius="5px"
                          objectFit="contained"
                        />
                        <OrderFoodName>
                          {item.product.descriptor.name}
                        </OrderFoodName>
                        <OrderFoodName>
                          {t("Unit Price")}:{" "}
                          {getAmount(item.product.price.value, "left", "₹", 2)}
                        </OrderFoodName>
                      </Stack>
                    </Stack>
                    <Stack>
                      <OrderFoodAmount>
                        {getAmount(
                          item.product.price.value * item.quantity.count,
                          "left",
                          "₹",
                          2
                        )}
                      </OrderFoodAmount>
                      <OrderFoodName textAlign="end">
                        {t("Qty")}: {item.quantity.count}
                      </OrderFoodName>
                    </Stack>
                  </Stack>
                </Stack>
              ))}
            </ProductDetailsWrapper>

            <Stack gap="25px" marginTop="20px">
              <Typography fontWeight="600">
                {t("Restaurant Information")}
              </Typography>
              <Stack direction="row" gap="16px">
                <Stack>
                  <Typography fontWeight="500">
                    {order?.provider?.descriptor?.name}
                  </Typography>
                  <Typography>
                    {
                      order?.fulfillments?.[0]?.start?.location?.address
                        ?.locality
                    }
                    ,{order?.fulfillments?.[0]?.start?.location?.address?.city}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          <Grid item sm={4.7} xs={12}>
            <OrderSummaryGrid container>
              <Grid item xs={12}>
                <Typography fontWeight="500" padding="12px">
                  {t("Summary")}
                </Typography>
              </Grid>

              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <InfoTypography>{t("Items Price")}</InfoTypography>
                </Grid>
                <Grid item xs={4}>
                  <InfoTypography align="right">
                    {getAmount(
                      order?.items?.[0]?.product?.price?.value || 0,
                      "left",
                      "₹",
                      2
                    )}
                  </InfoTypography>
                </Grid>

                <Grid item xs={8}>
                  <InfoTypography>{t("Delivery Fee")}</InfoTypography>
                </Grid>
                <Grid item xs={4}>
                  <InfoTypography align="right">
                    {getAmount(getDeliveryCharge(), "left", "₹", 2)}
                  </InfoTypography>
                </Grid>

                <Grid item xs={8}>
                  <InfoTypography>{t("Packing Charge")}</InfoTypography>
                </Grid>
                <Grid item xs={4}>
                  <InfoTypography align="right">
                    {getAmount(getPackingCharge(), "left", "₹", 2)}
                  </InfoTypography>
                </Grid>

                <Grid item xs={8}>
                  <InfoTypography>{t("Convenience Fee")}</InfoTypography>
                </Grid>
                <Grid item xs={4}>
                  <InfoTypography align="right">
                    {getAmount(getMiscCharge(), "left", "₹", 2)}
                  </InfoTypography>
                </Grid>
              </Grid>

              <TotalGrid container>
                <Grid item xs={8}>
                  <Typography fontWeight="600">{t("Total")}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography align="right" fontWeight="600">
                    {getAmount(
                      order?.payment?.params?.amount || 0,
                      "left",
                      "₹",
                      2
                    )}
                  </Typography>
                </Grid>
              </TotalGrid>
            </OrderSummaryGrid>
          </Grid>
        </Grid>
      </CustomPaperBigCard>
    </NoSsr>
  );
};

export default OrderDetails;
