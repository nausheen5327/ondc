import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import FloatingCart from './FloatingCart'
import BottomNav from '../navbar/BottomNav'

const FloatingCardManagement = () => {
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false)
    const [showBottomNav, setShowBottomNav] = useState(false)
    useEffect(() => {
         setShowBottomNav(true)
    }, [])

    return (
        <>
            <FloatingCart
                sideDrawerOpen={sideDrawerOpen}
                setSideDrawerOpen={setSideDrawerOpen}
            />
            {showBottomNav && (
                <BottomNav setSideDrawerOpen={setSideDrawerOpen} />
            )}
        </>
    )
}

FloatingCardManagement.propTypes = {}

export default FloatingCardManagement
