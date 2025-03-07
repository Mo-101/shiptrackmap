
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

type AnimationProps = {
  map: mapboxgl.Map | null;
  routeProps: Record<string, any>;
};

const MapAnimations: React.FC<AnimationProps> = ({ map, routeProps }) => {
  // Track animation frames for cleanup
  const animationFrameRef = useRef<number | null>(null);
  
  // Function to animate routes with specific patterns for each shipment type
  useEffect(() => {
    const animate = () => {
      if (!map || !map.isStyleLoaded()) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Update each route type with different animations
      ['ship', 'charter', 'truck'].forEach(type => {
        if (routeProps[type]) {
          // Different speeds for different types
          const speed = type === 'ship' ? 0.2 : type === 'charter' ? 0.4 : 0.3;
          routeProps[type].dashOffset = (routeProps[type].dashOffset + speed) % 8;
          
          if (map.getLayer(`routes-${type}`)) {
            // Using setPaintProperty for 'line-dash-offset'
            (map as any).setPaintProperty(`routes-${type}`, 'line-dash-offset', 
              routeProps[type].dashOffset);
          }
        }
      });
      
      // Pulse animation for points
      const pulseSize = 5 + Math.sin(Date.now() / 500) * 5; // Pulsing radius
      if (map.getLayer('points-pulse')) {
        map.setPaintProperty('points-pulse', 'circle-radius', 
          ['case', 
            ['boolean', ['get', 'active'], false], 
            pulseSize, 
            0
          ]
        );
        map.setPaintProperty('points-pulse', 'circle-opacity', 
          ['case', 
            ['boolean', ['get', 'active'], false], 
            0.5 - Math.sin(Date.now() / 500) * 0.3, 
            0
          ]
        );
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [map, routeProps]);
  
  return null; // This is a non-visual component
};

export default MapAnimations;
