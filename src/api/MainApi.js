import axios from "axios";
import Cookies from "js-cookie";
import { deleteAllCookies } from "../utils/cookies";
import { NextApiRequest, NextApiResponse } from 'next';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'http://localhost:8000'
  },
  withCredentials: true // Important for CORS
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token") || Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      unAuthorizedResponse();
    }
    return Promise.reject(error);
  }
);

function unAuthorizedResponse() {
  deleteAllCookies();
  localStorage.removeItem("product_list");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("token");
  window.location.pathname = "/";
}

// export function getCall(url, params = null) {
//   return new Promise(async (resolve, reject) => {
//     try {
//         // const externalUrl = encodeURIComponent('https://ondcstg.nazarasdk.com/clientApis/v1/delivery_address');
//         // const proxyUrl = `http://localhost:8000/api/proxy?endpoint=${externalUrl}`;      
//         // const response = await axios.get(proxyUrl);
//       const response = await api.get(url, { params });
//       return resolve(response.data);
//     } catch (error) {
//         return resolve([
//             {
//                 "_id": "6721cb3e12e6dbc687fb23d1",
//                 "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1",
//                 "id": "69fa8afc-641a-4eef-9331-9012c408c8da",
//                 "descriptor": {
//                     "name": "Nausheen",
//                     "phone": "8718914719",
//                     "email": "nausheen.khan@openplaytech.com",
//                     "code": null,
//                     "symbol": null,
//                     "shortDesc": null,
//                     "longDesc": null,
//                     "images": [],
//                     "audio": null,
//                     "3d_render": null
//                 },
//                 "gps": null,
//                 "defaultAddress": false,
//                 "address": {
//                     "door": "mayuri",
//                     "name": null,
//                     "building": "mayuri",
//                     "street": "Canal Road",
//                     "locality": null,
//                     "ward": null,
//                     "city": "Bhubaneswar",
//                     "state": "Odisha",
//                     "country": "IND",
//                     "areaCode": "751006",
//                     "tag": "Home",
//                     "lat": "20.264049",
//                     "lng": "85.853975"
//                 },
//                 "createdAt": "2024-10-30T05:59:26.476Z",
//                 "updatedAt": "2024-11-05T10:28:00.550Z",
//                 "__v": 0
//             },
//             {
//                 "_id": "6729f33012e6dbc687fb289f",
//                 "userId": "9t7o54sqWldjqlAlgbRqhjvckPg1",
//                 "id": "85503481-56e7-48b5-b2a0-3bda6392778a",
//                 "descriptor": {
//                     "name": "Naush1",
//                     "phone": "8718914719",
//                     "email": "naush@gmail.com",
//                     "code": null,
//                     "symbol": null,
//                     "shortDesc": null,
//                     "longDesc": null,
//                     "images": [],
//                     "audio": null,
//                     "3d_render": null
//                 },
//                 "gps": null,
//                 "defaultAddress": true,
//                 "address": {
//                     "door": "102",
//                     "name": null,
//                     "building": "102",
//                     "street": "Khel Gaon Marg",
//                     "locality": null,
//                     "ward": null,
//                     "city": "New Delhi",
//                     "state": "Delhi",
//                     "country": "IND",
//                     "areaCode": "110049",
//                     "tag": "Home",
//                     "lat": "28.553192",
//                     "lng": "77.216704"
//                 },
//                 "createdAt": "2024-11-05T10:28:00.594Z",
//                 "updatedAt": "2024-11-05T10:29:39.573Z",
//                 "__v": 0
//             }
//         ]);
//       handleApiError(error);
//       return reject(error);
//     }
//   });
// }

export function getCall(url, params = null) {
  return new Promise(async (resolve, reject) => {
    try {
      // Build the query parameters string for the URL
      const queryParams = params
        ? Object.entries(params)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
        : '';

      const fullUrl = queryParams ? `${process.env.NEXT_PUBLIC_BASE_URL}?${queryParams}` : `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

      // Log the cURL command
      const headers = {
        Authorization: 'Bearer YOUR_TOKEN', // Add authorization or other headers if necessary
      };
      const headerString = Object.entries(headers)
        .map(([key, value]) => `-H "${key}: ${value}"`)
        .join(' ');
      console.log(`cURL: curl -X GET "${fullUrl}" ${headerString}`);

      const response = await api.get(url, { params });
      return resolve(response.data);
    } catch (error) {
      console.log("error123",error);
      handleApiError(error);
      return reject(error);
    }
  });
}


export function postCall(url, params) {
  return new Promise(async (resolve, reject) => {
    console.log(resolve, reject, "testing");
    try {
      const response = await api.post(url, params);
      return resolve(response.data);
    } catch (error) {
        return resolve({
            "_id": "672ccf4c12e6dbc687fb2c58",
            "cart": "6729f3d212e6dbc687fb28a5",
            "item": {
                "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1_db7e96d9-1daf-4f2d-87de-51184fc79da6",
                "local_id": "db7e96d9-1daf-4f2d-87de-51184fc79da6",
                "bpp_id": "seller-app-preprod-v2.ondc.org",
                "bpp_uri": "https://seller-app-preprod-v2.ondc.org",
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
                        "code": "image",
                        "list": [
                            {
                                "code": "type",
                                "value": "back_image"
                            },
                            {
                                "code": "url",
                                "value": ""
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
                    "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1",
                    "locations": [
                        {
                            "id": "seller-app-preprod-v2.ondc.org_ONDC:RET11_73fef8e6-eda2-4981-8c94-641d6386f4c1_65795971cb93550b2f0e25cc",
                            "gps": "13.032895219628294,77.63006608174867",
                            "address": {
                                "city": "Bengaluru",
                                "state": "Karnataka",
                                "area_code": "560043",
                                "street": "HBR Layout",
                                "locality": "NA"
                            },
                            "time": {
                                "label": "enable",
                                "timestamp": "2024-10-10T06:38:13.865Z",
                                "days": "1,2,3,4,5,6,7",
                                "schedule": {
                                    "holidays": [
                                        "2023-12-16"
                                    ]
                                },
                                "range": {
                                    "start": "0000",
                                    "end": "2300"
                                }
                            },
                            "circle": {
                                "gps": "13.032895219628294,77.63006608174867",
                                "radius": {
                                    "unit": "km",
                                    "value": "3"
                                }
                            },
                            "local_id": "65795971cb93550b2f0e25cc",
                            "min_time_to_ship": 3600,
                            "max_time_to_ship": 3600,
                            "average_time_to_ship": 3600,
                            "median_time_to_ship": 3600,
                            "type": "polygon"
                        }
                    ],
                    "descriptor": {
                        "name": "Mauli Stationers",
                        "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/b115f27b-746e-41cd-a7e5-56cb78489172/logo/Mauli logo.png",
                        "short_desc": "Mauli Stationers",
                        "long_desc": "Mauli Stationers",
                        "images": [
                            "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/b115f27b-746e-41cd-a7e5-56cb78489172/logo/Mauli logo.png"
                        ]
                    },
                    "time": {
                        "label": "enable",
                        "timestamp": "2024-10-10T06:38:13.865Z"
                    },
                    "@ondc/org/fssai_license_no": "73683683834937",
                    "ttl": "PT24H",
                    "tags": [
                        {
                            "code": "serviceability",
                            "list": [
                                {
                                    "code": "location",
                                    "value": "65795971cb93550b2f0e25cc"
                                },
                                {
                                    "code": "category",
                                    "value": "F&B"
                                },
                                {
                                    "code": "type",
                                    "value": ""
                                },
                                {
                                    "code": "unit",
                                    "value": ""
                                },
                                {
                                    "code": "value",
                                    "value": ""
                                }
                            ]
                        }
                    ],
                    "local_id": "73fef8e6-eda2-4981-8c94-641d6386f4c1"
                },
                "product": {
                    "id": "db7e96d9-1daf-4f2d-87de-51184fc79da6",
                    "subtotal": 250,
                    "time": {
                        "label": "enable",
                        "timestamp": "2023-12-13T07:04:27.902Z"
                    },
                    "parent_item_id": "",
                    "descriptor": {
                        "name": "Pepperoni Pizza",
                        "symbol": "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/549adb33-9935-4367-b102-badd4fa4620b/product_image/Tandoori Paneer Pizza.png",
                        "short_desc": "Pepperoni Pizza.",
                        "long_desc": "Pepperoni Pizza.",
                        "images": [
                            "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/549adb33-9935-4367-b102-badd4fa4620b/product_image/Tandoori Paneer Pizza.png",
                            "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/8a797b13-5a3d-48ad-8044-d16a667bf78d/product_image/Pizza.png",
                            "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/a2c5f585-02e6-4a4b-b6f1-4431313ebb2b/product_image/Pizza1.png",
                            "https://reference-buyer-app-assets.s3-ap-south-1.amazonaws.com/public-assets/0ed109c4-5e33-48c4-af75-1b373c044bbb/product_image/pIZZA2.png"
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
                            "count": "10"
                        }
                    },
                    "price": {
                        "currency": "INR",
                        "value": 250,
                        "maximum_value": "250"
                    },
                    "category_ids": [
                        "KVk30x:1"
                    ],
                    "category_id": "Pizza",
                    "location_id": "65795971cb93550b2f0e25cc",
                    "fulfillment_id": "1",
                    "@ondc/org/returnable": true,
                    "@ondc/org/cancellable": true,
                    "@ondc/org/available_on_cod": true,
                    "@ondc/org/time_to_ship": "PT1H",
                    "@ondc/org/seller_pickup_return": true,
                    "@ondc/org/return_window": "PT1H",
                    "@ondc/org/contact_details_consumer_care": "Mauli Stationers,ganesh123@yopmail.com,8830343362",
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
                            "code": "image",
                            "list": [
                                {
                                    "code": "type",
                                    "value": "back_image"
                                },
                                {
                                    "code": "url",
                                    "value": ""
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
            "createdAt": "2024-11-07T14:31:40.859Z",
            "updatedAt": "2024-11-07T14:31:40.859Z",
            "__v": 0
        })
      handleApiError(error);
      return reject(error);
    }
  });
}

export function putCall(url, params) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.put(url, params);
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

export function deleteCall(url) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await api.delete(url);
      return resolve(response.data);
    } catch (error) {
      handleApiError(error);
      return reject(error);
    }
  });
}

// Helper function to handle API errors
function handleApiError(error) {
  if (error.response) {
    // Server responded with error
    console.error('Server Error:', {
      status: error.response.status,
      data: error.response.data
    });
  } else if (error.request) {
    // Request made but no response
    console.error('No Response:', error.request);
  } else {
    // Error in request configuration
    console.error('Request Error:', error.message);
  }
}

export function makeCancelable(promise) {
  let isCanceled = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise
      .then(val => !isCanceled && resolve(val))
      .catch(error => !isCanceled && reject(error));
  });
  return {
    promise: wrappedPromise,
    cancel() {
      isCanceled = true;
    },
  };
}

// Optional: Add retry logic for failed requests
export function withRetry(apiCall, maxRetries = 3) {
  return async (...args) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall(...args);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        if (error.response?.status === 401) throw error; // Don't retry auth errors
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };
}

// Usage example with retry
export const getWithRetry = withRetry(getCall);
export const postWithRetry = withRetry(postCall);