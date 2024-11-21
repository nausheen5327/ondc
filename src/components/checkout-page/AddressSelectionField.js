import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { InputField, SaveAddressBox } from './CheckOut.style'
import { alpha, InputBase, Typography } from "@mui/material";
import AddNewAddress from '../user-info/address/AddNewAddress'
import Link from 'next/link'
import Router from 'next/router'
import { Stack } from "@mui/system";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AddressSelectionField = (props) => {
    const { theme, address, refetch, t } = props
    const borderColor = "rgba(255, 130, 0, 0.20)"
    let Address = JSON.parse(address.address)

    const handleRoute = () => {
        Router.push(
            {
                pathname: '/info',
                query: { page: 'profile' },
            },
            undefined,
            { shallow: true }
        )
    }
    console.log("Address",Address);
    return (
        <>

                <InputField
                    variant="outlined"
                    sx={{
                        p: '8px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        border: `1px solid ${borderColor}`,
                        gap: '5px',
                        borderRadius:"5px",
                        backgroundColor:theme=>alpha(theme.palette.primary.light,.2),

                    }}
                >
                    <LocationOnIcon sx={{color:theme=>theme.palette.primary.main,}}/>
                    <Typography fontSize="14px" fontWeight="600">
                        {t(Address?.address?.tag)}:
                    </Typography>
                    <InputBase
                        sx={{
                            ml: 1,
                            flex: 1,
                            fontSize: '15px',
                            color:theme=>theme.palette.neutral[600],
                            [theme.breakpoints.down('sm')]: {
                                fontSize: '12px',
                            },
                        }}
                        placeholder="Set Location"
                        inputProps={{
                            'aria-label': 'search google maps',
                        }}
                        value={`${Address?.address?.building} ${Address?.address?.street} ${Address?.address?.city} ${Address?.address?.state} ${Address?.address?.areaCode}`}
                    />

                    {/*<AddNewAddress refetch={refetch} buttonbg="true" />*/}
                </InputField>

        </>
    )
}

AddressSelectionField.propTypes = {}

export default AddressSelectionField
