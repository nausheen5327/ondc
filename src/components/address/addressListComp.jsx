import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import MapPointer from "../placePickerMap/placePickerMap";
import PlacePickerMap from "../placePickerMap/placePickerMap";
import { useSelector } from "react-redux";
import { RTL } from "../RTL/RTL";
const UserAddressList = ({ addresses, onUpdateAddresses, onSelectAddress, onAddAddress }) => {
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const theme = useTheme();
  const location = useSelector((state) => state.addressData.location);
  // console.log("location for def",location);
  useEffect(()=>{
    if(addresses.length<1)setIsAddMode(true)
  },[addresses])
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
  const [customTag, setCustomTag] = useState("");
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (location) {
      setSelectedAddressId(location.id);
    }
  }, [location]);

  // Handle selecting an address
  const handleSelectAddress = (addr) => {
    setSelectedAddressId(addr.id);
    onSelectAddress(addr);
  };

  // Open dialog for editing an address
  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setIsEditMode(true);
    // setCustomTag(address.address.tag === 'Other' ? address.address.tag : '');
  };

  // Open dialog for adding a new address
  const handleAddAddress = () => {
    setCurrentAddress({
      id: "",
      descriptor: {
        name: "",
        phone: "",
        email: "",
      },
      address: {
        door: "",
        country: "IND",
        lat: "",
        lng: "",
        building: "",
        street: "",
        city: "",
        state: "",
        areaCode: "",
        tag: "Home", // Default selection
      },
    });
    setIsAddMode(true);
    setCustomTag("");
  };
  useEffect(() => {
    const savedAddress = localStorage.getItem("currentAddress");
    if (savedAddress) {
      setCurrentAddress(JSON.parse(savedAddress));
    }
  }, []);
  // Handle form input change
  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
    
  //   setCurrentAddress((prev) => {
  //     const [mainKey, subKey] = name.split(".");
  //     localStorage.setItem("currentAddress", JSON.stringify({ ...prev, [mainKey]: { ...prev[mainKey], [subKey]: value }}))
  //     return { ...prev, [mainKey]: { ...prev[mainKey], [subKey]: value } };
  //   });
  // };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [mainKey, subKey] = name.split(".");
    
    setCurrentAddress(prev => {
      const newAddress = {
        ...prev,
        [mainKey]: { ...prev[mainKey], [subKey]: value }
      };
      // Save to localStorage after state update
      localStorage.setItem("currentAddress", JSON.stringify(newAddress));
      return newAddress;
    });
  };
  const handleCustomTag = (value) => {
    setCustomTag(value);
  };

  // Handle tag selection
  const handleTagChange = (event, newTag) => {
    if (newTag) {
      setCurrentAddress((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          tag: newTag,
        },
      }));
    }
  };

  // Save changes (either edit or add new address)
  const handleSaveAddress = () => {
    // Exit if form is invalid
    
    if (!validateForm()) return; 
    if (currentAddress.address.tag === "Other") {
        currentAddress.address.tag = customTag;
      }
    isAddMode?onAddAddress(currentAddress): onUpdateAddresses(currentAddress);
    setIsEditMode(false);
    setIsAddMode(false);
  };

  // Validation logic
  const validateForm = () => {
    console.log("addr validation", currentAddress.address.tag);
    const errors = {};
    if (!currentAddress.descriptor.name) errors.name = "Name is required.";
    if (
      !currentAddress.descriptor.phone ||
      currentAddress.descriptor.phone.length !== 10
    )
      errors.phone = "Valid phone number is required.";
    if (
      !currentAddress.descriptor.email ||
      !/\S+@\S+\.\S+/.test(currentAddress.descriptor.email)
    )
      errors.email = "Valid email is required.";
    if (!currentAddress.address.building)
      errors.building = "Building is required.";
    if (!currentAddress.address.street) errors.street = "Street is required.";
    if (!currentAddress.address.city) errors.city = "City is required.";
    if (!currentAddress.address.state) errors.state = "State is required.";
    if (
      !currentAddress.address.areaCode ||
      currentAddress.address.areaCode.length !== 6
    )
      errors.areaCode = "Valid area code is required.";
    if (currentAddress.address.tag === "Other" && !customTag)
      errors.tag = "Custom tag is required for 'Other'.";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // useEffect(() => {
  //   const handleResize = () => {
  //     const isKeyboardOpen = window.innerHeight < 600; // Adjust threshold for your app
  //     const container = document.querySelector(".containerBox");
  //     if (container) {
  //       container.style.marginBottom = isKeyboardOpen ? "300px" : "0px";
  //     }
  //   };
  
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  
  

  return (
    <div
      style={{
        marginTop: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
      className="containerBox"
    >
      <RTL direction="ltr">
      {addresses.length>0 && addresses.map((address) => (
        <Card
          key={address.id}
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "16px",
            cursor: "pointer",
            border:
              selectedAddressId === address.id
                ? `2px solid ${theme.palette.primary.main}`
                : "1px solid #e5e7eb",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            flexWrap: "wrap",
          }}
          onClick={() => handleSelectAddress(address)}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Radio
              checked={selectedAddressId === address.id}
              onChange={() => handleSelectAddress(address)}
              value={address.id}
              style={{ marginBottom: "8px" }}
            />
            <CardContent
              style={{ flexGrow: 1, marginLeft: "8px", minWidth: "250px" }}
            >
              <Typography variant="h6" style={{ fontWeight: "bold" }}>
                {address.address.tag} ({address.descriptor.name})
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {address.descriptor.email} - {address.descriptor.phone}
              </Typography>
              <Typography variant="body2">
                {address.address.door}, {address.address.building},{" "}
                {address.address.street}, {address.address.city},{" "}
                {address.address.state}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {address.address.areaCode}
              </Typography>
            </CardContent>
          </div>
          <div
            style={{
              flexBasis: "100%",
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
              order: "1",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                handleEditAddress(address);
              }}
            >
              Edit
            </Button>
          </div>
        </Card>
      ))}

     {addresses.length>0 && <Button
        variant="contained"
        color="primary"
        onClick={handleAddAddress}
        style={{ width: "100%", marginTop: "16px" }}
      >
        Add Address
      </Button>}

      {/* Dialog for editing or adding an address */}
      <Dialog
        open={isEditMode || isAddMode}
        onClose={() => {
          setIsEditMode(false);
          setIsAddMode(false);
        }}
        PaperProps={{
          style: {
            margin: '16px',
            maxHeight: '85vh',
            overflowY: 'auto'
          }
        }}
      >
        <DialogTitle
          style={{
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {isEditMode ? "Update Delivery Address" : "Add Delivery Address"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name*"
            name="descriptor.name"
            value={currentAddress.descriptor.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.name}
            helperText={formErrors.name}
          />
          <TextField
            label="Phone*"
            name="descriptor.phone"
            value={currentAddress.descriptor.phone}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.phone}
            helperText={formErrors.phone}
          />
          <TextField
            label="Email*"
            name="descriptor.email"
            value={currentAddress.descriptor.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.email}
            helperText={formErrors.email}
          />
          <MapPicker
            address={currentAddress.address}
            setAddress={setCurrentAddress}
          />
          <TextField
            label="Building*"
            name="address.building"
            value={currentAddress.address.building}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.building}
            helperText={formErrors.building}
          />
          <TextField
            label="Street*"
            name="address.street"
            value={currentAddress.address.street}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            error={!!formErrors.street}
            helperText={formErrors.street}
          />
          <TextField
            label="City*"
            name="address.city"
            value={currentAddress.address.city}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
            error={!!formErrors.city}
            helperText={formErrors.city}
          />
          <TextField
            label="State*"
            name="address.state"
            value={currentAddress.address.state}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
            error={!!formErrors.state}
            helperText={formErrors.state}
          />
          <TextField
            label="Area Code*"
            name="address.areaCode"
            value={currentAddress.address.areaCode}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled
            error={!!formErrors.areaCode}
            helperText={formErrors.areaCode}
          />

          {/* Tag Selection */}
          <Typography variant="body1" style={{ marginTop: "16px" }}>
            Tag
          </Typography>
          <ToggleButtonGroup
            value={currentAddress.address.tag}
            exclusive
            onChange={handleTagChange}
            aria-label="Tag"
            style={{ marginTop: "8px", marginBottom: "8px" }}
          >
            <ToggleButton
              value="Home"
              style={{
                backgroundColor:
                  currentAddress.address.tag === "Home"
                    ? theme.palette.primary.main
                    : undefined,
                color:
                  currentAddress.address.tag === "Home" ? "white" : undefined,
              }}
            >
              Home
            </ToggleButton>
            <ToggleButton
              value="Office"
              style={{
                backgroundColor:
                  currentAddress.address.tag === "Office"
                    ? theme.palette.primary.main
                    : undefined,
                color:
                  currentAddress.address.tag === "Office" ? "white" : undefined,
              }}
            >
              Office
            </ToggleButton>
            <ToggleButton
              value="Other"
              style={{
                backgroundColor:
                  currentAddress.address.tag === "Other"
                    ? theme.palette.primary.main
                    : undefined,
                color:
                  currentAddress.address.tag === "Other" ? "white" : undefined,
              }}
            >
              Other
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Custom Tag Input */}
          {currentAddress.address.tag === "Other" && (
            <TextField
              label="Specify Tag"
              value={customTag}
              name="address.tag"
              onChange={(e) => handleCustomTag(e.target.value)}
              fullWidth
              margin="normal"
              error={!!formErrors.tag}
            helperText={formErrors.tag}

            />
          )}
        </DialogContent>
        <DialogActions>
          {addresses.length>=1 &&<Button
            onClick={() => {
              setIsEditMode(false);
              setIsAddMode(false);
            }}
          >
            Cancel
          </Button>}
          <Button
            onClick={handleSaveAddress}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      </RTL>
    </div>
  );
};

const MapPicker = (props) => {
  const { address, setAddress } = props;
  console.log("MapPicker props=====>", props);
  let locationString = "28.679076630288467,77.06970870494843";
  locationString = locationString.split(",");
  const gps = {
    lat: locationString[0],
    lng: locationString[1],
  };

  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (address.lat && address.lng) {
      console.log(address.areaCode);
      setLocation({
        lat: address.lat,
        lng: address.lng,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.areaCode,
      });
    }
  }, []);

  useEffect(() => {
    if (location) {
      setAddress((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: location.street,
          city: location.city,
          state: location.state,
          areaCode: location.pincode,
          lat: parseFloat(location.lat).toFixed(6).toString(),
          lng: parseFloat(location.lng).toFixed(6).toString(),
        },
      }));
    }
  }, [location]);
  console.log("location...", location);
  return (
    <div style={{ width: "100%", height: "400px" }}>
      <PlacePickerMap location={location || gps} setLocation={setLocation} />
    </div>
  );
};

export default UserAddressList;
