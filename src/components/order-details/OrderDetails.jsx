import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  useMediaQuery,
  Stack,
  Grid,
  Typography,
  NoSsr,
  Button,
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
import Meta from "../Meta";
import { EventSourcePolyfill } from "event-source-polyfill";
import CustomDivider from "../CustomDivider";
import Router from 'next/router'
import {  useRouter } from "next/router";
import { useTheme } from "@emotion/react";
import { useTranslation } from "react-i18next";
import { CustomPaperBigCard } from "@/styled-components/CustomStyles.style";
import OrderDetailsBottom from "./OrderDetailsBottom";
import TrackingPage from "../order-tracking/TrackingPage";
import CustomImageContainer from "../CustomImageContainer";
import { getCall, postCall } from "@/api/MainApi";
import OrderActions from "./orderAction";
import CustomerDetails from "./customerOrderDetails";
import CustomModal from "../custom-modal/CustomModal";
import CancelOrder from "./CancelOrder";
import OrderActionsGroup from "./orderActionButtons";
import IssueForm from "./raiseIssueModal";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { getValueFromCookie } from "@/utils/cookies";
import CancelOrderModal from "./CancelOrder";

const OrderDetails = () => {
  const [order, setOrder] = useState();
  const router = useRouter();
  const { orderId, phone, isTrackOrder } = router.query;
  const theme = useTheme();
  const isXSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { t } = useTranslation();
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState(null);
  const [cancelReasonsData, setCancelReasonsData] = useState();
  const [issueDetailData, setIssueDetailData] = useState();
  const [openRaiseIssueModal, setOpenRaiseIssueModal] = useState(false);
  const [itemQuotes, setItemQuotes] = useState(null);

  const [cancelledItems, setCancelledItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [returnOrCancelledItems, setReturnOrCancelledItems] = useState([]);
  const [deliveryQuotes, setDeliveryQuotes] = useState(null);
  const [offerQuotes, setOfferQuotes] = useState([]);

  const [quoteItemInProcessing, setQuoteItemInProcessing] = useState(null);

  const [toggleReturnOrderModal, setToggleReturnOrderModal] = useState(false);
  const [toggleCancelOrderModal, setToggleCancelOrderModal] = useState(false);
  const [toggleRatingsModal, setToggleRatingsModal] = useState(false);
  const [productsList, setProductsList] = useState([]);
  const [allNonCancellable, setAllNonCancellable] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [isIssueRaised, setIsIssueRaised] = useState(false);
  const [orderIssueId, setOrderIssueId] = useState("");
  const [issueLoading, setIssueLoading] = useState(false);
  const [toggleIssueModal, setToggleIssueModal] = useState(false);

  const statusEventSourceResponseRef = useRef(null);
  const eventTimeOutRef = useRef([]);

  const [trackOrderLoading, setTrackOrderLoading] = useState(false);
  const trackOrderRef = useRef(null);
  const trackEventSourceResponseRef = useRef(null);
  const handleOnSuccess = () => {};
  const getItemDetails = async () => {
    try {
      const url = `/clientApis/v2/orders/${orderId}`;
      const res = await getCall(url);
      setOrder(res[0]);
      await getIssue(res[0]?.parentOrderId);
    } catch (error) {
      console.log("Error fetching item:", error);
    }
  };

  const isItemCustomization = (tags) => {
    let isCustomization = false;
    tags?.forEach((tag) => {
      if (tag.code === "type") {
        tag.list.forEach((listOption) => {
          if (
            listOption.code === "type" &&
            listOption.value == "customization"
          ) {
            isCustomization = true;
            return true;
          }
        });
      }
    });
    return isCustomization;
  };

  const getOfferDetails = (tags) => {
    let offer_type = "";
    let offer_name = "";

    tags?.forEach((tag) => {
      if (tag.code === "quote") {
        tag.list?.forEach((list_item) => {
          if (list_item.code === "type") {
            offer_type = list_item.value;
          }
        });
      }

      if (tag.code === "offer") {
        tag.list?.forEach((list_item) => {
          if (list_item.code === "id") {
            offer_name = list_item.value;
          }
        });
      }
    });

    if (offer_type && offer_name) {
      return { type: offer_type, name: offer_name };
    } else {
      return {};
    }
  };
  const getReturnOrCancelledItems = () => {
    let items = [];
    order?.fulfillments?.forEach((f) => {
      if (f.type === "Return") {
        const details = f.tags[0].list;
        items.push({
          id: details.find((d) => d.code === "item_id")["value"],
          quantity: details.find((d) => d.code === "item_quantity")["value"],
          type: f.type,
          status: f.state.descriptor.code,
        });
      }
    });
    return items;
  };
  useEffect(() => {
    try {
      if (order) {
        if (order.updatedQuote) {
          const provided_by = order?.provider?.descriptor?.name;
          let uuid = 0;
          const breakup = order.updatedQuote.breakup;
          const all_items = breakup?.map((break_up_item) => {
            const items = Object.assign(
              [],
              JSON.parse(JSON.stringify(order.items))
            );
            const itemIndex = items.findIndex(
              (one) => one.id === break_up_item["@ondc/org/item_id"]
            );
            const item = itemIndex > -1 ? items[itemIndex] : null;
            let itemQuantity = item ? item?.quantity?.count : 0;
            let quantity = break_up_item["@ondc/org/item_quantity"]
              ? break_up_item["@ondc/org/item_quantity"]["count"]
              : 0;
            let textClass = "";
            let quantityMessage = "";
            if (quantity === 0) {
              if (break_up_item["@ondc/org/title_type"] === "item") {
                textClass = "text-error";
                quantityMessage = "Out of stock";

                if (itemIndex > -1) {
                  items.splice(itemIndex, 1);
                }
              }
            } else if (quantity !== itemQuantity) {
              textClass =
                break_up_item["@ondc/org/title_type"] === "item"
                  ? "text-amber"
                  : "";
              quantityMessage = `Quantity: ${quantity}/${itemQuantity}`;
              if (item) {
                item.quantity.count = quantity;
              }
            } else {
              quantityMessage = `Quantity: ${quantity}`;
            }
            uuid = uuid + 1;
            return {
              id: break_up_item["@ondc/org/item_id"],
              title: break_up_item?.title,
              title_type: break_up_item["@ondc/org/title_type"],
              isCustomization: isItemCustomization(break_up_item?.item?.tags),
              isDelivery: break_up_item["@ondc/org/title_type"] === "delivery",
              isOffer: break_up_item["@ondc/org/title_type"] === "offer",
              offer: getOfferDetails(break_up_item?.item?.tags),
              parent_item_id: break_up_item?.item?.parent_item_id,
              price: Number(break_up_item.price?.value)?.toFixed(2),
              itemQuantity,
              quantity,
              provided_by,
              textClass,
              quantityMessage,
              uuid: uuid,
              fulfillment_status: item?.fulfillment_status,
              cancellation_status: item?.cancellation_status,
              return_status: item?.return_status,
              isCancellable: item?.product?.["@ondc/org/cancellable"],
              isReturnable: item?.product?.["@ondc/org/returnable"],
            };
          });
          let items = {};
          let delivery = {};
          let offers = [];
          let valid_fulfullment_ids = order?.items.map(
            (item) => item.fulfillment_id
          );
          let selected_fulfillment_id = order?.items[0]?.fulfillment_id;
          all_items.forEach((item) => {
            setQuoteItemInProcessing(item.id);
            // for type item
            if (item.title_type === "item" && !item.isCustomization) {
              let key = item.parent_item_id || item.id;
              let price = {
                title: item.quantity + " * Base Price",
                value: item.price,
              };
              let prev_item_data = items[key];
              let addition_item_data = {
                title: item.title,
                quantity: item.quantity,
                price: price,
                fulfillment_status: item.fulfillment_status,
              };
              items[key] = { ...prev_item_data, ...addition_item_data };
            }
            if (
              item.title_type === "tax" &&
              !item.isCustomization &&
              !item.isFulfillment &&
              !valid_fulfullment_ids.includes(item.id)
              //item.id !== selected_fulfillment_id
              // item.id !== selected_fulfillments
            ) {
              let key = item.parent_item_id || item.id;
              items[key] = items[key] || {};
              items[key]["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (
              item.title_type === "discount" &&
              !item.isCustomization &&
              !item.isFulfillment
            ) {
              let key = item.parent_item_id || item.id;
              items[key] = items[key] || {};
              items[key]["discount"] = {
                title: item.title,
                value: item.price,
              };
            }

            //for customizations
            if (item.title_type === "item" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"] = items[key]["customizations"] || {};
              let existing_data = items[key]["customizations"][item.id] || {};
              let customisation_details = {
                title: item.title,
                price: {
                  title: item.quantity + " * Base Price",
                  value: item.price,
                },
                quantityMessage: item.quantityMessage,
                textClass: item.textClass,
                quantity: item.quantity,
                cartQuantity: item.cartQuantity,
                fulfillment_status: item.fulfillment_status,
              };
              items[key]["customizations"][item.id] = {
                ...existing_data,
                ...customisation_details,
              };
            }
            if (item.title_type === "tax" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"] = items[key]["customizations"] || {};
              items[key]["customizations"][item.id] =
                items[key]["customizations"][item.id] || {};
              items[key]["customizations"][item.id]["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount" && item.isCustomization) {
              let key = item.parent_item_id;
              items[key]["customizations"] = items[key]["customizations"] || {};
              items[key]["customizations"][item.id] =
                items[key]["customizations"][item.id] || {};
              items[key]["customizations"][item.id]["discount"] = {
                title: item.title,
                value: item.price,
              };
            }

            // for item level offer
            if (item.isOffer && item.offer?.type === "item") {
              let key = item.id;
              items[key] = items[key] || {};
              let offer = {
                title: item.offer?.name,
                value: item.price,
              };
              const existing_offers = items[key]["offers"] || [];
              items[key]["offers"] = [...existing_offers, offer];
            }

            //for delivery
            if (
              item.title_type === "delivery" &&
              valid_fulfullment_ids.includes(item.id)
              //item.id === selected_fulfillment_id
              // item.id === selected_fulfillments
            ) {
              delivery["delivery"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (
              (item.title_type === "discount_f" ||
                item.title_type === "discount") &&
              item.isFulfillment
            ) {
              delivery["discount"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (
              (item.title_type === "tax_f" || item.title_type === "tax") &&
              valid_fulfullment_ids.includes(item.id)
              // item.id === selected_fulfillment_id
              // item.id === selected_fulfillments
            ) {
              delivery["tax"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (
              item.title_type === "packing" &&
              valid_fulfullment_ids.includes(item.id)
              // item.id === selected_fulfillment_id
              // item.id === selected_fulfillments
            ) {
              delivery["packing"] = {
                title: item.title,
                value: item.price,
              };
            }
            if (item.title_type === "discount") {
              if (item.isCustomization) {
                let id = item.parent_item_id;
              } else {
                let id = item.id;
                items[id]["discount"] = {
                  title: item.title,
                  value: item.price,
                };
              }
            }
            if (
              item.title_type === "misc" &&
              valid_fulfullment_ids.includes(item.id)
              // item.id === selected_fulfillment_id
              // item.id === selected_fulfillments
            ) {
              delivery["misc"] = {
                title: item.title,
                value: item.price,
              };
            }

            // for fulfillment level offer
            if (
              item.isOffer &&
              item.offer?.type === "fulfillment" &&
              valid_fulfullment_ids.includes(item.id)
            ) {
              let offer = {
                title: item.offer?.name,
                value: item.price,
              };
              const existing_offers = delivery["offers"] || [];
              delivery["offers"] = [...existing_offers, offer];
            }

            // for order level offer
            if (item.isOffer && item.offer?.type === "order") {
              let key = item.id;
              let offer = {
                title: item.offer?.name,
                value: item.price,
              };
              offers.push(offer);
            }
          });
          setQuoteItemInProcessing(null);
          setItemQuotes(items);
          setDeliveryQuotes(delivery);
          setOfferQuotes(offers);
        }
        if (order.items && order.items.length > 0) {
          const filterCancelledItems = order.items.filter(
            (item) =>
              item.cancellation_status &&
              item.cancellation_status === "Cancelled"
          );
          const filterReturnItems = order.items.filter(
            (item) =>
              item.cancellation_status &&
              item.cancellation_status !== "Cancelled"
          );
          setCancelledItems(filterCancelledItems);
          setReturnItems(filterReturnItems);
        }
        setReturnOrCancelledItems(getReturnOrCancelledItems());
      }
    } catch (error) {
      console.log(error);
      showQuoteError();
    }
  }, [order]);
  const areAllItemsNonCancellable = (products) => {
    return !products.some((obj) => obj["@ondc/org/cancellable"]);
  };
  useEffect(() => {
    if (order && itemQuotes) {
      console.log("item quote", itemQuotes);
      const productsList = generateProductsList(order, itemQuotes);
      setProductsList(productsList);
    }
  }, [order, itemQuotes]);

  useEffect(() => {
    if (!!productsList.length) {
      setAllNonCancellable(areAllItemsNonCancellable(productsList));
    }
  }, [productsList]);
  const showQuoteError = () => {
    let msg = "";
    if (quoteItemInProcessing) {
      msg = `Looks like Quote mapping for item: ${quoteItemInProcessing} is invalid! Please check!`;
    } else {
      msg =
        "Seems like issue with quote processing! Please confirm first if quote is valid!";
    }
    CustomToaster("error", msg);
  };
  const getIssue = async (transactionId) => {
    try {
      const url = `issueApis/v1/issue?transactionId=${transactionId}`;
      const res = await getCall(url);
      setIssueDetailData(res);
    } catch (error) {
      console.log("Error fetching issues:", error);
    }
  };

  useEffect(() => {
    if (orderId) {
      getItemDetails();
    }
  }, [orderId]);

  const getBreakupItemByType = (type) => {
    return order?.quote?.breakup?.find(
      (item) => item["@ondc/org/title_type"] === type
    );
  };

  const getCustomizations = (parentItemId) => {
    return order?.items?.filter((item) => {
      return (
        item.tags?.some(
          (tag) => tag.code === "type" && tag.list[0]?.value === "customization"
        ) && item.parent_item_id === parentItemId
      );
    });
  };

  const getBaseItems = () => {
    return order?.items?.filter(
      (item) =>
        !item.tags?.some(
          (tag) => tag.code === "type" && tag.list[0]?.value === "customization"
        )
    );
  };
  const handleRaiseIssue = () => {
    console.log("raised issue clicked");
    setOpenRaiseIssueModal(true);
  };

  function generateProductsList(orderDetails, itemQuotes) {
    return orderDetails?.items
      ?.map(({ id, parent_item_id }, index) => {
        let findQuote = orderDetails.updatedQuote?.breakup.find((item) => {
          if (item.item?.parent_item_id) {
            return (
              item["@ondc/org/item_id"] === id &&
              item["@ondc/org/title_type"] === "item" &&
              item.item.parent_item_id === parent_item_id
            );
          } else {
            return (
              item["@ondc/org/item_id"] === id &&
              item["@ondc/org/title_type"] === "item"
            );
          }
        });
        if (findQuote) {
          if (findQuote?.item?.tags) {
            const tag = findQuote.item.tags.find((tag) => tag.code === "type");
            const tagList = tag?.list;
            const type = tagList?.find((item) => item.code === "type");
            if (type?.value === "item") {
              const parentId = findQuote?.item?.parent_item_id;
              let customizations = null;
              if (parentId) {
                customizations =
                  itemQuotes && itemQuotes[parentId]?.customizations;
              } else {
              }
              return {
                id,
                name: findQuote?.title ?? "NA",
                cancellation_status:
                  orderDetails.items?.[index]?.cancellation_status ?? "",
                return_status: orderDetails.items?.[index]?.return_status ?? "",
                fulfillment_id: orderDetails.items?.[index]?.fulfillment_id,
                fulfillment_status:
                  orderDetails.items?.[index]?.fulfillment_status ?? "",
                customizations: customizations ?? null,
                ...orderDetails.items?.[index]?.product,
                parent_item_id: parentId,
                provider_details: orderDetails.provider,
                quantityForReturn:
                  itemQuotes[parentId || findQuote["@ondc/org/item_id"]]
                    .quantity,
              };
            }
          } else {
            const parentId = findQuote?.item?.parent_item_id;
            return {
              id,
              name: findQuote?.title ?? "NA",
              cancellation_status:
                orderDetails.items?.[index]?.cancellation_status ?? "",
              return_status: orderDetails.items?.[index]?.return_status ?? "",
              fulfillment_status:
                orderDetails.items?.[index]?.fulfillment_status ?? "",
              customizations: null,
              ...orderDetails.items?.[index]?.product,
              parent_item_id: parentId,
              provider_details: orderDetails.provider,
              quantityForReturn:
                itemQuotes[parentId || findQuote["@ondc/org/item_id"]]
                  ?.quantity,
            };
          }
        } else {
          findQuote = orderDetails.updatedQuote?.breakup[index];
        }
        return null;
      })
      .filter((item) => item !== null && item.quantityForReturn > 0);
  }
  const getTotalForItem = (item) => {
    const basePrice = parseFloat(item.product?.price?.value || 0);
    const customizations = getCustomizations(item.parent_item_id);
    const customizationsTotal = customizations?.reduce(
      (sum, c) => sum + parseFloat(c.product?.item_details?.price?.value || 0),
      0
    );
    return (basePrice + (customizationsTotal || 0)) * item.quantity?.count;
  };

  if (isTrackOrder) {
    return <TrackingPage OrderData={order} />;
  }
const handleTrackIssue=()=>{
  Router.push({
    pathname: '/info',
    query: {
        page: "ticket"

    },
})
}
  // on status
  async function getUpdatedStatus(message_id) {
    try {
      const data = await getCall(
        `/clientApis/v2/on_order_status?messageIds=${message_id}`
      );
      statusEventSourceResponseRef.current = [
        ...statusEventSourceResponseRef.current,
        data[0],
      ];
      const { message, error = {} } = data[0];
      if (error?.message) {
        CustomToaster("error", "Cannot get status for this product");
        setStatusLoading(false);
        return;
      }
      if (message?.order) {
        getItemDetails();
        CustomToaster("success", "Order status updated successfully!");
      }
      setStatusLoading(false);
    } catch (err) {
      setStatusLoading(false);
      CustomToaster("error", "Cannot get status for this product");
      eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
        eventSource.close();
        clearTimeout(timer);
      });
    }
  }
  function fetchStatusDataThroughEvents(message_id) {
    const token = getValueFromCookie("token");
    let header = {
      headers: {
        ...(token && {
          Authorization: `Bearer ${token}`,
        }),
      },
    };
    let es = new EventSourcePolyfill(
      `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events?messageId=${message_id}`,
      header
    );
    es.addEventListener("on_status", (e) => {
      const { messageId } = JSON.parse(e?.data);
      getUpdatedStatus(messageId);
    });

    const timer = setTimeout(() => {
      es.close();
      if (statusEventSourceResponseRef.current.length <= 0) {
        CustomToaster(
          "error",
          "Cannot proceed with you request now! Please try again"
        );
        setStatusLoading(false);
      }
    }, 20000);

    eventTimeOutRef.current = [
      ...eventTimeOutRef.current,
      {
        eventSource: es,
        timer,
      },
    ];
  }

  async function handleFetchUpdatedStatus() {
    statusEventSourceResponseRef.current = [];
    setStatusLoading(true);
    const transaction_id = order?.transactionId;
    const bpp_id = order?.bppId;
    const order_id = order?.id;
    try {
      const data = await postCall("/clientApis/v2/order_status", [
        {
          context: {
            transaction_id,
            bpp_id,
          },
          message: {
            order_id,
          },
        },
      ]);
      //Error handling workflow eg, NACK
      if (data[0].error && data[0].message.ack.status === "NACK") {
        setStatusLoading(false);
        CustomToaster("error", data[0].error.message);
      } else {
        fetchStatusDataThroughEvents(data[0]?.context?.message_id);
      }
    } catch (err) {
      setStatusLoading(false);
      CustomToaster("error", "Something went wrong");
    }
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
                id={orderId}
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
              {getBaseItems()?.map((item, index) => {
                const customizations = getCustomizations(item.parent_item_id);
                return (
                  <Stack key={index}>
                    <Stack direction="row" justifyContent="space-between">
                      <Stack direction="row" gap="17px">
                        <Stack>
                          <CustomImageContainer
                            src={item?.product?.descriptor?.images[0]}
                            height="60px"
                            maxWidth="60px"
                            width="100%"
                            loading="lazy"
                            smHeight="50px"
                            borderRadius="5px"
                            objectFit="contained"
                          />
                          <OrderFoodName>
                            {item?.product?.descriptor?.name}
                            {customizations?.map((custom, idx) => (
                              <Typography
                                key={idx}
                                fontSize="12px"
                                color="text.secondary"
                              >
                                +{" "}
                                {custom.product?.item_details?.descriptor?.name}{" "}
                                (
                                {getAmount(
                                  custom.product?.item_details?.price?.value ||
                                    0,
                                  "left",
                                  "₹",
                                  2
                                )}
                                )
                              </Typography>
                            ))}
                          </OrderFoodName>
                          <OrderFoodName>
                            {t("Unit Price")}:{" "}
                            {getAmount(
                              item?.product?.price?.value,
                              "left",
                              "₹",
                              2
                            )}
                          </OrderFoodName>
                        </Stack>
                      </Stack>
                      <Stack>
                        <OrderFoodAmount>
                          {getAmount(getTotalForItem(item), "left", "₹", 2)}
                        </OrderFoodAmount>
                        <OrderFoodName textAlign="end">
                          {t("Qty")}: {item?.quantity?.count}
                        </OrderFoodName>
                      </Stack>
                    </Stack>
                  </Stack>
                );
              })}
            </ProductDetailsWrapper>
            {order && <CustomerDetails orderData={order} />}
            <hr />
            <Stack gap="5px" marginTop="20px">
              <Typography fontWeight="600">
                {t("Restaurant Information")}
              </Typography>
              <Stack direction="row" gap="16px">
                <Stack>
                  <Typography fontWeight="500" style={{ fontSize: "14px" }}>
                    {order?.provider?.descriptor?.name}
                  </Typography>
                  <Typography style={{ fontSize: "10px" }}>
                    {
                      order?.fulfillments?.[0]?.start?.location?.address
                        ?.locality
                    }
                    ,{order?.fulfillments?.[0]?.start?.location?.address?.city}
                  </Typography>
                </Stack>
              </Stack>
              <OrderActions />
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
                      getBaseItems()?.reduce(
                        (sum, item) => sum + getTotalForItem(item),
                        0
                      ) || 0,
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
                    {getAmount(
                      getBreakupItemByType("delivery")?.price?.value || 0,
                      "left",
                      "₹",
                      2
                    )}
                  </InfoTypography>
                </Grid>

                <Grid item xs={8}>
                  <InfoTypography>{t("Packing Charge")}</InfoTypography>
                </Grid>
                <Grid item xs={4}>
                  <InfoTypography align="right">
                    {getAmount(
                      getBreakupItemByType("packing")?.price?.value || 0,
                      "left",
                      "₹",
                      2
                    )}
                  </InfoTypography>
                </Grid>

                <Grid item xs={8}>
                  <InfoTypography>{t("Convenience Fee")}</InfoTypography>
                </Grid>
                <Grid item xs={4}>
                  <InfoTypography align="right">
                    {getAmount(
                      getBreakupItemByType("misc")?.price?.value || 0,
                      "left",
                      "₹",
                      2
                    )}
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
            <hr />
          </Grid>
          <OrderActionsGroup
            handleCancelOrder={() => setOpenCancelModal(true)}
            handleGetStatus={handleFetchUpdatedStatus}
            handleRaiseIssue={handleRaiseIssue}
            handleTrackIssue={handleTrackIssue}
            trackIssue={issueDetailData?.issueExistance}
          />
        </Grid>
      </CustomPaperBigCard>
      {order && (
        <IssueForm
          open={openRaiseIssueModal}
          onClose={() => setOpenRaiseIssueModal(false)}
          onSuccess={() => {
            setOpenRaiseIssueModal(false);
            getItemDetails();
            CustomToaster("success", "Complaint raised successfully!");
          }}
          quantity={order.items?.map(({ quantity }) => quantity)}
          partailsIssueProductList={productsList}
          order_status={order.state}
          billing_address={order?.billing}
          transaction_id={order.transactionId}
          order_id={order.id}
          bpp_id={order.bppId}
          bpp_uri={order.bpp_uri}
          fulfillments={order.fulfillments}
          domain={order.domain}
        />
      )}
      {order && (
        <CancelOrderModal
          open={openCancelModal}
          onClose={() => setOpenCancelModal(false)}
          onSuccess={() => {
            setOpenCancelModal(false);
            getItemDetails();
          }}
          quantity={order.items
            ?.filter(
              (item) =>
                !item.hasOwnProperty("cancellation_status") ||
                (item.hasOwnProperty("cancellation_status") &&
                  item.cancellation_status == "") ||
                !item.hasOwnProperty("return_status") ||
                (item.hasOwnProperty("return_status") &&
                  item.return_status == "")
            )
            .map(({ quantity }) => quantity)}
          partailsCancelProductList={
            productsList.filter((item) => {
            if (order.domain === "ONDC:RET11") {
              return (
                order.state === "Created" &&
                item["@ondc/org/cancellable"] == true &&
                item.fulfillment_status == "Pending" &&
                (!item.hasOwnProperty("cancellation_status") ||
                  (item.hasOwnProperty("cancellation_status") &&
                    item.cancellation_status == "") ||
                  !item.hasOwnProperty("return_status") ||
                  (item.hasOwnProperty("return_status") &&
                    item.return_status == ""))
              );
            } else {
              return (
                (order.state === "Accepted" || order.state === "Created") &&
                item["@ondc/org/cancellable"] == true &&
                item.fulfillment_status == "Pending" &&
                (!item.hasOwnProperty("cancellation_status") ||
                  (item.hasOwnProperty("cancellation_status") &&
                    item.cancellation_status == "") ||
                  !item.hasOwnProperty("return_status") ||
                  (item.hasOwnProperty("return_status") &&
                    item.return_status == ""))
              );
            }
          })}
          order_status={order.state}
          bpp_id={order.bppId}
          transaction_id={order.transactionId}
          order_id={order.id}
          domain={order.domain}
          bpp_uri={order.bpp_uri}
          handleFetchUpdatedStatus={handleFetchUpdatedStatus}
          onUpdateOrder={getItemDetails}
        />
      )}
    </NoSsr>
  );
};

export default OrderDetails;
