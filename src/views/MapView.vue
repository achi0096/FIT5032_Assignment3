<template>
  <div class="container py-3">
    <h3 class="mb-3">Find Places & Get Directions</h3>

    <!-- visible warning if token missing -->
    <div v-if="!MAPBOX_TOKEN" class="alert alert-warning">
      Map unavailable: missing Mapbox token in this build.
    </div>

    <div class="row g-3 mb-3 align-items-end">
      <div class="col-md-4">
        <label class="form-label">Start</label>
        <input
          v-model="startQuery"
          class="form-control"
          placeholder="Search start…"
          @keydown.enter.prevent="searchStart"
        />
        <small class="text-muted d-block">
          or
          <button class="btn btn-link p-0" @click="useMyLocation">
            Use my location
          </button>
        </small>
      </div>

      <div class="col-md-4">
        <label class="form-label">Destination</label>
        <input
          v-model="endQuery"
          class="form-control"
          placeholder="Search destination…"
          @keydown.enter.prevent="searchEnd"
        />
      </div>

      <div class="col-md-4">
        <div class="d-flex gap-2">
          <button class="btn btn-primary flex-fill" @click="getRoute">
            Get Directions
          </button>
          <button class="btn btn-outline-secondary" @click="clearRoute">
            Clear
          </button>
        </div>
      </div>
    </div>

    <div class="mb-3" v-if="tripText">
      <div class="alert alert-info">{{ tripText }}</div>
    </div>

    <div
      ref="mapEl"
      style="height:520px;border-radius:12px;overflow:hidden;border:1px solid #ccc;background:#eef"
    ></div>

    <p class="text-muted mt-2">
      Features: place search (autocomplete), route drawing, trip distance & ETA.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
mapboxgl.accessToken = MAPBOX_TOKEN;

// 🔎 expose token to window for debugging
window.__VITE_MAPBOX_TOKEN__ = MAPBOX_TOKEN;
console.log("[MapView] token present?", !!MAPBOX_TOKEN, MAPBOX_TOKEN?.slice(0, 8) + "…");

const mapEl = ref(null);
let map;
let startMarker, endMarker;
let routeSourceReady = false;

const startQuery = ref("");
const endQuery = ref("");
const startLngLat = ref(null);
const endLngLat = ref(null);
const tripText = ref("");

// ---------- Initialize Map ----------
onMounted(() => {
  console.log("[MapView] onMounted fired");
  if (!MAPBOX_TOKEN) {
    console.warn("[MapView] Missing Mapbox token, map not initialized");
    return;
  }

  try {
    map = new mapboxgl.Map({
      container: mapEl.value,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [144.9631, -37.8136], // Melbourne CBD
      zoom: 11,
    });
    console.log("[MapView] map constructed");

    map.addControl(new mapboxgl.NavigationControl(), "top-right");

    const geocoder = new MapboxGeocoder({
      accessToken: MAPBOX_TOKEN,
      mapboxgl,
      marker: false,
      placeholder: "Search anywhere…",
    });
    map.addControl(geocoder, "top-left");
    console.log("[MapView] geocoder control added");

    geocoder.on("result", (e) => {
      const [lng, lat] = e.result.center;
      new mapboxgl.Marker({ color: "#6c5ce7" })
        .setLngLat([lng, lat])
        .addTo(map);
      map.flyTo({ center: [lng, lat], zoom: 13 });
      console.log("[MapView] geocoder result:", e.result.place_name);
    });

    map.on("load", () => {
      console.log("[MapView] map load event");
      if (!map.getSource("route")) {
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
      }
      routeSourceReady = true;
      console.log("[MapView] route source ready");
    });

    map.on("error", (e) => {
      console.error("[MapView] map error", e && e.error ? e.error : e);
    });
  } catch (err) {
    console.error("[MapView] map initialization failed", err);
  }
});

onBeforeUnmount(() => {
  if (map) map.remove();
});

// ---------- Utility functions ----------
function setStart(lngLat) {
  console.log("[MapView] setStart", lngLat);
  startLngLat.value = lngLat;
  if (startMarker) startMarker.remove();
  startMarker = new mapboxgl.Marker({ color: "#00b894" })
    .setLngLat(lngLat)
    .addTo(map);
}

function setEnd(lngLat) {
  console.log("[MapView] setEnd", lngLat);
  endLngLat.value = lngLat;
  if (endMarker) endMarker.remove();
  endMarker = new mapboxgl.Marker({ color: "#d63031" })
    .setLngLat(lngLat)
    .addTo(map);
}

async function geocode(query) {
  console.log("[MapView] geocode query:", query);
  const url = new URL(
    "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
      encodeURIComponent(query) +
      ".json"
  );
  url.searchParams.set("access_token", MAPBOX_TOKEN);
  url.searchParams.set("limit", "1");
  url.searchParams.set("country", "AU");

  const res = await fetch(url);
  if (!res.ok) {
    console.error("[MapView] geocode failed:", res.status);
    return null;
  }
  const data = await res.json();
  const f = data?.features?.[0];
  console.log("[MapView] geocode result:", f?.place_name);
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
      console.log("[MapView] my location", lngLat);
      setStart(lngLat);
      map.flyTo({ center: lngLat, zoom: 13 });
    },
    (err) => alert("Could not get your location: " + err.message),
    { enableHighAccuracy: true, timeout: 8000 }
  );
}

// ---------- MAIN: Get route ----------
async function getRoute() {
  try {
    console.log("[MapView] getRoute clicked");
    if (!startLngLat.value && startQuery.value) {
      const s = await geocode(startQuery.value);
      if (s) setStart(s);
    }
    if (!endLngLat.value && endQuery.value) {
      const e = await geocode(endQuery.value);
      if (e) setEnd(e);
    }

    if (!startLngLat.value || !endLngLat.value) {
      console.warn("[MapView] missing start or end");
      return alert("Please enter both start and destination.");
    }

    const profile = "driving";
    const url = new URL(
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${startLngLat.value.join(
        ","
      )};${endLngLat.value.join(",")}`
    );
    url.searchParams.set("geometries", "geojson");
    url.searchParams.set("overview", "full");
    url.searchParams.set("access_token", MAPBOX_TOKEN);
    console.log("[MapView] directions request:", url.toString());

    const res = await fetch(url);
    if (!res.ok) {
      const msg = await res.text();
      console.error("[MapView] Directions API error:", msg);
      return alert("Directions request failed.");
    }

    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) {
      console.warn("[MapView] No route found");
      return alert("No route found.");
    }

    const geojson = {
      type: "FeatureCollection",
      features: [{ type: "Feature", geometry: route.geometry }],
    };

    if (routeSourceReady && map.getSource("route")) {
      map.getSource("route").setData(geojson);
      console.log("[MapView] route drawn");
    }

    // Fit map to route
    const coords = route.geometry.coordinates;
    const bounds = coords.reduce(
      (b, c) => b.extend(c),
      new mapboxgl.LngLatBounds(coords[0], coords[0])
    );
    map.fitBounds(bounds, { padding: 60 });

    // Display distance & time
    const km = (route.distance / 1000).toFixed(1);
    const mins = Math.round(route.duration / 60);
    tripText.value = `Trip: ${km} km • ~${mins} min (${profile})`;
    console.log("[MapView] trip info:", tripText.value);
  } catch (err) {
    console.error("[MapView] getRoute error:", err);
    alert("Error getting directions. Check console for details.");
  }
}

// ---------- Clear map ----------
function clearRoute() {
  console.log("[MapView] clearRoute");
  tripText.value = "";
  if (routeSourceReady && map.getSource("route")) {
    map.getSource("route").setData({
      type: "FeatureCollection",
      features: [],
    });
  }
  if (startMarker) startMarker.remove();
  if (endMarker) endMarker.remove();
  startMarker = null;
  endMarker = null;
  startLngLat.value = null;
  endLngLat.value = null;
}
</script>
