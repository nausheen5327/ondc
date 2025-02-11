// hooks/useCheckoutFlow.js
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { setAuthModalOpen, setIsLoading } from '@/redux/slices/global'
import { EventSourcePolyfill } from 'event-source-polyfill'
import { getValueFromCookie, AddCookie } from '@/utils/cookies'
import { constructQouteObject } from '@/utils/constructQouteObject'
import { postCall, getCall } from '@/api/MainApi'
import useCancellablePromise from '@/api/cancelRequest'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import React, { useCallback, useMemo, useState } from 'react'
import { setCartContext } from '@/redux/slices/cart'

export const useCheckoutFlow = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { cancellablePromise } = useCancellablePromise()
  const responseRef = React.useRef([])
  const eventTimeOutRef = React.useRef([])
  const updatedCartItems = React.useRef([])

  const getProviderIds = (request_object) => {
    let providers = []
    request_object.map((cartItem) => {
      providers.push(cartItem.provider.local_id)
    })
    const ids = [...new Set(providers)]
    AddCookie("providerIds", ids)
    return ids
  }

  const offerInSelectFormat = (id) => {
    return {
      id: id,
      tags: [
        {
          code: "selection",
          list: [{ code: "apply", value: "yes" }]
        }
      ]
    }
  }

  const getOffersForSelect = (selectedNonAdditiveOffer, selectedAdditiveOffers) => {
    if (selectedNonAdditiveOffer) {
      return [offerInSelectFormat(selectedNonAdditiveOffer)]
    } else {
      return selectedAdditiveOffers?.length > 0
        ? selectedAdditiveOffers.map((id) => offerInSelectFormat(id))
        : []
    }
  }

  const onGetQuote = async (message_id) => {
    try {
      // dispatch(setIsLoading(true))

      const data = await getCall(`/clientApis/v2/on_select?messageIds=${message_id}`)
      
      responseRef.current = [...responseRef.current, data[0]];

      // setEventData((eventData) => [...eventData, data[0]]);
      dispatch(setCartContext(data[0]))
      localStorage.setItem('cartContext', JSON.stringify(data[0]));

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
      // dispatch(setIsLoading(false));

      // router.push(`/checkout`);
    } catch (err) {
      //   setCheckoutLoading(false);
      CustomToaster('error', 'Failed to process your checkout items, Please try again');
      // dispatch(setIsLoading(false));

      //   setGetQuoteLoading(false);
    }
  }

  // const onFetchQuote = (message_ids) => {
  //   console.log('inside fetch quote 1...',message_ids);
  //   dispatch(setIsLoading(true))
  //   eventTimeOutRef.current = []

  //   const token = getValueFromCookie("token")
  //   const headers = token ? { Authorization: `Bearer ${token}` } : {}

  //   message_ids.forEach((id) => {
  //     console.log('respective message ids are ',id);
  //     let es = new EventSourcePolyfill(
  //       `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events/v2?messageId=${id}`,
  //       { headers }
  //     )

  //     console.log('inside fetch quote es is...',es);
  //     es.addEventListener("on_select", (e) => {
  //       console.log('on select triggered',e);
  //       const { messageId } = JSON.parse(e.data)
  //       onGetQuote(messageId)
  //     })

  //     const timer = setTimeout(() => {
  //       eventTimeOutRef.current.forEach(({ eventSource, timer }) => {
  //         eventSource.close()
  //         clearTimeout(timer)
  //       })

  //       if (responseRef.current.length <= 0) {
  //         dispatch(setIsLoading(false))
  //         CustomToaster('error', 'Cannot fetch details for this product')
  //         router.replace("/")
  //         return
  //       }
  //     }, 20000)

  //     dispatch(setIsLoading(false))
  //     eventTimeOutRef.current.push({ eventSource: es, timer })
  //   })
  // }
  const onFetchQuote = (message_ids) => {
    // dispatch(setIsLoading(true))
    eventTimeOutRef.current = []

    message_ids.forEach((id) => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/clientApis/events/v2?messageId=${id}`
      
      let es = new EventSourcePolyfill(url, {
        // Add these options to help with connection
        reconnectInterval: 3000,
        heartbeatTimeout: 30000,
      })
  
      // Monitor connection state changes
      es.onopen = () => {
        console.log('Connection opened for messageId:', id)
      }
  
      es.onerror = (error) => {
        console.error('EventSource error for messageId:', id)
        console.error('Connection state:', es.readyState)
        // 0 = connecting, 1 = open, 2 = closed
        
        if (es.readyState === 2) {
          // Connection is closed, attempt to reconnect
          es.close() // Clean up existing connection
          
          // Create new connection after a short delay
          setTimeout(() => {
            es = new EventSourcePolyfill(url, {
              reconnectInterval: 3000,
              heartbeatTimeout: 30000,
            })
          }, 1000)
        }
      }
  
      es.addEventListener("on_select", (e) => {
        if (e && e.data) {
          try {
            const { messageId } = JSON.parse(e.data)
            onGetQuote(messageId)
          } catch (error) {
          }
        }
      })
  
      const timer = setTimeout(() => {
        if (es && es.readyState !== 2) { // Only close if not already closed
          es.close()
        }
        clearTimeout(timer)
  
        if (responseRef.current.length <= 0) {
          // dispatch(setIsLoading(false))
          CustomToaster('error', 'Cannot fetch details for this product')
          router.replace("/")
        }
      }, 20000)
  
      // dispatch(setIsLoading(false))
      eventTimeOutRef.current.push({ eventSource: es, timer })
    })
  }
  const [selectedNonAdditiveOffer, setSelectedNonAdditiveOffer] = useState("");
  const [selectedAdditiveOffers, setSelectedAdditiveOffers] = useState([]);
  
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
  const getQuote = async (items, location) => {
    if (!location) {
      CustomToaster('error', 'Please Select Address')
      return
    }
    console.log("verified 10");

    try {
      const transactionId = localStorage.getItem("transaction_id")
      responseRef.current = []

      const updatedItems = items.map((item) => {
        const newItem = { ...item }
        delete newItem.context
        delete newItem.contextCity
        return newItem
      })



      const selectPayload = {
        context: {
          transaction_id: transactionId,
          domain: items[0]?.domain,
          city: location?.address?.city,
          pincode: location?.address?.areaCode,
          state: location?.address?.state,
        },
        message: {
          cart: { items: updatedItems },
          offers: offersForSelect(),
          fulfillments: [{
            end: {
              location: {
                gps: `${location?.address?.lat},${location?.address?.lng}`,
                address: { area_code: location?.address?.areaCode }
              }
            }
          }]
        }
      }
      console.log("verified 11");

      // dispatch(setIsLoading(true))
      const data = await postCall("/clientApis/v2/select", [selectPayload])
      console.log('inside get quote 1...',data);

      // dispatch(setIsLoading(false))

      const isNACK = data.find(item => item?.error && item?.message?.ack?.status === "NACK")
      console.log('inside get quote 2...',isNACK);

      if (isNACK) {
        console.log("verified 12");

        console.log('NACK in get quote');
        CustomToaster('error', `${isNACK.error.message}`)
      } else {
        console.log("verified 13");

        onFetchQuote(data.map(txn => txn.context?.message_id))
      }
    } catch (err) {
      CustomToaster('error', 'Failed to process few items in your cart, Please try again')
      router.replace('/')
    }
  }

  const handleCheckoutFlow = async (cartItems, location) => {
    const token = getValueFromCookie("token");

    // if (!token) {
    //   dispatch(setAuthModalOpen(true))
    //   return
    // }
   
    if (cartItems.length > 0) {
      const items = cartItems.map(item => item.item)
      const request_object = constructQouteObject(items)
      await getQuote(request_object[0], location)
      getProviderIds(request_object[0])
    }
  }

  return {
    handleCheckoutFlow
  }
}