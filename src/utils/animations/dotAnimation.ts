
import mapboxgl from 'mapbox-gl';

// Create moving dot animation along the path
export const createMovingDotAnimation = (map: mapboxgl.Map) => {
  if (!map.loaded()) {
    console.log("Map not loaded yet, delaying dot animation setup");
    return;
  }
  
  try {
    // Check if source already exists to prevent duplicates
    if (map.getSource('moving-dot-source')) {
      console.log("Moving dot source already exists");
      return;
    }
    
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
    
    console.log("Moving dot animation created successfully");
  } catch (error) {
    console.error('Error creating moving dot animation:', error);
  }
};

// Update the dot position
export const updateDotPosition = (map: mapboxgl.Map, coordinates: [number, number]) => {
  if (!map.loaded() || !map.getSource('moving-dot-source')) {
    console.log("Map or dot source not ready");
    return;
  }
  
  try {
    (map.getSource('moving-dot-source') as mapboxgl.GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: coordinates
      }
    });
  } catch (error) {
    console.error('Error updating dot position:', error);
  }
};
