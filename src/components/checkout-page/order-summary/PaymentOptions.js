import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Grid, Stack, Typography, alpha } from '@mui/material'
import {
    PaymentButton,
    PaymentOptionGrid,
    PymentTitle,
} from '../CheckOut.style'
import cash from '../../../../public/static/buttonImg/cashonbtn.png'
import digital from '../../../../public/static/buttonImg/digitalbtn.png'
import wallet from '../../../../public/static/buttonImg/walletbtn.png'
import { useTranslation } from 'react-i18next'
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined'
import {
    CustomCheckBoxStack,
    CustomPaperBigCard,
    CustomStackFullWidth,
} from '../../../styled-components/CustomStyles.style'
import CustomImageContainer from '../../CustomImageContainer'
import placeholder from '../../../../public/static/no-image-found.jpg'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import CustomDivider from '../../CustomDivider'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import CustomModal from '../../custom-modal/CustomModal'
import AllPaymentMethod from '../AllPaymentMethod'
import OfflinePayment from '../assets/OfflinePayment'
import { useDispatch, useSelector } from "react-redux";
import { setOfflineInfoStep, setOfflineMethod } from "@/redux/slices/OfflinePayment"
import { styled } from '@mui/styles'
import money from '../assets/fi_2704332.png'

const PayButton = styled(Button)(({ theme, value, paymentMethod }) => ({
  padding: '16px 16px',
  gap: '10px',
  alignItems: 'center',
  border: '1px solid',
  borderColor: alpha(theme.palette.neutral[400], 0.4),
  color:
      value === paymentMethod
          ? theme.palette.neutral[1000]
          : theme.palette.neutral[1000],
  background:
      value === paymentMethod && alpha(theme.palette.primary.main, 0.6),
  '&:hover': {
      color: theme.palette.neutral[1000],
      background: value === paymentMethod && theme.palette.primary.main,
  },
}))
const PaymentOptions = (props) => {
    const theme = useTheme()
    const {
        global,
        paymenMethod,
        setPaymenMethod,
        subscriptionStates,
        usePartialPayment,
        selected,
        setSelected,
        paymentMethodDetails,
        setPaymentMethodDetails,
        setSwitchToWallet,
        offlinePaymentOptions,
    } = props
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false)
    const { offLineWithPartial } = useSelector((state) => state.offlinePayment);
    const [isCheckedOffline, setIsCheckedOffline] = useState(selected?.method === "offline_payment" ? true : false);
    const { offlineInfoStep } = useSelector((state) => state.offlinePayment);
    const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
    const [eventData, setEventData] = useState([]);
    const cartItems = useSelector(state=>state.cart.cartList)
    const updatedCartItems = useRef([]);
    const responseRef = useRef([]);
    const eventTimeOutRef = useRef([]);
    


    const responseReceivedIds = cartItems.map((item) => {
        const { message } = item;
        return message?.quote?.provider?.id.toString();
      })

    const imageUrl = global?.base_urls?.gateway_image_url
    const getPaymentMethod = (item) => {
        setSelected(item)
        setPaymenMethod(item.name)
        setPaymentMethodDetails(item);
    }

    const handleClick = () => {
        setOpenModal(true)
    }

    const getKeys = async () => {
        const url = "/clientApis/v2/razorpay/razorPay/keys";
        try {
          const res = await cancellablePromise(getCall(url));
          setPaymentKey(res.keyId);
          return res.keyId;
        } catch (error) {
          console.log("keys error: ", error.response);
        }
      };
    
      const createPayment = async () => {
        const url = `/clientApis/v2/razorpay/${transaction_id}`;
        const data = {
          amount,
        };
        try {
          const res = await cancellablePromise(postCall(url, data));
          setPaymentParams(res.data);
          return res.data;
        } catch (error) {
          console.log("create payment error: ", error.response);
        }
      };
    
      const handleSuccess = async () => {
        setInitializeOrderLoading(false);
        updateInitLoading(false);
        let checkoutObj = {
          successOrderIds: [],
          productQuotes: [],
        };
        responseRef.current.forEach((item) => {
          const { message } = item;
          checkoutObj = {
            productQuotes: [...checkoutObj.productQuotes, message?.order?.quote],
            successOrderIds: [...checkoutObj.successOrderIds, message?.order?.provider?.id.toString()],
          };
        });
        // AddCookie("checkout_details", JSON.stringify(checkoutObj));
        localStorage.setItem("checkout_details", JSON.stringify(checkoutObj));
        // handleNext();
        await getKeys();
        await createPayment();
      };
    
      const onInitializeOrder = async (message_id) => {
        setInitializeOrderLoading(true);
        try {
          localStorage.setItem("selectedItems", JSON.stringify(updatedCartItems));
          const data = await cancellablePromise(getCall(`/clientApis/v2/on_initialize_order?messageIds=${message_id}`));
          responseRef.current = [...responseRef.current, data[0]];
          setEventData((eventData) => [...eventData, data[0]]);
    
          let oldData = updatedCartItems.current;
          oldData[0].message.quote.quote = data[0].message.order.quote;
          oldData[0].message.quote.payment = data[0].message.order.payment;
    
          setUpdateCartItemsDataOnInitialize(oldData);
          handleSuccess();
        } catch (err) {
          dispatchToast(toast_types.error, err?.response?.data?.error?.message);
          setInitializeOrderLoading(false);
          updateInitLoading(false);
        }
        // eslint-disable-next-line
      };
    
      // use this function to initialize the order
      function onInit(message_id) {
        setInitializeOrderLoading(true);
        eventTimeOutRef.current = [];
        const token = getValueFromCookie("token");
        let header = {
          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        };
        message_id.forEach((id) => {
          let es = new window.EventSourcePolyfill(
            `${process.env.REACT_APP_BASE_URL}clientApis/events/v2?messageId=${id}`,
            header
          );
          es.addEventListener("on_init", (e) => {
            const { messageId } = JSON.parse(e.data);
            onInitializeOrder(messageId);
          });
          const timer = setTimeout(() => {
            eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
              eventSource.close();
              clearTimeout(timer);
            });
            // check if all the orders got cancled
            if (responseRef.current.length <= 0) {
              setInitializeOrderLoading(false);
              dispatchToast(toast_types.error, "Cannot fetch details for this product Please try again!");
              return;
            }
            // tale action to redirect them.
            const requestObject = constructQouteObject(
              updatedCartItems.filter(({ provider }) => responseReceivedIds.includes(provider.id.toString()))
            );
            if (requestObject.length !== responseRef.current.length) {
              dispatchToast(toast_types.error, "Some orders are not initialized!");
              // navigateToPayment();
            }
          }, SSE_TIMEOUT);
    
          eventTimeOutRef.current = [
            ...eventTimeOutRef.current,
            {
              eventSource: es,
              timer,
            },
          ];
        });
      }
    
      const initializeOrder = async (itemsList) => {
        const items = JSON.parse(JSON.stringify(Object.assign([], itemsList)));
        responseRef.current = [];
        setInitializeOrderLoading(true);
        try {
          const search_context = JSON.parse(getValueFromCookie("search_context"));
    
          const data = await cancellablePromise(
            postCall(
              "/clientApis/v2/initialize_order",
    
              items.map((item) => {
                let itemsData = Object.assign([], JSON.parse(JSON.stringify(item)));
                itemsData = itemsData.map((itemData) => {
                  itemData.fulfillment_id = selectedFulfillments[itemData.local_id];
                  delete itemData.product.fulfillment_id;
                  if (updatedCartItems.current) {
                    let findItemFromQuote = updatedCartItems.current[0].message.quote.items.find(
                      (data) => data.id === itemData.local_id
                    );
                    if (findItemFromQuote) {
                      itemData.parent_item_id = findItemFromQuote.parent_item_id;
                    }
                  } else {
                  }
                  return itemData;
                });
    
                return {
                  context: {
                    transaction_id: transaction_id,
                    city: search_context.location.name,
                    city: item[0].contextCity,
                    state: search_context.location.state,
                    domain: item[0].domain,
                    pincode: JSON.parse(getValueFromCookie("delivery_address"))?.location.address.areaCode,
                  },
                  message: {
                    items: itemsData,
                    fulfillments: fulfillments.filter((fulfillment) =>
                      Object.values(selectedFulfillments).includes(fulfillment.id)
                    ),
                    offers: getSelectedOffers(),
                    billing_info: {
                      address: removeNullValues(billingAddress?.address),
                      phone: billingAddress?.phone,
                      name: billingAddress?.name,
                      email: billingAddress?.email,
                    },
                    delivery_info: {
                      type: "Delivery",
                      name: deliveryAddress?.name,
                      email: deliveryAddress?.email,
                      phone: deliveryAddress?.phone,
                      location: {
                        gps: `${deliveryAddress?.location?.address?.lat},${deliveryAddress?.location?.address?.lng}`,
                        ...deliveryAddress?.location,
                      },
                    },
                    payment: {
                      type: activePaymentMethod === payment_methods.COD ? "ON-FULFILLMENT" : "ON-ORDER",
                    },
                  },
                };
              })
            )
          );
    
          //Error handling workflow eg, NACK
          const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
          if (isNACK) {
            dispatchToast(toast_types.error, isNACK.error.message);
            setInitializeOrderLoading(false);
            updateInitLoading(false);
          } else {
            const parentTransactionIdMap = new Map();
            data.map((data) => {
              const provider_id = data?.context?.provider_id;
              return parentTransactionIdMap.set(provider_id, {
                parent_order_id: data?.context?.parent_order_id,
                transaction_id: data?.context?.transaction_id,
              });
            });
            // store parent order id to cookies
            AddCookie("parent_order_id", data[0]?.context?.parent_order_id);
            // store the map into cookies
            AddCookie("parent_and_transaction_id_map", JSON.stringify(Array.from(parentTransactionIdMap.entries())));
            onInit(
              data?.map((txn) => {
                const { context } = txn;
                return context?.message_id;
              })
            );
          }
        } catch (err) {
          console.log(err);
          dispatchToast(toast_types.error, err?.response?.data?.error?.message);
          setInitializeOrderLoading(false);
          updateInitLoading(false);
        }
      };
      function constructQouteObject(cartItems) {
        const map = new Map();
        cartItems.map((item) => {
          let bpp_uri = item?.product?.context?.bpp_uri;
          if (bpp_uri) {
            item.bpp_uri = bpp_uri;
          }
      
          const provider_id = item.provider.id;
          if (map.get(provider_id)) {
            return map.set(provider_id, [...map.get(provider_id), item]);
          }
          return map.set(provider_id, [item]);
        });
        return Array.from(map.values());
      }
      
      const handleInitializaOrder = () => {
        // setInitializeOrderLoading(true);
        // updateInitLoading(true);
        let c = cartItems.map((item) => {
          return item.item;
        });
        console.log(cartItems,"payment integration 1");
        const request_object = constructQouteObject(
          c.filter(({ provider }) => responseReceivedIds.includes(provider.local_id.toString()))
        );
        console.log("payment integration", request_object);
        initializeOrder(request_object);
      };
    
    const handleSubmit = () => {
        handleInitializaOrder()
    }

    return (
        <CustomPaperBigCard nopadding="true">
            <Grid container>
                <Grid item xs={12} md={12}>
                    <CustomStackFullWidth
                        justifyContent="space-between"
                        direction="row"
                        padding="19px 16px 3px 16px"
                    >
                        <PymentTitle>{t('Payment Options')}</PymentTitle>
                        {/* <BorderColorOutlinedIcon
                            onClick={handleClick}
                            color="primary"
                            style={{ cursor: 'pointer' }}
                        /> */}
                    </CustomStackFullWidth>
                </Grid>
                <CustomStackFullWidth
                direction="row"
                gap="1rem"
                sx={{ flexWrap: 'wrap' }}
                padding="20px"
            >
                <PayButton
                    value="cash_on_delivery"
                    paymentMethod={selected?.name}
                    onClick={() => {
                        getPaymentMethod({
                            name: 'cash_on_delivery',
                            image: money,
                        })
                        // dispatch(setOfflineInfoStep(0))
                    }}
                >
                    <CustomImageContainer
                        src={money.src}
                        width="20px"
                        height="20px"
                        alt="cod"
                    />
                    <Typography
                        fontSize="12px"
                        color={
                            selected?.name ===
                                'cash_on_delivery'
                                ? theme.palette
                                    .neutral[1000]
                                : theme.palette.primary.main
                        }
                    >
                        {t('Pay after service')}
                    </Typography>
                </PayButton>
                <PayButton
                    value="prepaid"
                    paymentMethod={selected?.name}
                    onClick={() => {
                        getPaymentMethod({
                            name: 'prepaid',
                            image: wallet,
                        })
                        // dispatch(setOfflineInfoStep(0))
                    }}
                >
                    <CustomImageContainer
                        src={wallet.src}
                        width="20px"
                        height="20px"
                        alt="cod"
                    />
                    <Typography
                        fontSize="12px"
                        color={
                            selected?.name ===
                                'prepaid'
                                ? theme.palette
                                    .neutral[1000]
                                : theme.palette.primary.main
                        }
                    >
                        {t('Prepaid')}
                    </Typography>
                </PayButton>
            </CustomStackFullWidth>
                {/* <CustomStackFullWidth
                    direction="row"
                    padding="16px"
                    sx={{ cursor: 'pointer' }}
                    onClick={handleClick}
                >
                    {paymentMethodDetails?.name ? (
                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                        >
                            {paymentMethodDetails?.name === 'wallet' ||
                                paymentMethodDetails?.name ===
                                'cash_on_delivery' ? (
                                <CustomImageContainer
                                    maxWidth="100%"
                                    width="unset"
                                    height="32px"
                                    objectfit="contain"
                                    src={paymentMethodDetails?.image.src}
                                />
                            ) : (
                                <>
                                    {paymentMethodDetails?.method === 'offline_payment' ? (<OfflinePayment />)
                                        : (
                                            <CustomImageContainer
                                                maxWidth="100%"
                                                width="unset"
                                                height="32px"
                                                objectfit="contain"
                                                src={paymentMethodDetails?.image}
                                            />
                                        )

                                    }
                                </>
                            )
                            }
                            <Typography
                                fontSize="14px"
                                fontWeight="500"
                                color={theme.palette.primary.main}
                                textTransform="capitalize"
                            >
                                {paymentMethodDetails?.method ? `${t(paymentMethodDetails?.method?.replaceAll('_', ' '))} (${t(paymentMethodDetails?.name)})` : `${t(paymentMethodDetails?.name?.replaceAll('_', ' '))}`}
                            </Typography>
                        </Stack>
                    ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AddCircleOutlineIcon
                                style={{ width: '22px', height: '22px' }}
                                color="primary"
                            />
                            <Typography
                                fontSize="14px"
                                fontWeight="500"
                                color={theme.palette.primary.main}
                            >
                                {t('Add Payment Method')}
                            </Typography>
                        </Stack>
                    )}
                </CustomStackFullWidth> */}
                {/* {openModal && (
                    <CustomModal
                        openModal={openModal}
                        handleClose={() => setOpenModal(false)}
                        setModalOpen={setOpenModal}
                        maxWidth="640px"
                        bgColor={theme.palette.customColor.ten}
                    >
                        <AllPaymentMethod
                            handleClose={() => setOpenModal(false)}
                            paymenMethod={paymenMethod}
                            usePartialPayment={usePartialPayment}
                            global={global}
                            setPaymenMethod={setPaymenMethod}
                            getPaymentMethod={getPaymentMethod}
                            setSelected={setSelected}
                            selected={selected}
                            handleSubmit={handleSubmit}
                            subscriptionStates={subscriptionStates}
                            offlinePaymentOptions={offlinePaymentOptions}
                            setIsCheckedOffline={setIsCheckedOffline}
                            isCheckedOffline={isCheckedOffline}
                            offLineWithPartial={offLineWithPartial}
                            paymentMethodDetails={paymentMethodDetails}
                        />
                    </CustomModal>
                )} */}
            </Grid>
        </CustomPaperBigCard>
    )
}

PaymentOptions.propTypes = {}

export default PaymentOptions
