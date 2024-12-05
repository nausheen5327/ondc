import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    featuredCategories: [
        {
            "id": 7,
            "name": "Asian",
            "image": "2021-08-20-611fbebbc8db2.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:39:55.000000Z",
            "updated_at": "2023-09-10T02:47:23.000000Z",
            "priority": 0,
            "slug": "asian7",
            "products_count": 6,
            "childes_count": 0,
            "order_count": "2",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbebbc8db2.png",
            "childes": [],
            "translations": [
                {
                    "id": 2407,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 7,
                    "locale": "en",
                    "key": "name",
                    "value": "Asian",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 6,
            "name": "Biriyani",
            "image": "2021-08-20-611fbeadbf729.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:39:41.000000Z",
            "updated_at": "2023-09-10T06:35:40.000000Z",
            "priority": 0,
            "slug": "biriyani6",
            "products_count": 7,
            "childes_count": 0,
            "order_count": "2",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbeadbf729.png",
            "childes": [],
            "translations": [
                {
                    "id": 2413,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 6,
                    "locale": "en",
                    "key": "name",
                    "value": "Biriyani",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 5,
            "name": "Burger",
            "image": "2021-08-20-611fbe0e334c5.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:37:02.000000Z",
            "updated_at": "2023-09-10T02:50:16.000000Z",
            "priority": 0,
            "slug": "burger5",
            "products_count": 11,
            "childes_count": 5,
            "order_count": "3",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbe0e334c5.png",
            "childes": [
                {
                    "id": 24,
                    "name": "Kubie Burger",
                    "image": "def.png",
                    "parent_id": 5,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:46:55.000000Z",
                    "updated_at": "2023-09-10T21:41:49.000000Z",
                    "priority": 0,
                    "slug": "kubie-burger24",
                    "products_count": 1,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [],
                    "storage": []
                },
                {
                    "id": 25,
                    "name": "Steamed Cheese",
                    "image": "def.png",
                    "parent_id": 5,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:47:28.000000Z",
                    "updated_at": "2023-09-10T21:40:38.000000Z",
                    "priority": 0,
                    "slug": "steamed-cheese25",
                    "products_count": 1,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2440,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 25,
                            "locale": "en",
                            "key": "name",
                            "value": "Steamed Cheese",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 26,
                    "name": "Theta Burger",
                    "image": "def.png",
                    "parent_id": 5,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:47:40.000000Z",
                    "updated_at": "2023-09-10T21:39:01.000000Z",
                    "priority": 0,
                    "slug": "theta-burger26",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2437,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 26,
                            "locale": "en",
                            "key": "name",
                            "value": "Theta Burger",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 27,
                    "name": "Nutburger",
                    "image": "def.png",
                    "parent_id": 5,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:47:51.000000Z",
                    "updated_at": "2023-09-10T21:35:36.000000Z",
                    "priority": 0,
                    "slug": "nutburger27",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2435,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 27,
                            "locale": "en",
                            "key": "name",
                            "value": "Nutburger",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 28,
                    "name": "Pimento Cheese",
                    "image": "def.png",
                    "parent_id": 5,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:48:13.000000Z",
                    "updated_at": "2023-09-10T21:34:26.000000Z",
                    "priority": 0,
                    "slug": "pimento-cheese28",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2433,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 28,
                            "locale": "en",
                            "key": "name",
                            "value": "Pimento Cheese",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                }
            ],
            "translations": [
                {
                    "id": 2411,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 5,
                    "locale": "en",
                    "key": "name",
                    "value": "Burger",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 8,
            "name": "Cake",
            "image": "2021-08-20-611fbecb2b870.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:40:11.000000Z",
            "updated_at": "2023-09-10T02:44:03.000000Z",
            "priority": 0,
            "slug": "cake8",
            "products_count": 12,
            "childes_count": 3,
            "order_count": "3",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbecb2b870.png",
            "childes": [
                {
                    "id": 29,
                    "name": "Pound Cake",
                    "image": "def.png",
                    "parent_id": 8,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:54:43.000000Z",
                    "updated_at": "2023-09-10T21:33:34.000000Z",
                    "priority": 0,
                    "slug": "pound-cake29",
                    "products_count": 1,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2431,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 29,
                            "locale": "en",
                            "key": "name",
                            "value": "Pound Cake",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 30,
                    "name": "Yellow Butter",
                    "image": "def.png",
                    "parent_id": 8,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:54:52.000000Z",
                    "updated_at": "2023-09-10T21:33:05.000000Z",
                    "priority": 0,
                    "slug": "yellow-butter30",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2429,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 30,
                            "locale": "en",
                            "key": "name",
                            "value": "Yellow Butter",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 31,
                    "name": "Red Velvet",
                    "image": "def.png",
                    "parent_id": 8,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:55:03.000000Z",
                    "updated_at": "2023-09-10T21:32:21.000000Z",
                    "priority": 0,
                    "slug": "red-velvet31",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2427,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 31,
                            "locale": "en",
                            "key": "name",
                            "value": "Red Velvet",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                }
            ],
            "translations": [
                {
                    "id": 2403,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 8,
                    "locale": "en",
                    "key": "name",
                    "value": "Cake",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 10,
            "name": "Chinese",
            "image": "2021-08-20-611fbf1b426e1.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:41:31.000000Z",
            "updated_at": "2023-09-10T02:42:25.000000Z",
            "priority": 0,
            "slug": "chinese10",
            "products_count": 8,
            "childes_count": 0,
            "order_count": "3",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbf1b426e1.png",
            "childes": [],
            "translations": [
                {
                    "id": 2395,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 10,
                    "locale": "en",
                    "key": "name",
                    "value": "Chinese",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 9,
            "name": "Coffee & Drinks",
            "image": "2021-08-20-611fbede98fba.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:40:30.000000Z",
            "updated_at": "2023-09-10T02:43:22.000000Z",
            "priority": 0,
            "slug": "coffee-drinks9",
            "products_count": 6,
            "childes_count": 5,
            "order_count": 0,
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbede98fba.png",
            "childes": [
                {
                    "id": 32,
                    "name": "Black Coffee",
                    "image": "def.png",
                    "parent_id": 9,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:55:42.000000Z",
                    "updated_at": "2023-09-10T21:31:29.000000Z",
                    "priority": 0,
                    "slug": "black-coffee32",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2425,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 32,
                            "locale": "en",
                            "key": "name",
                            "value": "Black Coffee",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 33,
                    "name": "Robusta",
                    "image": "def.png",
                    "parent_id": 9,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:55:50.000000Z",
                    "updated_at": "2023-09-10T21:30:51.000000Z",
                    "priority": 0,
                    "slug": "robusta33",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2423,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 33,
                            "locale": "en",
                            "key": "name",
                            "value": "Robusta",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 34,
                    "name": "Cappuccino",
                    "image": "def.png",
                    "parent_id": 9,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:56:01.000000Z",
                    "updated_at": "2023-09-10T21:25:42.000000Z",
                    "priority": 0,
                    "slug": "cappuccino34",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2421,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 34,
                            "locale": "en",
                            "key": "name",
                            "value": "Cappuccino",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                },
                {
                    "id": 35,
                    "name": "Macchiato",
                    "image": "def.png",
                    "parent_id": 9,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:56:08.000000Z",
                    "updated_at": "2023-09-10T21:24:36.000000Z",
                    "priority": 0,
                    "slug": "macchiato35",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [],
                    "storage": []
                },
                {
                    "id": 36,
                    "name": "Soft Drinks",
                    "image": "def.png",
                    "parent_id": 9,
                    "position": 1,
                    "status": 1,
                    "created_at": "2021-08-21T01:56:20.000000Z",
                    "updated_at": "2023-09-10T21:22:25.000000Z",
                    "priority": 2,
                    "slug": "soft-drinks36",
                    "products_count": 0,
                    "childes_count": 0,
                    "image_full_url": null,
                    "translations": [
                        {
                            "id": 2418,
                            "translationable_type": "App\\Models\\Category",
                            "translationable_id": 36,
                            "locale": "en",
                            "key": "name",
                            "value": "Soft Drinks",
                            "created_at": null,
                            "updated_at": null
                        }
                    ],
                    "storage": []
                }
            ],
            "translations": [
                {
                    "id": 2399,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 9,
                    "locale": "en",
                    "key": "name",
                    "value": "Coffee & Drinks",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 11,
            "name": "Fast Food",
            "image": "2021-08-20-611fbf30f1a68.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:41:52.000000Z",
            "updated_at": "2023-09-10T02:40:57.000000Z",
            "priority": 0,
            "slug": "fast-food11",
            "products_count": 12,
            "childes_count": 0,
            "order_count": "4",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbf30f1a68.png",
            "childes": [],
            "translations": [
                {
                    "id": 2391,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 11,
                    "locale": "en",
                    "key": "name",
                    "value": "Fast Food",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 13,
            "name": "Indian",
            "image": "2021-08-20-611fbf6a9a159.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:42:50.000000Z",
            "updated_at": "2023-09-10T02:38:17.000000Z",
            "priority": 0,
            "slug": "indian13",
            "products_count": 5,
            "childes_count": 0,
            "order_count": 0,
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbf6a9a159.png",
            "childes": [],
            "translations": [
                {
                    "id": 2383,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 13,
                    "locale": "en",
                    "key": "name",
                    "value": "Indian",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 12,
            "name": "Kabab & More",
            "image": "2021-08-20-611fbf491f625.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:42:17.000000Z",
            "updated_at": "2023-09-10T02:39:28.000000Z",
            "priority": 0,
            "slug": "kabab-more12",
            "products_count": 8,
            "childes_count": 0,
            "order_count": "1",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbf491f625.png",
            "childes": [],
            "translations": [
                {
                    "id": 2387,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 12,
                    "locale": "en",
                    "key": "name",
                    "value": "Kabab & More",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 15,
            "name": "Mexican Food",
            "image": "2021-08-20-611fbf96910eb.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:43:34.000000Z",
            "updated_at": "2023-09-10T02:34:41.000000Z",
            "priority": 0,
            "slug": "mexican-food15",
            "products_count": 9,
            "childes_count": 0,
            "order_count": "1",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbf96910eb.png",
            "childes": [],
            "translations": [
                {
                    "id": 2375,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 15,
                    "locale": "en",
                    "key": "name",
                    "value": "Mexican Food",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 14,
            "name": "Noodles",
            "image": "2021-08-20-611fbf779aef1.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:43:03.000000Z",
            "updated_at": "2023-09-10T02:36:40.000000Z",
            "priority": 0,
            "slug": "noodles14",
            "products_count": 3,
            "childes_count": 0,
            "order_count": "2",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbf779aef1.png",
            "childes": [],
            "translations": [
                {
                    "id": 2379,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 14,
                    "locale": "en",
                    "key": "name",
                    "value": "Noodles",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 16,
            "name": "Pasta",
            "image": "2021-08-20-611fbfa397c7c.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:43:47.000000Z",
            "updated_at": "2023-09-10T02:33:23.000000Z",
            "priority": 0,
            "slug": "pasta16",
            "products_count": 10,
            "childes_count": 0,
            "order_count": 0,
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbfa397c7c.png",
            "childes": [],
            "translations": [
                {
                    "id": 2371,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 16,
                    "locale": "en",
                    "key": "name",
                    "value": "Pasta",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 17,
            "name": "Pizza",
            "image": "2021-08-20-611fbfb0af526.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:44:00.000000Z",
            "updated_at": "2023-09-10T02:30:50.000000Z",
            "priority": 0,
            "slug": "pizza17",
            "products_count": 17,
            "childes_count": 0,
            "order_count": "8",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbfb0af526.png",
            "childes": [],
            "translations": [
                {
                    "id": 2367,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 17,
                    "locale": "en",
                    "key": "name",
                    "value": "Pizza",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 18,
            "name": "Snacks",
            "image": "2021-08-20-611fbfbc0e2ed.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:44:12.000000Z",
            "updated_at": "2023-09-10T02:28:29.000000Z",
            "priority": 0,
            "slug": "snacks18",
            "products_count": 8,
            "childes_count": 0,
            "order_count": "2",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbfbc0e2ed.png",
            "childes": [],
            "translations": [
                {
                    "id": 2363,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 18,
                    "locale": "en",
                    "key": "name",
                    "value": "Snacks",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 19,
            "name": "Thai",
            "image": "2021-08-20-611fbfc6ac515.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:44:22.000000Z",
            "updated_at": "2023-09-10T02:26:55.000000Z",
            "priority": 0,
            "slug": "thai19",
            "products_count": 8,
            "childes_count": 0,
            "order_count": "3",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbfc6ac515.png",
            "childes": [],
            "translations": [
                {
                    "id": 2359,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 19,
                    "locale": "en",
                    "key": "name",
                    "value": "Thai",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        },
        {
            "id": 20,
            "name": "Varieties",
            "image": "2021-08-20-611fbfd13f7db.png",
            "parent_id": 0,
            "position": 0,
            "status": 1,
            "created_at": "2021-08-21T01:44:33.000000Z",
            "updated_at": "2023-09-10T02:26:16.000000Z",
            "priority": 0,
            "slug": "varieties20",
            "products_count": 11,
            "childes_count": 0,
            "order_count": "14",
            "image_full_url": "https://stackfood-admin.6amtech.com/storage/app/public/category/2021-08-20-611fbfd13f7db.png",
            "childes": [],
            "translations": [
                {
                    "id": 2355,
                    "translationable_type": "App\\Models\\Category",
                    "translationable_id": 20,
                    "locale": "en",
                    "key": "name",
                    "value": "Varieties",
                    "created_at": null,
                    "updated_at": null
                }
            ],
            "storage": []
        }
    ],
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
