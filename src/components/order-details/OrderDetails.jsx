import { OrderApi } from '@/hooks/react-query/config/orderApi'
import { useGetRefundReasons } from '@/hooks/react-query/refund-request/useGetRefundReasons'
import { useStoreRefundRequest } from '@/hooks/react-query/refund-request/useStoreRefundRequest'
import {
    clearOfflinePaymentInfo,
    setOrderDetailsModal,
} from '@/redux/slices/OfflinePayment'
import {
    CustomColouredTypography,
    CustomPaperBigCard,
    CustomStackFullWidth,
} from '@/styled-components/CustomStyles.style'
import { ImageSource } from '@/utils/ImageSource'
import { getAmount } from '@/utils/customFunctions'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import StarIcon from '@mui/icons-material/Star'
import {
    Button,
    Grid,
    IconButton,
    NoSsr,
    Stack,
    Typography,
    alpha,
    styled,
    useMediaQuery,
} from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import { useTheme } from '@mui/material/styles'
import jwt from 'base-64'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import 'simplebar-react/dist/simplebar.min.css'
import CustomDivider from '../CustomDivider'
import CustomImageContainer from '../CustomImageContainer'
import { onErrorResponse, onSingleErrorResponse } from '../ErrorResponse'
import Meta from '../Meta'
import { getGuestId, getToken } from '../checkout-page/functions/getGuestUserId'
import CustomModal from '../custom-modal/CustomModal'
import CustomFormatedDateTime from '../date/CustomFormatedDateTime'
import RefundModal from '../order-history/RefundModal'
import DeliveryTimeInfoVisibility from './DeliveryTimeInfoVisibility'
import GifShimmer from './GifShimmer'
import {
    CustomOrderStatus,
    CustomProductDivider,
    IformationGrid,
    InfoTypography,
    InstructionWrapper,
    OrderFoodAmount,
    OrderFoodName,
    OrderSummaryGrid,
    ProductDetailsWrapper,
    RefundButton,
    TitleTypography,
    TotalGrid,
} from './OrderDetail.style'
import OrderDetailsBottom from './OrderDetailsBottom'
import OrderDetailsShimmer from './OrderDetailsShimmer'
import { getVariationNames } from './OrderSummeryVariations'
import PaymentUpdate from './PaymentUpdate'
import Refund from './Refund'
import Reorder from './Reorder'
import OfflineDetailsModal from './offline-payment/OfflineDetailsModal'
import OfflineOrderDetails from './offline-payment/OfflineOrderDetails'
import SubscriptionDetails from './subscription-details'
import BottomActions from './subscription-details/BottomActions'

import ReviewSideDrawer from '@/components/order-details/ReviewSideDrawer'
import { setDeliveryManInfoByDispatch } from '@/redux/slices/searchFilter'
import InfoIcon from '@mui/icons-material/Info'
import startReview from '../../../public/static/star-review.png'
import TrackingPage from '../order-tracking/TrackingPage'

import Tooltip, { tooltipClasses } from '@mui/material/Tooltip'
const CustomTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
    [`& .${tooltipClasses.arrow}`]: {
        color: alpha(theme.palette.neutral[1000], 0.8),
    },
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.neutral[1000],
        color: theme.palette.neutral[100],
    },
}))
function getRestaurantValue(data, key) {
    return data?.data?.details[0]?.food_details?.[key]
}

function getSubTotal(data, addOnsPrice = 0) {
    // let sun_total = 0;
    let totalPrice = 0
    if (data?.data?.details?.length > 0) {
        data?.data?.details?.map((item) => {
            totalPrice +=
                item.food_details.price * item.food_details.order_count
        })
        if (addOnsPrice > 0) return totalPrice + addOnsPrice
        return totalPrice
    }

    return totalPrice
}

function getAddons(data) {
    let totalAddons = 0
    if (data?.data?.details?.length > 0) {
        data?.data?.details?.map((item) => {
            totalAddons += item.total_add_on_price
        })
        return totalAddons
    }
    return totalAddons
}

function getDiscount(data) {
    let totalDiscount = 0
    if (data?.data?.details?.length > 0) {
        data?.data?.details?.map((item) => {
            totalDiscount += item.discount_on_food
        })

        return totalDiscount
    }

    return totalDiscount
}

function getTotalTax(data) {
    let totalTax = 0
    if (data?.data?.details?.length > 0) {
        data?.data?.details.map((item) => {
            totalTax += item.tax_amount
        })

        return totalTax
    }

    return totalTax
}

function getTotalPrice(subTotal, discountPrice, taxAmount) {
    return subTotal + taxAmount - discountPrice
}

const getItemsPrice = (order) => {
    // const productPrice = order.reduce(
    //     (total, product) => product?.price * product?.quantity + total,
    //     0
    // )
    const productPrice = order?.items[0]?.product?.price?.value * order?.items[0]?.quantity?.count
    return productPrice
}
const getAddOnsPrice = (items) => {
    let productAddonsPrice = items?.reduce(
        (total, product) =>
            (product.add_ons.length > 0
                ? product?.add_ons?.reduce(
                      (cTotal, cProduct) =>
                          cProduct.price * cProduct.quantity + cTotal,
                      0
                  )
                : 0) + total,
        0
    )
    return productAddonsPrice
}

const getSubTotalPrice = (dataList) => {
    return getItemsPrice(dataList) + getAddOnsPrice(dataList)
}
const getAddOnsNames = (addOns) => {
    const names = addOns.map(
        (item, index) =>
            `${addOns[0].name}(${addOns[0]?.quantity})${
                index !== addOns?.length - 1 ? ',' : ''
            }`
    )
    return names
}

const OrderDetails = ({ OrderIdDigital }) => {
    const theme = useTheme()
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const router = useRouter()
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const { orderId, phone, isTrackOrder, token } = router.query
    const { global } = useSelector((state) => state.globalSettings)
    const { orderDetailsModal } = useSelector((state) => state.offlinePayment)
    const [openOfflineModal, setOpenOfflineModal] = useState(orderDetailsModal)
    const [openModal, setOpenModal] = useState(false)
    const [openReviewModal, setOpenReviewModal] = useState(false)

    const guestId = getGuestId()
    const userPhone = phone && jwt.decode(phone)
    const tempOrderId = orderId ? orderId : OrderIdDigital
    const restaurantBaseUrl = global?.base_urls?.restaurant_image_url
    const deliveryManImage = global?.base_urls?.delivery_man_image_url
    let languageDirection = 'ltr'
    const tip_text = t('order delivered out of')

    let currencySymbol = '₹'
    let currencySymbolDirection = 'left'
    let digitAfterDecimalPoint = 2

   let trackData = {
    "totalCount": 1,
    "orders": [
        {
            "_id": "6731cac1a075a1c6b0164aca",
            "transactionId": "3c968e91-2ab5-4786-90dd-3c6b79504e95",
            "provider": {
                "id": "pramaan.ondc.org/alpha/mock-server",
                "locations": [
                    {
                        "id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
                    }
                ],
                "descriptor": {
                    "name": "WITS ONDC TEST STORE",
                    "short_desc": "Wits Testing Store",
                    "long_desc": "Wits Testing Store",
                    "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
                    "images": [
                        "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
                    ]
                }
            },
            "__v": 0,
            "addOns": [],
            "bppId": "pramaan.ondc.org/alpha/mock-server",
            "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
            "createdAt": "2024-11-11T09:13:37.559Z",
            "fulfillments": [
                {
                    "@ondc/org/TAT": "PT60M",
                    "id": "c461a827-f43d-487e-871d-e13467acd866",
                    "tracking": true,
                    "end": {
                        "contact": {
                            "email": "naush@gmail.com",
                            "phone": "8718914719"
                        },
                        "person": {
                            "name": "Naush1"
                        },
                        "location": {
                            "gps": "28.553192,77.216704",
                            "address": {
                                "name": "Naush1",
                                "building": "102",
                                "locality": "Khel Gaon Marg",
                                "city": "New Delhi",
                                "state": "Delhi",
                                "country": "IND",
                                "area_code": "110049"
                            }
                        },
                        "time": {
                            "range": {
                                "start": "2024-11-11T09:35:36.963Z",
                                "end": "2024-11-11T10:15:36.963Z"
                            },
                            "timestamp": "2024-11-11T10:15:36.963Z"
                        }
                    },
                    "type": "Delivery",
                    "state": {
                        "descriptor": {
                            "code": "Pending"
                        }
                    },
                    "@ondc/org/provider_name": "WITS ONDC TEST STORE",
                    "start": {
                        "location": {
                            "id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
                            "descriptor": {
                                "name": "WITS ONDC TEST STORE"
                            },
                            "gps": "28.553440, 77.214241",
                            "address": {
                                "locality": "Siri Fort Institutional Area, Siri Fort",
                                "city": "New Delhi",
                                "area_code": "110049",
                                "state": "Delhi"
                            }
                        },
                        "time": {
                            "range": {
                                "start": "2024-11-11T09:15:36.963Z",
                                "end": "2024-11-11T09:35:36.963Z"
                            },
                            "timestamp": "2024-11-11T09:35:36.963Z"
                        },
                        "instructions": {
                            "code": "2",
                            "name": "ONDC order",
                            "short_desc": "value of PCC",
                            "long_desc": "additional instructions such as register or counter no for self-pickup"
                        },
                        "contact": {
                            "phone": "9886098860",
                            "email": "nobody@nomail.com"
                        }
                    }
                }
            ],
            "items": [
                {
                    "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                    "quantity": {
                        "count": 1
                    },
                    "tags": [
                        {
                            "code": "type",
                            "list": [
                                {
                                    "code": "type",
                                    "value": "item"
                                }
                            ]
                        }
                    ],
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
                        ],
                        "fulfillments": [
                            {
                                "id": "c461a827-f43d-487e-871d-e13467acd866",
                                "@ondc/org/provider_name": "WITS ONDC TEST STORE",
                                "tracking": true,
                                "type": "Delivery",
                                "@ondc/org/category": "Immediate Delivery",
                                "@ondc/org/TAT": "PT60M",
                                "state": {
                                    "descriptor": {
                                        "code": "Serviceable"
                                    }
                                }
                            },
                            {
                                "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
                                "type": "Self-Pickup",
                                "@ondc/org/provider_name": "WITS ONDC TEST STORE",
                                "tracking": true,
                                "@ondc/org/category": "Takeaway",
                                "@ondc/org/TAT": "PT30M",
                                "state": {
                                    "descriptor": {
                                        "code": "Serviceable"
                                    }
                                }
                            }
                        ]
                    },
                    "fulfillment_status": "Pending",
                    "cancellation_status": "",
                    "return_status": "",
                    "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
                    "parent_item_id": "KxFI47c5IA+l"
                },
                {
                    "id": "C1",
                    "quantity": {
                        "count": 1
                    },
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
                                }
                            ]
                        }
                    ],
                    "product": {
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
                            "count": 1
                        }
                    },
                    "fulfillment_status": "Pending",
                    "cancellation_status": "",
                    "return_status": "",
                    "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
                    "parent_item_id": "KxFI47c5IA+l"
                },
                {
                    "id": "C3",
                    "quantity": {
                        "count": 1
                    },
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
                                }
                            ]
                        }
                    ],
                    "product": {
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
                            "count": 1
                        }
                    },
                    "fulfillment_status": "Pending",
                    "cancellation_status": "",
                    "return_status": "",
                    "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
                    "parent_item_id": "KxFI47c5IA+l"
                },
                {
                    "id": "C8",
                    "quantity": {
                        "count": 1
                    },
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
                                }
                            ]
                        }
                    ],
                    "product": {
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
                            "count": 1
                        }
                    },
                    "fulfillment_status": "Pending",
                    "cancellation_status": "",
                    "return_status": "",
                    "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
                    "parent_item_id": "KxFI47c5IA+l"
                }
            ],
            "messageId": "e67fb837-de84-4a7f-9dbf-a48e2fb18e72",
            "offers": [],
            "parentOrderId": "3c968e91-2ab5-4786-90dd-3c6b79504e95",
            "paymentStatus": "PAID",
            "updatedAt": "2024-11-11T09:15:37.356Z",
            "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1",
            "billing": {
                "name": "Naush1",
                "phone": "8718914719",
                "address": {
                    "name": "Naush1",
                    "building": "102",
                    "locality": "Khel Gaon Marg",
                    "city": "New Delhi",
                    "state": "Delhi",
                    "country": "IND",
                    "areaCode": "110049"
                },
                "email": "naush@gmail.com",
                "updated_at": "2024-11-11T09:13:37.498Z",
                "created_at": "2024-11-11T09:13:37.498Z"
            },
            "payment": {
                "uri": "https://snp.com/pg",
                "type": "ON-ORDER",
                "status": "NOT-PAID"
            },
            "quote": {
                "price": {
                    "currency": "INR",
                    "value": "443.72"
                },
                "breakup": [
                    {
                        "@ondc/org/item_id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "Farm House Pizza",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "269"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "269.0"
                            },
                            "tags": [
                                {
                                    "code": "type",
                                    "list": [
                                        {
                                            "code": "type",
                                            "value": "item"
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "C1",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "New Hand Tossed",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "0"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "0.0"
                            },
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
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "C3",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "Regular",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "0"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "0.0"
                            },
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
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "C8",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "Grilled Mushrooms",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "35"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "35.0"
                            },
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
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "48.42"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
                            "tags": [
                                {
                                    "code": "type",
                                    "list": [
                                        {
                                            "code": "type",
                                            "value": "item"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "C1",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "0.00"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
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
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "C3",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "0.00"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
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
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "C8",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "6.30"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
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
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "title": "Delivery charges",
                        "@ondc/org/title_type": "delivery",
                        "price": {
                            "currency": "INR",
                            "value": "50"
                        }
                    },
                    {
                        "@ondc/org/item_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "title": "Packing charges",
                        "@ondc/org/title_type": "packing",
                        "price": {
                            "currency": "INR",
                            "value": "25"
                        }
                    },
                    {
                        "@ondc/org/item_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "title": "Convenience Fee",
                        "@ondc/org/title_type": "misc",
                        "price": {
                            "currency": "INR",
                            "value": "10"
                        }
                    }
                ],
                "ttl": "P1D"
            },
            "settlementDetails": {
                "type": "ON-ORDER",
                "collected_by": "BAP",
                "uri": "https://snp.com/pg",
                "status": "NOT-PAID",
                "@ondc/org/buyer_app_finder_fee_type": "percent",
                "@ondc/org/buyer_app_finder_fee_amount": "3",
                "@ondc/org/settlement_basis": "delivery",
                "@ondc/org/settlement_window": "P1D",
                "@ondc/org/withholding_amount": "10.00",
                "@ondc/org/settlement_details": [
                    {
                        "settlement_counterparty": "seller-app",
                        "settlement_phase": "sale-amount",
                        "settlement_type": "upi",
                        "beneficiary_name": "Mayur",
                        "upi_address": "mayur@gmail.com",
                        "settlement_bank_account_no": "12345588548",
                        "settlement_ifsc_code": "sdsd0005685",
                        "bank_name": "ABC",
                        "branch_name": "XYZ"
                    }
                ],
                "tags": [
                    {
                        "code": "bpp_collect",
                        "list": [
                            {
                                "code": "success",
                                "value": "Y"
                            },
                            {
                                "code": "error",
                                "value": ".."
                            }
                        ]
                    }
                ]
            },
            "tags": [
                {
                    "code": "bpp_terms",
                    "list": [
                        {
                            "code": "max_liability",
                            "value": "2"
                        },
                        {
                            "code": "max_liability_cap",
                            "value": "10000.00"
                        },
                        {
                            "code": "mandatory_arbitration",
                            "value": "false"
                        },
                        {
                            "code": "court_jurisdiction",
                            "value": "Bengaluru"
                        },
                        {
                            "code": "delay_interest",
                            "value": "1000.00"
                        },
                        {
                            "code": "tax_number",
                            "value": "22AAAAA0000A1Z5"
                        }
                    ]
                }
            ],
            "city": "std:011",
            "domain": "ONDC:RET11",
            "id": "2024-11-11-878180",
            "state": "Accepted",
            "updatedQuote": {
                "price": {
                    "currency": "INR",
                    "value": "443.72"
                },
                "breakup": [
                    {
                        "@ondc/org/item_id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "Farm House Pizza",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "269"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "269.0"
                            },
                            "tags": [
                                {
                                    "code": "type",
                                    "list": [
                                        {
                                            "code": "type",
                                            "value": "item"
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "C1",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "New Hand Tossed",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "0"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "0.0"
                            },
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
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "C3",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "Regular",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "0"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "0.0"
                            },
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
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "C8",
                        "@ondc/org/item_quantity": {
                            "count": 1
                        },
                        "title": "Grilled Mushrooms",
                        "@ondc/org/title_type": "item",
                        "price": {
                            "currency": "INR",
                            "value": "35"
                        },
                        "item": {
                            "price": {
                                "currency": "INR",
                                "value": "35.0"
                            },
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
                                        }
                                    ]
                                }
                            ],
                            "parent_item_id": "KxFI47c5IA+l",
                            "quantity": {
                                "available": {
                                    "count": "99"
                                },
                                "maximum": {
                                    "count": "99"
                                }
                            }
                        }
                    },
                    {
                        "@ondc/org/item_id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "48.42"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
                            "tags": [
                                {
                                    "code": "type",
                                    "list": [
                                        {
                                            "code": "type",
                                            "value": "item"
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "C1",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "0.00"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
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
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "C3",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "0.00"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
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
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "C8",
                        "title": "Tax",
                        "@ondc/org/title_type": "tax",
                        "price": {
                            "currency": "INR",
                            "value": "6.30"
                        },
                        "item": {
                            "parent_item_id": "KxFI47c5IA+l",
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
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        "@ondc/org/item_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "title": "Delivery charges",
                        "@ondc/org/title_type": "delivery",
                        "price": {
                            "currency": "INR",
                            "value": "50"
                        }
                    },
                    {
                        "@ondc/org/item_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "title": "Packing charges",
                        "@ondc/org/title_type": "packing",
                        "price": {
                            "currency": "INR",
                            "value": "25"
                        }
                    },
                    {
                        "@ondc/org/item_id": "c461a827-f43d-487e-871d-e13467acd866",
                        "title": "Convenience Fee",
                        "@ondc/org/title_type": "misc",
                        "price": {
                            "currency": "INR",
                            "value": "10"
                        }
                    }
                ],
                "ttl": "P1D"
            },
            "documents": [
                {
                    "url": "https://invoice_url",
                    "label": "Invoice"
                }
            ],
            "locations": null
        }
    ]
}
    
   

   

    // if (isLoading) {
    //     return <OrderDetailsShimmer />
    // }
    const productBaseUrlCampaign = global?.base_urls?.campaign_image_url
    const productBaseUrl = global?.base_urls?.product_image_url
    // const refetchAll = async () => {
    //     await refetchOrderDetails()
    //     await refetchTrackData()
    // }

    const handleTotalAmount = () => {
        if (trackData?.data?.subscription) {
            if (trackData?.data?.subscription?.quantity > 0) {
                return (
                    trackData?.data?.order_amount *
                    trackData?.data?.subscription?.quantity
                )
            } else {
                return trackData?.data?.order_amount
            }
        } else {
            return trackData?.data?.order_amount
        }
    }
    // const handleOfflineClose = () => {
    //     dispatch(clearOfflinePaymentInfo())
    //     dispatch(setOrderDetailsModal(false))
    //     setOpenOfflineModal(false)
    // }
    const backgroundColorStatus = () => {
        if (trackData?.data?.offline_payment?.data?.status === 'pending') {
            return {
                color: theme.palette.info.dark,
                status: `${t('Verification Pending')}`,
            }
        }
        if (trackData?.data?.offline_payment?.data?.status === 'verified') {
            return {
                color: theme.palette.success.main,
                status: `${t('Payment Verified')}`,
            }
        }
        if (trackData?.data?.offline_payment?.data?.status === 'denied') {
            return {
                color: theme.palette.error.main,
                status: `${t('Verification Failed')}`,
            }
        }
    }
    const order = trackData.orders[0];
    const breakupItems = order.quote.breakup;

    // Extract delivery price
    const deliveryPrice = breakupItems.find(item => item["@ondc/org/title_type"] === "delivery")?.price.value;

    // Extract total tax price (sum of all tax items)
    const taxPrices = breakupItems
        .filter(item => item["@ondc/org/title_type"] === "tax")
        .reduce((total, item) => total + parseFloat(item.price.value), 0);

    console.log("Delivery Price:", deliveryPrice);  // Should print 50
    console.log("Total Tax Price:", taxPrices);      // Should print the sum of all tax values

    const backgroundColorOrderStatus = () => {
        if (trackData?.orders[0]?.fulfillments[0].state.descriptor.code === 'delivered') {
            return theme.palette.success.main
        } else if (trackData?.orders[0]?.fulfillments[0].state.descriptor.code === 'canceled') {
            return theme.palette.error.main
        } else {
            return theme.palette.info.dark
        }
    }
    // const getCommonValue = (data, key) => {
    //     return data?.data?.details[0]?.[key]
    // }
    // const handleSideDrawer = () => {
    //     dispatch(setDeliveryManInfoByDispatch(trackData?.data?.delivery_man))
    //     setOpenReviewModal(true)
    // }

    //

    // const getReviewButton = (trackData) => {
    //     if (!trackData?.data?.is_reviewed && !trackData?.data?.is_dm_reviewed) {
    //         return (
    //             <Button
    //                 onClick={handleSideDrawer}
    //                 variant="outlined"
    //                 sx={{
    //                     p: {
    //                         xs: '5px',
    //                         sm: '5px',
    //                         md: '2px 10px',
    //                     },
    //                 }}
    //             >
    //                 <Stack
    //                     alignItems="center"
    //                     justifyContent="space-between"
    //                     direction="row"
    //                     gap={{ xs: '5px', sm: '6px', md: '10px' }}
    //                     flexWrap="wrap"
    //                 >
    //                     <CustomImageContainer
    //                         src={startReview.src}
    //                         width={{ xs: '15px', md: '20px' }}
    //                         height={{ xs: '15px', md: '20px' }}
    //                     />
    //                     <CustomColouredTypography
    //                         color="primary"
    //                         fontWeight={600}
    //                         fontSize="14px"
    //                         smallFont="12px"
    //                     >
    //                         {t('Give Review')}
    //                     </CustomColouredTypography>
    //                 </Stack>
    //             </Button>
    //         )
    //     } else if (!trackData?.data?.is_reviewed) {
    //         return (
    //             <Button
    //                 onClick={handleSideDrawer}
    //                 variant="outlined"
    //                 sx={{
    //                     p: {
    //                         xs: '5px',
    //                         sm: '5px',
    //                         md: '2px 10px',
    //                     },
    //                 }}
    //             >
    //                 <Stack
    //                     alignItems="center"
    //                     justifyContent="space-between"
    //                     direction="row"
    //                     gap={{ xs: '5px', sm: '6px', md: '10px' }}
    //                     flexWrap="wrap"
    //                 >
    //                     <CustomImageContainer
    //                         src={startReview.src}
    //                         width={{ xs: '15px', md: '20px' }}
    //                         height={{ xs: '15px', md: '20px' }}
    //                     />
    //                     <CustomColouredTypography
    //                         color="primary"
    //                         fontWeight={600}
    //                         fontSize="14px"
    //                         smallFont="12px"
    //                     >
    //                         {t('Give Review')}
    //                     </CustomColouredTypography>
    //                 </Stack>
    //             </Button>
    //         )
    //     } else if (!trackData?.data?.is_dm_reviewed) {
    //         return (
    //             <Button
    //                 onClick={handleSideDrawer}
    //                 variant="outlined"
    //                 sx={{
    //                     p: {
    //                         xs: '5px',
    //                         sm: '5px',
    //                         md: '2px 10px',
    //                     },
    //                 }}
    //             >
    //                 <Stack
    //                     alignItems="center"
    //                     justifyContent="space-between"
    //                     direction="row"
    //                     gap={{ xs: '5px', sm: '6px', md: '10px' }}
    //                     flexWrap="wrap"
    //                 >
    //                     <CustomImageContainer
    //                         src={startReview.src}
    //                         width={{ xs: '15px', md: '20px' }}
    //                         height={{ xs: '15px', md: '20px' }}
    //                     />
    //                     <CustomColouredTypography
    //                         color="primary"
    //                         fontWeight={600}
    //                         fontSize="14px"
    //                         smallFont="12px"
    //                     >
    //                         {t('Give Review')}
    //                     </CustomColouredTypography>
    //                 </Stack>
    //             </Button>
    //         )
    //     } else {
    //         return null
    //     }
    // }

    return (
        <NoSsr>
            <Meta title={`Order details - ONDC`} />
            <CustomPaperBigCard
                padding={isXSmall ? '0' : '0px'}
                border={false}
                nopadding={isXSmall && 'true'}
                sx={{
                    minHeight: !isXSmall && '558px',
                    boxShadow: isXSmall && 'unset',
                    marginBottom: '1rem',
                }}
            >
                <Grid container>
                    <Grid
                        item
                        xs={12}
                        md={7}
                        padding={{ xs: '10px', sm: '20px', md: '20px' }}
                    >
                        <Stack
                            direction="row"
                            gap="10px"
                            justifyContent={{ xs: 'center', md: 'flex-start' }}
                        >
                            <Typography
                                sx={{
                                    color: 'customColor.fifteen',
                                    fontSize: '18px',
                                    fontWeight: '600',
                                }}
                            >
                               
                                    {t('Order')}{' '}
                                # {orderId}
                            </Typography>
                            {(
                                <CustomOrderStatus
                                    color={backgroundColorOrderStatus()}
                                >
                                    <Typography
                                        component="span"
                                        textTransform="capitalize"
                                        color={backgroundColorOrderStatus()}
                                        align="left"
                                        fontSize={{ xs: '13px', md: '14px' }}
                                        fontWeight="bold"
                                    >
                                        {t(
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code
                                        ).replaceAll('_', ' ')}
                                    </Typography>
                                </CustomOrderStatus>
                            )}
                            <CustomOrderStatus
                                color={theme.palette.success.main}
                            >
                                <Typography
                                    fontSize="12px"
                                    fontWeight="500"
                                    textTransform="capitalize"
                                    color={theme.palette.success.main}
                                >
                                         {t('Home Delivery')}
                                </Typography>
                            </CustomOrderStatus>
                        </Stack>
                        <Stack
                            height="100%"
                            flexDirection={{ xs: 'column', md: 'row' }}
                            gap="5px"
                            alignItems={{ md: 'left', xs: 'center' }}
                        >
                            <Stack
                                flexDirection="row"
                                gap="5px"
                                paddingInlineEnd="5px"
                                alignItems="center"
                            >
                                <Typography
                                    fontSize="12px"
                                    fontWeight={400}
                                    sx={{ color: theme.palette.text.secondary }}
                                >
                                    {t('Order date:')}
                                </Typography>
                                <Typography
                                    fontSize="12px"
                                    fontWeight={500}
                                    sx={{
                                        color: theme.palette.customColor
                                            .fifteen,
                                    }}
                                >
                                    <CustomFormatedDateTime
                                        date={
                                            trackData?.orders[0]?.billing.created_at
                                        }
                                    />
                                </Typography>
                                
                                {/*<Typography fontSize="12px" fontWeight="500" textTransform="capitalize" color={theme.palette.success.main}>*/}
                                {/*    {t(trackData?.data?.order_type).replaceAll('_', ' ')}*/}

                                {/*</Typography>*/}
                            </Stack>
                            
                        </Stack>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={5}
                        padding={{ xs: '10px', sm: '20px', md: '20px' }}
                    >
                        <Stack
                            width="100%"
                            flexDirection="row"
                            justifyContent={{
                                xs: 'center',
                                sm: 'flex-end',
                                md: 'flex-end',
                            }}
                        >
                            {trackData && (
                                <>
                                    {trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                        'delivered' &&
                                        !isTrackOrder &&
                                        getToken() && (
                                            <Stack
                                                flexDirection="row"
                                                gap="15px"
                                            >
                                                {getReviewButton(trackData)}
                                                {trackData?.data
                                                    ?.subscription === null &&
                                                    global?.repeat_order_option &&
                                                    getToken() &&
                                                    !isTrackOrder && (
                                                        <Reorder
                                                            orderData={
                                                                data?.data
                                                                    ?.details
                                                            }
                                                            orderZoneId={
                                                                trackData?.data
                                                                    ?.restaurant
                                                                    ?.zone_id
                                                            }
                                                        />
                                                    )}
                                            </Stack>
                                        )}
                                    {trackData?.data?.subscription === null &&
                                        trackData &&
                                        getToken() &&
                                        (trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                            'canceled' ||
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                                'failed') && (
                                            <Stack>
                                                {global?.repeat_order_option && (
                                                    <Reorder
                                                        orderData={
                                                            data?.data?.details
                                                        }
                                                        orderZoneId={
                                                            trackData?.data
                                                                ?.zone_id
                                                        }
                                                    />
                                                )}
                                                {trackData?.data
                                                    ?.order_status ===
                                                    'failed' && (
                                                    <PaymentUpdate
                                                        id={tempOrderId}
                                                        refetchOrderDetails={
                                                            refetchOrderDetails
                                                        }
                                                        refetchTrackData={
                                                            refetchTrackData
                                                        }
                                                        trackData={trackData}
                                                    />
                                                )}
                                            </Stack>
                                        )}
                                    {trackData &&
                                        (trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                            'accepted' ||
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                                'Pending' ||
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                                'processing' ||
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                                'confirmed' ||
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                                'handover' ||
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                                'picked_up') 
                                                && (
                                            // trackData?.data?.subscription
                                            <OrderDetailsBottom
                                                id={tempOrderId}
                                                trackData={trackData}
                                                isTrackOrder={isTrackOrder}
                                            />
                                        )
                                        }
                                </>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
                <Grid item md={12}>
                    <CustomDivider marginTop="10px" />
                </Grid>
                {isTrackOrder ? (
                    <>
                        {(
                            <TrackingPage data={trackData?.data} />
                        )}
                    </>
                ) : (
                    <>
                        <Grid
                            container
                            spacing={2}
                            padding={{ xs: '10px', sm: '15px', md: '15px' }}
                        >
                            <Grid
                                item
                                xs={12}
                                sm={7.3}
                                md={7.3}
                                display="flex"
                                flexDirection="column"
                                gap={{ xs: '15px', sm: '20px', md: '25px' }}
                            >
                                {trackData &&
                                    trackData?.data?.subscription === null &&
                                    trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                        'pending' && (
                                        <>
                                            {trackData ? (
                                                <DeliveryTimeInfoVisibility
                                                    trackData={trackData}
                                                />
                                            ) : (
                                                <GifShimmer />
                                            )}
                                        </>
                                    )}
                                {trackData &&
                                    trackData?.data &&
                                    trackData?.data?.subscription !== null && (
                                        <SubscriptionDetails
                                            subscriptionData={
                                                trackData?.data?.subscription
                                            }
                                            t={t}
                                            subscriptionSchedules={
                                                data?.data
                                                    ?.subscription_schedules
                                            }
                                            orderId={trackData?.data?.id}
                                            paymentMethod={
                                                trackData?.data?.payment_method
                                            }
                                            subscriptionCancelled={
                                                trackData?.data?.canceled_by
                                            }
                                            subscriptionCancellationReason={
                                                trackData?.data
                                                    ?.cancellation_reason
                                            }
                                            subscriptionCancellationNote={
                                                trackData?.data
                                                    ?.cancellation_note
                                            }
                                            subscriptionOrderNote={
                                                trackData?.data?.order_note
                                            }
                                            orderAmount={
                                                trackData?.data?.order_amount
                                            }
                                        />
                                    )}

                                <ProductDetailsWrapper>
                                    {trackData?.totalCount > 0 &&
                                        trackData?.orders?.map(
                                            (product, id) => (
                                                <Stack key={id}>
                                                    <Stack
                                                        flexDirection="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                    >
                                                        <Stack
                                                            flexDirection="row"
                                                            gap="17px"
                                                        >
                                                            <Stack>
                                                                {product.item_campaign_id ? (
                                                                    <CustomImageContainer
                                                                        src={product.items[0].product.descriptor.images[0]}
                                                                        height="60px"
                                                                        maxWidth="60px"
                                                                        width="100%"
                                                                        loading="lazy"
                                                                        smHeight="50px"
                                                                        borderRadius="5px"
                                                                    />
                                                                ) : (
                                                                    <CustomImageContainer
                                                                        src={product.items[0].product.descriptor.images[0]}
                                                                        height="60px"
                                                                        maxWidth="60px"
                                                                        width="100%"
                                                                        loading="lazy"
                                                                        smHeight="50px"
                                                                        borderRadius="5px"
                                                                        objectFit="contained"
                                                                    />
                                                                )}
                                                            </Stack>
                                                            <Stack>
                                                                <OrderFoodName
                                                                    fontSize="13px"
                                                                    fontWeight={
                                                                        600
                                                                    }
                                                                    color={
                                                                        theme
                                                                            .palette
                                                                            .customColor
                                                                            .fifteen
                                                                    }
                                                                >
                                                                    {
                                                                        product.items[0].product.descriptor.name
                                                                    }
                                                                </OrderFoodName>
                                                                {product
                                                                    ?.add_ons
                                                                    ?.length >
                                                                    0 && (
                                                                    <OrderFoodName
                                                                        color={
                                                                            theme
                                                                                .palette
                                                                                .customColor
                                                                                .fifteen
                                                                        }
                                                                    >
                                                                        {t(
                                                                            'Addons'
                                                                        )}
                                                                        :{' '}
                                                                        {getAddOnsNames(
                                                                            product?.add_ons
                                                                        )}
                                                                    </OrderFoodName>
                                                                )}
                                                                {product
                                                                    ?.variation
                                                                    ?.length >
                                                                    0 && (
                                                                    <>
                                                                        {getVariationNames(
                                                                            product,
                                                                            t
                                                                        )}
                                                                    </>
                                                                )}

                                                                <OrderFoodName
                                                                    color={
                                                                        theme
                                                                            .palette
                                                                            .customColor
                                                                            .fifteen
                                                                    }
                                                                >
                                                                    {t(
                                                                        'Unit Price '
                                                                    )}
                                                                    :{' '}
                                                                    {getAmount(
                                                                        product
                                                                            ?.items[0].product.price.value,
                                                                        currencySymbolDirection,
                                                                        currencySymbol,
                                                                        digitAfterDecimalPoint
                                                                    )}
                                                                </OrderFoodName>
                                                            </Stack>
                                                        </Stack>
                                                        <Stack>
                                                            <OrderFoodAmount>
                                                                {getAmount(
                                                                    product?.items[0].product.price.value *
                                                                        product?.items[0].quantity.count,
                                                                    currencySymbolDirection,
                                                                    currencySymbol,
                                                                    digitAfterDecimalPoint
                                                                )}
                                                            </OrderFoodAmount>
                                                            <OrderFoodName
                                                                color={
                                                                    theme
                                                                        .palette
                                                                        .text
                                                                        .secondary
                                                                }
                                                                textAlign="end"
                                                            >
                                                                {t('Qty')}:{' '}
                                                                {
                                                                    product?.items[0].quantity.count
                                                                }
                                                            </OrderFoodName>
                                                        </Stack>
                                                    </Stack>
                                                    {trackData?.data?.details
                                                        ?.length -
                                                        1 >
                                                        id && (
                                                        <Stack padding="15px 5px 15px 0px">
                                                            <CustomProductDivider
                                                                variant="middle"
                                                                component="div"
                                                            />
                                                        </Stack>
                                                    )}
                                                </Stack>
                                            )
                                        )}
                                </ProductDetailsWrapper>
                                {/* {trackData &&
                                    trackData?.data?.delivery_instruction && (
                                        <Stack gap="10px">
                                            <TitleTypography>
                                                {t('Instructions')}
                                            </TitleTypography>
                                            <InstructionWrapper>
                                                {trackData ? (
                                                    <Typography
                                                        component="span"
                                                        textTransform="capitalize"
                                                        align="left"
                                                        fontSize={{
                                                            xs: '12px',
                                                            sm: '12px',
                                                            md: '14px',
                                                        }}
                                                        color={
                                                            theme.palette
                                                                .neutral[400]
                                                        }
                                                    >
                                                        {t(
                                                            trackData?.data
                                                                ?.delivery_instruction
                                                        )}
                                                    </Typography>
                                                ) : (
                                                    <Skeleton
                                                        width="100px"
                                                        variant="text"
                                                    />
                                                )}
                                            </InstructionWrapper>
                                        </Stack>
                                    )}
                                {trackData &&
                                    trackData?.data?.unavailable_item_note && (
                                        <Stack gap="10px">
                                            <TitleTypography>
                                                {t('Unavailable item note')}
                                            </TitleTypography>
                                            <InstructionWrapper>
                                                {trackData ? (
                                                    <Typography
                                                        component="span"
                                                        textTransform="capitalize"
                                                        align="left"
                                                        fontSize={{
                                                            xs: '12px',
                                                            sm: '12px',
                                                            md: '14px',
                                                        }}
                                                        color={
                                                            theme.palette
                                                                .neutral[400]
                                                        }
                                                    >
                                                        {t(
                                                            trackData?.data
                                                                ?.unavailable_item_note
                                                        )}
                                                    </Typography>
                                                ) : (
                                                    <Skeleton
                                                        width="100px"
                                                        variant="text"
                                                    />
                                                )}
                                            </InstructionWrapper>
                                        </Stack>
                                    )}
                                {trackData && trackData?.data?.order_note && (
                                    <Stack gap="10px">
                                        <TitleTypography>
                                            {t('Order note')}
                                        </TitleTypography>
                                        <InstructionWrapper>
                                            {trackData ? (
                                                <Typography
                                                    component="span"
                                                    textTransform="capitalize"
                                                    align="left"
                                                    fontSize="14px"
                                                    color={
                                                        theme.palette
                                                            .neutral[400]
                                                    }
                                                >
                                                    {t(
                                                        trackData?.data
                                                            ?.order_note
                                                    )}
                                                </Typography>
                                            ) : (
                                                <Skeleton
                                                    width="100px"
                                                    variant="text"
                                                />
                                            )}
                                        </InstructionWrapper>
                                    </Stack>
                                )} */}
                                <Stack gap="25px">
                                    <TitleTypography>
                                        {t('Restaurants Information')}
                                    </TitleTypography>
                                    <IformationGrid>
                                        <Stack
                                            flexDirection="row"
                                            gap="16px"
                                            alignItems="center"
                                        >
                                            <Stack>
                                                {trackData && (
                                                    <CustomImageContainer
                                                        src={trackData?.orders[0]?.provider?.descriptor?.images[0]}
                                                        height="80px"
                                                        width="80px"
                                                        borderRadius=".5rem"
                                                        objectFit="contain"
                                                    />
                                                )}
                                            </Stack>
                                            <Stack>
                                                <InfoTypography
                                                    sx={{ fontWeight: '500' }}
                                                >
                                                    {trackData?.orders[0]?.provider?.descriptor?.name}
                                                </InfoTypography>
                                                <InfoTypography>
                                                    {t('Address')}
                                                    {
                                                        trackData?.orders[0]?.fulfillments?.start?.location?.address?.locality} { trackData?.orders[0]?.fulfillments?.start?.location?.address?.city} {trackData?.orders[0]?.fulfillments?.start?.location?.address?.area_code} {trackData?.orders[0]?.fulfillments?.start?.location?.address?.state}
                                                </InfoTypography>
                                            </Stack>
                                        </Stack>

                                        {trackData &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'delivered' &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'failed' &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'canceled' &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'refunded' &&
                                            trackData?.data?.restaurant
                                                ?.restaurant_model ===
                                                'subscription' &&
                                            Number.parseInt(
                                                trackData?.data?.restaurant
                                                    ?.restaurant_sub?.chat
                                            ) === 1 &&
                                            getToken() && (
                                                <Stack
                                                    justifyContent="flex-end"
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname: '/info',
                                                            query: {
                                                                page: 'inbox',
                                                                type: 'vendor',
                                                                id: trackData
                                                                    ?.data
                                                                    ?.restaurant
                                                                    .vendor_id,
                                                                routeName:
                                                                    'vendor_id',
                                                                chatFrom:
                                                                    'true',
                                                            },
                                                        }}
                                                    >
                                                        <ChatIcon
                                                            sx={{
                                                                height: 25,
                                                                width: 25,
                                                                color: (
                                                                    theme
                                                                ) =>
                                                                    theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                            }}
                                                        ></ChatIcon>
                                                    </Link>
                                                </Stack>
                                            )}
                                        {trackData &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'delivered' &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'failed' &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'canceled' &&
                                            trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                                'refunded' &&
                                            trackData?.data?.restaurant
                                                ?.restaurant_model ===
                                                'commission' &&
                                            getToken() && (
                                                <Stack
                                                    justifyContent="flex-end"
                                                    sx={{ cursor: 'pointer' }}
                                                >
                                                    <Link
                                                        href={{
                                                            pathname: '/info',
                                                            query: {
                                                                page: 'inbox',
                                                                type: 'vendor',
                                                                id: trackData
                                                                    ?.data
                                                                    ?.restaurant
                                                                    .vendor_id,
                                                                routeName:
                                                                    'vendor_id',
                                                                chatFrom:
                                                                    'true',
                                                                restaurantName:
                                                                    trackData
                                                                        ?.data
                                                                        ?.restaurant
                                                                        ?.name,
                                                                logo: trackData
                                                                    ?.data
                                                                    ?.restaurant
                                                                    ?.logo,
                                                            },
                                                        }}
                                                    >
                                                        <ChatIcon
                                                            sx={{
                                                                height: 25,
                                                                width: 25,
                                                                color: (
                                                                    theme
                                                                ) =>
                                                                    theme
                                                                        .palette
                                                                        .primary
                                                                        .main,
                                                            }}
                                                        ></ChatIcon>
                                                    </Link>
                                                </Stack>
                                            )}
                                    </IformationGrid>
                                    {trackData?.data?.delivery_man &&
                                        trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                            'delivered' &&
                                        trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                            'failed' &&
                                        trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                            'canceled' &&
                                        trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                            'refunded' &&
                                        getToken() && (
                                            <Stack gap="25px">
                                                <TitleTypography>
                                                    {t(
                                                        'Delivery Man Information'
                                                    )}
                                                </TitleTypography>
                                                <IformationGrid
                                                    bgColor={
                                                        theme.palette.sectionBg
                                                    }
                                                >
                                                    <Stack
                                                        direction="row"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        spacing={2}
                                                    >
                                                        <Stack>
                                                            {trackData && (
                                                                <CustomImageContainer
                                                                    src={trackData?.data?.delivery_man?.image_full_url}
                                                                    height="80px"
                                                                    width="80px"
                                                                    borderRadius=".5rem"
                                                                    objectFit="cover"
                                                                    alt={
                                                                        trackData
                                                                            ?.data
                                                                            ?.delivery_man
                                                                            ?.f_name
                                                                    }
                                                                />
                                                            )}
                                                        </Stack>
                                                        <Stack alignItems="flex-start">
                                                            <Typography
                                                                fontSize="16px"
                                                                fontweight="500"
                                                            >
                                                                {trackData?.data?.delivery_man?.f_name.concat(
                                                                    ' ',
                                                                    trackData
                                                                        ?.data
                                                                        ?.delivery_man
                                                                        ?.l_name
                                                                )}
                                                            </Typography>
                                                            <InfoTypography
                                                                sx={{
                                                                    fontWeight:
                                                                        'bold',
                                                                }}
                                                            >
                                                                {trackData &&
                                                                    trackData?.data?.delivery_man?.avg_rating?.toFixed(
                                                                        1
                                                                    )}
                                                                {/* <StarIcon
                                                                    sx={{
                                                                        marginLeft:
                                                                            '4px',
                                                                        fontSize:
                                                                            '16px',
                                                                        color: (
                                                                            theme
                                                                        ) =>
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .main,
                                                                    }}
                                                                />{' '} */}
                                                            </InfoTypography>
                                                        </Stack>
                                                    </Stack>
                                                    <Stack
                                                        direction="row"
                                                        spacing={2}
                                                    >
                                                        {/*<Typography>call</Typography>*/}
                                                        <Stack
                                                            sx={{
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <Link
                                                                href={{
                                                                    pathname:
                                                                        '/info',
                                                                    query: {
                                                                        page: 'inbox',
                                                                        type: 'delivery_man',
                                                                        id: trackData
                                                                            ?.data
                                                                            ?.delivery_man
                                                                            ?.id,
                                                                        routeName:
                                                                            'delivery_man_id',
                                                                        chatFrom:
                                                                            'true',
                                                                        restaurantName:
                                                                            trackData
                                                                                ?.data
                                                                                ?.delivery_man
                                                                                ?.f_name,
                                                                        logo: trackData
                                                                            ?.data
                                                                            ?.delivery_man
                                                                            ?.image,
                                                                    },
                                                                }}
                                                            >
                                                                <ChatIcon
                                                                    sx={{
                                                                        height: 25,
                                                                        width: 25,
                                                                        color: (
                                                                            theme
                                                                        ) =>
                                                                            theme
                                                                                .palette
                                                                                .primary
                                                                                .main,
                                                                    }}
                                                                ></ChatIcon>
                                                            </Link>
                                                        </Stack>
                                                    </Stack>
                                                </IformationGrid>
                                            </Stack>
                                        )}

                                    <Stack gap="15px">
                                        <TitleTypography>
                                            {t('Payment Information')}
                                        </TitleTypography>
                                        <ProductDetailsWrapper
                                            isVerfired={
                                                trackData?.offline_payment?.data
                                                    ?.status === 'verified'
                                            }
                                        >
                                            {(trackData?.data
                                                ?.payment_method ===
                                                'offline_payment' ||
                                                trackData?.data
                                                    ?.offline_payment !==
                                                    null) && (
                                                <OfflineOrderDetails
                                                    trackData={trackData?.data}
                                                />
                                            )}
                                            {trackData?.data?.payment_method !==
                                                'offline_payment' && (
                                                <Stack
                                                    direction={{
                                                        xs: 'column',
                                                        sm: 'row',
                                                        md: 'row',
                                                    }}
                                                    justifyContent="space-between"
                                                >
                                                    <Stack direction="row">
                                                        <Typography
                                                            color={
                                                                theme.palette
                                                                    .neutral[400]
                                                            }
                                                            fontSize="14px"
                                                            fontWeight={400}
                                                            sx={{
                                                                textTransform:
                                                                    'capitalize',
                                                                wordWrap:
                                                                    'break-word',
                                                            }}
                                                        >
                                                            {t('Method')}
                                                        </Typography>
                                                        <Typography
                                                            fontSize="14px"
                                                            fontWeight="400"
                                                            color={
                                                                theme.palette
                                                                    .neutral[400]
                                                            }
                                                            sx={{
                                                                textTransform:
                                                                    'capitalize',
                                                                wordWrap:
                                                                    'break-word',
                                                            }}
                                                        >
                                                            {' '}
                                                            &nbsp;&nbsp;&nbsp;:
                                                            &nbsp;&nbsp;{' '}
                                                            {trackData?.data
                                                                ?.offline_payment !==
                                                                null &&
                                                            trackData?.data
                                                                ?.payment_method !==
                                                                'partial_payment'
                                                                ? `${t(
                                                                      'Offline Payment'
                                                                  )}`
                                                                : `${t(
                                                                      trackData
                                                                          ?.data
                                                                          ?.payment_method
                                                                  ).replaceAll(
                                                                      '_',
                                                                      ' '
                                                                  )}`}
                                                        </Typography>
                                                    </Stack>
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <Typography
                                                            fontSize="14px"
                                                            fontWeight="400"
                                                            color={
                                                                theme.palette
                                                                    .neutral[400]
                                                            }
                                                            sx={{
                                                                textTransform:
                                                                    'capitalize',
                                                                wordWrap:
                                                                    'break-word',
                                                            }}
                                                            align="left"
                                                        >
                                                            {t(
                                                                'Payment Status'
                                                            )}
                                                        </Typography>
                                                        &nbsp;&nbsp;&nbsp;:
                                                        &nbsp;&nbsp;
                                                        
                                                         
                                                            <Typography
                                                                sx={{
                                                                    fontWeight:
                                                                        '400',
                                                                    fontSize:
                                                                        '14px',
                                                                }}
                                                                align="left"
                                                            >
                                                                {trackData &&
                                                                trackData?.orders[0]
                                                                    ?.paymentStatus ===
                                                                    'PAID' ? (
                                                                    <span
                                                                        style={{
                                                                            color: `${theme.palette.success.main}`,
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'Paid'
                                                                        )}
                                                                    </span>
                                                                ) : (
                                                                    <span
                                                                        style={{
                                                                            color: 'red',
                                                                        }}
                                                                    >
                                                                        {t(
                                                                            'Unpaid'
                                                                        )}
                                                                    </span>
                                                                )}
                                                            </Typography>
                                                        
                                                    </Stack>
                                                </Stack>
                                            )}
                                            {global?.order_delivery_verification && (
                                                <Stack direction="row">
                                                    <Typography
                                                        color={
                                                            theme.palette
                                                                .neutral[400]
                                                        }
                                                        fontSize="14px"
                                                        fontWeight={400}
                                                        sx={{
                                                            textTransform:
                                                                'capitalize',
                                                            wordWrap:
                                                                'break-word',
                                                        }}
                                                    >
                                                        {t('Order Otp')}
                                                    </Typography>
                                                    <Typography
                                                        fontSize="14px"
                                                        fontWeight="400"
                                                        color={
                                                            theme.palette
                                                                .neutral[400]
                                                        }
                                                        sx={{
                                                            textTransform:
                                                                'capitalize',
                                                            wordWrap:
                                                                'break-word',
                                                        }}
                                                    >
                                                        {' '}
                                                        &nbsp;&nbsp;&nbsp;:
                                                        &nbsp;&nbsp;{' '}
                                                        {trackData?.data?.otp}
                                                    </Typography>
                                                </Stack>
                                            )}
                                        </ProductDetailsWrapper>
                                    </Stack>
                                    {trackData?.data?.refund && (
                                        <Stack width="100%" mt=".5rem">
                                            <Stack
                                                spacing={1}
                                                alignItems="center"
                                                direction="row"
                                            >
                                                {trackData?.data?.refund &&
                                                trackData?.data
                                                    ?.order_status ===
                                                    'refund_request_canceled' ? (
                                                    <Refund
                                                        t={t}
                                                        title="Refund cancellation"
                                                        note={
                                                            trackData?.data
                                                                ?.refund
                                                                ?.admin_note
                                                        }
                                                    />
                                                ) : (
                                                    trackData?.data
                                                        ?.order_status ===
                                                        'refund_requested' && (
                                                        <Refund
                                                            t={t}
                                                            title="Refund request"
                                                            note={
                                                                trackData?.data
                                                                    ?.refund
                                                                    ?.customer_note
                                                            }
                                                            reason={
                                                                trackData?.data
                                                                    ?.refund
                                                                    ?.customer_reason
                                                            }
                                                            image={
                                                                trackData?.data
                                                                    ?.refund
                                                                    ?.image_full_url
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Stack>
                                        </Stack>
                                    )}
                                    {trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                        'canceled' && (
                                        <Stack spacing={1.2}>
                                            <TitleTypography>
                                                {t('Cancellation Note')}
                                            </TitleTypography>
                                            <Stack
                                                padding="20px 16px"
                                                borderRadius="10px"
                                                backgroundColor={alpha(
                                                    theme.palette.nonVeg,
                                                    0.1
                                                )}
                                            >
                                                <Typography
                                                    fontSize="14px"
                                                    color={
                                                        theme.palette
                                                            .neutral[400]
                                                    }
                                                >
                                                    {
                                                        trackData?.data
                                                            ?.cancellation_reason
                                                    }
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    )}
                                </Stack>
                            </Grid>
                            <Grid item sm={4.7} xs={12}>
                                <OrderSummaryGrid
                                    container
                                    sx={{
                                        position: 'sticky',
                                        top: { xs: '90px', md: '130px' },
                                        zIndex: 9,
                                        background: (theme) =>
                                            theme.palette.neutral[100],
                                        borderRadius: '5px',
                                    }}
                                >
                                    <Grid item md={12} xs={12}>
                                        <Typography
                                            fontSize="16px"
                                            lineHeight="28px"
                                            fontWeight={500}
                                            sx={{
                                                paddingBlock: '12px',
                                                color: theme.palette
                                                    .neutral[1000],
                                            }}
                                        >
                                            {t('Summary')}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        container
                                        item
                                        md={12}
                                        xs={12}
                                        spacing={1}
                                    >
                                        <Grid item md={7} xs={8}>
                                            <InfoTypography>
                                                {t('Items Price')}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={5} xs={4}>
                                            <InfoTypography align="right">
                                                {trackData &&
                                                    getAmount(
                                                        getItemsPrice(
                                                            trackData?.orders[0]
                                                        ),
                                                        currencySymbolDirection,
                                                        currencySymbol,
                                                        digitAfterDecimalPoint
                                                    )}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={8} xs={8}>
                                            <InfoTypography>
                                                {t('Addons Price')}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={4} xs={4}>
                                            <InfoTypography align="right">
                                                (-) &nbsp;
                                                {/* {trackData &&
                                                    getAmount(
                                                        getAddOnsPrice(
                                                            trackData?.data?.details
                                                        ),
                                                        currencySymbolDirection,
                                                        currencySymbol,
                                                        digitAfterDecimalPoint
                                                    )} */}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={7} xs={8}>
                                            <InfoTypography>
                                                {t('Discount')}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={5} xs={4}>
                                            <InfoTypography align="right">
                                                (-)
                                                <InfoTypography
                                                    component="span"
                                                    marginLeft="4px"
                                                >
                                                    {/* {trackData &&
                                                    trackData?.data
                                                        ?.restaurant_discount_amount
                                                        ? getAmount(
                                                              trackData?.data
                                                                  ?.restaurant_discount_amount,
                                                              currencySymbolDirection,
                                                              currencySymbol,
                                                              digitAfterDecimalPoint
                                                          )
                                                        : getAmount(
                                                              0,
                                                              currencySymbolDirection,
                                                              currencySymbol,
                                                              digitAfterDecimalPoint
                                                          )} */}
                                                </InfoTypography>
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={8} xs={8}>
                                            <InfoTypography>
                                                {t('Coupon Discount')}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={4} xs={4}>
                                            <InfoTypography align="right">
                                                (-)
                                                <InfoTypography
                                                    component="span"
                                                    marginLeft="4px"
                                                >
                                                    {/* {trackData &&
                                                        getAmount(
                                                            trackData?.data
                                                                ?.coupon_discount_amount,
                                                            currencySymbolDirection,
                                                            currencySymbol,
                                                            digitAfterDecimalPoint
                                                        )} */}
                                                </InfoTypography>
                                            </InfoTypography>
                                        </Grid>
                                        {trackData?.data?.ref_bonus_amount >
                                        0 ? (
                                            <>
                                                <Grid item md={8} xs={8}>
                                                    <InfoTypography>
                                                        {t('Referral Discount')}
                                                    </InfoTypography>
                                                </Grid>
                                                <Grid item md={4} xs={4}>
                                                    <InfoTypography align="right">
                                                        (-)
                                                        <InfoTypography
                                                            component="span"
                                                            marginLeft="4px"
                                                        >
                                                            {trackData &&
                                                                getAmount(
                                                                    trackData
                                                                        ?.data
                                                                        ?.ref_bonus_amount,
                                                                    currencySymbolDirection,
                                                                    currencySymbol,
                                                                    digitAfterDecimalPoint
                                                                )}
                                                        </InfoTypography>
                                                    </InfoTypography>
                                                </Grid>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                        {trackData?.data
                                            ?.extra_packaging_amount > 0 ? (
                                            <>
                                                <Grid item md={8} xs={8}>
                                                    <InfoTypography>
                                                        {t(
                                                            'Extra Packaging Charge'
                                                        )}
                                                    </InfoTypography>
                                                </Grid>
                                                <Grid item md={4} xs={4}>
                                                    <InfoTypography align="end">
                                                        (+)
                                                        <InfoTypography
                                                            component="span"
                                                            marginLeft="4px"
                                                        >
                                                            {trackData &&
                                                                getAmount(
                                                                    trackData
                                                                        ?.data
                                                                        ?.extra_packaging_amount,
                                                                    currencySymbolDirection,
                                                                    currencySymbol,
                                                                    digitAfterDecimalPoint
                                                                )}
                                                        </InfoTypography>
                                                    </InfoTypography>
                                                </Grid>
                                            </>
                                        ) : (
                                            ''
                                        )}
                                        <Grid item md={8} xs={8}>
                                            <InfoTypography>
                                                {t('VAT/TAX')}(
                                                {getRestaurantValue(
                                                    trackData,
                                                    'tax'
                                                )}
                                                %{' '}
                                                {
                                                    t('Included')}{' '}
                                                )
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={4} xs={4} align="end">
                                            <InfoTypography>
                                                
                                                <InfoTypography
                                                    component="span"
                                                    marginLeft="4px"
                                                >
                                                    {/* {taxPrices} */}
                                                    {trackData &&
                                                        getAmount(
                                                            taxPrices,
                                                            currencySymbolDirection,
                                                            currencySymbol,
                                                            digitAfterDecimalPoint
                                                        )}
                                                </InfoTypography>
                                            </InfoTypography>
                                        </Grid>
                                        {trackData &&
                                            trackData?.data?.dm_tips > 0 && (
                                                <>
                                                    <Grid item md={8} xs={8}>
                                                        <InfoTypography>
                                                            {t(
                                                                'Delivery man tips'
                                                            )}
                                                        </InfoTypography>
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <InfoTypography align="right">
                                                            {getAmount(
                                                                trackData?.data
                                                                    ?.dm_tips,
                                                                currencySymbolDirection,
                                                                currencySymbol,
                                                                digitAfterDecimalPoint
                                                            )}
                                                        </InfoTypography>
                                                    </Grid>
                                                </>
                                            )}
                                        {trackData &&
                                            global?.additional_charge_status ===
                                                1 && (
                                                <>
                                                    <Grid item md={8} xs={8}>
                                                        <InfoTypography>
                                                            {t(
                                                                global?.additional_charge_name
                                                            )}
                                                        </InfoTypography>
                                                    </Grid>
                                                    <Grid item md={4} xs={4}>
                                                        <InfoTypography align="right">
                                                            {getAmount(
                                                                trackData?.data
                                                                    ?.additional_charge,
                                                                currencySymbolDirection,
                                                                currencySymbol,
                                                                digitAfterDecimalPoint
                                                            )}
                                                        </InfoTypography>
                                                    </Grid>
                                                </>
                                            )}
                                        <Grid item md={8} xs={8}>
                                            <InfoTypography>
                                                {t('Delivery fee')}
                                            </InfoTypography>
                                        </Grid>
                                        <Grid item md={4} xs={4}>
                                            <InfoTypography align="right">
                                            {getAmount(
                                                               deliveryPrice,
                                                                currencySymbolDirection,
                                                                currencySymbol,
                                                                digitAfterDecimalPoint
                                                            )}
                                            </InfoTypography>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12} xs={12} mb="10px">
                                        <Stack
                                            width="100%"
                                            sx={{
                                                mt: '12px',
                                                borderBottom: `0.088rem dashed ${theme.palette.neutral[300]}`,
                                            }}
                                        ></Stack>
                                    </Grid>
                                    <TotalGrid container md={12} xs={12}>
                                        <Grid item md={8} xs={8}>
                                            <Typography
                                                fontSize="16px"
                                                fontWeight="400"
                                                sx={{
                                                    color: theme.palette
                                                        .neutral[400],
                                                }}
                                            >
                                                {t('Total')}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={4} xs={4} align="right">
                                            <Typography
                                                fontWeight="400"
                                                color={
                                                    theme.palette.neutral[400]
                                                }
                                            >
                                                {trackData &&
                                                    getAmount(
                                                        Number(trackData?.orders[0]?.items[0]?.product?.price?.value)+Number(deliveryPrice)+Number(taxPrices),
                                                        currencySymbolDirection,
                                                        currencySymbol,
                                                        digitAfterDecimalPoint
                                                    )}
                                            </Typography>
                                        </Grid>
                                        {trackData?.data?.subscription !==
                                            null && (
                                            <>
                                                {/* <Grid
                                                    item
                                                    md={8}
                                                    xs={8}
                                                    pt=".5rem"
                                                    pb=".5rem"
                                                >
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                    >
                                                        <InfoTypography>
                                                            {`${t(
                                                                'Total Delivered'
                                                            )} (${
                                                                trackData?.data
                                                                    ?.subscription
                                                                    ?.delivered_count
                                                            })`}
                                                        </InfoTypography>
                                                        <CustomTooltip
                                                            title={`${trackData?.data?.subscription?.delivered_count} ${tip_text} ${trackData?.data?.subscription?.quantity}`}
                                                            arrow
                                                            placement="top"
                                                        >
                                                            <InfoIcon
                                                                sx={{
                                                                    fontSize:
                                                                        '20px',
                                                                    color: (
                                                                        theme
                                                                    ) =>
                                                                        theme
                                                                            .palette
                                                                            .info
                                                                            .main,
                                                                }}
                                                            />
                                                        </CustomTooltip>
                                                    </Stack>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={4}
                                                    xs={4}
                                                    pt=".5rem"
                                                    pb=".5rem"
                                                >
                                                    <InfoTypography align="right">
                                                        (-)
                                                        {getAmount(
                                                            trackData?.data
                                                                ?.subscription
                                                                ?.paid_amount,
                                                            currencySymbolDirection,
                                                            currencySymbol,
                                                            digitAfterDecimalPoint
                                                        )}
                                                    </InfoTypography>
                                                </Grid> */}
                                                <Grid item md={8} xs={8}>
                                                    <Typography fontWeight="600">
                                                        {t('Due')}
                                                    </Typography>
                                                </Grid>
                                                <Grid item md={4} xs={4}>
                                                    <Typography
                                                        fontWeight="600"
                                                        align="right"
                                                    >
                                                        {getAmount(
                                                            0,
                                                            currencySymbolDirection,
                                                            currencySymbol,
                                                            digitAfterDecimalPoint
                                                        )}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        )}
                                        {/* {trackData &&
                                            trackData?.data?.subscription !==
                                                null &&
                                            trackData?.data?.subscription
                                                ?.status !== 'canceled' && (
                                                //this bottom actions are for subscriptions order
                                                <BottomActions
                                                    subscriptionId={
                                                        trackData?.data
                                                            ?.subscription?.id
                                                    }
                                                    t={t}
                                                    minDate={
                                                        trackData?.data
                                                            ?.subscription
                                                            ?.start_at
                                                    }
                                                    maxDate={
                                                        trackData?.data
                                                            ?.subscription
                                                            ?.end_at
                                                    }
                                                />
                                            )} */}
                                        {trackData?.data
                                            ?.partially_paid_amount &&
                                        trackData?.orders[0]?.fulfillments[0].state.descriptor.code !==
                                            'canceled' ? (
                                            <>
                                                <Grid item md={8} xs={8}>
                                                    <Typography
                                                        textTransform="capitalize"
                                                        variant="h5"
                                                    >
                                                        {t('Paid by wallet')}
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    md={4}
                                                    xs={4}
                                                    align="right"
                                                >
                                                    <Typography variant="h5">
                                                        (-){' '}
                                                        {trackData &&
                                                            getAmount(
                                                                trackData?.data
                                                                    ?.partially_paid_amount,
                                                                currencySymbolDirection,
                                                                currencySymbol,
                                                                digitAfterDecimalPoint
                                                            )}
                                                    </Typography>
                                                </Grid>
                                            </>
                                        ) : null}

                                        {trackData?.data?.payment_method ===
                                        'partial_payment' ? (
                                            <>
                                                {trackData?.data?.payments[1]
                                                    ?.payment_status ===
                                                'unpaid' ? (
                                                    <>
                                                        {' '}
                                                        <Grid
                                                            item
                                                            md={8}
                                                            xs={8}
                                                        >
                                                            <Typography
                                                                textTransform="capitalize"
                                                                variant="h5"
                                                            >
                                                                {t(
                                                                    'Due Payment'
                                                                )}{' '}
                                                                (
                                                                {trackData &&
                                                                    t(
                                                                        trackData
                                                                            ?.data
                                                                            ?.payments[1]
                                                                            ?.payment_method
                                                                    ).replaceAll(
                                                                        '_',
                                                                        ' '
                                                                    )}
                                                                )
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            md={4}
                                                            xs={4}
                                                            align="right"
                                                        >
                                                            <Typography variant="h5">
                                                                {trackData &&
                                                                    getAmount(
                                                                        trackData
                                                                            ?.data
                                                                            ?.order_amount -
                                                                            trackData
                                                                                ?.data
                                                                                ?.partially_paid_amount,
                                                                        currencySymbolDirection,
                                                                        currencySymbol,
                                                                        digitAfterDecimalPoint
                                                                    )}
                                                            </Typography>
                                                        </Grid>
                                                    </>
                                                ) : (
                                                    <>
                                                        {' '}
                                                        <Grid
                                                            item
                                                            md={8}
                                                            xs={8}
                                                        >
                                                            <Typography
                                                                textTransform="capitalize"
                                                                variant="h5"
                                                            >
                                                                {t('Paid By')} (
                                                                {trackData &&
                                                                    t(
                                                                        trackData
                                                                            ?.data
                                                                            ?.payments[1]
                                                                            ?.payment_method
                                                                    ).replaceAll(
                                                                        '_',
                                                                        ' '
                                                                    )}
                                                                )
                                                            </Typography>
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            md={4}
                                                            xs={4}
                                                            align="right"
                                                        >
                                                            <Typography variant="h5">
                                                                {trackData &&
                                                                    getAmount(
                                                                        trackData
                                                                            ?.data
                                                                            ?.order_amount -
                                                                            trackData
                                                                                ?.data
                                                                                ?.partially_paid_amount,
                                                                        currencySymbolDirection,
                                                                        currencySymbol,
                                                                        digitAfterDecimalPoint
                                                                    )}
                                                            </Typography>
                                                        </Grid>
                                                    </>
                                                )}
                                            </>
                                        ) : null}
                                    </TotalGrid>
                                    {global?.refund_active_status &&
                                        trackData?.orders[0]?.fulfillments[0].state.descriptor.code ===
                                            'delivered' &&
                                        trackData &&
                                        trackData?.data?.subscription ===
                                            null &&
                                        getToken() && (
                                            <RefundButton
                                                variant="outlined"
                                                onClick={() =>
                                                    setOpenModal(true)
                                                }
                                            >
                                                {t('Refund Request')}
                                            </RefundButton>
                                        )}
                                </OrderSummaryGrid>
                            </Grid>
                        </Grid>
                    </>
                )}
            </CustomPaperBigCard>
            {/* {getToken() && orderDetailsModal && (
                <CustomModal
                    maxWidth="670px"
                    openModal={openOfflineModal}
                    setModalOpen={setOpenOfflineModal}
                >
                    <CustomStackFullWidth
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        sx={{ position: 'relative' }}
                    >
                        <IconButton
                            onClick={() => setOpenOfflineModal(false)}
                            sx={{
                                zIndex: '99',
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                backgroundColor: (theme) =>
                                    theme.palette.neutral[100],
                                borderRadius: '50%',
                                [theme.breakpoints.down('md')]: {
                                    top: 10,
                                    right: 5,
                                },
                            }}
                        >
                            <CloseIcon
                                sx={{ fontSize: '24px', fontWeight: '500' }}
                            />
                        </IconButton>
                    </CustomStackFullWidth>
                    <OfflineDetailsModal
                        trackData={trackData?.data}
                        // trackDataIsLoading={trackDataIsLoading}
                        // trackDataIsFetching={trackDataIsFetching}
                        handleOfflineClose={handleOfflineClose}
                    />
                </CustomModal>
            )} */}
            {/*{*/}
            {/*    trackData &&*/}
            {/*    trackData?.data?.subscription !== null &&*/}
            {/*    trackData?.data?.subscription?.status !== 'canceled' && (*/}
            {/*        //this bottom actions are for subscriptions order*/}
            {/*        <BottomActions*/}
            {/*            refetchAll={refetchAll}*/}
            {/*            subscriptionId={trackData?.data?.subscription?.id}*/}
            {/*            t={t}*/}
            {/*            minDate={trackData?.data?.subscription?.start_at}*/}
            {/*            maxDate={trackData?.data?.subscription?.end_at}*/}
            {/*        />*/}
            {/*    )*/}
            {/*}*/}

            {/* <RefundModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                reasons={reasonsData?.refund_reasons}
                formSubmit={''}
            /> */}
            <ReviewSideDrawer
                open={openReviewModal}
                onClose={() => setOpenReviewModal(false)}
                orderId={trackData.orders[0]._id}
                refetchTrackData={""}
                is_reviewed={trackData?.data?.is_reviewed}
                is_dm_reviewed={trackData?.data?.is_dm_reviewed}
            />
        </NoSsr>
    )
}

export default OrderDetails
