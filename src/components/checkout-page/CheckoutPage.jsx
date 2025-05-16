import { baseUrl, deleteCall, getCall, postCall } from '@/api/MainApi'
import { EventSourcePolyfill } from 'event-source-polyfill';
import { v4 as uuidv4 } from "uuid";
import { setPayment_Response,setPayment_Status } from '@/redux/slices/payment'
import moment from 'moment'
import Router, { useRouter } from 'next/router'
import { useEffect, useReducer, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { OrderSummary } from './CheckOut.style'
import DeliveryDetails from './DeliveryDetails'
import { getDayNumber } from './const'
import OrderCalculation from './order-summary/OrderCalculation'
import OrderSummaryDetails from './order-summary/OrderSummaryDetails'
import PaymentOptions from './order-summary/PaymentOptions'
import {
    setOfflineInfoStep,
    setOrderDetailsModal,
} from '@/redux/slices/OfflinePayment'
import { setCartList, setWalletAmount } from '@/redux/slices/cart'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
} from '@/styled-components/CustomStyles.style'
import { useTheme } from '@emotion/react'
import Skeleton from '@mui/material/Skeleton'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import useGetVehicleCharge from '../../hooks/react-query/config/useGetVehicleCharge'
import useGetOfflinePaymentOptions from '../../hooks/react-query/offline-payment/useGetOfflinePaymentOptions'
import CustomImageContainer from '../CustomImageContainer'
import CustomModal from '../custom-modal/CustomModal'
import Cutlery from './Cutlery'
import DeliveryManTips from './DeliveryManTips'
import OfflinePaymentForm from './OfflinePaymentForm'
import PartialPayment from './PartialPayment'
import PartialPaymentModal from './PartialPaymentModal'
import thunderstorm from './assets/thunderstorm.svg'
import wallet from './assets/walletpayment.png'
import { deliveryInstructions, productUnavailableData } from './demo'
import { getGuestId, getToken } from './functions/getGuestUserId'
import { getSubscriptionOrderCount } from './functions/getSubscriptionOrderCount'
import { subscriptionReducer, subscriptionsInitialState } from './states'
import {
    additionalInformationInitialState,
    additionalInformationReducer,
} from './states/additionalInformationStates'
import useGetMostTrips from '@/hooks/react-query/useGetMostTrips'
import { setIsNeedLoad } from '@/redux/slices/utils'
import CustomerInfoPage from './CustomerInfoPage'
import useCancellablePromise from '@/api/cancelRequest'
import { getSelectedOffers } from '@/utils/checkout'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import { AddCookie, getValueFromCookie, removeCookie } from '@/utils/cookies'
import Razorpay from './razorpay'
import AddressList from '../address/addressList'
import { paymentSlice } from '@/redux/slices/payment'
import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import LoadingScreen from '../CheckoutLoader';
import { trackPaymentGatewayOpen, trackPlaceOrderClicked, trackPurchase } from '@/utils/analytics';

let currentDate = moment().format('YYYY/MM/DD HH:mm')
let nextday = moment(currentDate).add(1, 'days').format('YYYY/MM/DD')

let today = moment(currentDate).format('dddd')
let tomorrow = moment(nextday).format('dddd')

var CurrentDatee = moment().format()

let todayTime = moment(CurrentDatee).format('HH:mm')


export const handleValuesFromCartItems = (variationValues) => {
    let value = []
    if (variationValues?.length > 0) {
        variationValues?.forEach((item) => {
            if (item?.isSelected) {
                value.push(item?.label)
            }
        })
    } else {
        variationValues && value.push(variationValues[0]?.label)
    }
    return value
}
export const handleIdsFromCartItems = (variationValues) => {
    let value = []
    if (variationValues?.length > 0) {
        variationValues?.forEach((item) => {
            if (item?.isSelected) {
                value.push(item?.option_id)
            }
        })
    } else {
        variationValues && value.push(variationValues[0]?.option_id)
    }
    return value
}
const CheckoutPage = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const theme = useTheme()
    const offlineFormRef = useRef()
    const { t } = useTranslation()
    const { global, couponInfo } = useSelector((state) => state.globalSettings)

    const {
        cartList,
        campFoodList,
        type,
        totalAmount,
        walletAmount,
        subscriptionSubTotal,
    } = useSelector((state) => state.cart)
    const cartContext = useSelector(state=>state.cart.cartContext)
    console.log("cartContext", cartContext);
    let currentLatLng = undefined
    const [initializeOrderLoading, setInitializeOrderLoading] = useState(false);
    const [address, setAddress] = useState(undefined)
    const [paymenMethod, setPaymenMethod] = useState('prepaid')
    const [numberOfDay, setDayNumber] = useState(getDayNumber(today))
    const [orderType, setOrderType] = useState('')
    const [couponDiscount, setCouponDiscount] = useState(null)
    const [scheduleAt, setScheduleAt] = useState('now')
    const [orderSuccess, setOrderSuccess] = useState(false)
    const [taxAmount, setTaxAmount] = useState(0)
    const [cutlery, setCutlery] = useState(0)
    const [unavailable_item_note, setUnavailable_item_note] = useState(null)
    const [delivery_instruction, setDelivery_instruction] = useState(null)
    const [total_order_amount, setTotalOrderAmount] = useState(0)
    const [orderId, setOrderId] = useState(null)
    const [usePartialPayment, setUsePartialPayment] = useState(false)
    const [switchToWallet, setSwitchToWallet] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const [openPartialModel, setOpenPartialModel] = useState(false)
    const [deliveryTip, setDeliveryTip] = useState(0)
    const [selected, setSelected] = useState({
      name: 'prepaid',
      image: wallet,
  })
    const [paymentMethodDetails, setPaymentMethodDetails] = useState({
      name: 'prepaid',
      image: wallet,
  })
    const [cashbackAmount, setCashbackAmount] = useState(null)
    const [isExtraPackaging, setIsExtraPackaging] = useState(false)
    const [extraPackagingCharge, setExtraPackagingCharge] = useState(0)
    const { method } = router.query
    const [offlineCheck, setOfflineCheck] = useState(false)
    const [openAddressModal, setOpenAddressModal] = useState(false);


    const handleSelectAddress = () => {
      setOpenAddressModal(true);
  };
  const handleCloseAddress = () => {
      setOpenAddressModal(false);
  };    
    // const onSuccessHandler = (res) => {
    //     console.log({ res })
    //     if (res) {
    //         dispatch(setIsNeedLoad(res?.reload_home))
    //     }
    // }

   
    const [enabled, setEnabled] = useState(cartList?.length ? true : false)
    const [eventData, setEventData] = useState([]);
    const [paymentEventData, setPaymentEventData] = useState([]);


   
    const { token } = useSelector((state) => state.userToken)
    const { guestUserInfo } = useSelector((state) => state.guestUserInfo)
    const [subscriptionStates, subscriptionDispatch] = useReducer(
        subscriptionReducer,
        subscriptionsInitialState
    )

    //additional information
    const [additionalInformationStates, additionalInformationDispatch] =
        useReducer(
            additionalInformationReducer,
            additionalInformationInitialState
        )

    const text1 = t('You can not Order more then')
    const text2 = t('on COD order')
    const { page } = router.query
    const notify = (i) => toast(i)

    let currencySymbol = '₹'
    let currencySymbolDirection = 'left'
    let digitAfterDecimalPoint = 2
    // const [location, setLocation] = useState({});
    const location = useSelector((state)=>state.addressData.locationDetailed)
    const billingAddress = useSelector((state)=>state.addressData.locationDetailed)
    const deliveryAddress = useSelector((state)=>state.addressData.locationDetailed)
    const customerInfo = useSelector((state)=>state.addressData.customerInfo)
   
    

    
    
    
    
    
   

    useEffect( () => {
        // let location = localStorage.getItem('location')
        // setLocation(location);
        // setBillingAddress(location)
        // setDeliveryAddress(location)
        setAddress({
            latitude: location?.address?.lat,
            longitude: location?.address?.lng,
            address: location,
            address_type: 'Selected Address',
        })
    }, [location])

  
    useEffect(() => {
      setOrderType('delivery')
       
    }, [])
    useEffect(() => {
        let taxAmount = 50
        setTaxAmount(taxAmount)
    }, [cartList, couponDiscount])
    useEffect(() => {
        const total_order_amount = 400
        setTotalOrderAmount(total_order_amount)
    }, [cartList, couponDiscount, taxAmount])

    const handleOfflineOrder = () => {
        const offlinePaymentData = {
            ...offlinePaymentInfo,
            order_id: orderId,
        }
        dispatch(setOfflineInfoStep(3))
        dispatch(setOrderDetailsModal(true))
        offlineMutate(offlinePaymentData)
        // setOrderId(orderId)
    }

    //orderId
    //offlinePaymentInfo
    useEffect(() => {
        if (offlineCheck) {
            handleOfflineOrder()
        }
    }, [orderId])

  

    

  

   
    // const placeOrder = () => {
    //     let c = cartItems.map((item) => {
    //         return item.item;
    //       });

    //       const request_object = constructQouteObject(
    //         c.filter(({ provider }) => responseReceivedIds.includes(provider.local_id.toString()))
    //       );
    //       initializeOrder(request_object);
    // }
  

 

   
   

    






    // Add this near the top of your component
const isUnmounted = useRef(false);

useEffect(() => {
  return () => {
    isUnmounted.current = true
    // Cleanup on unmount
    eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
      if (eventSource) {
        eventSource.close()
      }
      if (timer) {
        clearTimeout(timer)
      }
    })
  }
}, [])


const handleOrderSuccess = () => {
  if (!isUnmounted.current) {
    // Clean up event listeners and refs first
    eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
      if (eventSource) {
        eventSource.close()
      }
      if (timer) {
        clearTimeout(timer)
      }
    })
    
    // Clear cart and navigate
    dispatch(setCartList([]))
    trackPurchase(paymentEventData);
    router.push(`/info?page=order&orderId=${paymentEventData[0]?.message?.order?.id}`)
  }
};

    //Payment integration logic

    const cartItems = useSelector(state=>state.cart.cartList)
    // const updatedCartItems = useRef([]);
    // const [cartItems,setCartItems] = useState([]);
    const [selectedFulfillments, setSelectedFulfillments] = useState()
    const [updatedCartItems, setUpdatedCartItems] = useState([]);
    const responseRef = useRef([]);
    const eventTimeOutRef = useRef([]);
    // const [billingAddress, setBillingAddress] = useState();
    // const [deliveryAddress, setDeliveryAddress] = useState();
    const [quoteItemInProcessing, setQuoteItemInProcessing] = useState(null);
    const [productsQuote, setProductsQuote] = useState({
        providers: [],
        isError: false,
        total_payable: 0,
      });
    const resetCartItems = () => {
        const cartItemsData = JSON.parse(localStorage.getItem("cartItems"));
        const updatedCartItemsData = JSON.parse(
          localStorage.getItem("updatedCartItems")
        );
        // dispatch(setCartList(cartItemsData));
        setSelectedFulfillments({});
        // setCartItems(cartItemsData);
        setUpdatedCartItems(updatedCartItemsData);
      };

      // useEffect(() => {
      //   try {
      //     if (updatedCartItems?.length > 0) {
      //       // fetch request object length and compare it with the response length
      //       let c = cartItems.map((item) => {
      //         return item.item;
      //       });
      //       const requestObject = constructQouteObject(c);
      //       if (requestObject.length === updatedCartItems.length) {
      //         // setToggleInit(true);
      //       }
    
      //       const cartList = JSON.parse(JSON.stringify(updatedCartItems));
      //       // check if any one order contains error
      //       let total_payable = 0;
      //       let isAnyError = false;
      //       let quotes = updatedCartItems?.map((item, index) => {
      //         let { message, error } = item;
      //         let provider_payable = 0;
      //         const provider = {
      //           products: [],
      //           total_payable: 0,
      //           name: "",
      //           error: null,
      //         };
      //         // else generate quote of it
      //         if (message) {
      //           //          message = m2;
    
      //           if (message?.quote?.quote?.price?.value) {
      //             provider_payable += Number(message?.quote?.quote?.price?.value);
      //           }
      //           const breakup = message?.quote?.quote?.breakup;
      //           const provided_by = message?.quote?.provider?.descriptor?.name;
      //           provider.name = provided_by;
      //           let uuid = 0;
      //           const all_items = breakup?.map((break_up_item) => {
      //             const cartIndex = cartList?.findIndex(
      //               (one) => one.id === break_up_item["@ondc/org/item_id"]
      //             );
      //             const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
      //             let findItemFromCartItems = null;
      //             let isCustimization = false;
      //             if (break_up_item?.item?.tags) {
      //               const findTag = break_up_item?.item?.tags.find(
      //                 (tag) => tag.code === "type"
      //               );
      //               if (findTag) {
      //                 const findCust = findTag.list.find(
      //                   (listItem) => listItem.value === "customization"
      //                 );
      //                 if (findCust) {
      //                   isCustimization = true;
      //                 } else {
      //                 }
      //               }
      //             } else {
      //             }
      //             cartItems.forEach((ci) => {
      //               if (isCustimization) {
      //                 const cc = ci?.item?.customisations || [];
      //                 cc.forEach((i) => {
      //                   if (i.local_id === break_up_item["@ondc/org/item_id"]) {
      //                     findItemFromCartItems = i;
      //                   }
      //                 });
      //               } else {
      //                 if (
      //                   ci?.item?.local_id === break_up_item["@ondc/org/item_id"]
      //                 ) {
      //                   findItemFromCartItems = ci?.item;
      //                 }
      //               }
      //             });
      //             let cartQuantity = findItemFromCartItems
      //               ? findItemFromCartItems?.quantity?.count
      //               : cartItem
      //               ? cartItem?.quantity?.count
      //               : 0;
      //             let quantity = break_up_item["@ondc/org/item_quantity"]
      //               ? break_up_item["@ondc/org/item_quantity"]["count"]
      //               : 0;
    
      //             let textClass = "";
      //             let quantityMessage = "";
      //             let isError = false;
      //             if (quantity === 0) {
      //               if (break_up_item["@ondc/org/title_type"] === "item") {
      //                 textClass = "text-error";
      //                 quantityMessage = "Out of stock";
      //                 isError = true;
    
      //                 if (cartIndex > -1) {
      //                   cartList.splice(cartIndex, 1);
      //                 }
      //               }
      //             } else if (
      //               !(break_up_item["@ondc/org/title_type"] === "offer") &&
      //               quantity !== cartQuantity
      //             ) {
      //               textClass =
      //                 break_up_item["@ondc/org/title_type"] === "item"
      //                   ? "text-amber"
      //                   : "";
      //               quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
      //               isError = true;
    
      //               if (cartItem) {
      //                 cartItem.quantity.count = quantity;
      //               }
      //             } else {
      //               quantityMessage = `Quantity: ${quantity}`;
      //             }
    
      //             if (error && error.code === "30009") {
      //               cartList.splice(cartIndex, 1);
      //             } else {
      //             }
      //             if (error && error.code === "40002") {
      //             } else {
      //             }
      //             uuid = uuid + 1;
      //             return {
      //               id: break_up_item["@ondc/org/item_id"],
      //               title: break_up_item?.title,
      //               title_type: break_up_item["@ondc/org/title_type"],
      //               isCustomization: isItemCustomization(break_up_item?.item?.tags),
      //               isFulfillment: isItemFulfillment(break_up_item),
      //               isDelivery:
      //                 break_up_item["@ondc/org/title_type"] === "delivery",
      //               isOffer: break_up_item["@ondc/org/title_type"] === "offer",
      //               offer: getOfferDetails(break_up_item?.item?.tags),
      //               parent_item_id: break_up_item?.item?.parent_item_id,
      //               price: Number(break_up_item.price?.value)?.toFixed(2),
      //               cartQuantity,
      //               quantity,
      //               provided_by,
      //               textClass,
      //               quantityMessage,
      //               uuid: uuid,
      //               isError,
      //               errorCode: error?.code || "",
      //             };
      //           });
    
      //           console.log("all_items", all_items);
      //           let items = {};
      //           let delivery = {};
      //           let offers = [];
      //           let outOfStock = [];
      //           let errorCode = "";
      //           let selected_fulfillments = selectedFulfillments;
    
      //           if (Object.keys(selectedFulfillments).length === 0) {
      //             updatedCartItems[0]?.message?.quote.items.forEach((item) => {
      //               selected_fulfillments[item.id] = item.fulfillment_id;
      //             });
      //             setSelectedFulfillments(selected_fulfillments);
      //           } else {
      //           }
    
      //           let selected_fulfillment_ids = Object.values(selected_fulfillments);
    
      //           all_items.forEach((item) => {
      //             errorCode = item.errorCode;
      //             setQuoteItemInProcessing(item.id);
      //             if (item.isError) {
      //               outOfStock.push(item);
      //               isAnyError = true;
      //             }
      //             // for type item
      //             if (item.title_type === "item" && !item.isCustomization) {
      //               let key = item.parent_item_id || item.id;
      //               let price = {
      //                 title: item.quantity + " * Base Price",
      //                 value: item.price,
      //               };
      //               let prev_item_data = items[key];
      //               let addition_item_data = { title: item.title, price: price };
      //               items[key] = { ...prev_item_data, ...addition_item_data };
      //             }
      //             if (
      //               item.title_type === "tax" &&
      //               !item.isCustomization &&
      //               !item.isFulfillment &&
      //               !selected_fulfillment_ids.includes(item.id)
      //               // item.id !== selected_fulfillments
      //             ) {
      //               let key = item.parent_item_id || item.id;
      //               items[key] = items[key] || {};
      //               items[key]["tax"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             if (
      //               item.title_type === "discount" &&
      //               !item.isCustomization &&
      //               !item.isFulfillment
      //             ) {
      //               let key = item.parent_item_id || item.id;
      //               items[key] = items[key] || {};
      //               items[key]["discount"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
    
      //             //for customizations
      //             if (item.title_type === "item" && item.isCustomization) {
      //               let key = item.parent_item_id;
      //               items[key]["customizations"] =
      //                 items[key]["customizations"] || {};
      //               let existing_data = items[key]["customizations"][item.id] || {};
      //               let customisation_details = {
      //                 title: item.title,
      //                 price: {
      //                   title: item.quantity + " * Base Price",
      //                   value: item.price,
      //                 },
      //                 quantityMessage: item.quantityMessage,
      //                 textClass: item.textClass,
      //                 quantity: item.quantity,
      //                 cartQuantity: item.cartQuantity,
      //               };
      //               items[key]["customizations"][item.id] = {
      //                 ...existing_data,
      //                 ...customisation_details,
      //               };
      //             }
      //             if (item.title_type === "tax" && item.isCustomization) {
      //               let key = item.parent_item_id;
      //               items[key]["customizations"] =
      //                 items[key]["customizations"] || {};
      //               items[key]["customizations"][item.id] =
      //                 items[key]["customizations"][item.id] || {};
      //               items[key]["customizations"][item.id]["tax"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             if (item.title_type === "discount" && item.isCustomization) {
      //               let key = item.parent_item_id;
      //               items[key]["customizations"] =
      //                 items[key]["customizations"] || {};
      //               items[key]["customizations"][item.id] =
      //                 items[key]["customizations"][item.id] || {};
      //               items[key]["customizations"][item.id]["discount"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
    
      //             // for item level offer
      //             if (item.isOffer && item.offer?.type === "item") {
      //               let key = item.id;
      //               items[key] = items[key] || {};
      //               let offer = {
      //                 title: item.offer?.name,
      //                 value: item.price,
      //               };
      //               const existing_offers = items[key]["offers"] || [];
      //               items[key]["offers"] = [...existing_offers, offer];
      //             }
    
      //             //for delivery
      //             if (
      //               item.title_type === "delivery" &&
      //               selected_fulfillment_ids.includes(item.id)
      //               // item.id === selected_fulfillments
      //             ) {
      //               const existing_delivery_charge =
      //                 parseFloat(delivery["delivery"]?.value) || 0;
      //               delivery["delivery"] = {
      //                 title: "Delivery Charges",
      //                 value: existing_delivery_charge + parseFloat(item.price),
      //               };
      //             }
      //             if (
      //               (item.title_type === "discount_f" ||
      //                 item.title_type === "discount") &&
      //               item.isFulfillment
      //             ) {
      //               delivery["discount"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             if (
      //               (item.title_type === "tax_f" || item.title_type === "tax") &&
      //               selected_fulfillment_ids.includes(item.id)
      //               // item.id === selected_fulfillments
      //             ) {
      //               delivery["tax"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             if (
      //               item.title_type === "packing" &&
      //               selected_fulfillment_ids.includes(item.id)
      //               // item.id === selected_fulfillments
      //             ) {
      //               delivery["packing"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             if (item.title_type === "discount" && !item.isCustomization) {
      //               let id = item.parent_item_id || item.id;
      //               items[id]["discount"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             if (
      //               item.title_type === "misc" &&
      //               selected_fulfillment_ids.includes(item.id)
      //               // item.id === selected_fulfillments
      //             ) {
      //               delivery["misc"] = {
      //                 title: item.title,
      //                 value: item.price,
      //               };
      //             }
      //             // for fulfillment level offer
      //             if (
      //               item.isOffer &&
      //               item.offer?.type === "fulfillment" &&
      //               selected_fulfillment_ids.includes(item.id)
      //             ) {
      //               let offer = {
      //                 title: item.offer?.name,
      //                 value: item.price,
      //               };
      //               const existing_offers = delivery["offers"] || [];
      //               delivery["offers"] = [...existing_offers, offer];
      //             }
    
      //             // for order level offer
      //             if (item.isOffer && item.offer?.type === "order") {
      //               let key = item.id;
      //               let offer = {
      //                 title: item.offer?.name,
      //                 value: item.price,
      //               };
      //               offers.push(offer);
      //             }
      //           });
    
      //           console.log("offers", offers);
      //           setQuoteItemInProcessing(null);
      //           provider.items = items;
      //           provider.delivery = delivery;
      //           provider.offers = offers;
      //           provider.outOfStock = outOfStock;
      //           provider.errorCode = errorCode || "";
      //           if (errorCode !== "") {
      //             isAnyError = true;
      //           }
      //         }
    
      //         if (error) {
      //           provider.error = error.message;
      //         }
    
      //         total_payable += provider_payable;
      //         provider.total_payable = provider_payable;
      //         return provider;
      //       });
      //       // setGetQuoteLoading(false);
      //       // setUpdateCartLoading(false);
      //       setProductsQuote({
      //         providers: quotes,
      //         isError: isAnyError,
      //         total_payable: total_payable.toFixed(2),
      //       });
      //     }
      //   } catch (err) {
      //     console.log("Calculating quote:", err);
      //     showQuoteError();
      //   }
      // }, [updatedCartItems, selectedFulfillments]);
      
      
      
      useEffect(() => {
        try {
          if (updatedCartItems?.length > 0) {
            // fetch request object length and compare it with the response length
            let c = cartItems.map((item) => {
              return item.item;
            });
            const requestObject = constructQouteObject(c);
            if (requestObject.length === updatedCartItems.length) {
              // setToggleInit(true);
            }
    
            const cartList = JSON.parse(JSON.stringify(updatedCartItems));
            // check if any one order contains error
            let total_payable = 0;
            let isAnyError = false;
            let quotes = updatedCartItems?.map((item, index) => {
              let { message, error } = item;
              let provider_payable = 0;
              const provider = {
                products: [],
                total_payable: 0,
                name: "",
                error: null,
              };
              // else generate quote of it
              if (message) {
                //          message = m2;
    
                if (message?.quote?.quote?.price?.value) {
                  provider_payable += Number(message?.quote?.quote?.price?.value);
                }
                const breakup = message?.quote?.quote?.breakup;
                const provided_by = message?.quote?.provider?.descriptor?.name;
                provider.name = provided_by;
                let uuid = 0;
                const all_items = breakup?.map((break_up_item) => {
                  const cartIndex = cartList?.findIndex((one) => one.id === break_up_item["@ondc/org/item_id"]);
                  const cartItem = cartIndex > -1 ? cartList[cartIndex] : null;
                  let findItemFromCartItems = null;
                  let isCustimization = false;
                  if (break_up_item?.item?.tags) {
                    const findTag = break_up_item?.item?.tags.find((tag) => tag.code === "type");
                    if (findTag) {
                      const findCust = findTag.list.find((listItem) => listItem.value === "customization");
                      if (findCust) {
                        isCustimization = true;
                      } else {
                      }
                    }
                  } else {
                  }
                  cartItems.forEach((ci) => {
                    if (isCustimization) {
                      const cc = ci?.item?.customisations || [];
                      cc.forEach((i) => {
                        if (i.local_id === break_up_item["@ondc/org/item_id"]) {
                          findItemFromCartItems = i;
                        }
                      });
                    } else {
                      if (ci?.item?.local_id === break_up_item["@ondc/org/item_id"]) {
                        findItemFromCartItems = ci?.item;
                      }
                    }
                  });
                  let cartQuantity = findItemFromCartItems
                    ? findItemFromCartItems?.quantity?.count
                    : cartItem
                    ? cartItem?.quantity?.count
                    : 0;
                  let quantity = break_up_item["@ondc/org/item_quantity"]
                    ? break_up_item["@ondc/org/item_quantity"]["count"]
                    : 0;
    
                  let textClass = "";
                  let quantityMessage = "";
                  let isError = false;
                  if (quantity === 0) {
                    if (break_up_item["@ondc/org/title_type"] === "item") {
                      textClass = "text-error";
                      quantityMessage = "Out of stock";
                      isError = true;
    
                      if (cartIndex > -1) {
                        cartList.splice(cartIndex, 1);
                      }
                    }
                  } else if (quantity !== cartQuantity) {
                    textClass = break_up_item["@ondc/org/title_type"] === "item" ? "text-amber" : "";
                    quantityMessage = `Quantity: ${quantity}/${cartQuantity}`;
                    isError = true;
    
                    if (cartItem) {
                      cartItem.quantity.count = quantity;
                    }
                  } else {
                    quantityMessage = `Quantity: ${quantity}`;
                  }
    
                  if (error && error.code === "30009") {
                    cartList.splice(cartIndex, 1);
                  } else {
                  }
                  if (error && error.code === "40002") {
                  } else {
                  }
                  uuid = uuid + 1;
                  return {
                    id: break_up_item["@ondc/org/item_id"],
                    title: break_up_item?.title,
                    title_type: break_up_item["@ondc/org/title_type"],
                    isCustomization: isItemCustomization(break_up_item?.item?.tags),
                    isFulfillment: isItemFulfillment(break_up_item),
                    isDelivery:
                      break_up_item["@ondc/org/title_type"] === "delivery",
                    parent_item_id: break_up_item?.item?.parent_item_id,
                    price: Number(break_up_item.price?.value)?.toFixed(2),
                    cartQuantity,
                    quantity,
                    provided_by,
                    textClass,
                    quantityMessage,
                    uuid: uuid,
                    isError,
                    errorCode: error?.code || "",
                  };
                });
    
                let items = {};
                let delivery = {};
                let outOfStock = [];
                let errorCode = "";
                let selected_fulfillments = selectedFulfillments;
    
                if (Object.keys(selectedFulfillments).length === 0) {
                  updatedCartItems[0]?.message?.quote.items.forEach((item) => {
                    selected_fulfillments[item.id] = item.fulfillment_id;
                  });
                  setSelectedFulfillments(selected_fulfillments);
                } else {
                }
    
                let selected_fulfillment_ids = Object.values(selected_fulfillments);
    
                all_items.forEach((item) => {
                  errorCode = item.errorCode;
                  setQuoteItemInProcessing(item.id);
                  if (item.isError) {
                    outOfStock.push(item);
                    isAnyError = true;
                  }
                  // for type item
                  if (item.title_type === "item" && !item.isCustomization) {
                    let key = item.parent_item_id || item.id;
                    let price = {
                      title: item.quantity + " * Base Price",
                      value: item.price,
                    };
                    let prev_item_data = items[key];
                    let addition_item_data = { title: item.title, price: price };
                    items[key] = { ...prev_item_data, ...addition_item_data };
                  }
                  if (
                    item.title_type === "tax" &&
                    !item.isCustomization &&
                    !item.isFulfillment &&
                    !selected_fulfillment_ids.includes(item.id)
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
                    items[key]["customizations"] =
                      items[key]["customizations"] || {};
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
                    };
                    items[key]["customizations"][item.id] = {
                      ...existing_data,
                      ...customisation_details,
                    };
                  }
                  if (item.title_type === "tax" && item.isCustomization) {
                    let key = item.parent_item_id;
                    items[key]["customizations"] =
                      items[key]["customizations"] || {};
                    items[key]["customizations"][item.id] =
                      items[key]["customizations"][item.id] || {};
                    items[key]["customizations"][item.id]["tax"] = {
                      title: item.title,
                      value: item.price,
                    };
                  }
                  if (item.title_type === "discount" && item.isCustomization) {
                    let key = item.parent_item_id;
                    items[key]["customizations"] =
                      items[key]["customizations"] || {};
                    items[key]["customizations"][item.id] =
                      items[key]["customizations"][item.id] || {};
                    items[key]["customizations"][item.id]["discount"] = {
                      title: item.title,
                      value: item.price,
                    };
                  }
                  //for delivery
                  if (
                    item.title_type === "delivery" &&
                    selected_fulfillment_ids.includes(item.id)
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
                    selected_fulfillment_ids.includes(item.id)
                    // item.id === selected_fulfillments
                  ) {
                    delivery["tax"] = {
                      title: item.title,
                      value: item.price,
                    };
                  }
                  if (
                    item.title_type === "packing" &&
                    selected_fulfillment_ids.includes(item.id)
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
                    selected_fulfillment_ids.includes(item.id)
                    // item.id === selected_fulfillments
                  ) {
                    delivery["misc"] = {
                      title: item.title,
                      value: item.price,
                    };
                  }
                });
                setQuoteItemInProcessing(null);
                provider.items = items;
                provider.delivery = delivery;
                provider.outOfStock = outOfStock;
                provider.errorCode = errorCode || "";
                if (errorCode !== "") {
                  isAnyError = true;
                }
              }
    
              if (error) {
                provider.error = error.message;
              }
    
              total_payable += provider_payable;
              provider.total_payable = provider_payable;
              return provider;
            });
            // setGetQuoteLoading(false);
            // setUpdateCartLoading(false);
            setProductsQuote({
              providers: quotes,
              isError: isAnyError,
              total_payable: total_payable.toFixed(2),
            });
          }
        } catch (err) {
          console.log("Calculating quote:", err);
          showQuoteError();
        }
      }, [updatedCartItems, selectedFulfillments]);




      const showQuoteError = () => {
        let msg = "";
        if (quoteItemInProcessing) {
          msg = `Looks like Quote mapping for item: ${quoteItemInProcessing} is invalid! Please check!`;
        } else {
          msg =
            "Seems like issue with quote processing! Please confirm first if quote is valid!";
        }
        CustomToaster('error',msg);
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
        console.log("tags", tags);
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
    
      const isItemFulfillment = (breakup_item) => {
        let isFulfillment = false;
        breakup_item.item?.tags?.forEach((tag) => {
          if (tag.code === "quote") {
            tag.list?.forEach((list_item) => {
              if (list_item.code == "type" && list_item.value == "fulfillment") {
                isFulfillment = true;
              }
            });
          }
        });
        return isFulfillment;
      };
    
      const getSelectedFulfillment = () => {
        if (selectedFulfillments) {
          return updatedCartItems[0]?.message?.quote?.fulfillments.find(
            (fulfillment) => fulfillment.id === selectedFulfillments
          );
        }
      };

      const [paymentKey, setPaymentKey] = useState("");
      const [paymentParams, setPaymentParams] = useState({});
    
      const [displayRazorPay, setDisplayRazorPay] = useState(false);
      const [paymentStatus, setPaymentStatus] = useState(null);
      const [paymentResponse, setPaymentResponse] = useState(null);
      const [confirmOrderLoading, setConfirmOrderLoading] = useState(false);

////////////////////////////////////////////// after payment//////////////////////////////////////////
useEffect(() => {
  if(paymentEventData.length>0)
  {
    if (responseRef.current.length > 0) {
      setConfirmOrderLoading(false);
      // fetch request object length and compare it with the response length
      const { productQuotes, successOrderIds } = JSON.parse(
        // getValueFromCookie("checkout_details") || "{}"
        localStorage.getItem("checkout_details") || "{}"
      );
      let c = cartItems.map((item) => {
        return item.item;
      });
      const requestObject = constructQouteObject(
        c.filter(({ provider }) =>
          successOrderIds.includes(provider.local_id.toString())
        )
      );
      if (responseRef.current.length === requestObject.length) {
        // redirect to order listing page.
        // remove parent_order_id, search_context from cookies
        removeCookie("transaction_id");
        removeCookie("parent_order_id");
        // removeCookie("search_context");
        // removeCookie("delivery_address");
        removeCookie("billing_address");
        // removeCookie("checkout_details");
        localStorage.removeItem("checkout_details");
        localStorage.removeItem("cartItems");
        removeCookie("parent_and_transaction_id_map");
        localStorage.setItem("transaction_id", uuidv4());
        // removeCookie("LatLongInfo");
        dispatch(setCartList([]))
        handleOrderSuccess();
      }
    }
  }
  
  // eslint-disable-next-line
}, [paymentEventData]);
const getCartItems = async () => {
  try {
  //   setLoading(true);
  const user = JSON.parse(getValueFromCookie("user"));
    const url = `/clientApis/v2/cart/${user.id}`;
    const res = await getCall(url);
    console.log("cart...",res);
    dispatch(setCartList(res));
    //add in cart 
  //   setCartItems(res);
  //   updatedCartItems.current = res;
  //   if (setCheckoutCartItems) {
  //     setCheckoutCartItems(res);
  //   }
  } catch (error) {
    console.log("Error fetching cart items:", error);
  //   setLoading(false);
  } finally {
  //   setLoading(false);
  }
};
const dispatchError = (message)=>{
  return CustomToaster('error',message)
}
// const onConfirmOrder = async (message_id) => {
//   try {
//     const data = await cancellablePromise(
//       getCall(`clientApis/v2/on_confirm_order?messageIds=${message_id}`)
//     );
//     responseRef.current = [...responseRef.current, data[0]];
//     setPaymentEventData((paymentEventData) => [...paymentEventData, data[0]]);
//     dispatch(setPayment_Response(data[0]));
//     localStorage.setItem('orderDetails',JSON.stringify(data[0]));
//     getCartItems();
//   } catch (err) {
//     CustomToaster('error', 'Failed to process order, Please try again')
//     // dispatchError(err?.response?.data?.error?.message);
//     setConfirmOrderLoading(false);
//   }
//   // eslint-disable-next-line
// };

const deleteCartItem = async (itemId) => {
  // dispatch(setIsLoading(true));
  // const user = JSON.parse(getValueFromCookie("user"));
  let user  = localStorage.getItem("user");
  if(user)
  {
    user = JSON.parse(user)
    const url = `/clientApis/v2/cart/${user}/${itemId}`;
    const res = await deleteCall(url);
    // dispatch(setIsLoading(false));
    // getCartItems();
  }
};
const onConfirmOrder = async (message_id) => {
  try {
    const data = await  getCall(`clientApis/v2/on_confirm_order?messageIds=${message_id}`);
    responseRef.current = [...responseRef.current, data[0]];
    setPaymentEventData((paymentEventData) => [...paymentEventData, data[0]]);
    dispatch(setPayment_Response(data[0]));
    localStorage.setItem('orderDetails', JSON.stringify(data[0]));
    
    // Get current cart items before deletion
    const currentCartItems = cartItems; // Assuming cartItems is available in scope
    
    // Delete each cart item
    for (const item of currentCartItems) {
      try {
        await deleteCartItem(item._id);
      } catch (error) {
        console.error(`Failed to delete item ${item._id}:`, error);
        // Continue with next item even if one fails
      }
    }
    
    // Finally get updated cart items
    getCartItems();
    localStorage.removeItem('cartContext');
    localStorage.removeItem('userCartItems');
  } catch (err) {
    CustomToaster('error', 'Failed to process order, Please try again');
    setConfirmOrderLoading(false);
  } finally {
    setConfirmOrderLoading(false);
  }
};
function onConfirm(message_id) {
  eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
    if (eventSource && typeof eventSource.close === 'function') {
      eventSource.close();
    }
    if (timer) {
      clearTimeout(timer)
    }
  })
  eventTimeOutRef.current = []

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
    es.addEventListener("on_confirm", (e) => {
      const { messageId } = JSON.parse(e.data);
      onConfirmOrder(messageId);
    });
    const timer = setTimeout(() => {
      if (!isUnmounted.current) {
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          if (eventSource) {
            eventSource.close()
          }
          if (timer) {
            clearTimeout(timer)
          }
        })
        
        if (responseRef.current.length <= 0) {
          setConfirmOrderLoading(false)
          CustomToaster('error', "Cannot fetch details for this product. Please try again!")
          return
        }
      }
    }, 20000) 

    eventTimeOutRef.current.push({
      eventSource: es,
      timer,
    })
  });
}

const verifyPayment = async (items, method) => {
  responseRef.current = [];
  const parentOrderIDMap = new Map(
    JSON.parse(getValueFromCookie("parent_and_transaction_id_map"))
  );
  const { productQuotes: productQuotesForCheckout } = JSON.parse(
    // getValueFromCookie("checkout_details") || "{}"
    localStorage.getItem("checkout_details") || "{}"
  );
  try {
    const item = items[0];
    const queryParams = [
      {
        context: {
          domain: item.domain,
          city: item.contextCity,
          state: location?.address?.state,
          parent_order_id: parentOrderIDMap.get(item?.provider?.id)
            .parent_order_id,
          transaction_id: parentOrderIDMap.get(item?.provider?.id)
            .transaction_id,
          pincode: location?.address?.areaCode,
        },
        message: {
          payment: {
            ...updatedCartItems[0].message.quote.payment,
            paid_amount: Number(productQuotesForCheckout[0]?.price?.value),
            type:
              method === paymenMethod === 'prepaid' ? "ON-ORDER" :"ON-ORDER",
            transaction_id: parentOrderIDMap.get(item?.provider?.id)
              .transaction_id,
            paymentGatewayEnabled: false, //TODO: we send false for, if we enabled jusPay the we will handle.
          },
          quote: {
            ...productQuotesForCheckout[0],
            price: {
              currency: productQuotesForCheckout[0].price.currency,
              value: String(productQuotesForCheckout[0].price.value),
            },
          },
          providers: getItemProviderId(item),
        },
      },
    ];

    const payloadData = {
      razorPayRequest: paymentResponse,
      confirmRequest: queryParams,
    };

    console.log("Verify api payload: ", payloadData);

    const data = await cancellablePromise(
      postCall("clientApis/v2/razorpay/verify/process", payloadData)
    );
    // Error handling workflow eg, NACK
    // const isNACK = data.find(
    //   (item) => item.error && item.message.ack.status === "NACK"
    // );
    const isNACK = data.find((item) => item.error && item.code !== "");
    if (isNACK) {
      dispatchError(isNACK.error.message);
      setConfirmOrderLoading(false);
    } else {
      onConfirm(
        data?.map((txn) => {
          const { context } = txn;
          return context?.message_id;
        })
      );
    }
  } catch (err) {
    console.log(err);
    CustomToaster('error', 'Failed to process your order, Please try again')
    // dispatchError(err?.response?.data?.error?.message);
    setConfirmOrderLoading(false);
  }
  // eslint-disable-next-line
};
      // useEffect(()=>{
      //   if (paymentStatus&& !isUnmounted.current) {
      //     console.log("inside payment success")
      //     if (paymentStatus === "success") {
      //       setConfirmOrderLoading(true);
      //       let c = cartItems.map((item) => {
      //         return item.item;
      //       });
      //       const { successOrderIds } = JSON.parse(
      //         localStorage.getItem("checkout_details") || "{}"
      //       );
      //       const request_object = constructQouteObject(
      //         c.filter(({ provider }) =>
      //           successOrderIds.includes(provider.local_id.toString())
      //         )
      //       );
      //       verifyPayment(request_object[0], 'razorpay');
      //     } else if (paymentStatus === "fail") {
      //       setConfirmOrderLoading(false);
    
      //       if (paymentResponse?.error?.description) {
      //         dispatchError(paymentResponse.error.description);
      //       } else {
      //         dispatchError("Something went wrong, please try again!");
      //       }
      //     }
      //   }
      // },[paymentStatus])


//////////////////////////////////////////////////////////////////////////////////////////////////////
    
    

useEffect(() => {
  if (paymentStatus && !isUnmounted.current) {
    if (paymentStatus === "success") {
      setConfirmOrderLoading(true);
      let c = cartItems.map((item) => {
        return item.item;
      });
      const { successOrderIds } = JSON.parse(
        localStorage.getItem("checkout_details") || "{}"
      );
      const request_object = constructQouteObject(
        c.filter(({ provider }) =>
          successOrderIds.includes(provider.local_id.toString())
        )
      );
      verifyPayment(request_object[0], 'razorpay');
    } else if (paymentStatus === "fail") {
      setConfirmOrderLoading(false);
      setDisplayRazorPay(false); // Reset Razorpay display state
      setPaymentStatus(null); // Reset payment status
      setPaymentResponse(null); // Reset payment response

      if (paymentResponse?.error?.description) {
        dispatchError(paymentResponse.error.description);
      } else {
        dispatchError("Something went wrong, please try again!");
      }
    }
  }
}, [paymentStatus]);

useEffect(() => {
        resetCartItems();
        // let timeout;
        // const duration = moment.duration(
        //   updatedCartItems[0]?.message.quote.quote.ttl
        // );
    
        // if (updatedCartItems[0]?.message.quote.quote.ttl) {
        //   console.log(
        //     "Request timeout",
        //     updatedCartItems[0]?.message.quote.quote.ttl,
        //     duration.asMilliseconds()
        //   );
        //   timeout = setTimeout(() => {
        //     router.push("/application/cart");
        //     CustomToaster(
        //       'error',
        //       "Request Timed out, please try again!"
        //     );
        //   }, duration.asMilliseconds());
    
        //   return () => {
        //     clearTimeout(timeout);
        //   };
        // }
      }, []);

    const responseReceivedIds = updatedCartItems?.map((item) => {
        const { message } = item;
        return message?.quote?.provider?.id.toString();
      })

    const getKeys = async () => {
        const url = "/clientApis/v2/razorpay/razorPay/keys";
        try {
          const res = await cancellablePromise(getCall(url));
          setPaymentKey(res.keyId);
          return res.keyId;
        } catch (error) {
            // CustomToaster('error',error);
          console.log("keys error: ", error);
        }
      };

      const getItemsTotal = (providers) => {
        let finalTotal = 0;
        if (providers) {
          providers.forEach((provider) => {
            const items = Object.values(provider.items).filter(
              (quote) => quote?.title !== ""
            );
            items.forEach((item) => {
              finalTotal = finalTotal + parseFloat(item.price.value);
              if (item?.tax) {
                finalTotal = finalTotal + parseFloat(item.tax.value);
              }
              if (item?.discount) {
                finalTotal = finalTotal + parseFloat(item.discount.value);
              }
              if (item?.customizations) {
                Object.values(item.customizations)?.forEach((custItem) => {
                  finalTotal = finalTotal + parseFloat(custItem.price.value);
                  if (custItem?.tax) {
                    finalTotal = finalTotal + parseFloat(custItem.tax.value);
                  }
                });
              }
              if (item?.offers) {
                item.offers.map((offer) => {
                  finalTotal = finalTotal + parseFloat(offer.value);
                });
              }
            });
          });
        }
        return finalTotal.toFixed(2);
      };

      const getDeliveryTotalAmount = (providers) => {
        let total = 0;
        providers.forEach((provider) => {
          console.log("bhaii price...",provider)
          const data = provider.delivery;
          if (data.delivery) {
            total = total + parseFloat(data.delivery.value);
          }
          if (data.discount) {
            total = total + parseFloat(data.discount.value);
          }
          if (data.tax) {
            total = total + parseFloat(data.tax.value);
          }
          if (data.packing) {
            total = total + parseFloat(data.packing.value);
          }
          if (data.misc) {
            total = total + parseFloat(data.misc.value);
          }
          if (data.offers) {
            data.offers.map((offer) => {
              total = total + parseFloat(offer.value);
            });
          }
        });
        return total.toFixed(2);
      };
    
      const getOffersTotalAmount = (providers) => {
        let total = 0;
        providers.forEach((provider) => {
          provider.offers.forEach((offer) => {
            total = total + parseFloat(offer.value);
          });
        });
        console.log("calculated offers total", total);
        return total.toFixed(2);
      };

      const getFinalPrice = () => {
        return parseFloat(productsQuote?.total_payable).toFixed(2);
        // return (
        //   parseFloat(getItemsTotal(productsQuote?.providers)) +
        //   parseFloat(getDeliveryTotalAmount(productsQuote?.providers)) +
        //   parseFloat(getOffersTotalAmount(productsQuote?.providers))
        // ).toFixed(2);
      };
    
      const createPayment = async () => {
        let amount = getFinalPrice()
        const url = `/clientApis/v2/razorpay/${transaction_id}`;
        const data = {
          amount,
        };
        try {
          const res = await cancellablePromise(postCall(url, data));
          setPaymentParams(res.data);
          return res.data;
        } catch (error) {
            // CustomToaster('error', error)
          console.log("create payment error: ", error);
        }
      };
      console.log('payment params',paymentParams)
      const getItemProviderId = (item) => {
        const providers = getValueFromCookie("providerIds").split(",");
        let provider = {};
        if (providers.includes(item.provider.local_id)) {
          provider = {
            id: item.provider.local_id,
            locations: item.provider.locations.map((location) => location.local_id),
          };
        } else {
        }
        return provider;
      };
      // const confirmOrder = async (items, method) => {
      //   responseRef.current = [];
      //   const parentOrderIDMap = new Map(
      //     JSON.parse(getValueFromCookie("parent_and_transaction_id_map"))
      //   );
      //   const { productQuotes: productQuotesForCheckout } = JSON.parse(
      //     // getValueFromCookie("checkout_details") || "{}"cod
      //     localStorage.getItem("checkout_details") || "{}"
      //   );
      //   try {
      //   //   const search_context = JSON.parse(getValueFromCookie("search_context"));
      //     const item = items[0];
      //     const queryParams = [
      //       {
      //         context: {
      //           domain: item.domain,
      //           city: item.contextCity,
      //           state: location?.address?.state,
      //           parent_order_id: parentOrderIDMap.get(item?.provider?.id)
      //             .parent_order_id,
      //           transaction_id: parentOrderIDMap.get(item?.provider?.id)
      //             .transaction_id,
      //           pincode: location?.address?.areaCode,
      //         },
      //         message: {
      //           payment: {
      //             ...updatedCartItems[0].message.quote.payment,
      //             paid_amount: Number(productQuotesForCheckout[0]?.price?.value),
      //             type:
      //               method === 'cash_on_delivery' ? "ON-FULFILLMENT" : "ON-ORDER",
      //             transaction_id: parentOrderIDMap.get(item?.provider?.id)
      //               .transaction_id,
      //             paymentGatewayEnabled: false, //TODO: we send false for, if we enabled jusPay the we will handle.
      //           },
      //           quote: {
      //             ...productQuotesForCheckout[0],
      //             price: {
      //               currency: productQuotesForCheckout[0].price.currency,
      //               value: String(productQuotesForCheckout[0].price.value),
      //             },
      //           },
      //           providers: getItemProviderId(item),
      //         },
      //       },
      //     ];
      //     const data = await cancellablePromise(
      //       postCall("clientApis/v2/confirm_order", queryParams)
      //     );
      //     //Error handling workflow eg, NACK
      //     // const isNACK = data.find(
      //     //   (item) => item.error && item.message.ack.status === "NACK"
      //     // );
      //     const isNACK = data.find((item) => item.error && item.code !== "");
      //     if (isNACK) {
      //       dispatchError(isNACK.error.message);
      //       setConfirmOrderLoading(false);
      //     } else {
      //       onConfirm(
      //         data?.map((txn) => {
      //           const { context } = txn;
      //           return context?.message_id;
      //         })
      //       );
      //     }
      //   } catch (err) {
      //     CustomToaster('error', 'Failed to process order, Please try again')
      //     // dispatchError(err?.response?.data?.error?.message);
      //     setConfirmOrderLoading(false);
      //   }
      //   // eslint-disable-next-line
      // };




      const confirmOrder = async (items, method) => {
        setConfirmOrderLoading(true);
        responseRef.current = [];
        const parentOrderIDMap = new Map(
          JSON.parse(getValueFromCookie("parent_and_transaction_id_map"))
        );
        const { productQuotes: productQuotesForCheckout } = JSON.parse(
          // getValueFromCookie("checkout_details") || "{}"
          localStorage.getItem("checkout_details") || "{}"
        );
        try {
          const search_context = JSON.parse(getValueFromCookie("search_context"));
          const item = items[0];
          const queryParams = [
            {
              context: {
                domain: item.domain,
                city: item.contextCity,
                state: search_context.location.state,
                parent_order_id: parentOrderIDMap.get(item?.provider?.id)
                  .parent_order_id,
                transaction_id: parentOrderIDMap.get(item?.provider?.id)
                  .transaction_id,
                pincode: JSON.parse(getValueFromCookie("delivery_address"))
                  ?.location.address.areaCode,
              },
              message: {
                payment: {
                  ...updatedCartItems[0].message.quote.payment,
                  paid_amount: Number(productQuotesForCheckout[0]?.price?.value),
                  type: "ON-ORDER",
                  transaction_id: parentOrderIDMap.get(item?.provider?.id)
                    .transaction_id,
                  paymentGatewayEnabled: false, //TODO: we send false for, if we enabled jusPay the we will handle.
                },
                quote: {
                  ...productQuotesForCheckout[0],
                  price: {
                    currency: productQuotesForCheckout[0].price.currency,
                    value: String(productQuotesForCheckout[0].price.value),
                  },
                },
                providers: getItemProviderId(item),
              },
            },
          ];
          const data = await 
            postCall("clientApis/v2/confirm_order", queryParams);
          //Error handling workflow eg, NACK
          // const isNACK = data.find(
          //   (item) => item.error && item.message.ack.status === "NACK"
          // );
          const isNACK = data.find((item) => item.error && item.code !== "");
          if (isNACK) {
            dispatchError(isNACK.error.message);
            setConfirmOrderLoading(false);
          } else {
            onConfirm(
              data?.map((txn) => {
                const { context } = txn;
                return context?.message_id;
              })
            );
          }
        } catch (err) {
          dispatchError(err?.response?.data?.error?.message);
          setConfirmOrderLoading(false);
        }
        // eslint-disable-next-line
      };



      // const handleProceedToPay=()=>{
      //   const { productQuotes, successOrderIds } = JSON.parse(
      //       localStorage.getItem("checkout_details") || "{}"
      //     );
      //   //   setConfirmOrderLoading(true);
      //     let c = cartItems.map((item) => {
      //       return item.item;
      //     });
      //     if (paymenMethod) {
      //       if (paymenMethod === 'prepaid') {
      //         setDisplayRazorPay(true);
      //       } else {
      //         const request_object = constructQouteObject(
      //           c.filter(({ provider }) =>
      //             successOrderIds.includes(provider.local_id.toString())
      //           )
      //         );
      //         confirmOrder(request_object[0], 'cash_on_delivery');
      //       }
      //     } else {
      //       CustomToaster('error',"Please select payment.");
      //     }
      // }

      const handleProceedToPay = async () => {
        const { productQuotes, successOrderIds } = JSON.parse(
          localStorage.getItem("checkout_details") || "{}"
        );
        let c = cartItems.map((item) => {
          return item.item;
        });
        
        if (paymenMethod) {
          if (paymenMethod === 'prepaid') {
            // Reset states before showing Razorpay
            setPaymentStatus(null);
            setPaymentResponse(null);
            setDisplayRazorPay(false);
            
            // Small delay to ensure clean state
            setTimeout(() => {
              setDisplayRazorPay(true);
            }, 100);
          } else {
            const request_object = constructQouteObject(
              c.filter(({ provider }) =>
                successOrderIds.includes(provider.local_id.toString())
              )
            );
            confirmOrder(request_object[0], 'cash_on_delivery');
          }
        } else {
          CustomToaster('error', "Please select payment.");
        }
      }

      const handleSuccess = async () => {
        setInitializeOrderLoading(false);
        // updateInitLoading(false);
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
        handleProceedToPay();
        trackPaymentGatewayOpen();
      };
      const setUpdateCartItemsDataOnInitialize=(data) => {
        setSelectedFulfillments({});
        setUpdatedCartItems(data);
      }
      const onInitializeOrder = async (message_id) => {
        setInitializeOrderLoading(true);
        console.log("bhai inside oninitialize order");
        try {
          localStorage.setItem("selectedItems", JSON.stringify(updatedCartItems));
          const data = await cancellablePromise(getCall(`/clientApis/v2/on_initialize_order?messageIds=${message_id}`));
          responseRef.current = [...responseRef.current, data[0]];
          setEventData((eventData) => [...eventData, data[0]]);
    
          let oldData = updatedCartItems;
          oldData[0].message.quote.quote = data[0].message.order.quote;
          oldData[0].message.quote.payment = data[0].message.order.payment;
    
          setUpdateCartItemsDataOnInitialize(oldData);
          handleSuccess();
        } catch (err) {
          CustomToaster('error', 'Failed to process order, Please try again')
          setInitializeOrderLoading(false);
          // updateInitLoading(false);
        }
        // eslint-disable-next-line
      };
    
      // use this function to initialize the order
      function onInit(message_id) {
        setInitializeOrderLoading(true);
        eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
          if (eventSource && typeof eventSource.close === 'function') {
            eventSource.close();
          }
          if (timer) {
            clearTimeout(timer)
          }
        })
        eventTimeOutRef.current = []
        const token = getValueFromCookie("token");
        let header = {
          headers: {
            ...(token && {
              Authorization: `Bearer ${token}`,
            }),
          },
        };
        console.log("bhai atleast inside init");
        message_id.forEach((id) => {
            console.log("bhaii inside onInit",id);
          let es = new EventSourcePolyfill(
            `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events/v2?messageId=${id}`,
            header
          );
          es.addEventListener("on_init", (e) => {
            const { messageId } = JSON.parse(e.data);
            onInitializeOrder(messageId);
          });
          const timer = setTimeout(() => {
            if (!isUnmounted.current) {
              eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
                if (eventSource) {
                  eventSource.close()
                }
                if (timer) {
                  clearTimeout(timer)
                }
              })
      
              if (responseRef.current.length <= 0) {
                setInitializeOrderLoading(false);
                CustomToaster('error', "Cannot fetch details for this product. Please try again!")
                return
              }
      
              const requestObject = constructQouteObject(
                updatedCartItems.filter(({ message }) => 
                  responseReceivedIds.includes(message?.quote?.provider.id.toString())
                )
              )
              
              if (requestObject.length !== responseRef.current.length) {
                CustomToaster('error', "Some orders are not initialized!")
              }
            }
          }, 20000) // or your SSE_TIMEOUT value
      
          eventTimeOutRef.current.push({
            eventSource: es,
            timer,
          })
        });
      }
      console.log(paymentMethodDetails,"paymentMethodDetails");
      const transaction_id = localStorage.getItem("transaction_id");
    const {cancellablePromise} = useCancellablePromise();
      const initializeOrder = async (itemsList) => {
        const items = JSON.parse(JSON.stringify(Object.assign([], itemsList)));
        let fulfillments = updatedCartItems[0]?.message?.quote?.fulfillments
        responseRef.current = [];
        setInitializeOrderLoading(true);
        console.log("updated Cart itemms", updatedCartItems)
        try {   
          const data = await cancellablePromise(
            postCall(
              "/clientApis/v2/initialize_order",
              items.map((item) => {
                let itemsData = Object.assign([], JSON.parse(JSON.stringify(item)));
                itemsData = itemsData.map((itemData) => {
                    console.log('selected fulfillments', updatedCartItems);
                  itemData.fulfillment_id = selectedFulfillments[itemData.local_id];
                  delete itemData.product.fulfillment_id;
                  if (cartItems) {
                    let findItemFromQuote = updatedCartItems[0].message.quote.items.find(
                      (data) => data.id === itemData.local_id
                    );
                    if (findItemFromQuote) {
                      itemData.parent_item_id = findItemFromQuote.parent_item_id;
                    }
                    itemData.product.fulfillments = updatedCartItems[0].message.quote.fulfillments
                  } else {
                  }
                  return itemData;
                });
                console.log("items data selected fullfilments",itemsData)
                return {
                  context: {
                    transaction_id: transaction_id,
                    city: location?.address?.city,
                    city: item[0].contextCity,
                    state: location?.address?.state,
                    domain: item[0].domain,
                    pincode: location?.address?.areaCode,
                  },
                  message: {
                    items: itemsData,
                    fulfillments: fulfillments.filter((fulfillment) =>
                      Object.values(selectedFulfillments).includes(fulfillment.id)
                    ),
                    offers: getSelectedOffers(),
                    billing_info: {
                      "address": {
                          "areaCode": billingAddress?.address?.areaCode,
                          "building": billingAddress?.address?.building,
                          "city": billingAddress?.address?.city,
                          "country": billingAddress?.address?.country,
                          "door": billingAddress?.address?.door,
                          "lat": billingAddress?.address?.lat,
                          "lng": billingAddress?.address?.lng,
                          "state": billingAddress?.address?.state,
                          "street": billingAddress?.address?.street,
                          "tag": billingAddress?.address?.tag
                        },
                        phone: billingAddress?.descriptor?.phone?.startsWith("+91") ? billingAddress?.descriptor?.phone?.substring(3): billingAddress?.descriptor?.phone,
                        name: billingAddress?.descriptor?.name,
                      email: billingAddress?.descriptor?.email,
                    },
                    delivery_info: {
                      type: "Delivery",
                      name: deliveryAddress?.descriptor?.name,
                      email: deliveryAddress?.descriptor?.email,
                      phone: deliveryAddress?.descriptor?.phone?.startsWith("+91") ? deliveryAddress?.descriptor?.phone?.substring(3): deliveryAddress?.descriptor?.phone,
                      location: {
                        gps: `${deliveryAddress?.address?.lat},${deliveryAddress?.address?.lng}`,
                        "address": {
                          "areaCode": deliveryAddress?.address?.areaCode,
                          "building": deliveryAddress?.address?.building,
                          "city": deliveryAddress?.address?.city,
                          "country": deliveryAddress?.address?.country,
                          "door": deliveryAddress?.address?.door,
                          "lat": deliveryAddress?.address?.lat,
                          "lng": deliveryAddress?.address?.lng,
                          "state": deliveryAddress?.address?.state,
                          "street": deliveryAddress?.address?.street,
                          "tag": deliveryAddress?.address?.tag
                        },
                      },
                    },
                    payment: {
                      type: paymenMethod === 'prepaid' ? "ON-ORDER" :"ON-FULFILLMENT" ,
                    },
                  },
                };
              })
            )
          );
          trackPlaceOrderClicked(data);
          //Error handling workflow eg, NACK
          const isNACK = data.find((item) => item.error && item.message.ack.status === "NACK");
          if (isNACK) {
            CustomToaster('error',isNACK.error.message)
            setInitializeOrderLoading(false);
            // updateInitLoading(false);
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
          CustomToaster('error', 'Failed to process order, Please try again')

          // CustomToaster('error',err)
          setInitializeOrderLoading(false);
          // updateInitLoading(false);
        }
      };
      function constructQouteObject(cartItems) {
        const map = new Map();
        cartItems.map((item) => {
          let bpp_uri = item?.product?.context?.bpp_uri;
          if (bpp_uri) {
            item.bpp_uri = bpp_uri;
          }
      
          const provider_id = item?.provider?.id;
          if (map.get(provider_id)) {
            return map.set(provider_id, [...map.get(provider_id), item]);
          }
          return map.set(provider_id, [item]);
        });
        return Array.from(map.values());
      }

      const checkCustomerDetails=()=>{
        console.log("customerDetails",customerInfo, location);
        
        if(!(customerInfo?.customer?.name && customerInfo?.customer?.email && customerInfo?.customer?.phone)){
          CustomToaster('error', 'Please provide customer details')
          return false;
        }

        if(!(location.descriptor.name && location.descriptor.email && location.descriptor.phone && location.address.areaCode && location.address.building && location.address.street && location.address.city && location.address.state && location.address.lat && location.address.lng && location.address.country)){
          CustomToaster('error', 'Please provide delivery address details')
          return false;
        }

        return true;
      }
      const placeOrder = () => {
        setInitializeOrderLoading(true);
        // updateInitLoading(true);
        if(!checkCustomerDetails())return;
        let c = cartItems.map((item) => {
          return item.item;
        });
        // console.log("payment integration 1",updatedCartItems);
        const request_object = constructQouteObject(
          c.filter(({ provider }) => responseReceivedIds.includes(provider.local_id.toString()))
        );
        initializeOrder(request_object);
      };
    
    
    //

    // console.log('payment method 123', paymenMethod);
    if (initializeOrderLoading) {
      return <LoadingScreen message={initializeOrder? "Processing your checkout...":"Confirming your order"} />
  }
    return (
        <Grid
            container
            spacing={3}
            mb="2rem"
            paddingTop={{ xs: '0px !important', md: '60px' }}
        >
            <Grid item xs={12} md={7}>
                {method !== 'offline' ? (
                    <Stack spacing={3}>
                        <CustomerInfoPage/>
                        <DeliveryDetails
                            token={token}
                            global={global}
                            setOrderType={setOrderType}
                            orderType={orderType}
                            setAddress={setAddress}
                            handleSelectAddress={handleSelectAddress}
                            handleCloseAddress={handleCloseAddress}
                            address={address}
                            page={page}
                            setPaymenMethod={setPaymenMethod}
                            additionalInformationStates={
                                additionalInformationStates
                            }
                            additionalInformationDispatch={
                                additionalInformationDispatch
                            }
                            setDeliveryTip={setDeliveryTip}
                            setPaymentMethodDetails={setPaymentMethodDetails}
                            setUsePartialPayment={setUsePartialPayment}
                            setSwitchToWallet={setSwitchToWallet}

                        />
                        <PaymentOptions
                            global={global}
                            paymenMethod={paymenMethod}
                            setPaymenMethod={setPaymenMethod}
                            subscriptionStates={subscriptionStates}
                            usePartialPayment={usePartialPayment}
                            setSelected={setSelected}
                            selected={selected}
                            paymentMethodDetails={paymentMethodDetails}
                            setPaymentMethodDetails={setPaymentMethodDetails}
                            setSwitchToWallet={setSwitchToWallet}
                        />
                    </Stack>
                ) : (
                    <OfflinePaymentForm
                        key={method}
                        offlinePaymentOptions={offlinePaymentOptions}
                        paymenMethod={paymenMethod}
                        setPaymenMethod={setPaymenMethod}
                        // handleSubmitOfflineForm={handleSubmitOfflineForm}
                        totalAmount={totalAmount}
                        currencySymbolDirection={currencySymbolDirection}
                        currencySymbol={currencySymbol}
                        digitAfterDecimalPoint={digitAfterDecimalPoint}
                        walletBalance={walletAmount}
                        usePartialPayment={usePartialPayment}
                        offlineFormRef={offlineFormRef}
                        placeOrder={placeOrder}
                    />
                )}
            </Grid>

            <Grid item xs={12} md={5} height="auto">
                <CustomPaperBigCard height="auto" >
                    <Stack spacing={2} justifyContent="space-between">
                        <OrderSummary variant="h4">
                            {t('Order Summary')}
                        </OrderSummary>
                       
                        <SimpleBar
                            style={{ maxHeight: '100%', width: '100%' }}
                        >
                            <OrderSummaryDetails
                                type={type}
                                page={page}
                                global={global}
                            />
                        </SimpleBar>
                       

                        <OrderCalculation
                            cartList={cartList
                            }
                            taxAmount={taxAmount}
                            total_order_amount={total_order_amount}
                            global={global}
                            couponInfo={couponInfo}
                            orderType={orderType}
                            deliveryTip={deliveryTip}
                            destination={address}
                            additionalCharge={global?.additional_charge}
                            totalAmount={totalAmount}
                            walletBalance={walletAmount}
                            usePartialPayment={usePartialPayment}
                            placeOrder={placeOrder}
                            setCouponDiscount={setCouponDiscount}
                            offlineFormRef={offlineFormRef}
                            setOfflineCheck={setOfflineCheck}
                            page={page}
                            paymentMethodDetails={paymentMethodDetails}
                            cashbackAmount={cashbackAmount}
                            extraPackagingCharge={extraPackagingCharge}
                        />
                    </Stack>
                </CustomPaperBigCard>
            </Grid>

            {openModal && (
                <CustomModal
                    openModal={openModal}
                    bgColor={theme.palette.customColor.ten}
                    //handleClose={() => setOpenModal(false)}
                >
                    <PartialPaymentModal
                        global={global}
                        payableAmount={totalAmount}
                        agree={agreeToWallet}
                        reject={notAgreeToWallet}
                        colorTitle=" Want to pay via your wallet ? "
                        title="You can pay the full amount with your wallet."
                        remainingBalance={walletAmount - totalAmount}
                    />
                </CustomModal>
            )}
            {openPartialModel && (
                <CustomModal
                    openModal={openPartialModel}
                    bgColor={theme.palette.customColor.ten}
                >
                    <PartialPaymentModal
                        global={global}
                        payableAmount={totalAmount}
                        agree={agreeToPartial}
                        reject={notAgreeToPartial}
                        colorTitle=" Want to pay partially with wallet ? "
                        title="You do not have sufficient balance to pay full amount via wallet."
                    />
                </CustomModal>
            )}
            {displayRazorPay && (
            <Razorpay
                providerName={cartItems[0]?.item?.provider?.descriptor?.name || ""}
                paymentKey={paymentKey}
                paymentParams={paymentParams}
                setPaymentStatus={setPaymentStatus}
                setPaymentResponse={setPaymentResponse}
                billingAddress={billingAddress}
            />
        )}
{       openAddressModal&& <AddressList openAddressModal={openAddressModal} setOpenAddressModal={setOpenAddressModal}/>
}        </Grid>
    )
}

export default CheckoutPage