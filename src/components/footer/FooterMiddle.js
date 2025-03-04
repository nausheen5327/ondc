import { CustomStackFullWidth } from '@/styled-components/CustomStyles.style'
import { alpha } from '@material-ui/core'
import { Box, Grid, Stack, Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import CustomContainer from '../container'
import { OtherData } from './OtherData'
import RouteLinks from './RouteLinks'

const FooterMiddle = () => {
    const { global } = useSelector((state) => state.globalSettings)
    const { token } = useSelector((state) => state.userToken)
    const { t } = useTranslation()
    let zoneid = undefined
    if (typeof window !== 'undefined') {
        zoneid = localStorage.getItem('zoneid')
    }
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
    const isXSmall = useMediaQuery(theme.breakpoints.down('md'))
    return (
        <CustomStackFullWidth
            alignItems="center"
            pt={{ xs: '1rem', sm: '2rem' }}
        >
            <CustomContainer>
                <Grid
                    container
                    spacing={{ xs: 3, md: 4 }}
                    justifyContent="space-between"
                >
                   
                    
                    <Grid
                        item
                        xs={12}
                        sm={4}
                        md={2.6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Box alignItems="center" justifyContent="center">
                            <RouteLinks
                                token={token}
                                global={global}
                                title="Quick Links"
                                RouteLinksData={OtherData}
                                isCenter={isSmall && true}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </CustomContainer>
        </CustomStackFullWidth>
    )
}

FooterMiddle.propTypes = {}

export default FooterMiddle
