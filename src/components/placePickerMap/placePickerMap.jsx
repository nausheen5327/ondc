import { getCall } from "@/api/MainApi";
import useCancellablePromise from "@/api/cancelRequest";
import { useCallback, useEffect, useState } from "react";
// import "../../../PlacePickerMap.css"; // Adjust based on actual path
// import useCancellablePromise from "../../api/MainApi"; // Update with relative path
// import { getCall } from "../../api/MainApi"; // Update with relative path

const PlacePickerMap = (props) => {
  const {
    center = [28.62, 77.09],
    zoom = 15,
    zoomControl = true,
    search = true,
    location,
    setLocation = null,
  } = props;

  const [apiKey, setApiKey] = useState();
  const [map, setMap] = useState();
  const [mapInitialized, setMapInitialized] = useState(false);

  const { cancellablePromise } = useCancellablePromise();

  const getToken = async () => {
    let res = await cancellablePromise(getCall(`/clientApis/v2/map/accesstoken`));
    res = {
      "access_token": "e6e6630b-eb2a-487e-bbc1-6d2f8713b5ed",
      "token_type": "bearer",
      "expires_in": 86399,
      "scope": "READ",
      "project_code": "prj1725344068i382366148",
      "client_id": "96dHZVzsAuspFImAwr-1zJVDzHh3ja2zgi1IBaWaR-oMbhOwl6KZTqvkaJ2vtDcexSp4KtbViBs7SCNoVhGRBg=="
  }
    setApiKey(res.access_token);
  };

  // Fetch MMI API token
  useEffect(() => {
    getToken();
  }, []);

  const loadMapmyIndiaScripts = async () => {
    if (!apiKey) return;

    // Load the first script
    await new Promise((resolve, reject) => {
      const script1 = document.createElement("script");
      script1.src = `https://apis.mapmyindia.com/advancedmaps/v1/${apiKey}/map_load?v=1.3`;
      script1.async = true;
      script1.onload = resolve;
      script1.onerror = reject;
      document.body.appendChild(script1);
    });

    // Load the second script
    await new Promise((resolve, reject) => {
      const script2 = document.createElement("script");
      script2.src = `https://apis.mapmyindia.com/advancedmaps/api/${apiKey}/map_sdk_plugins`;
      script2.async = true;
      script2.onload = resolve;
      script2.onerror = reject;
      document.body.appendChild(script2);
    });

    setMapInitialized(false); // Reset map initialization flag to trigger map setup
  };

  const initializeMap = useCallback((node) => {
    if (!mapInitialized && node && typeof window !== "undefined" && window.MapmyIndia) {
      const mapInstance = new window.MapmyIndia.Map(node, {
        center,
        zoom,
        zoomControl,
        search,
      });
      setMap(mapInstance);
      setMapInitialized(true);
    }
  }, [mapInitialized, center, zoom, zoomControl, search]);

  useEffect(() => {
    if (!mapInitialized && apiKey) {
      loadMapmyIndiaScripts().then(() => {
        if (typeof window.MapmyIndia !== "undefined") {
          setMapInitialized(true); // Set to true only if MapmyIndia is available
        } else {
          console.error("MapmyIndia is still not defined after scripts loaded.");
        }
      }).catch(err => console.error("Failed to load MapmyIndia scripts", err));
    }
  }, [apiKey, mapInitialized]);

  const onChange = (data) => {
    console.log(data,"data...");
    const { lat, lng } = data;
    if (lat && lng) {
      setLocation(data);
    } else {
      console.log("Location not found. Please try moving map.");
    }
  };

  useEffect(() => {
    if (!mapInitialized || !map || !window.MapmyIndia) return;
    
    const options = {
      map,
      callback: setLocation ? onChange : undefined,
      search,
      closeBtn: false,
      topText: " ",
      geolocation: true,
      location: location?.lat && location?.lng ? location : { lat: 28.679079, lng: 77.06971 },
    };

    new window.MapmyIndia.placePicker(options);
  }, [mapInitialized, map, location, setLocation, search]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <div id="map" ref={initializeMap} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default PlacePickerMap;
