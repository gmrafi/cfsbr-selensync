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
 * At the lunar South Pole, the sun skims the horizon at low elevation angles (1.5° to 3.5°),
 * making vertical panels exceptionally efficient.
 */
export function calculateSolarPower(
  sunAltitudeDeg: number,
  sunAzimuthDeg: number,
  specs: SolarPanelSpecs = DEFAULT_CLPS_SOLAR_SPECS
): SolarPowerOutput {
  const SOLAR_CONSTANT_WM2 = 1361; // W/m^2 (AM0 space solar irradiance)

  if (sunAltitudeDeg <= 0) {
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

  // Incident angle calculations depending on array geometry
  let cosineFactor = 0;
  if (specs.orientation === "vertical-cylinder") {
    // For a vertical cylindrical array, the angle with the horizon determines projected area:
    // Effective projection = cos(elevation)
    const elevRad = (sunAltitudeDeg * Math.PI) / 180;
    cosineFactor = Math.cos(elevRad);
  } else if (specs.orientation === "horizontal-flat") {
    // Flat top panel receives sin(elevation)
    const elevRad = (sunAltitudeDeg * Math.PI) / 180;
    cosineFactor = Math.sin(elevRad);
  } else {
    // Articulated tracking (optimally tracks sun)
    cosineFactor = 0.98;
  }

  const effectiveIncidentAngleDeg = Math.acos(Math.max(0, Math.min(1, cosineFactor))) * (180 / Math.PI);
  const grossGeneratedWatts = SOLAR_CONSTANT_WM2 * specs.totalAreaM2 * specs.cellEfficiency * cosineFactor;
  const netOutputWatts = grossGeneratedWatts * specs.dustDegradationFactor;

  return {
    sunAltitudeDeg,
    sunAzimuthDeg,
    solarFluxWm2: SOLAR_CONSTANT_WM2,
    effectiveIncidentAngleDeg: Number(effectiveIncidentAngleDeg.toFixed(2)),
    grossGeneratedWatts: Number(grossGeneratedWatts.toFixed(2)),
    netOutputWatts: Number(netOutputWatts.toFixed(2)),
    isGenerating: netOutputWatts > 0,
  };
}
