import { CampaignApi } from '@/hooks/react-query/config/campaignApi'
import {
    MostReviewedApi,
    PopularFoodNearbyApi,
} from '@/hooks/react-query/config/productsApi'
import { useWishListGet } from '@/hooks/react-query/config/wish-list/useWishListGet'
import {
    setFilterbyByDispatch,
    setFoodOrRestaurant,
} from '@/redux/slices/searchFilter'
import {
    setSearchTagData,
    setSelectedName,
    setSelectedValue,
} from '@/redux/slices/searchTagSlice'
import {
    setBanners,
    setBestReviewedFood,
    setCampaignFoods,
    setPopularFood,
} from '@/redux/slices/storedData'
import { setWelcomeModal } from '@/redux/slices/utils'
import { setWishList } from '@/redux/slices/wishList'
import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Box } from '@mui/system'
import { t } from 'i18next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useDispatch, useSelector } from 'react-redux'
import { onSingleErrorResponse } from '../ErrorResponse'
import PushNotificationLayout from '../PushNotificationLayout'
import CashBackPopup from '../cash-back-popup/CashBackPopup'
import CustomContainer from '../container'
import CustomModal from '../custom-modal/CustomModal'
import ProductSearchPage from '../products-page/ProductSearchPage'
import Banner from './Banner'
import DifferentFoodCompontent from './DefferntFoodCompontent'
import NewRestaurant from './NewRestaurant'
import PromotionalBanner from './PromotionalBanner'
import Restaurant from './Restaurant'
import SearchFilterTag from './Search-filter-tag/SearchFilterTag'
import Cuisines from './cuisines'
import FeatureCatagories from './featured-categories/FeatureCatagories'
import VisitAgain from './visit-again'
import AddsSection from '@/components/home/add-section'

const Homes = () => {
    let configData = {
        "business_name": "Nazara SDK",
        "logo": "2022-04-17-625c012c3c07d.png",
        "logo_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/business/2022-04-17-625c012c3c07d.png",
        "address": "House: 00, Road: 00, City-0000, Country",
        "phone": "01700000000",
        "email": "admin@gmail.com",
        "base_urls": {
            "product_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/product",
            "customer_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/profile",
            "banner_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/banner",
            "category_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/category",
            "cuisine_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/cuisine",
            "review_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/review",
            "notification_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/notification",
            "restaurant_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/restaurant",
            "vendor_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/vendor",
            "restaurant_cover_photo_url": "https://stackfood-admin.6amtech.com/storage/app/public/restaurant/cover",
            "delivery_man_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/delivery-man",
            "chat_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/conversation",
            "campaign_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/campaign",
            "business_logo_url": "https://stackfood-admin.6amtech.com/storage/app/public/business",
            "react_landing_page_images": "https://stackfood-admin.6amtech.com/storage/app/public/react_landing",
            "react_landing_page_feature_images": "https://stackfood-admin.6amtech.com/storage/app/public/react_landing/feature",
            "refund_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/refund",
            "gateway_image_url": "https://stackfood-admin.6amtech.com/storage/app/public/payment_modules/gateway_image",
            "order_attachment_url": "https://stackfood-admin.6amtech.com/storage/app/public/order"
        },
        "country": "US",
        "default_location": {
            "lat": "23.76469684059319",
            "lng": "90.3514959774026"
        },
        "currency_symbol": "$",
        "currency_symbol_direction": "left",
        "app_minimum_version_android": 0,
        "app_url_android": null,
        "app_minimum_version_ios": 0,
        "app_url_ios": null,
        "customer_verification": false,
        "schedule_order": true,
        "order_delivery_verification": false,
        "cash_on_delivery": true,
        "digital_payment": true,
        "free_delivery_over": 3000,
        "free_delivery_distance": 0,
        "demo": true,
        "maintenance_mode": false,
        "order_confirmation_model": "restaurant",
        "popular_food": 1,
        "popular_restaurant": 1,
        "new_restaurant": 1,
        "most_reviewed_foods": 1,
        "show_dm_earning": true,
        "canceled_by_deliveryman": true,
        "canceled_by_restaurant": true,
        "timeformat": "12",
        "language": [
            {
                "key": "en",
                "value": "English"
            },
            {
                "key": "bn",
                "value": "Bengali - বাংলা"
            },
            {
                "key": "ar",
                "value": "Arabic - العربية"
            },
            {
                "key": "es",
                "value": "Spanish - español"
            }
        ],
        "toggle_veg_non_veg": true,
        "toggle_dm_registration": true,
        "toggle_restaurant_registration": true,
        "schedule_order_slot_duration": 30,
        "digit_after_decimal_point": 2,
        "loyalty_point_exchange_rate": 5,
        "loyalty_point_item_purchase_point": 2,
        "loyalty_point_status": 1,
        "minimum_point_to_transfer": 20,
        "customer_wallet_status": 1,
        "ref_earning_status": 1,
        "ref_earning_exchange_rate": 10,
        "dm_tips_status": 1,
        "theme": 1,
        "social_media": [
            {
                "id": 1,
                "name": "instagram",
                "link": "https://www.instagram.com/?hl=en",
                "status": 1,
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 2,
                "name": "facebook",
                "link": "https://www.facebook.com/",
                "status": 1,
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 3,
                "name": "twitter",
                "link": "https://twitter.com/?lang=en",
                "status": 1,
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 4,
                "name": "linkedin",
                "link": "https://bd.linkedin.com/",
                "status": 1,
                "created_at": null,
                "updated_at": null
            },
            {
                "id": 5,
                "name": "pinterest",
                "link": "https://www.pinterest.com/",
                "status": 1,
                "created_at": null,
                "updated_at": null
            }
        ],
        "social_login": [
            {
                "login_medium": "google",
                "status": true
            },
            {
                "login_medium": "facebook",
                "status": false
            }
        ],
        "business_plan": {
            "commission": 1,
            "subscription": 1
        },
        "admin_commission": 10,
        "footer_text": "Copyright 2024",
        "fav_icon": "2023-05-17-6464a9eb017ab.png",
        "fav_icon_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/business/2023-05-17-6464a9eb017ab.png",
        "refund_active_status": true,
        "free_trial_period_status": 0,
        "free_trial_period_data": 0,
        "app_minimum_version_android_restaurant": 0,
        "app_url_android_restaurant": null,
        "app_minimum_version_ios_restaurant": 0,
        "app_url_ios_restaurant": null,
        "app_minimum_version_android_deliveryman": 0,
        "app_url_android_deliveryman": null,
        "app_minimum_version_ios_deliveryman": null,
        "app_url_ios_deliveryman": null,
        "tax_included": 0,
        "apple_login": [
            {
                "login_medium": "apple",
                "status": false,
                "client_id": ""
            }
        ],
        "order_subscription": 1,
        "cookies_text": "We use cookies and similar technologies on our website to enhance your browsing experience and provide you with personalized content. By clicking 'Accept' or continuing to use our site, you agree to the use of these cookies.",
        "refund_policy_status": 1,
        "cancellation_policy_status": 1,
        "shipping_policy_status": 1,
        "refund_policy_data": "<p>Stack Food is a complete Multi-vendor Food products delivery system developed with powerful admin panel will help you to control your business smartly.</p>\r\n\r\n<p>Praesent fermentum finibus lacus. Nulla tincidunt lectus sed purus facilisis hendrerit. Maecenas volutpat elementum orci, tincidunt euismod ante facilisis ac. Integer dignissim iaculis varius. Mauris iaculis elit vel posuere pellentesque. Praesent a mi sed neque ullamcorper dignissim sed ut nibh. Sed purus dui, sodales in varius in, accumsan at libero. Vestibulum posuere dui et orci tincidunt, ac consequat felis venenatis.</p>\r\n\r\n<p>Morbi sodales, nisl iaculis fringilla imperdiet, metus tortor semper quam, a fringilla nulla dui nec dolor. Phasellus lacinia aliquam ligula sed porttitor. Cras feugiat eros ut arcu commodo dictum. Integer tincidunt nisl id nisl consequat molestie. Integer elit tortor, ultrices sit amet nunc vitae, feugiat tempus mauris. Morbi volutpat consectetur felis sed porttitor. Praesent in urna erat.</p>\r\n\r\n<p>Aenean mollis luctus dolor, eu interdum velit faucibus eu. Suspendisse vitae efficitur erat. In facilisis nisi id arcu scelerisque bibendum. Nunc a placerat enim. Donec pharetra, velit quis facilisis tempus, lectus est imperdiet nisl, in tempus tortor dolor iaculis dolor. Nunc vitae molestie turpis. Nam vitae lobortis massa. Nam pharetra non felis in porta.</p>\r\n\r\n<p>Vivamus pulvinar diam vel felis dignissim tincidunt. Donec hendrerit non est sed volutpat. In egestas ex tortor, at convallis nunc porttitor at. Fusce sed cursus risus. Nam metus sapien, viverra eget felis id, maximus convallis lacus. Donec nec lacus vitae ex hendrerit ultricies non vel risus. Morbi malesuada ipsum iaculis augue convallis vehicula. Proin eget dolor dignissim, volutpat purus ac, ultricies risus. Pellentesque semper, mauris et pharetra accumsan, ante velit faucibus ex, a mattis metus odio vel ligula. Pellentesque elementum suscipit laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a turpis sed massa blandit iaculis. Sed aliquet, justo vestibulum euismod rhoncus, nisi dui fringilla sapien, non tempor nunc lectus vitae dolor. Suspendisse potenti.</p>\r\n\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dictum massa et dolor porta, rhoncus faucibus magna elementum. Sed porta mattis mollis. Donec ut est pretium, pretium nibh porttitor, suscipit metus. Sed viverra felis sed elit vehicula sodales. Nullam ante ante, tristique vel tincidunt ac, egestas eget sem. Sed lorem nunc, pellentesque vel ipsum venenatis, pellentesque interdum orci. Suspendisse mauris dui, accumsan at dapibus sed, volutpat quis erat. Nam fringilla nisl eu nunc lobortis, feugiat posuere libero venenatis. Nunc risus lorem, ornare eget congue in, pretium quis enim. Pellentesque elit elit, pharetra eget nunc at, maximus pellentesque diam.</p>\r\n\r\n<p>Praesent fermentum finibus lacus. Nulla tincidunt lectus sed purus facilisis hendrerit. Maecenas volutpat elementum orci, tincidunt euismod ante facilisis ac. Integer dignissim iaculis varius. Mauris iaculis elit vel posuere pellentesque. Praesent a mi sed neque ullamcorper dignissim sed ut nibh. Sed purus dui, sodales in varius in, accumsan at libero. Vestibulum posuere dui et orci tincidunt, ac consequat felis venenatis.</p>\r\n\r\n<p>Morbi sodales, nisl iaculis fringilla imperdiet, metus tortor semper quam, a fringilla nulla dui nec dolor. Phasellus lacinia aliquam ligula sed porttitor. Cras feugiat eros ut arcu commodo dictum. Integer tincidunt nisl id nisl consequat molestie. Integer elit tortor, ultrices sit amet nunc vitae, feugiat tempus mauris. Morbi volutpat consectetur felis sed porttitor. Praesent in urna erat.</p>\r\n\r\n<p>Aenean mollis luctus dolor, eu interdum velit faucibus eu. Suspendisse vitae efficitur erat. In facilisis nisi id arcu scelerisque bibendum. Nunc a placerat enim. Donec pharetra, velit quis facilisis tempus, lectus est imperdiet nisl, in tempus tortor dolor iaculis dolor. Nunc vitae molestie turpis. Nam vitae lobortis massa. Nam pharetra non felis in porta.</p>\r\n\r\n<p>Vivamus pulvinar diam vel felis dignissim tincidunt. Donec hendrerit non est sed volutpat. In egestas ex tortor, at convallis nunc porttitor at. Fusce sed cursus risus. Nam metus sapien, viverra eget felis id, maximus convallis lacus. Donec nec lacus vitae ex hendrerit ultricies non vel risus. Morbi malesuada ipsum iaculis augue convallis vehicula. Proin eget dolor dignissim, volutpat purus ac, ultricies risus. Pellentesque semper, mauris et pharetra accumsan, ante velit faucibus ex, a mattis metus odio vel ligula. Pellentesque elementum suscipit laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a turpis sed massa blandit iaculis. Sed aliquet, justo vestibulum euismod rhoncus, nisi dui fringilla sapien, non tempor nunc lectus vitae dolor. Suspendisse potenti.</p>\r\n\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dictum massa et dolor porta, rhoncus faucibus magna elementum. Sed porta mattis mollis. Donec ut est pretium, pretium nibh porttitor, suscipit metus. Sed viverra felis sed elit vehicula sodales. Nullam ante ante, tristique vel tincidunt ac, egestas eget sem. Sed lorem nunc, pellentesque vel ipsum venenatis, pellentesque interdum orci. Suspendisse mauris dui, accumsan at dapibus sed, volutpat quis erat. Nam fringilla nisl eu nunc lobortis, feugiat posuere libero venenatis. Nunc risus lorem, ornare eget congue in, pretium quis enim. Pellentesque elit elit, pharetra eget nunc at, maximus pellentesque diam.</p>\r\n\r\n<p>Praesent fermentum finibus lacus. Nulla tincidunt lectus sed purus facilisis hendrerit. Maecenas volutpat elementum orci, tincidunt euismod ante facilisis ac. Integer dignissim iaculis varius. Mauris iaculis elit vel posuere pellentesque. Praesent a mi sed neque ullamcorper dignissim sed ut nibh. Sed purus dui, sodales in varius in, accumsan at libero. Vestibulum posuere dui et orci tincidunt, ac consequat felis venenatis.</p>\r\n\r\n<p>Morbi sodales, nisl iaculis fringilla imperdiet, metus tortor semper quam, a fringilla nulla dui nec dolor. Phasellus lacinia aliquam ligula sed porttitor. Cras feugiat eros ut arcu commodo dictum. Integer tincidunt nisl id nisl consequat molestie. Integer elit tortor, ultrices sit amet nunc vitae, feugiat tempus mauris. Morbi volutpat consectetur felis sed porttitor. Praesent in urna erat.</p>\r\n\r\n<p>Aenean mollis luctus dolor, eu interdum velit faucibus eu. Suspendisse vitae efficitur erat. In facilisis nisi id arcu scelerisque bibendum. Nunc a placerat enim. Donec pharetra, velit quis facilisis tempus, lectus est imperdiet nisl, in tempus tortor dolor iaculis dolor. Nunc vitae molestie turpis. Nam vitae lobortis massa. Nam pharetra non felis in porta.</p>\r\n\r\n<p>Vivamus pulvinar diam vel felis dignissim tincidunt. Donec hendrerit non est sed volutpat. In egestas ex tortor, at convallis nunc porttitor at. Fusce sed cursus risus. Nam metus sapien, viverra eget felis id, maximus convallis lacus. Donec nec lacus vitae ex hendrerit ultricies non vel risus. Morbi malesuada ipsum iaculis augue convallis vehicula. Proin eget dolor dignissim, volutpat purus ac, ultricies risus. Pellentesque semper, mauris et pharetra accumsan, ante velit faucibus ex, a mattis metus odio vel ligula. Pellentesque elementum suscipit laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a turpis sed massa blandit iaculis. Sed aliquet, justo vestibulum euismod rhoncus, nisi dui fringilla sapien, non tempor nunc lectus vitae dolor. Suspendisse potenti.</p>\r\n\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras dictum massa et dolor porta, rhoncus faucibus magna elementum. Sed porta mattis mollis. Donec ut est pretium, pretium nibh porttitor, suscipit metus. Sed viverra felis sed elit vehicula sodales. Nullam ante ante, tristique vel tincidunt ac, egestas eget sem. Sed lorem nunc, pellentesque vel ipsum venenatis, pellentesque interdum orci. Suspendisse mauris dui, accumsan at dapibus sed, volutpat quis erat. Nam fringilla nisl eu nunc lobortis, feugiat posuere libero venenatis. Nunc risus lorem, ornare eget congue in, pretium quis enim. Pellentesque elit elit, pharetra eget nunc at, maximus pellentesque diam.</p>\r\n\r\n<p>Praesent fermentum finibus lacus. Nulla tincidunt lectus sed purus facilisis hendrerit. Maecenas volutpat elementum orci, tincidunt euismod ante facilisis ac. Integer dignissim iaculis varius. Mauris iaculis elit vel posuere pellentesque. Praesent a mi sed neque ullamcorper dignissim sed ut nibh. Sed purus dui, sodales in varius in, accumsan at libero. Vestibulum posuere dui et orci tincidunt, ac consequat felis venenatis.</p>\r\n\r\n<p>Morbi sodales, nisl iaculis fringilla imperdiet, metus tortor semper quam, a fringilla nulla dui nec dolor. Phasellus lacinia aliquam ligula sed porttitor. Cras feugiat eros ut arcu commodo dictum. Integer tincidunt nisl id nisl consequat molestie. Integer elit tortor, ultrices sit amet nunc vitae, feugiat tempus mauris. Morbi volutpat consectetur felis sed porttitor. Praesent in urna erat.</p>\r\n\r\n<p>Aenean mollis luctus dolor, eu interdum velit faucibus eu. Suspendisse vitae efficitur erat. In facilisis nisi id arcu scelerisque bibendum. Nunc a placerat enim. Donec pharetra, velit quis facilisis tempus, lectus est imperdiet nisl, in tempus tortor dolor iaculis dolor. Nunc vitae molestie turpis. Nam vitae lobortis massa. Nam pharetra non felis in porta.</p>\r\n\r\n<p>Vivamus pulvinar diam vel felis dignissim tincidunt. Donec hendrerit non est sed volutpat. In egestas ex tortor, at convallis nunc porttitor at. Fusce sed cursus risus. Nam metus sapien, viverra eget felis id, maximus convallis lacus. Donec nec lacus vitae ex hendrerit ultricies non vel risus. Morbi malesuada ipsum iaculis augue convallis vehicula. Proin eget dolor dignissim, volutpat purus ac, ultricies risus. Pellentesque semper, mauris et pharetra accumsan, ante velit faucibus ex, a mattis metus odio vel ligula. Pellentesque elementum suscipit laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a turpis sed massa blandit iaculis. Sed aliquet, justo vestibulum euismod rhoncus, nisi dui fringilla sapien, non tempor nunc lectus vitae dolor. Suspendisse potenti.</p>",
        "cancellation_policy_data": "<h1>This is a demo cancelation policy</h1>\r\n\r\n<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis nunc tortor, non malesuada nunc tincidunt id. Sed porta ex nec sapien convallis hendrerit. Pellentesque auctor dapibus eleifend. Cras tempus, sapien sed dignissim consequat, dolor nunc volutpat urna, at hendrerit dui dolor dapibus odio. Sed dolor purus, luctus in dui non, fermentum imperdiet nibh. Aenean at libero ut libero auctor finibus. Vivamus eu nulla vel risus dapibus tincidunt eget non orci. Sed lorem velit, sollicitudin eu mi vitae, rutrum congue orci. Phasellus sit amet ex accumsan, semper magna in, lobortis nibh. Maecenas ut iaculis ex, eget pellentesque sapien. Praesent tristique eros mauris.</p>\r\n\r\n<p>Nam in blandit dui, venenatis sodales ante. Aenean pulvinar feugiat eros non convallis. Integer vel posuere lacus. Fusce eget leo in erat venenatis vehicula. Praesent congue lorem sed neque porta hendrerit. Curabitur sollicitudin tincidunt sapien eu venenatis. In at mattis odio. Aenean gravida enim eget ipsum congue gravida. Proin dapibus non ante sed ultrices.</p>\r\n\r\n<p>Suspendisse at quam et sapien rutrum consequat at accumsan dolor. Cras nisl nibh, auctor ut vestibulum sit amet, pretium vitae ligula. Vestibulum id maximus sapien, sit amet laoreet velit. Mauris dui eros, vehicula vel dolor id, lobortis aliquet quam. Cras quis turpis sit amet urna finibus consequat ac pellentesque lorem. Maecenas rutrum eu nulla non tincidunt. Suspendisse pulvinar pellentesque purus, sit amet porttitor lorem feugiat et. Sed ac nisl vel felis ultricies placerat sit amet ac enim. Duis ex justo, bibendum et tortor sit amet, tincidunt ornare dolor. Suspendisse potenti. Suspendisse augue nulla, fringilla id cursus laoreet, scelerisque id mauris. Suspendisse in libero ac nibh lobortis pretium. Quisque quis orci in felis venenatis varius. Ut lacinia faucibus pellentesque.</p>\r\n\r\n<p>Aenean condimentum justo orci, at rutrum ipsum scelerisque nec. Phasellus quis vestibulum justo. Proin lacus ligula, viverra eget aliquet quis, sagittis sed augue. Sed aliquet eleifend massa sit amet iaculis. Vestibulum commodo bibendum lorem quis accumsan. Cras et dolor at risus vestibulum imperdiet. Integer velit massa, egestas ac sapien sed, blandit lobortis metus. Donec sit amet elementum nisl. Ut lorem ex, luctus ac laoreet nec, semper eget erat. Quisque eu efficitur nunc. Nullam scelerisque laoreet pharetra. Nunc consectetur congue lacus, et gravida felis. Mauris eu justo pharetra, aliquet velit et, auctor sem. Nulla ut tortor lectus.</p>\r\n\r\n<p>Donec efficitur molestie elementum. Quisque nec nisl in erat tincidunt consequat. Vivamus non risus a augue viverra pharetra. Suspendisse viverra semper velit nec rhoncus. Aliquam feugiat nec lectus ac tempor. Vivamus nunc neque, vulputate sit amet facilisis tempor, placerat sit amet enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam sollicitudin odio lorem, vitae rhoncus felis imperdiet non. Pellentesque consectetur, ante at iaculis dictum, mi felis hendrerit massa, ut efficitur mauris turpis vitae dolor. Etiam facilisis commodo lacus, in venenatis ex molestie nec. Curabitur pellentesque sem id velit vehicula tristique. Phasellus molestie luctus elit vitae iaculis.</p>",
        "shipping_policy_data": "<p>This is a demo shipping policy<br />\r\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed iaculis nunc tortor, non malesuada nunc tincidunt id. Sed porta ex nec sapien convallis hendrerit. Pellentesque auctor dapibus eleifend. Cras tempus, sapien sed dignissim consequat, dolor nunc volutpat urna, at hendrerit dui dolor dapibus odio. Sed dolor purus, luctus in dui non, fermentum imperdiet nibh. Aenean at libero ut libero auctor finibus. Vivamus eu nulla vel risus dapibus tincidunt eget non orci. Sed lorem velit, sollicitudin eu mi vitae, rutrum congue orci. Phasellus sit amet ex accumsan, semper magna in, lobortis nibh. Maecenas ut iaculis ex, eget pellentesque sapien. Praesent tristique eros mauris.</p>\r\n\r\n<p>Nam in blandit dui, venenatis sodales ante. Aenean pulvinar feugiat eros non convallis. Integer vel posuere lacus. Fusce eget leo in erat venenaatis vehicula. Praesent congue lorem sed neque porta hendrerit. Curabitur sollicitudin tincidunt sapien eu venenatis. In at mattis odio. Aenean gravida enim eget ipsum congue gravida. Proin dapibus non ante sed ultrices.</p>\r\n\r\n<p>Suspendisse at quam et sapien rutrum consequat at accumsan dolor. Cras nisl nibh, auctor ut vestibulum sit amet, pretium vitae ligula. Vestibulum id maximus sapien, sit amet laoreet velit. Mauris dui eros, vehicula vel dolor id, lobortis aliquet quam. Cras quis turpis sit amet urna finibus consequat ac pellentesque lorem. Maecenas rutrum eu nulla non tincidunt. Suspendisse pulvinar pellentesque purus, sit amet porttitor lorem feugiat et. Sed ac nisl vel felis ultricies placerat sit amet ac enim. Duis ex justo, bibendum et tortor sit amet, tincidunt ornare dolor. Suspendisse potenti. Suspendisse augue nulla, fringilla id cursus laoreet, scelerisque id mauris. Suspendisse in libero ac nibh lobortis pretium. Quisque quis orci in felis venenatis varius. Ut lacinia faucibus pellentesque.</p>\r\n\r\n<p>Aenean condimentum justo orci, at rutrum ipsum scelerisque nec. Phasellus quis vestibulum justo. Proin lacus ligula, viverra eget aliquet quis, sagittis sed augue. Sed aliquet eleifend massa sit amet iaculis. Vestibulum commodo bibendum lorem quis accumsan. Cras et dolor at risus vestibulum imperdiet. Integer velit massa, egestas ac sapien sed, blandit lobortis metus. Donec sit amet elementum nisl. Ut lorem ex, luctus ac laoreet nec, semper eget erat. Quisque eu efficitur nunc. Nullam scelerisque laoreet pharetra. Nunc consectetur congue lacus, et gravida felis. Mauris eu justo pharetra, aliquet velit et, auctor sem. Nulla ut tortor lectus.</p>\r\n\r\n<p>Donec efficitur molestie elementum. Quisque nec nisl in erat tincidunt consequat. Vivamus non risus a augue viverra pharetra. Suspendisse viverra semper velit nec rhoncus. Aliquam feugiat nec lectus ac tempor. Vivamus nunc neque, vulputate sit amet facilisis tempor, placerat sit amet enim. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Etiam sollicitudin odio lorem, vitae rhoncus felis imperdiet non. Pellentesque consectetur, ante at iaculis dictum, mi felis hendrerit massa, ut efficitur mauris turpis vitae dolor. Etiam facilisis commodo lacus, in venenatis ex molestie nec. Curabitur pellentesque sem id velit vehicula tristique. Phasellus molestie luctus elit vitae iaculis.</p>",
        "terms_and_conditions": "<p>This is a test Teams &amp; Conditions<br />\r\nThese terms of use (the &quot;Terms of Use&quot;) govern your use of our website www.StackFood,6amtech.com (the &quot;Website&quot;) and our &quot;StackFood&quot; application for mobile and handheld devices (the &quot;App&quot;). The Website and the App are jointly referred to as the &quot;Platform&quot;. Please read these Terms of Use carefully before you use the services. If you do not agree to these Terms of Use, you may not use the services on the Platform, and we request you to uninstall the App. By installing, downloading and/or even merely using the Platform, you shall be contracting with StackFood and you provide your acceptance to the Terms of Use and other StackFood policies (including but not limited to the Cancellation &amp; Refund Policy, Privacy Policy etc.) as posted on the Platform from time to time, which takes effect on the date on which you download, install or use the Services, and create a legally binding arrangement to abide by the same. The Platforms will be used by (i) natural persons who have reached 18 years of age and (ii) corporate legal entities, e.g companies. Where applicable, these Terms shall be subject to country-specific provisions as set out herein.</p>\r\n\r\n<p>USE OF PLATFORM AND SERVICES<br />\r\nAll commercial/contractual terms are offered by and agreed to between Buyers and Merchants alone. The commercial/contractual terms include without limitation to price, taxes, shipping costs, payment methods, payment terms, date, period and mode of delivery, warranties related to products and services and after sales services related to products and services. StackFood does not have any kind of control or does not determine or advise or in any way involve itself in the offering or acceptance of such commercial/contractual terms between the Buyers and Merchants. StackFood may, however, offer support services to Merchants in respect to order fulfilment, payment collection, call centre, and other services, pursuant to independent contracts executed by it with the Merchants. eFood is not responsible for any non-performance or breach of any contract entered into between Buyers and Merchants on the Platform. eFood cannot and does not guarantee that the concerned Buyers and/or Merchants shall perform any transaction concluded on the Platform. eFood is not responsible for unsatisfactory services or non-performance of services or damages or delays as a result of products which are out of stock, unavailable or back ordered.</p>\r\n\r\n<p>StackFood is operating an e-commerce platform and assumes and operates the role of facilitator, and does not at any point of time during any transaction between Buyer and Merchant on the Platform come into or take possession of any of the products or services offered by Merchant. At no time shall StackFood hold any right, title or interest over the products nor shall StackFood have any obligations or liabilities in respect of such contract entered into between Buyer and Merchant. You agree and acknowledge that we shall not be responsible for:</p>\r\n\r\n<p>The goods provided by the shops or restaurants including, but not limited, serving of food orders suiting your requirements and needs;<br />\r\nThe Merchant&quot;s goods not being up to your expectations or leading to any loss, harm or damage to you;<br />\r\nThe availability or unavailability of certain items on the menu;<br />\r\nThe Merchant serving the incorrect orders.<br />\r\nThe details of the menu and price list available on the Platform are based on the information provided by the Merchants and we shall not be responsible for any change or cancellation or unavailability. All Menu &amp; Food Images used on our platforms are only representative and shall/might not match with the actual Menu/Food Ordered, StackFood shall not be responsible or Liable for any discrepancies or variations on this aspect.</p>\r\n\r\n<p>Personal Information that you provide<br />\r\nIf you want to use our service, you must create an account on our Site. To establish your account, we will ask for personally identifiable information that can be used to contact or identify you, which may include your name, phone number, and e-mail address. We may also collect demographic information about you, such as your zip code, and allow you to submit additional information that will be part of your profile. Other than basic information that we need to establish your account, it will be up to you to decide how much information to share as part of your profile. We encourage you to think carefully about the information that you share and we recommend that you guard your identity and your sensitive information. Of course, you can review and revise your profile at any time.</p>\r\n\r\n<p>You understand that delivery periods quoted to you at the time of confirming the order is an approximate estimate and may vary. We shall not be responsible for any delay in the delivery of your order due to the delay at seller/merchant end for order processing or any other unavoidable circumstances.</p>\r\n\r\n<p>Your order shall be only delivered to the address designated by you at the time of placing the order on the Platform. We reserve the right to cancel the order, in our sole discretion, in the event of any change to the place of delivery and you shall not be entitled to any refund for the same. Delivery in the event of change of the delivery location shall be at our sole discretion and reserve the right to charge with additional delivery fee if required.</p>\r\n\r\n<p>You shall undertake to provide adequate directions, information and authorizations to accept delivery. In the event of any failure to accept delivery, failure to deliver within the estimated time due to your failure to provide appropriate instructions, or authorizations, then such goods shall be deemed to have been delivered to you and all risk and responsibility in relation to such goods shall pass to you and you shall not be entitled to any refund for the same. Our decision in relation to this shall be final and binding. You understand that our liability ends once your order has been delivered to you.</p>\r\n\r\n<p>You might be required to provide your credit or debit card details to the approved payment gateways while making the payment. In this regard, you agree to provide correct and accurate credit/ debit card details to the approved payment gateways for availing the Services. You shall not use the credit/ debit card which is not lawfully owned by you, i.e. in any transaction, you must use your own credit/ debit card. The information provided by you shall not be utilized or shared with any third party unless required in relation to fraud verifications or by law, regulation or court order. You shall be solely responsible for the security and confidentiality of your credit/ debit card details. We expressly disclaim all liabilities that may arise as a consequence of any unauthorized use of your credit/ debit card. You agree that the Services shall be provided by us only during the working hours of the relevant Merchants.</p>\r\n\r\n<p>ACTIVITIES PROHIBITED ON THE PLATFORM<br />\r\nThe following is a partial list of the kinds of conduct that are illegal or prohibited on the Websites. StackFood reserves the right to investigate and take appropriate legal action/s against anyone who, in StackFood sole discretion, engages in any of the prohibited activities. Prohibited activities include &mdash; but are not limited to &mdash; the following:</p>\r\n\r\n<p>Using the Websites for any purpose in violation of laws or regulations;<br />\r\nPosting Content that infringes the intellectual property rights, privacy rights, publicity rights, trade secret rights, or any other rights of any party;<br />\r\nPosting Content that is unlawful, obscene, defamatory, threatening, harassing, abusive, slanderous, hateful, or embarrassing to any other person or entity as determined by StackFood in its sole discretion or pursuant to local community standards;<br />\r\nPosting Content that constitutes cyber-bullying, as determined by StackFood in its sole discretion;<br />\r\nPosting Content that depicts any dangerous, life-threatening, or otherwise risky behavior;<br />\r\nPosting telephone numbers, street addresses, or last names of any person;<br />\r\nPosting URLs to external websites or any form of HTML or programming code;<br />\r\nPosting anything that may be &quot;spam,&quot; as determined by StackFood in its sole discretion;<br />\r\nImpersonating another person when posting Content;<br />\r\nHarvesting or otherwise collecting information about others, including email addresses, without their consent;<br />\r\nAllowing any other person or entity to use your identification for posting or viewing comments;<br />\r\nHarassing, threatening, stalking, or abusing any person;<br />\r\nEngaging in any other conduct that restricts or inhibits any other person from using or enjoying the Websites, or which, in the sole discretion of StackFood , exposes eFood or any of its customers, suppliers, or any other parties to any liability or detriment of any type; or<br />\r\nEncouraging other people to engage in any prohibited activities as described herein.<br />\r\nStackFood reserves the right but is not obligated to do any or all of the following:</p>\r\n\r\n<p>Investigate an allegation that any Content posted on the Websites does not conform to these Terms of Use and determine in its sole discretion to remove or request the removal of the Content;<br />\r\nRemove Content which is abusive, illegal, or disruptive, or that otherwise fails to conform with these Terms of Use;<br />\r\nTerminate a user&#39;s access to the Websites upon any breach of these Terms of Use;<br />\r\nMonitor, edit, or disclose any Content on the Websites; and<br />\r\nEdit or delete any Content posted on the Websites, regardless of whether such Content violates these standards.<br />\r\nAMENDMENTS<br />\r\nStackFood reserves the right to change or modify these Terms (including our policies which are incorporated into these Terms) at any time by posting changes on the Platform. You are strongly recommended to read these Terms regularly. You will be deemed to have agreed to the amended Terms by your continued use of the Platforms following the date on which the amended Terms are posted.</p>\r\n\r\n<p>PAYMENT<br />\r\nStackFood reserves the right to offer additional payment methods and/or remove existing payment methods at any time in its sole discretion. If you choose to pay using an online payment method, the payment shall be processed by our third party payment service provider(s). With your consent, your credit card / payment information will be stored with our third party payment service provider(s) for future orders. StackFood does not store your credit card or payment information. You must ensure that you have sufficient funds on your credit and debit card to fulfil payment of an Order. Insofar as required, StackFood takes responsibility for payments made on our Platforms including refunds, chargebacks, cancellations and dispute resolution, provided if reasonable and justifiable and in accordance with these Terms.</p>\r\n\r\n<p>CANCELLATION<br />\r\nStackFood can cancel any order anytime due to the foods/products unavailability, out of coverage area and any other unavoidable circumstances.</p>",
        "privacy_policy": "<p>StackFood is a complete Multi-vendor food product delivery system developed with a powerful admin panel to help you control your business smartly.</p>\r\n\r\n<p>Praesent fermentum finibus lacus. Nulla tincidunt lectus sed purus facilisis hendrerit. Maecenas volutpat elementum orci, tincidunt euismod ante facilisis ac. Integer dignissim iaculis varius. Mauris iaculis elit vel posuere pellentesque. Praesent a mi sed neque ullamcorper dignissim sed ut nibh. Sed purus dui, sodales in varius in, accumsan at libero. Vestibulum posuere dui et orci tincidunt, ac consequat felis venenatis.</p>\r\n\r\n<p>Morbi sodales, nisl iaculis fringilla imperdiet, metus tortor semper quam, a fringilla nulla dui nec dolor. Phasellus lacinia aliquam ligula sed porttitor. Cras feugiat eros ut arcu commodo dictum. Integer tincidunt nisl id nisl consequat molestie. Integer elit tortor, ultrices sit amet nunc vitae, feugiat tempus mauris. Morbi volutpat consectetur felis sed porttitor. Praesent in urna erat.</p>\r\n\r\n<p>Aenean mollis luctus dolor, eu interdum velit faucibus eu. Suspendisse vitae efficitur erat. In facilisis nisi id arcu scelerisque bibendum. Nunc a placerat enim. Donec pharetra, velit quis facilisis tempus, lectus est imperdiet nisl, in tempus tortor dolor iaculis dolor. Nunc vitae molestie turpis. Nam vitae lobortis massa. Nam pharetra non felis in porta.</p>\r\n\r\n<p>Vivamus pulvinar diam vel felis dignissim tincidunt. Donec hendrerit non est sed volutpat. In egestas ex tortor, at convallis nunc porttitor at. Fusce sed cursus risus. Nam metus sapien, viverra eget felis id, maximus convallis lacus. Donec nec lacus vitae ex hendrerit ultricies non vel risus. Morbi malesuada ipsum iaculis augue convallis vehicula. Proin eget dolor dignissim, volutpat purus ac, ultricies risus. Pellentesque semper, mauris et pharetra accumsan, ante velit faucibus ex, a mattis metus odio vel ligula. Pellentesque elementum suscipit laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a turpis sed massa blandit iaculis. Sed aliquet, justo vestibulum euismod rhoncus, nisi dui fringilla sapien, non tempor nunc lectus vitae dolor. Suspendisse potenti.</p>",
        "about_us": "<p>StackFood is a complete Multi-vendor Foodkind of products delivery system developed with powerful admin panel will help you to control your business smartly.</p>\r\n\r\n<p>Praesent fermentum finibus lacus. Nulla tincidunt lectus sed purus facilisis hendrerit. Maecenas volutpat elementum orci, tincidunt euismod ante facilisis ac. Integer dignissim iaculis varius. Mauris iaculis elit vel posuere pellentesque. Praesent a mi sed neque ullamcorper dignissim sed ut nibh. Sed purus dui, sodales in varius in, accumsan at libero. Vestibulum posuere dui et orci tincidunt, ac consequat felis venenatis.</p>\r\n\r\n<p>Morbi sodales, nisl iaculis fringilla imperdiet, metus tortor semper quam, a fringilla nulla dui nec dolor. Phasellus lacinia aliquam ligula sed porttitor. Cras feugiat eros ut arcu commodo dictum. Integer tincidunt nisl id nisl consequat molestie. Integer elit tortor, ultrices sit amet nunc vitae, feugiat tempus mauris. Morbi volutpat consectetur felis sed porttitor. Praesent in urna erat.</p>\r\n\r\n<p>Aenean mollis luctus dolor, eu interdum velit faucibus eu. Suspendisse vitae efficitur erat. In facilisis nisi id arcu scelerisque bibendum. Nunc a placerat enim. Donec pharetra, velit quis facilisis tempus, lectus est imperdiet nisl, in tempus tortor dolor iaculis dolor. Nunc vitae molestie turpis. Nam vitae lobortis massa. Nam pharetra non felis in porta.</p>\r\n\r\n<p>Vivamus pulvinar diam vel felis dignissim tincidunt. Donec hendrerit non est sed volutpat. In egestas ex tortor, at convallis nunc porttitor at. Fusce sed cursus risus. Nam metus sapien, viverra eget felis id, maximus convallis lacus. Donec nec lacus vitae ex hendrerit ultricies non vel risus. Morbi malesuada ipsum iaculis augue convallis vehicula. Proin eget dolor dignissim, volutpat purus ac, ultricies risus. Pellentesque semper, mauris et pharetra accumsan, ante velit faucibus ex, a mattis metus odio vel ligula. Pellentesque elementum suscipit laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Integer a turpis sed massa blandit iaculis. Sed aliquet, justo vestibulum euismod rhoncus, nisi dui fringilla sapien, non tempor nunc lectus vitae dolor. Suspendisse potenti.</p>",
        "take_away": true,
        "repeat_order_option": true,
        "home_delivery": true,
        "active_payment_method_list": [
            {
                "gateway": "paypal",
                "gateway_title": "Paypal",
                "gateway_image": "2023-09-07-64f9aece2abf6.png",
                "gateway_image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/payment_modules/gateway_image/2023-09-07-64f9aece2abf6.png"
            },
            {
                "gateway": "stripe",
                "gateway_title": "Stripe",
                "gateway_image": "2023-09-07-64f9af57bc364.png",
                "gateway_image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/payment_modules/gateway_image/2023-09-07-64f9af57bc364.png"
            },
            {
                "gateway": "razor_pay",
                "gateway_title": "Razor pay",
                "gateway_image": "2023-09-07-64f9af7667902.png",
                "gateway_image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/payment_modules/gateway_image/2023-09-07-64f9af7667902.png"
            },
            {
                "gateway": "ssl_commerz",
                "gateway_title": "Ssl commerz",
                "gateway_image": "2023-09-07-64f9af907745a.png",
                "gateway_image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/payment_modules/gateway_image/2023-09-07-64f9af907745a.png"
            }
        ],
        "add_fund_status": 1,
        "partial_payment_status": 1,
        "partial_payment_method": "both",
        "additional_charge_status": 1,
        "additional_charge_name": "Service Charge",
        "additional_charge": 10,
        "dm_picture_upload_status": 1,
        "digital_payment_info": {
            "digital_payment": true,
            "plugin_payment_gateways": false,
            "default_payment_gateways": true
        },
        "banner_data": {
            "promotional_banner_image": "2023-11-20-655b619725719.png",
            "promotional_banner_title": "Promotional",
            "promotional_banner_image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/banner/2023-11-20-655b619725719.png"
        },
        "offline_payment_status": 1,
        "guest_checkout_status": 1,
        "country_picker_status": 1,
        "instant_order": true,
        "extra_packaging_charge": true,
        "customer_date_order_sratus": true,
        "customer_order_date": 5,
        "deliveryman_additional_join_us_page_data": {
            "data": [
                {
                    "field_type": "number",
                    "input_data": "enter_your_age",
                    "check_data": null,
                    "media_data": null,
                    "placeholder_data": "Enter Age",
                    "is_required": 1
                },
                {
                    "field_type": "date",
                    "input_data": "enter_your_birthdate",
                    "check_data": null,
                    "media_data": null,
                    "placeholder_data": "Enter Date",
                    "is_required": 1
                },
                {
                    "field_type": "file",
                    "input_data": "driving_license",
                    "check_data": null,
                    "media_data": {
                        "upload_multiple_files": 0,
                        "image": 1,
                        "pdf": 1,
                        "docs": 1
                    },
                    "placeholder_data": "",
                    "is_required": 1
                }
            ]
        },
        "restaurant_additional_join_us_page_data": {
            "data": [
                {
                    "field_type": "text",
                    "input_data": "enter_your_tin_number",
                    "check_data": null,
                    "media_data": null,
                    "placeholder_data": "Enter TIN",
                    "is_required": 1
                },
                {
                    "field_type": "date",
                    "input_data": "date",
                    "check_data": null,
                    "media_data": null,
                    "placeholder_data": "Enter Date",
                    "is_required": 1
                },
                {
                    "field_type": "file",
                    "input_data": "license_document",
                    "check_data": null,
                    "media_data": {
                        "upload_multiple_files": 0,
                        "image": 1,
                        "pdf": 1,
                        "docs": 1
                    },
                    "placeholder_data": "",
                    "is_required": 1
                }
            ]
        },
        "disbursement_type": "manual",
        "restaurant_disbursement_waiting_time": 7,
        "dm_disbursement_waiting_time": 7,
        "min_amount_to_pay_restaurant": 0,
        "min_amount_to_pay_dm": 0,
        "restaurant_review_reply": true,
        "maintenance_mode_data": null,
        "firebase_otp_verification": 0,
        "centralize_login": {
            "manual_login_status": 1,
            "otp_login_status": 1,
            "social_login_status": 1,
            "google_login_status": 1,
            "facebook_login_status": 0,
            "apple_login_status": 0,
            "email_verification_status": 1,
            "phone_verification_status": 1
        },
        "subscription_business_model": 1,
        "commission_business_model": 1,
        "subscription_deadline_warning_days": 5,
        "subscription_deadline_warning_message": "Your subscription ending soon. Please renew to continue access.",
        "subscription_free_trial_days": 7,
        "subscription_free_trial_type": "day",
        "subscription_free_trial_status": 1
    }
    const { global } = useSelector((state) => state.globalSettings)
    const [fetchedData, setFetcheedData] = useState({})
    const { filterData, foodOrRestaurant } = useSelector(
        (state) => state.searchFilterStore
    )
    const { userData } = useSelector((state) => state.user)
    const [sort_by, setSort_by] = useState('')
    const { searchTagData } = useSelector((state) => state.searchTags)
    const router = useRouter()
    const { query, page, restaurantType, tags } = router.query
    const [welcomeModal,setWelcomeModal] = useState(false);
    const dispatch = useDispatch()
    
    let getToken = undefined
    if (typeof window !== 'undefined') {
        getToken = localStorage.getItem('token')
    }

    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const location = useSelector(state => state.addressData.location)


   const handleCloseWelcomeModal = ()=>{
    setWelcomeModal(false);
   }



    const iSSearchValue = false

    useEffect(() => {
        const activeFilters = searchTagData.filter(
            (item) => item.isActive === true
        )
        if (activeFilters?.length > 0) {
            if (router.asPath === '/home') {
                const newArr = searchTagData.map((item) => ({
                    ...item,
                    isActive: false,
                }))
                dispatch(setSearchTagData(newArr))
                dispatch(setFoodOrRestaurant('products'))
                dispatch(setSelectedValue(''))
                dispatch(setSelectedName(''))
                setSort_by('')
            }
        }
        dispatch(setFilterbyByDispatch(activeFilters))
    }, [tags, page, restaurantType, query])

   
    return (
        <>
             <PushNotificationLayout>
                {query &&<CustomContainer>
                    <CustomStackFullWidth
                        sx={{
                            marginTop: { xs: '60px', md: '130px' },
                            marginBottom: '10px',
                        }}
                    >
                        <Typography
                            fontSize={{ xs: '16px', md: '20px' }}
                            fontWeight={{
                                xs: '500',
                                md: '700',
                            }}
                            color={theme.palette.neutral[1000]}
                        >
                            {t('Find Best Restaurants and Foods')}
                        </Typography>
                    </CustomStackFullWidth>
                </CustomContainer>}
                {query && <SearchFilterTag
                    sort_by={sort_by}
                    setSort_by={setSort_by}
                    tags={tags}
                    query={query}
                    page={page}
                />}
                {query || page || restaurantType || tags ? (
                    <CustomContainer>
                        <ProductSearchPage
                            tags={tags}
                            configData={configData}
                            query={query}
                            page={page}
                            restaurantType={restaurantType}
                        />
                    </CustomContainer>
                ) : (
                    <>
                        <Box>
                            <FeatureCatagories height="70px" />
                            {/* <CustomContainer>
                                <VisitAgain />
                                <AddsSection />
                            </CustomContainer> */}
                        </Box>
                        <CustomContainer>
                            <DifferentFoodCompontent
                                isLoading={false}
                                isLoadingNearByPopularRestaurantData={
                                    false
                                }
                            />
                            {/* <NewRestaurant /> */}
                            {global && <Cuisines />}

                            {global?.banner_data?.promotional_banner_image && (
                                <PromotionalBanner global={global} />
                            )}

                            {/* <Restaurant /> */}
                        </CustomContainer>
                    </>
                )}

                <CustomModal
                    setModalOpen={handleCloseWelcomeModal}
                    openModal={welcomeModal}
                    closeButton
                >
                    <Box
                        sx={{
                            maxWidth: '382px',
                            width: '95vw',
                            px: 1.3,
                            pb: 4,
                            textAlign: 'center',
                            img: {
                                height: 'unset',
                            },
                            marginInline: 'auto',
                        }}
                    >
                        <Box pb={2}>
                            <img
                                src={'/static/sign-up-welcome.svg'}
                                alt="welcome"
                                width={183}
                                height={183}
                            />
                        </Box>
                        <Box mt={2}>
                            <Typography
                                variant="h5"
                                mb={1}
                                color={theme.palette.neutral[1000]}
                            >
                                {t('Welcome to ' + configData?.business_name)}
                            </Typography>
                            <Typography
                                variant="body2"
                                lineHeight={'1.5'}
                                color={theme.palette.neutral[1000]}
                            >
                                {userData?.is_valid_for_discount
                                    ? t(
                                          `Get ready for a special welcome gift, enjoy a special discount on your first order within `
                                      ) +
                                      userData?.validity +
                                      '.'
                                    : ''}
                                {'  '}
                                {t(
                                    `  Start exploring the best services around you.`
                                )}
                            </Typography>
                        </Box>
                    </Box>
                </CustomModal>
                {getToken && <CashBackPopup />}
            </PushNotificationLayout>

        </>
    )
}

export default Homes
