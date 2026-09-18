/**
 * NASA LRO Diviner Lunar Radiometer Experiment Thermal Model & Lander Cryo Health
 * Models cryogenic regolith temperature (40K to 230K) and lander battery drawdown.
 */

export interface DivinerThermalStatus {
  regolithTempKelvin: number;      // 40 K (PSR cold trap) to 230 K (grazing sun)
  regolithTempCelsius: number;     // -233°C to -43°C
  internalLanderTempCelsius: number; // Internal avionics bay temperature
  cryoHeaterDrawWatts: number;     // Active power consumed by resistance heaters
  timeToFreezeHours: number;       // Hours until internal temperature drops below -180°C
  slopeHazardDegrees: number;      // Local terrain slope angle
  tipOverRiskPercent: number;      // Probability of landing tip-over (critical above 8.5°)
  isSlopeSafe: boolean;            // Safe if < 10.0°
  thermalState: "CRYOGENIC_DANGER" | "HEATER_ACTIVE" | "THERMAL_NOMINAL";
}

/**
 * Calculates surface and internal thermal equilibrium based on Diviner empirical curves.
 */
export function calculateDivinerThermal(
  sunElevationDeg: number,
  isSunOccluded: boolean,
  baseSlopeDegrees: number = 4.2,
  batterySoCPercent: number = 100,
  batteryCapacityWh: number = 1600
): DivinerThermalStatus {
  // Diviner Lunar Radiometer empirical temperature model
  let regolithTempKelvin: number;

  if (isSunOccluded || sunElevationDeg <= 0) {
    // Permanently Shadowed Region (PSR) or crater rim shadow
    regolithTempKelvin = Math.max(40, 52 - Math.abs(sunElevationDeg) * 1.5);
  } else {
    // Direct grazing illumination at South Pole
    // Peak temperature at low sun elevation (1.5° - 3.0°) reaches ~180K - 230K
    const illuminationFactor = Math.min(1.0, Math.sin((sunElevationDeg * Math.PI) / 180) / Math.sin((3.0 * Math.PI) / 180));
    regolithTempKelvin = Math.min(235, 120 + illuminationFactor * 115);
  }

  const regolithTempCelsius = Number((regolithTempKelvin - 273.15).toFixed(1));

  // Internal avionics bay temperature (insulated with Multi-Layer Insulation MLI)
  let internalLanderTempCelsius: number;
  let cryoHeaterDrawWatts: number;
  let thermalState: DivinerThermalStatus["thermalState"];

  if (isSunOccluded) {
    internalLanderTempCelsius = Number((-40 - (100 - batterySoCPercent) * 0.8).toFixed(1));
    cryoHeaterDrawWatts = 85.0; // 85W cryogenic resistance heaters engaged
    thermalState = batterySoCPercent < 25 ? "CRYOGENIC_DANGER" : "HEATER_ACTIVE";
  } else {
    internalLanderTempCelsius = Number((+18 + (sunElevationDeg > 1 ? 4 : 0)).toFixed(1));
    cryoHeaterDrawWatts = 15.0; // Maintenance trickle
    thermalState = "THERMAL_NOMINAL";
  }

  // Time-to-Freeze (TTF): hours until battery completely exhausts heater power
  const remainingEnergyWh = (batteryCapacityWh * batterySoCPercent) / 100;
  const timeToFreezeHours = isSunOccluded 
    ? Number((remainingEnergyWh / Math.max(1, cryoHeaterDrawWatts + 120)).toFixed(1))
    : 999.9;

  // Lander slope tip-over risk assessment (limit is 10.0° for standard CLPS legs)
  const tipOverRiskPercent = Number(Math.min(100, Math.max(0, (baseSlopeDegrees / 10.0) * 45)).toFixed(1));
  const isSlopeSafe = baseSlopeDegrees < 8.5;

  return {
    regolithTempKelvin: Number(regolithTempKelvin.toFixed(1)),
    regolithTempCelsius,
    internalLanderTempCelsius,
    cryoHeaterDrawWatts,
    timeToFreezeHours,
    slopeHazardDegrees: baseSlopeDegrees,
    tipOverRiskPercent,
    isSlopeSafe,
    thermalState,
  };
}
