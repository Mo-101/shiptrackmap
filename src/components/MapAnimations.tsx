import mapboxgl from 'mapbox-gl';

// Fix the TypeScript error by changing the property name
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
        // Change from 'line-dash-offset' to 'line-dasharray' which is supported 
        'line-dasharray': [2, 1]
      }
    });

    // Animate the line
    let counter = 0;
    setInterval(() => {
      counter = (counter + 1) % 200;
      map.setPaintProperty(
        'animated-line-layer',
        'line-dasharray',
        [counter / 2, 2 - (counter / 2)]
      );
    }, 20);
  } catch (error) {
    console.error('Error creating line animation:', error);
  }
};

export const updateLineAnimation = (map: mapboxgl.Map, coordinates: [number, number][]) => {
  try {
    map.getSource('animated-line-source')?.setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates
      }
    });
  } catch (error) {
    console.error('Error updating line animation:', error);
  }
};
