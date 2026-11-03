(() => {
  const mapElement = document.getElementById("clinic-map");
  const statusElement = document.getElementById("clinic-map-status");
  const locateButton = document.getElementById("clinic-map-locate-btn");
  const centersContainer = document.querySelector(".lg\\:col-span-5 .flex-col.gap-space-xs");

  if (!mapElement) return;

  // Ubicación por defecto global (puedes dejar una central o neutra, ej. Madrid o coordenadas globales)
  const defaultLocation = [40.4168, -3.7038]; 
  
  if (!window.L) {
    if (statusElement) {
      statusElement.textContent = "No se pudo cargar el mapa.";
    }
    return;
  }

  const map = window.L.map(mapElement).setView(defaultLocation, 12);
  window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let userMarker = null;
  let clinicMarkersGroup = window.L.layerGroup().addTo(map);

  // Función para buscar centros médicos cercanos usando Overpass API (Sin base de datos)
  async function buscarCentrosCercanos(lat, lng) {
    clinicMarkersGroup.clearLayers();

    const query = `
      [out:json];
      (
        node["amenity"="clinic"](around:5000, ${lat}, ${lng});
        node["amenity"="hospital"](around:5000, ${lat}, ${lng});
        node["healthcare"](around:5000, ${lat}, ${lng});
      );
      out body 5;
    `;

    const url = "https://overpass-api.de/api/interpreter?data=" + encodeURIComponent(query);

    try {
      const response = await fetch(url);
      const data = await response.json();
      const centros = data.elements.filter(e => e.lat && e.lon);

      if (centros.length > 0 && centersContainer) {
        // Limpiamos la lista estática anterior y ponemos los resultados reales encontrados
        centersContainer.innerHTML = "";

        centros.forEach((centro, index) => {
          const nombre = centro.tags.name || `Centro de Salud #${index + 1}`;
          const tipo = centro.tags.amenity === "hospital" ? "Hospital" : "Centro de Salud / Clínica";

          // Añadir pin al mapa
          window.L.marker([centro.lat, centro.lon])
            .addTo(clinicMarkersGroup)
            .bindPopup(`<b>${nombre}</b><br>${tipo}`);

          // Insertar en tu HTML manteniendo las clases de Tailwind originales
          const itemHTML = `
            <div class="p-space-sm rounded-lg bg-surface-container-low flex items-start justify-between gap-space-sm hover:bg-surface-container transition-colors">
              <div>
                <h4 class="font-label-md text-label-md text-on-surface font-semibold">${nombre}</h4>
                <p class="font-label-sm text-label-sm text-on-surface-variant">${tipo} verificado en tu zona</p>
                <div class="flex items-center gap-space-xs mt-1 font-label-sm text-label-sm text-secondary">
                  <span class="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Disponible en tu área</span>
                </div>
              </div>
              <a class="p-space-xs text-on-surface-variant hover:text-primary transition-colors" 
                 href="https://www.openstreetmap.org/?mlat=${centro.lat}&mlon=${centro.lon}#map=18/${centro.lat}/${centro.lon}" 
                 target="_blank" 
                 title="Ver ruta">
                <span class="material-symbols-outlined text-[20px]">directions</span>
              </a>
            </div>
          `;
          centersContainer.innerHTML += itemHTML;
        });
      }
    } catch (err) {
      console.error("Error buscando centros en la red:", err);
    }
  }

  function showDefaultLocation(message) {
    map.setView(defaultLocation, 12);
    if (statusElement) {
      statusElement.textContent = message;
    }
    // Buscar también usando la ubicación por defecto para que no se quede vacío
    buscarCentrosCercanos(defaultLocation[0], defaultLocation[1]);
  }

  function showUserLocation(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const userCoordinates = [latitude, longitude];

    map.setView(userCoordinates, 14);
    if (userMarker) {
      userMarker.setLatLng(userCoordinates);
    } else {
      userMarker = window.L.marker(userCoordinates, {
        title: "Tu ubicación",
      }).addTo(map);
    }
    userMarker.bindPopup("Estás aquí").openPopup();
    
    if (statusElement) {
      statusElement.textContent = "Mostrando tu ubicación";
    }

    // Buscamos centros médicos reales basados en la posición GPS del usuario
    buscarCentrosCercanos(latitude, longitude);
  }

  function locateUser() {
    if (!navigator.geolocation) {
      showDefaultLocation("Ubicación no disponible.");
      return;
    }

    if (statusElement) {
      statusElement.textContent = "Buscando tu ubicación...";
    }
    navigator.geolocation.getCurrentPosition(
      showUserLocation,
      () => showDefaultLocation("Ubicación denegada. Usando ubicación predeterminada."),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }

  locateButton?.addEventListener("click", locateUser);
  locateUser();
})();