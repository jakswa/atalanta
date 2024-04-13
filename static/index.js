onReady(init);

async function init() {
  let map = initMap();

  let trkpts = (await routeXML()).querySelectorAll('trkpt');
  let routeCoords = routeCoordinates(trkpts);
  map.addSource('route-line', { type: 'geojson', data: routeData(routeCoords) });
  map.addLayer(routeLayer());
  map.fitBounds([routeCoords[0], routeCoords[routeCoords.length - 1]], { padding: 60 });
}

function routeLayer() {
  return {
    id: 'route-layer',
    type: 'line',
    source: 'route-line',
    layout: {
      'line-join': 'round',
      'line-cap': 'round'
    },
    paint: {
      'line-color': '#00FF00',
      'line-width': 6,
      
    }
  };
}

function routeCoordinates(trkpts) {
  let coordinates = [];
  for (let i = 0; i < trkpts.length; i++) {
    let trkpt = trkpts[i];
    coordinates.push([
      parseFloat(trkpt.getAttribute('lon')),
      parseFloat(trkpt.getAttribute('lat'))
    ]);
  }
  return coordinates;
}

function routeData(coordinates) {
  return {
    type: 'FeatureCollection',
    features: [{
      geometry: {
        type: 'LineString',
        coordinates
      }
    }]
  };
}

async function routeXML() {
  return await fetch('/route.gpx')
    .then((res) => res.text())
    .then((xml) => new DOMParser().parseFromString(xml, 'application/xml'));
}

function initMap() {
  return new maplibregl.Map({
    container: 'map',
    //style: 'https://demotiles.maplibre.org/style.json', // stylesheet location
    style: {
      version: 8,
      sources: {
        'osm': {
          type: 'raster',
          tiles: [
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
          ],
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          tileSize: 256
        }
      },
      layers: [
        {
          id: 'osm',
          type: 'raster',
          source: 'osm',
          minzoom: 0,
          paint: { "raster-opacity": 0.5 },
          maxzoom: 22
        }
      ]
    },
    center: [-84.391088,33.7536914], // starting position [lng, lat]
    zoom: 9 // starting zoom
  });
}

function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

