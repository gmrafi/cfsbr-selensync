/**
 * Electrical & Electronic Engineering (EEE) Workstream:
 * Solar Array Power Modeling & Wattage Output Curve Calculations for CLPS Lunar Landers/Rovers
 */

export interface SolarPanelSpecs {
  name: string;
  totalAreaM2: number;               // Solar array area in square meters (e.g. 2.5 m2 for CLPS lander)
  cellEfficiency: number;            // Gallium Arsenide (GaAs) or Silicon multi-junction efficiency (e.g. 0.28 to 0.32)
  orientation: "vertical-cylinder" | "horizontal-flat" | "tilted-fixed" | "articulated-tracking";
  tiltAngleDegrees?: number;         // Fixed tilt angle relative to local horizon (if tilted-fixed)
  dustDegradationFactor: number;     // 0.0 to 1.0 (typical lunar dust deposition factor, e.g. 0.92)
}

export interface SolarPowerOutput {
  sunAltitudeDeg: number;
  sunAzimuthDeg: number;
  solarFluxWm2: number;              // Solar irradiance constant at 1 AU ~ 1361 W/m^2
  effectiveIncidentAngleDeg: number; // Angle between panel normal and solar vector
  grossGeneratedWatts: number;       // Raw power output before thermal/dust losses
  netOutputWatts: number;            // Usable DC power delivered to PDU (Power Distribution Unit)
  isGenerating: boolean;
}

export const DEFAULT_CLPS_SOLAR_SPECS: SolarPanelSpecs = {
  name: "CLPS Standard Multi-Junction Vertical Array",
  totalAreaM2: 2.2,
  cellEfficiency: 0.295, // 29.5% efficient triple-junction GaAs cells
  orientation: "vertical-cylinder",
  dustDegradationFactor: 0.95,
};

/**
 * Calculates solar wattage output based on sun altitude and solar panel specifications.
 * At the lunar South Pole, the sun skims the horizon at low elevation angles (1.5° to 3.5°).
 * Incorporates finite solar disk diameter (0.53°) emergence ramp to prevent instantaneous 
 * step-function jumps, producing a physically realistic continuous sunrise/sunset power curve.
 */
export function calculateSolarPower(
  sunAltitudeDeg: number,
  sunAzimuthDeg: number,
  specs: SolarPanelSpecs = DEFAULT_CLPS_SOLAR_SPECS,
  obstacleAltitudeDeg: number = 0
): SolarPowerOutput {
  const SOLAR_CONSTANT_WM2 = 1361; // W/m^2 (AM0 space solar irradiance)
  const SUN_ANGULAR_DIAMETER_DEG = 0.53; // Angular diameter of the solar disk

  // Clearance above obstacle horizon
  const deltaElev = sunAltitudeDeg - obstacleAltitudeDeg;

  // If the entire solar disk is below the obstacle horizon
  if (deltaElev <= -SUN_ANGULAR_DIAMETER_DEG / 2) {
    return {
      sunAltitudeDeg,
      sunAzimuthDeg,
      solarFluxWm2: 0,
      effectiveIncidentAngleDeg: 90,
      grossGeneratedWatts: 0,
      netOutputWatts: 0,
      isGenerating: false,
    };
  }

  // Smooth solar disk emergence fraction between [-0.265°, +0.265°]
  const rawDiskFraction = (deltaElev + SUN_ANGULAR_DIAMETER_DEG / 2) / SUN_ANGULAR_DIAMETER_DEG;
  // Apply cubic smoothstep for physically realistic atmospheric-free solar disk emergence
  const clampedFraction = Math.max(0, Math.min(1, rawDiskFraction));
  const diskFraction = clampedFraction * clampedFraction * (3 - 2 * clampedFraction);

  // Incident angle calculations depending on array geometry
  let geometricFactor = 0;
  if (specs.orientation === "vertical-cylinder") {
    // Vertical cylinder receives cos(elevation) projected flux, modulated by disk visibility fraction
    const elevRad = (Math.max(0, sunAltitudeDeg) * Math.PI) / 180;
    geometricFactor = Math.cos(elevRad) * diskFraction;
  } else if (specs.orientation === "horizontal-flat") {
    // Flat top panel receives sin(elevation)
    const elevRad = (Math.max(0, sunAltitudeDeg) * Math.PI) / 180;
    geometricFactor = Math.sin(elevRad) * diskFraction;
  } else {
    // Articulated tracking (optimally tracks sun)
    geometricFactor = 0.98 * diskFraction;
  }

  const effectiveIncidentAngleDeg = Math.acos(Math.max(0, Math.min(1, geometricFactor))) * (180 / Math.PI);
  const grossGeneratedWatts = SOLAR_CONSTANT_WM2 * specs.totalAreaM2 * specs.cellEfficiency * geometricFactor;
  const netOutputWatts = grossGeneratedWatts * specs.dustDegradationFactor;

  return {
    sunAltitudeDeg,
    sunAzimuthDeg,
    solarFluxWm2: Number((SOLAR_CONSTANT_WM2 * diskFraction).toFixed(1)),
    effectiveIncidentAngleDeg: Number(effectiveIncidentAngleDeg.toFixed(2)),
    grossGeneratedWatts: Number(grossGeneratedWatts.toFixed(2)),
    netOutputWatts: Number(netOutputWatts.toFixed(2)),
    isGenerating: netOutputWatts > 0.5,
  };
}
