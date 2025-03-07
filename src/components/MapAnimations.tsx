
import mapboxgl from 'mapbox-gl';

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
        'line-color': '#4FF2F8',
        'line-width': 3,
        'line-opacity': 0.8,
        'line-dasharray': [2, 1]
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

// Export the functions
export default { createLineAnimation, updateLineAnimation };
