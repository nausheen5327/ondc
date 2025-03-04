import React, { useEffect } from 'react'
import Homes from '../../components/home/Homes'
import Meta from '../../components/Meta'
import HomeGuard from '../../components/home-guard/HomeGuard'
import { getServerSideProps } from '../index'
import { useRouter } from 'next/router'
const HomePage = ({  landingPageData, pathName }) => {
    const router = useRouter()
    return (
        <>
            <Meta
                title={'ONDC'}
                pathName={pathName}
            />
            <Homes />
        </>
    )
}
HomePage.getLayout = (page) => <HomeGuard>{page}</HomeGuard>

export default HomePage
export { getServerSideProps }
