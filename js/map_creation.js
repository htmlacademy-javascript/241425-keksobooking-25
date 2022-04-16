import { deactivateElement, activateElement } from './form_activation.js';
import { generateCard } from './card_markup_generation.js';
import { loadMarkersData } from './api.js';
import { debounce, showErrorMessage } from './helpers.js';


const START_VIEW = {
  lat: 35.68950,
  lng: 139.69171,
};
const MAIN_MARKER_ICON_DATA = {
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
};
const SIMPLE_MARKER_ICON_DATA = {
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
};
const DEBOUNCE_DELAY = 500;

const addAdvertFormSelector = 'ad-form';
const filterFormSelector = 'map__filters';

// Forms nodes
const adFormNode = document.querySelector(`.${addAdvertFormSelector}`);
const mapFilterNode = document.querySelector(`.${filterFormSelector}`);
const mapFilters = mapFilterNode.querySelectorAll('.map__filter');
// Markers
const addressNode = adFormNode.querySelector('#address');
const template = document.querySelector('#card').content;
// Filter
const typeFilterNode = mapFilterNode.querySelector('[name="housing-type"]');
const priceFilterNode = mapFilterNode.querySelector('[name="housing-price"]');
const roomsFilterNode = mapFilterNode.querySelector('[name="housing-rooms"]');
const guestsFilterNode = mapFilterNode.querySelector('[name="housing-guests"]');
const featuresParentNode = mapFilterNode.querySelector('.map__features');
const featureFilters = featuresParentNode.querySelectorAll('[name="features"]');
const filterFields = {
  type: typeFilterNode.value,
  price: priceFilterNode.value,
  rooms: +roomsFilterNode.value,
  guests: +guestsFilterNode.value,
  featuresAmount: featuresParentNode.querySelectorAll('[name="features"]:checked').length,
};
function updateFilterFields() {
  filterFields.type = typeFilterNode.value;
  filterFields.price = priceFilterNode.value;
  filterFields.rooms = +roomsFilterNode.value;
  filterFields.guests = +guestsFilterNode.value;
  filterFields.featuresAmount = featuresParentNode.querySelectorAll('[name="features"]:checked').length;
}

let recievedMarkersData = null;

deactivateElement(addAdvertFormSelector);
deactivateElement('ad-form__slider');
deactivateElement(filterFormSelector);

const map = L.map('map-canvas')
  .on('load', () => {
    activateElement(addAdvertFormSelector);
    activateElement('ad-form__slider');
    loadMarkersData(handleMarkersData, showErrorMessage);
  })
  .setView(START_VIEW, 12);

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainMarkerIcon = L.icon(MAIN_MARKER_ICON_DATA);
const simpleMarkerIcon = L.icon(SIMPLE_MARKER_ICON_DATA);

function createMainMarker() {
  const marker = L.marker(
    {
      lat: START_VIEW.lat,
      lng: START_VIEW.lng,
    },
    {
      draggable: true,
      icon: mainMarkerIcon,
    },
  );

  marker.addTo(map);

  return marker;
}

function createSimpleMarker(item, layer = null) {
  const marker = L.marker(
    {
      lat: item.location.lat,
      lng: item.location.lng,
    },
    {
      draggable: false,
      icon: simpleMarkerIcon,
    },
  );

  const group = layer ? layer : map;
  marker.addTo(group);

  if (item.offer) {
    marker.bindPopup(generateCard(item, template));
  }
  return marker;
}

const mainMarker = createMainMarker();

mainMarker.on('moveend', (e) => {
  const { lng, lat } = e.target.getLatLng();
  addressNode.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
});

const markerGroup = L.layerGroup().addTo(map);

// Activate form and first render markers after recieving data from server
function handleMarkersData(markersData) {
  if (markersData.length === 0) {
    deactivateElement(filterFormSelector);
    return;
  }

  activateElement(filterFormSelector);

  recievedMarkersData = markersData;
  renderMarkers(recievedMarkersData, markerGroup);
}

function renderMarkers(markers = null, group = null) {
  markers = markers ? markers : recievedMarkersData;
  group = group ? group.clearLayers() : map;

  markers
    .sort(compareAdvert)
    .slice(0, 10)
    .forEach((marker) => {
      createSimpleMarker(marker, group);
    });
}

const rerenderMarkersDebounced = debounce(() => {
  renderMarkers(recievedMarkersData, markerGroup);
}, DEBOUNCE_DELAY);

[mapFilters, featureFilters].forEach((filterGroup) => {
  filterGroup.forEach((filter) => {
    filter.addEventListener('change', () => {
      updateFilterFields();

      rerenderMarkersDebounced();
    });
  });
});

function increaseRank(filterValue, offerValue, addedRank) {
  if (filterValue && offerValue && filterValue === offerValue) {
    return addedRank;
  }

  return 0;
}
function increaseRankByFeatures(filterFeaturesAmount, offerFeatures) {
  if (filterFeaturesAmount && offerFeatures) {
    if (offerFeatures.length === filterFeaturesAmount) {
      return 2;
    } else if (offerFeatures.length > filterFeaturesAmount) {
      return 1;
    }
  }

  return 0;
}
function increaseRankByPrice(filterPrice, offerPrice, addRank) {
  if (filterPrice && offerPrice) {
    if (
      offerPrice < 10000 && filterPrice === 'low' ||
      offerPrice >= 10000 && offerPrice <= 50000 && filterPrice === 'middle' ||
      offerPrice > 50000 && filterPrice === 'high'
    ) {
      return addRank;
    }
  }

  return 0;
}

function getAdvertRank({ offer }) {
  let rank = 0;

  rank += increaseRank(filterFields.type, offer.type, 15);
  rank += increaseRank(filterFields.guests, offer.guests, 10);
  rank += increaseRank(filterFields.rooms, offer.rooms, 5);
  rank += increaseRankByPrice(filterFields.price, offer.price, 20);
  rank += increaseRankByFeatures(filterFields.featuresAmount, offer.features);

  return rank;
}
function compareAdvert(advertA, advertB,) {
  const rankA = getAdvertRank(advertA);
  const rankB = getAdvertRank(advertB);

  return rankB - rankA;
}

export function setStartMainMarker() {
  mainMarker.setLatLng(START_VIEW);
}
export function closeOpenedBaloon() {
  map.closePopup();
}
