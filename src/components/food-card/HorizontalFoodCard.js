import React, { useState } from 'react'
import {
    CustomFavICon,
    CustomFoodCard,
    CustomFoodCardNew,
} from './FoodCard.style'
import { Box, Stack } from '@mui/system'
import CustomImageContainer from '../CustomImageContainer'
import test_image from '../../../public/static/testImage.svg'
import { IconButton, Tooltip, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import VagSvg from '../foodDetail-modal/VagSvg'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import {
    CustomOverlayBox,
    CustomStackFullWidth,
} from '../../styled-components/CustomStyles.style'
import {
    getAmount,
    getConvertDiscount,
    getReviewCount,
    isAvailable,
} from '../../utils/customFunctions'
import FavoriteIcon from '@mui/icons-material/Favorite'
// import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import StartPriceView from '../foodDetail-modal/StartPriceView'
import { RTL } from '../RTL/RTL'
import { t } from 'i18next'
import FoodRating from './FoodRating'
import AfterAddToCart from './AfterAddToCart'
import CircularLoader from '../loader/CircularLoader'
import { useSelector } from 'react-redux'
import CustomPopover from '../custom-popover/CustomPopover'
import CustomPopoverWithItem from '../custom-popover/CustomPopoverWithItem'
import WishListImage from '../../assets/images/WishListImage'
import DeleteIcon from '../../assets/images/icons/DeleteIcon'
import HalalSvg from '@/components/food-card/HalalSvg'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';

const HorizontalFoodCard = (props) => {
    const {
        isShop,
        setOpenModal,
        product,
        imageUrl,
        isInList,
        languageDirection = 'lrt',
        addToFavorite,
        deleteWishlistItem,
        available_time_starts,
        available_time_ends,
        handleFoodDetailModal,
        handleBadge,
        addToCart,
        isInCart,
        getQuantity,
        incrOpen,
        setIncrOpen,
        handleClickQuantityButton,
        addToCartLoading,
        isRestaurantDetails,
        inWishListPage = 'false',
        horizontal,
    } = props
    const theme = useTheme()
    const [anchorEl, setAnchorEl] = useState(null)
    const { global } = useSelector((state) => state.globalSettings)
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    let currencySymbol = '₹'
    let currencySymbolDirection = 'left'
    let digitAfterDecimalPoint = 2
    console.log("aree bhai bhai", imageUrl, horizontal);
    if (global) {
        currencySymbol = global.currency_symbol
        currencySymbolDirection = global.currency_symbol_direction
        digitAfterDecimalPoint = global.digit_after_decimal_point
    }
    const handleClick = (e) => {
        deleteWishlistItem(product?.id, e)
    }
    const handleClickDelete = (event) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
    }
    const handleClose = (event) => {
        setAnchorEl(null)
    }

    const starColor = '#4CAF50'


    const isVegItem = (data) => {
        const vegTag = data.item_details.tags.find(tag => tag.code === "veg_nonveg");
        if (vegTag) {
            const vegValue = vegTag.list.find(item => item.code === "veg");
            return vegValue && vegValue.value === "yes" ? 1 : 0;
        }
        return "Unknown";
    };
    const vegStatus = isVegItem(product);
    return (
        <>
            <RTL direction={languageDirection}>
                <CustomFoodCardNew
                    horizontal
                    onClick={handleFoodDetailModal}
                    background={theme.palette.cardBackground1}
                    width="100%"
                >
                    <Stack
                        direction="row"
                        spacing={1.5}
                        width="100%"
                        sx={{ overflow: 'hidden' }}
                    >
                        <Stack
                            position="relative"
                            sx={{
                                transition: `${theme.transitions.create(
                                    ['background-color', 'transform'],
                                    {
                                        duration:
                                            theme.transitions.duration.standard,
                                    }
                                )}`,
                                marginLeft:
                                    languageDirection === 'rtl' &&
                                    '.8rem !important',
                                '&:hover': {
                                    transform: 'scale(1.04)',
                                },
                            }}
                        >
                            <CustomImageContainer
                                src={imageUrl}
                                width="115px"
                                smWidth="95px"
                                smHeight="95px"
                                height="95px"
                                borderRadius="3px"
                                objectFit="cover"
                            />



                            <Stack
                                position="absolute"
                                top="10%"
                                left="0"
                                zIndex="1"
                            >
                                {handleBadge(
                                    product,
                                    currencySymbol,
                                    currencySymbolDirection,
                                    digitAfterDecimalPoint,
                                )}
                            </Stack>

                        </Stack>
                        <Stack gap="7px" width="100%">
                            <Stack>
                                <Stack
                                    direction="row"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    flexWrap="wrap"
                                    spacing={0.5}
                                >
                                    <Typography
                                        fontSize="14px"
                                        fontWeight="500"
                                        maxWidth="120px"
                                        noWrap
                                        sx={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                        color={theme.palette.neutral[1200]}
                                    >
                                        {product?.item_details?.descriptor?.name}
                                    </Typography>
                                    <VagSvg
                                        color={
                                            Number(vegStatus) === 0
                                                ? theme.palette.nonVeg
                                                : theme.palette.success.light
                                        }
                                    />


                                </Stack>

                                <Typography
                                    variant="subtitle2"
                                    fontSize="12px"
                                    fontWeight={400}
                                    color={theme.palette.neutral[400]}
                                    mt="-3px"
                                >
                                    {product?.provider_details?.descriptor?.name}
                                </Typography>

                            </Stack>
                            <Stack flexDirection="row" gap="5px">
                                {/* <StarIcon
                                    style={{
                                        width: '16px',
                                        height: '16px',
                                        color: starColor,
                                    }}
                                />
                                <FoodRating
                                    product_avg_rating={4.2}
                                /> */}
                                {/* <Typography
                                    fontSize={{ xs: '12px', md: '14px' }}
                                    fontWeight={400}
                                    color={theme.palette.text.secondary}
                                >
                                    {getReviewCount(4.7)}
                                </Typography> */}



                            </Stack>

                            <StartPriceView
                                data={product}
                                hideStartFromText="true"
                                handleBadge={handleBadge}
                            />
                        </Stack>

                        <Stack
                            justifyContent="space-between"
                            alignItems=" flex-end"
                        >

                            <>
                               
                                    <IconButton
                                        onClick={''}
                                        sx={{ padding: '3px' }}
                                    >
                                        {/* <FavoriteBorderIcon color="primary" /> */}
                                    </IconButton>
                               
                                {/* {!isInCart && (
                                <IconButton
                                    onClick={(e) => addToCart(e)}
                                    sx={{ padding: '3px' }}
                                >
                                    {addToCartLoading ? (
                                        <CircularLoader size="20px" />
                                    ) : (
                                        <AddShoppingCartIcon color="primary" />
                                    )}
                                </IconButton>
                            )} */}
                            {/* {isInCart &&
                                !incrOpen &&
                                product?.variations?.length === 0 && (
                                    <AfterAddToCart
                                        isInCart={isInCart}
                                        product={product}
                                        getQuantity={getQuantity}
                                        handleClickQuantityButton={
                                            handleClickQuantityButton
                                        }
                                        setIncrOpen={setIncrOpen}
                                        incrOpen={incrOpen}
                                        addToCartLoading={addToCartLoading}
                                        horizontal={horizontal}
                                    />
                                )} */}
                            </>
                        </Stack>
                    </Stack>
                    <Box
                        position="relative"
                        width="100%"
                        sx={{
                            width: {
                                xs: 'calc(100% - 85px)',
                                sm: 'calc(100% - 130px)',
                            },
                            marginInlineStart: 'auto',
                        }}
                    >
                        {isInCart && incrOpen && (
                            <AfterAddToCart
                                isInCart={isInCart}
                                product={product}
                                getQuantity={getQuantity}
                                handleClickQuantityButton={
                                    handleClickQuantityButton
                                }
                                setIncrOpen={setIncrOpen}
                                incrOpen={incrOpen}
                                position="-30px"
                                horizontal={horizontal}
                            />
                        )}
                    </Box>
                </CustomFoodCardNew>
            </RTL>
            <CustomPopover
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                maxWidth="421px"
                padding="20px 35px 25px"
            >
                <CustomPopoverWithItem
                    icon={<WishListImage />}
                    deleteItem={handleClick}
                    handleClose={handleClose}
                    confirmButtonText="Yes , Remove"
                    cancelButtonText="Cancel"
                    title="Remove this food"
                    subTitle="Want to remove this food your favourite list ?"
                />
            </CustomPopover>
        </>
    )
}

export default HorizontalFoodCard
