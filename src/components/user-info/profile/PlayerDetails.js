import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import Container from '@mui/material/Container'
import CustomerLayout from '../customer-layout/CustomerLayout'
import PlayerDetailsPage from './PlayerDetailsPage'

const PlayerDetails = () => {
    return (
        <div>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ mb: { xs: '0px', md: '0' } }}>
                <PlayerDetailsPage/>
            </Container>
        </div>
    )
}

export default PlayerDetails
