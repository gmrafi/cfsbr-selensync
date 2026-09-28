import * as Astronomy from 'astronomy-engine';

/**
 * Lunar topocentric coordinate representation (Selenographic degrees)
 */
export interface LunarCoordinates {
  latitude: number;   // Degrees (-90 to +90, negative for South Pole)
  longitude: number;  // Degrees (-180 to +180 or 0 to 360)
  altitudeMeters?: number; // Height above lunar reference sphere in meters (optional)
  name?: string;
}

/**
 * Celestial body angular position relative to the local lunar horizon
 */
export interface LocalHorizontalPosition {
  altitudeDegrees: number; // Elevation angle in degrees (-90 to +90)
  azimuthDegrees: number;  // Azimuth angle from North (0° to 360°)
  isAboveHorizon: boolean; // True if altitudeDegrees > 0
  distanceKm: number;      // Distance from lunar observer to body center
}

/**
 * Full lunar topocentric calculation result for a given instant
 */
export interface CelestialPositionResult {
  timestamp: string;
  lunarLocation: LunarCoordinates;
  sun: LocalHorizontalPosition;
  earth: LocalHorizontalPosition;
  isDirectToEarthAvailable: boolean; // True if Earth elevation > 0°
  solarIlluminationFraction: number;  // Estimated sunlight fraction (0.0 to 1.0)
  subSolarPoint: { latitude: number; longitude: number };
  subEarthPoint: { latitude: number; longitude: number };
}

/**
 * Converts degrees to radians
 */
function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 */
function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Calculates topocentric Altitude (elevation) and Azimuth of a celestial target given its sub-body coordinates
 * on a spherical body (e.g. Moon) relative to an observer location.
 */
function calculateTopocentricAngles(
  obsLatDeg: number,
  obsLonDeg: number,
  targetSubLatDeg: number,
  targetSubLonDeg: number,
  distanceKm: number
): LocalHorizontalPosition {
  const phi1 = degToRad(obsLatDeg);
  const lambda1 = degToRad(obsLonDeg);
  const phi2 = degToRad(targetSubLatDeg);
  const lambda2 = degToRad(targetSubLonDeg);
  const deltaLambda = lambda2 - lambda1;

  // Zenith angle calculation using spherical law of cosines
  const sinElev = Math.sin(phi1) * Math.sin(phi2) + Math.cos(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  // Clamp between -1 and 1 to prevent precision NaN
  const clampedSinElev = Math.max(-1, Math.min(1, sinElev));
  const altitudeDeg = radToDeg(Math.asin(clampedSinElev));

  // Azimuth calculation (clockwise from North)
  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  let azimuthDeg = radToDeg(Math.atan2(y, x));
  if (azimuthDeg < 0) {
    azimuthDeg += 360;
  }

  return {
    altitudeDegrees: Number(altitudeDeg.toFixed(4)),
    azimuthDegrees: Number(azimuthDeg.toFixed(4)),
    isAboveHorizon: altitudeDeg > 0,
    distanceKm: Math.round(distanceKm),
  };
}

/**
 * Calculates exact Selenographic Sub-Solar coordinates (latitude, longitude)
 * using the official IAU/IAG Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE)
 * Moon orientation model and vector ephemeris.
 * Sub-solar latitude strictly adheres to the Moon's axial tilt to the ecliptic (±1.543°).
 */
export function getLunarSubSolarPoint(time: Astronomy.AstroTime): { latitude: number; longitude: number; distanceKm: number } {
  const moonAxis = Astronomy.RotationAxis(Astronomy.Body.Moon, time);
  const sunPos = Astronomy.GeoVector(Astronomy.Body.Sun, time, false);
  const moonPos = Astronomy.GeoVector(Astronomy.Body.Moon, time, false);

  // Vector from Moon to Sun in J2000 ICRF
  const dx = sunPos.x - moonPos.x;
  const dy = sunPos.y - moonPos.y;
  const dz = sunPos.z - moonPos.z;
  const distAu = Math.sqrt(dx * dx + dy * dy + dz * dz);
  const u = { x: dx / distAu, y: dy / distAu, z: dz / distAu };

  const poleDec = (moonAxis.dec * Math.PI) / 180;
  const poleRa = (moonAxis.ra * 15 * Math.PI) / 180;

  // Lunar North Pole vector Z in ICRF
  const Z = {
    x: Math.cos(poleDec) * Math.cos(poleRa),
    y: Math.cos(poleDec) * Math.sin(poleRa),
    z: Math.sin(poleDec),
  };

  // Node Q of lunar equator on ICRF equator is orthogonal to Z and [0,0,1]
  const nodeNorm = Math.sqrt(Z.x * Z.x + Z.y * Z.y) || 1e-12;
  const Q = { x: -Z.y / nodeNorm, y: Z.x / nodeNorm, z: 0 };

  // Equator vector P_eq at Node + 90°: P_eq = Z x Q
  const P_eq = {
    x: Z.y * Q.z - Z.z * Q.y,
    y: Z.z * Q.x - Z.x * Q.z,
    z: Z.x * Q.y - Z.y * Q.x,
  };

  // Prime meridian X-axis: rotated by W (moonAxis.spin) from ascending node Q
  const W_rad = ((moonAxis.spin % 360) * Math.PI) / 180;
  const X = {
    x: Q.x * Math.cos(W_rad) + P_eq.x * Math.sin(W_rad),
    y: Q.y * Math.cos(W_rad) + P_eq.y * Math.sin(W_rad),
    z: Q.z * Math.cos(W_rad) + P_eq.z * Math.sin(W_rad),
  };

  // Y-axis = Z x X
  const Y = {
    x: Z.y * X.z - Z.z * X.y,
    y: Z.z * X.x - Z.x * X.z,
    z: Z.x * X.y - Z.y * X.x,
  };

  // Project unit vector u onto Moon body-fixed frame [X, Y, Z]
  const ux = u.x * X.x + u.y * X.y + u.z * X.z;
  const uy = u.x * Y.x + u.y * Y.y + u.z * Y.z;
  const uz = u.x * Z.x + u.y * Z.y + u.z * Z.z;

  const lat = Math.asin(Math.max(-1, Math.min(1, uz))) * (180 / Math.PI);
  let lon = Math.atan2(uy, ux) * (180 / Math.PI);

  return {
    latitude: lat,
    longitude: lon,
    distanceKm: distAu * 149597870.7,
  };
}

/**
 * Primary calculation engine: Computes Sun & Earth positions for any lunar coordinate at a specified UTC date.
 *
 * @param lat Lunar latitude in degrees (-90 to +90, e.g. -89.9 for Shackleton)
 * @param lon Lunar longitude in degrees (-180 to +180)
 * @param date Date object representing UTC time
 * @returns CelestialPositionResult containing Sun & Earth elevation/azimuth and Line-of-Sight visibility
 */
export function getLunarSunEarthPositions(
  lat: number,
  lon: number,
  date: Date = new Date()
): CelestialPositionResult {
  const time = Astronomy.MakeTime(date);
  const lib = Astronomy.Libration(time);

  // Exact Sub-Solar coordinates using IAU WGCCRE lunar rotational elements (latitude bounded within ±1.543°)
  const subSolar = getLunarSubSolarPoint(time);
  const subSolarLat = subSolar.latitude;
  const subSolarLon = subSolar.longitude;
  const sunDistKm = subSolar.distanceKm;

  // Sub-Earth coordinates (where the Earth is at zenith on the lunar surface, from lunar libration)
  const subEarthLat = typeof lib.elat === "number" ? lib.elat : 0;
  let subEarthLon = typeof lib.elon === "number" ? lib.elon : 0;
  if (subEarthLon > 180) {
    subEarthLon -= 360;
  }

  const earthDistKm = typeof lib.dist_km === "number" ? lib.dist_km : 384400;

  // Sun calculation
  const sunPos = calculateTopocentricAngles(lat, lon, subSolarLat, subSolarLon, sunDistKm);

  // Earth calculation (Direct-to-Earth communication window)
  const earthPos = calculateTopocentricAngles(lat, lon, subEarthLat, subEarthLon, earthDistKm);

  // Solar illumination proxy based on sun elevation above horizontal
  let illumination = 0;
  if (sunPos.altitudeDegrees > 0) {
    illumination = Math.min(1, Math.sin(degToRad(sunPos.altitudeDegrees)) * 2);
  }

  return {
    timestamp: date.toISOString(),
    lunarLocation: { latitude: lat, longitude: lon },
    sun: sunPos,
    earth: earthPos,
    isDirectToEarthAvailable: earthPos.altitudeDegrees > 0,
    solarIlluminationFraction: Number((illumination || 0).toFixed(3)),
    subSolarPoint: {
      latitude: Number((subSolarLat || 0).toFixed(3)),
      longitude: Number((subSolarLon || 0).toFixed(3)),
    },
    subEarthPoint: {
      latitude: Number((subEarthLat || 0).toFixed(3)),
      longitude: Number((subEarthLon || 0).toFixed(3)),
    },
  };
}

/**
 * Calculates a continuous time-series ephemeris for a lunar site across a date range.
 * Useful for Recharts charts and timeline scrubbers.
 *
 * @param lat Lunar latitude
 * @param lon Lunar longitude
 * @param startDate Start Date
 * @param hoursDuration Number of hours to project (e.g. 24h, 720h / 1 lunar day)
 * @param stepHours Step size in hours (e.g. 1h or 6h)
 */
export function generateLunarEphemerisSeries(
  lat: number,
  lon: number,
  startDate: Date,
  hoursDuration: number = 24,
  stepHours: number = 1
): CelestialPositionResult[] {
  const results: CelestialPositionResult[] = [];
  const startMs = startDate.getTime();

  for (let h = 0; h <= hoursDuration; h += stepHours) {
    const currentMs = startMs + h * 3600 * 1000;
    const currentDate = new Date(currentMs);
    results.push(getLunarSunEarthPositions(lat, lon, currentDate));
  }

  return results;
}
