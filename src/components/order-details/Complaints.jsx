import React, { useEffect, useState } from 'react'
import { Box, Grid, Stack } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useQuery } from 'react-query'
import { OrderApi } from '../../hooks/react-query/config/orderApi'
import { useTranslation } from 'react-i18next'
import CustomShimmerCard from '../customShimmerForProfile/CustomShimmerCard'
import CustomePagination from '../pagination/Pagination'
import {
    CustomPaperBigCard,
    CustomStackFullWidth,
    NoDataFoundWrapper,
} from '../../styled-components/CustomStyles.style'
import { useTheme } from '@mui/material/styles'
import { setOrderType } from '../../redux/slices/orderType'
import useMediaQuery from '@mui/material/useMediaQuery'
import { onSingleErrorResponse } from '../ErrorResponse'
import CustomEmptyResult from '../empty-view/CustomEmptyResult'

export const buttonsData = [
    { title: 'Ongoing', value: 'Created,Accepted,In-progress' },
    { title: 'Completed', value: 'Completed' },
    { title: 'Cancelled', value: 'Cancelled' },
]
import Meta from '../Meta'
import { noOrderFound } from '../../utils/LocalImages'
import { useRouter } from 'next/router'
import OrderCard from '../order-history/OrderCard'
import OutlinedGroupButtons from '../order-history/OutLineGroupButtons'
import TicketCard from '../ticket/TicketCard'

const ComplaintHistory = () => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const router = useRouter()
    const route = router.query;
    const { t } = useTranslation()
    const { global } = useSelector((state) => state.globalSettings)
    const [limit, setLimit] = useState(10)
    const [offset, setOffset] = useState(1)
    const isXSmall = useMediaQuery(theme.breakpoints.down('sm'))
    // const isLoading = false;
    // const isError = false;
    // const error = {};
    // const refetch = ()=>{}
    
    const { isLoading, data, isError, error, refetch } = useQuery(
        [  limit, offset],
        () => OrderApi.ticketHistory( limit, offset),
        {
            onError: onSingleErrorResponse,
            select: (data) => {
                // Transform ONDC API response to match existing structure
                return {
                    data: {
                        issues: data.issues,
                        total_size: data.totalCount // Use totalCount from new format
                    }
                }
            }
        }
    )
   
    // const data = {data:{
    //     issues:  [
    //         {
    //           "_id": "6772c845714e7ba2f09856a4",
    //           "transaction_id": "f725352d-3482-43d7-b0bb-80fde47dd54b",
    //           "__v": 0,
    //           "bppId": "pramaan.ondc.org/alpha/mock-server",
    //           "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
    //           "category": "FULFILLMENT",
    //           "complainant_info": {
    //             "person": {
    //               "name": "Nausheen"
    //             },
    //             "contact": {
    //               "phone": 8718914719
    //             }
    //           },
    //           "created_at": "2024-12-30T16:20:20.880Z",
    //           "description": {
    //             "short_desc": "sbdhdbmdlbnld",
    //             "long_desc": "nccjfigooypu[u;k guirifioto",
    //             "additional_desc": {
    //               "url": "https://buyerapp.com/additonal-details/desc.txt",
    //               "content_type": "text/plain"
    //             },
    //             "images": []
    //           },
    //           "domain": "ONDC:RET11",
    //           "issueId": "cfd7d719-d902-4c65-b322-521ad2702446",
    //           "issue_actions": {
    //             "complainant_actions": [
    //               {
    //                 "complainant_action": "OPEN",
    //                 "short_desc": "Complaint created",
    //                 "updated_at": "2024-12-30T16:20:21.349Z",
    //                 "updated_by": {
    //                   "org": {
    //                     "name": "ondcstg.nazarasdk.com::ONDC:RET11"
    //                   },
    //                   "contact": {
    //                     "phone": "8718914719",
    //                     "email": "nausheen.khan@openplaytech.com"
    //                   },
    //                   "person": {
    //                     "name": "Nausheen"
    //                   }
    //                 }
    //               }
    //             ],
    //             "respondent_actions": [
    //               {
    //                 "respondent_action": "PROCESSING",
    //                 "short_desc": "Complaint is being processed",
    //                 "updated_at": "2024-12-30T16:20:21.421Z",
    //                 "updated_by": {
    //                   "org": {
    //                     "name": "pramaan.ondc.org/alpha/mock-server::ONDC:RET11"
    //                   },
    //                   "contact": {
    //                     "phone": "9450394140",
    //                     "email": "mayur@gmail.com"
    //                   },
    //                   "person": {
    //                     "name": "Mayur"
    //                   }
    //                 },
    //                 "cascaded_level": 1
    //               }
    //             ]
    //           },
    //           "issue_status": "Open",
    //           "message_id": "5f2fc51d-c500-47c2-a88e-e8451848348a",
    //           "order_details": {
    //             "id": "2024-12-06-951477",
    //             "state": "Created",
    //             "items": [
    //               {
    //                 "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
    //                 "quantity": {
    //                   "count": 1
    //                 },
    //                 "product": {
    //                   "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
    //                   "name": "Farm House Pizza",
    //                   "cancellation_status": "",
    //                   "return_status": "",
    //                   "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
    //                   "fulfillment_status": "Pending",
    //                   "customizations": {
    //                     "C8": {
    //                       "title": "Grilled Mushrooms",
    //                       "price": {
    //                         "title": "1 * Base Price",
    //                         "value": "35.00"
    //                       },
    //                       "quantityMessage": "Quantity: 1",
    //                       "textClass": "",
    //                       "quantity": 1,
    //                       "fulfillment_status": "Pending",
    //                       "tax": {
    //                         "title": "Tax",
    //                         "value": "6.30"
    //                       }
    //                     },
    //                     "C3": {
    //                       "title": "Regular",
    //                       "price": {
    //                         "title": "1 * Base Price",
    //                         "value": "0.00"
    //                       },
    //                       "quantityMessage": "Quantity: 1",
    //                       "textClass": "",
    //                       "quantity": 1,
    //                       "fulfillment_status": "Pending",
    //                       "tax": {
    //                         "title": "Tax",
    //                         "value": "0.00"
    //                       }
    //                     },
    //                     "C1": {
    //                       "title": "New Hand Tossed",
    //                       "price": {
    //                         "title": "1 * Base Price",
    //                         "value": "0.00"
    //                       },
    //                       "quantityMessage": "Quantity: 1",
    //                       "textClass": "",
    //                       "quantity": 1,
    //                       "fulfillment_status": "Pending",
    //                       "tax": {
    //                         "title": "Tax",
    //                         "value": "0.00"
    //                       }
    //                     }
    //                   },
    //                   "subtotal": 269,
    //                   "time": {
    //                     "label": "enable",
    //                     "timestamp": "2024-12-03T06:58:34.586Z"
    //                   },
    //                   "descriptor": {
    //                     "name": "Farm House Pizza",
    //                     "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
    //                     "short_desc": "Farm House Pizza",
    //                     "long_desc": "Farm House Pizza",
    //                     "images": [
    //                       "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
    //                     ]
    //                   },
    //                   "quantity": {
    //                     "unitized": {
    //                       "measure": {
    //                         "unit": "unit",
    //                         "value": "1"
    //                       }
    //                     },
    //                     "available": {
    //                       "count": "99"
    //                     },
    //                     "maximum": {
    //                       "count": "99"
    //                     }
    //                   },
    //                   "price": {
    //                     "currency": "INR",
    //                     "value": 269,
    //                     "maximum_value": "269.0"
    //                   },
    //                   "category_id": "F&B",
    //                   "category_ids": [
    //                     "rxpirYGWXh5r:3"
    //                   ],
    //                   "location_id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
    //                   "related": false,
    //                   "recommended": true,
    //                   "@ondc/org/returnable": false,
    //                   "@ondc/org/cancellable": true,
    //                   "@ondc/org/return_window": "PT1H",
    //                   "@ondc/org/seller_pickup_return": false,
    //                   "@ondc/org/time_to_ship": "PT45M",
    //                   "@ondc/org/available_on_cod": false,
    //                   "@ondc/org/contact_details_consumer_care": "Ramesh,ramesh@abc.com,18004254444",
    //                   "tags": [
    //                     {
    //                       "code": "type",
    //                       "list": [
    //                         {
    //                           "code": "type",
    //                           "value": "item"
    //                         }
    //                       ]
    //                     },
    //                     {
    //                       "code": "custom_group",
    //                       "list": [
    //                         {
    //                           "code": "id",
    //                           "value": "CG1"
    //                         }
    //                       ]
    //                     },
    //                     {
    //                       "code": "veg_nonveg",
    //                       "list": [
    //                         {
    //                           "code": "veg",
    //                           "value": "yes"
    //                         }
    //                       ]
    //                     }
    //                   ],
    //                   "parent_item_id": "FG8y4H3cEDLX",
    //                   "provider_details": {
    //                     "id": "pramaan.ondc.org/alpha/mock-server",
    //                     "locations": [
    //                       {
    //                         "id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
    //                       }
    //                     ],
    //                     "descriptor": {
    //                       "name": "WITS ONDC TEST STORE",
    //                       "short_desc": "Wits Testing Store",
    //                       "long_desc": "Wits Testing Store",
    //                       "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
    //                       "images": [
    //                         "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
    //                       ]
    //                     }
    //                   }
    //                 }
    //               }
    //             ],
    //             "fulfillments": [
    //               {
    //                 "id": "c461a827-f43d-487e-871d-e13467acd866",
    //                 "@ondc/org/provider_name": "WITS ONDC TEST STORE",
    //                 "state": {
    //                   "descriptor": {
    //                     "code": "Pending"
    //                   }
    //                 },
    //                 "type": "Delivery",
    //                 "tracking": true,
    //                 "@ondc/org/TAT": "PT60M",
    //                 "start": {
    //                   "location": {
    //                     "id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
    //                     "descriptor": {
    //                       "name": "WITS ONDC TEST STORE"
    //                     },
    //                     "gps": "28.553440, 77.214241",
    //                     "address": {
    //                       "locality": "Siri Fort Institutional Area, Siri Fort",
    //                       "city": "New Delhi",
    //                       "area_code": "110049",
    //                       "state": "Delhi"
    //                     }
    //                   },
    //                   "time": {
    //                     "range": {
    //                       "start": "2024-12-06T08:02:27.279Z",
    //                       "end": "2024-12-06T08:02:27.279Z"
    //                     }
    //                   },
    //                   "instructions": {
    //                     "code": "2",
    //                     "name": "ONDC order",
    //                     "short_desc": "A1B2C3",
    //                     "long_desc": "additional instructions such as register or counter no for self-pickup"
    //                   },
    //                   "contact": {
    //                     "phone": "9886098860",
    //                     "email": "nobody@nomail.com"
    //                   }
    //                 },
    //                 "end": {
    //                   "location": {
    //                     "gps": "20.264049,85.853975",
    //                     "address": {
    //                       "name": "Nausheen",
    //                       "building": "mayuri",
    //                       "locality": "Canal Road",
    //                       "city": "Bhubaneswar",
    //                       "state": "Odisha",
    //                       "country": "IND",
    //                       "area_code": "751006"
    //                     }
    //                   },
    //                   "time": {
    //                     "range": {
    //                       "start": "2024-12-06T08:02:27.279Z",
    //                       "end": "2024-12-06T08:02:27.279Z"
    //                     }
    //                   },
    //                   "person": {
    //                     "name": "Nausheen"
    //                   },
    //                   "contact": {
    //                     "email": "nausheen.khan@openplaytech.com",
    //                     "phone": "8718914719"
    //                   }
    //                 }
    //               }
    //             ],
    //             "provider_id": "pramaan.ondc.org/alpha/mock-server"
    //           },
    //           "sub_category": "FLM02",
    //           "updated_at": "2024-12-30T16:20:20.880Z",
    //           "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1"
    //         },
    //         {
    //           "_id": "677277a9714e7ba2f098569e",
    //           "transaction_id": "d99376cc-e417-4601-82b3-e4687cb30e51",
    //           "__v": 0,
    //           "bppId": "pramaan.ondc.org/alpha/mock-server",
    //           "bpp_uri": "https://pramaan.ondc.org/alpha/mock-server/seller",
    //           "category": "FULFILLMENT",
    //           "complainant_info": {
    //             "person": {
    //               "name": "Naush1"
    //             },
    //             "contact": {
    //               "phone": 8718914719
    //             }
    //           },
    //           "created_at": "2024-12-30T10:36:24.925Z",
    //           "description": {
    //             "short_desc": "bkbk",
    //             "long_desc": "jvjvjvjjfjcjc",
    //             "additional_desc": {
    //               "url": "https://buyerapp.com/additonal-details/desc.txt",
    //               "content_type": "text/plain"
    //             },
    //             "images": []
    //           },
    //           "domain": "ONDC:RET11",
    //           "issueId": "4b2f872b-55d4-420f-b430-9fa8e8dbea28",
    //           "issue_actions": {
    //             "complainant_actions": [
    //               {
    //                 "complainant_action": "OPEN",
    //                 "short_desc": "Complaint created",
    //                 "updated_at": "2024-12-30T10:36:25.268Z",
    //                 "updated_by": {
    //                   "org": {
    //                     "name": "ondcstg.nazarasdk.com::ONDC:RET11"
    //                   },
    //                   "contact": {
    //                     "phone": "8718914719",
    //                     "email": "naush@gmail.com"
    //                   },
    //                   "person": {
    //                     "name": "Naush1"
    //                   }
    //                 }
    //               },
    //               {
    //                 "complainant_action": "ESCALATE",
    //                 "short_desc": "kcbsbfwir",
    //                 "updated_at": "2024-12-30T10:37:57.103Z",
    //                 "updated_by": {
    //                   "org": {
    //                     "name": "ondcstg.nazarasdk.com::ONDC:RET11"
    //                   },
    //                   "contact": {
    //                     "phone": "8718914719",
    //                     "email": "naush@gmail.com"
    //                   },
    //                   "person": {
    //                     "name": "Naush1"
    //                   }
    //                 }
    //               }
    //             ],
    //             "respondent_actions": [
    //               {
    //                 "respondent_action": "PROCESSING",
    //                 "short_desc": "Complaint is being processed",
    //                 "updated_at": "2024-12-30T10:36:25.462Z",
    //                 "updated_by": {
    //                   "org": {
    //                     "name": "pramaan.ondc.org/alpha/mock-server::ONDC:RET11"
    //                   },
    //                   "contact": {
    //                     "phone": "9450394140",
    //                     "email": "mayur@gmail.com"
    //                   },
    //                   "person": {
    //                     "name": "Mayur"
    //                   }
    //                 },
    //                 "cascaded_level": 1
    //               },
    //               {
    //                 "respondent_action": "RESOLVED",
    //                 "short_desc": "Complaint resolved",
    //                 "updated_at": "2024-12-30T10:38:03.612Z",
    //                 "updated_by": {
    //                   "org": {
    //                     "name": "pramaan.ondc.org/alpha/mock-server::ONDC:RET11"
    //                   },
    //                   "contact": {
    //                     "phone": "9450394140",
    //                     "email": "mayur@gmail.com"
    //                   },
    //                   "person": {
    //                     "name": "Mayur"
    //                   }
    //                 },
    //                 "cascaded_level": 1
    //               }
    //             ]
    //           },
    //           "issue_status": "Open",
    //           "message_id": "f1836e15-aa9c-4386-99c8-a3aa3d428d72",
    //           "order_details": {
    //             "id": "2024-12-23-840065",
    //             "state": "Created",
    //             "items": [
    //               {
    //                 "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
    //                 "quantity": {
    //                   "count": 1
    //                 },
    //                 "product": {
    //                   "id": "68ae0d64-a8a7-412a-a359-007ffac25eaa",
    //                   "name": "Farm House Pizza",
    //                   "cancellation_status": "",
    //                   "return_status": "",
    //                   "fulfillment_id": "c461a827-f43d-487e-871d-e13467acd866",
    //                   "fulfillment_status": "Pending",
    //                   "customizations": {
    //                     "C1": {
    //                       "title": "New Hand Tossed",
    //                       "price": {
    //                         "title": "1 * Base Price",
    //                         "value": "0.00"
    //                       },
    //                       "quantityMessage": "Quantity: 1",
    //                       "textClass": "",
    //                       "quantity": 1,
    //                       "fulfillment_status": "Pending",
    //                       "tax": {
    //                         "title": "Tax",
    //                         "value": "0.00"
    //                       }
    //                     },
    //                     "C3": {
    //                       "title": "Regular",
    //                       "price": {
    //                         "title": "1 * Base Price",
    //                         "value": "0.00"
    //                       },
    //                       "quantityMessage": "Quantity: 1",
    //                       "textClass": "",
    //                       "quantity": 1,
    //                       "fulfillment_status": "Pending",
    //                       "tax": {
    //                         "title": "Tax",
    //                         "value": "0.00"
    //                       }
    //                     },
    //                     "C8": {
    //                       "title": "Grilled Mushrooms",
    //                       "price": {
    //                         "title": "1 * Base Price",
    //                         "value": "35.00"
    //                       },
    //                       "quantityMessage": "Quantity: 1",
    //                       "textClass": "",
    //                       "quantity": 1,
    //                       "fulfillment_status": "Pending",
    //                       "tax": {
    //                         "title": "Tax",
    //                         "value": "6.30"
    //                       }
    //                     }
    //                   },
    //                   "subtotal": 269,
    //                   "time": {
    //                     "label": "enable",
    //                     "timestamp": "2024-12-22T00:25:39.473Z"
    //                   },
    //                   "descriptor": {
    //                     "name": "Farm House Pizza",
    //                     "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
    //                     "short_desc": "Farm House Pizza",
    //                     "long_desc": "Farm House Pizza",
    //                     "images": [
    //                       "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
    //                     ]
    //                   },
    //                   "quantity": {
    //                     "unitized": {
    //                       "measure": {
    //                         "unit": "unit",
    //                         "value": "1"
    //                       }
    //                     },
    //                     "available": {
    //                       "count": "99"
    //                     },
    //                     "maximum": {
    //                       "count": "99"
    //                     }
    //                   },
    //                   "price": {
    //                     "currency": "INR",
    //                     "value": 269,
    //                     "maximum_value": "269.0"
    //                   },
    //                   "category_id": "F&B",
    //                   "category_ids": [
    //                     "rxpirYGWXh5r:3"
    //                   ],
    //                   "location_id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
    //                   "related": false,
    //                   "recommended": true,
    //                   "@ondc/org/returnable": false,
    //                   "@ondc/org/cancellable": true,
    //                   "@ondc/org/return_window": "PT1H",
    //                   "@ondc/org/seller_pickup_return": false,
    //                   "@ondc/org/time_to_ship": "PT45M",
    //                   "@ondc/org/available_on_cod": false,
    //                   "@ondc/org/contact_details_consumer_care": "Ramesh,ramesh@abc.com,18004254444",
    //                   "tags": [
    //                     {
    //                       "code": "type",
    //                       "list": [
    //                         {
    //                           "code": "type",
    //                           "value": "item"
    //                         }
    //                       ]
    //                     },
    //                     {
    //                       "code": "custom_group",
    //                       "list": [
    //                         {
    //                           "code": "id",
    //                           "value": "CG1"
    //                         }
    //                       ]
    //                     },
    //                     {
    //                       "code": "veg_nonveg",
    //                       "list": [
    //                         {
    //                           "code": "veg",
    //                           "value": "yes"
    //                         }
    //                       ]
    //                     }
    //                   ],
    //                   "fulfillments": [
    //                     {
    //                       "id": "c461a827-f43d-487e-871d-e13467acd866",
    //                       "@ondc/org/provider_name": "WITS ONDC TEST STORE",
    //                       "tracking": true,
    //                       "type": "Delivery",
    //                       "@ondc/org/category": "Immediate Delivery",
    //                       "@ondc/org/TAT": "PT60M",
    //                       "state": {
    //                         "descriptor": {
    //                           "code": "Serviceable"
    //                         }
    //                       }
    //                     },
    //                     {
    //                       "id": "56d0f31d-20c9-4fe2-86c2-a6091af81df9",
    //                       "type": "Self-Pickup",
    //                       "@ondc/org/provider_name": "WITS ONDC TEST STORE",
    //                       "tracking": true,
    //                       "@ondc/org/category": "Takeaway",
    //                       "@ondc/org/TAT": "PT30M",
    //                       "state": {
    //                         "descriptor": {
    //                           "code": "Serviceable"
    //                         }
    //                       }
    //                     }
    //                   ],
    //                   "parent_item_id": "KxFI47c5IA+l",
    //                   "provider_details": {
    //                     "id": "pramaan.ondc.org/alpha/mock-server",
    //                     "locations": [
    //                       {
    //                         "id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a"
    //                       }
    //                     ],
    //                     "descriptor": {
    //                       "name": "WITS ONDC TEST STORE",
    //                       "short_desc": "Wits Testing Store",
    //                       "long_desc": "Wits Testing Store",
    //                       "symbol": "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png",
    //                       "images": [
    //                         "https://res.cloudinary.com/dxum9bu0r/image/upload/v1706624067/Frame_qvtmt7.png"
    //                       ]
    //                     }
    //                   }
    //                 }
    //               }
    //             ],
    //             "fulfillments": [
    //               {
    //                 "id": "c461a827-f43d-487e-871d-e13467acd866",
    //                 "@ondc/org/provider_name": "WITS ONDC TEST STORE",
    //                 "state": {
    //                   "descriptor": {
    //                     "code": "Pending"
    //                   }
    //                 },
    //                 "type": "Delivery",
    //                 "tracking": true,
    //                 "@ondc/org/TAT": "PT60M",
    //                 "start": {
    //                   "location": {
    //                     "id": "f13873c1-810d-4f2b-ba54-5edcec9f0e4a",
    //                     "descriptor": {
    //                       "name": "WITS ONDC TEST STORE"
    //                     },
    //                     "gps": "28.553440, 77.214241",
    //                     "address": {
    //                       "locality": "Siri Fort Institutional Area, Siri Fort",
    //                       "city": "New Delhi",
    //                       "area_code": "110049",
    //                       "state": "Delhi"
    //                     }
    //                   },
    //                   "time": {
    //                     "range": {
    //                       "start": "2024-12-23T06:06:52.071Z",
    //                       "end": "2024-12-23T06:06:52.071Z"
    //                     }
    //                   },
    //                   "instructions": {
    //                     "code": "2",
    //                     "name": "ONDC order",
    //                     "short_desc": "A1B2C3",
    //                     "long_desc": "additional instructions such as register or counter no for self-pickup"
    //                   },
    //                   "contact": {
    //                     "phone": "9886098860",
    //                     "email": "nobody@nomail.com"
    //                   }
    //                 },
    //                 "end": {
    //                   "location": {
    //                     "gps": "28.553192,77.216704",
    //                     "address": {
    //                       "name": "Naush1",
    //                       "building": "300",
    //                       "locality": "Khel Gaon Marg",
    //                       "city": "New Delhi",
    //                       "state": "Delhi",
    //                       "country": "IND",
    //                       "area_code": "110049"
    //                     }
    //                   },
    //                   "time": {
    //                     "range": {
    //                       "start": "2024-12-23T06:06:52.071Z",
    //                       "end": "2024-12-23T06:06:52.071Z"
    //                     }
    //                   },
    //                   "person": {
    //                     "name": "Naush1"
    //                   },
    //                   "contact": {
    //                     "email": "naush@gmail.com",
    //                     "phone": "8718914719"
    //                   }
    //                 }
    //               }
    //             ],
    //             "provider_id": "pramaan.ondc.org/alpha/mock-server"
    //           },
    //           "resolution": {
    //             "short_desc": "Refund to be initiated",
    //             "long_desc": "For this complaint, refund is to be initiated",
    //             "action_triggered": "REFUND",
    //             "refund_amount": "100"
    //           },
    //           "resolution_provider": {
    //             "respondent_info": {
    //               "type": "TRANSACTION-COUNTERPARTY-NP",
    //               "organization": {
    //                 "org": {
    //                   "name": "pramaan.ondc.org/alpha/mock-server::ONDC:RET11"
    //                 },
    //                 "contact": {
    //                   "phone": "9059304940",
    //                   "email": "mayur@gmail.com"
    //                 },
    //                 "person": {
    //                   "name": "resolution provider org contact person name"
    //                 }
    //               },
    //               "resolution_support": {
    //                 "chat_link": "http://chat-link/respondent",
    //                 "contact": {
    //                   "phone": "9949595059",
    //                   "email": "mayur@gmail.com"
    //                 },
    //                 "gros": [
    //                   {
    //                     "person": {
    //                       "name": "Mayur"
    //                     },
    //                     "contact": {
    //                       "phone": "9605960796",
    //                       "email": "mayur@gmail.com"
    //                     },
    //                     "gro_type": "TRANSACTION-COUNTERPARTY-NP-GRO"
    //                   }
    //                 ]
    //               }
    //             }
    //           },
    //           "sub_category": "FLM02",
    //           "updated_at": "2024-12-30T10:36:24.925Z",
    //           "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1"
    //         }
    //       ], // Direct mapping from new format
    //     total_size: 2 // Use totalCount from new format
    // }}
console.log("issue data",data)
    return (
        <>
            <Meta
                title={` Tickets- ONDC`}
                description=""
                keywords=""
            />
            <CustomPaperBigCard
                padding={isXSmall ? '10px 10px' : '30px 40px'}
                border={false}

                sx={{ minHeight: !isXSmall && '558px', boxShadow: isXSmall && 'unset' }}
            >
                <Grid container spacing={2.4} >
                    <Grid item xs={12} sm={12} md={12} columnSpacing={3}>
                        {data?.data?.issues?.map((order, index) => (
                            <TicketCard
                                key={index}
                                order={order}
                                index={index}
                                limit={limit}
                                offset={offset}
                                refetch={refetch}
                            />
                        ))}
                        {isLoading && (
                            <Box mb="1rem">
                                <CustomShimmerCard />
                            </Box>
                        )}
                        <CustomStackFullWidth
                            sx={{ height: '50px' }}
                            alignItems="center"
                            justifyContent="center"
                        >
                            {data?.data?.total_size > 10 && (
                                <CustomePagination
                                    total_size={data?.data?.total_size}
                                    page_limit={limit}
                                    offset={offset}
                                    setOffset={setOffset}
                                />
                            )}
                        </CustomStackFullWidth>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12}>
                        {data?.data?.orders?.length === 0 && (
                            <Stack minHeight="30vh" pt={{ xs: "10px", md: "50px" }}>
                                <CustomEmptyResult
                                    label="No Order found"
                                    image={noOrderFound}
                                    height={80}
                                    width={80}
                                />
                            </Stack>
                        )}

                    </Grid>
                </Grid>
            </CustomPaperBigCard>
        </>
    )
}

export default ComplaintHistory
