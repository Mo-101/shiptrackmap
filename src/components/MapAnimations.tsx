
import mapboxgl from 'mapbox-gl';
import * as turf from '@turf/turf';

// Create animated line for tracking routes
export const createLineAnimation = (map: mapboxgl.Map) => {
  try {
    map.addSource('animated-line-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [0, 0],
            [0, 0]
          ]
        }
      }
    });

    map.addLayer({
      id: 'animated-line-layer',
      type: 'line',
      source: 'animated-line-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#62F3F7',
        'line-width': 4,
        'line-opacity': 0.9,
        'line-dasharray': [2, 1]
      }
    });

    // Add glow effect for the line
    map.addLayer({
      id: 'animated-line-glow',
      type: 'line',
      source: 'animated-line-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#62F3F7',
        'line-width': 8,
        'line-opacity': 0.4,
        'line-blur': 3
      }
    });

    // Animate the line with a fixed pattern to avoid negative values
    const animate = () => {
      // Use a pattern that ensures both values remain positive
      const offset = (Date.now() / 100) % 4;
      
      map.setPaintProperty(
        'animated-line-layer',
        'line-dasharray',
        [2, Math.max(1, (2 - offset % 2))] // Ensure second value is always positive
      );
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  } catch (error) {
    console.error('Error creating line animation:', error);
  }
};

export const updateLineAnimation = (map: mapboxgl.Map, coordinates: [number, number][]) => {
  try {
    // Use type assertion to tell TypeScript that this is a GeoJSONSource
    const source = map.getSource('animated-line-source') as mapboxgl.GeoJSONSource;
    
    if (source) {
      source.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        }
      });
    }
  } catch (error) {
    console.error('Error updating line animation:', error);
  }
};

// Create moving dot animation along the path
export const createMovingDotAnimation = (map: mapboxgl.Map) => {
  try {
    // Add a source for the moving dot
    map.addSource('moving-dot-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [0, 0]
        }
      }
    });

    // Add the moving dot layer
    map.addLayer({
      id: 'moving-dot',
      type: 'circle',
      source: 'moving-dot-source',
      paint: {
        'circle-radius': 7,
        'circle-color': '#DCCC82',
        'circle-opacity': 0.9,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    });

    // Add a pulsing effect for the dot
    map.addLayer({
      id: 'moving-dot-pulse',
      type: 'circle',
      source: 'moving-dot-source',
      paint: {
        'circle-radius': ['interpolate', ['linear'], ['get', 'pulse', ['at', 0, ['array', ['*', ['%', ['/'], 2], 15]]]], 0, 7, 1, 22],
        'circle-color': '#DCCC82',
        'circle-opacity': ['interpolate', ['linear'], ['get', 'pulse', ['at', 0, ['array', ['*', ['%', ['/'], 2], 0.6]]]], 0, 0.6, 1, 0],
        'circle-stroke-width': 0
      }
    });
  } catch (error) {
    console.error('Error creating moving dot animation:', error);
  }
};

export const animateShipmentRoute = (map: mapboxgl.Map, route: [number, number][], duration: number = 10000) => {
  try {
    if (!map.getSource('animated-line-source') || !map.getSource('moving-dot-source')) {
      console.error('Animation sources not initialized');
      return;
    }

    // Set the line data
    updateLineAnimation(map, route);

    // Create animation for the dot
    let start = 0;
    const lineSource = map.getSource('animated-line-source') as mapboxgl.GeoJSONSource;
    const dotSource = map.getSource('moving-dot-source') as mapboxgl.GeoJSONSource;
    
    // Create a feature for the line to calculate distance along
    const line = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    } as turf.Feature<turf.LineString>;
    
    // Get the total length of the line
    const lineDistance = turf.length(line, { units: 'kilometers' });
    
    function animate(timestamp: number) {
      if (!start) start = timestamp;
      // Calculate progress as a percentage
      const progress = Math.min((timestamp - start) / duration, 1);
      
      // Calculate distance along the line
      const alongPath = turf.along(line, lineDistance * progress, { units: 'kilometers' });
      
      // Update the dot position
      dotSource.setData(alongPath);
      
      // Continue the animation if not complete
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    // Start the animation
    requestAnimationFrame(animate);
  } catch (error) {
    console.error('Error animating route:', error);
  }
};

// Export the functions
export default { createLineAnimation, updateLineAnimation, createMovingDotAnimation, animateShipmentRoute };
