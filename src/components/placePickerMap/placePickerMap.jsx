// import { useCallback, useEffect, useState, useRef } from "react";
// import { CustomToaster } from "../custom-toaster/CustomToaster";
// import { Button } from "@mui/material";
// import { RTL } from "../RTL/RTL";

// const PlacePickerMap = (props) => {
//   const {
//     center = [28.62, 77.09],
//     zoom = 15,
//     zoomControl = true,
//     search = true,
//     location,
//     setLocation = null,
//   } = props;

//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const googleRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [searchBox, setSearchBox] = useState(null);
//   const [tempLocation, setTempLocation] = useState(null);
//   const [pinnedAddress, setPinnedAddress] = useState("");

//   // Convert coordinates to numbers and validate
//   const parseCoordinates = (lat, lng) => {
//     const parsedLat = parseFloat(lat);
//     const parsedLng = parseFloat(lng);

//     if (isNaN(parsedLat) || isNaN(parsedLng)) {
//       return null;
//     }

//     return {
//       lat: parsedLat,
//       lng: parsedLng,
//     };
//   };

//   // Get initial coordinates
//   const getInitialCoordinates = useCallback(() => {
//     if (location?.lat && location?.lng) {
//       const coords = parseCoordinates(location.lat, location.lng);
//       if (coords) return coords;
//     }
//     return { lat: parseFloat(center[0]), lng: parseFloat(center[1]) };
//   }, [center, location]);

//   // Get address details from coordinates using Google Geocoding service
//   const getAddressFromLatLng = useCallback(
//     async (lat, lng) => {
//       if (!googleRef.current?.maps) return;

//       try {
//         const geocoder = new googleRef.current.maps.Geocoder();
//         const response = await new Promise((resolve, reject) => {
//           geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//             if (status === "OK") {
//               resolve(results);
//             } else {
//               reject(status);
//             }
//           });
//         });

//         if (response?.[0]) {
//           const addressComponents = response[0].address_components;
//           const findComponent = (type) => {
//             const component = addressComponents.find((comp) =>
//               comp.types.includes(type)
//             );
//             return component ? component.long_name : "";
//           };

//           const locationData = {
//             lat: lat.toString(),
//             lng: lng.toString(),
//             street: `${
//               findComponent("street_number")
//                 ? findComponent("street_number") + " "
//                 : ""
//             }${findComponent("route") || ""}`,
//             city: findComponent("locality") || "",
//             state: findComponent("administrative_area_level_1") || "",
//             pincode: findComponent("postal_code") || "",
//             formatted_address: response[0].formatted_address,
//           };

//           setTempLocation(locationData);
//           setPinnedAddress(response[0].formatted_address);
//         }
//       } catch (error) {
//         CustomToaster("error", "Failed to get address details");
//         console.error("Geocoding error:", error);
//       }
//     },
//     []
//   );

//   const handleConfirmLocation = () => {
//     if (tempLocation && setLocation) {
//       setLocation(tempLocation);
//       CustomToaster("success", "Location confirmed successfully");
//     }
//   };

//   // Initialize or update marker
//   const updateMarker = useCallback(
//     (position) => {
      
//       if (!map || !googleRef.current?.maps) return;

//       const newPosition = new googleRef.current.maps.LatLng(
//         position.lat,
//         position.lng
//       );

//       console.log("new position", googleRef.current?.maps);


//       if (!markerRef.current) {
//         // Create new marker
//         const markerOptions = {
//           map,
//           position: newPosition,
//           draggable: true,
//         };

//         // Use AdvancedMarkerElement if available, fallback to regular Marker
//         markerRef.current = googleRef.current.maps.marker?.AdvancedMarkerElement
//           ? new googleRef.current.maps.marker.AdvancedMarkerElement(
//               markerOptions
//             )
//           : new googleRef.current.maps.Marker(markerOptions);

//         // Add drag end listener
//         markerRef.current.addListener("dragend", () => {
//           const pos = markerRef.current.position;
//           const newPos = { lat: pos.lat(), lng: pos.lng() };
//           getAddressFromLatLng(newPos.lat, newPos.lng);
//         });
//       } else {
//         // Update existing marker
//         markerRef.current.setPosition(newPosition);
//       }
//     },
//     [map, getAddressFromLatLng]
//   );

//   // const updateMarker = useCallback((position) => {
//   //   console.log("Updating marker position:", position);
  
//   //   if (!map || !googleRef.current?.maps){
//   //     console.log("inside update marker position if:", map);
//   //     return;
//   //   }
  
//   //   const newPosition = new googleRef.current.maps.LatLng(
//   //     position.lat,
//   //     position.lng
//   //   );
  
//   //   if (!markerRef.current) {
//   //     console.log("Creating new marker");
//   //     const markerOptions = {
//   //       map,
//   //       position: newPosition,
//   //       draggable: true,
//   //     };
  
//   //     markerRef.current = new googleRef.current.maps.Marker(markerOptions);
  
//   //     markerRef.current.addListener("dragend", () => {
//   //       const pos = markerRef.current.position;
//   //       const newPos = { lat: pos.lat(), lng: pos.lng() };
//   //       console.log("Marker dragged to:", newPos);
//   //       getAddressFromLatLng(newPos.lat, newPos.lng);
//   //     });
//   //   } else {
//   //     console.log("Updating existing marker position");
//   //     markerRef.current.setPosition(newPosition);
//   //   }
//   // }, [map, getAddressFromLatLng]);
  
//   // Initialize map
//   const initMap = useCallback(() => {
//     if (!mapRef.current || !googleRef.current?.maps) return;

//     try {
//       const initialCoords = getInitialCoordinates();

//       const mapInstance = new googleRef.current.maps.Map(mapRef.current, {
//         center: initialCoords,
//         zoom,
//         zoomControl,
//         mapTypeControl: true,
//         streetViewControl: true,
//         fullscreenControl: true,
//         gestureHandling: "greedy",
//       });

//       // Add click listener to map
//       mapInstance.addListener("click", (e) => {
//         if (!e.latLng) return;

//         const newPos = {
//           lat: e.latLng.lat(),
//           lng: e.latLng.lng(),
//         };

//         updateMarker(newPos);
//         getAddressFromLatLng(newPos.lat, newPos.lng);
//       });

//       setMap(mapInstance);
//       updateMarker(initialCoords);

//       // Add search box if enabled
//       if (search && googleRef.current.maps.places) {
//         const searchContainer = document.createElement("div");
//         searchContainer.style.cssText = `
//           position: absolute;
//           top: 10px;
//           z-index: 1000;
//           width: 100%;
//           display: flex;
//           justify-content: flex-end; 
//         `;

//         const input = document.createElement("input");
//         input.placeholder = "Search";
//         input.className = "controls";
//         input.style.cssText = `
//           width: 100%;
//           height: 44px;
//           padding: 8px 12px;
//           margin-left: 4px;
//           margin-right: 4px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           font-size: 14px;
//           background: white;
//         `;

//         searchContainer.appendChild(input);
//         document.querySelector(".map-container")?.appendChild(searchContainer);

//         const searchBoxInstance = new googleRef.current.maps.places.SearchBox(
//           input
//         );
//         setSearchBox(searchBoxInstance);

//         // Ensure the autocomplete container has the highest z-index
//         const observer = new MutationObserver((mutations) => {
//           const pacContainer = document.querySelector(".pac-container");
//           if (pacContainer) {
//             pacContainer.style.zIndex = "2000";
//             observer.disconnect();
//           }
//         });

//         observer.observe(document.body, {
//           childList: true,
//           subtree: true,
//         });

//         searchBoxInstance.addListener("places_changed", () => {
          
//           const places = searchBoxInstance.getPlaces();
//           if (places.length === 0) return;

//           const place = places[0];
//           if (!place.geometry?.location) return;

//           const newPos = {
//             lat: place.geometry.location.lat(),
//             lng: place.geometry.location.lng(),
//           };
//           console.log("new position", newPos);
          
//           mapInstance.setCenter(newPos);
//           updateMarker(newPos);
//           getAddressFromLatLng(newPos.lat, newPos.lng);
//         });
//       }
//     } catch (error) {
//       CustomToaster("error", "Failed to initialize map");
//       console.error("Map initialization error:", error);
//     }
//   }, [
//     zoom,
//     zoomControl,
//     search,
//     getInitialCoordinates,
//     updateMarker,
//     getAddressFromLatLng,
//   ]);

//   // Add styles for the autocomplete container
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       .pac-container {
//         z-index: 2000 !important;
//         position: fixed !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   // Load Google Maps script
//   useEffect(() => {
//     if (window.google?.maps) {
//       googleRef.current = window.google;
//       initMap();
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;

//     script.onload = () => {
//       googleRef.current = window.google;
//       initMap();
//     };

//     script.onerror = () => {
//       CustomToaster("error", "Failed to load Google Maps");
//     };

//     document.head.appendChild(script);

//     return () => {
//       if (markerRef.current) {
//         markerRef.current.setMap(null);
//       }
//       if (map) {
//         window.google?.maps?.event?.clearInstanceListeners(map);
//       }
//     };
//   }, []);

//   // Update marker when location prop changes
//   useEffect(() => {
//     if (map && location?.lat && location?.lng) {
//       const coords = parseCoordinates(location.lat, location.lng);
//       if (coords) {
//         map.setCenter(coords);
//         updateMarker(coords);
//       }
//     }
//   }, [location, map, updateMarker]);

//   return (
//     <RTL direction="ltr">
//     <div
//       className="map-container"
//       style={{ height: "100%", width: "100%", position: "relative" }}
//     >
//       <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
//       {pinnedAddress && (
//         <div
//           style={{
//             position: "absolute",
//             bottom: "20px",
//             left: "50%",
//             transform: "translateX(-50%)",
//             width: "90%",
//             maxWidth: "500px",
//             backgroundColor: "white",
//             borderRadius: "8px",
//             padding: "12px",
//             boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//             zIndex: 1000,
//             textAlign: "center",
//             color: "black"
//           }}
//         >
//           <div style={{ marginBottom: "8px", fontSize: "14px" }}>
//             {pinnedAddress}
//           </div>
//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleConfirmLocation}
//             style={{ width: "100%" }}
//           >
//             Confirm Location
//           </Button>
//         </div>
//       )}
//     </div>
//     </RTL>
//   );
// };

// export default PlacePickerMap;


// import { useCallback, useEffect, useState, useRef } from "react";
// import { CustomToaster } from "../custom-toaster/CustomToaster";
// import { Button } from "@mui/material";
// import { RTL } from "../RTL/RTL";

// const PlacePickerMap = (props) => {
//   const {
//     center = [28.62, 77.09],
//     zoom = 15,
//     zoomControl = true,
//     search = true,
//     location,
//     setLocation = null,
//   } = props;

//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const googleRef = useRef(null);
//   const [map, setMap] = useState(null);
//   const [searchBox, setSearchBox] = useState(null);
//   const [tempLocation, setTempLocation] = useState(null);
//   const [pinnedAddress, setPinnedAddress] = useState("");

//   // Convert coordinates to numbers and validate
//   const parseCoordinates = (lat, lng) => {
//     const parsedLat = parseFloat(lat);
//     const parsedLng = parseFloat(lng);

//     if (isNaN(parsedLat) || isNaN(parsedLng)) {
//       return null;
//     }

//     return {
//       lat: parsedLat,
//       lng: parsedLng,
//     };
//   };

//   // Get initial coordinates
//   const getInitialCoordinates = useCallback(() => {
//     if (location?.lat && location?.lng) {
//       const coords = parseCoordinates(location.lat, location.lng);
//       if (coords) return coords;
//     }
//     return { lat: parseFloat(center[0]), lng: parseFloat(center[1]) };
//   }, [center, location]);

//   // Get address details from coordinates using Google Geocoding service
//   const getAddressFromLatLng = useCallback(
//     async (lat, lng) => {
//       if (!googleRef.current?.maps) return;

//       try {
//         const geocoder = new googleRef.current.maps.Geocoder();
//         const response = await new Promise((resolve, reject) => {
//           geocoder.geocode({ location: { lat, lng } }, (results, status) => {
//             if (status === "OK") {
//               resolve(results);
//             } else {
//               reject(status);
//             }
//           });
//         });

//         if (response?.[0]) {
//           const addressComponents = response[0].address_components;
//           const findComponent = (type) => {
//             const component = addressComponents.find((comp) =>
//               comp.types.includes(type)
//             );
//             return component ? component.long_name : "";
//           };

//           const locationData = {
//             lat: lat.toString(),
//             lng: lng.toString(),
//             street: `${
//               findComponent("street_number")
//                 ? findComponent("street_number") + " "
//                 : ""
//             }${findComponent("route") || ""}`,
//             city: findComponent("locality") || "",
//             state: findComponent("administrative_area_level_1") || "",
//             pincode: findComponent("postal_code") || "",
//             formatted_address: response[0].formatted_address,
//           };

//           setTempLocation(locationData);
//           setPinnedAddress(response[0].formatted_address);
//         }
//       } catch (error) {
//         CustomToaster("error", "Failed to get address details");
//         console.error("Geocoding error:", error);
//       }
//     },
//     []
//   );

//   const handleConfirmLocation = () => {
//     if (tempLocation && setLocation) {
//       setLocation(tempLocation);
//       CustomToaster("success", "Location confirmed successfully");
//     }
//   };

//   const updateMarker = useCallback((position) => {
//     if (!map || !googleRef.current?.maps) {
//       return;
//     }

//     // Clean up existing marker if it exists
//     if (markerRef.current) {
//       markerRef.current.setMap(null);
//       markerRef.current = null;
//     }

//     // Create new marker
//     markerRef.current = new googleRef.current.maps.Marker({
//       map,
//       position: position,
//       draggable: true,
//       animation: googleRef.current.maps.Animation.DROP
//     });

//     // Add drag end listener
//     markerRef.current.addListener("dragend", () => {
//       const pos = markerRef.current.getPosition();
//       const newPos = { lat: pos.lat(), lng: pos.lng() };
//       getAddressFromLatLng(newPos.lat, newPos.lng);
//     });

//     // Center map on marker
//     map.setCenter(position);
//   }, [map, getAddressFromLatLng]);

//   // Initialize map
//   const initMap = useCallback(() => {
//     if (!mapRef.current || !googleRef.current?.maps) return;

//     try {
//       const initialCoords = getInitialCoordinates();

//       const mapInstance = new googleRef.current.maps.Map(mapRef.current, {
//         center: initialCoords,
//         zoom,
//         zoomControl,
//         mapTypeControl: true,
//         streetViewControl: true,
//         fullscreenControl: true,
//         gestureHandling: "greedy",
//       });

//       // Add click listener to map
//       mapInstance.addListener("click", (e) => {
//         if (!e.latLng) return;

//         const newPos = {
//           lat: e.latLng.lat(),
//           lng: e.latLng.lng(),
//         };

//         updateMarker(newPos);
//         getAddressFromLatLng(newPos.lat, newPos.lng);
//       });

//       setMap(mapInstance);
//       updateMarker(initialCoords);

//       // Add search box if enabled
//       if (search && googleRef.current.maps.places) {
//         const searchContainer = document.createElement("div");
//         searchContainer.style.cssText = `
//           position: absolute;
//           top: 10px;
//           z-index: 1000;
//           width: 100%;
//           display: flex;
//           justify-content: flex-end; 
//         `;

//         const input = document.createElement("input");
//         input.placeholder = "Search";
//         input.className = "controls";
//         input.style.cssText = `
//           width: 100%;
//           height: 44px;
//           padding: 8px 12px;
//           margin-left: 4px;
//           margin-right: 4px;
//           border: 1px solid #ccc;
//           border-radius: 4px;
//           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//           font-size: 14px;
//           background: white;
//         `;

//         searchContainer.appendChild(input);
//         document.querySelector(".map-container")?.appendChild(searchContainer);

//         const searchBoxInstance = new googleRef.current.maps.places.SearchBox(
//           input
//         );
//         setSearchBox(searchBoxInstance);

//         // Ensure the autocomplete container has the highest z-index
//         const observer = new MutationObserver((mutations) => {
//           const pacContainer = document.querySelector(".pac-container");
//           if (pacContainer) {
//             pacContainer.style.zIndex = "2000";
//             observer.disconnect();
//           }
//         });

//         observer.observe(document.body, {
//           childList: true,
//           subtree: true,
//         });

//         searchBoxInstance.addListener("places_changed", () => {
//           const places = searchBoxInstance.getPlaces();
//           if (places.length === 0) return;

//           const place = places[0];
//           if (!place.geometry?.location) return;

//           const newPos = {
//             lat: place.geometry.location.lat(),
//             lng: place.geometry.location.lng(),
//           };
          
//           mapInstance.setCenter(newPos);
//           updateMarker(newPos);
//           getAddressFromLatLng(newPos.lat, newPos.lng);
//         });
//       }
//     } catch (error) {
//       CustomToaster("error", "Failed to initialize map");
//       console.error("Map initialization error:", error);
//     }
//   }, [
//     zoom,
//     zoomControl,
//     search,
//     getInitialCoordinates,
//     updateMarker,
//     getAddressFromLatLng,
//   ]);

//   // Add styles for the autocomplete container
//   useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       .pac-container {
//         z-index: 2000 !important;
//         position: fixed !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   // Load Google Maps script
//   useEffect(() => {
//     if (window.google?.maps) {
//       googleRef.current = window.google;
//       initMap();
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;

//     script.onload = () => {
//       googleRef.current = window.google;
//       initMap();
//     };

//     script.onerror = () => {
//       CustomToaster("error", "Failed to load Google Maps");
//     };

//     document.head.appendChild(script);

//     return () => {
//       if (markerRef.current) {
//         markerRef.current.setMap(null);
//       }
//       if (map) {
//         window.google?.maps?.event?.clearInstanceListeners(map);
//       }
//     };
//   }, []);

//   // Update marker when location prop changes
//   useEffect(() => {
//     if (map && location?.lat && location?.lng) {
//       const coords = parseCoordinates(location.lat, location.lng);
//       if (coords) {
//         updateMarker(coords);
//       }
//     }
//   }, [location, map, updateMarker]);

//   return (
//     <RTL direction="ltr">
//       <div
//         className="map-container"
//         style={{ height: "100%", width: "100%", position: "relative" }}
//       >
//         <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
//         {pinnedAddress && (
//           <div
//             style={{
//               position: "absolute",
//               bottom: "20px",
//               left: "50%",
//               transform: "translateX(-50%)",
//               width: "90%",
//               maxWidth: "500px",
//               backgroundColor: "white",
//               borderRadius: "8px",
//               padding: "12px",
//               boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
//               zIndex: 1000,
//               textAlign: "center",
//               color: "black"
//             }}
//           >
//             <div style={{ marginBottom: "8px", fontSize: "14px" }}>
//               {pinnedAddress}
//             </div>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleConfirmLocation}
//               style={{ width: "100%" }}
//             >
//               Confirm Location
//             </Button>
//           </div>
//         )}
//       </div>
//     </RTL>
//   );
// };

// export default PlacePickerMap;

import { useCallback, useEffect, useState, useRef } from "react";
import { CustomToaster } from "../custom-toaster/CustomToaster";
import { Button } from "@mui/material";
import { RTL } from "../RTL/RTL";

const PlacePickerMap = (props) => {
  const {
    center = [28.62, 77.09],
    zoom = 15,
    zoomControl = true,
    search = true,
    location,
    setLocation = null,
  } = props;

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googleRef = useRef(null);
  const [map, setMap] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [tempLocation, setTempLocation] = useState(null);
  const [pinnedAddress, setPinnedAddress] = useState("");
  const [userLocation, setUserLocation] = useState(null);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      CustomToaster("error", "Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(coords);
        if (map) {
          updateMarker(coords);
          getAddressFromLatLng(coords.lat, coords.lng);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        CustomToaster("error", "Unable to retrieve your location");
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  }, [map]);

  // Convert coordinates to numbers and validate
  const parseCoordinates = (lat, lng) => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return null;
    }

    return {
      lat: parsedLat,
      lng: parsedLng,
    };
  };

  // Get initial coordinates
  const getInitialCoordinates = useCallback(() => {
    if (location?.lat && location?.lng) {
      const coords = parseCoordinates(location.lat, location.lng);
      if (coords) return coords;
    }
    if (userLocation) {
      return userLocation;
    }
    return { lat: parseFloat(center[0]), lng: parseFloat(center[1]) };
  }, [center, location, userLocation]);

  // Get address details from coordinates using Google Geocoding service
  const getAddressFromLatLng = useCallback(
    async (lat, lng) => {
      if (!googleRef.current?.maps) return;

      try {
        const geocoder = new googleRef.current.maps.Geocoder();
        const response = await new Promise((resolve, reject) => {
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK") {
              resolve(results);
            } else {
              reject(status);
            }
          });
        });

        if (response?.[0]) {
          const addressComponents = response[0].address_components;
          const findComponent = (type) => {
            const component = addressComponents.find((comp) =>
              comp.types.includes(type)
            );
            return component ? component.long_name : "";
          };

          const locationData = {
            lat: lat.toString(),
            lng: lng.toString(),
            street: `${
              findComponent("street_number")
                ? findComponent("street_number") + " "
                : ""
            }${findComponent("route") || ""}`,
            city: findComponent("locality") || "",
            state: findComponent("administrative_area_level_1") || "",
            pincode: findComponent("postal_code") || "",
            formatted_address: response[0].formatted_address,
          };

          setTempLocation(locationData);
          setPinnedAddress(response[0].formatted_address);
        }
      } catch (error) {
        CustomToaster("error", "Failed to get address details");
        console.error("Geocoding error:", error);
      }
    },
    []
  );

  const handleConfirmLocation = () => {
    if (tempLocation && setLocation) {
      setLocation(tempLocation);
      CustomToaster("success", "Location confirmed successfully");
    }
  };

  const updateMarker = useCallback((position) => {
    if (!map || !googleRef.current?.maps) {
      return;
    }

    // Clean up existing marker if it exists
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }

    // Create new marker
    markerRef.current = new googleRef.current.maps.Marker({
      map,
      position: position,
      draggable: true,
      animation: googleRef.current.maps.Animation.DROP
    });

    // Add drag end listener
    markerRef.current.addListener("dragend", () => {
      const pos = markerRef.current.getPosition();
      const newPos = { lat: pos.lat(), lng: pos.lng() };
      getAddressFromLatLng(newPos.lat, newPos.lng);
    });

    // Center map on marker
    map.setCenter(position);
  }, [map, getAddressFromLatLng]);

  // Initialize map
  const initMap = useCallback(() => {
    if (!mapRef.current || !googleRef.current?.maps) return;

    try {
      const initialCoords = getInitialCoordinates();

      const mapInstance = new googleRef.current.maps.Map(mapRef.current, {
        center: initialCoords,
        zoom,
        zoomControl,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        gestureHandling: "greedy",
      });

      // Add click listener to map
      mapInstance.addListener("click", (e) => {
        if (!e.latLng) return;

        const newPos = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };

        updateMarker(newPos);
        getAddressFromLatLng(newPos.lat, newPos.lng);
      });

      setMap(mapInstance);
      updateMarker(initialCoords);

      // Add search box if enabled
      if (search && googleRef.current.maps.places) {
        const searchContainer = document.createElement("div");
        searchContainer.style.cssText = `
          position: absolute;
          top: 10px;
          z-index: 1000;
          width: 100%;
          display: flex;
          justify-content: flex-end; 
        `;

        // Create location button container
        const buttonContainer = document.createElement("div");
        buttonContainer.style.cssText = `
          margin-left: 4px;
          margin-right: 4px;
        `;

        // Create location button
        const locationButton = document.createElement("button");
        locationButton.innerHTML = "📍 My Location";
        locationButton.style.cssText = `
          height: 44px;
          padding: 8px 12px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          background: white;
          cursor: pointer;
        `;
        locationButton.onclick = getCurrentLocation;

        const input = document.createElement("input");
        input.placeholder = "Search";
        input.className = "controls";
        input.style.cssText = `
          width: 100%;
          height: 44px;
          padding: 8px 12px;
          margin-left: 4px;
          margin-right: 4px;
          border: 1px solid #ccc;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          font-size: 14px;
          background: white;
        `;

        buttonContainer.appendChild(locationButton);
        searchContainer.appendChild(buttonContainer);
        searchContainer.appendChild(input);
        document.querySelector(".map-container")?.appendChild(searchContainer);

        const searchBoxInstance = new googleRef.current.maps.places.SearchBox(
          input
        );
        setSearchBox(searchBoxInstance);

        // Ensure the autocomplete container has the highest z-index
        const observer = new MutationObserver((mutations) => {
          const pacContainer = document.querySelector(".pac-container");
          if (pacContainer) {
            pacContainer.style.zIndex = "2000";
            observer.disconnect();
          }
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        searchBoxInstance.addListener("places_changed", () => {
          const places = searchBoxInstance.getPlaces();
          if (places.length === 0) return;

          const place = places[0];
          if (!place.geometry?.location) return;

          const newPos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          
          mapInstance.setCenter(newPos);
          updateMarker(newPos);
          getAddressFromLatLng(newPos.lat, newPos.lng);
        });
      }
    } catch (error) {
      CustomToaster("error", "Failed to initialize map");
      console.error("Map initialization error:", error);
    }
  }, [
    zoom,
    zoomControl,
    search,
    getInitialCoordinates,
    updateMarker,
    getAddressFromLatLng,
    getCurrentLocation,
  ]);

  // Add styles for the autocomplete container
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .pac-container {
        z-index: 2000 !important;
        position: fixed !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps) {
      googleRef.current = window.google;
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      googleRef.current = window.google;
      initMap();
    };

    script.onerror = () => {
      CustomToaster("error", "Failed to load Google Maps");
    };

    document.head.appendChild(script);

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (map) {
        window.google?.maps?.event?.clearInstanceListeners(map);
      }
    };
  }, []);

  // Update marker when location prop changes
  useEffect(() => {
    if (map && location?.lat && location?.lng) {
      const coords = parseCoordinates(location.lat, location.lng);
      if (coords) {
        updateMarker(coords);
      }
    }
  }, [location, map, updateMarker]);

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return (
    <RTL direction="ltr">
      <div
        className="map-container"
        style={{ height: "100%", width: "100%", position: "relative" }}
      >
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        {pinnedAddress && (
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "90%",
              maxWidth: "500px",
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              zIndex: 1000,
              textAlign: "center",
              color: "black"
            }}
          >
            <div style={{ marginBottom: "8px", fontSize: "14px" }}>
              {pinnedAddress}
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmLocation}
              style={{ width: "100%" }}
            >
              Confirm Location
            </Button>
          </div>
        )}
      </div>
    </RTL>
  );
};

export default PlacePickerMap;