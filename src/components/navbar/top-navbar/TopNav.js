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
import { setlocation, setLocation } from '@/redux/slices/addressData'
import SearchBox from '@/components/home/hero-section-with-search/SearchBox'
import { useRouter } from 'next/router'
import { setAddressList } from '@/redux/slices/customer'
import { getValueFromCookie } from '@/utils/cookies'
const TopNav = ({ cartListRefetch }) => {
    const dispatch = useDispatch();
    const theme = useTheme()
    const [query, setQuery] = useState("");
    const router = useRouter()
    const isSmall = useMediaQuery(theme.breakpoints.down('md'))
    const { global, userLocationUpdate } = useSelector(
        (state) => state.globalSettings
    )
    const location = useSelector((state) => state.addressData.location)
    const [userLocation, setUserLocation] = useState(null)
    const [userDetailedLocation, setUserDetailedLocation] = useState(null);
    useEffect(() => {
        let location = undefined
        let detailedLocation = undefined
        if (typeof window !== 'undefined') {
            location = localStorage.getItem('location')
            detailedLocation = localStorage.getItem('locationDetails');
        }
        setUserLocation((location))
       if(detailedLocation) setUserDetailedLocation(JSON.parse(detailedLocation));
    }, [userLocationUpdate])
    const addresses = useSelector((state) => state.user.addressList);
    console.log("location...", location);
    const businessLogo = 'https://ondcpreprod.nazarasdk.com/static/media/logo1.ae3b79430a977262a2e9.jpg'
    const token = getValueFromCookie('token')
    useEffect(() => {
        let location = localStorage.getItem('currentLatLng');
        // let addressList = localStorage.getItem('addressList');
        if (location) {
            dispatch(setlocation(JSON.parse(location)))
            // if (!token) dispatch(setAddressList([JSON.parse(location)]));
            // router.push('/home')
        };
        // if (addressList) {
        //     dispatch(setAddressList(JSON.parse(addressList)));
        // }
    }, [])

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
                                        location={userLocation}
                                        detailedLocation = {userDetailedLocation}
                                        userLocationUpdate={userLocationUpdate}
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


