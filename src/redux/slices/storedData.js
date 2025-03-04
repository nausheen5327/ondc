import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    featuredCategories: [
        {
            "id": 7,
            "name": "Asian",
            "image": "sushi.jpg",
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
            "image_full_url": "sushi.jpg",
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
            "name": "Biryani",
            "image": "biryani.jpg",
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
            "image_full_url": "biryani.jpg",
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
            "image": "burger.jpg",
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
            "image_full_url": "burger.jpg",
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
            "image": "cake.jpg",
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
            "image_full_url": "cake.jpg",
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
            "image": "chinese.jpg",
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
            "image_full_url": "chinese.jpg",
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
            "image": "coffee.jpg",
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
            "image_full_url": "coffee.jpg",
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
            "image": "fastFood.jpg",
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
            "image_full_url": "fastFood.jpg",
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
            "image": "indian.jpg",
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
            "image_full_url": "indian.jpg",
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
            "image": "kebab.jpg",
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
            "image_full_url": "kebab.jpg",
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
            "image": "mexican.jpg",
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
            "image_full_url": "mexican.jpg",
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
            "image": "noodles.jpg",
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
            "image_full_url": "noodles.jpg",
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
            "image": "pasta.jpg",
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
            "image_full_url": "pasta.jpg",
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
            "image": "pizza.jpg",
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
            "image_full_url": "pizza.jpg",
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
            "image": "snacks.jpg",
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
            "image_full_url": "snacks.jpg",
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
            "image": "thai.jpg",
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
            "image_full_url": "thai.jpg",
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
            "image": "variety.jpg",
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
            "image_full_url": "variety.jpg",
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
    landingPageData: {}}

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
