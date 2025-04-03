import { Grid, Typography } from '@mui/material'
import React, { memo, useMemo, useCallback } from 'react'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import CustomImageContainer from '../CustomImageContainer'
import { FeatureImageBox } from './FeaturedCategory.style'
import Router, { useRouter } from 'next/router'
import { Box } from '@mui/system'

const FeaturedCategoryCard = ({
    categoryImage,
    name,
    id,
    categoryIsSticky
}) => {
    const theme = useTheme()
    const router = useRouter()
    const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
    
    // Memoize the click handler to prevent recreation on every render
    const handleClick = useCallback(() => {
        Router.push(
            {
                pathname: `/category/${id}`,
                query: { name: name },
            },
            undefined,
            { shallow: true }
        )
    }, [id, name]);
    
    // Memoize the box style to prevent recreation on every render
    // Removed animation and made dimensions consistent regardless of sticky state
    const boxStyle = useMemo(() => ({
        height: { xs: "55px", md: "100px" },
        display: "flex",
        width: { xs: "55px", md: "100px" },
        border: "1px solid",
        borderColor: theme => theme.palette.neutral[200],
        borderRadius: "32px",
        transition: 'none', // Remove transition to prevent size changes
        '&:hover': {
            transform: 'scale(1.1)',
        },
        alignItems: "center",
    }), []);
    
    // Memoize the typography style to prevent recreation on every render
    const typographyStyle = useMemo(() => ({
        color: (theme) => theme.palette.neutral[1200],
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: '1',
        WebkitBoxOrient: 'vertical',
    }), []);

    return (
        <Grid item sx={{ overflow: 'hidden' }} onClick={handleClick}>
            <FeatureImageBox
                justifyContent="center"
                alignItems="center"
                spacing={{ xs: .5, md: 1 }}
            >
                <Box sx={boxStyle}>
                    <CustomImageContainer
                        src={categoryImage}
                        alt={name}
                        height={categoryImage ? "100%" : "70px"}
                        width="100%"
                        objectFit="cover"
                        smMb="5px"
                        smHeight="100%"
                        smMaxWidth="55px"
                        cursor="pointer"
                        borderRadius={router.pathname === "/categories" && isXSmall ? "16px" : "32px"}
                    />
                </Box>
                <Typography
                    sx={typographyStyle}
                    fontSize={{ xs: '13px', sm: '14px', md: "14px" }}
                    fontWeight="400"
                >
                    {name}
                </Typography>
            </FeatureImageBox>
        </Grid>
    )
}

// Create a comparison function for memo to prevent unnecessary re-renders
const areEqual = (prevProps, nextProps) => {
    return (
        prevProps.id === nextProps.id &&
        prevProps.name === nextProps.name &&
        prevProps.categoryImage === nextProps.categoryImage &&
        prevProps.categoryIsSticky === nextProps.categoryIsSticky
    );
};

export default memo(FeaturedCategoryCard, areEqual);
