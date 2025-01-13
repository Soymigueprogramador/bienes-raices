import L from 'leaflet';
import 'esri-leaflet';
import 'esri-leaflet-geocoder';

(function () {
    const lat = -34.60376;
    const lng = -58.38162;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marcar;

    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marcar = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true,
    }).addTo(mapa);

    marcar.on('moveend', async function (e) {
        const posicion = e.target.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        try {
            // Realizar la geocodificación inversa
            const resultado = await geocodeService.reverse().latlng(posicion).run();

            // Mostrar dirección obtenida
            alert(`Dirección: ${resultado.address.Match_addr}`);

            // Si deseas realizar otras operaciones con el resultado:
            console.log(resultado);
        } catch (error) {
            console.error('Error obteniendo la dirección:', error);
        }
    });
})();