/**
 * REVA Skin & Hair Clinic — Interactive multi-location map (Leaflet).
 * Renders one marker per clinic branch with a details popup, and lets
 * users jump to a branch from the accompanying location list.
 */
(function () {
  'use strict';

  const CLINICS = [
    {
      id: 'reva-sorakhutte',
      name: 'REVA Sorakhutte',
      address: 'Nayabazaar-17, Kathmandu 44600',
      phone: '+977 9749717175',
      phoneHref: 'tel:+9779749717175',
      lat: 27.715896,
      lng: 85.303762,
      hours: 'Mon–Sat 9:00 AM – 6:00 PM',
    },
    {
      id: 'reva-kamalpokhari',
      name: 'REVA Kamalpokhari',
      address: 'Kamalpokhari, Kathmandu 44600',
      phone: '+977 9749717175',
      phoneHref: 'tel:+9779749717175',
      lat: 27.710288, 
      lng: 85.327975,
      hours: 'Mon–Sat 9:00 AM – 6:00 PM',
    },
  ];

  const mapEl = document.getElementById('clinicMap');
  if (!mapEl || typeof L === 'undefined') return;

  const markerIcon = L.icon({
    iconUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const map = L.map(mapEl, { scrollWheelZoom: false }).setView([27.7065, 85.315], 12);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on('click', () => {
    map.scrollWheelZoom.enable();
  });
  map.on('mouseout', () => {
    map.scrollWheelZoom.disable();
  });

  const markers = {};
  const buttons = {};

  CLINICS.forEach((clinic) => {
    const popupContent = `
      <div class="map-popup">
        <strong class="map-popup__name">${clinic.name}</strong>
        <span class="map-popup__address">${clinic.address}</span>
        <a class="map-popup__phone" href="${clinic.phoneHref}">${clinic.phone}</a>
        <span class="map-popup__hours">${clinic.hours}</span>
      </div>`;

    const marker = L.marker([clinic.lat, clinic.lng], { icon: markerIcon })
      .addTo(map)
      .bindPopup(popupContent, { closeButton: true });

    markers[clinic.id] = marker;
  });

  const clinicButtons = document.querySelectorAll('.location-btn');
  clinicButtons.forEach((btn) => {
    const id = btn.dataset.loc;
    buttons[id] = btn;

    btn.addEventListener('click', () => {
      const clinic = CLINICS.find((c) => c.id === id);
      if (!clinic) return;

      map.flyTo([clinic.lat, clinic.lng], 15, { duration: 1.1 });
      setTimeout(() => markers[id].openPopup(), 650);

      clinicButtons.forEach((b) => {
        b.setAttribute('aria-pressed', String(b === btn));
        b.classList.toggle('is-active', b === btn);
      });
    });
  });

  buttons['reva-main'] && buttons['reva-main'].classList.add('is-active');
})();