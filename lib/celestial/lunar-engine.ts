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

  // Sub-solar coordinates (where the Sun is at zenith on the lunar surface)
  const subSolarLat = typeof lib.mlat === "number" ? lib.mlat : 0;
  // Normalize mlon (0 to 360) to (-180 to 180) if needed or use directly
  let subSolarLon = typeof lib.mlon === "number" ? lib.mlon : 0;
  if (subSolarLon > 180) {
    subSolarLon -= 360;
  }

  // Sub-Earth coordinates (where the Earth is at zenith on the lunar surface)
  const subEarthLat = typeof lib.elat === "number" ? lib.elat : 0;
  let subEarthLon = typeof lib.elon === "number" ? lib.elon : 0;
  if (subEarthLon > 180) {
    subEarthLon -= 360;
  }

  // Distance to Sun in km (HelioDistance returns AU, 1 AU = 149597870.7 km)
  const sunDistKm = Astronomy.HelioDistance(Astronomy.Body.Moon, time) * 149597870.7;
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
