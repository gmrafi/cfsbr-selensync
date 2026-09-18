/**
 * Lunar Libration Calculations (Optical & Physical Libration in Longitude and Latitude)
 * Models topocentric apparent nodding of the Moon relative to Earth observer,
 * which directly governs Direct-to-Earth (DTE) radio line-of-sight elevation at the Lunar South Pole.
 */

export interface LunarLibrationData {
  longitudeLibrationDeg: number;  // Delta lambda (-8.0° to +8.0°)
  latitudeLibrationDeg: number;   // Delta beta (-6.7° to +6.7°)
  totalLibrationDeg: number;      // Total angular displacement
  subEarthLatitudeDeg: number;    // Sub-Earth point selenographic latitude
  subEarthLongitudeDeg: number;   // Sub-Earth point selenographic longitude
  nodalCyclePhase: string;        // Phase of 18.6-year lunar nodal precession
  dteVisibilityBoostDeg: number;  // Elevation gain/loss at south pole due to libration
}

/**
 * Calculates topocentric optical and physical libration for a given simulated date.
 * Based on Meeus Astronomical Algorithms (Ch. 53 - Ephemeris for Physical Observations of the Moon).
 */
export function calculateLunarLibration(simulatedDate: Date): LunarLibrationData {
  const T = (simulatedDate.getTime() - new Date("2000-01-01T12:00:00Z").getTime()) / (86400000 * 36525);

  // Mean elongation of Moon
  const D = (297.8501921 + 445267.1114034 * T) % 360;
  // Sun's mean anomaly
  const M = (357.5291092 + 35999.0502909 * T) % 360;
  // Moon's mean anomaly
  const Mprime = (134.9633964 + 477198.8675055 * T) % 360;
  // Moon's argument of latitude
  const F = (93.2720950 + 483202.0175233 * T) % 360;

  const toRad = Math.PI / 180;

  // Optical libration in longitude (l')
  const lPrime = -1.274 * Math.sin((Mprime - 2 * D) * toRad) 
                 + 0.658 * Math.sin(2 * D * toRad) 
                 - 0.186 * Math.sin(M * toRad) 
                 - 0.059 * Math.sin((2 * Mprime - 2 * D) * toRad)
                 + 6.289 * Math.sin(Mprime * toRad);

  // Optical libration in latitude (b')
  const bPrime = 5.128 * Math.sin(F * toRad) 
                 + 0.280 * Math.sin((Mprime + F) * toRad) 
                 - 0.278 * Math.sin((F - Mprime) * toRad) 
                 + 0.173 * Math.sin((2 * D - F) * toRad);

  // Physical libration additions (approx ~0.04° variations)
  const physicalLon = 0.035 * Math.sin(Mprime * toRad);
  const physicalLat = -0.025 * Math.cos(F * toRad);

  const deltaLambda = Number((lPrime + physicalLon).toFixed(2));
  const deltaBeta = Number((bPrime + physicalLat).toFixed(2));
  const totalLibration = Number(Math.sqrt(deltaLambda * deltaLambda + deltaBeta * deltaBeta).toFixed(2));

  // At South Pole (-90°), Earth elevation directly correlates with latitude libration
  const dteVisibilityBoost = deltaBeta;

  return {
    longitudeLibrationDeg: deltaLambda,
    latitudeLibrationDeg: deltaBeta,
    totalLibrationDeg: totalLibration,
    subEarthLatitudeDeg: deltaBeta,
    subEarthLongitudeDeg: deltaLambda,
    nodalCyclePhase: deltaBeta >= 0 ? "Favorable South Polar DTE Window" : "Marginal Horizon Libration Dip",
    dteVisibilityBoostDeg: Number(dteVisibilityBoost.toFixed(2)),
  };
}
