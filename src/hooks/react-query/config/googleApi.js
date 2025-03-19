// googleApi.js - Fixed version with null checks and serializable object conversion
const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY;

// Helper function to ensure Google API is loaded
const loadGoogleMapsApi = () => {
    return new Promise((resolve, reject) => {
      // Check if API is already loaded
      if (window.google && window.google.maps) {
        return resolve(window.google);
      }
      
      // If it's loading, wait for it
      if (window.googleMapsApiLoading) {
        let checkCount = 0;
        const maxChecks = 100; // Prevent infinite loop
        
        const checkInterval = setInterval(() => {
          checkCount++;
          if (window.google && window.google.maps) {
            clearInterval(checkInterval);
            resolve(window.google);
          } else if (checkCount > maxChecks) {
            clearInterval(checkInterval);
            reject(new Error('Google Maps load timeout'));
          }
        }, 100);
        return;
      }
      
      // Set loading flag
      window.googleMapsApiLoading = true;
      
      // Add the script to the page
      const script = document.createElement('script');
      
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        window.googleMapsApiLoading = false;
        console.log("Google Maps API loaded successfully");
        resolve(window.google);
      };
      
      script.onerror = () => {
        window.googleMapsApiLoading = false;
        console.error("Failed to load Google Maps API");
        reject(new Error('Google Maps script load failed'));
      };
      
      document.head.appendChild(script);
    });
  };
  
  // Helper function to make location objects serializable
  const makeLocationSerializable = (location) => {
    // Handle Google's LatLng objects by extracting numeric values
    if (location && typeof location.lat === 'function' && typeof location.lng === 'function') {
      return {
        lat: location.lat(),
        lng: location.lng()
      };
    }
    
    // Handle normal objects with lat/lng properties
    if (location && typeof location.lat !== 'undefined' && typeof location.lng !== 'undefined') {
      return {
        lat: Number(location.lat),
        lng: Number(location.lng)
      };
    }
    
    // Return default if location is invalid
    return { lat: 0, lng: 0 };
  };
  
  // Helper to make Google Maps results serializable for Redux
  const makeResultSerializable = (result) => {
    if (!result) return null;
    
    // Simple shallow serialization for basic cases
    if (Array.isArray(result)) {
      return result.map(item => makeResultSerializable(item));
    }
    
    if (typeof result !== 'object' || result === null) {
      return result;
    }
    
    // Create a deep copy and convert non-serializable objects
    const newObj = {};
    
    for (const key in result) {
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        const value = result[key];
        
        // Handle Google Maps LatLng objects
        if (value && typeof value.lat === 'function' && typeof value.lng === 'function') {
          newObj[key] = {
            lat: value.lat(),
            lng: value.lng()
          };
        }
        // Skip functions
        else if (typeof value === 'function') {
          continue;
        }
        // Handle nested objects/arrays recursively
        else if (value && typeof value === 'object') {
          newObj[key] = makeResultSerializable(value);
        }
        // Handle primitive values
        else {
          newObj[key] = value;
        }
      }
    }
    
    return newObj;
  };
  
  export const GoogleApi = {
    placeApiAutocomplete: async (search) => {
      if (!search || search === '') {
        return { data: { predictions: [] } };
      }
  
      try {
        const google = await loadGoogleMapsApi();
        const autocompleteService = new google.maps.places.AutocompleteService();
        
        return new Promise((resolve, reject) => {
          autocompleteService.getPlacePredictions(
            { input: search },
            (predictions, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
                resolve({
                  data: { predictions }
                });
              } else {
                resolve({ data: { predictions: [] } });
              }
            }
          );
        });
      } catch (error) {
        console.error('Error in placeApiAutocomplete:', error);
        return { data: { predictions: [] } };
      }
    },
    
    placeApiDetails: async (placeId) => {
      if (!placeId) {
        return { data: { result: null } };
      }
  
      try {
        const google = await loadGoogleMapsApi();
        const placesService = new google.maps.places.PlacesService(
          document.createElement('div')
        );
        
        return new Promise((resolve, reject) => {
          placesService.getDetails(
            { placeId: placeId },
            (result, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                // Make serializable for Redux
                const serializableResult = makeResultSerializable(result);
                
                // Ensure geometry.location is a plain object
                if (serializableResult?.geometry?.location) {
                  serializableResult.geometry.location = makeLocationSerializable(serializableResult.geometry.location);
                }
                
                resolve({
                  data: { result: serializableResult }
                });
              } else {
                resolve({ data: { result: null } });
              }
            }
          );
        });
      } catch (error) {
        console.error('Error in placeApiDetails:', error);
        return { data: { result: null } };
      }
    },
    
    getZoneId: async (location) => {
      if (!location || typeof location.lat === 'undefined' || typeof location.lng === 'undefined') {
        return { data: { zone_id: null, zone_data: null } };
      }
  
      try {
        const google = await loadGoogleMapsApi();
        const geocoder = new google.maps.Geocoder();
        const serializedLocation = makeLocationSerializable(location);
        
        return new Promise((resolve, reject) => {
          geocoder.geocode(
            { location: { lat: serializedLocation.lat, lng: serializedLocation.lng } },
            (results, status) => {
              if (status === 'OK' && results && results.length > 0) {
                // Make results serializable
                const serializableResults = makeResultSerializable(results[0]);
                
                // Extract zone info from the first result
                const addressComponents = serializableResults.address_components || [];
                const administrativeArea = addressComponents.find(
                  comp => comp.types.includes('administrative_area_level_1') ||
                        comp.types.includes('administrative_area_level_2')
                );
                
                const locality = addressComponents.find(
                  comp => comp.types.includes('locality')
                );
                
                const zoneData = {
                  zone_id: administrativeArea?.long_name || locality?.long_name || 'unknown',
                  zone_data: serializableResults
                };
                
                resolve({
                  data: zoneData
                });
              } else {
                resolve({ data: { zone_id: null, zone_data: null } });
              }
            }
          );
        });
      } catch (error) {
        console.error('Error in getZoneId:', error);
        return { data: { zone_id: null, zone_data: null } };
      }
    },
    
    distanceApi: async (origin, destination) => {
      if (!origin || !destination) {
        return { data: null };
      }
  
      try {
        const google = await loadGoogleMapsApi();
        const service = new google.maps.DistanceMatrixService();
        
        const originLat = origin?.latitude || 0;
        const originLng = origin?.longitude || 0;
        const destLat = destination?.lat || destination?.latitude || 0;
        const destLng = destination?.lng || destination?.longitude || 0;
        
        return new Promise((resolve, reject) => {
          service.getDistanceMatrix(
            {
              origins: [new google.maps.LatLng(originLat, originLng)],
              destinations: [new google.maps.LatLng(destLat, destLng)],
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (response, status) => {
              if (status === 'OK' && response) {
                resolve({
                  data: makeResultSerializable(response)
                });
              } else {
                resolve({ data: null });
              }
            }
          );
        });
      } catch (error) {
        console.error('Error in distanceApi:', error);
        return { data: null };
      }
    },
    
    geoCodeApi: async (location) => {
      if (!location || typeof location.lat === 'undefined' || typeof location.lng === 'undefined') {
        return { data: { results: [] } };
      }
  
      try {
        const google = await loadGoogleMapsApi();
        const geocoder = new google.maps.Geocoder();
        const serializedLocation = makeLocationSerializable(location);
        
        return new Promise((resolve, reject) => {
          geocoder.geocode(
            { location: { lat: serializedLocation.lat, lng: serializedLocation.lng } },
            (results, status) => {
              if (status === 'OK' && results) {
                // Make results serializable
                const serializableResults = results.map(result => makeResultSerializable(result));
                
                resolve({
                  data: { results: serializableResults }
                });
              } else {
                resolve({ data: { results: [] } });
              }
            }
          );
        });
      } catch (error) {
        console.error('Error in geoCodeApi:', error);
        return { data: { results: [] } };
      }
    },
  };