
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

    // Animate the line
    const animate = () => {
      const dashOffset = (Date.now() / 100) % 4;
      const firstValue = 2;
      const secondValue = Math.max(1, (2 - dashOffset % 2)); // Ensure second value is always positive
      
      if (map) {
        try {
          // Check if layer exists before updating
          if (map.getLayer('animated-line-layer')) {
            map.setPaintProperty(
              'animated-line-layer',
              'line-dasharray',
              [firstValue, secondValue]
            );
          }
        } catch (error) {
          console.error('Error updating animation:', error);
        }
      }
      
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
