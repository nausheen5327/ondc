import { alpha, Grid, Modal, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { ProductsApi } from '@/hooks/react-query/config/productsApi'
import { useWishListDelete } from '@/hooks/react-query/config/wish-list/useWishListDelete'
import { cart, setCampCart, setCart, setCartList, setClearCart } from '@/redux/slices/cart'
import { addWishList, removeWishListFood } from '@/redux/slices/wishList'
import {
    calculateItemBasePrice,
    getConvertDiscount,
    handleProductValueWithOutDiscount,
    isAvailable,
} from '@/utils/customFunctions'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useMutation } from 'react-query'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import AuthModal from '../auth'
import { FoodDetailModalStyle } from '../home/HomeStyle'
import CartClearModal from './CartClearModal'
import StartPriceView from './StartPriceView'

import AddOnsManager from './AddOnsManager'
import AddOrderToCart from './AddOrderToCart'
import AddUpdateOrderToCart from './AddUpdateOrderToCart'
import { handleProductVariationRequirementsToaster } from './SomeHelperFuctions'
import TotalAmountVisibility from './TotalAmountVisibility'
import UpdateToCartUi from './UpdateToCartUi'
import VariationsManager from './VariationsManager'

import { CustomToaster } from '@/components/custom-toaster/CustomToaster'
import { useIsMount } from '@/components/first-render-useeffect-controller/useIsMount'
import HalalSvg from '@/components/food-card/HalalSvg'
import { useGetFoodDetails } from '@/hooks/react-query/food/useGetFoodDetails'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import { Box, Stack } from '@mui/system'
import useAddCartItem from '../../hooks/react-query/add-cart/useAddCartItem'
import useCartItemUpdate from '../../hooks/react-query/add-cart/useCartItemUpdate'
import useDeleteAllCartItem from '../../hooks/react-query/add-cart/useDeleteAllCartItem'
import { onErrorResponse } from '../ErrorResponse'
import { handleValuesFromCartItems } from '../checkout-page/CheckoutPage'
import { getGuestId, getToken } from '../checkout-page/functions/getGuestUserId'
import LocationModalAlert from '../food-card/LocationModalAlert'
import { ReadMore } from '../landingpage/ReadMore'
import {
    getSelectedAddons,
    getSelectedVariations,
} from '../navbar/second-navbar/SecondNavbar'
import FoodModalTopSection from './FoodModalTopSection'
import IncrementDecrementManager from './IncrementDecrementManager'
import VagSvg from './VagSvg'
import { handleInitialTotalPriceVarPriceQuantitySet } from './helper-functions/handleDataOnFirstMount'
import useCancellablePromise from '@/api/cancelRequest'
import { getCall, postCall } from '@/api/MainApi'
import { getCartItems } from '@/api/getCartItem'

const FoodDetailModal = ({
    product,
    image,
    open,
    handleModalClose,
    setOpen,
    currencySymbolDirection,
    currencySymbol,
    digitAfterDecimalPoint,
    productUpdate,
    handleBadge,
    campaign,
}) => {
    const isMount = useIsMount()
    const router = useRouter()
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const theme = useTheme()
    const [selectedOptions, setSelectedOptions] = useState([])
    const [isLocation, setIsLocation] = useState(false)
    const [totalPrice, setTotalPrice] = useState(null)
    const [varPrice, setVarPrice] = useState(null)
    const [totalWithoutDiscount, setTotalWithoutDiscount] = useState(null)
    const [modalFor, setModalFor] = useState('sign-in')
    const [add_on, setAddOns] = useState([])
    const [product_add_ons, setProductAddOns] = useState(product?.add_ons)
    const { cartList } = useSelector((state) => state.cart)
    const [quantity, setQuantity] = useState(1)
    const [clearCartModal, setClearCartModal] = React.useState(false)
    const handleClearCartModalOpen = () => setClearCartModal(true)
    const { token } = useSelector((state) => state.userToken)
    const { wishLists } = useSelector((state) => state.wishList)
    const [modalData, setModalData] = useState([product])
    const [variationStock, setVariationStock] = useState(false)
    const [errorCode, setErrorCode] = useState('')
    const [productPayload, setProductPayload] = useState();
    const location = useSelector(state=>state.addressData.location);
    // const { mutate: addToCartMutate, isLoading: addToCartLoading } =
    //     useAddCartItem()
    // const { mutate: updateMutate } = useCartItemUpdate()
    // const { mutate: deleteCartItemMutate } = useDeleteAllCartItem()
    // console.log('product 123456',product)
    useEffect(()=>{
        setModalData([product]);
    },[])

    const itemSuccess = (res) => {
        if (res) {
            handleInitialTotalPriceVarPriceQuantitySet(
                res,
                setModalData,
                productUpdate,
                setTotalPrice,
                setVarPrice,
                setQuantity,
                setSelectedOptions,
                setTotalWithoutDiscount
            )
            setAddOns([])
            setSelectedOptions([])
        }
    }

    const { cancellablePromise } = useCancellablePromise();

    const getProductDetails = async (productId) => {
        try {
        //   setProductLoading(true);
          const data = await cancellablePromise(
            getCall(`/clientApis/v2/item-details?id=${productId}`)
          );
          setProductPayload(data);
        // setProductPayload({
        //     "item_details": {
        //         "id": "db7e96d9-1daf-4f2d-87de-51184fc79da6",
        //         "time": {
        //             "label": "enable",
        //             "timestamp": "2023-12-13T07:04:27.902Z"
        //         },
        //         "parent_item_id": "",
        //         "descriptor": {
        //             "name": "Pepperoni Pizza",
        //             "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/549adb33-9935-4367-b102-badd4fa4620b/product_image/Tandoori Paneer Pizza.png",
        //             "short_desc": "Pepperoni Pizza.",
        //             "long_desc": "Pepperoni Pizza.",
        //             "images": [
        //                 "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/549adb33-9935-4367-b102-badd4fa4620b/product_image/Tandoori Paneer Pizza.png",
        //                 "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/8a797b13-5a3d-48ad-8044-d16a667bf78d/product_image/Pizza.png",
        //                 "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/a2c5f585-02e6-4a4b-b6f1-4431313ebb2b/product_image/Pizza1.png",
        //                 "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/0ed109c4-5e33-48c4-af75-1b373c044bbb/product_image/pIZZA2.png"
        //             ]
        //         },
        //         "quantity": {
        //             "unitized": {
        //                 "measure": {
        //                     "unit": "unit",
        //                     "value": "1"
        //                 }
        //             },
        //             "available": {
        //                 "count": "99"
        //             },
        //             "maximum": {
        //                 "count": "10"
        //             }
        //         },
        //         "price": {
        //             "currency": "INR",
        //             "value": 250,
        //             "maximum_value": "250"
        //         },
        //         "category_ids": [
        //             "KVk30x:1"
        //         ],
        //         "category_id": "Pizza",
        //         "location_id": "65795971cb93550b2f0e25cc",
        //         "fulfillment_id": "1",
        //         "@ondc/org/returnable": true,
        //         "@ondc/org/cancellable": true,
        //         "@ondc/org/available_on_cod": true,
        //         "@ondc/org/time_to_ship": "PT1H",
        //         "@ondc/org/seller_pickup_return": true,
        //         "@ondc/org/return_window": "PT1H",
        //         "@ondc/org/contact_details_consumer_care": "Mauli Stationers,ganesh123@yopmail.com,8830343362",
        //         "tags": [
        //             {
        //                 "code": "type",
        //                 "list": [
        //                     {
        //                         "code": "type",
        //                         "value": "item"
        //                     }
        //                 ]
        //             },
        //             {
        //                 "code": "image",
        //                 "list": [
        //                     {
        //                         "code": "type",
        //                         "value": "back_image"
        //                     },
        //                     {
        //                         "code": "url",
        //                         "value": ""
        //                     }
        //                 ]
        //             },
        //             {
        //                 "code": "veg_nonveg",
        //                 "list": [
        //                     {
        //                         "code": "veg",
        //                         "value": "yes"
        //                     }
        //                 ]
        //             }
        //         ]
        //     },
        //     "provider_details": {
        //         "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1",
        //         "descriptor": {
        //             "name": "Mauli Stationers",
        //             "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/b115f27b-746e-41cd-a7e5-56cb78489172/logo/Mauli logo.png",
        //             "short_desc": "Mauli Stationers",
        //             "long_desc": "Mauli Stationers",
        //             "images": [
        //                 "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/b115f27b-746e-41cd-a7e5-56cb78489172/logo/Mauli logo.png"
        //             ]
        //         },
        //         "time": {
        //             "label": "enable",
        //             "timestamp": "2024-10-10T06:38:13.865Z"
        //         },
        //         "@ondc/org/fssai_license_no": "73683683834937",
        //         "ttl": "PT24H",
        //         "tags": [
        //             {
        //                 "code": "serviceability",
        //                 "list": [
        //                     {
        //                         "code": "location",
        //                         "value": "65795971cb93550b2f0e25cc"
        //                     },
        //                     {
        //                         "code": "category",
        //                         "value": "F&B"
        //                     },
        //                     {
        //                         "code": "type",
        //                         "value": ""
        //                     },
        //                     {
        //                         "code": "unit",
        //                         "value": ""
        //                     },
        //                     {
        //                         "code": "value",
        //                         "value": ""
        //                     }
        //                 ]
        //             }
        //         ],
        //         "local_id": "73fef8e6-eda2-4981-8c94-641d6386f4c1"
        //     },
        //     "location_details": {
        //         "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1_65795971cb93550b2f0e25cc",
        //         "gps": "13.032895219628294,77.63006608174867",
        //         "address": {
        //             "city": "Bengaluru",
        //             "state": "Karnataka",
        //             "area_code": "560043",
        //             "street": "HBR Layout",
        //             "locality": "NA"
        //         },
        //         "time": {
        //             "label": "enable",
        //             "timestamp": "2024-10-10T06:38:13.865Z",
        //             "days": "1,2,3,4,5,6,7",
        //             "schedule": {
        //                 "holidays": [
        //                     "2023-12-16"
        //                 ]
        //             },
        //             "range": {
        //                 "start": "0000",
        //                 "end": "2300"
        //             }
        //         },
        //         "circle": {
        //             "gps": "13.032895219628294,77.63006608174867",
        //             "radius": {
        //                 "unit": "km",
        //                 "value": "3"
        //             }
        //         },
        //         "local_id": "65795971cb93550b2f0e25cc",
        //         "min_time_to_ship": 3600,
        //         "max_time_to_ship": 3600,
        //         "average_time_to_ship": 3600,
        //         "median_time_to_ship": 3600,
        //         "type": "polygon"
        //     },
        //     "fulfillment_details": {
        //         "id": "1",
        //         "type": "Delivery"
        //     },
        //     "context": {
        //         "domain": "ONDC:RET11",
        //         "action": "on_search",
        //         "country": "IND",
        //         "city": "std:080",
        //         "core_version": "1.2.0",
        //         "bap_id": "ondcpreprod.nazarasdk.com",
        //         "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
        //         "transaction_id": "T6789",
        //         "message_id": "M9076",
        //         "timestamp": "2024-10-10T06:38:13.865Z",
        //         "ttl": "PT30S",
        //         "bpp_id": "seller-app-preprod-v2.ondc.org",
        //         "bpp_uri": "https://seller-app-preprod-v2.ondc.org"
        //     },
        //     "bpp_details": {
        //         "name": "Mauli Stationers",
        //         "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/b115f27b-746e-41cd-a7e5-56cb78489172/logo/Mauli logo.png",
        //         "short_desc": "Mauli Stationers",
        //         "long_desc": "Mauli Stationers",
        //         "images": [
        //             "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/b115f27b-746e-41cd-a7e5-56cb78489172/logo/Mauli logo.png"
        //         ],
        //         "tags": [
        //             {
        //                 "code": "bpp_terms",
        //                 "list": [
        //                     {
        //                         "code": "np_type",
        //                         "value": "MSN"
        //                     }
        //                 ]
        //             }
        //         ],
        //         "bpp_id": "seller-app-preprod-v2.ondc.org"
        //     },
        //     "attribute_key_values": [],
        //     "type": "item",
        //     "created_at": "2024-10-10T06:38:16.774190",
        //     "local_id": "db7e96d9-1daf-4f2d-87de-51184fc79da6",
        //     "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1_db7e96d9-1daf-4f2d-87de-51184fc79da6",
        //     "fulfillment": [
        //         {
        //             "id": "1",
        //             "type": "Delivery",
        //             "contact": {
        //                 "email": "ganesh123@yopmail.com",
        //                 "phone": "8830343362"
        //             }
        //         },
        //         {
        //             "id": "2",
        //             "type": "Self-Pickup",
        //             "contact": {
        //                 "email": "ganesh123@yopmail.com",
        //                 "phone": "8830343362"
        //             }
        //         }
        //     ],
        //     "is_first": true,
        //     "categories": [
        //         {
        //             "id": "4o5Y9m",
        //             "parent_category_id": "",
        //             "descriptor": {
        //                 "name": "Burger",
        //                 "short_desc": "Our best selling burger with crispy veg patty",
        //                 "long_desc": "Our best selling burger with crispy veg patty",
        //                 "images": [
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/9f1a260f-85dd-4e11-97e1-f1d94ef03296/menu_image/Burger1.png",
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/0c2ecbdb-f132-4b79-bdbf-64bf915f5b6f/menu_image/Bueger.png",
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/6a461beb-23a5-4b71-bdce-7ff9d348427c/menu_image/Burger1.png"
        //                 ]
        //             },
        //             "tags": [
        //                 {
        //                     "code": "type",
        //                     "list": [
        //                         {
        //                             "code": "type",
        //                             "value": "custom_menu"
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "code": "display",
        //                     "list": [
        //                         {
        //                             "code": "rank",
        //                             "value": "1"
        //                         }
        //                     ]
        //                 }
        //             ]
        //         },
        //         {
        //             "id": "KVk30x",
        //             "parent_category_id": "",
        //             "descriptor": {
        //                 "name": "Pizza",
        //                 "short_desc": "Pizza",
        //                 "long_desc": "Pizza",
        //                 "images": [
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/575cfd53-2c04-439a-92f1-c64d11ec4f6c/menu_image/Pizza.png",
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/d366410b-4ce3-4789-9b6c-915524a652a7/menu_image/pIZZA2.png",
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/2db9ce3e-15e7-409a-af0b-de95a6550d91/menu_image/Pizza1.png"
        //                 ]
        //             },
        //             "tags": [
        //                 {
        //                     "code": "type",
        //                     "list": [
        //                         {
        //                             "code": "type",
        //                             "value": "custom_menu"
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "code": "display",
        //                     "list": [
        //                         {
        //                             "code": "rank",
        //                             "value": "2"
        //                         }
        //                     ]
        //                 }
        //             ]
        //         }
        //     ],
        //     "variant_group": {},
        //     "customisation_groups": [],
        //     "customisation_menus": [
        //         {
        //             "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1_KVk30x",
        //             "parent_category_id": "",
        //             "descriptor": {
        //                 "name": "Pizza",
        //                 "short_desc": "Pizza",
        //                 "long_desc": "Pizza",
        //                 "images": [
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/575cfd53-2c04-439a-92f1-c64d11ec4f6c/menu_image/Pizza.png",
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/d366410b-4ce3-4789-9b6c-915524a652a7/menu_image/pIZZA2.png",
        //                     "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/2db9ce3e-15e7-409a-af0b-de95a6550d91/menu_image/Pizza1.png"
        //                 ]
        //             },
        //             "tags": [
        //                 {
        //                     "code": "type",
        //                     "list": [
        //                         {
        //                             "code": "type",
        //                             "value": "custom_menu"
        //                         }
        //                     ]
        //                 },
        //                 {
        //                     "code": "display",
        //                     "list": [
        //                         {
        //                             "code": "rank",
        //                             "value": "2"
        //                         }
        //                     ]
        //                 }
        //             ],
        //             "local_id": "KVk30x"
        //         }
        //     ],
        //     "language": "en",
        //     "auto_item_flag": true,
        //     "item_error_tags": [
        //         {
        //             "code": "91016"
        //         }
        //     ],
        //     "auto_provider_flag": false,
        //     "provider_error_tags": [],
        //     "auto_seller_flag": false,
        //     "seller_error_tags": [],
        //     "item_flag": true,
        //     "seller_flag": false,
        //     "provider_flag": false,
        //     "in_stock": true,
        //     "location_availabilities": [],
        //     "customisation_items": [],
        //     "locations": [
        //         {
        //             "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1_65795971cb93550b2f0e25cc",
        //             "gps": "13.032895219628294,77.63006608174867",
        //             "address": {
        //                 "city": "Bengaluru",
        //                 "state": "Karnataka",
        //                 "area_code": "560043",
        //                 "street": "HBR Layout",
        //                 "locality": "NA"
        //             },
        //             "time": {
        //                 "label": "enable",
        //                 "timestamp": "2024-10-10T06:38:13.865Z",
        //                 "days": "1,2,3,4,5,6,7",
        //                 "schedule": {
        //                     "holidays": [
        //                         "2023-12-16"
        //                     ]
        //                 },
        //                 "range": {
        //                     "start": "0000",
        //                     "end": "2300"
        //                 }
        //             },
        //             "circle": {
        //                 "gps": "13.032895219628294,77.63006608174867",
        //                 "radius": {
        //                     "unit": "km",
        //                     "value": "3"
        //                 }
        //             },
        //             "local_id": "65795971cb93550b2f0e25cc",
        //             "min_time_to_ship": 3600,
        //             "max_time_to_ship": 3600,
        //             "average_time_to_ship": 3600,
        //             "median_time_to_ship": 3600,
        //             "type": "polygon"
        //         }
        //     ],
        //     "attributes": {}
        // })
        //   return data;
        } catch (error) {
          console.error("Error fetching product details:", error);
            
        } finally {
        //   setProductLoading(false);
        }
      };
    
      const handleAddToCart = async (
        productPayload,
        isDefault = false,
        navigate
      ) => {
        const user = JSON.parse(getValueFromCookie("user"));
        const url = `/clientApis/v2/cart/${user.id}`;
    
        const subtotal = productPayload.item_details.price.value;
        const payload = {
          id: productPayload.id,
          local_id: productPayload.local_id,
          bpp_id: productPayload.bpp_details.bpp_id,
          bpp_uri: productPayload.context.bpp_uri,
          domain: productPayload.context.domain,
          quantity: {
            count: 1,
          },
          provider: {
            id: productPayload.bpp_details.bpp_id,
            locations: productPayload.locations,
            ...productPayload.provider_details,
          },
          product: {
            id: productPayload.id,
            subtotal,
            ...productPayload.item_details,
          },
          customisations: [],
          hasCustomisations:
            productPayload.hasOwnProperty("customisation_groups") &&
            productPayload.customisation_groups.length > 0,
        };
    
        const res = await postCall(url, payload);
        if (navigate) {
          history.push("/application/cart");
        }
        fetchCartItems();
      };

    
    useEffect(() => {
            getProductDetails(product?.id)
    }, [])
    useEffect(() => {
        if (productPayload) {
            setModalData([productPayload]);
        }
    }, [productPayload]);
    const notify = (i) => toast(i)
    const itemValuesHandler = (itemIndex, variationValues) => {
        const isThisValExistWithinSelectedValues = selectedOptions.filter(
            (sItem) => sItem.choiceIndex === itemIndex
        )
        if (variationValues.length > 0) {
            let newVariation = variationValues.map((vVal, vIndex) => {
                let exist =
                    isThisValExistWithinSelectedValues.length > 0 &&
                    isThisValExistWithinSelectedValues.find(
                        (item) => item.optionIndex === vIndex
                    )
                if (exist) {
                    return exist
                } else {
                    return { ...vVal, isSelected: false }
                }
            })
            return newVariation
        } else {
            return variationValues
        }
    }
console.log(productPayload,"props 1...")
    const getNewVariationForDispatch = () => {
        const newVariations = modalData?.[0]?.variations?.map((item, index) => {
            if (selectedOptions.length > 0) {
                return {
                    ...item,
                    values:
                        item.values.length > 0
                            ? itemValuesHandler(index, item.values)
                            : item.values,
                }
            } else {
                return item
            }
        })
        return newVariations
    }
    const handleSuccess = (res) => {
        if (res) {
            let product = {}
            res?.forEach((item) => {
                product = {
                    ...item?.item,
                    cartItemId: item?.id,
                    totalPrice: item?.price,
                    quantity: item?.quantity,
                    variations: item?.item?.variations,
                    selectedAddons: add_on,
                    selectedOptions: selectedOptions,
                    //itemBasePrice: item?.item?.price,
                    itemBasePrice: getConvertDiscount(
                        item?.item?.discount,
                        item?.item?.discount_type,
                        calculateItemBasePrice(modalData[0], selectedOptions),
                        item?.item?.restaurant_discount
                    ),
                }
            })
            // dispatch(setCart(product))
            console.log("products123456",product);
            CustomToaster('success', 'Item added to cart')
            handleClose()
            //dispatch()
        }
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
                        ) * item?.quantity,
                    selectedAddons: getSelectedAddons(item?.item?.addons),
                    quantity: item?.quantity,
                    variations: item?.item?.variations,
                    itemBasePrice: getConvertDiscount(
                        item?.item?.discount,
                        item?.item?.discount_type,
                        calculateItemBasePrice(
                            item?.item,
                            item?.item?.variations
                        ),
                        item?.item?.restaurant_discount
                    ),
                    selectedOptions: getSelectedVariations(
                        item?.item?.variations
                    ),
                }))
            }
            dispatch(cart(setItemIntoCart()))
            CustomToaster('success', 'Item updated successfully')
            //toast.success(t('Item updated successfully'))
            handleModalClose?.()
        }
    }

    const handleAddUpdate = () => {
        if (productUpdate) {
            //for updating
            let totalQty = 0
            const itemObject = {
                cart_id: product?.cart_id,
                guest_id: getGuestId(),
                model: product?.available_date_starts ? 'ItemCampaign' : 'Food',
                add_on_ids:
                    add_on?.length > 0
                        ? add_on?.map((add) => {
                              return add.id
                          })
                        : [],
                add_on_qtys:
                    add_on?.length > 0
                        ? add_on?.map((add) => {
                              totalQty = add.quantity
                              return totalQty
                          })
                        : [],
                item_id: product?.id,
                price: getConvertDiscount(
                    product?.discount,
                    product?.discount_type,
                    totalPrice,
                    product?.restaurant_discount,
                    quantity
                ),
                quantity: quantity,
                variation_options: selectedOptions?.map(
                    (item) => item.option_id
                ),
                variations:
                    getNewVariationForDispatch()?.length > 0
                        ? getNewVariationForDispatch()?.map((variation) => {
                              return {
                                  name: variation.name,
                                  values: {
                                      label: handleValuesFromCartItems(
                                          variation.values
                                      ),
                                  },
                              }
                          })
                        : [],
            }

            updateMutate(itemObject, {
                onSuccess: cartListSuccessHandler,
                onError: (error) => {
                    error?.response?.data?.errors?.forEach((item) => {
                        CustomToaster('error', item?.message)
                        if (item?.code === 'stock_out') {
                            setErrorCode(item?.code)
                            refetch()
                        }
                    })
                },
            })
        } else {
            let isOrderNow = false
            let totalQty = 0
            const itemObject = {
                model: 'Food',
                add_on_ids:
                    add_on?.length > 0
                        ? add_on?.map((add) => {
                              return add.id
                          })
                        : [],
                add_on_qtys:
                    add_on?.length > 0
                        ? add_on?.map((add) => {
                              totalQty = add.quantity
                              return totalQty
                          })
                        : [],
                item_id: modalData[0]?.id,
                price: getConvertDiscount(
                    modalData[0]?.discount,
                    modalData[0]?.discount_type,
                    totalPrice,
                    modalData[0]?.restaurant_discount,
                    quantity
                ),
                quantity: quantity,
                variations:
                    getNewVariationForDispatch()?.length > 0
                        ? getNewVariationForDispatch()?.map((variation) => {
                              return {
                                  name: variation.name,
                                  values: {
                                      label: handleValuesFromCartItems(
                                          variation.values
                                      ),
                                  },
                              }
                          })
                        : [],
                variation_options: selectedOptions?.map(
                    (item) => item.option_id
                ),
            }
            // addToCartMutate(itemObject, {
            //     onSuccess: handleSuccess,
            //     onError: (error) => {
            //         error?.response?.data?.errors?.forEach((item) => {
            //             CustomToaster('error', item?.message)
            //             if (item?.code === 'stock_out') {
            //                 setErrorCode(item?.code)
            //                 refetch()
            //             }
            //         })
            //     },
            // })
            //add to cart API
            addToCart(false,true)
            // .then(
            //     handleSuccess
            // ).catch(
            //     CustomToaster('error','Failed to add product to cart')
            // )
            
        }
        // handleClose?.()
    }
    const cartItems = useSelector(state=>state.cart.cartList);
    console.log(cartItems,'CartItem...');
    const addToCart = async (navigate = false, isIncrement = true) => {
        // setAddToCartLoading(true);
        try {
        const user = JSON.parse(localStorage.getItem("user"));
        const url = `/clientApis/v2/cart/${user.localId}`;
        let subtotal = totalPrice;
    
        const customisations =  null;
    
        const payload = {
          id: modalData[0].id,
          local_id: modalData[0].local_id,
          bpp_id: modalData[0].bpp_details.bpp_id,
          bpp_uri: modalData[0].context.bpp_uri,
          domain: modalData[0].context.domain,
          tags: modalData[0].item_details.tags,
          customisationState: null,
          contextCity: modalData[0].context.city,
          quantity: {
            count: 1,
          },
          provider: {
            id: modalData[0].bpp_details.bpp_id,
            locations: modalData[0].locations,
            ...modalData[0].provider_details,
          },
          product: {
            id: modalData[0].id,
            subtotal,
            ...modalData[0].item_details,
          },
          customisations,
          hasCustomisations: customisations ? true : false,
        };
    
        let cartItem = [];
        cartItem = cartItems.filter((ci) => {
            console.log("ci...",ci);
          return ci.id === payload.id;
        });
    
        if (customisations) {
          cartItem = cartItem.filter((ci) => {
            return ci.item.customisations != null;
          });
        }
    
        if (cartItem.length > 0 && customisations) {
          cartItem = cartItem.filter((ci) => {
            return ci.item.customisations.length === customisations.length;
          });
        }
    
        if (cartItem.length === 0) {
        //   let res = await postCall(url, payload);
        //   getCartItems(user).then((res)=>{
        //     console.log("cart item fetch",res);
        //   }).catch(err=>{
        //     console.log('error in fetching cart items')
            // let res = [
            //     {
            //         "_id": "6729f3d212e6dbc687fb28a7",
            //         "cart": "6729f3d212e6dbc687fb28a5",
            //         "item": {
            //             "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_68ae0d64-a8a7-412a-a359-007ffac25eaa",
            //             "local_id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
            //             "bpp_id": "pramaan.ondc.org/alpha/mock-server",
            //             "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
            //             "domain": "ONDC:RET11",
            //             "tags": [
            //                 {
            //                     "code": "type",
            //                     "list": [
            //                         {
            //                             "code": "type",
            //                             "value": "item"
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     "code": "custom_group",
            //                     "list": [
            //                         {
            //                             "code": "id",
            //                             "value": "CG1"
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     "code": "veg_nonveg",
            //                     "list": [
            //                         {
            //                             "code": "veg",
            //                             "value": "yes"
            //                         }
            //                     ]
            //                 }
            //             ],
            //             "customisationState": {
            //                 "firstGroup": {
            //                     "id": "CG1",
            //                     "name": "Crust",
            //                     "inputType": "select",
            //                     "minQuantity": 1,
            //                     "maxQuantity": 1,
            //                     "seq": 1
            //                 },
            //                 "CG1": {
            //                     "id": "CG1",
            //                     "name": "Crust",
            //                     "seq": 1,
            //                     "options": [
            //                         {
            //                             "id": "C1",
            //                             "name": "New Hand Tossed",
            //                             "price": 0,
            //                             "inStock": true,
            //                             "parent": "CG1",
            //                             "child": "CG2",
            //                             "childs": [
            //                                 "CG2"
            //                             ],
            //                             "isDefault": true,
            //                             "vegNonVeg": "veg"
            //                         }
            //                     ],
            //                     "selected": [
            //                         {
            //                             "id": "C1",
            //                             "name": "New Hand Tossed",
            //                             "price": 0,
            //                             "inStock": true,
            //                             "parent": "CG1",
            //                             "child": "CG2",
            //                             "childs": [
            //                                 "CG2"
            //                             ],
            //                             "isDefault": true,
            //                             "vegNonVeg": "veg"
            //                         }
            //                     ],
            //                     "childs": [
            //                         "CG2"
            //                     ],
            //                     "isMandatory": true,
            //                     "type": "Radio"
            //                 },
            //                 "CG2": {
            //                     "id": "CG2",
            //                     "name": "Size",
            //                     "seq": 2,
            //                     "options": [
            //                         {
            //                             "id": "C3",
            //                             "name": "Regular",
            //                             "price": 0,
            //                             "inStock": true,
            //                             "parent": "CG2",
            //                             "child": "CG4",
            //                             "childs": [
            //                                 "CG4"
            //                             ],
            //                             "isDefault": true,
            //                             "vegNonVeg": "veg"
            //                         }
            //                     ],
            //                     "selected": [
            //                         {
            //                             "id": "C3",
            //                             "name": "Regular",
            //                             "price": 0,
            //                             "inStock": true,
            //                             "parent": "CG2",
            //                             "child": "CG4",
            //                             "childs": [
            //                                 "CG4"
            //                             ],
            //                             "isDefault": true,
            //                             "vegNonVeg": "veg"
            //                         }
            //                     ],
            //                     "childs": [
            //                         "CG4"
            //                     ],
            //                     "isMandatory": true,
            //                     "type": "Radio"
            //                 },
            //                 "CG4": {
            //                     "id": "CG4",
            //                     "name": "Toppings",
            //                     "seq": 3,
            //                     "options": [
            //                         {
            //                             "id": "C8",
            //                             "name": "Grilled Mushrooms",
            //                             "price": 35,
            //                             "inStock": true,
            //                             "parent": "CG4",
            //                             "child": null,
            //                             "childs": null,
            //                             "isDefault": true,
            //                             "vegNonVeg": "veg"
            //                         }
            //                     ],
            //                     "selected": [
            //                         {
            //                             "id": "C8",
            //                             "name": "Grilled Mushrooms",
            //                             "price": 35,
            //                             "inStock": true,
            //                             "parent": "CG4",
            //                             "child": null,
            //                             "childs": null,
            //                             "isDefault": true,
            //                             "vegNonVeg": "veg"
            //                         }
            //                     ],
            //                     "childs": [],
            //                     "isMandatory": true,
            //                     "type": "Radio"
            //                 }
            //             },
            //             "contextCity": "std:011",
            //             "quantity": {
            //                 "count": 2
            //             },
            //             "provider": {
            //                 "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
            //                 "locations": [
            //                     {
            //                         "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
            //                         "gps": "28.553440, 77.214241",
            //                         "address": {
            //                             "street": "7/6, August Kranti Marg",
            //                             "locality": "Siri Fort Institutional Area, Siri Fort",
            //                             "city": "New Delhi",
            //                             "state": "Delhi",
            //                             "area_code": "110049"
            //                         },
            //                         "circle": {
            //                             "gps": "28.553440, 77.214241",
            //                             "radius": {
            //                                 "unit": "km",
            //                                 "value": "10"
            //                             }
            //                         },
            //                         "time": {
            //                             "label": "enable",
            //                             "timestamp": "2024-10-28T06:22:18.630Z",
            //                             "days": "1,2,3,4,5,6,7",
            //                             "schedule": {
            //                                 "holidays": [],
            //                                 "frequency": "PT4H",
            //                                 "times": [
            //                                     "1100",
            //                                     "1900"
            //                                 ]
            //                             },
            //                             "range": {
            //                                 "start": "0000",
            //                                 "end": "2359"
            //                             }
            //                         },
            //                         "local_id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
            //                         "min_time_to_ship": 900,
            //                         "max_time_to_ship": 2700,
            //                         "average_time_to_ship": 1350,
            //                         "median_time_to_ship": 900,
            //                         "type": "pan"
            //                     }
            //                 ],
            //                 "time": {
            //                     "label": "enable",
            //                     "timestamp": "2024-10-28T06:22:18.629Z"
            //                 },
            //                 "descriptor": {
            //                     "name": "WITS ONDC TEST STORE",
            //                     "short_desc": "Wits Testing Store",
            //                     "long_desc": "Wits Testing Store",
            //                     "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                     "images": [
            //                         "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                     ]
            //                 },
            //                 "@ondc/org/fssai_license_no": "12345678901234",
            //                 "ttl": "P1D",
            //                 "creds": [
            //                     {
            //                         "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                         "descriptor": {
            //                             "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                             "name": "Unique provider Id of seller app"
            //                         },
            //                         "url": "https://abcd.cdn.com/images/badge-img",
            //                         "tags": [
            //                             {
            //                                 "code": "verification",
            //                                 "list": [
            //                                     {
            //                                         "code": "verify_url",
            //                                         "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
            //                                     },
            //                                     {
            //                                         "code": "valid_from",
            //                                         "value": "2023-06-03T00:00:00:000Z"
            //                                     }
            //                                 ]
            //                             }
            //                         ]
            //                     }
            //                 ],
            //                 "tags": [
            //                     {
            //                         "code": "catalog_link",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "inline"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "timing",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "Order"
            //                             },
            //                             {
            //                                 "code": "location",
            //                                 "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                             },
            //                             {
            //                                 "code": "day_from",
            //                                 "value": "1"
            //                             },
            //                             {
            //                                 "code": "day_to",
            //                                 "value": "7"
            //                             },
            //                             {
            //                                 "code": "time_from",
            //                                 "value": "0000"
            //                             },
            //                             {
            //                                 "code": "time_to",
            //                                 "value": "2359"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "timing",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "Self-Pickup"
            //                             },
            //                             {
            //                                 "code": "location",
            //                                 "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                             },
            //                             {
            //                                 "code": "day_from",
            //                                 "value": "1"
            //                             },
            //                             {
            //                                 "code": "day_to",
            //                                 "value": "7"
            //                             },
            //                             {
            //                                 "code": "time_from",
            //                                 "value": "1000"
            //                             },
            //                             {
            //                                 "code": "time_to",
            //                                 "value": "2200"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "timing",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "Delivery"
            //                             },
            //                             {
            //                                 "code": "location",
            //                                 "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                             },
            //                             {
            //                                 "code": "day_from",
            //                                 "value": "1"
            //                             },
            //                             {
            //                                 "code": "day_to",
            //                                 "value": "7"
            //                             },
            //                             {
            //                                 "code": "time_from",
            //                                 "value": "1100"
            //                             },
            //                             {
            //                                 "code": "time_to",
            //                                 "value": "2200"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "serviceability",
            //                         "list": [
            //                             {
            //                                 "code": "location",
            //                                 "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
            //                             },
            //                             {
            //                                 "code": "category",
            //                                 "value": "F&B"
            //                             },
            //                             {
            //                                 "code": "type",
            //                                 "value": "11"
            //                             },
            //                             {
            //                                 "code": "val",
            //                                 "value": "110001-110049, 110055"
            //                             },
            //                             {
            //                                 "code": "unit",
            //                                 "value": "pincode"
            //                             }
            //                         ]
            //                     }
            //                 ],
            //                 "local_id": "pramaan.ondc.org/alpha/mock-server"
            //             },
            //             "product": {
            //                 "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
            //                 "subtotal": 269,
            //                 "time": {
            //                     "label": "enable",
            //                     "timestamp": "2024-10-28T06:22:18.629Z"
            //                 },
            //                 "descriptor": {
            //                     "name": "Farm House Pizza",
            //                     "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                     "short_desc": "Farm House Pizza",
            //                     "long_desc": "Farm House Pizza",
            //                     "images": [
            //                         "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                     ]
            //                 },
            //                 "quantity": {
            //                     "unitized": {
            //                         "measure": {
            //                             "unit": "unit",
            //                             "value": "1"
            //                         }
            //                     },
            //                     "available": {
            //                         "count": "99"
            //                     },
            //                     "maximum": {
            //                         "count": "99"
            //                     }
            //                 },
            //                 "price": {
            //                     "currency": "INR",
            //                     "value": 269,
            //                     "maximum_value": "269.0"
            //                 },
            //                 "category_id": "F&B",
            //                 "category_ids": [
            //                     "rxpirYGWXh5r:3"
            //                 ],
            //                 "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
            //                 "location_id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
            //                 "related": false,
            //                 "recommended": true,
            //                 "@ondc/org/returnable": false,
            //                 "@ondc/org/cancellable": true,
            //                 "@ondc/org/return_window": "PT1H",
            //                 "@ondc/org/seller_pickup_return": false,
            //                 "@ondc/org/time_to_ship": "PT45M",
            //                 "@ondc/org/available_on_cod": false,
            //                 "@ondc/org/contact_details_consumer_care": "Ramesh,ramesh@abc.com,18004254444",
            //                 "tags": [
            //                     {
            //                         "code": "type",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "item"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "custom_group",
            //                         "list": [
            //                             {
            //                                 "code": "id",
            //                                 "value": "CG1"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "veg_nonveg",
            //                         "list": [
            //                             {
            //                                 "code": "veg",
            //                                 "value": "yes"
            //                             }
            //                         ]
            //                     }
            //                 ]
            //             },
            //             "customisations": [
            //                 {
            //                     "item_details": {
            //                         "id": "C1",
            //                         "descriptor": {
            //                             "name": "New Hand Tossed",
            //                             "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                             "short_desc": "New Hand Tossed",
            //                             "long_desc": "New Hand Tossed",
            //                             "images": [
            //                                 "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                             ]
            //                         },
            //                         "quantity": {
            //                             "unitized": {
            //                                 "measure": {
            //                                     "unit": "unit",
            //                                     "value": "1"
            //                                 }
            //                             },
            //                             "available": {
            //                                 "count": "99"
            //                             },
            //                             "maximum": {
            //                                 "count": "99"
            //                             }
            //                         },
            //                         "price": {
            //                             "currency": "INR",
            //                             "value": 0,
            //                             "maximum_value": "0.0"
            //                         },
            //                         "category_id": "F&B",
            //                         "related": true,
            //                         "tags": [
            //                             {
            //                                 "code": "type",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "customization"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "parent",
            //                                 "list": [
            //                                     {
            //                                         "code": "id",
            //                                         "value": "CG1"
            //                                     },
            //                                     {
            //                                         "code": "default",
            //                                         "value": "yes"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "child",
            //                                 "list": [
            //                                     {
            //                                         "code": "id",
            //                                         "value": "CG2"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "veg_nonveg",
            //                                 "list": [
            //                                     {
            //                                         "code": "veg",
            //                                         "value": "yes"
            //                                     }
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "provider_details": {
            //                         "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
            //                         "time": {
            //                             "label": "enable",
            //                             "timestamp": "2024-10-28T06:22:18.629Z"
            //                         },
            //                         "descriptor": {
            //                             "name": "WITS ONDC TEST STORE",
            //                             "short_desc": "Wits Testing Store",
            //                             "long_desc": "Wits Testing Store",
            //                             "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                             "images": [
            //                                 "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                             ]
            //                         },
            //                         "@ondc/org/fssai_license_no": "12345678901234",
            //                         "ttl": "P1D",
            //                         "creds": [
            //                             {
            //                                 "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                                 "descriptor": {
            //                                     "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                                     "name": "Unique provider Id of seller app"
            //                                 },
            //                                 "url": "https://abcd.cdn.com/images/badge-img",
            //                                 "tags": [
            //                                     {
            //                                         "code": "verification",
            //                                         "list": [
            //                                             {
            //                                                 "code": "verify_url",
            //                                                 "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
            //                                             },
            //                                             {
            //                                                 "code": "valid_from",
            //                                                 "value": "2023-06-03T00:00:00:000Z"
            //                                             }
            //                                         ]
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "tags": [
            //                             {
            //                                 "code": "catalog_link",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "inline"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Order"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "0000"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2359"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Self-Pickup"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "1000"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2200"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Delivery"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "1100"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2200"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "serviceability",
            //                                 "list": [
            //                                     {
            //                                         "code": "location",
            //                                         "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
            //                                     },
            //                                     {
            //                                         "code": "category",
            //                                         "value": "F&B"
            //                                     },
            //                                     {
            //                                         "code": "type",
            //                                         "value": "11"
            //                                     },
            //                                     {
            //                                         "code": "val",
            //                                         "value": "110001-110049, 110055"
            //                                     },
            //                                     {
            //                                         "code": "unit",
            //                                         "value": "pincode"
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "local_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "location_details": {
            //                         "min_time_to_ship": 0,
            //                         "max_time_to_ship": 0,
            //                         "average_time_to_ship": 0,
            //                         "median_time_to_ship": 0
            //                     },
            //                     "context": {
            //                         "domain": "ONDC:RET11",
            //                         "action": "on_search",
            //                         "country": "IND",
            //                         "city": "std:011",
            //                         "core_version": "1.2.0",
            //                         "bap_id": "ondcpreprod.nazarasdk.com",
            //                         "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
            //                         "transaction_id": "bb90bd16-0cf6-4485-b149-2f3a92caaaea",
            //                         "message_id": "1a9ba0de-7af7-44e8-9ea0-3e79ad1674a5",
            //                         "timestamp": "2024-10-28T08:37:30.226Z",
            //                         "ttl": "PT30S",
            //                         "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
            //                         "bpp_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "bpp_details": {
            //                         "name": "WITS ONDC TEST STORE",
            //                         "short_desc": "Wits Testing Store",
            //                         "long_desc": "Wits Testing Store",
            //                         "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                         "images": [
            //                             "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                         ],
            //                         "tags": [
            //                             {
            //                                 "code": "bpp_terms",
            //                                 "list": [
            //                                     {
            //                                         "code": "np_type",
            //                                         "value": "MSN"
            //                                     },
            //                                     {
            //                                         "code": "accept_bap_terms",
            //                                         "value": "Y"
            //                                     },
            //                                     {
            //                                         "code": "collect_payment",
            //                                         "value": "Y"
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "bpp_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "attribute_key_values": [],
            //                     "type": "customization",
            //                     "created_at": "2024-10-28T08:37:33.472774",
            //                     "local_id": "C1",
            //                     "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_C1",
            //                     "fulfillment": [
            //                         {
            //                             "id": "c461a827-f43d-487e-871d-e13467acd866",
            //                             "type": "Delivery",
            //                             "contact": {
            //                                 "phone": "9876543210",
            //                                 "email": "mayur.popli@gmail.com"
            //                             }
            //                         },
            //                         {
            //                             "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
            //                             "type": "Self-Pickup",
            //                             "contact": {
            //                                 "phone": "9876543210",
            //                                 "email": "mayur.popli@gmail.com"
            //                             }
            //                         }
            //                     ],
            //                     "is_first": true,
            //                     "customisation_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG1",
            //                     "customisation_nested_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG2",
            //                     "customisation_menus": [],
            //                     "language": "en",
            //                     "auto_item_flag": false,
            //                     "item_error_tags": [],
            //                     "auto_provider_flag": false,
            //                     "provider_error_tags": [],
            //                     "auto_seller_flag": false,
            //                     "seller_error_tags": [],
            //                     "item_flag": false,
            //                     "seller_flag": false,
            //                     "provider_flag": false,
            //                     "in_stock": true,
            //                     "location_availabilities": [],
            //                     "quantity": {
            //                         "count": 2
            //                     }
            //                 },
            //                 {
            //                     "item_details": {
            //                         "id": "C3",
            //                         "descriptor": {
            //                             "name": "Regular",
            //                             "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                             "short_desc": "Regular Size",
            //                             "long_desc": "Regular Size Pizza",
            //                             "images": [
            //                                 "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                             ]
            //                         },
            //                         "time": {
            //                             "label": "enable",
            //                             "timestamp": "2024-10-28T06:22:18.629Z"
            //                         },
            //                         "quantity": {
            //                             "available": {
            //                                 "count": "99"
            //                             },
            //                             "maximum": {
            //                                 "count": "99"
            //                             }
            //                         },
            //                         "price": {
            //                             "currency": "INR",
            //                             "value": 0,
            //                             "maximum_value": "0.0"
            //                         },
            //                         "category_id": "F&B",
            //                         "related": true,
            //                         "tags": [
            //                             {
            //                                 "code": "type",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "customization"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "parent",
            //                                 "list": [
            //                                     {
            //                                         "code": "id",
            //                                         "value": "CG2"
            //                                     },
            //                                     {
            //                                         "code": "default",
            //                                         "value": "yes"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "child",
            //                                 "list": [
            //                                     {
            //                                         "code": "id",
            //                                         "value": "CG4"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "veg_nonveg",
            //                                 "list": [
            //                                     {
            //                                         "code": "veg",
            //                                         "value": "yes"
            //                                     }
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "provider_details": {
            //                         "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
            //                         "time": {
            //                             "label": "enable",
            //                             "timestamp": "2024-10-28T06:22:18.629Z"
            //                         },
            //                         "descriptor": {
            //                             "name": "WITS ONDC TEST STORE",
            //                             "short_desc": "Wits Testing Store",
            //                             "long_desc": "Wits Testing Store",
            //                             "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                             "images": [
            //                                 "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                             ]
            //                         },
            //                         "@ondc/org/fssai_license_no": "12345678901234",
            //                         "ttl": "P1D",
            //                         "creds": [
            //                             {
            //                                 "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                                 "descriptor": {
            //                                     "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                                     "name": "Unique provider Id of seller app"
            //                                 },
            //                                 "url": "https://abcd.cdn.com/images/badge-img",
            //                                 "tags": [
            //                                     {
            //                                         "code": "verification",
            //                                         "list": [
            //                                             {
            //                                                 "code": "verify_url",
            //                                                 "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
            //                                             },
            //                                             {
            //                                                 "code": "valid_from",
            //                                                 "value": "2023-06-03T00:00:00:000Z"
            //                                             }
            //                                         ]
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "tags": [
            //                             {
            //                                 "code": "catalog_link",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "inline"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Order"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "0000"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2359"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Self-Pickup"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "1000"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2200"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Delivery"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "1100"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2200"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "serviceability",
            //                                 "list": [
            //                                     {
            //                                         "code": "location",
            //                                         "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
            //                                     },
            //                                     {
            //                                         "code": "category",
            //                                         "value": "F&B"
            //                                     },
            //                                     {
            //                                         "code": "type",
            //                                         "value": "11"
            //                                     },
            //                                     {
            //                                         "code": "val",
            //                                         "value": "110001-110049, 110055"
            //                                     },
            //                                     {
            //                                         "code": "unit",
            //                                         "value": "pincode"
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "local_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "location_details": {
            //                         "min_time_to_ship": 0,
            //                         "max_time_to_ship": 0,
            //                         "average_time_to_ship": 0,
            //                         "median_time_to_ship": 0
            //                     },
            //                     "context": {
            //                         "domain": "ONDC:RET11",
            //                         "action": "on_search",
            //                         "country": "IND",
            //                         "city": "std:011",
            //                         "core_version": "1.2.0",
            //                         "bap_id": "ondcpreprod.nazarasdk.com",
            //                         "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
            //                         "transaction_id": "bb90bd16-0cf6-4485-b149-2f3a92caaaea",
            //                         "message_id": "1a9ba0de-7af7-44e8-9ea0-3e79ad1674a5",
            //                         "timestamp": "2024-10-28T08:37:30.226Z",
            //                         "ttl": "PT30S",
            //                         "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
            //                         "bpp_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "bpp_details": {
            //                         "name": "WITS ONDC TEST STORE",
            //                         "short_desc": "Wits Testing Store",
            //                         "long_desc": "Wits Testing Store",
            //                         "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                         "images": [
            //                             "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                         ],
            //                         "tags": [
            //                             {
            //                                 "code": "bpp_terms",
            //                                 "list": [
            //                                     {
            //                                         "code": "np_type",
            //                                         "value": "MSN"
            //                                     },
            //                                     {
            //                                         "code": "accept_bap_terms",
            //                                         "value": "Y"
            //                                     },
            //                                     {
            //                                         "code": "collect_payment",
            //                                         "value": "Y"
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "bpp_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "attribute_key_values": [],
            //                     "type": "customization",
            //                     "created_at": "2024-10-28T08:37:33.472775",
            //                     "local_id": "C3",
            //                     "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_C3",
            //                     "fulfillment": [
            //                         {
            //                             "id": "c461a827-f43d-487e-871d-e13467acd866",
            //                             "type": "Delivery",
            //                             "contact": {
            //                                 "phone": "9876543210",
            //                                 "email": "mayur.popli@gmail.com"
            //                             }
            //                         },
            //                         {
            //                             "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
            //                             "type": "Self-Pickup",
            //                             "contact": {
            //                                 "phone": "9876543210",
            //                                 "email": "mayur.popli@gmail.com"
            //                             }
            //                         }
            //                     ],
            //                     "is_first": true,
            //                     "customisation_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG2",
            //                     "customisation_nested_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG4",
            //                     "customisation_menus": [],
            //                     "language": "en",
            //                     "auto_item_flag": false,
            //                     "item_error_tags": [],
            //                     "auto_provider_flag": false,
            //                     "provider_error_tags": [],
            //                     "auto_seller_flag": false,
            //                     "seller_error_tags": [],
            //                     "item_flag": false,
            //                     "seller_flag": false,
            //                     "provider_flag": false,
            //                     "in_stock": true,
            //                     "location_availabilities": [],
            //                     "quantity": {
            //                         "count": 2
            //                     }
            //                 },
            //                 {
            //                     "item_details": {
            //                         "id": "C8",
            //                         "descriptor": {
            //                             "name": "Grilled Mushrooms",
            //                             "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                             "short_desc": "Grilled Mushrooms",
            //                             "long_desc": "Grilled Mushrooms Pizza",
            //                             "images": [
            //                                 "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                             ]
            //                         },
            //                         "quantity": {
            //                             "available": {
            //                                 "count": "99"
            //                             },
            //                             "maximum": {
            //                                 "count": "99"
            //                             }
            //                         },
            //                         "price": {
            //                             "currency": "INR",
            //                             "value": 35,
            //                             "maximum_value": "35.0"
            //                         },
            //                         "category_id": "F&B",
            //                         "related": true,
            //                         "tags": [
            //                             {
            //                                 "code": "type",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "customization"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "parent",
            //                                 "list": [
            //                                     {
            //                                         "code": "id",
            //                                         "value": "CG4"
            //                                     },
            //                                     {
            //                                         "code": "default",
            //                                         "value": "yes"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "veg_nonveg",
            //                                 "list": [
            //                                     {
            //                                         "code": "veg",
            //                                         "value": "yes"
            //                                     }
            //                                 ]
            //                             }
            //                         ]
            //                     },
            //                     "provider_details": {
            //                         "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
            //                         "time": {
            //                             "label": "enable",
            //                             "timestamp": "2024-10-28T06:22:18.629Z"
            //                         },
            //                         "descriptor": {
            //                             "name": "WITS ONDC TEST STORE",
            //                             "short_desc": "Wits Testing Store",
            //                             "long_desc": "Wits Testing Store",
            //                             "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                             "images": [
            //                                 "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                             ]
            //                         },
            //                         "@ondc/org/fssai_license_no": "12345678901234",
            //                         "ttl": "P1D",
            //                         "creds": [
            //                             {
            //                                 "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                                 "descriptor": {
            //                                     "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
            //                                     "name": "Unique provider Id of seller app"
            //                                 },
            //                                 "url": "https://abcd.cdn.com/images/badge-img",
            //                                 "tags": [
            //                                     {
            //                                         "code": "verification",
            //                                         "list": [
            //                                             {
            //                                                 "code": "verify_url",
            //                                                 "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
            //                                             },
            //                                             {
            //                                                 "code": "valid_from",
            //                                                 "value": "2023-06-03T00:00:00:000Z"
            //                                             }
            //                                         ]
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "tags": [
            //                             {
            //                                 "code": "catalog_link",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "inline"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Order"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "0000"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2359"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Self-Pickup"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "1000"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2200"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "timing",
            //                                 "list": [
            //                                     {
            //                                         "code": "type",
            //                                         "value": "Delivery"
            //                                     },
            //                                     {
            //                                         "code": "location",
            //                                         "value": "17322246-fef4-4509-be90-79948403e1c1"
            //                                     },
            //                                     {
            //                                         "code": "day_from",
            //                                         "value": "1"
            //                                     },
            //                                     {
            //                                         "code": "day_to",
            //                                         "value": "7"
            //                                     },
            //                                     {
            //                                         "code": "time_from",
            //                                         "value": "1100"
            //                                     },
            //                                     {
            //                                         "code": "time_to",
            //                                         "value": "2200"
            //                                     }
            //                                 ]
            //                             },
            //                             {
            //                                 "code": "serviceability",
            //                                 "list": [
            //                                     {
            //                                         "code": "location",
            //                                         "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
            //                                     },
            //                                     {
            //                                         "code": "category",
            //                                         "value": "F&B"
            //                                     },
            //                                     {
            //                                         "code": "type",
            //                                         "value": "11"
            //                                     },
            //                                     {
            //                                         "code": "val",
            //                                         "value": "110001-110049, 110055"
            //                                     },
            //                                     {
            //                                         "code": "unit",
            //                                         "value": "pincode"
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "local_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "location_details": {
            //                         "min_time_to_ship": 0,
            //                         "max_time_to_ship": 0,
            //                         "average_time_to_ship": 0,
            //                         "median_time_to_ship": 0
            //                     },
            //                     "context": {
            //                         "domain": "ONDC:RET11",
            //                         "action": "on_search",
            //                         "country": "IND",
            //                         "city": "std:011",
            //                         "core_version": "1.2.0",
            //                         "bap_id": "ondcpreprod.nazarasdk.com",
            //                         "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
            //                         "transaction_id": "bb90bd16-0cf6-4485-b149-2f3a92caaaea",
            //                         "message_id": "1a9ba0de-7af7-44e8-9ea0-3e79ad1674a5",
            //                         "timestamp": "2024-10-28T08:37:30.226Z",
            //                         "ttl": "PT30S",
            //                         "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
            //                         "bpp_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "bpp_details": {
            //                         "name": "WITS ONDC TEST STORE",
            //                         "short_desc": "Wits Testing Store",
            //                         "long_desc": "Wits Testing Store",
            //                         "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
            //                         "images": [
            //                             "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
            //                         ],
            //                         "tags": [
            //                             {
            //                                 "code": "bpp_terms",
            //                                 "list": [
            //                                     {
            //                                         "code": "np_type",
            //                                         "value": "MSN"
            //                                     },
            //                                     {
            //                                         "code": "accept_bap_terms",
            //                                         "value": "Y"
            //                                     },
            //                                     {
            //                                         "code": "collect_payment",
            //                                         "value": "Y"
            //                                     }
            //                                 ]
            //                             }
            //                         ],
            //                         "bpp_id": "pramaan.ondc.org/alpha/mock-server"
            //                     },
            //                     "attribute_key_values": [],
            //                     "type": "customization",
            //                     "created_at": "2024-10-28T08:37:33.472775",
            //                     "local_id": "C8",
            //                     "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_C8",
            //                     "fulfillment": [
            //                         {
            //                             "id": "c461a827-f43d-487e-871d-e13467acd866",
            //                             "type": "Delivery",
            //                             "contact": {
            //                                 "phone": "9876543210",
            //                                 "email": "mayur.popli@gmail.com"
            //                             }
            //                         },
            //                         {
            //                             "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
            //                             "type": "Self-Pickup",
            //                             "contact": {
            //                                 "phone": "9876543210",
            //                                 "email": "mayur.popli@gmail.com"
            //                             }
            //                         }
            //                     ],
            //                     "is_first": true,
            //                     "customisation_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG4",
            //                     "customisation_nested_group_id": null,
            //                     "customisation_menus": [],
            //                     "language": "en",
            //                     "auto_item_flag": false,
            //                     "item_error_tags": [],
            //                     "auto_provider_flag": false,
            //                     "provider_error_tags": [],
            //                     "auto_seller_flag": false,
            //                     "seller_error_tags": [],
            //                     "item_flag": false,
            //                     "seller_flag": false,
            //                     "provider_flag": false,
            //                     "in_stock": true,
            //                     "location_availabilities": [],
            //                     "quantity": {
            //                         "count": 2
            //                     }
            //                 }
            //             ],
            //             "hasCustomisations": true,
            //             "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1",
            //             "itemId": "6729f3d212e6dbc687fb28a7"
            //         },
            //         "createdAt": "2024-11-05T10:30:42.567Z",
            //         "updatedAt": "2024-11-06T10:51:49.099Z",
            //         "__v": 0
            //     },
            //     {
            //         "_id": "672cbb7812e6dbc687fb2c2f",
            //         "cart": "6729f3d212e6dbc687fb28a5",
            //         "item": {
            //             "id": "b-ondc-seller-bpp.nlincs.in_ONDC:RET11_21319_121",
            //             "local_id": "121",
            //             "bpp_id": "b-ondc-seller-bpp.nlincs.in",
            //             "bpp_uri": "https://b-ondc-seller-bpp.nlincs.in/bpp",
            //             "domain": "ONDC:RET11",
            //             "tags": [
            //                 {
            //                     "code": "origin",
            //                     "list": [
            //                         {
            //                             "code": "country",
            //                             "value": "IND"
            //                         }
            //                     ]
            //                 },
            //                 {
            //                     "code": "veg_nonveg",
            //                     "list": [
            //                         {
            //                             "code": "veg",
            //                             "value": "yes"
            //                         }
            //                     ]
            //                 }
            //             ],
            //             "contextCity": "std:080",
            //             "quantity": {
            //                 "count": 1
            //             },
            //             "provider": {
            //                 "id": "b-ondc-seller-bpp.nlincs.in_ONDC:RET11_21319",
            //                 "locations": [
            //                     {
            //                         "id": "b-ondc-seller-bpp.nlincs.in_ONDC:RET11_21319_LOC560041",
            //                         "time": {
            //                             "label": "enable",
            //                             "timestamp": "2024-10-10T06:38:12.491Z",
            //                             "days": "1,2,3,4,5,6",
            //                             "schedule": {
            //                                 "holidays": [
            //                                     " "
            //                                 ]
            //                             },
            //                             "range": {
            //                                 "start": "1500",
            //                                 "end": "2200"
            //                             }
            //                         },
            //                         "gps": "12.9244592,77.593673",
            //                         "address": {
            //                             "locality": "1148,26th Main rd",
            //                             "street": "Sanjay Gandhi hospital, 4th Block East",
            //                             "city": "Bengaluru",
            //                             "area_code": "560041",
            //                             "state": "Karnataka"
            //                         },
            //                         "local_id": "LOC560041",
            //                         "min_time_to_ship": 259200,
            //                         "max_time_to_ship": 259200,
            //                         "average_time_to_ship": 259200,
            //                         "median_time_to_ship": 259200,
            //                         "type": "pan"
            //                     }
            //                 ],
            //                 "time": {
            //                     "label": "enable",
            //                     "timestamp": "2024-10-10T06:38:12.491Z"
            //                 },
            //                 "descriptor": {
            //                     "name": "Cream n Nudge",
            //                     "short_desc": "Cream n Nudge",
            //                     "long_desc": "21319 - Cream n Nudge",
            //                     "symbol": "https://nstore-static-data-s3.s3.ap-south-1.amazonaws.com/Logo/dummy_bill_image.png",
            //                     "images": [
            //                         "https://nstore-static-data-s3.s3.ap-south-1.amazonaws.com/Logo/dummy_bill_image.png"
            //                     ]
            //                 },
            //                 "creds": [],
            //                 "tags": [
            //                     {
            //                         "code": "catalog_link",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "inline"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "timing",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "Order"
            //                             },
            //                             {
            //                                 "code": "location",
            //                                 "value": "LOC560041"
            //                             },
            //                             {
            //                                 "code": "day_from",
            //                                 "value": "1"
            //                             },
            //                             {
            //                                 "code": "day_to",
            //                                 "value": "6"
            //                             },
            //                             {
            //                                 "code": "time_from",
            //                                 "value": "1500"
            //                             },
            //                             {
            //                                 "code": "time_to",
            //                                 "value": "2200"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "timing",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "Delivery"
            //                             },
            //                             {
            //                                 "code": "location",
            //                                 "value": "LOC560041"
            //                             },
            //                             {
            //                                 "code": "day_from",
            //                                 "value": "1"
            //                             },
            //                             {
            //                                 "code": "day_to",
            //                                 "value": "6"
            //                             },
            //                             {
            //                                 "code": "time_from",
            //                                 "value": "1500"
            //                             },
            //                             {
            //                                 "code": "time_to",
            //                                 "value": "2200"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "timing",
            //                         "list": [
            //                             {
            //                                 "code": "type",
            //                                 "value": "Self-Pickup"
            //                             },
            //                             {
            //                                 "code": "location",
            //                                 "value": "LOC560041"
            //                             },
            //                             {
            //                                 "code": "day_from",
            //                                 "value": "1"
            //                             },
            //                             {
            //                                 "code": "day_to",
            //                                 "value": "6"
            //                             },
            //                             {
            //                                 "code": "time_from",
            //                                 "value": "1500"
            //                             },
            //                             {
            //                                 "code": "time_to",
            //                                 "value": "2200"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "serviceability",
            //                         "list": [
            //                             {
            //                                 "code": "location",
            //                                 "value": "LOC560041"
            //                             },
            //                             {
            //                                 "code": "category",
            //                                 "value": "F&B"
            //                             },
            //                             {
            //                                 "code": "type",
            //                                 "value": "12"
            //                             },
            //                             {
            //                                 "code": "val",
            //                                 "value": "IND"
            //                             },
            //                             {
            //                                 "code": "unit",
            //                                 "value": "country"
            //                             }
            //                         ]
            //                     }
            //                 ],
            //                 "ttl": "P1D",
            //                 "@ondc/org/fssai_license_no": "15496378496469",
            //                 "local_id": "21319"
            //             },
            //             "product": {
            //                 "id": "121",
            //                 "subtotal": 70,
            //                 "time": {
            //                     "label": "enable",
            //                     "timestamp": "2024-10-10T06:38:12.491Z"
            //                 },
            //                 "parent_item_id": "",
            //                 "descriptor": {
            //                     "name": "Corn Pizza",
            //                     "short_desc": "Corn Pizza",
            //                     "long_desc": "Corn Pizza",
            //                     "symbol": "https://nstoreassets.s3.amazonaws.com/21729_B/121.jpg",
            //                     "images": [
            //                         "https://nstoreassets.s3.amazonaws.com/21729_B/121.jpg",
            //                         "https://nstore-static-data-s3.s3.ap-south-1.amazonaws.com/Logo/tmp_product_image.jpeg"
            //                     ]
            //                 },
            //                 "quantity": {
            //                     "unitized": {
            //                         "measure": {
            //                             "unit": "each",
            //                             "value": "0"
            //                         }
            //                     },
            //                     "available": {
            //                         "count": "99"
            //                     },
            //                     "maximum": {
            //                         "count": "99"
            //                     }
            //                 },
            //                 "price": {
            //                     "currency": "INR",
            //                     "value": 70,
            //                     "maximum_value": "70.00"
            //                 },
            //                 "category_id": "F&B",
            //                 "fulfillment_id": "F1",
            //                 "location_id": "LOC560041",
            //                 "@ondc/org/returnable": false,
            //                 "@ondc/org/cancellable": false,
            //                 "@ondc/org/seller_pickup_return": false,
            //                 "@ondc/org/time_to_ship": "PT72H",
            //                 "@ondc/org/available_on_cod": false,
            //                 "@ondc/org/contact_details_consumer_care": "Cream n Nudge,hariprasa49@gmail.com,5716434997",
            //                 "tags": [
            //                     {
            //                         "code": "origin",
            //                         "list": [
            //                             {
            //                                 "code": "country",
            //                                 "value": "IND"
            //                             }
            //                         ]
            //                     },
            //                     {
            //                         "code": "veg_nonveg",
            //                         "list": [
            //                             {
            //                                 "code": "veg",
            //                                 "value": "yes"
            //                             }
            //                         ]
            //                     }
            //                 ]
            //             },
            //             "customisations": null,
            //             "hasCustomisations": false,
            //             "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1"
            //         },
            //         "createdAt": "2024-11-07T13:07:04.473Z",
            //         "updatedAt": "2024-11-07T13:07:04.473Z",
            //         "__v": 0
            //     }
            // ]
            //   dispatch(setCartList(res));
        // }).finally();
        //   setAddToCartLoading(false);
        let res = [
            {
                "_id": "6729f3d212e6dbc687fb28a7",
                "cart": "6729f3d212e6dbc687fb28a5",
                "item": {
                    "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_68ae0d64-a8a7-412a-a359-007ffac25eaa",
                    "local_id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                    "bpp_id": "pramaan.ondc.org/alpha/mock-server",
                    "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
                    "domain": "ONDC:RET11",
                    "tags": [
                        {
                            "code": "type",
                            "list": [
                                {
                                    "code": "type",
                                    "value": "item"
                                }
                            ]
                        },
                        {
                            "code": "custom_group",
                            "list": [
                                {
                                    "code": "id",
                                    "value": "CG1"
                                }
                            ]
                        },
                        {
                            "code": "veg_nonveg",
                            "list": [
                                {
                                    "code": "veg",
                                    "value": "yes"
                                }
                            ]
                        }
                    ],
                    "customisationState": {
                        "firstGroup": {
                            "id": "CG1",
                            "name": "Crust",
                            "inputType": "select",
                            "minQuantity": 1,
                            "maxQuantity": 1,
                            "seq": 1
                        },
                        "CG1": {
                            "id": "CG1",
                            "name": "Crust",
                            "seq": 1,
                            "options": [
                                {
                                    "id": "C1",
                                    "name": "New Hand Tossed",
                                    "price": 0,
                                    "inStock": true,
                                    "parent": "CG1",
                                    "child": "CG2",
                                    "childs": [
                                        "CG2"
                                    ],
                                    "isDefault": true,
                                    "vegNonVeg": "veg"
                                }
                            ],
                            "selected": [
                                {
                                    "id": "C1",
                                    "name": "New Hand Tossed",
                                    "price": 0,
                                    "inStock": true,
                                    "parent": "CG1",
                                    "child": "CG2",
                                    "childs": [
                                        "CG2"
                                    ],
                                    "isDefault": true,
                                    "vegNonVeg": "veg"
                                }
                            ],
                            "childs": [
                                "CG2"
                            ],
                            "isMandatory": true,
                            "type": "Radio"
                        },
                        "CG2": {
                            "id": "CG2",
                            "name": "Size",
                            "seq": 2,
                            "options": [
                                {
                                    "id": "C3",
                                    "name": "Regular",
                                    "price": 0,
                                    "inStock": true,
                                    "parent": "CG2",
                                    "child": "CG4",
                                    "childs": [
                                        "CG4"
                                    ],
                                    "isDefault": true,
                                    "vegNonVeg": "veg"
                                }
                            ],
                            "selected": [
                                {
                                    "id": "C3",
                                    "name": "Regular",
                                    "price": 0,
                                    "inStock": true,
                                    "parent": "CG2",
                                    "child": "CG4",
                                    "childs": [
                                        "CG4"
                                    ],
                                    "isDefault": true,
                                    "vegNonVeg": "veg"
                                }
                            ],
                            "childs": [
                                "CG4"
                            ],
                            "isMandatory": true,
                            "type": "Radio"
                        },
                        "CG4": {
                            "id": "CG4",
                            "name": "Toppings",
                            "seq": 3,
                            "options": [
                                {
                                    "id": "C8",
                                    "name": "Grilled Mushrooms",
                                    "price": 35,
                                    "inStock": true,
                                    "parent": "CG4",
                                    "child": null,
                                    "childs": null,
                                    "isDefault": true,
                                    "vegNonVeg": "veg"
                                }
                            ],
                            "selected": [
                                {
                                    "id": "C8",
                                    "name": "Grilled Mushrooms",
                                    "price": 35,
                                    "inStock": true,
                                    "parent": "CG4",
                                    "child": null,
                                    "childs": null,
                                    "isDefault": true,
                                    "vegNonVeg": "veg"
                                }
                            ],
                            "childs": [],
                            "isMandatory": true,
                            "type": "Radio"
                        }
                    },
                    "contextCity": "std:011",
                    "quantity": {
                        "count": 2
                    },
                    "provider": {
                        "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
                        "locations": [
                            {
                                "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
                                "gps": "28.553440, 77.214241",
                                "address": {
                                    "street": "7/6, August Kranti Marg",
                                    "locality": "Siri Fort Institutional Area, Siri Fort",
                                    "city": "New Delhi",
                                    "state": "Delhi",
                                    "area_code": "110049"
                                },
                                "circle": {
                                    "gps": "28.553440, 77.214241",
                                    "radius": {
                                        "unit": "km",
                                        "value": "10"
                                    }
                                },
                                "time": {
                                    "label": "enable",
                                    "timestamp": "2024-10-28T06:22:18.630Z",
                                    "days": "1,2,3,4,5,6,7",
                                    "schedule": {
                                        "holidays": [],
                                        "frequency": "PT4H",
                                        "times": [
                                            "1100",
                                            "1900"
                                        ]
                                    },
                                    "range": {
                                        "start": "0000",
                                        "end": "2359"
                                    }
                                },
                                "local_id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
                                "min_time_to_ship": 900,
                                "max_time_to_ship": 2700,
                                "average_time_to_ship": 1350,
                                "median_time_to_ship": 900,
                                "type": "pan"
                            }
                        ],
                        "time": {
                            "label": "enable",
                            "timestamp": "2024-10-28T06:22:18.629Z"
                        },
                        "descriptor": {
                            "name": "WITS ONDC TEST STORE",
                            "short_desc": "Wits Testing Store",
                            "long_desc": "Wits Testing Store",
                            "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                            "images": [
                                "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                            ]
                        },
                        "@ondc/org/fssai_license_no": "12345678901234",
                        "ttl": "P1D",
                        "creds": [
                            {
                                "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                "descriptor": {
                                    "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                    "name": "Unique provider Id of seller app"
                                },
                                "url": "https://abcd.cdn.com/images/badge-img",
                                "tags": [
                                    {
                                        "code": "verification",
                                        "list": [
                                            {
                                                "code": "verify_url",
                                                "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
                                            },
                                            {
                                                "code": "valid_from",
                                                "value": "2023-06-03T00:00:00:000Z"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "tags": [
                            {
                                "code": "catalog_link",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "inline"
                                    }
                                ]
                            },
                            {
                                "code": "timing",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "Order"
                                    },
                                    {
                                        "code": "location",
                                        "value": "17322246-fef4-4509-be90-79948403e1c1"
                                    },
                                    {
                                        "code": "day_from",
                                        "value": "1"
                                    },
                                    {
                                        "code": "day_to",
                                        "value": "7"
                                    },
                                    {
                                        "code": "time_from",
                                        "value": "0000"
                                    },
                                    {
                                        "code": "time_to",
                                        "value": "2359"
                                    }
                                ]
                            },
                            {
                                "code": "timing",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "Self-Pickup"
                                    },
                                    {
                                        "code": "location",
                                        "value": "17322246-fef4-4509-be90-79948403e1c1"
                                    },
                                    {
                                        "code": "day_from",
                                        "value": "1"
                                    },
                                    {
                                        "code": "day_to",
                                        "value": "7"
                                    },
                                    {
                                        "code": "time_from",
                                        "value": "1000"
                                    },
                                    {
                                        "code": "time_to",
                                        "value": "2200"
                                    }
                                ]
                            },
                            {
                                "code": "timing",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "Delivery"
                                    },
                                    {
                                        "code": "location",
                                        "value": "17322246-fef4-4509-be90-79948403e1c1"
                                    },
                                    {
                                        "code": "day_from",
                                        "value": "1"
                                    },
                                    {
                                        "code": "day_to",
                                        "value": "7"
                                    },
                                    {
                                        "code": "time_from",
                                        "value": "1100"
                                    },
                                    {
                                        "code": "time_to",
                                        "value": "2200"
                                    }
                                ]
                            },
                            {
                                "code": "serviceability",
                                "list": [
                                    {
                                        "code": "location",
                                        "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
                                    },
                                    {
                                        "code": "category",
                                        "value": "F&B"
                                    },
                                    {
                                        "code": "type",
                                        "value": "11"
                                    },
                                    {
                                        "code": "val",
                                        "value": "110001-110049, 110055"
                                    },
                                    {
                                        "code": "unit",
                                        "value": "pincode"
                                    }
                                ]
                            }
                        ],
                        "local_id": "pramaan.ondc.org/alpha/mock-server"
                    },
                    "product": {
                        "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                        "subtotal": 269,
                        "time": {
                            "label": "enable",
                            "timestamp": "2024-10-28T06:22:18.629Z"
                        },
                        "descriptor": {
                            "name": "Farm House Pizza",
                            "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                            "short_desc": "Farm House Pizza",
                            "long_desc": "Farm House Pizza",
                            "images": [
                                "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                            ]
                        },
                        "quantity": {
                            "unitized": {
                                "measure": {
                                    "unit": "unit",
                                    "value": "1"
                                }
                            },
                            "available": {
                                "count": "99"
                            },
                            "maximum": {
                                "count": "99"
                            }
                        },
                        "price": {
                            "currency": "INR",
                            "value": 269,
                            "maximum_value": "269.0"
                        },
                        "category_id": "F&B",
                        "category_ids": [
                            "rxpirYGWXh5r:3"
                        ],
                        "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "location_id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
                        "related": false,
                        "recommended": true,
                        "@ondc/org/returnable": false,
                        "@ondc/org/cancellable": true,
                        "@ondc/org/return_window": "PT1H",
                        "@ondc/org/seller_pickup_return": false,
                        "@ondc/org/time_to_ship": "PT45M",
                        "@ondc/org/available_on_cod": false,
                        "@ondc/org/contact_details_consumer_care": "Ramesh,ramesh@abc.com,18004254444",
                        "tags": [
                            {
                                "code": "type",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "item"
                                    }
                                ]
                            },
                            {
                                "code": "custom_group",
                                "list": [
                                    {
                                        "code": "id",
                                        "value": "CG1"
                                    }
                                ]
                            },
                            {
                                "code": "veg_nonveg",
                                "list": [
                                    {
                                        "code": "veg",
                                        "value": "yes"
                                    }
                                ]
                            }
                        ]
                    },
                    "customisations": [
                        {
                            "item_details": {
                                "id": "C1",
                                "descriptor": {
                                    "name": "New Hand Tossed",
                                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                    "short_desc": "New Hand Tossed",
                                    "long_desc": "New Hand Tossed",
                                    "images": [
                                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                    ]
                                },
                                "quantity": {
                                    "unitized": {
                                        "measure": {
                                            "unit": "unit",
                                            "value": "1"
                                        }
                                    },
                                    "available": {
                                        "count": "99"
                                    },
                                    "maximum": {
                                        "count": "99"
                                    }
                                },
                                "price": {
                                    "currency": "INR",
                                    "value": 0,
                                    "maximum_value": "0.0"
                                },
                                "category_id": "F&B",
                                "related": true,
                                "tags": [
                                    {
                                        "code": "type",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "customization"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "parent",
                                        "list": [
                                            {
                                                "code": "id",
                                                "value": "CG1"
                                            },
                                            {
                                                "code": "default",
                                                "value": "yes"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "child",
                                        "list": [
                                            {
                                                "code": "id",
                                                "value": "CG2"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "veg_nonveg",
                                        "list": [
                                            {
                                                "code": "veg",
                                                "value": "yes"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "provider_details": {
                                "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
                                "time": {
                                    "label": "enable",
                                    "timestamp": "2024-10-28T06:22:18.629Z"
                                },
                                "descriptor": {
                                    "name": "WITS ONDC TEST STORE",
                                    "short_desc": "Wits Testing Store",
                                    "long_desc": "Wits Testing Store",
                                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                    "images": [
                                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                    ]
                                },
                                "@ondc/org/fssai_license_no": "12345678901234",
                                "ttl": "P1D",
                                "creds": [
                                    {
                                        "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                        "descriptor": {
                                            "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                            "name": "Unique provider Id of seller app"
                                        },
                                        "url": "https://abcd.cdn.com/images/badge-img",
                                        "tags": [
                                            {
                                                "code": "verification",
                                                "list": [
                                                    {
                                                        "code": "verify_url",
                                                        "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
                                                    },
                                                    {
                                                        "code": "valid_from",
                                                        "value": "2023-06-03T00:00:00:000Z"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "tags": [
                                    {
                                        "code": "catalog_link",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "inline"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Order"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "0000"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2359"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Self-Pickup"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "1000"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2200"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Delivery"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "1100"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2200"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "serviceability",
                                        "list": [
                                            {
                                                "code": "location",
                                                "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
                                            },
                                            {
                                                "code": "category",
                                                "value": "F&B"
                                            },
                                            {
                                                "code": "type",
                                                "value": "11"
                                            },
                                            {
                                                "code": "val",
                                                "value": "110001-110049, 110055"
                                            },
                                            {
                                                "code": "unit",
                                                "value": "pincode"
                                            }
                                        ]
                                    }
                                ],
                                "local_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "location_details": {
                                "min_time_to_ship": 0,
                                "max_time_to_ship": 0,
                                "average_time_to_ship": 0,
                                "median_time_to_ship": 0
                            },
                            "context": {
                                "domain": "ONDC:RET11",
                                "action": "on_search",
                                "country": "IND",
                                "city": "std:011",
                                "core_version": "1.2.0",
                                "bap_id": "ondcpreprod.nazarasdk.com",
                                "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
                                "transaction_id": "bb90bd16-0cf6-4485-b149-2f3a92caaaea",
                                "message_id": "1a9ba0de-7af7-44e8-9ea0-3e79ad1674a5",
                                "timestamp": "2024-10-28T08:37:30.226Z",
                                "ttl": "PT30S",
                                "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
                                "bpp_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "bpp_details": {
                                "name": "WITS ONDC TEST STORE",
                                "short_desc": "Wits Testing Store",
                                "long_desc": "Wits Testing Store",
                                "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                "images": [
                                    "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                ],
                                "tags": [
                                    {
                                        "code": "bpp_terms",
                                        "list": [
                                            {
                                                "code": "np_type",
                                                "value": "MSN"
                                            },
                                            {
                                                "code": "accept_bap_terms",
                                                "value": "Y"
                                            },
                                            {
                                                "code": "collect_payment",
                                                "value": "Y"
                                            }
                                        ]
                                    }
                                ],
                                "bpp_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "attribute_key_values": [],
                            "type": "customization",
                            "created_at": "2024-10-28T08:37:33.472774",
                            "local_id": "C1",
                            "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_C1",
                            "fulfillment": [
                                {
                                    "id": "c461a827-f43d-487e-871d-e13467acd866",
                                    "type": "Delivery",
                                    "contact": {
                                        "phone": "9876543210",
                                        "email": "mayur.popli@gmail.com"
                                    }
                                },
                                {
                                    "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
                                    "type": "Self-Pickup",
                                    "contact": {
                                        "phone": "9876543210",
                                        "email": "mayur.popli@gmail.com"
                                    }
                                }
                            ],
                            "is_first": true,
                            "customisation_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG1",
                            "customisation_nested_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG2",
                            "customisation_menus": [],
                            "language": "en",
                            "auto_item_flag": false,
                            "item_error_tags": [],
                            "auto_provider_flag": false,
                            "provider_error_tags": [],
                            "auto_seller_flag": false,
                            "seller_error_tags": [],
                            "item_flag": false,
                            "seller_flag": false,
                            "provider_flag": false,
                            "in_stock": true,
                            "location_availabilities": [],
                            "quantity": {
                                "count": 2
                            }
                        },
                        {
                            "item_details": {
                                "id": "C3",
                                "descriptor": {
                                    "name": "Regular",
                                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                    "short_desc": "Regular Size",
                                    "long_desc": "Regular Size Pizza",
                                    "images": [
                                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                    ]
                                },
                                "time": {
                                    "label": "enable",
                                    "timestamp": "2024-10-28T06:22:18.629Z"
                                },
                                "quantity": {
                                    "available": {
                                        "count": "99"
                                    },
                                    "maximum": {
                                        "count": "99"
                                    }
                                },
                                "price": {
                                    "currency": "INR",
                                    "value": 0,
                                    "maximum_value": "0.0"
                                },
                                "category_id": "F&B",
                                "related": true,
                                "tags": [
                                    {
                                        "code": "type",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "customization"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "parent",
                                        "list": [
                                            {
                                                "code": "id",
                                                "value": "CG2"
                                            },
                                            {
                                                "code": "default",
                                                "value": "yes"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "child",
                                        "list": [
                                            {
                                                "code": "id",
                                                "value": "CG4"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "veg_nonveg",
                                        "list": [
                                            {
                                                "code": "veg",
                                                "value": "yes"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "provider_details": {
                                "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
                                "time": {
                                    "label": "enable",
                                    "timestamp": "2024-10-28T06:22:18.629Z"
                                },
                                "descriptor": {
                                    "name": "WITS ONDC TEST STORE",
                                    "short_desc": "Wits Testing Store",
                                    "long_desc": "Wits Testing Store",
                                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                    "images": [
                                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                    ]
                                },
                                "@ondc/org/fssai_license_no": "12345678901234",
                                "ttl": "P1D",
                                "creds": [
                                    {
                                        "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                        "descriptor": {
                                            "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                            "name": "Unique provider Id of seller app"
                                        },
                                        "url": "https://abcd.cdn.com/images/badge-img",
                                        "tags": [
                                            {
                                                "code": "verification",
                                                "list": [
                                                    {
                                                        "code": "verify_url",
                                                        "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
                                                    },
                                                    {
                                                        "code": "valid_from",
                                                        "value": "2023-06-03T00:00:00:000Z"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "tags": [
                                    {
                                        "code": "catalog_link",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "inline"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Order"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "0000"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2359"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Self-Pickup"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "1000"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2200"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Delivery"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "1100"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2200"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "serviceability",
                                        "list": [
                                            {
                                                "code": "location",
                                                "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
                                            },
                                            {
                                                "code": "category",
                                                "value": "F&B"
                                            },
                                            {
                                                "code": "type",
                                                "value": "11"
                                            },
                                            {
                                                "code": "val",
                                                "value": "110001-110049, 110055"
                                            },
                                            {
                                                "code": "unit",
                                                "value": "pincode"
                                            }
                                        ]
                                    }
                                ],
                                "local_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "location_details": {
                                "min_time_to_ship": 0,
                                "max_time_to_ship": 0,
                                "average_time_to_ship": 0,
                                "median_time_to_ship": 0
                            },
                            "context": {
                                "domain": "ONDC:RET11",
                                "action": "on_search",
                                "country": "IND",
                                "city": "std:011",
                                "core_version": "1.2.0",
                                "bap_id": "ondcpreprod.nazarasdk.com",
                                "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
                                "transaction_id": "bb90bd16-0cf6-4485-b149-2f3a92caaaea",
                                "message_id": "1a9ba0de-7af7-44e8-9ea0-3e79ad1674a5",
                                "timestamp": "2024-10-28T08:37:30.226Z",
                                "ttl": "PT30S",
                                "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
                                "bpp_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "bpp_details": {
                                "name": "WITS ONDC TEST STORE",
                                "short_desc": "Wits Testing Store",
                                "long_desc": "Wits Testing Store",
                                "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                "images": [
                                    "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                ],
                                "tags": [
                                    {
                                        "code": "bpp_terms",
                                        "list": [
                                            {
                                                "code": "np_type",
                                                "value": "MSN"
                                            },
                                            {
                                                "code": "accept_bap_terms",
                                                "value": "Y"
                                            },
                                            {
                                                "code": "collect_payment",
                                                "value": "Y"
                                            }
                                        ]
                                    }
                                ],
                                "bpp_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "attribute_key_values": [],
                            "type": "customization",
                            "created_at": "2024-10-28T08:37:33.472775",
                            "local_id": "C3",
                            "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_C3",
                            "fulfillment": [
                                {
                                    "id": "c461a827-f43d-487e-871d-e13467acd866",
                                    "type": "Delivery",
                                    "contact": {
                                        "phone": "9876543210",
                                        "email": "mayur.popli@gmail.com"
                                    }
                                },
                                {
                                    "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
                                    "type": "Self-Pickup",
                                    "contact": {
                                        "phone": "9876543210",
                                        "email": "mayur.popli@gmail.com"
                                    }
                                }
                            ],
                            "is_first": true,
                            "customisation_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG2",
                            "customisation_nested_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG4",
                            "customisation_menus": [],
                            "language": "en",
                            "auto_item_flag": false,
                            "item_error_tags": [],
                            "auto_provider_flag": false,
                            "provider_error_tags": [],
                            "auto_seller_flag": false,
                            "seller_error_tags": [],
                            "item_flag": false,
                            "seller_flag": false,
                            "provider_flag": false,
                            "in_stock": true,
                            "location_availabilities": [],
                            "quantity": {
                                "count": 2
                            }
                        },
                        {
                            "item_details": {
                                "id": "C8",
                                "descriptor": {
                                    "name": "Grilled Mushrooms",
                                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                    "short_desc": "Grilled Mushrooms",
                                    "long_desc": "Grilled Mushrooms Pizza",
                                    "images": [
                                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                    ]
                                },
                                "quantity": {
                                    "available": {
                                        "count": "99"
                                    },
                                    "maximum": {
                                        "count": "99"
                                    }
                                },
                                "price": {
                                    "currency": "INR",
                                    "value": 35,
                                    "maximum_value": "35.0"
                                },
                                "category_id": "F&B",
                                "related": true,
                                "tags": [
                                    {
                                        "code": "type",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "customization"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "parent",
                                        "list": [
                                            {
                                                "code": "id",
                                                "value": "CG4"
                                            },
                                            {
                                                "code": "default",
                                                "value": "yes"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "veg_nonveg",
                                        "list": [
                                            {
                                                "code": "veg",
                                                "value": "yes"
                                            }
                                        ]
                                    }
                                ]
                            },
                            "provider_details": {
                                "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server",
                                "time": {
                                    "label": "enable",
                                    "timestamp": "2024-10-28T06:22:18.629Z"
                                },
                                "descriptor": {
                                    "name": "WITS ONDC TEST STORE",
                                    "short_desc": "Wits Testing Store",
                                    "long_desc": "Wits Testing Store",
                                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                    "images": [
                                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                    ]
                                },
                                "@ondc/org/fssai_license_no": "12345678901234",
                                "ttl": "P1D",
                                "creds": [
                                    {
                                        "id": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                        "descriptor": {
                                            "code": "3497b50c-2dbd-4963-9bf8-1261ee84e313",
                                            "name": "Unique provider Id of seller app"
                                        },
                                        "url": "https://abcd.cdn.com/images/badge-img",
                                        "tags": [
                                            {
                                                "code": "verification",
                                                "list": [
                                                    {
                                                        "code": "verify_url",
                                                        "value": "https://abcd.dnb.com/verify?id=’ESG-12345678'"
                                                    },
                                                    {
                                                        "code": "valid_from",
                                                        "value": "2023-06-03T00:00:00:000Z"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ],
                                "tags": [
                                    {
                                        "code": "catalog_link",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "inline"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Order"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "0000"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2359"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Self-Pickup"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "1000"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2200"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "timing",
                                        "list": [
                                            {
                                                "code": "type",
                                                "value": "Delivery"
                                            },
                                            {
                                                "code": "location",
                                                "value": "17322246-fef4-4509-be90-79948403e1c1"
                                            },
                                            {
                                                "code": "day_from",
                                                "value": "1"
                                            },
                                            {
                                                "code": "day_to",
                                                "value": "7"
                                            },
                                            {
                                                "code": "time_from",
                                                "value": "1100"
                                            },
                                            {
                                                "code": "time_to",
                                                "value": "2200"
                                            }
                                        ]
                                    },
                                    {
                                        "code": "serviceability",
                                        "list": [
                                            {
                                                "code": "location",
                                                "value": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
                                            },
                                            {
                                                "code": "category",
                                                "value": "F&B"
                                            },
                                            {
                                                "code": "type",
                                                "value": "11"
                                            },
                                            {
                                                "code": "val",
                                                "value": "110001-110049, 110055"
                                            },
                                            {
                                                "code": "unit",
                                                "value": "pincode"
                                            }
                                        ]
                                    }
                                ],
                                "local_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "location_details": {
                                "min_time_to_ship": 0,
                                "max_time_to_ship": 0,
                                "average_time_to_ship": 0,
                                "median_time_to_ship": 0
                            },
                            "context": {
                                "domain": "ONDC:RET11",
                                "action": "on_search",
                                "country": "IND",
                                "city": "std:011",
                                "core_version": "1.2.0",
                                "bap_id": "ondcpreprod.nazarasdk.com",
                                "bap_uri": "https://ondcpreprod.nazarasdk.com/protocol/v1",
                                "transaction_id": "bb90bd16-0cf6-4485-b149-2f3a92caaaea",
                                "message_id": "1a9ba0de-7af7-44e8-9ea0-3e79ad1674a5",
                                "timestamp": "2024-10-28T08:37:30.226Z",
                                "ttl": "PT30S",
                                "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
                                "bpp_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "bpp_details": {
                                "name": "WITS ONDC TEST STORE",
                                "short_desc": "Wits Testing Store",
                                "long_desc": "Wits Testing Store",
                                "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                                "images": [
                                    "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                                ],
                                "tags": [
                                    {
                                        "code": "bpp_terms",
                                        "list": [
                                            {
                                                "code": "np_type",
                                                "value": "MSN"
                                            },
                                            {
                                                "code": "accept_bap_terms",
                                                "value": "Y"
                                            },
                                            {
                                                "code": "collect_payment",
                                                "value": "Y"
                                            }
                                        ]
                                    }
                                ],
                                "bpp_id": "pramaan.ondc.org/alpha/mock-server"
                            },
                            "attribute_key_values": [],
                            "type": "customization",
                            "created_at": "2024-10-28T08:37:33.472775",
                            "local_id": "C8",
                            "id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_C8",
                            "fulfillment": [
                                {
                                    "id": "c461a827-f43d-487e-871d-e13467acd866",
                                    "type": "Delivery",
                                    "contact": {
                                        "phone": "9876543210",
                                        "email": "mayur.popli@gmail.com"
                                    }
                                },
                                {
                                    "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
                                    "type": "Self-Pickup",
                                    "contact": {
                                        "phone": "9876543210",
                                        "email": "mayur.popli@gmail.com"
                                    }
                                }
                            ],
                            "is_first": true,
                            "customisation_group_id": "pramaan.ondc.org/alpha/mock-server_ONDC:RET11_pramaan.ondc.org/alpha/mock-server_CG4",
                            "customisation_nested_group_id": null,
                            "customisation_menus": [],
                            "language": "en",
                            "auto_item_flag": false,
                            "item_error_tags": [],
                            "auto_provider_flag": false,
                            "provider_error_tags": [],
                            "auto_seller_flag": false,
                            "seller_error_tags": [],
                            "item_flag": false,
                            "seller_flag": false,
                            "provider_flag": false,
                            "in_stock": true,
                            "location_availabilities": [],
                            "quantity": {
                                "count": 2
                            }
                        }
                    ],
                    "hasCustomisations": true,
                    "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1",
                    "itemId": "6729f3d212e6dbc687fb28a7"
                },
                "createdAt": "2024-11-05T10:30:42.567Z",
                "updatedAt": "2024-11-06T10:51:49.099Z",
                "__v": 0
            },
            {
                "_id": "672cbb7812e6dbc687fb2c2f",
                "cart": "6729f3d212e6dbc687fb28a5",
                "item": {
                    "id": "b-ondc-seller-bpp.nlincs.in_ONDC:RET11_21319_121",
                    "local_id": "121",
                    "bpp_id": "b-ondc-seller-bpp.nlincs.in",
                    "bpp_uri": "https://b-ondc-seller-bpp.nlincs.in/bpp",
                    "domain": "ONDC:RET11",
                    "tags": [
                        {
                            "code": "origin",
                            "list": [
                                {
                                    "code": "country",
                                    "value": "IND"
                                }
                            ]
                        },
                        {
                            "code": "veg_nonveg",
                            "list": [
                                {
                                    "code": "veg",
                                    "value": "yes"
                                }
                            ]
                        }
                    ],
                    "contextCity": "std:080",
                    "quantity": {
                        "count": 1
                    },
                    "provider": {
                        "id": "b-ondc-seller-bpp.nlincs.in_ONDC:RET11_21319",
                        "locations": [
                            {
                                "id": "b-ondc-seller-bpp.nlincs.in_ONDC:RET11_21319_LOC560041",
                                "time": {
                                    "label": "enable",
                                    "timestamp": "2024-10-10T06:38:12.491Z",
                                    "days": "1,2,3,4,5,6",
                                    "schedule": {
                                        "holidays": [
                                            " "
                                        ]
                                    },
                                    "range": {
                                        "start": "1500",
                                        "end": "2200"
                                    }
                                },
                                "gps": "12.9244592,77.593673",
                                "address": {
                                    "locality": "1148,26th Main rd",
                                    "street": "Sanjay Gandhi hospital, 4th Block East",
                                    "city": "Bengaluru",
                                    "area_code": "560041",
                                    "state": "Karnataka"
                                },
                                "local_id": "LOC560041",
                                "min_time_to_ship": 259200,
                                "max_time_to_ship": 259200,
                                "average_time_to_ship": 259200,
                                "median_time_to_ship": 259200,
                                "type": "pan"
                            }
                        ],
                        "time": {
                            "label": "enable",
                            "timestamp": "2024-10-10T06:38:12.491Z"
                        },
                        "descriptor": {
                            "name": "Cream n Nudge",
                            "short_desc": "Cream n Nudge",
                            "long_desc": "21319 - Cream n Nudge",
                            "symbol": "https://nstore-static-data-s3.s3.ap-south-1.amazonaws.com/Logo/dummy_bill_image.png",
                            "images": [
                                "https://nstore-static-data-s3.s3.ap-south-1.amazonaws.com/Logo/dummy_bill_image.png"
                            ]
                        },
                        "creds": [],
                        "tags": [
                            {
                                "code": "catalog_link",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "inline"
                                    }
                                ]
                            },
                            {
                                "code": "timing",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "Order"
                                    },
                                    {
                                        "code": "location",
                                        "value": "LOC560041"
                                    },
                                    {
                                        "code": "day_from",
                                        "value": "1"
                                    },
                                    {
                                        "code": "day_to",
                                        "value": "6"
                                    },
                                    {
                                        "code": "time_from",
                                        "value": "1500"
                                    },
                                    {
                                        "code": "time_to",
                                        "value": "2200"
                                    }
                                ]
                            },
                            {
                                "code": "timing",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "Delivery"
                                    },
                                    {
                                        "code": "location",
                                        "value": "LOC560041"
                                    },
                                    {
                                        "code": "day_from",
                                        "value": "1"
                                    },
                                    {
                                        "code": "day_to",
                                        "value": "6"
                                    },
                                    {
                                        "code": "time_from",
                                        "value": "1500"
                                    },
                                    {
                                        "code": "time_to",
                                        "value": "2200"
                                    }
                                ]
                            },
                            {
                                "code": "timing",
                                "list": [
                                    {
                                        "code": "type",
                                        "value": "Self-Pickup"
                                    },
                                    {
                                        "code": "location",
                                        "value": "LOC560041"
                                    },
                                    {
                                        "code": "day_from",
                                        "value": "1"
                                    },
                                    {
                                        "code": "day_to",
                                        "value": "6"
                                    },
                                    {
                                        "code": "time_from",
                                        "value": "1500"
                                    },
                                    {
                                        "code": "time_to",
                                        "value": "2200"
                                    }
                                ]
                            },
                            {
                                "code": "serviceability",
                                "list": [
                                    {
                                        "code": "location",
                                        "value": "LOC560041"
                                    },
                                    {
                                        "code": "category",
                                        "value": "F&B"
                                    },
                                    {
                                        "code": "type",
                                        "value": "12"
                                    },
                                    {
                                        "code": "val",
                                        "value": "IND"
                                    },
                                    {
                                        "code": "unit",
                                        "value": "country"
                                    }
                                ]
                            }
                        ],
                        "ttl": "P1D",
                        "@ondc/org/fssai_license_no": "15496378496469",
                        "local_id": "21319"
                    },
                    "product": {
                        "id": "121",
                        "subtotal": 70,
                        "time": {
                            "label": "enable",
                            "timestamp": "2024-10-10T06:38:12.491Z"
                        },
                        "parent_item_id": "",
                        "descriptor": {
                            "name": "Corn Pizza",
                            "short_desc": "Corn Pizza",
                            "long_desc": "Corn Pizza",
                            "symbol": "https://nstoreassets.s3.amazonaws.com/21729_B/121.jpg",
                            "images": [
                                "https://nstoreassets.s3.amazonaws.com/21729_B/121.jpg",
                                "https://nstore-static-data-s3.s3.ap-south-1.amazonaws.com/Logo/tmp_product_image.jpeg"
                            ]
                        },
                        "quantity": {
                            "unitized": {
                                "measure": {
                                    "unit": "each",
                                    "value": "0"
                                }
                            },
                            "available": {
                                "count": "99"
                            },
                            "maximum": {
                                "count": "99"
                            }
                        },
                        "price": {
                            "currency": "INR",
                            "value": 70,
                            "maximum_value": "70.00"
                        },
                        "category_id": "F&B",
                        "fulfillment_id": "F1",
                        "location_id": "LOC560041",
                        "@ondc/org/returnable": false,
                        "@ondc/org/cancellable": false,
                        "@ondc/org/seller_pickup_return": false,
                        "@ondc/org/time_to_ship": "PT72H",
                        "@ondc/org/available_on_cod": false,
                        "@ondc/org/contact_details_consumer_care": "Cream n Nudge,hariprasa49@gmail.com,5716434997",
                        "tags": [
                            {
                                "code": "origin",
                                "list": [
                                    {
                                        "code": "country",
                                        "value": "IND"
                                    }
                                ]
                            },
                            {
                                "code": "veg_nonveg",
                                "list": [
                                    {
                                        "code": "veg",
                                        "value": "yes"
                                    }
                                ]
                            }
                        ]
                    },
                    "customisations": null,
                    "hasCustomisations": false,
                    "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1"
                },
                "createdAt": "2024-11-07T13:07:04.473Z",
                "updatedAt": "2024-11-07T13:07:04.473Z",
                "__v": 0
            }
        ]
          dispatch(setCartList(res));
          CustomToaster('success',"Item added to cart successfully 1.")
          handleSuccess(res);
          if (navigate) {
            history.push("/application/cart");
          }
        } else {
          const currentCount = parseInt(cartItem[0].item.quantity.count);
          const maxCount = parseInt(
            cartItem[0].item.product.quantity.maximum.count
          );
    
          if (currentCount < maxCount) {
            if (!customisations) {
              await updateCartItem(cartItems, isIncrement, cartItem[0]._id);
              fetchCartItems();
              setAddToCartLoading(false);
              dispatch({
                type: toast_actions.ADD_TOAST,
                payload: {
                  id: Math.floor(Math.random() * 100),
                  type: toast_types.success,
                  message: "Item quantity updated in your cart.",
                },
              });
            } else {
              const currentIds = customisations.map((item) => item.id);
              let matchingCustomisation = null;
    
              for (let i = 0; i < cartItem.length; i++) {
                let existingIds = cartItem[i].item.customisations.map(
                  (item) => item.id
                );
                const areSame = areCustomisationsSame(existingIds, currentIds);
                if (areSame) {
                  matchingCustomisation = cartItem[i];
                }
              }
    
              if (matchingCustomisation) {
                await updateCartItem(
                  cartItems,
                  isIncrement,
                  matchingCustomisation._id
                );
                setAddToCartLoading(false);
                fetchCartItems();
                dispatch({
                  type: toast_actions.ADD_TOAST,
                  payload: {
                    id: Math.floor(Math.random() * 100),
                    type: toast_types.success,
                    message: "Item quantity updated in your cart.",
                  },
                });
              } else {
                const res = await postCall(url, payload);
                fetchCartItems();
                setAddToCartLoading(false);
                dispatch({
                  type: toast_actions.ADD_TOAST,
                  payload: {
                    id: Math.floor(Math.random() * 100),
                    type: toast_types.success,
                    message: "Item added to cart successfully 2.",
                  },
                });
              }
            }
          } else {
            setAddToCartLoading(false);
            dispatch({
              type: toast_actions.ADD_TOAST,
              payload: {
                id: Math.floor(Math.random() * 100),
                type: toast_types.error,
                message: `The maximum available quantity for item is already in your cart.`,
              },
            });
          }
        }
    } catch (error) {
        console.error("error...1",error)
        CustomToaster('error','Failed to add product to cart')
    }
      };
    const addOrUpdateToCartByDispatch = () => {
        if (cartList?.length > 0) {
            //checking same restaurant items already exist or not
            const isRestaurantExist = cartList?.find(
                (item) => item.restaurant_id === modalData[0].restaurant_id
            )
            if (isRestaurantExist) {
                handleAddUpdate()
            } else {
                if (cartList.length !== 0) {
                    handleClearCartModalOpen()
                }
            }
        } else {
            handleAddUpdate()
        }
    }
    const handleCampaignOrder = () => {
        dispatch(
            setCampCart({
                ...modalData[0],
                totalPrice: totalPrice,
                quantity: quantity,
                variations: getNewVariationForDispatch(),
                selectedAddons: add_on,
            })
        )
        router.push(`/checkout?page=campaign`)
    }

    const handleProductAddUpdate = (checkingFor) => {
        if (checkingFor === 'cart') {
            addOrUpdateToCartByDispatch()
        } else if (checkingFor === 'campaign') {
            handleCampaignOrder()
        }
    }

    const handleRequiredItemsToaster = (itemsArray, selectedOptions) => {
        itemsArray?.forEach((item) => {
            if (selectedOptions.length > 0) {
                selectedOptions?.forEach((sOption) => {
                    if (sOption.choiceIndex !== item.indexNumber) {
                        const text = item.name
                        let checkingQuantity = false
                        handleProductVariationRequirementsToaster(
                            text,
                            checkingQuantity,
                            t
                        )
                    }
                })
            } else {
                const text = item.name
                let checkingQuantity = false
                handleProductVariationRequirementsToaster(
                    text,
                    checkingQuantity,
                    t
                )
            }
        })
    }
    const optionalVariationSelectionMinMax = () => {
        const selectedValues = selectedOptions.filter(
            (item) => item.type === 'optional'
        )
        let isTrue = false
        if (selectedValues.length > 0) {
            const selectedIndexCount = []
            selectedValues.forEach((item) =>
                selectedIndexCount.push(item.choiceIndex)
            )
            const indexWithoutDuplicates = [...new Set(selectedIndexCount)]
            if (indexWithoutDuplicates.length > 0) {
                indexWithoutDuplicates.forEach((itemIndex) => {
                    let optionalItemIndex = modalData?.[0]?.variations?.find(
                        (mItem, index) => index === itemIndex
                    )

                    if (optionalItemIndex) {
                        if (optionalItemIndex.type === 'multi') {
                            let indexNum = modalData[0]?.variations?.findIndex(
                                (mItem) => mItem.name === optionalItemIndex.name
                            )
                            let count = 0
                            selectedIndexCount.forEach((indexN) => {
                                if (indexN === indexNum) {
                                    count += 1
                                }
                            })

                            if (
                                count >=
                                    Number.parseInt(optionalItemIndex.min) &&
                                count <= Number.parseInt(optionalItemIndex.max)
                            ) {
                                isTrue = true
                            } else {
                                const text = {
                                    name: optionalItemIndex.name,
                                    min: optionalItemIndex.min,
                                    max: optionalItemIndex.max,
                                }
                                let checkingQuantity = true
                                isTrue = false
                                let id = true
                                handleProductVariationRequirementsToaster(
                                    text,
                                    checkingQuantity,
                                    t,
                                    id
                                )
                            }
                        } else {
                            isTrue = true
                        }
                    } else {
                        isTrue = true
                    }
                })
            } else {
                isTrue = true
            }
        } else {
            isTrue = true
        }

        return isTrue
    }

    const handleAddToCartOnDispatch = (checkingFor) => {
        let requiredItemsList = []
        modalData?.[0]?.variations?.forEach((item, index) => {
            if (item.required === 'on') {
                const itemObj = {
                    indexNumber: index,
                    type: item.type,
                    max: item.max,
                    min: item.min,
                    name: item.name,
                }
                requiredItemsList.push(itemObj)
            }
        })

        if (requiredItemsList.length > 0) {
            if (selectedOptions.length === 0) {
                handleRequiredItemsToaster(requiredItemsList, selectedOptions)
            } else {
                let itemCount = 0

                requiredItemsList?.forEach((item, index) => {
                    // if(item)
                })

                requiredItemsList?.forEach((item, index) => {
                    const isExistInSelection = selectedOptions?.find(
                        (sitem) => sitem.choiceIndex === item.indexNumber
                    )

                    if (isExistInSelection) {
                        if (item.type === 'single') {
                            //call add/update to cart functionalities
                            itemCount += 1
                        } else {
                            //check based on min max for multiple selection
                            let selectedOptionCount = 0
                            selectedOptions?.forEach((item) => {
                                if (
                                    item.choiceIndex ===
                                    isExistInSelection?.choiceIndex
                                ) {
                                    selectedOptionCount += 1
                                }
                            })
                            if (
                                selectedOptionCount >=
                                    Number.parseInt(item.min) &&
                                selectedOptionCount <= Number.parseInt(item.max)
                            ) {
                                //call add/update to cart functionalities
                                itemCount += 1
                            } else {
                                const text = {
                                    name: item.name,
                                    min: item.min,
                                    max: item.max,
                                }
                                let checkingQuantity = true

                                handleProductVariationRequirementsToaster(
                                    text,
                                    checkingQuantity,
                                    t
                                )
                            }
                        }
                        if (
                            itemCount === requiredItemsList.length &&
                            optionalVariationSelectionMinMax(
                                selectedOptions,
                                modalData
                            )
                        ) {
                            handleProductAddUpdate(checkingFor)
                        }
                    } else {
                        handleRequiredItemsToaster(
                            requiredItemsList,
                            selectedOptions
                        )
                    }
                })
            }
        } else {
            handleProductAddUpdate(checkingFor)
        }
    }
    const addToCard = () => {
        if (location) {
            let checkingFor = 'cart'
            if (
                modalData[0]?.in_stock === 0 
            ) {
                CustomToaster('error', t('Out Of Stock'), 'add')
            } else {
                handleAddToCartOnDispatch(checkingFor)
            }
        } else {
            setIsLocation(true)
        }
    }
    const clearCartAlert = () => {
        deleteCartItemMutate(getGuestId(), {
            //onSuccess: handleSuccess,
            onError: onErrorResponse,
        })
        dispatch(setClearCart())

        //setClearCartModal(false)
        toast.success(
            t(
                'Previously added restaurant foods have been removed from cart and the selected one added'
            ),
            {
                duration: 6000,
            }
        )
        handleAddUpdate?.()
    }
    const handleClose = () => setOpen(false)

    const changeChoices = (
        e,
        option,
        optionIndex,
        choiceIndex,
        isRequired,
        choiceType,
        checked
    ) => {
        if (choiceType === 'single') {
            if (checked) {
                setQuantity(1)
                //selected or checked variation handling
                if (selectedOptions.length > 0) {
                    const isExist = selectedOptions.find(
                        (item) =>
                            item.choiceIndex === choiceIndex &&
                            item.optionIndex === optionIndex
                    )
                    if (isExist) {
                        const newSelectedOptions = selectedOptions.filter(
                            (sOption) =>
                                sOption.choiceIndex === choiceIndex &&
                                sOption.label !== isExist.label
                        )
                        setSelectedOptions(newSelectedOptions)
                        setTotalPrice(
                            (prevState) =>
                                prevState -
                                Number.parseInt(option.optionPrice) * quantity
                        )
                        setVarPrice(
                            (prevPrice) =>
                                prevPrice -
                                Number.parseInt(option.optionPrice) * quantity
                        )
                    } else {
                        const isItemExistFromSameVariation =
                            selectedOptions.find(
                                (item) => item.choiceIndex === choiceIndex
                            )
                        if (isItemExistFromSameVariation) {
                            const newObjs = selectedOptions.map((item) => {
                                if (item.choiceIndex === choiceIndex) {
                                    return {
                                        choiceIndex: choiceIndex,
                                        ...option,
                                        optionIndex: optionIndex,
                                        isSelected: true,
                                        type:
                                            isRequired === 'on'
                                                ? 'required'
                                                : 'optional',
                                    }
                                } else {
                                    return item
                                }
                            })
                            setSelectedOptions(newObjs)
                            //changing total price by removing previous ones price and adding new selection options price
                            setTotalPrice(
                                (prevState) =>
                                    prevState -
                                    Number.parseInt(
                                        isItemExistFromSameVariation.optionPrice
                                    ) *
                                        quantity +
                                    Number.parseInt(option.optionPrice) *
                                        quantity
                            )
                            setVarPrice(
                                (prevPrice) =>
                                    prevPrice -
                                    Number.parseInt(
                                        isItemExistFromSameVariation.optionPrice
                                    ) *
                                        quantity +
                                    Number.parseInt(option.optionPrice) *
                                        quantity
                            )
                        } else {
                            const newObj = {
                                choiceIndex: choiceIndex,
                                ...option,
                                optionIndex: optionIndex,
                                isSelected: true,
                                type:
                                    isRequired === 'on'
                                        ? 'required'
                                        : 'optional',
                            }
                            setSelectedOptions([...selectedOptions, newObj])
                            setTotalPrice(
                                (prevState) =>
                                    prevState +
                                    Number.parseInt(option.optionPrice) *
                                        quantity
                            )
                            setVarPrice(
                                (prevPrice) =>
                                    prevPrice +
                                    Number.parseInt(option.optionPrice) *
                                        quantity
                            )
                        }
                    }
                } else {
                    // for a new selected variation
                    const newObj = {
                        choiceIndex: choiceIndex,
                        ...option,
                        optionIndex: optionIndex,
                        isSelected: true,
                        type: isRequired === 'on' ? 'required' : 'optional',
                    }
                    setSelectedOptions([newObj])
                    setTotalPrice(
                        (prevState) =>
                            prevState +
                            Number.parseInt(option.optionPrice) * quantity
                    )
                    setVarPrice(
                        (prevPrice) =>
                            prevPrice +
                            Number.parseInt(option.optionPrice) * quantity
                    )
                }
            } else {
                // uncheck or unselect variation handle
                const filtered = selectedOptions.filter((item) => {
                    if (item.choiceIndex === choiceIndex) {
                        if (item.label !== option.label) {
                            return item
                        }
                    } else {
                        return item
                    }
                })
                setSelectedOptions(filtered)

                setTotalPrice(
                    (prevState) =>
                        prevState -
                        Number.parseInt(option.optionPrice) * quantity
                )
                setVarPrice(
                    (prevPrice) =>
                        prevPrice -
                        Number.parseInt(option.optionPrice) * quantity
                )
            }
        } else {
            //for multiple optional variation selection
            if (e.target.checked) {
                setQuantity(1)
                // setIsCheck(e.target.checked)
                setSelectedOptions((prevState) => [
                    ...prevState,
                    {
                        choiceIndex: choiceIndex,
                        ...option,
                        optionIndex: optionIndex,
                        isSelected: true,
                        type: isRequired === 'on' ? 'required' : 'optional',
                    },
                ])
                setTotalPrice(
                    (prevState) =>
                        prevState +
                        Number.parseInt(option.optionPrice) * quantity
                )
                setVarPrice(
                    (prevPrice) =>
                        prevPrice +
                        Number.parseInt(option.optionPrice) * quantity
                )
            } else {
                const filtered = selectedOptions.filter((item) => {
                    if (item.choiceIndex === choiceIndex) {
                        if (item.label !== option.label) {
                            return item
                        }
                    } else {
                        return item
                    }
                })
                setSelectedOptions(filtered)
                setTotalPrice(
                    (prevState) =>
                        prevState -
                        Number.parseInt(option.optionPrice) * quantity
                )
                setVarPrice(
                    (prevPrice) =>
                        prevPrice -
                        Number.parseInt(option.optionPrice) * quantity
                )
            }
        }
    }
    const radioCheckHandler = (choiceIndex, option, optionIndex) => {
        const isExist = selectedOptions?.find(
            (sOption) =>
                sOption.choiceIndex === choiceIndex &&
                sOption.optionIndex === optionIndex
        )
        return !!isExist
    }
    const changeAddOns = (checkTrue, addOn) => {
        let filterAddOn = add_on.filter((item) => item.name !== addOn.name)
        if (checkTrue) {
            setAddOns([...filterAddOn, addOn])
        } else {
            setAddOns(filterAddOn)
        }
    }
    const handleTotalPrice = () => {
        let price
        if (productUpdate) {
            if (modalData.length > 0) {
                price = modalData?.[0]?.item_details?.price?.value
            }
        } else {
            price = modalData?.[0]?.item_details?.price?.value
        }
        if (selectedOptions?.length > 0) {
            selectedOptions?.forEach(
                (item) => (price += Number.parseInt(item?.optionPrice))
            )
        }
        console.log("total price...",price);
        setTotalPrice(price * quantity)
    }
    useEffect(() => {
        if (modalData[0]) {
            handleTotalPrice()
        }
    }, [quantity, modalData])
    const decrementPrice = () => {
        setQuantity((prevQty) => prevQty - 1)
    }
    // const isShowStockText = (option) => {
    //
    //     return selectedOptions?.some((item) => {
    //         return item?.option_id === option.option_id && quantity  > option.current_stock;
    //     });
    // };

    const incrementPrice = () => {
        const isLimitedOrDaily = modalData[0]?.stock_type !== 'unlimited'
        const maxCartQuantity = modalData[0]?.maximum_cart_quantity
        // Helper function to check stock limits and update quantity
        const tryUpdateQuantity = (stockLimit) => {
            if (quantity >= stockLimit && isLimitedOrDaily) {
                CustomToaster('error', t('Out Of Stock'), 'stock')
            } else if (maxCartQuantity && quantity >= maxCartQuantity) {
                CustomToaster('error', 'Out Of Limits', 'Quantity')
            } else {
                setQuantity((prevQty) => prevQty + 1)
            }
        }

        if (selectedOptions?.length > 0) {
            // Calculate the minimum stock from selected options
            const minStock = selectedOptions.reduce(
                (min, item) => Math.min(min, parseInt(item.current_stock)),
                Infinity
            )
            //setVariationStock(minStock);

            // If stock type is limited or daily, check against minStock
            if (quantity >= modalData[0]?.item_stock && isLimitedOrDaily) {
                CustomToaster('error', t('Out Of Stock'), 'stock')
            } else {
                if (isLimitedOrDaily) {
                    tryUpdateQuantity(minStock)
                } else {
                    // If not limited/daily, just check against max cart quantity
                    tryUpdateQuantity(Infinity)
                }
            }
        } else {
            // No options selected, check directly against item stock or max cart quantity
            const itemStock = modalData[0]?.item_stock
            if (isLimitedOrDaily && itemStock !== undefined) {
                tryUpdateQuantity(itemStock)
            } else {
                tryUpdateQuantity(Infinity)
            }
        }
    }

    const {
        mutate: addFavoriteMutation,
        isLoading,
        error,
        data,
    } = useMutation(
        'add-favourite',
        () => ProductsApi.addFavorite(product.id),
        {
            onSuccess: (response) => {
                if (response?.data) {
                    dispatch(addWishList(product))
                    // toast.success(response.data.message)
                    CustomToaster('success', response.data.message)
                }
            },
            onError: (error) => {
                //toast.error(error.response.data.message)
                CustomToaster('error', error.response.data.message)
            },
        }
    )

    const addToFavorite = () => {
        if (token) {
            addFavoriteMutation()
            // notify(data.message)
        } else CustomToaster('error', 'You are not logged in')
    }

    const onSuccessHandlerForDelete = (res) => {
        dispatch(removeWishListFood(product.id))
        CustomToaster('success', res.message)
    }
    const { mutate } = useWishListDelete()
    const deleteWishlistItem = (id) => {
        mutate(id, {
            onSuccess: onSuccessHandlerForDelete,
            onError: (error) => {
                CustomToaster('error', error.response.data.message)
            },
        })
    }
    const isInCart = (id) => {
        if (productUpdate) {
            const isInCart = cartList.filter((item) => item.id === id)
            if (isInCart.length > 0) {
                return true
            } else {
                return false
            }
        }

        // return !!cartList.find((item) => item.id === id)
    }

    const isInList = (id) => {
        return !!wishLists?.food?.find((wishFood) => wishFood.id === id)
    }
    //auth modal
    const [authModalOpen, setAuthModalOpen] = useState(false)

    const orderNow = () => {
        if (location) {
            if (localStorage.getItem('token')) {
                let checkingFor = 'campaign'
                handleAddToCartOnDispatch(checkingFor)
            } else {
                setAuthModalOpen(true)
                //handleModalClose()
                //toast.error(t('You are not logged in'))
            }
        } else {
            setIsLocation(true)
        }
    }
    const handleSignInSuccess = () => {
        dispatch(
            setCampCart({
                ...modalData[0],
                totalPrice: totalPrice,
                quantity: quantity,
                selectedAddons: add_on,
            })
        )
        router.push(`/checkout?page=campaign`)
    }
    const getFullFillRequirements = () => {
        let isdisabled = false
        if (modalData[0]?.variations?.length > 0) {
            modalData[0]?.variations?.forEach((variation, index) => {
                if (variation?.type === 'multi') {
                    const selectedIndex = selectedOptions?.filter(
                        (item) => item.choiceIndex === index
                    )
                    if (selectedIndex && selectedIndex.length > 0) {
                        isdisabled =
                            selectedIndex.length >= variation.min &&
                            selectedIndex.length <= variation.max
                    }
                } else {
                    const singleVariation = modalData[0]?.variations?.filter(
                        (item) =>
                            item?.type === 'single' && item?.required === 'on'
                    )
                    const requiredSelected = selectedOptions?.filter(
                        (item) => item?.type === 'required'
                    )
                    if (singleVariation?.length === requiredSelected?.length) {
                        isdisabled = true
                    } else {
                        isdisabled = false
                    }
                }
            })
        } else {
            isdisabled = true
        }
        return isdisabled
    }
    // if(!modalData){
    //     return
    // }

    const isUpdateDisabled = () => {
        if (selectedOptions && selectedOptions.length > 0) {
            return selectedOptions.some((option) => option.current_stock === 0)
        }
        return false
    }
    const isVegItem = (data) => {
        const vegTag = data.item_details.tags.find(tag => tag.code === "veg_nonveg");
        if (vegTag) {
            const vegValue = vegTag.list.find(item => item.code === "veg");
            return vegValue && vegValue.value === "yes" ? 1 : 0;
        }
        return "Unknown";
    };
    const vegStatus = isVegItem(modalData[0]);
    const text1 = t('only')
    const text2 = t('items available')
    return (
        <>
            <Modal
                open={open}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                disableAutoFocus={true}
            >
                <FoodDetailModalStyle sx={{ bgcolor: 'background.paper' }}>
                                <CustomStackFullWidth>
                                    <FoodModalTopSection
                                        product={modalData[0]}
                                        image={image}
                                        handleModalClose={handleModalClose}
                                        isInList={isInList}
                                        deleteWishlistItem={deleteWishlistItem}
                                        addToFavorite={addToFavorite}
                                    />

                                    <CustomStackFullWidth
                                        sx={{ padding: '20px' }}
                                        spacing={2}
                                    >
                                        <SimpleBar
                                            style={{
                                                maxHeight: '35vh',
                                                paddingRight: '10px',
                                            }}
                                            className="test123"
                                        >
                                            <CustomStackFullWidth spacing={0.5}>
                                                <Stack
                                                    direction="row"
                                                    justifyContent="flex-start"
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                    spacing={0.5}
                                                >
                                                    <Typography variant="h4">
                                                        {modalData.length > 0 &&
                                                            modalData[0]?.item_details?.descriptor?.name}
                                                    </Typography>
                                                    <VagSvg
                                                        color={
                                                            Number(
                                                                vegStatus
                                                            ) === 0
                                                                ? theme.palette
                                                                      .nonVeg
                                                                : theme.palette
                                                                      .success
                                                                      .light
                                                        }
                                                    />
                                                    {modalData[0]
                                                        ?.halal_tag_status ===
                                                        1 &&
                                                        modalData[0]
                                                            ?.is_halal ===
                                                            1 && (
                                                            <Tooltip
                                                                arrow
                                                                title={t(
                                                                    'This is a halal food'
                                                                )}
                                                            >
                                                                <IconButton
                                                                    sx={{
                                                                        padding:
                                                                            '0px',
                                                                    }}
                                                                >
                                                                    <HalalSvg />
                                                                </IconButton>
                                                            </Tooltip>
                                                        )}
                                                    {quantity >=
                                                        modalData[0]
                                                            ?.item_stock &&
                                                        modalData[0]
                                                            ?.stock_type !==
                                                            'unlimited' && (
                                                            <Typography
                                                                fontSize="12px"
                                                                color={
                                                                    quantity >=
                                                                        modalData[0]
                                                                            ?.item_stock &&
                                                                    theme
                                                                        .palette
                                                                        .info
                                                                        .main
                                                                }
                                                            >
                                                                ({text1}{' '}
                                                                {
                                                                    modalData[0]
                                                                        ?.item_stock
                                                                }{' '}
                                                                {text2})
                                                            </Typography>
                                                        )}
                                                </Stack>
                                                <ReadMore
                                                    limits="100"
                                                    color={
                                                        theme.palette
                                                            .neutral[400]
                                                    }
                                                >
                                                    {modalData?.length > 0 &&
                                                        modalData[0]
                                                            ?.item_details?.descriptor?.short_desc}
                                                </ReadMore>
                                                {modalData[0]?.nutritions_name
                                                    ?.length > 0 && (
                                                    <>
                                                        <Typography
                                                            fontSize="14px"
                                                            fontWeight="500"
                                                            mt="5px"
                                                        >
                                                            {t(
                                                                'Nutrition Details'
                                                            )}
                                                        </Typography>

                                
                                                    </>
                                                )}
                                                {modalData[0]?.allergies_name
                                                    ?.length > 0 && (
                                                    <>
                                                        <Typography
                                                            fontSize="14px"
                                                            fontWeight="500"
                                                            mt="5px"
                                                        >
                                                            {t(
                                                                'Allergic Ingredients'
                                                            )}
                                                        </Typography>

                                                        <Stack
                                                            direction="row"
                                                            spacing={0.5}
                                                        >
                                                            {modalData[0]?.allergies_name?.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <Typography
                                                                        fontSize="12px"
                                                                        key={
                                                                            index
                                                                        }
                                                                        color={
                                                                            theme
                                                                                .palette
                                                                                .neutral[400]
                                                                        }
                                                                    >
                                                                        {item}
                                                                        {index !==
                                                                        modalData[0]
                                                                            ?.allergies_name
                                                                            .length -
                                                                            1
                                                                            ? ','
                                                                            : '.'}
                                                                    </Typography>
                                                                )
                                                            )}
                                                        </Stack>
                                                    </>
                                                )}
                                                <Stack
                                                    spacing={1}
                                                    direction={{
                                                        xs: 'row',
                                                        sm: 'row',
                                                        md: 'row',
                                                    }}
                                                    justifyContent={{
                                                        xs: 'space-between',
                                                        sm: 'space-between',
                                                        md: 'space-between',
                                                    }}
                                                    alignItems="center"
                                                >
                                                    <StartPriceView
                                                        data={modalData[0]}
                                                        currencySymbolDirection={
                                                            'left'
                                                        }
                                                        currencySymbol={
                                                            '₹'
                                                        }
                                                        digitAfterDecimalPoint={
                                                            2
                                                        }
                                                        hideStartFromText="false"
                                                        handleBadge={
                                                            handleBadge
                                                        }
                                                        selectedOptions={
                                                            selectedOptions
                                                        }
                                                    />

                                                    <IncrementDecrementManager
                                                        decrementPrice={
                                                            decrementPrice
                                                        }
                                                        totalPrice={totalPrice}
                                                        quantity={quantity}
                                                        incrementPrice={
                                                            incrementPrice
                                                        }
                                                    />
                                                </Stack>
                                            </CustomStackFullWidth>
                                            {modalData?.length > 0 &&
                                                modalData[0]?.variations
                                                    ?.length > 0 && (
                                                    <VariationsManager
                                                        variationStock={
                                                            variationStock
                                                        }
                                                        quantity={quantity}
                                                        selectedOptions={
                                                            selectedOptions
                                                        }
                                                        t={t}
                                                        modalData={modalData}
                                                        radioCheckHandler={
                                                            radioCheckHandler
                                                        }
                                                        changeChoices={
                                                            changeChoices
                                                        }
                                                        currencySymbolDirection={
                                                            currencySymbolDirection
                                                        }
                                                        currencySymbol={
                                                            currencySymbol
                                                        }
                                                        digitAfterDecimalPoint={
                                                            digitAfterDecimalPoint
                                                        }
                                                        itemIsLoading={
                                                            isRefetching
                                                        }
                                                        productUpdate={
                                                            productUpdate
                                                        }
                                                    />
                                                )}
                                            {modalData?.length > 0 &&
                                                modalData[0]?.add_ons?.length >
                                                    0 && (
                                                    <AddOnsManager
                                                        t={t}
                                                        modalData={modalData}
                                                        setTotalPrice={
                                                            setTotalPrice
                                                        }
                                                        setVarPrice={
                                                            setVarPrice
                                                        }
                                                        changeAddOns={
                                                            changeAddOns
                                                        }
                                                        setProductAddOns={
                                                            setProductAddOns
                                                        }
                                                        product={modalData[0]}
                                                        setAddOns={setAddOns}
                                                        add_on={add_on}
                                                        quantity={quantity}
                                                        cartList={cartList}
                                                        itemIsLoading={
                                                            isRefetching
                                                        }
                                                    />
                                                )}
                                        </SimpleBar>
                                        <Grid container direction="column">
                                            <Grid
                                                item
                                                md={7}
                                                sm={12}
                                                xs={12}
                                                alignSelf="center"
                                            >
                                                <TotalAmountVisibility
                                                    modalData={modalData}
                                                    totalPrice={totalPrice}
                                                    currencySymbolDirection='left'
                                                    currencySymbol='₹'
                                                    digitAfterDecimalPoint={
                                                        2
                                                    }
                                                    t={t}
                                                    productDiscount={
                                                        modalData[0]?.discount
                                                    }
                                                    productDiscountType={
                                                        modalData[0]
                                                            ?.discount_type
                                                    }
                                                    productRestaurantDiscount={
                                                        modalData[0]
                                                            ?.restaurant_discount
                                                    }
                                                    selectedAddOns={add_on}
                                                    quantity={quantity}
                                                />
                                            </Grid>
                                            <Grid
                                                item
                                                md={
                                                    !modalData[0].in_stock
                                                        ? 12
                                                        : 5
                                                }
                                                sm={12}
                                                xs={12}
                                            >
                                                {modalData?.length > 0 && modalData[0]?.in_stock
                                                ? (
                                                    <>
                                                        {isInCart(
                                                            modalData[0].id
                                                        ) && (
                                                            <UpdateToCartUi
                                                                addToCard={
                                                                    addToCard
                                                                }
                                                                t={t}
                                                                isUpdateDisabled={
                                                                    isUpdateDisabled
                                                                }
                                                            />
                                                        )}
                                                        {!isInCart(
                                                            product.id
                                                        ) && (
                                                            <AddOrderToCart
                                                                addToCartLoading={
                                                                    false
                                                                }
                                                                product={
                                                                    modalData[0]
                                                                }
                                                                t={t}
                                                                addToCard={
                                                                    addToCard
                                                                }
                                                                orderNow={
                                                                    orderNow
                                                                }
                                                                getFullFillRequirements={
                                                                    getFullFillRequirements
                                                                }
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    <AddUpdateOrderToCart
                                                        addToCartLoading={
                                                            false
                                                        }
                                                        modalData={modalData}
                                                        isInCart={isInCart}
                                                        addToCard={addToCard}
                                                        t={t}
                                                        product={modalData[0]}
                                                        orderNow={orderNow}
                                                        getFullFillRequirements={
                                                            getFullFillRequirements
                                                        }
                                                        isUpdateDisabled={
                                                            isUpdateDisabled
                                                        }
                                                    />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CustomStackFullWidth>
                                </CustomStackFullWidth>
                </FoodDetailModalStyle>
            </Modal>
            <CartClearModal
                clearCartModal={clearCartModal}
                setClearCartModal={setClearCartModal}
                clearCartAlert={clearCartAlert}
                addToCard={addToCard}
            />
            {authModalOpen && (
                <AuthModal
                    open={authModalOpen}
                    handleClose={() => setAuthModalOpen(false)}
                    signInSuccess={handleSignInSuccess}
                    modalFor={modalFor}
                    setModalFor={setModalFor}
                />
            )}
        </>
    )
}

export default FoodDetailModal
