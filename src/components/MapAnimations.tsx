
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

type AnimationProps = {
  map: mapboxgl.Map | null;
  routeProps: Record<string, any>;
};

const MapAnimations: React.FC<AnimationProps> = ({ map, routeProps }) => {
  // Track animation frames for cleanup
  const animationFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  
  // Function to animate routes with specific patterns for each shipment type
  useEffect(() => {
    // Initialize animation parameters for each route type
    const animationParams = {
      ship: { dashOffset: 0, speed: 0.2 },
      charter: { dashOffset: 0, speed: 0.4 },
      truck: { dashOffset: 0, speed: 0.3 }
    };
    
    const animate = (timestamp: number) => {
      if (!map || !map.isStyleLoaded()) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      
      // Calculate delta time for smooth animations regardless of frame rate
      if (!lastTimestampRef.current) {
        lastTimestampRef.current = timestamp;
      }
      
      const deltaTime = (timestamp - lastTimestampRef.current) / 16; // normalize to ~60fps
      lastTimestampRef.current = timestamp;
      
      // Update each route type with different animations
      ['ship', 'charter', 'truck'].forEach(type => {
        // Different speeds for different types (smoothed with deltaTime)
        animationParams[type as keyof typeof animationParams].dashOffset += 
          animationParams[type as keyof typeof animationParams].speed * deltaTime * 0.05;
        
        if (map.getLayer(`routes-${type}`)) {
          // Using setPaintProperty for 'line-dash-offset'
          map.setPaintProperty(
            `routes-${type}`, 
            'line-dash-offset', 
            animationParams[type as keyof typeof animationParams].dashOffset % 8
          );
        }
      });
      
      // Pulse animation for points - smoother sine wave
      const pulseTime = timestamp / 600;
      const pulseSize = 10 + Math.sin(pulseTime) * 5; // Pulsing radius
      const pulseOpacity = 0.5 - Math.abs(Math.sin(pulseTime)) * 0.3;
      
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
            pulseOpacity, 
            0
          ]
        );
      }
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [map]);
  
  return null; // This is a non-visual component
};

export default MapAnimations;
