import { WrapperForApp } from '@/App.style'
import { SettingsConsumer, SettingsProvider } from '@/contexts/settings-context'
import { store } from '@/redux/store'
import { CacheProvider } from '@emotion/react'
import { Box } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import i18n, { t } from 'i18next'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Router, { useRouter } from 'next/router'
import nProgress from 'nprogress'
import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Provider, useSelector } from 'react-redux'
// import { persistStore } from 'redux-persist'
import DynamicFavicon from '../components/favicon/DynamicFavicon'
import FloatingCardManagement from '../components/floating-cart/FloatingCardManagement'
import Navigation from '../components/navbar'
import ScrollToTop from '../components/scroll-top/ScrollToTop'
import '../language/i18n'
import '../styles/global.css'
import '../styles/nprogress.css'
import { createTheme } from '../theme/index'
import createEmotionCache from '../utils/create-emotion-cache'
import BottomNav from '@/components/navbar/BottomNav'
import LoadingOverlay from '@/components/common/layoutProgress'
import AuthModal from '@/components/auth'
import { AuthDataListener } from '@/components/auth/authSuccessHandler'
import { styled } from '@mui/styles'
// import { PersistGate } from 'redux-persist/integration/react'

Router.events.on('routeChangeStart', nProgress.start)
Router.events.on('routeChangeError', nProgress.done)
Router.events.on('routeChangeComplete', nProgress.done)
export const currentVersion = process.env.NEXT_PUBLIC_SITE_VERSION
const clientSideEmotionCache = createEmotionCache()
App.getInitialProps = async ({ Component, ctx }) => {
    let pageProps = {}

    // If the component has getInitialProps, run it
    if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
    }

    // Handle search query if present
    if (ctx.query.query) {
        // You can handle the search query here if needed
        pageProps.searchQuery = ctx.query.query
    }

    return { pageProps }
}
const AppContent = ({ value, router, isAuthRoute, zoneid, getLayout, Component, pageProps }) => {
    const isLoading = useSelector(state => state.globalSettings.isLoading);
    const [forSignup, setForSignup] = useState('')
    const [modalFor, setModalFor] = useState('sign-in')

    const Footer = dynamic(() => import('../components/footer/Footer'), {
        ssr: false,
    })
    const authModalOpen = useSelector(state => state.globalSettings.authModalOpen)
    // Main content wrapper to provide proper spacing
    const MainContentWrapper = styled('div')(({ hasAllNavs, isSmall }) => ({
        paddingTop: router.pathname === '/checkout' || router.pathname === '/info' 
            ? '0'
            : (isSmall ? '192px' : '64px'),
        minHeight: '100vh',
    }));
    return (
        <ThemeProvider
            theme={createTheme({
                direction: value.settings.direction,
                responsiveFontSizes: value.settings.responsiveFontSizes,
                mode: value.settings.theme,
            })}
        >
            <CssBaseline />
            <Toaster />
            <Head>
                <title>{'ONDC'}</title>
            </Head>
            <LoadingOverlay open={isLoading} />
            <WrapperForApp pathname={router.pathname}>
                <ScrollToTop />
                {/* Conditionally render Navigation */}
                {!isAuthRoute && router.pathname !== '/maintenance' && (
                    <Navigation />
                )}
                <DynamicFavicon />
                <MainContentWrapper>
                    <Box
                        sx={{
                            height: '100%',
                            mt: {
                                xs:
                                    router.pathname ===
                                        '/home'
                                        ? '2.5rem'
                                        : '2rem',
                                md:
                                    router.pathname === '/'
                                        ? zoneid
                                            ? '4rem'
                                            : '2rem'
                                        : '4rem',
                            },
                        }}
                    >
                        {
                            router.pathname !==
                            '/checkout' && router.pathname !=='/info' &&
                            router.pathname !== '/chat' && (
                                <FloatingCardManagement
                                />
                            )}
                        {getLayout(
                            <Component {...pageProps} />
                        )}
                    </Box>
                </MainContentWrapper>
                {/* Conditionally render Footer */}
                {!isAuthRoute && (
                    <Footer
                        languageDirection={
                            value?.settings
                                ?.direction
                        }
                    />
                )}
                {authModalOpen && (
                    <AuthModal
                        open={authModalOpen}
                        handleClose={false}
                        forSignup={forSignup}
                        modalFor={modalFor}
                        setModalFor={setModalFor}
                    />
                )}
            </WrapperForApp>
        </ThemeProvider>
    );
};
function App({ Component, pageProps, emotionCache = clientSideEmotionCache }) {
    const getLayout = Component.getLayout ?? ((page) => page)
    const queryClient = new QueryClient()
    const router = useRouter()
    const [showSplashScreen, setShowSplashScreen] = useState(true)

    const { userId } = router.query;

    useEffect(() => {
        setShowSplashScreen(false)
    }, [router.isReady])
    // useEffect(() => {
    //     const userLanguage = localStorage.getItem('language')
    //     if (!userLanguage) {
    //         localStorage.setItem('language', i18n.language)
    //     }
    // }, [])





    // let persistor;
    // if (typeof window !== 'undefined') {
    //     persistor = persistStore(store);
    // }


    const zoneid = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('zoneid')) : undefined;


    useEffect(() => {
        const storedVersion = localStorage.getItem('appVersion');
        if (storedVersion !== currentVersion) {
            localStorage.clear();
            localStorage.setItem('appVersion', currentVersion);
            window.location.reload();
        }
        if (userId) {
            localStorage.setItem('userId', userId);
        }
    }, []);

    const isAuthRoute = router.pathname === '/login' || router.pathname === '/register';
    return (
        <CacheProvider value={emotionCache}>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <AuthDataListener />
                    <SettingsProvider>
                        <SettingsConsumer>
                            {(value) => (
                                <AppContent
                                    value={value}
                                    router={router}
                                    isAuthRoute={isAuthRoute}
                                    zoneid={zoneid}
                                    getLayout={getLayout}
                                    Component={Component}
                                    pageProps={pageProps}
                                />
                            )}
                        </SettingsConsumer>
                    </SettingsProvider>
                </Provider>
                <ReactQueryDevtools
                    initialIsOpen={false}
                    position="bottom-right"
                />
            </QueryClientProvider>
        </CacheProvider>
    )
}

export default App