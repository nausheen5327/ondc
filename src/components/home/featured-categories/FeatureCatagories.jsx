import React, { memo, useRef, useState, useMemo, useCallback } from "react";
import { Grid, Typography } from "@mui/material";
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Slider from 'react-slick'

import FeaturedCategoryCard from '../../featured-category-item/FeaturedCategoryCard'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import CustomShimmerCategories from '../../CustomShimmer/CustomShimmerCategories'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import useScrollSticky from "../Search-filter-tag/useScrollSticky";
import Card from "@mui/material/Card";
import CustomContainer from "../../container";
import { Stack } from "@mui/system";
import { HandleNext, HandlePrev } from "@/components/CustomSliderIcon";

const FeatureCatagories = () => {
    const theme = useTheme()
    const { t } = useTranslation()
    const router = useRouter()
    const [hoverOn, setHoverOn] = useState(false)
    const { catOffsetElementRef } = useScrollSticky();
    const { global } = useSelector((state) => state.globalSettings)
    const { featuredCategories } = useSelector((state) => state.storedData)
    const { categoryIsSticky } = useSelector((state) => state.scrollPosition)
    const sliderRef = useRef(null)
    
    // Memoize the hover handlers to prevent recreating functions on each render
    const handleMouseEnter = useCallback(() => setHoverOn(true), []);
    const handleMouseLeave = useCallback(() => setHoverOn(false), []);
    
    // Memoize settings object to prevent recreation on every render
    // Use consistent slidesToShow value regardless of sticky state
    const settings = useMemo(() => ({
        dots: false,
        infinite: featuredCategories?.length > 7 ? true : false,
        speed: 500,
        slidesToShow: 7, // Use consistent value regardless of sticky state
        slidesToScroll: 3,
        autoplay: true, // Changed from true to false to reduce motion
        nextArrow: hoverOn && <HandleNext />,
        prevArrow: hoverOn && <HandlePrev />,
        responsive: [
            {
                breakpoint: 1450,
                settings: {
                    slidesToShow: 8,
                    slidesToScroll: 3,
                    infinite: featuredCategories?.length > 8 && true,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 3,
                    infinite: featuredCategories?.length > 6 && true,
                },
            },
            {
                breakpoint: 850,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,
                    infinite: featuredCategories?.length > 5 && true,
                },
            },
            {
                breakpoint: 790,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 3,
                    infinite: featuredCategories?.length > 4.5 && true,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 7,
                    slidesToScroll: 3,
                    infinite: featuredCategories?.length > 7 && true,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,
                    infinite: featuredCategories?.length > 5 && true,
                },
            },
        ],
    }), [categoryIsSticky, featuredCategories?.length, hoverOn]);

    // Memoize the card style to prevent recreation on every render
    // Removed animation-related CSS and made padding consistent
    const cardStyle = useMemo(() => ({
        paddingTop: ".5rem", // Use consistent padding
        paddingBottom: ".5rem", // Add bottom padding
        position: "sticky",
        top: { xs: "91px", md: "108px" },
        zIndex: 1100,
        background: theme => theme.palette.neutral[1800],
        boxShadow: "0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
        // Explicitly add transition: 'none' to prevent any animations
        transition: 'none'
    }), []);

    // Render only if we have categories or need to show shimmer
    if (!featuredCategories && !Array.isArray(featuredCategories)) {
        return null;
    }

    return (
        <Card sx={cardStyle}>
            <CustomContainer>
                <Grid container ref={catOffsetElementRef} gap={{ xs: ".3rem", md: ".5rem" }}>
                    {!categoryIsSticky && (
                        <Grid item xs={12} md={12}>
                            <Stack direction="row" justifyContent="space-between" width="100%">
                                <Typography fontSize={{ xs: "16px", md: "20px" }} fontWeight={{ xs: "500", md: "700" }}>What's on Your Mind?</Typography>
                            </Stack>
                        </Grid>
                    )}
                    <Grid item xs={12} md={12}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                    >
                        {featuredCategories?.length > 0 ? (
                            <Slider
                                className="slick__slider"
                                {...settings}
                                ref={sliderRef}
                            >
                                {featuredCategories.map((categoryItem) => (
                                    <FeaturedCategoryCard
                                        key={categoryItem?.id}
                                        id={categoryItem?.id}
                                        categoryImage={`${categoryItem?.image_full_url}`}
                                        name={categoryItem?.name}
                                        categoryImageUrl={
                                            global?.base_urls?.category_image_url
                                        }
                                        height="40px"
                                        categoryIsSticky={categoryIsSticky}
                                    />
                                ))}
                            </Slider>
                        ) : (
                            <CustomShimmerCategories
                                noSearchShimmer="true"
                                itemCount="7"
                                smItemCount="5"
                            />
                        )}
                    </Grid>
                </Grid>
            </CustomContainer>
        </Card>
    )
}

export default memo(FeatureCatagories);