/**
 * Mission Techno-Economic Analysis (TEA) & Aerospace Capital Allocation Engine
 * 
 * Translates raw lunar topocentric ephemeris, crater shadow duration, and DTE
 * communication availability into hard system financial metrics for a NASA CLPS-class
 * lunar lander ($120M baseline CAPEX).
 * 
 * Standards & Physical Benchmarks:
 * - NASA CLPS payload transit benchmark: $1.2M per kg to lunar surface
 * - Space-grade LiFePO4 battery specific energy: 180 Wh/kg @ 80% Depth of Discharge (DoD)
 * - Base lander keep-alive heater requirement: 120W (cryogenic avionics thermal mitigation)
 * - Lunar Gateway / Relay constellation lease cost avoidance: ~$25M per mission
 */

export interface SiteFinancialProfile {
  id: string;
  name: string;
  lat: number;
  lon: number;
  illuminationFraction: number; // 0 to 1
  maxShadowHours: number;
  maxSlopeDeg: number;
  dteAvailabilityFraction: number; // 0 to 1
  requiredBatteryKg: number;
  batteryLaunchCostM: number;
  launchSavingsVsBasinM: number;
  lcmdDailyCostM: number;
  cariPercent: number;
  netEfficiencyScore: number; // 0 to 100
  notes: string;
}

// Global Aerospace Financial & Physical Constants
export const TEA_CONSTANTS = {
  LUNAR_TRANSIT_COST_PER_KG: 1_200_000, // $1.2M / kg
  BASELINE_CLPS_CAPEX_M: 120.0, // $120M total mission lifecycle cost
  BATTERY_SPECIFIC_ENERGY_WH_KG: 180, // Wh / kg for space-qualified cells
  BATTERY_DEPTH_OF_DISCHARGE: 0.80, // 80% usable capacity before cell degradation
  DEFAULT_HEATER_POWER_W: 120, // 120 Watts continuous internal heating
  RELAY_LEASE_AVOIDANCE_M: 25.0, // $25M avoided per mission via DTE
  LANDER_DRY_MASS_KG: 620, // Structural + avionics baseline mass
  PROPULSION_MASS_FRACTION: 0.28, // 28% propulsion propellant fraction for descent
};

/**
 * Calculate required space battery mass (kg) for surviving continuous shadow
 */
export function calculateBatteryMassKg(heaterWatts: number, shadowHours: number): number {
  const usableEnergyPerKg = TEA_CONSTANTS.BATTERY_SPECIFIC_ENERGY_WH_KG * TEA_CONSTANTS.BATTERY_DEPTH_OF_DISCHARGE;
  const totalEnergyNeededWh = heaterWatts * shadowHours;
  return totalEnergyNeededWh / usableEnergyPerKg;
}

/**
 * Calculate Levelized Cost of Mission Day (LCMD)
 * LCMD = Total CAPEX / Operational Sunlit Days
 */
export function calculateLCMD(capexM: number, missionDays: number, illuminationFraction: number): number {
  const activeSunlitDays = Math.max(1.0, missionDays * illuminationFraction);
  return capexM / activeSunlitDays;
}

/**
 * Calculate Capital-at-Risk Index (CaRI)
 * Weighted risk based on:
 * - Shadow duration (Cryogenic freezing risk: 50%)
 * - DSN Blackout duration (Loss of telemetry/control: 30%)
 * - Surface slope (Landing gear failure / tip-over: 20%)
 */
export function calculateCaRI(
  maxShadowHours: number,
  dteAvailabilityFraction: number,
  slopeDeg: number
): number {
  // Shadow freeze risk (normalized: 24h is low ~10%, 400h is near 100%)
  const shadowRisk = Math.min(100, (maxShadowHours / 400) * 100);

  // Blackout risk (inversely proportional to DTE availability)
  const blackoutRisk = Math.min(100, (1 - dteAvailabilityFraction) * 140);

  // Slope tip-over risk (under 10° is very safe, 15° is critical abort threshold)
  const slopeRisk = Math.min(100, Math.pow(slopeDeg / 15, 1.8) * 100);

  const cari = (0.50 * shadowRisk) + (0.30 * blackoutRisk) + (0.20 * slopeRisk);
  return Math.round(cari * 10) / 10;
}

// 4 Baseline Sites (3 Candidate Sites + 1 Polar Basin Benchmark)
export const CANDIDATE_SITE_FINANCIAL_PROFILES: SiteFinancialProfile[] = [
  {
    id: "malapert-peak",
    name: "Malapert Mountain (Peak)",
    lat: -85.99,
    lon: 2.93,
    illuminationFraction: 0.964,
    maxShadowHours: 24.2,
    maxSlopeDeg: 6.8,
    dteAvailabilityFraction: 0.892,
    requiredBatteryKg: 20.2,
    batteryLaunchCostM: 24.2,
    launchSavingsVsBasinM: 38.4,
    lcmdDailyCostM: 4.44,
    cariPercent: 7.8,
    netEfficiencyScore: 94.6,
    notes: "Optimal high-illumination massif. Minimal battery weight enables maximum scientific payload allocation."
  },
  {
    id: "shackleton-ridge",
    name: "Shackleton Connecting Ridge",
    lat: -89.90,
    lon: 0.00,
    illuminationFraction: 0.860,
    maxShadowHours: 94.1,
    maxSlopeDeg: 8.5,
    dteAvailabilityFraction: 0.825,
    requiredBatteryKg: 78.4,
    batteryLaunchCostM: 94.1,
    launchSavingsVsBasinM: 24.8,
    lcmdDailyCostM: 4.98,
    cariPercent: 18.5,
    netEfficiencyScore: 82.4,
    notes: "Prime PSR ice proximity; requires moderate battery mass buffers for 94h seasonal shadow passes."
  },
  {
    id: "amundsen-rim",
    name: "Amundsen Rim",
    lat: -84.50,
    lon: 82.80,
    illuminationFraction: 0.725,
    maxShadowHours: 184.8,
    maxSlopeDeg: 11.2,
    dteAvailabilityFraction: 0.740,
    requiredBatteryKg: 154.0,
    batteryLaunchCostM: 184.8,
    launchSavingsVsBasinM: 11.2,
    lcmdDailyCostM: 5.91,
    cariPercent: 34.2,
    netEfficiencyScore: 68.1,
    notes: "High scientific yield in deep regolith; elevated slope and longer shadow intervals drive up launch mass costs."
  },
  {
    id: "polar-basin-benchmark",
    name: "Standard Polar Basin (Crater Floor Benchmark)",
    lat: -88.20,
    lon: 45.00,
    illuminationFraction: 0.343,
    maxShadowHours: 441.5,
    maxSlopeDeg: 14.5,
    dteAvailabilityFraction: 0.480,
    requiredBatteryKg: 367.9,
    batteryLaunchCostM: 441.5,
    launchSavingsVsBasinM: 0.0,
    lcmdDailyCostM: 12.50,
    cariPercent: 78.6,
    netEfficiencyScore: 24.5,
    notes: "Worst-case crater floor. High shadow intervals consume ~368 kg in batteries, suffocating scientific payload capacity."
  }
];

export interface DynamicSimulatorParams {
  missionDays: number; // 7 to 45
  heaterWatts: number; // 80 to 250
  scienceTargetKg: number; // 20 to 100
  selectedSiteId: string;
}

export interface DynamicSimulatorResult {
  site: SiteFinancialProfile;
  batteryMassKg: number;
  batteryCostM: number;
  launchSavingsVsBasinM: number;
  lcmdDailyCostM: number;
  reallocatedCapitalM: number;
  cariPercent: number;
  massBreakdown: { name: string; value: number; color: string }[];
  timelineData: {
    day: number;
    solarElevationDeg: number;
    isShadow: boolean;
    cumulativeRiskM: number;
  }[];
  lifecycleComparisonData: {
    category: string;
    malapert: number;
    shackleton: number;
    craterBasin: number;
  }[];
}

/**
 * Reactive calculation for interactive sliders
 */
export function calculateDynamicTradeoff(params: DynamicSimulatorParams): DynamicSimulatorResult {
  const { missionDays, heaterWatts, scienceTargetKg, selectedSiteId } = params;

  const site = CANDIDATE_SITE_FINANCIAL_PROFILES.find((s) => s.id === selectedSiteId) 
    || CANDIDATE_SITE_FINANCIAL_PROFILES[0];

  const basinBenchmark = CANDIDATE_SITE_FINANCIAL_PROFILES[3];

  // Dynamically compute battery needed for this site given current heater power
  const batteryMassKg = calculateBatteryMassKg(heaterWatts, site.maxShadowHours);
  const basinBatteryKg = calculateBatteryMassKg(heaterWatts, basinBenchmark.maxShadowHours);

  const batteryCostM = (batteryMassKg * TEA_CONSTANTS.LUNAR_TRANSIT_COST_PER_KG) / 1_000_000;
  const basinBatteryCostM = (basinBatteryKg * TEA_CONSTANTS.LUNAR_TRANSIT_COST_PER_KG) / 1_000_000;

  const launchSavingsVsBasinM = Math.max(0, basinBatteryCostM - batteryCostM);

  // Reallocated capital from avoided dead battery ballast into science instrumentation
  const reallocatedCapitalM = (basinBatteryKg - batteryMassKg) * (TEA_CONSTANTS.LUNAR_TRANSIT_COST_PER_KG / 1_000_000);

  const lcmdDailyCostM = calculateLCMD(TEA_CONSTANTS.BASELINE_CLPS_CAPEX_M, missionDays, site.illuminationFraction);
  const cariPercent = calculateCaRI(site.maxShadowHours, site.dteAvailabilityFraction, site.maxSlopeDeg);

  // Hardware Mass Budget Breakdown (Total Lander Wet Mass ~ 1250 kg)
  const structuralMassKg = 480;
  const propulsionMassKg = 350;
  const avionicsMassKg = 90;

  const massBreakdown = [
    { name: "Structures & Thermal Bus", value: structuralMassKg, color: "#64748b" },
    { name: "Descent Propulsion & Tanks", value: propulsionMassKg, color: "#475569" },
    { name: "Avionics & RF Comm", value: avionicsMassKg, color: "#38bdf8" },
    { name: "Cryo Battery Reserves", value: Math.round(batteryMassKg), color: "#f43f5e" },
    { name: "Science Payload Package", value: scienceTargetKg, color: "#10b981" },
  ];

  // Timeline curve data for 28-day mission
  const timelineData = [];
  const daysTotal = Math.min(28, missionDays);
  let cumulativeRisk = 0;

  for (let d = 0; d <= daysTotal; d++) {
    // Topocentric solar elevation approximation based on site illumination cycle
    const diurnalAngle = (d / 28) * 2 * Math.PI;
    const baseElev = (site.illuminationFraction - 0.5) * 5.0; // peak elev
    const dip = Math.sin(diurnalAngle * 1.5) * 2.2;
    const solarElevationDeg = Math.round((baseElev + dip) * 10) / 10;
    const isShadow = solarElevationDeg <= 0;

    if (isShadow) {
      cumulativeRisk += (heaterWatts / 100) * 1.8;
    } else {
      cumulativeRisk += 0.2;
    }

    timelineData.push({
      day: d,
      solarElevationDeg,
      isShadow,
      cumulativeRiskM: Math.round(cumulativeRisk * 10) / 10,
    });
  }

  // Grouped Bar chart lifecycle comparison data
  const lifecycleComparisonData = [
    {
      category: "Launch Transit ($M)",
      malapert: Math.round(((structuralMassKg + batteryMassKg) * 1.2) / 10) / 10,
      shackleton: Math.round(((structuralMassKg + 78.4) * 1.2) / 10) / 10,
      craterBasin: Math.round(((structuralMassKg + 367.9) * 1.2) / 10) / 10,
    },
    {
      category: "Power Subsystem ($M)",
      malapert: Math.round(batteryCostM * 10) / 10,
      shackleton: 94.1,
      craterBasin: 441.5,
    },
    {
      category: "Thermal Mitigation ($M)",
      malapert: 14.5,
      shackleton: 28.2,
      craterBasin: 82.0,
    },
    {
      category: "Relay Reserves ($M)",
      malapert: 4.2,
      shackleton: 8.5,
      craterBasin: 25.0,
    },
  ];

  return {
    site,
    batteryMassKg: Math.round(batteryMassKg * 10) / 10,
    batteryCostM: Math.round(batteryCostM * 10) / 10,
    launchSavingsVsBasinM: Math.round(launchSavingsVsBasinM * 10) / 10,
    lcmdDailyCostM: Math.round(lcmdDailyCostM * 100) / 100,
    reallocatedCapitalM: Math.round(reallocatedCapitalM * 10) / 10,
    cariPercent,
    massBreakdown,
    timelineData,
    lifecycleComparisonData,
  };
}
