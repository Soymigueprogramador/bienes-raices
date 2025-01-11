import L from 'leaflet';
import 'esri-leaflet';
import 'esri-leaflet-geocoder';

(function() {
    const lat = -34.60376;
    const lng = -58.38162;
    const mapa = L.map('mapa').setView([lat, lng], 16);
    let marcar;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    marcar = new L.marker([lat, lng], { 
        draggable: true,
        autoPan: true,
    }).addTo(mapa);

    marcar.on('moveend', async function(e) {
        const posicion = e.target.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        const geocodificador = L.esri.Geocoding.geocodeService();

        try {
            const resultado = await geocodificador.reverse().latlng(posicion).run();
            alert(`Dirección: ${resultado.address.Match_addr}`);
        } catch (error) {
            console.error('Error obteniendo la dirección:', error);
        };

        // Mostrar la direccion con el nombre de las calles en el mapa. 
        
    });
})();
