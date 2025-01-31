
import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Maximize2, Minimize2 } from 'lucide-react';
import AnimatedMapMarker from './animatedMarker';

const DeliveryMap = ({
    sourceLocation = { lat: 28.6139, lng: 77.2090 },
    destinationLocation = { lat: 28.6304, lng: 77.2177 }
}) => {
    const [map, setMap] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [directions, setDirections] = useState(null);
    const [zoom, setZoom] = useState(12);
    const [isLoaded, setIsLoaded] = useState(false);

    const mapContainerStyle = {
        width: '100%',
        height: '400px' // Added fixed height
    };

    const center = {
        lat: (sourceLocation.lat + destinationLocation.lat) / 2,
        lng: (sourceLocation.lng + destinationLocation.lng) / 2
    };

    const onLoad = useCallback((map) => {
        setMap(map);
        setIsLoaded(true);

        // Fit bounds to show both markers
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(sourceLocation);
        bounds.extend(destinationLocation);
        map.fitBounds(bounds);
    }, [sourceLocation, destinationLocation]);

    const onUnmount = useCallback(() => {
        setMap(null);
        setIsLoaded(false);
    }, []);

    const directionsCallback = useCallback((result, status) => {
        if (status === 'OK' && !directions) {
            setDirections(result);
        }
    }, [directions]);

    // Handle zoom controls
    const handleZoomIn = () => {
        if (map) {
            const newZoom = Math.min(map.getZoom() + 1, 20);
            map.setZoom(newZoom);
            setZoom(newZoom);
        }
    };

    const handleZoomOut = () => {
        if (map) {
            const newZoom = Math.max(map.getZoom() - 1, 1);
            map.setZoom(newZoom);
            setZoom(newZoom);
        }
    };

    // Handle fullscreen
    const toggleFullscreen = () => {
        const mapElement = document.getElementById('map-container');
        if (!isFullscreen) {
            if (mapElement?.requestFullscreen) {
                mapElement.requestFullscreen();
            }
        } else {
            if (document?.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsFullscreen(!isFullscreen);
    };

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY) {
        return <div className="p-4 text-red-500">Google Maps API key is missing</div>;
    }

    return (
        <div id="map-container" className="deliveryMapContainer relative w-full h-96">
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_KEY}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={zoom}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                    options={{
                        zoomControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {isLoaded && (
                        <>
                            {/* <Marker
                                position={sourceLocation}
                                icon={{
                                    path: "M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z",
                                    scale: 1,
                                    fillColor: '#FF0000',
                                    fillOpacity: 1,
                                    strokeWeight: 2,
                                    strokeColor: '#FFFFFF',
                                }}
                            /> */}

                            <AnimatedMapMarker color={'#FF6600'} position={sourceLocation} type='scooter' />
                            <AnimatedMapMarker color={'#004d00'} position={destinationLocation} type='pin' />

                            {/* <Marker
                                position={destinationLocation}
                                icon={{
                                    path: "M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12z",
                                    scale: 1,
                                    fillColor: '#0000FF',
                                    fillOpacity: 1,
                                    strokeWeight: 2,
                                    strokeColor: '#FFFFFF',
                                }}
                            /> */}

                            <DirectionsService
                                options={{
                                    origin: sourceLocation,
                                    destination: destinationLocation,
                                    travelMode: 'DRIVING'
                                }}
                                callback={directionsCallback}
                            />

                            {directions && (
                                <DirectionsRenderer
                                    directions={directions}
                                    options={{
                                        suppressMarkers: true,
                                        polylineOptions: {
                                            strokeColor: '#4A90E2',
                                            strokeWeight: 4,
                                        }
                                    }}
                                />
                            )}
                        </>
                    )}
                </GoogleMap>
            </LoadScript>

            <div className="deliveryMapControl absolute bottom-4 right-4 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="deliveryMapZoomIn bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
                >
                    <span className="text-xl">+</span>
                </button>
                <button
                    onClick={handleZoomOut}
                    className="deliveryMapZoomOut bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
                >
                    <span className="text-xl">−</span>
                </button>
            </div>

            <button
                onClick={toggleFullscreen}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '2rem',
                    height: '2rem',
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ffffff'}
            >
                {isFullscreen ? (
                    <Minimize2 style={{ width: '1rem', height: '1rem' }} />
                ) : (
                    <Maximize2 style={{ width: '1rem', height: '1rem' }} />
                )}
            </button>
        </div>
    );
};

export default DeliveryMap;