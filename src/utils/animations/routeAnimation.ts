
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';
import { updateLineAnimation } from './lineAnimation';

export const animateShipmentRoute = (map: mapboxgl.Map, route: [number, number][], duration: number = 10000): number => {
  try {
    if (!map.getSource('animated-line-source') || !map.getSource('moving-dot-source')) {
      console.error('Animation sources not initialized');
      return 0; // Return a number instead of void
    }

    // Set the line data
    updateLineAnimation(map, route);

    // Create animation for the dot
    let start = 0;
    const lineSource = map.getSource('animated-line-source') as mapboxgl.GeoJSONSource;
    const dotSource = map.getSource('moving-dot-source') as mapboxgl.GeoJSONSource;
    
    // Create a feature for the line to calculate distance along
    // Fix: Use turf.lineString and type assertion for proper typing
    const line = turf.lineString(route);
    
    // Get the total length of the line
    const lineDistance = turf.length(line, { units: 'kilometers' });
    
    function animate(timestamp: number) {
      if (!start) start = timestamp;
      // Calculate progress as a percentage
      const progress = Math.min((timestamp - start) / duration, 1);
      
      // Calculate distance along the line
      const alongPath = turf.along(line, lineDistance * progress, { units: 'kilometers' });
      
      // Update the dot position
      if (dotSource) {
        dotSource.setData(alongPath);
      }
      
      // Continue the animation if not complete
      if (progress < 1) {
        return requestAnimationFrame(animate);
      }
      
      return 0;
    }
    
    // Start the animation and return the animation frame ID
    return requestAnimationFrame(animate);
  } catch (error) {
    console.error('Error animating route:', error);
    return 0; // Return a number instead of void in case of error
  }
};
