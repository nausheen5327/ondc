import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    featuredCategories: [],
    cuisines: [],
    popularRestaurants: [],
    campaignFoods: [],
    banners: {
        banners: [],
        campaigns: [],
    },
    bestReviewedFoods: [],
    popularFood: [],
    suggestedKeywords: [],
    landingPageData: {
        "base_urls": {
            "react_header_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_header",
            "react_services_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_service_image",
            "react_promotional_banner_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_promotional_banner",
            "react_delivery_section_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_delivery_section_image",
            "react_restaurant_section_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_restaurant_section_image",
            "react_download_apps_banner_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_download_apps_image",
            "react_download_apps_image_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_download_apps_image"
        },
        "react_header_title": "ONDC X NAZARA",
        "react_header_sub_title": "",
        "react_header_image": "2023-06-21-64927187b29c4.png",
        "react_header_image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_header\/2023-06-21-64927187b29c4.png",
        "react_services": [
            {
                "id": 1,
                "title": "Order Online",
                "sub_title": "Order in for yourself or for the group, with no restrictions on order value",
                "image": "2023-06-21-649271c487c31.png",
                "status": 1,
                "created_at": "2023-06-21T14:43:00.000000Z",
                "updated_at": "2023-06-21T14:43:00.000000Z",
                "image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_service_image\/2023-06-21-649271c487c31.png",
                "translations": [
                    {
                        "id": 801,
                        "translationable_type": "App\\Models\\ReactService",
                        "translationable_id": 1,
                        "locale": "en",
                        "key": "react_service_title",
                        "value": "Order Online",
                        "created_at": null,
                        "updated_at": null
                    },
                    {
                        "id": 802,
                        "translationable_type": "App\\Models\\ReactService",
                        "translationable_id": 1,
                        "locale": "en",
                        "key": "react_service_sub_title",
                        "value": "Order in for yourself or for the group, with no restrictions on order value",
                        "created_at": null,
                        "updated_at": null
                    }
                ],
                "storage": []
            },
            {
                "id": 2,
                "title": "Fast Delivery",
                "sub_title": "Order in for yourself or for the group, with no restrictions on order value",
                "image": "2023-06-21-649271ec08400.png",
                "status": 1,
                "created_at": "2023-06-21T14:43:40.000000Z",
                "updated_at": "2023-06-21T14:43:40.000000Z",
                "image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_service_image\/2023-06-21-649271ec08400.png",
                "translations": [
                    {
                        "id": 803,
                        "translationable_type": "App\\Models\\ReactService",
                        "translationable_id": 2,
                        "locale": "en",
                        "key": "react_service_title",
                        "value": "Fast Delivery",
                        "created_at": null,
                        "updated_at": null
                    },
                    {
                        "id": 804,
                        "translationable_type": "App\\Models\\ReactService",
                        "translationable_id": 2,
                        "locale": "en",
                        "key": "react_service_sub_title",
                        "value": "Order in for yourself or for the group, with no restrictions on order value",
                        "created_at": null,
                        "updated_at": null
                    }
                ],
                "storage": []
            },
            {
                "id": 3,
                "title": "Enjoy Fresh Food",
                "sub_title": "Order in for yourself or for the group, with no restrictions on order value",
                "image": "2023-06-21-6492721570e4b.png",
                "status": 1,
                "created_at": "2023-06-21T14:44:21.000000Z",
                "updated_at": "2023-06-21T05:49:53.000000Z",
                "image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_service_image\/2023-06-21-6492721570e4b.png",
                "translations": [
                    {
                        "id": 805,
                        "translationable_type": "App\\Models\\ReactService",
                        "translationable_id": 3,
                        "locale": "en",
                        "key": "react_service_title",
                        "value": "Enjoy Fresh Food",
                        "created_at": null,
                        "updated_at": null
                    },
                    {
                        "id": 806,
                        "translationable_type": "App\\Models\\ReactService",
                        "translationable_id": 3,
                        "locale": "en",
                        "key": "react_service_sub_title",
                        "value": "Order in for yourself or for the group, with no restrictions on order value",
                        "created_at": null,
                        "updated_at": null
                    }
                ],
                "storage": []
            }
        ],
        "react_promotional_banner": [
            {
                "id": 1,
                "title": null,
                "description": null,
                "image": "2023-06-21-649272340211f.png",
                "status": 1,
                "created_at": "2023-06-21T14:44:52.000000Z",
                "updated_at": "2023-06-21T14:44:52.000000Z",
                "image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_promotional_banner\/2023-06-21-649272340211f.png",
                "translations": [
                    {
                        "id": 807,
                        "translationable_type": "App\\Models\\ReactPromotionalBanner",
                        "translationable_id": 1,
                        "locale": "en",
                        "key": "react_promotional_banner_title",
                        "value": null,
                        "created_at": null,
                        "updated_at": null
                    },
                    {
                        "id": 808,
                        "translationable_type": "App\\Models\\ReactPromotionalBanner",
                        "translationable_id": 1,
                        "locale": "en",
                        "key": "react_promotional_banner_description",
                        "value": null,
                        "created_at": null,
                        "updated_at": null
                    }
                ],
                "storage": []
            },
            {
                "id": 2,
                "title": "BEST TACOS AROUND",
                "description": "Fast Home Delivery",
                "image": "2023-06-21-64927258759e3.png",
                "status": 1,
                "created_at": "2023-06-21T14:45:28.000000Z",
                "updated_at": "2023-06-21T14:45:28.000000Z",
                "image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_promotional_banner\/2023-06-21-64927258759e3.png",
                "translations": [
                    {
                        "id": 809,
                        "translationable_type": "App\\Models\\ReactPromotionalBanner",
                        "translationable_id": 2,
                        "locale": "en",
                        "key": "react_promotional_banner_title",
                        "value": "BEST TACOS AROUND",
                        "created_at": null,
                        "updated_at": null
                    },
                    {
                        "id": 810,
                        "translationable_type": "App\\Models\\ReactPromotionalBanner",
                        "translationable_id": 2,
                        "locale": "en",
                        "key": "react_promotional_banner_description",
                        "value": "Fast Home Delivery",
                        "created_at": null,
                        "updated_at": null
                    }
                ],
                "storage": []
            },
            {
                "id": 3,
                "title": null,
                "description": null,
                "image": "2023-06-21-6492726d4d0f2.png",
                "status": 1,
                "created_at": "2023-06-21T14:45:49.000000Z",
                "updated_at": "2023-06-21T14:45:49.000000Z",
                "image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_promotional_banner\/2023-06-21-6492726d4d0f2.png",
                "translations": [
                    {
                        "id": 811,
                        "translationable_type": "App\\Models\\ReactPromotionalBanner",
                        "translationable_id": 3,
                        "locale": "en",
                        "key": "react_promotional_banner_title",
                        "value": null,
                        "created_at": null,
                        "updated_at": null
                    },
                    {
                        "id": 812,
                        "translationable_type": "App\\Models\\ReactPromotionalBanner",
                        "translationable_id": 3,
                        "locale": "en",
                        "key": "react_promotional_banner_description",
                        "value": null,
                        "created_at": null,
                        "updated_at": null
                    }
                ],
                "storage": []
            }
        ],
        // "restaurant_section": {
        //     "react_restaurant_section_title": "Open your own restaurant",
        //     "react_restaurant_section_sub_title": "Open your own restaurant",
        //     "react_restaurant_section_button_name": "Register",
        //     "react_restaurant_section_link_data": {
        //         "react_restaurant_section_button_status": "1",
        //         "react_restaurant_section_link": "https:\/\/stackfood-admin.6amtech.com\/restaurant\/apply"
        //     },
        //     "react_restaurant_section_image": "2023-06-21-649273298ec53.png",
        //     "react_restaurant_section_image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_restaurant_section_image\/2023-06-21-649273298ec53.png"
        // },
        // "delivery_section": {
        //     "react_delivery_section_title": "Become a Delivery Man",
        //     "react_delivery_section_sub_title": "Become a Delivery Man",
        //     "react_delivery_section_button_name": "Register",
        //     "react_delivery_section_link_data": {
        //         "react_delivery_section_button_status": "1",
        //         "react_delivery_section_link": "https:\/\/stackfood-admin.6amtech.com\/deliveryman\/apply"
        //     },
        //     "react_delivery_section_image": "2023-06-21-649273299ff67.png",
        //     "react_delivery_section_image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_delivery_section_image\/2023-06-21-649273299ff67.png"
        // },
        "download_app_section": {
            "react_download_apps_banner_image": "2023-06-21-6492737ae5e61.png",
            "react_download_apps_banner_image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_download_apps_image\/2023-06-21-6492737ae5e61.png",
            "react_download_apps_image": "2023-06-21-649274076d0ae.png",
            "react_download_apps_image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/react_download_apps_image\/2023-06-21-649274076d0ae.png",
            "react_download_apps_title": "Download app to enjoy more!",
            "react_download_apps_tag": "Download our app from google play store & app store.",
            "react_download_apps_sub_title": "All the best restaurants are one click away",
            "react_download_apps_app_store": {
                "react_download_apps_link_status": "1",
                "react_download_apps_link": "https:\/\/www.apple.com\/app-store\/"
            },
            "react_download_apps_play_store": {
                "react_download_apps_play_store_link": "https:\/\/play.google.com\/",
                "react_download_apps_play_store_status": "1"
            }
        },
        "news_letter_sub_title": "Stay upto date with restaurants around you. Subscribe with email.",
        "news_letter_title": "Lets Connect !",
        "footer_data": "is Best Delivery Service Near You",
        "available_zone_status": 1,
        "available_zone_title": "Available delivery areas \/ Zone",
        "available_zone_short_description": "We offer delivery services across a wide range of regions. To see if we deliver to your area, check our list of available delivery zones or use our delivery",
        "available_zone_image": "2024-10-19-6713a9ca07df5.png",
        "available_zone_image_full_url": "https:\/\/stackfood-admin.6amtech.com\/storage\/app\/public\/available_zone_image\/2024-10-19-6713a9ca07df5.png",
        "available_zone_list": [
            {
                "id": 1,
                "name": "All over India",
                "display_name": "All over India",
                "translations": [
                    {
                        "id": 1188,
                        "translationable_type": "App\\Models\\Zone",
                        "translationable_id": 1,
                        "locale": "en",
                        "key": "name",
                        "value": "All over India",
                        "created_at": null,
                        "updated_at": null
                    }
                ]
            }
        ]
    }}

export const storedDataSlice = createSlice({
    name: 'stored-data',
    initialState,
    reducers: {
        setFeaturedCategories: (state, action) => {
            state.featuredCategories = action.payload
        },
        setCuisines: (state, action) => {
            state.cuisines = action.payload
        },
        setPopularRestaurants: (state, action) => {
            state.popularRestaurants = action.payload
        },
        setCampaignFoods: (state, action) => {
            state.campaignFoods = action.payload
        },
        setBanners: (state, action) => {
            state.banners.banners = action.payload.banners
            state.banners.campaigns = action.payload.campaigns
        },
        setBestReviewedFood: (state, action) => {
            state.bestReviewedFoods = action.payload
        },
        setPopularFood: (state, action) => {
            state.popularFood = action.payload
        },
        setSuggestedKeywords: (state, action) => {
            state.suggestedKeywords = action.payload
        },
        setLandingPageData: (state, action) => {
            state.landingPageData = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    setLandingPageData,
    setFeaturedCategories,
    setCuisines,
    setPopularRestaurants,
    setCampaignFoods,
    setBanners,
    setBestReviewedFood,
    setPopularFood,
    setSuggestedKeywords,
} = storedDataSlice.actions
export default storedDataSlice.reducer
