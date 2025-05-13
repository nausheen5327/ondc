import React, { useState, useEffect } from 'react';
import { Stack, IconButton, Typography, Modal, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import FmdGoodIcon from '@mui/icons-material/FmdGood';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EditLocationOutlinedIcon from '@mui/icons-material/EditLocationOutlined';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '1080px',
    bgcolor: 'background.paper',
    border: '1px solid #fff',
    boxShadow: 24,
    borderRadius: '10px',
    color: '#FFFFFF',
};

const EnhancedAddressCard = ({ address, onUpdateAddress, open, setOpen }) => {
    const theme = useTheme();
    const [addressSymbol, setAddressSymbol] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [customTag, setCustomTag] = useState("");
    const [currentAddress, setCurrentAddress] = useState({
        id: "",
        descriptor: {
            name: "",
            phone: "",
            email: "",
        },
        address: {
            door: "",
            building: "",
            street: "",
            city: "",
            state: "",
            areaCode: "",
            tag: "",
            lat: "",
            lng: "",
            country: "IND",
        },
    });

    useEffect(() => {
        if (address) {
            setCurrentAddress(address);
            setCustomTag(address.address?.tag === 'Other' ? address.address.tag : '');
        }
    }, [address]);

    console.log("current address is", currentAddress, address);
    

    useEffect(() => {
        if (currentAddress.address?.tag === "Home") {
            setAddressSymbol(<HomeRoundedIcon style={{ width: '20px', height: '20px', color: '#666666' }} />);
        } else if (currentAddress.address?.tag === "Office") {
            setAddressSymbol(<ApartmentIcon style={{ width: '20px', height: '20px', color: '#666666' }} />);
        } else {
            setAddressSymbol(<FmdGoodIcon style={{ width: '20px', height: '20px', color: '#666666' }} />);
        }
    }, [currentAddress.address?.tag]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const [mainKey, subKey] = name.split(".");

        setCurrentAddress(prev => ({
            ...prev,
            [mainKey]: { ...prev[mainKey], [subKey]: value }
        }));
    };

    const handleTagChange = (event, newTag) => {
        if (newTag) {
            setCurrentAddress(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    tag: newTag,
                }
            }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!currentAddress.descriptor.name) errors.name = "Name is required";
        if (!currentAddress.descriptor.phone || currentAddress.descriptor.phone.length !== 13)
            errors.phone = "Valid 10-digit phone number is required";
        if (!currentAddress.descriptor.email || !/\S+@\S+\.\S+/.test(currentAddress.descriptor.email))
            errors.email = "Valid email is required";
        if (!currentAddress.address.door) errors.door = "House no. is required";
        if (!currentAddress.address.building) errors.building = "Building is required";
        if (!currentAddress.address.street) errors.street = "Street is required";
        if (!currentAddress.address.city) errors.city = "City is required";
        if (!currentAddress.address.state) errors.state = "State is required";
        if (!currentAddress.address.areaCode || currentAddress.address.areaCode.length !== 6)
            errors.areaCode = "Valid 6-digit area code is required";
        if (currentAddress.address.tag === "Other" && !customTag)
            errors.tag = "Custom tag is required";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = () => {
        if (!validateForm()) return;

        const updatedAddress = {
            ...currentAddress,
            address: {
                ...currentAddress.address,
                tag: currentAddress.address.tag === "Other" ? customTag : currentAddress.address.tag
            }
        };
        console.log("update address", updatedAddress);
        
        onUpdateAddress(updatedAddress);
        setOpen(false);
    };

    return (
        <div style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>


            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="edit-address-modal"
            >
                <Stack sx={style} style={{
                    width: '90%',
                    maxWidth: '600px',
                    padding: '24px',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                    <button
                        onClick={() => setOpen(false)}
                        style={{
                            position: 'absolute',
                            right: '16px',
                            top: '16px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <CloseIcon style={{ width: '16px', height: '16px', color: '#ffffff' }} />
                    </button>

                    <Typography variant="h6" style={{
                        fontWeight: 'bold',
                        marginBottom: '24px'
                    }}>
                        Edit Address
                    </Typography>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <TextField
                            label="Name*"
                            name="descriptor.name"
                            value={currentAddress.descriptor?.name || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.name}
                            helperText={formErrors.name}
                        />

                        <TextField
                            label="Phone*"
                            name="descriptor.phone"
                            value={currentAddress.descriptor?.phone || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.phone}
                            helperText={formErrors.phone}
                        />

                        <TextField
                            label="Email*"
                            name="descriptor.email"
                            value={currentAddress.descriptor?.email || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.email}
                            helperText={formErrors.email}
                        />
                        <TextField
                            label="House No.*"
                            name="address.door"
                            value={currentAddress.address?.door || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.door}
                            helperText={formErrors.door}
                        />
                        <TextField
                            label="Building*"
                            name="address.building"
                            value={currentAddress.address?.building || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.building}
                            helperText={formErrors.building}
                        />

                        <TextField
                            label="Street*"
                            name="address.street"
                            value={currentAddress.address?.street || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.street}
                            helperText={formErrors.street}
                        />

                        <TextField
                            label="City*"
                            name="address.city"
                            value={currentAddress.address?.city || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.city}
                            helperText={formErrors.city}
                        />

                        <TextField
                            label="State*"
                            name="address.state"
                            value={currentAddress.address?.state || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.state}
                            helperText={formErrors.state}
                        />

                        <TextField
                            label="Area Code*"
                            name="address.areaCode"
                            value={currentAddress.address?.areaCode || ''}
                            onChange={handleInputChange}
                            fullWidth
                            error={!!formErrors.areaCode}
                            helperText={formErrors.areaCode}
                        />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <Typography>Address Type</Typography>
                            <ToggleButtonGroup
                                value={currentAddress.address?.tag}
                                exclusive
                                onChange={handleTagChange}
                                style={{ width: '100%' }}
                            >
                                <ToggleButton
                                    value="Home"
                                    style={{ flex: 1 }}
                                >
                                    Home
                                </ToggleButton>
                                <ToggleButton
                                    value="Office"
                                    style={{ flex: 1 }}
                                >
                                    Office
                                </ToggleButton>
                                <ToggleButton
                                    value="Other"
                                    style={{ flex: 1 }}
                                >
                                    Other
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>

                        {currentAddress.address?.tag === "Other" && (
                            <TextField
                                label="Custom Tag*"
                                value={customTag}
                                onChange={(e) => setCustomTag(e.target.value)}
                                fullWidth
                                error={!!formErrors.tag}
                                helperText={formErrors.tag}
                            />
                        )}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '16px',
                            marginTop: '24px'
                        }}>
                            <button
                                onClick={() => setOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    color: '#666666',
                                    backgroundColor: 'transparent',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                style={{
                                    padding: '8px 16px',
                                    color: '#ffffff',
                                    backgroundColor: theme.palette.primary.main,
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </Stack>
            </Modal>
        </div>
    );
};

export default EnhancedAddressCard;