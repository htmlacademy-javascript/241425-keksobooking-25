import { deactivateForms, activateForms } from './forms.js';
import { generateData } from './datagenerator.js';
import { generateCard } from './cardgenerator.js';

deactivateForms();

const AMOUNT_OF_CARDS = 10;
const adForm = document.querySelector('.ad-form');
const address = adForm.querySelector('#address');
const template = document.querySelector('#card').content;

const map = L.map('map-canvas')
  .on('load', () => {
    activateForms();
  })
  .setView({
    lat: 35.68950,
    lng: 139.69171,
  }, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);


function createMarker(markerLat, markerLng, markerIcon, isDraggable = false, baloonData = null) {
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

  marker.addTo(map);

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

mainMarker.on('moveend', (e) => {
  const { lng, lat } = e.target.getLatLng();
  address.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});


const simpleMarkerIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const markersData = generateData(AMOUNT_OF_CARDS);
markersData.forEach((item) => {
  createMarker(item.location.lat, item.location.lng, simpleMarkerIcon, false, item);
});
