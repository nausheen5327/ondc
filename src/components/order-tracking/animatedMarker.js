import React from 'react';
import { Marker } from '@react-google-maps/api';

const AnimatedMapMarker = ({ position, color, type = 'pin' }) => {
  const getPinIcon = () => ({
    path: "M12 0C5.4 0 0 5.4 0 12c0 7.2 12 24 12 24s12-16.8 12-24c0-6.6-5.4-12-12-12zM12 16.5c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5 4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5z",
    scale: 1,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 2,
    strokeColor: '#FFFFFF',
    anchor: new window.google.maps.Point(12, 36)
  });

  const getMotorcycleIcon = () => ({
    path: "M23.9 11.6c-.2-.3-.5-.4-.8-.4h-1.2l-4.1-5.5C17.6 5.3 17.2 5 16.7 5h-3.4c-.4 0-.7.2-.9.5l-2.7 3.5h-1.4L7.2 7H9V5H5v2h.8l1.3 2H3.8C2.8 9 2 9.8 2 10.8V15h1c0 2.2 1.8 4 4 4s4-1.8 4-4h4c0 2.2 1.8 4 4 4s4-1.8 4-4h1v-2.8c0-.2-.1-.4-.1-.6zM7 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm5-6H7.5c-.3-1.2-1.3-2-2.5-2-.3 0-.5 0-.8.1v-.3c0-.1.1-.3.3-.3h4.1L12 11zm4 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm2.3-6h-4.6c-.3-1.2-1.3-2-2.5-2-.3 0-.5 0-.8.1L13.2 7h3.5l4.1 5.5v.5c-.3-1.2-1.3-2-2.5-2z",
    scale: 1.5,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: '#FFFFFF',
    anchor: new window.google.maps.Point(12, 12)
  });

  const [offset, setOffset] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const maxOffset = 0.0003; // Maximum distance to move

  React.useEffect(() => {
    if (type === 'motorcycle') {
      const animate = () => {
        setOffset(prev => {
          const newOffset = prev + (0.00001 * direction);
          
          if (Math.abs(newOffset) >= maxOffset) {
            setDirection(d => -d); // Reverse direction
            return maxOffset * Math.sign(newOffset);
          }
          return newOffset;
        });
      };

      const intervalId = setInterval(animate, 50);
      return () => clearInterval(intervalId);
    }
  }, [type, direction]);

  const currentPosition = React.useMemo(() => {
    if (type !== 'motorcycle') return position;
    
    return {
      lat: position.lat + offset,
      lng: position.lng
    };
  }, [position, offset, type]);

  return (
    <Marker
      position={currentPosition}
      animation={type === 'pin' ? window.google.maps.Animation.BOUNCE : null}
      icon={type === 'pin' ? getPinIcon() : getMotorcycleIcon()}
    />
  );
};

export default AnimatedMapMarker;