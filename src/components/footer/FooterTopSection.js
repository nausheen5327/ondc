import {
    CustomColouredTypography,
    CustomStackFullWidth,
} from '@/styled-components/CustomStyles.style'
import { alpha } from '@material-ui/core'
import { Stack, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { t } from 'i18next'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import Slider from 'react-slick'
import 'simplebar-react/dist/simplebar.min.css'
import { RTL } from '../RTL/RTL'
import { CustomToaster } from '../custom-toaster/CustomToaster'
import { RouteLinksData } from './RouteLinksData'
import SocialLinks from './SocialLinks'

const FooterTopSection = () => {
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const { global } = useSelector((state) => state.globalSettings)
    const { token } = useSelector((state) => state.userToken)
    let languageDirection = undefined
    if (typeof window !== 'undefined') {
        languageDirection = localStorage.getItem('direction')
    }
    const handleClick = (href, value) => {
        if (value === 'profile') {
            if (token) {
                Router.push(
                    {
                        pathname: '/info',
                        query: { page: value },
                    },
                    undefined,
                    { shallow: true }
                )
            } else {
                CustomToaster('error', 'You must be login to access this page.')
            }
        } else {
            Router.push(href)
        }
    }
    const settings = {
        dots: false,
        infinite: false,
        variableWidth: true,
    }
    return
}

export default FooterTopSection
