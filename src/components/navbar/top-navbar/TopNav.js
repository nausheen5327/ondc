import { CustomStackForLoaction } from '@/styled-components/CustomStyles.style'
import { Box, Card, Container, NoSsr, Stack } from '@mui/material'
import Skeleton from '@mui/material/Skeleton'
import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useEffect, useState } from 'react'
import { withTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import useGetGuest from '../../../hooks/react-query/profile/useGetGuest'
import DrawerMenu from '../DrawerMenu'
import LogoSide from '../second-navbar/LogoSide'
import ThemeSwitches from './ThemeSwitches'
import AddressReselect from './address-reselect/AddressReselect'
import { setLocation } from '@/redux/slices/addressData'
import SearchBox from '@/components/home/hero-section-with-search/SearchBox'
const TopNav = ({ cartListRefetch }) => {
    const dispatch = useDispatch();
    const theme = useTheme()
    const [query,setQuery] = useState("");

    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const { global, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    )
    const location = useSelector((state)=>state.addressData.location)
    console.log("location...",location);
    const businessLogo = global?.fav_icon_full_url
    
    
// useEffect(() => {
//         let location = undefined
//         if (typeof window !== 'undefined') {
//             location = localStorage.getItem('location')
//         }
//         dispatch(setLocation(location));
//     }, [])

    return (
        <NoSsr>
            <Card
                sx={{ borderRadius: '0px', zIndex: '99', position: 'relative' }}
            >
                <Toolbar
                    sx={{ minHeight: '45px !important' }}
                    disableGutters={true}
                >
                    <Container maxWidth="lg">
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                borderRadius: '0',
                                paddingBlock: { xs: '.0rem', md: '.8rem' },
                                justifyContent: 'space-between',
                            }}
                        >
                            <Stack
                                width="100%"
                                direction="row"
                                justifyContent="space-between"
                            >
                                <CustomStackForLoaction
                                    direction="row"
                                    spacing={2}
                                >
                                    
                                        <LogoSide
                                            global={global}
                                            width="unset"
                                            businessLogo={businessLogo}
                                        />
                                    

                                    <AddressReselect
                                        location={location}
                                    />
                                </CustomStackForLoaction>
                               
                                {/* {!isSmall && (
                                    <Stack
                                        direction="row"
                                        spacing={2}
                                        justifyContent="end"
                                    >
                                        <ThemeSwitches />
                                    </Stack>
                                )} */}
                            </Stack>
                            {isSmall && (
                                <DrawerMenu
                                   
                                    cartListRefetch={cartListRefetch}
                                />
                            )}
                        </Box>
                    </Container>
                </Toolbar>
            </Card>
        </NoSsr>
    )
}
export default withTranslation()(TopNav)


