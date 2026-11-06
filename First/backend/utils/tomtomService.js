
const TOMTOM_BASE = "https://api.tomtom.com";

// ============================================
// CONFIGURATION
// ============================================

function getApiKey() {
  const key = process.env.TOMTOM_API_KEY;

  if (!key) {
    throw new Error("TOMTOM_API_KEY is missing from backend/.env");
  }

  return key;
}

// ============================================
// GENERIC JSON REQUEST
// ============================================

async function tomtomRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(25000),
    headers: {
      "TomTom-Api-Key": getApiKey(),
      Accept: "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.detailedError?.message ||
      data?.message ||
      data?.error?.description ||
      `TomTom API error: ${response.status}`;

    console.error("TomTom API failure:", {
      status: response.status,
      message,
      data,
    });

    throw new Error(message);
  }

  return data;
}

// ============================================
// 1. HOSPITAL SEARCH
// Places Search API v3
// ============================================

export async function geocodeLocation(query) {
  if (!query || typeof query !== "string") {
    throw new Error("Hospital name is required.");
  }

  const url = `${TOMTOM_BASE}/maps/orbis/places/discover`;

  const data = await tomtomRequest(url, {
    method: "POST",
    headers: {
      "TomTom-Api-Version": "3",
      "Content-Type": "application/json",
      "Attributes": "results",
    },
    body: JSON.stringify({
      query: query.trim(),
      maxResults: 20,
      geopoliticalView: "IN",
      filters: {
        types: ["poi"],
        countryCodesIso2: ["IN"],
      },
    }),
  });

  const results = data.results || [];

  if (!results.length) {
    throw new Error(`No location found for: ${query}`);
  }

  const normalizedQuery = query.toLowerCase();

  const cityMatch = normalizedQuery.match(
    /\b(delhi|mumbai|bengaluru|bangalore|ranchi|patna|kolkata|hyderabad|chennai|pune)\b/
  );

  const expectedCity = cityMatch?.[1];

  const keywords = normalizedQuery
    .replace(/[,.]/g, " ")
    .split(/\s+/)
    .filter((word) =>
      word.length > 2 &&
      !["hospital", "hospitals", "india", "the"].includes(word)
    );

  const candidates = results
    .filter((item) => {
      const coordinates = item.position?.coordinates;

      return (
        Array.isArray(coordinates) &&
        coordinates.length >= 2 &&
        Number.isFinite(Number(coordinates[0])) &&
        Number.isFinite(Number(coordinates[1])) &&
        item.address?.countryCodeIso2?.toUpperCase() === "IN"
      );
    })
    .map((item) => {
      const address = item.address || {};
      const title = (item.title || "").toLowerCase();

      const cityText = [
        address.municipality,
        address.municipalitySubdivision,
        address.countrySubdivision,
      ].join(" ").toLowerCase();

      let score = 0;

      if (expectedCity) {
        score += cityText.includes(expectedCity) ? 100 : -100;
      }

      for (const keyword of keywords) {
        if (title.includes(keyword)) score += 20;
      }

      return { item, score, cityText };
    })
    .sort((a, b) => b.score - a.score);

  if (!candidates.length) {
    throw new Error(`No valid Indian location found for: ${query}`);
  }

  const selected = candidates[0];

  if (
    expectedCity &&
    !selected.cityText.includes(expectedCity)
  ) {
    throw new Error(
      `Could not verify ${query} in ${expectedCity}. Please enter a complete address.`
    );
  }

  const title = selected.item.title || "";
  const normalizedTitle = title.toLowerCase();

  const hasNameMatch = keywords.some(
    (keyword) => normalizedTitle.includes(keyword)
  );

  if (!hasNameMatch) {
    throw new Error(
      `Could not confidently match hospital: ${query}`
    );
  }

  const [longitude, latitude] =
    selected.item.position.coordinates;

  const location = {
    title,
    latitude: Number(latitude),
    longitude: Number(longitude),
    address: selected.item.address,
  };

  console.log("Hospital resolved:", {
    query,
    ...location,
  });

  return location;
}

// ============================================
// 2. TRAFFIC-AWARE ROUTING
// Orbis Routing API v3
// ============================================

export async function calculateTomTomRoutes(start, end) {
  console.log("Calculating route:", { start, end });

  const [origin, destination] = await Promise.all([
    geocodeLocation(start),
    geocodeLocation(end),
  ]);

  const distanceBetween = (a, b) => {
    const rad = (value) => value * Math.PI / 180;

    const dLat = rad(b.latitude - a.latitude);
    const dLon = rad(b.longitude - a.longitude);

    const lat1 = rad(a.latitude);
    const lat2 = rad(b.latitude);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2;

    return 6371 * 2 *
      Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  };

  if (
    /\bdelhi\b/i.test(start) &&
    /\bdelhi\b/i.test(end) &&
    distanceBetween(origin, destination) > 80
  ) {
    throw new Error(
      "Hospital locations do not appear to be in the same Delhi area. Verify the selected hospitals."
    );
  }

  const url =
    `${TOMTOM_BASE}/maps/orbis/routing/routes/calculate?apiVersion=3`;

  const payload = {
    routePlanningLocations: {
      origin: {
        type: "Point",
        coordinates: [
          origin.longitude,
          origin.latitude,
        ],
      },
      destination: {
        type: "Point",
        coordinates: [
          destination.longitude,
          destination.latitude,
        ],
      },
    },

    departureDateTime: "now",
    traffic: "live",
    routeType: "fast",
    maxPathAlternativeRoutes: 2,
  };

  const data = await tomtomRequest(url, {
    method: "POST",
    headers: {
      "TomTom-Api-Version": "3",
      "Content-Type": "application/json",
      "Attributes": "routes",
    },
    body: JSON.stringify(payload),
  });

  if (!data.routes?.length) {
    throw new Error("TomTom returned no routes.");
  }

  const routes = data.routes.map((route, index) => {
    const summary = route.summary || {};

    // Geometry is GeoJSON [longitude, latitude].
    const coordinates = (route.legs || []).flatMap(
      (leg) => leg.path?.coordinates || []
    );

    if (coordinates.length < 2) {
      throw new Error(`Invalid geometry for route ${index + 1}`);
    }

    return {
      id: index,

      coordinates: coordinates.map(
        ([longitude, latitude]) => [
          latitude,
          longitude,
        ]
      ),

      distanceMeters: summary.lengthInMeters || 0,

      durationSeconds:
        summary.travelDurationInSeconds || 0,

      trafficDelaySeconds:
        summary.trafficDelayDurationInSeconds || 0,

      trafficLengthMeters:
        summary.trafficLengthInMeters || 0,

      distanceKm: Number(
        ((summary.lengthInMeters || 0) / 1000).toFixed(1)
      ),

      durationMinutes: Math.round(
        (summary.travelDurationInSeconds || 0) / 60
      ),

      trafficDelayMinutes: Math.round(
        (summary.trafficDelayDurationInSeconds || 0) / 60
      ),
    };
  });

  return {
    origin,
    destination,
    routes,
    provider: "TomTom",
    trafficAware: true,
    calculatedAt: new Date().toISOString(),
  };
}

// ============================================
// 3. TRAFFIC FLOW / INCIDENT TILES
// Orbis Traffic API v2
// ============================================

export async function getTrafficTile(type, z, x, y) {
  const endpoints = {
    flow: "flow",
    incidents: "incidents",
  };

  if (!endpoints[type]) {
    throw new Error("Invalid traffic layer type.");
  }

  const zoom = Number(z);
  const tileX = Number(x);
  const tileY = Number(y);

  if (
    ![zoom, tileX, tileY].every(Number.isInteger) ||
    zoom < 0 ||
    zoom > 22 ||
    tileX < 0 ||
    tileY < 0 ||
    tileX >= 2 ** zoom ||
    tileY >= 2 ** zoom
  ) {
    throw new Error("Invalid traffic tile coordinates.");
  }

  const url = new URL(
    `${TOMTOM_BASE}/maps/orbis/traffic/${endpoints[type]}/raster/tile/${zoom}/${tileX}/${tileY}`
  );

  url.searchParams.set("apiVersion", "2");
  url.searchParams.set("style", "light");
  url.searchParams.set("tileSize", "256");

  const response = await fetch(url.toString(), {
    headers: {
      "TomTom-Api-Key": getApiKey(),
      "TomTom-Api-Version": "2",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("TomTom traffic tile failure:", {
      type,
      status: response.status,
      error: errorText,
    });

    throw new Error(
      `Traffic tile API returned HTTP ${response.status}`
    );
  }

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType:
      response.headers.get("content-type") || "image/png",
  };
}
