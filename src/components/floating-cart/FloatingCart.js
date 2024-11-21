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
import  {
    decrementProductQty,
    incrementProductQty,
    removeProduct,
    setCartItemByDispatch,
    setClearCart,
    cart,
    setCartList
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
import { setCouponInfo } from "@/redux/slices/global"
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
import { getCall, postCall } from '@/api/MainApi'
import { CustomToaster } from '../custom-toaster/CustomToaster'

const FloatingCart = (props) => {
    const { sideDrawerOpen, setSideDrawerOpen } = props
    const theme = useTheme()
    const { t } = useTranslation()
    const [openGuestModal, setOpenGuestModal] = useState(false);
    const router = useRouter()
    const dispatch = useDispatch()
    const [open, setDrawerOpen] = useState(false)
    const { cartList } = useSelector((state) => state.cart)
    const cartItems = useSelector(state=>state.cart.cartList)
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
    const location = useSelector(state=>state.addressData.location)
    let currencySymbol = '₹';
    let currencySymbolDirection = 'left';
    let digitAfterDecimalPoint = 2
    

    // useEffect(() => {
    //     getCartItems();
    //   }, [sideDrawerOpen]);

    // const getCartItems = async () => {
    //     try {
    //     //   setLoading(true);
    //       const url = `/clientApis/v2/cart/${user.id}`;
    //       const res = await getCall(url);
    //       setCartItems(res);
    //       dispatch(setCartList(res));
    //       //dispatch set cart items
    //       updatedCartItems.current = res;
    //     } catch (error) {
    //         console.log("Error fetching cart items:", error);
            
    //       setCartItems(res);
    //       updatedCartItems.current = res;
    //         dispatch(setCartList(res));
    //     //   setLoading(false);
    //     } finally {
    //     //   setLoading(false);
    //     }
    //   };

    // const handleBadge = () => {}
    
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
                pincode:location.address.areaCode,
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
            console.log("select payload",selectPayload);
            const data = await cancellablePromise(
              postCall("/clientApis/v2/select", [selectPayload])
            );
            console.log("select payload data",data);
            //Error handling workflow eg, NACK
            const isNACK = data.find(
              (item) => item?.error && item?.message?.ack?.status === "NACK"
            );
            console.log("message id IsNack",isNACK);
            if (isNACK) {
            //   setCheckoutLoading(false);
            CustomToaster('error',`${isNACK.error.message} nack`)
            //   setGetQuoteLoading(false);
            } else {
              // fetch through events
              console.log("select payload inside else",selectPayload);
              onFetchQuote(
                data?.map((txn) => {
                  const { context } = txn;
                  return context?.message_id;
                })
              );
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
            CustomToaster('error',err?.response?.data?.error?.message);
            // setGetQuoteLoading(false);
            router.replace('/');
            // setCheckoutLoading(false);
          }
        } else {
            CustomToaster('error','Please Select Address');
        //   setCheckoutLoading(false);
        }
    
        // eslint-disable-next-line
      };
      const eventTimeOutRef = useRef([]);

      function onFetchQuote(message_id) {
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
          console.log("message id",es);
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
              CustomToaster('error','Cannot fetch details for this product')
              router.replace("/");
              return;
            } else {
            }
            let c = cartItems.map((item) => {
              return item.item;
            });
            const request_object = constructQouteObject(c);
            if (responseRef.current.length !== request_object.length) {
                CustomToaster('error',"Cannot fetch details for some product those products will be ignored!")
              setErrorMessageTimeOut("Cannot fetch details for this product");
            }
            setToggleInit(true);
          }, 20000);
    
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
          const data = await cancellablePromise(
            getCall(`/clientApis/v2/on_select?messageIds=${message_id}`)
          );
          responseRef.current = [...responseRef.current, data[0]];
    
          setEventData((eventData) => [...eventData, data[0]]);
    
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
          router.push(`/checkout`);
        } catch (err) {
        //   setCheckoutLoading(false);
        CustomToaster('error',err.message);
        //   setGetQuoteLoading(false);
        }
        // eslint-disable-next-line
      };

    const handleCheckout = () => {
        const closeDrawers = () => {
            setDrawerOpen(false);
            setSideDrawerOpen(false);
        };
        //call APIs 
        
            if (cartItems.length > 0) {
              let c = cartItems.map((item) => {
                return item.item;
              });

              const request_object = constructQouteObject(c);
              console.log("request_object", request_object);
              getQuote(request_object[0]);
              getProviderIds(request_object[0]);
            }
        // if (token) {
        //     router.push('/checkout?page=cart');
        //     closeDrawers();
        // } else {
        //     const shouldOpenGuestModal = global?.guest_checkout_status === 1;
        //     if (shouldOpenGuestModal) {
        //         setOpenGuestModal(true);
        //     } else {
        //         handleOpenAuthModal();
        //     }

        //     closeDrawers();
        // }
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
    const cartListSuccessHandler=(res)=>{
        if(res){
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
                    selectedAddons:getSelectedAddons(item?.item?.addons) ,
                    quantity: item?.quantity,
                    variations: item?.item?.variations,
                    itemBasePrice: getConvertDiscount(
                        item?.item?.discount,
                        item?.item?.discount_type,
                        calculateItemBasePrice(item?.item, item?.item?.variations),
                        item?.item?.restaurant_discount
                    ),
                    selectedOptions:getSelectedVariations(item?.item?.variations)
                }));
            };
            dispatch(cart(setItemIntoCart()));
        }
    }

    const {
        data:cartData,
        refetch: cartListRefetch,
    } = useGetAllCartList(getGuestId(),cartListSuccessHandler);
    return (
        <>
            {authModalOpen && (
                <AuthModal
                    open={authModalOpen}
                    handleClose={handleCloseAuthModal}
                    modalFor={modalFor}
                    setModalFor={setModalFor}
                    cartListRefetch={cartListRefetch}
                />
            )}
            {/* {!sideDrawerOpen && (
                <Box
                    className="cart__burger"
                    sx={{
                        position: 'fixed',
                        width: '85px',
                        height: '90px',
                        left: languageDirection === 'rtl' ? 10 : 'auto',
                        right: languageDirection === 'rtl' ? 'auto' : 10,
                        top: '38%',
                        zIndex: 1000000,
                        flexGrow: 1,
                        cursor: 'pointer',
                        display: {
                            xs: 'none',
                            sm: 'none',
                            md: isFilterDrawerOpen
                                ? 'none'
                                : cartList?.length === 0
                                    ? 'none'
                                    : 'inherit',
                        },
                    }}
                    onClick={() => setSideDrawerOpen(true)}
                >
                    <div>
                        <Cart />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '35%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                textAlign: 'center',
                                fontWeight: 'bold',
                            }}
                        >
                            {cartList?.length}
                            <Typography
                                sx={{
                                    lineHeight: 0.5,
                                    fontWeight: 'bold',
                                    fontSize: '12px',
                                }}
                            >
                                {t('Items')}
                            </Typography>
                        </Box>
                    </div>
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '75px',
                            bottom: '6px',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            color: (theme) => theme.palette.neutral[100],
                            width: '100px',
                        }}
                    >
                        <Stack flexWrap="wrap">
                            <Typography
                                sx={{
                                    lineHeight: 0.5,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    fontSize: '13px',
                                }}
                                color={theme.palette.whiteContainer.main}
                            >
                                {getAmount(
                                    cartItemsTotalAmount(cartList),
                                    currencySymbolDirection,
                                    currencySymbol,
                                    digitAfterDecimalPoint
                                )}
                            </Typography>
                        </Stack>
                    </Box>
                </Box>
            )} */}
            <RTL direction={languageDirection}>
                <Drawer
                    anchor="right"
                    open={sideDrawerOpen}
                    onClose={() => setSideDrawerOpen(false)}
                    variant="temporary"
                    sx={{ zIndex: '1400' ,
                        '& .MuiDrawer-paper': {
                            width:{
                                xs:"90%",
                                sm:"50%",
                                md:"390px"

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
                                            height: '55vh',
                                            width: '100%',
                                        }}
                                    >
                                        <Grid container spacing={{ xs: 1 }}>
                                            {console.log('cartList inside cart', cartList)}
                                            {cartList?.map((eachItem) => {
                                                console.log("cartList item eachObject",eachItem.item.itemId)
                                                return(
                                                <React.Fragment key={eachItem.item.itemId}>
                                                    <CartContent item={eachItem} handleProductUpdateModal={handleProductUpdateModal}
                                                                 productBaseUrl={eachItem?.item?.product?.descriptor?.images[0]}
                                                                 t={t}

                                                    />
                                                </React.Fragment>
                                            )
                                            })}
                                        </Grid>
                                    </SimpleBar>
                                </Stack>
                                <Stack alignItems="center" spacing={2} position="sticky" marginTop="auto">
                                    <Stack
                                        borderRadius="5px"
                                        flexDirection="row"
                                        sx={{

                                            width: '100%',
                                            paddingTop: '10px',
                                            paddingBottom: '10px',
                                        }}
                                        // backgroundColor={alpha(
                                        //     theme.palette.primary.main,
                                        //     0.3
                                        // )}
                                        justifyContent="space-between"
                                        alignItems="center"

                                    >
                                        {/* <CustomColouredTypography
                                            sx={{
                                                color: (theme) =>
                                                    theme.palette.neutral[1000],
                                            }}
                                        >
                                            {t('Total Price')}{' '}
                                            {getAmount(
                                                cartItemsTotalAmount(cartList),
                                                currencySymbolDirection,
                                                currencySymbol,
                                                digitAfterDecimalPoint
                                            )}
                                        </CustomColouredTypography> */}
                                        <Typography fontSize="14px" fontWeight={500}>{t('Total Price')}</Typography>
                                        <Typography fontSize="15px" fontWeight={700}>{
                                            getAmount(
                                                cartItemsTotalAmount(cartList),
                                                currencySymbolDirection,
                                                currencySymbol,
                                                digitAfterDecimalPoint
                                            )}
                                        </Typography>
                                    </Stack>
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
                                        <PrimaryButton
                                            onClick={handleCheckout}
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            borderRadius="7px"
                                        >
                                            {t('Proceed To Checkout')}
                                        </PrimaryButton>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </>
                    )}
                </Drawer>
            </RTL>
        </>
    )
    //}
}

export default FloatingCart