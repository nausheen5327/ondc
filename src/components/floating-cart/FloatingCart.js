import React, { useEffect, useRef, useState } from 'react'
import {
  alpha,
  Box,
  Button,
  Grid,
  IconButton,
  Stack,
  styled,
  Typography,
} from '@mui/material'
import { EventSourcePolyfill } from 'event-source-polyfill';
import delivery from '../../../public/static/bannerslider/delivery.png'
import Drawer from '@mui/material/Drawer'
import { useRouter } from 'next/router'
import DeleteIcon from '@mui/icons-material/Delete'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from "js-cookie";
import {
  calculateItemBasePrice,
  cartItemsTotalAmount,
  cartTotalAmount,
  getAmount, getConvertDiscount,
  getSelectedAddOn,
  getVariation,
  handleBadge, handleIncrementedTotal, handleProductValueWithOutDiscount
} from "@/utils/customFunctions";
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import {
  decrementProductQty,
  incrementProductQty,
  removeProduct,
  setCartItemByDispatch,
  setClearCart,
  cart,
  setCartList,
  setCartContext
} from "@/redux/slices/cart"
import AuthModal from '../auth'
import { useQuery } from 'react-query'
import { RestaurantsApi } from "@/hooks/react-query/config/restaurantApi"
import {
  CustomColouredTypography,
  CustomTypographyBold,
} from "@/styled-components/CustomStyles.style"
import { useTranslation } from 'react-i18next'
import { ImageSource } from '../../utils/ImageSource'
import { setAuthModalOpen, setCouponInfo, setIsLoading } from "@/redux/slices/global"
import SimpleBar from 'simplebar-react'
import CustomModal from '../custom-modal/CustomModal'
import ProductUpdateModal from '../food-card/ProductUpdateModal'
import CustomImageContainer from '../CustomImageContainer'
import { useTheme } from '@mui/material/styles'
import { PrimaryButton } from '../products-page/FoodOrRestaurant'
import emptycart from '../../../public/static/emptycart.png'
import { RTL } from '../RTL/RTL'
import _ from 'lodash'
import VisibleVariations from './VisibleVariations'
import Cart from './Cart'
import { handleTotalAmountWithAddonsFF } from '../../utils/customFunctions'
import toast from 'react-hot-toast'
import { t } from 'i18next'
import GuestCheckoutModal from "./GuestCheckoutModal";
import { onErrorResponse } from "../ErrorResponse";
import { getGuestId } from "../checkout-page/functions/getGuestUserId";
import useDeleteAllCartItem from "../../hooks/react-query/add-cart/useDeleteAllCartItem";
import { getItemDataForAddToCart } from "./helperFunction";
import { getSelectedAddons, getSelectedVariations } from "../navbar/second-navbar/SecondNavbar";
import CircularLoader from "../loader/CircularLoader";
import CartContent from "./CartContent";
import useGetAllCartList from "@/hooks/react-query/add-cart/useGetAllCartList";
import { constructQouteObject } from '@/utils/constructQouteObject'
import { AddCookie, getValueFromCookie } from '@/utils/cookies'
import useCancellablePromise from '@/api/cancelRequest'
import { deleteCall, getCall, postCall, putCall } from '@/api/MainApi'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import CartActions from './cartAction';
import { useCheckoutFlow } from '../checkout-guard/checkoutFlow';

const FloatingCart = (props) => {
  const { handleCheckoutFlow } = useCheckoutFlow()
  const {sideDrawerOpen, setSideDrawerOpen } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const [openGuestModal, setOpenGuestModal] = useState(false);
  const router = useRouter()
  const dispatch = useDispatch()
  const [open, setDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(false);
  const { cartList } = useSelector((state) => state.cart)
  const cartItems = useSelector(state => state.cart.cartList)
  const [modalFor, setModalFor] = useState('sign-in')
  const [openModal, setOpenModal] = React.useState(false)
  const responseRef = useRef([]);
  // const [cartItems, setCartItems] = useState([]);
  const { cancellablePromise } = useCancellablePromise();
  const { global } = useSelector((state) => state.globalSettings)
  let token
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token')
  }

 
 
  const { isFilterDrawerOpen } = useSelector(
    (state) => state.searchFilterStore
  )
  const { mutate } = useDeleteAllCartItem();

  let languageDirection = 'ltr';
  const [authModalOpen, setOpen] = useState(false)
  const handleOpenAuthModal = () => setOpen(true)
  const handleCloseAuthModal = () => setOpen(false)
  const productBaseUrl = global?.base_urls?.product_image_url
  const location = useSelector(state => state.addressData.location)
  let currencySymbol = '₹';
  let currencySymbolDirection = 'left';
  let digitAfterDecimalPoint = 2

  const getCartItems = async () => {
    try {
      //   setLoading(true);
      dispatch(setIsLoading(true));
      // const user = JSON.parse(getValueFromCookie("user"));
      const user = JSON.parse(localStorage.getItem('userId'))
      const url = `/clientApis/v2/cart/${user}`;
      const res = await getCall(url);
      dispatch(setIsLoading(false));
      console.log("cart...", res);
      dispatch(setCartList(res));



      const matchingItems = res.filter(cartItem =>
        cartItem.item.id === product.id
      );

      if (matchingItems.length === 0) return 0;
      const totalQuantity = matchingItems.reduce((sum, item) => {
        return sum + (item.item.quantity?.count || 0);
      }, 0);

      setQuantity(totalQuantity)




    } catch (error) {
      console.log("Error fetching cart items:", error);
      dispatch(setIsLoading(false));
      //   setLoading(false);
    } finally {
      dispatch(setIsLoading(false));

      //   setLoading(false);
    }
  };



  const updateCartItem = async (itemId, increment, uniqueId) => {
    try {
      dispatch(setIsLoading(true));
      // const user = JSON.parse(getValueFromCookie("user"));
      const user = JSON.parse(localStorage.getItem('userId'))
      const url = `/clientApis/v2/cart/${user}/${uniqueId}`;

      // Find the item
      const itemIndex = cartItems.findIndex((item) => item._id === uniqueId);
      if (itemIndex === -1) return;

      // Create a deep copy of the cart item
      const updatedCartItem = JSON.parse(JSON.stringify(cartItems[itemIndex]));

      if (increment !== null) {
        if (increment) {
          const productMaxQuantity = updatedCartItem?.item?.product?.quantity?.maximum;

          if (productMaxQuantity) {
            if (updatedCartItem.item.quantity.count >= productMaxQuantity.count) {
              CustomToaster(
                'error',
                `Maximum allowed quantity is ${updatedCartItem.item.quantity.count}`
              );
              return;
            }
          }

          // Create new payload for increment
          const payload = {
            ...updatedCartItem.item,
            id: updatedCartItem.item.id,
            quantity: {
              ...updatedCartItem.item.quantity,
              count: updatedCartItem.item.quantity.count + 1
            }
          };

          // Handle customizations for increment
          if (payload.customisations) {
            payload.customisations = payload.customisations.map((c) => ({
              ...c,
              quantity: {
                ...c.quantity,
                count: (c.quantity?.count || 0) + 1
              }
            }));
          } else {
            payload.customisations = null;
          }

          try {
            dispatch(setIsLoading(true));
            await putCall(url, payload);
            // dispatch(setIsLoading(false));
            // setLoading(false);
            await getCartItems();
          } catch (error) {
            console.error("Error updating cart:", error);
            CustomToaster('error', 'Failed to update cart');
            setLoading(false);
            dispatch(setIsLoading(false));
          }

        } else {
          // Decrement case
          if (updatedCartItem.item.quantity.count <= 1) return;

          // Create new payload for decrement
          const payload = {
            ...updatedCartItem.item,
            id: updatedCartItem.item.id,
            quantity: {
              ...updatedCartItem.item.quantity,
              count: updatedCartItem.item.quantity.count - 1
            }
          };

          // Handle customizations for decrement
          if (payload.customisations) {
            payload.customisations = payload.customisations.map((c) => ({
              ...c,
              quantity: {
                ...c.quantity,
                count: Math.max((c.quantity?.count || 0) - 1, 0)
              }
            }));
          } else {
            payload.customisations = null;
          }

          try {
            dispatch(setIsLoading(true));
            await putCall(url, payload);
            dispatch(setIsLoading(false));
            setLoading(false);
            await getCartItems();
          } catch (error) {
            console.error("Error updating cart:", error);
            CustomToaster('error', 'Failed to update cart');
            setLoading(false);
            dispatch(setIsLoading(false));
          }
        }
      }
    } catch (error) {
      console.error("Error in updateCartItem:", error);
      CustomToaster('error', 'Failed to update cart');
      setLoading(false);
      dispatch(setIsLoading(false));
    }
  };

  const deleteCartItem = async (itemId) => {
    dispatch(setIsLoading(true));
    // const user = JSON.parse(getValueFromCookie("user"));
    const user = JSON.parse(localStorage.getItem('userId'))
    const url = `/clientApis/v2/cart/${user}/${itemId}`;
    const res = await deleteCall(url);
    dispatch(setIsLoading(false));
    getCartItems();
  };

  const DrawerHeader = styled('div')(({ theme }) => ({
    marginTop: '60px',
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    [theme.breakpoints.down('md')]: {
      marginTop: '10px',
    },
  }))

  const getProviderIds = (request_object) => {
    let providers = [];
    request_object.map((cartItem) => {
      providers.push(cartItem.provider.local_id);
    });
    const ids = [...new Set(providers)];
    AddCookie("providerIds", ids);
    return ids;
  };

  const offerInSelectFormat = (id) => {
    return {
      id: id,
      tags: [
        {
          code: "selection",
          list: [
            {
              code: "apply",
              value: "yes",
            },
          ],
        },
      ],
    };
  };
  const [selectedNonAdditiveOffer, setSelectedNonAdditiveOffer] = useState("");
  const [selectedAdditiveOffers, setSelectedAdditiveOffers] = useState([]);
  const [toggleInit, setToggleInit] = useState(false);
  const [eventData, setEventData] = useState([]);
  const updatedCartItems = useRef([]);


  const offersForSelect = () => {
    if (selectedNonAdditiveOffer) {
      console.log("selectedNonAdditiveOffer", selectedNonAdditiveOffer);
      return [offerInSelectFormat(selectedNonAdditiveOffer)];
    } else {
      return selectedAdditiveOffers.length > 0
        ? selectedAdditiveOffers.map((id) => offerInSelectFormat(id))
        : [];
    }
  };

  const getQuote = async (items, searchContextData = null) => {
    const ttansactionId = localStorage.getItem("transaction_id");
    responseRef.current = [];
    if (location) {
      try {
        // setCheckoutLoading(true);
        let domain = "";
        let contextCity = "";
        const updatedItems = items.map((item) => {
          const newItem = Object.assign({}, item);
          domain = newItem.domain;
          contextCity = newItem.contextCity;
          delete newItem.context;
          delete newItem.contextCity;
          return newItem;
        });
        let selectPayload = {
          context: {
            transaction_id: ttansactionId,
            domain: domain,
            city: contextCity || location.address.city,
            pincode: location.address.areaCode,
            state: location.address.state,
          },
          message: {
            cart: {
              items: updatedItems,
            },
            offers: offersForSelect(),
            fulfillments: [
              {
                end: {
                  location: {
                    gps: `${location?.address?.lat},${location?.address?.lng}`,
                    address: {
                      area_code: `${location?.address?.areaCode}`,
                    },
                  },
                },
              },
            ],
          },
        };
        console.log("select payload", selectPayload);
        dispatch(setIsLoading(true));
        const data = await cancellablePromise(
          postCall("/clientApis/v2/select", [selectPayload])
        );
        dispatch(setIsLoading(false));
        console.log("select payload data", data);
        //Error handling workflow eg, NACK
        const isNACK = data.find(
          (item) => item?.error && item?.message?.ack?.status === "NACK"
        );
        console.log("message id IsNack", isNACK);
        if (isNACK) {
          //   setCheckoutLoading(false);
          CustomToaster('error', `${isNACK.error.message} nack`)
          //   setGetQuoteLoading(false);
        } else {
          // fetch through events
          console.log("select payload inside else", selectPayload);
          dispatch(setIsLoading(true));

          onFetchQuote(
            data?.map((txn) => {
              const { context } = txn;
              return context?.message_id;
            })
          );
          dispatch(setIsLoading(false));
        }
      } catch (err) {
        // dispatch({
        //   type: toast_actions.ADD_TOAST,
        //   payload: {
        //     id: Math.floor(Math.random() * 100),
        //     type: toast_types.error,
        //     message: err?.response?.data?.error?.message,
        //   },
        // });
        CustomToaster('error', err?.response?.data?.error?.message);
        // setGetQuoteLoading(false);
        router.replace('/');
        // setCheckoutLoading(false);
      }
    } else {
      CustomToaster('error', 'Please Select Address');
      //   setCheckoutLoading(false);
    }

    // eslint-disable-next-line
  };
  const eventTimeOutRef = useRef([]);

  function onFetchQuote(message_id) {
    dispatch(setIsLoading(true));
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
      let es = new EventSourcePolyfill(
        `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events/v2?messageId=${id}`,
        header
      );
      console.log("message id", es);
      es.addEventListener("on_select", (e) => {
        const { messageId } = JSON.parse(e.data);

        onGetQuote(messageId);
      });
      const timer = setTimeout(() => {
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          eventSource.close();
          clearTimeout(timer);
        });
        if (responseRef.current.length <= 0) {
          //   setGetQuoteLoading(false);
          //   setCheckoutLoading(false);
          dispatch(setIsLoading(false));
          CustomToaster('error', 'Cannot fetch details for this product')
          router.replace("/");
          return;
        } else {
        }
        let c = cartItems.map((item) => {
          return item.item;
        });
        const request_object = constructQouteObject(c);
        if (responseRef.current.length !== request_object.length) {
          CustomToaster('error', "Cannot fetch details for some product those products will be ignored!")
          // setErrorMessageTimeOut("Cannot fetch details for this product");
        }
        setToggleInit(true);
      }, 20000);
      dispatch(setIsLoading(false));
      eventTimeOutRef.current = [
        ...eventTimeOutRef.current,
        {
          eventSource: es,
          timer,
        },
      ];

      // console.log("message id",new EventSourcePolyfill());
      // history.push(`/application/checkout`);
    });
  }
  const onGetQuote = async (message_id) => {
    try {
      //   setCheckoutLoading(true);
      dispatch(setIsLoading(true));
      const data = await cancellablePromise(
        getCall(`/clientApis/v2/on_select?messageIds=${message_id}`)
      );
      responseRef.current = [...responseRef.current, data[0]];

      setEventData((eventData) => [...eventData, data[0]]);
      dispatch(setCartContext(data[0]))

      // onUpdateProduct(data[0].message.quote.items, data[0].message.quote.fulfillments);
      data[0].message.quote.items.forEach((item) => {
        const findItemIndexFromCart = updatedCartItems.current.findIndex(
          (prod) => prod.item.product.id === item.id
        );
        if (findItemIndexFromCart > -1) {
          updatedCartItems.current[
            findItemIndexFromCart
          ].item.product.fulfillment_id = item.fulfillment_id;
          updatedCartItems.current[
            findItemIndexFromCart
          ].item.product.fulfillments = data[0].message.quote.fulfillments;
        }
      });

      localStorage.setItem(
        "cartItems",
        JSON.stringify(updatedCartItems.current)
      );
      localStorage.setItem(
        "updatedCartItems",
        JSON.stringify(responseRef.current)
      );
      localStorage.setItem(
        "offers",
        JSON.stringify({
          additive_offers: selectedAdditiveOffers,
          non_additive_offer: selectedNonAdditiveOffer,
        })
      );
      dispatch(setIsLoading(false));

      router.push(`/checkout`);
    } catch (err) {
      //   setCheckoutLoading(false);
      CustomToaster('error', err.message);
      dispatch(setIsLoading(false));

      //   setGetQuoteLoading(false);
    }
    // eslint-disable-next-line
  };

  const handleCheckout = () => {
    handleCheckoutFlow(cartItems, location)
    setSideDrawerOpen(false)
  };

  // const variationPrice = cartList.map((item) => {
  //     if (item.variation && item.variation?.length > 0) {
  //         return item.variation.map((varItem) => varItem.price)
  //     } else return cartList.price
  // })
  const handleClearAll = () => {
    mutate(getGuestId(), {
      //onSuccess: handleSuccess,
      onError: onErrorResponse,
    });
    dispatch(setClearCart())
    dispatch(setCouponInfo(null))
    setOpenModal(false)
  }
  // cart update modal

  const handleProductUpdateModal = (item) => {
    dispatch(setCartItemByDispatch(item))
    setOpenModal(true)
    setSideDrawerOpen(false)
  }
  const cartListSuccessHandler = (res) => {
    if (res) {
      const setItemIntoCart = () => {
        return res?.map((item) => ({
          ...item?.item,
          cartItemId: item?.id,
          totalPrice:
            getConvertDiscount(
              item?.item?.discount,
              item?.item?.discount_type,
              handleProductValueWithOutDiscount(item?.item),
              item?.item?.restaurant_discount
            )
            *
            item?.quantity
          ,
          selectedAddons: getSelectedAddons(item?.item?.addons),
          quantity: item?.quantity,
          variations: item?.item?.variations,
          itemBasePrice: getConvertDiscount(
            item?.item?.discount,
            item?.item?.discount_type,
            calculateItemBasePrice(item?.item, item?.item?.variations),
            item?.item?.restaurant_discount
          ),
          selectedOptions: getSelectedVariations(item?.item?.variations)
        }));
      };
      dispatch(cart(setItemIntoCart()));
    }
  }


  return (
    <>
      {authModalOpen && (
        <AuthModal
          open={authModalOpen}
          handleClose={handleCloseAuthModal}
          modalFor={modalFor}
          setModalFor={setModalFor}
        />
      )}

      {/* <RTL direction={languageDirection}> */}
        <Drawer
          anchor="right"
          open={sideDrawerOpen}
          onClose={() => setSideDrawerOpen(false)}
          variant="temporary"
          sx={{
            zIndex: '1400',
            '& .MuiDrawer-paper': {
              width: {
                xs: "90%",
                sm: "50%",
                md: "390px"

              }
            },
          }}
        >
          {cartList?.length === 0 ? (
            <Stack
              sx={{
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20px',
              }}
              container
            >
              <CustomImageContainer
                src={emptycart.src}
                height="250px"
              />
              <CustomTypographyBold align="center">
                {t('Cart is Empty')}
              </CustomTypographyBold>
            </Stack>
          ) : (
            <>
              <Stack
                height="100%"
                p="1rem"
                justifyContent="start"
                gap="2%"
                marginTop={{
                  xs: '20px',
                  sm: '25px',
                  md: '60px',
                }}
              >
                <Stack gap="1rem">
                  <Stack>
                    <Typography
                      sx={{
                        textAlign: 'center',
                        fontSize: '18px',
                      }}
                    >
                      <Typography
                        component="span"
                        sx={{
                          color: (theme) =>
                            theme.palette.primary.main,
                          fontWeight: 'bold',
                        }}
                      >
                        {cartList?.length} {t('Items')}
                      </Typography>{' '}
                      {t('in your cart')}
                    </Typography>
                    {/* {restaurantData?.data?.delivery_time && (
                                            <Typography
                                                sx={{
                                                    textAlign: 'center',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                <img
                                                    style={{ marginBottom: '4px' }}
                                                    src={delivery.src}
                                                    loading="lazy"
                                                />
                                                <Typography
                                                    component="span"
                                                    sx={{
                                                        color: (theme) =>
                                                            theme.palette
                                                                .neutral[400],
                                                        marginLeft: '10px',
                                                        fontWeight: 600,
                                                        textAlign: 'center',
                                                    }}
                                                >
                                                    {
                                                        restaurantData?.data
                                                            ?.delivery_time
                                                    }
                                                </Typography>
                                            </Typography>
                                        )} */}
                  </Stack>
                  <SimpleBar
                    style={{

                      width: '100%',
                    }}
                  >
                    <Grid container spacing={{ xs: 1 }}>
                      {cartList?.map((eachItem) => {
                        return (
                          <React.Fragment key={eachItem.item.itemId}>
                            <CartContent item={eachItem} handleProductUpdateModal={handleProductUpdateModal}
                              productBaseUrl={eachItem?.item?.product?.descriptor?.images[0]}
                              t={t}
                              handleIncrement={() => updateCartItem(eachItem.item.id, true, eachItem._id)}
                              handleDecrement={() => updateCartItem(eachItem.item.id, false, eachItem._id)}
                              handleRemove={() => deleteCartItem(eachItem._id)}
                            />
                          </React.Fragment>
                        )
                      })}
                    </Grid>
                  </SimpleBar>
                </Stack>
                <Stack alignItems="center" spacing={2} position="sticky" marginTop="auto">
                  {cartList?.length > 0 && (
                    <CartActions
                      cartList={cartList}
                      t={t}
                      handleCheckout={handleCheckout}
                      currencySymbol={currencySymbol}
                      currencySymbolDirection={currencySymbolDirection}
                      digitAfterDecimalPoint={digitAfterDecimalPoint}
                    />
                  )}
                  <Stack
                    direction="row"
                    width="100%"
                    spacing={1}
                  >
                    {/* <PrimaryButton
                                            backgroundColor={
                                                theme.palette.neutral[200]
                                            }
                                            onClick={handleClearAll}
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            borderRadius="7px"
                                            sx={{
                                                color: (theme) =>
                                                    theme.palette.neutral[1000],
                                                fontWeight: 400,
                                            }}
                                        >
                                            {t('Clear All')}
                                        </PrimaryButton> */}
                    {/* <PrimaryButton
                      onClick={handleCheckout}
                      variant="contained"
                      size="large"
                      fullWidth
                      borderRadius="7px"
                    >
                      {t('Proceed To Checkout')}
                    </PrimaryButton> */}
                  </Stack>
                </Stack>
              </Stack>
            </>
          )}
        </Drawer>
      {/* </RTL> */}
    </>
  )
  //}
}

export default FloatingCart