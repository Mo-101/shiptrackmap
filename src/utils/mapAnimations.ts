
import mapboxgl from 'mapbox-gl';

// Type for custom layer properties
export type CustomLayerProps = {
  dashOffset: number;
  active: boolean;
  type: 'ship' | 'charter' | 'truck';
};

export const setupRouteAnimations = (
  map: mapboxgl.Map,
  routeProps: Record<string, CustomLayerProps>,
  animationFrameRef: React.MutableRefObject<number | null>
) => {
  const animate = () => {
    if (!map || !map.isStyleLoaded()) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }
    
    // Update each route type with different animations
    if (routeProps['ship']) {
      const shipOffset = (routeProps['ship'].dashOffset + 0.2) % 8;
      routeProps['ship'].dashOffset = shipOffset;
      
      if (map.getLayer('routes-ship')) {
        map.setPaintProperty('routes-ship', 'line-dasharray', [0.5, 1, 2, 1]);
        // Using a custom property as TypeScript doesn't recognize 'line-dash-offset'
        (map as any).setPaintProperty('routes-ship', 'line-dasharray-offset', shipOffset);
      }
    }
    
    if (routeProps['charter']) {
      const charterOffset = (routeProps['charter'].dashOffset + 0.4) % 8;
      routeProps['charter'].dashOffset = charterOffset;
      
      if (map.getLayer('routes-charter')) {
        map.setPaintProperty('routes-charter', 'line-dasharray', [1, 3]);
        // Using a custom property as TypeScript doesn't recognize 'line-dash-offset'
        (map as any).setPaintProperty('routes-charter', 'line-dasharray-offset', charterOffset);
      }
    }
    
    if (routeProps['truck']) {
      const truckOffset = (routeProps['truck'].dashOffset + 0.3) % 8;
      routeProps['truck'].dashOffset = truckOffset;
      
      if (map.getLayer('routes-truck')) {
        map.setPaintProperty('routes-truck', 'line-dasharray', [0.5, 1.5]);
        // Using a custom property as TypeScript doesn't recognize 'line-dash-offset'
        (map as any).setPaintProperty('routes-truck', 'line-dasharray-offset', truckOffset);
      }
    }
    
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
};
