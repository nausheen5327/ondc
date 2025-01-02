import MainApi, { getCall } from '../../../api/MainApi'
import { getToken } from "../../../components/checkout-page/functions/getGuestUserId";

let token = undefined
if (typeof window != 'undefined') {
    token = localStorage.getItem('token')
}
export const OrderApi = {
    placeOrder: (formData) => {
        return MainApi.post('/api/v1/customer/order/place', formData)
    },
    orderHistory: (orderType, limit, offset) => {
        // New ONDC API integration
        return getCall('/clientApis/v2/orders', {
            limit: limit,
            pageNumber: offset,
            state: orderType
        })
    },
    ticketHistory: ( limit, offset) => {
        // New ONDC API integration
        return getCall('/issueApis/v1/getIssues', {
            limit: limit,
            pageNumber: offset,
        })
    },
    orderDetails: (order_id, phone, guestId) => {
        const params = !getToken()
            ? `order_id=${order_id}&guest_id=${guestId}&contact_number=${phone}`
            : `?order_id=${order_id}`;
        if(order_id){
            if (getToken()) {
                return MainApi.get(`/api/v1/customer/order/details${params}`)
            } else {
                if (phone) {
                    return MainApi.get(`/api/v1/customer/order/details?${params}`)
                }

            }
        }
    },
    orderReview:(order_id)=>{
        if(order_id){
            if (getToken()) {
                return MainApi.get(`/api/v1/customer/getPendingReviews?order_id=${order_id}`)
            }
            }
    },
    foodLists: (foodId) => {
        return MainApi.post(`/api/v1/customer/food-list?food_id=${foodId}`)
    },
    orderTracking: (order_id, phone, guestId) => {
        const params = !getToken()
            ? `?order_id=${order_id}&guest_id=${guestId}&contact_number=${phone}`
            : `?order_id=${order_id}`;
        if (getToken()) {
            return MainApi.get(`/api/v1/customer/order/track${params}`)
        } else {
            if (phone) {
                return MainApi.get(`/api/v1/customer/order/track${params}`)
            }

        }

    },
    CancelOrder: (formData) => {
        return MainApi.post('/api/v1/customer/order/cancel', formData)
    },
    FailedPaymentMethodUpdate: (formData) => {
        return MainApi.post('/api/v1/customer/order/payment-method', formData)
    },
}
