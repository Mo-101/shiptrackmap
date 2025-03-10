
import mapboxgl from 'mapbox-gl';

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
        'circle-radius': 15,
        'circle-color': '#DCCC82',
        'circle-opacity': 0.6,
        'circle-opacity-transition': { duration: 1000 },
        'circle-stroke-width': 0
      }
    });
  } catch (error) {
    console.error('Error creating moving dot animation:', error);
  }
};
