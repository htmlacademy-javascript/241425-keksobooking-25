import { deactivateForms, activateForms } from './forms.js';
import { generateCard } from './cardgenerator.js';
import { loadMarkersData } from './api.js';
import { showErrorMessage } from './helpers.js';

deactivateForms();

const START_VIEW = {
  lat: 35.68950,
  lng: 139.69171,
};

const adFormNode = document.querySelector('.ad-form');
const addressNode = adFormNode.querySelector('#address');
const template = document.querySelector('#card').content;
let getMarkersData = null;

const map = L.map('map-canvas')
  .on('load', () => {
    activateForms();
    getMarkersData = loadMarkersData(handleMarkersData, showErrorMessage);
  })
  .setView(START_VIEW, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

function createMarker(markerLat, markerLng, markerIcon, isDraggable = false, baloonData = null, layer = null) {
  const marker = L.marker(
    {
      lat: markerLat,
      lng: markerLng,
    },
    {
      draggable: isDraggable,
      icon: markerIcon,
    },
  );

  const group = layer ? layer : map;
  marker.addTo(group);

  if (baloonData) {
    marker.bindPopup(generateCard(baloonData, template));
  }
  return marker;
}

const mainMarkerIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainMarker = createMarker(35.68950, 139.69171, mainMarkerIcon, true);

const markerGroup = L.layerGroup().addTo(map);

mainMarker.on('moveend', (e) => {
  const { lng, lat } = e.target.getLatLng();
  addressNode.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});


const simpleMarkerIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function handleMarkersData(markersData) {
  markersData.forEach((item) => {
    createMarker(item.location.lat, item.location.lng, simpleMarkerIcon, false, item, markerGroup);
  });
}

getMarkersData();

export function setStartMainMarker() {
  mainMarker.setLatLng(START_VIEW);
}
export function closeOpenedBaloon() {
  map.closePopup();
}
