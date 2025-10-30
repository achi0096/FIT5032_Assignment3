<template>
  <div class="container py-3">
    <h1 class="h4 mb-3">Find Places & Get Directions</h1>

    <!-- ROW 1: Start | Destination | Buttons (alignment preserved) -->
    <div class="row g-3 align-items-end mb-1">
      <!-- START -->
      <div class="col-md-4">
        <label class="form-label mb-1" for="start">Start</label>
        <input
          id="start"
          v-model="startQuery"
          class="form-control"
          type="search"
          autocomplete="off"
          placeholder="Search start…"
          @keydown.enter.prevent="searchStart"
        />
      </div>

      <!-- DESTINATION -->
      <div class="col-md-4">
        <label class="form-label mb-1" for="dest">Destination</label>
        <input
          id="dest"
          v-model="endQuery"
          class="form-control"
          type="search"
          autocomplete="off"
          placeholder="Search destination…"
          @keydown.enter.prevent="searchEnd"
        />
      </div>

      <!-- BUTTONS -->
      <div class="col-md-4">
        <!-- keeps equal bottom alignment with inputs -->
        <label class="form-label d-block invisible mb-1">Actions</label>
        <div class="d-flex gap-2">
          <button
            type="button"
            class="btn btn-primary btn-sm px-3"
            style="height: 38px"
            @click="getRoute"
          >
            Get Directions
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary btn-sm px-3"
            style="height: 38px"
            @click="clearRoute"
          >
            Clear
          </button>
        </div>
      </div>
    </div>

    <!-- ROW 2: helper text ONLY under Start (doesn't affect row 1 alignment) -->
    <div class="row">
      <div class="col-md-4">
        <div class="form-text mt-0" id="start-hint" style="font-size: 0.9rem;">
          or
          <button
            type="button"
            class="btn btn-link p-0 align-baseline"
            @click="useMyLocation"
            aria-describedby="start-hint"
          >
            Use current location
          </button>
        </div>
      </div>
    </div>

    <!-- live trip text -->
    <div class="mb-3" v-if="tripText">
      <div class="alert alert-info" role="status" aria-live="polite">
        {{ tripText }}
      </div>
    </div>

    <!-- map -->
    <div
      ref="mapEl"
      role="region"
      aria-label="Map showing Melbourne and route results"
      style="height: 520px; border-radius: 12px; overflow: hidden"
    ></div>

    <p class="text-muted mt-2">
      Features: Location autocomplete, route visualization and trip details such as distance and estimated travel time.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

const mapEl = ref(null);
let map;
let startMarker, endMarker;
let routeSourceReady = false;

const startQuery = ref("");
const endQuery = ref("");
const startLngLat = ref(null);
const endLngLat = ref(null);
const tripText = ref("");

// ----- init map -----
onMounted(() => {
  map = new mapboxgl.Map({
    container: mapEl.value,
    style: "mapbox://styles/mapbox/streets-v12",
    center: [144.9631, -37.8136],
    zoom: 11,
  });

  map.addControl(new mapboxgl.NavigationControl(), "top-right");

  const geocoder = new MapboxGeocoder({
    accessToken: MAPBOX_TOKEN,
    mapboxgl,
    marker: false,
    placeholder: "Search anywhere…",
  });
  map.addControl(geocoder, "top-left");

  // label the injected geocoder input
  setTimeout(() => {
    const geocoderEl = document.querySelector(".mapboxgl-ctrl-geocoder input");
    if (geocoderEl) geocoderEl.setAttribute("aria-label", "Search the map");
  }, 0);

  geocoder.on("result", (e) => {
    const [lng, lat] = e.result.center;
    new mapboxgl.Marker({ color: "#6c5ce7" }).setLngLat([lng, lat]).addTo(map);
    map.flyTo({ center: [lng, lat], zoom: 13 });
  });

  map.on("load", () => {
    map.addSource("route", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });

    map.addLayer({
      id: "route-line",
      type: "line",
      source: "route",
      paint: {
        "line-width": 6,
        "line-color": "#0078ff",
        "line-opacity": 0.85,
      },
    });

    routeSourceReady = true;
  });
});

onBeforeUnmount(() => {
  if (map) map.remove();
});

// ----- helpers -----
function setStart(lngLat) {
  startLngLat.value = lngLat;
  if (startMarker) startMarker.remove();
  startMarker = new mapboxgl.Marker({ color: "#00b894" })
    .setLngLat(lngLat)
    .addTo(map);
}

function setEnd(lngLat) {
  endLngLat.value = lngLat;
  if (endMarker) endMarker.remove();
  endMarker = new mapboxgl.Marker({ color: "#d63031" })
    .setLngLat(lngLat)
    .addTo(map);
}

async function geocode(query) {
  const url = new URL(
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(query) +
      ".json"
  );
  url.searchParams.set("access_token", MAPBOX_TOKEN);
  url.searchParams.set("limit", "1");
  url.searchParams.set("country", "AU");

  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const f = data?.features?.[0];
  return f ? f.center : null;
}

async function searchStart() {
  if (!startQuery.value) return;
  const loc = await geocode(startQuery.value);
  if (loc) {
    setStart(loc);
    map.flyTo({ center: loc, zoom: 13 });
  }
}

async function searchEnd() {
  if (!endQuery.value) return;
  const loc = await geocode(endQuery.value);
  if (loc) {
    setEnd(loc);
    map.flyTo({ center: loc, zoom: 13 });
  }
}

function useMyLocation() {
  if (!navigator.geolocation)
    return alert("Geolocation not supported on this browser.");

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lngLat = [pos.coords.longitude, pos.coords.latitude];
      setStart(lngLat);
      map.flyTo({ center: lngLat, zoom: 13 });
    },
    (err) => alert("Could not get your location: " + err.message),
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// ----- routing -----
async function getRoute() {
  try {
    if (!startLngLat.value && startQuery.value) {
      const s = await geocode(startQuery.value);
      if (s) setStart(s);
    }
    if (!endLngLat.value && endQuery.value) {
      const e = await geocode(endQuery.value);
      if (e) setEnd(e);
    }

    if (!startLngLat.value || !endLngLat.value)
      return alert("Please enter both start and destination.");

    const profile = "driving";
    const url = new URL(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startLngLat.value.join(
        ","
      )};${endLngLat.value.join(",")}`
    );
    url.searchParams.set("geometries", "geojson");
    url.searchParams.set("overview", "full");
    url.searchParams.set("access_token", MAPBOX_TOKEN);

    const res = await fetch(url);
    if (!res.ok) {
      console.error("Directions API error:", await res.text());
      return alert("Directions request failed.");
    }

    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) return alert("No route found.");

    const geojson = {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: route.geometry }],
    };
    if (routeSourceReady && map.getSource("route")) {
      map.getSource("route").setData(geojson);
    }

    // fit to route
    const coords = route.geometry.coordinates;
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new mapboxgl.LngLatBounds(coords[0], coords[0])
    );
    map.fitBounds(bounds, { padding: 60 });

    const km = (route.distance / 1000).toFixed(1);
    const mins = Math.round(route.duration / 60);
    tripText.value = `Trip: ${km} km • ~${mins} min (${profile})`;
  } catch (err) {
    console.error("getRoute error:", err);
    alert("Error getting directions. Check console for details.");
  }
}

// ----- clear -----
function clearRoute() {
  tripText.value = "";
  if (routeSourceReady && map.getSource("route")) {
    map.getSource("route").setData({ type: "FeatureCollection", features: [] });
  }
  if (startMarker) startMarker.remove();
  if (endMarker) endMarker.remove();
  startMarker = null;
  endMarker = null;
  startLngLat.value = null;
  endLngLat.value = null;
}
</script>
