import React, { useState } from 'react'
import {
    CustomColouredTypography,
    CustomStackFullWidth,
} from '../../styled-components/CustomStyles.style'

import { useTranslation } from 'react-i18next'
import Router from 'next/router'
import { toast } from 'react-hot-toast'
import { Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { t } from 'i18next'
import { router } from 'next/client'
import MapModal from '../landingpage/google-map/MapModal'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import { alpha } from '@material-ui/core'

const RouteLinks = (props) => {
    const { title, RouteLinksData, isCenter } = props
    const theme = useTheme()
    const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
    const { t } = useTranslation()
    
    const handleClick = (href, value) => {
            Router.push(href, undefined, { shallow: true })
    }
    

    return (
        <CustomStackFullWidth spacing={{ xs: 1.2, sm: 2 }} alignItems={isCenter && 'center'}>
            <Typography
                color={alpha(theme.palette.whiteContainer.main, 0.8)}
                fontSize="14px"
                fontWeight="600"
            >
                {t(title)}
            </Typography>

            {RouteLinksData.map((item, index) => {
                return (
                    <CustomColouredTypography
                        key={index}
                        fontsize={isXSmall ? '14px' : '14px'}
                        color="whiteContainer.main"
                        onClick={() => handleClick(item.link, item.value)}
                        sx={{
                            cursor: 'pointer',
                            fontWeight: 300,
                            color: alpha(theme.palette.whiteContainer.main, 0.8),
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        {t(item.name)}
                    </CustomColouredTypography>
                )
            })}
            
            
        </CustomStackFullWidth>
    )
}

RouteLinks.propTypes = {}

export default RouteLinks
