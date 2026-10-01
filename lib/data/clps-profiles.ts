/**
 * NASA CLPS & Artemis Mission Constraints Profiles
 * SelenSync — NASA Space Apps Challenge 2026 (CLPS Lunar Mission Browser)
 * 
 * Lead Mission Strategist: Afshara Tasneem Zoa
 * Strategy & Research Lead, CFSBR SpaceWeb
 * 
 * Authoritative technical constraint specifications and cryogenic survival thresholds
 * for commercial lunar landers and NASA Artemis human-rated architecture.
 */

import { SiteEvaluationCriteria } from "@/lib/strategy/site-scoring";

export interface CLPSLanderConstraintProfile {
  id: string;
  name: string;
  contractor: string;
  program: "NASA CLPS" | "NASA Artemis HLS" | "Commercial Lunar Service";
  missionClass: "Commercial Scout" | "Heavy Cargo & Rover Carrier" | "Medium Multi-Payload" | "Crewed Lunar Lander";
  
  // Mass & Physical Properties
  wetMassKg: number;
  dryMassKg: number;
  payloadCapacityKg: number;
  dimensions: {
    heightMeters: number;
    diameterMeters: number;
    landingFootprintM2: number;
  };

  // Power & Cryogenic Survival Thresholds
  powerSpecs: {
    nominalBaseLoadWatts: number;    // Continuous operational power draw
    peakScienceWatts: number;        // Maximum scientific instrument payload draw
    survivalHeaterWatts: number;     // Critical internal thermal survival power in shadow
    solarArrayPeakWatts: number;     // Generation capability at 1 AU AM0
    solarArrayOrientation: "vertical-cylinder" | "top-mounted-flat" | "articulated-gimbal";
    batteryCapacityWh: number;       // Usable secondary battery storage
    allowableBlackoutHours: number;  // Cryogenic survival endurance without solar recharge
  };

  // Terrain & Structural Tolerances
  terrainTolerances: {
    maxSlopeDeg: number;             // Maximum slope angle before tip-over threshold
    maxObstacleHeightCm: number;     // Landing pad boulder clearance
    surfaceBearingStrengthKPa: number; // Minimum regolith bearing capacity
  };

  // Telecommunications & DSN Requirements
  telecomSpecs: {
    primaryBand: "X-Band" | "Ka-Band" | "S-Band";
    commArchitecture: "Direct-to-Earth (DTE)" | "Lunar Relay Constellation" | "Dual Direct & Relay";
    txPowerWatts: number;
    antennaGainDbi: number;
    antennaType: string;
    dsnApertureRequiredM: 34 | 70;   // Deep Space Network ground station aperture
    minLinkMarginDb: number;         // Minimum required link closing margin (standard: 3.0 dB)
  };

  // Thermal Operating Envelope
  thermalLimits: {
    minOperatingTempKelvin: number;
    maxOperatingTempKelvin: number;
    cryoSurvivalMethod: string;
  };

  // Reference NASA missions
  referenceMissions: string[];
}

/**
 * Verified constraint profiles for NASA CLPS and Artemis mission landers
 */
export const CLPS_LANDER_PROFILES: Record<string, CLPSLanderConstraintProfile> = {
  "nova-c": {
    id: "nova-c",
    name: "Intuitive Machines Nova-C",
    contractor: "Intuitive Machines",
    program: "NASA CLPS",
    missionClass: "Commercial Scout",
    wetMassKg: 1908,
    dryMassKg: 675,
    payloadCapacityKg: 130,
    dimensions: {
      heightMeters: 4.3,
      diameterMeters: 1.6,
      landingFootprintM2: 12.5,
    },
    powerSpecs: {
      nominalBaseLoadWatts: 100,
      peakScienceWatts: 250,
      survivalHeaterWatts: 65,
      solarArrayPeakWatts: 800,
      solarArrayOrientation: "vertical-cylinder",
      batteryCapacityWh: 1600,
      allowableBlackoutHours: 12.0, // Survival heater + baseline avionics discharge limit
    },
    terrainTolerances: {
      maxSlopeDeg: 12.0, // Flexible carbon composite cantilever landing legs
      maxObstacleHeightCm: 35,
      surfaceBearingStrengthKPa: 15,
    },
    telecomSpecs: {
      primaryBand: "X-Band",
      commArchitecture: "Direct-to-Earth (DTE)",
      txPowerWatts: 15,
      antennaGainDbi: 26.5,
      antennaType: "Steerable Parabolic High-Gain Dish (0.5m)",
      dsnApertureRequiredM: 34,
      minLinkMarginDb: 3.0,
    },
    thermalLimits: {
      minOperatingTempKelvin: 85,
      maxOperatingTempKelvin: 380,
      cryoSurvivalMethod: "Internal electric resistive heaters + MLI thermal blankets (non-RTG)",
    },
    referenceMissions: [
      "IM-1 Odysseus (Malapert A / 80.13°S)",
      "IM-2 Athena (Shackleton Connecting Ridge / PRIME-1 Drill)",
      "IM-3 (Reiner Gamma / Lunar Swirl Magnetometer)",
    ],
  },

  "griffin-viper": {
    id: "griffin-viper",
    name: "Astrobotic Griffin (VIPER Class)",
    contractor: "Astrobotic Technology",
    program: "NASA CLPS",
    missionClass: "Heavy Cargo & Rover Carrier",
    wetMassKg: 6200,
    dryMassKg: 2000,
    payloadCapacityKg: 500,
    dimensions: {
      heightMeters: 2.2,
      diameterMeters: 4.5,
      landingFootprintM2: 24.0,
    },
    powerSpecs: {
      nominalBaseLoadWatts: 450,
      peakScienceWatts: 800,
      survivalHeaterWatts: 160,
      solarArrayPeakWatts: 1800,
      solarArrayOrientation: "vertical-cylinder",
      batteryCapacityWh: 5400,
      allowableBlackoutHours: 18.5,
    },
    terrainTolerances: {
      maxSlopeDeg: 8.5, // Strict tip-over constraint due to high center of mass with VIPER rover
      maxObstacleHeightCm: 25,
      surfaceBearingStrengthKPa: 22,
    },
    telecomSpecs: {
      primaryBand: "X-Band",
      commArchitecture: "Direct-to-Earth (DTE)",
      txPowerWatts: 25,
      antennaGainDbi: 28.0,
      antennaType: "Dual-Gimbal X-Band Phased Reflector Array",
      dsnApertureRequiredM: 34,
      minLinkMarginDb: 4.5,
    },
    thermalLimits: {
      minOperatingTempKelvin: 70,
      maxOperatingTempKelvin: 375,
      cryoSurvivalMethod: "Heat pipes, louvers, and high-density survival battery bus",
    },
    referenceMissions: [
      "Griffin Mission 1 (Nobile Crater / VIPER Polar Rover delivery)",
      "Artemis Polar Heavy Logistics Delivery",
    ],
  },

  "blue-ghost": {
    id: "blue-ghost",
    name: "Firefly Aerospace Blue Ghost",
    contractor: "Firefly Aerospace",
    program: "NASA CLPS",
    missionClass: "Medium Multi-Payload",
    wetMassKg: 1950,
    dryMassKg: 780,
    payloadCapacityKg: 155,
    dimensions: {
      heightMeters: 2.0,
      diameterMeters: 3.5,
      landingFootprintM2: 15.0,
    },
    powerSpecs: {
      nominalBaseLoadWatts: 300,
      peakScienceWatts: 450,
      survivalHeaterWatts: 90,
      solarArrayPeakWatts: 1100,
      solarArrayOrientation: "top-mounted-flat",
      batteryCapacityWh: 2800,
      allowableBlackoutHours: 14.0,
    },
    terrainTolerances: {
      maxSlopeDeg: 10.0,
      maxObstacleHeightCm: 30,
      surfaceBearingStrengthKPa: 18,
    },
    telecomSpecs: {
      primaryBand: "X-Band",
      commArchitecture: "Direct-to-Earth (DTE)",
      txPowerWatts: 20,
      antennaGainDbi: 27.0,
      antennaType: "Steerable Parabolic High Gain X-Band Dish",
      dsnApertureRequiredM: 34,
      minLinkMarginDb: 3.5,
    },
    thermalLimits: {
      minOperatingTempKelvin: 80,
      maxOperatingTempKelvin: 385,
      cryoSurvivalMethod: "Thermal isolating standoffs, MLI blankets, automated load-shedding",
    },
    referenceMissions: [
      "Blue Ghost Mission 1 (Mare Crisium payload delivery)",
      "Blue Ghost Mission 2 (Lunar Far Side & South Pole Radio Observatory)",
    ],
  },

  "artemis-hls": {
    id: "artemis-hls",
    name: "Artemis III Human Landing System (HLS)",
    contractor: "NASA / Commercial Crew Providers",
    program: "NASA Artemis HLS",
    missionClass: "Crewed Lunar Lander",
    wetMassKg: 45000,
    dryMassKg: 18000,
    payloadCapacityKg: 5000,
    dimensions: {
      heightMeters: 16.0,
      diameterMeters: 9.0,
      landingFootprintM2: 78.5,
    },
    powerSpecs: {
      nominalBaseLoadWatts: 3500,
      peakScienceWatts: 7000,
      survivalHeaterWatts: 1800,
      solarArrayPeakWatts: 15000,
      solarArrayOrientation: "articulated-gimbal",
      batteryCapacityWh: 48000,
      allowableBlackoutHours: 42.0, // High-redundancy life-support battery reserve
    },
    terrainTolerances: {
      maxSlopeDeg: 6.0, // Ultra-conservative human-rating safety margin
      maxObstacleHeightCm: 20,
      surfaceBearingStrengthKPa: 30,
    },
    telecomSpecs: {
      primaryBand: "Ka-Band",
      commArchitecture: "Dual Direct & Relay",
      txPowerWatts: 50,
      antennaGainDbi: 34.0,
      antennaType: "Dual Ka/X-Band High-Gain Phased Array (Direct DSN & Lunar Gateway)",
      dsnApertureRequiredM: 34,
      minLinkMarginDb: 6.0,
    },
    thermalLimits: {
      minOperatingTempKelvin: 110,
      maxOperatingTempKelvin: 360,
      cryoSurvivalMethod: "Active fluid loop thermal conditioning + human habitability systems",
    },
    referenceMissions: [
      "Artemis III (First crewed South Pole landing expedition)",
      "Artemis IV (Lunar Gateway interface & extended surface stay)",
    ],
  },
};

/**
 * Result of evaluating a lander's technical compatibility against a candidate landing site
 */
export interface LanderCompatibilityAssessment {
  landerId: string;
  landerName: string;
  siteId: string;
  siteName: string;
  isFeasible: boolean;
  overallFitRating: "Fully Compatible" | "Conditionally Compatible" | "Critical Constraint Violation";
  
  // Specific compatibility margins
  slopeMarginDeg: number;             // lander.maxSlope - site.maxSlope (must be >= 0)
  cryoSurvivalMarginHours: number;    // lander.allowableBlackout - site.longestBlackout (must be >= 0)
  powerMarginWatts: number;           // estimated solar generation - nominal base load
  dteCommFeasible: boolean;           // Does site line of sight meet lander requirement
  
  riskFactors: string[];
  operationalMitigations: string[];
}

/**
 * Assesses whether a specific CLPS lander can safely operate at a target landing site
 */
export function evaluateLanderSiteCompatibility(
  lander: CLPSLanderConstraintProfile,
  site: SiteEvaluationCriteria
): LanderCompatibilityAssessment {
  const riskFactors: string[] = [];
  const operationalMitigations: string[] = [];

  // 1. Slope Check
  const slopeMarginDeg = Number((lander.terrainTolerances.maxSlopeDeg - site.maxSlopeDeg).toFixed(1));
  if (slopeMarginDeg < 0) {
    riskFactors.push(
      `CRITICAL SLOPE HAZARD: Site peak slope (${site.maxSlopeDeg}°) exceeds ${lander.name} tip-over limit (${lander.terrainTolerances.maxSlopeDeg}°).`
    );
    operationalMitigations.push(
      "Tighten landing ellipse targeting; enforce terminal LIDAR hazard avoidance to avoid crater walls."
    );
  } else if (slopeMarginDeg < 2.0) {
    riskFactors.push(
      `NARROW SLOPE MARGIN: Site slope (${site.maxSlopeDeg}°) is close to ${lander.name} threshold (${lander.terrainTolerances.maxSlopeDeg}°).`
    );
  }

  // 2. Cryogenic Blackout Survival Check
  const cryoSurvivalMarginHours = Number(
    (lander.powerSpecs.allowableBlackoutHours - site.longestBlackoutHours).toFixed(1)
  );
  if (cryoSurvivalMarginHours < 0) {
    riskFactors.push(
      `CRYOGENIC OVER-DISCHARGE RISK: Site blackout period (${site.longestBlackoutHours}h) exceeds lander survival battery threshold (${lander.powerSpecs.allowableBlackoutHours}h).`
    );
    operationalMitigations.push(
      `Shed non-essential avionics loads; reduce internal heater setpoint from 270K to 240K during ${site.longestBlackoutHours}h shadow entry.`
    );
  }

  // 3. Telecommunication Line-of-Sight Check
  const dteCommFeasible = site.dteVisibilityPercent >= 80 && site.minEarthElevationDeg >= 0;
  if (!dteCommFeasible) {
    riskFactors.push(
      `COMMUNICATION OCCULTATION: DTE visibility (${site.dteVisibilityPercent}%) or libration minimum (${site.minEarthElevationDeg}°) interrupts continuous ground contact.`
    );
    operationalMitigations.push(
      "Store scientific telemetry in onboard NAND flash memory during libration dips; execute burst downlink when Earth elevation rises > 2.0°."
    );
  }

  // 4. Power Balance Estimation
  // Approximate effective generation: solarArrayPeakWatts * cosine factor (~0.6 for grazing angle) * annualSunPercent / 100
  const estimatedPowerGenWatts = Math.round(
    lander.powerSpecs.solarArrayPeakWatts * 0.65 * (site.annualSunPercent / 100)
  );
  const powerMarginWatts = estimatedPowerGenWatts - lander.powerSpecs.nominalBaseLoadWatts;
  if (powerMarginWatts < 0) {
    riskFactors.push(
      `NET NEGATIVE POWER BALANCE: Average generated power (${estimatedPowerGenWatts}W) cannot support baseline load (${lander.powerSpecs.nominalBaseLoadWatts}W).`
    );
    operationalMitigations.push(
      "Operate science payloads in duty-cycled intervals; align cylindrical array to face cardinal sun azimuth."
    );
  }

  // Overall rating determination
  let overallFitRating: LanderCompatibilityAssessment["overallFitRating"] = "Fully Compatible";
  let isFeasible = true;

  if (slopeMarginDeg < -1.0 || cryoSurvivalMarginHours < -10.0) {
    overallFitRating = "Critical Constraint Violation";
    isFeasible = false;
  } else if (riskFactors.length > 0) {
    overallFitRating = "Conditionally Compatible";
  }

  return {
    landerId: lander.id,
    landerName: lander.name,
    siteId: site.siteId,
    siteName: site.siteName,
    isFeasible,
    overallFitRating,
    slopeMarginDeg,
    cryoSurvivalMarginHours,
    powerMarginWatts,
    dteCommFeasible,
    riskFactors,
    operationalMitigations,
  };
}

/**
 * Retrieve lander profile by identifier
 */
export function getCLPSProfile(id: string): CLPSLanderConstraintProfile | undefined {
  return CLPS_LANDER_PROFILES[id];
}

/**
 * Get list of all available lander profiles
 */
export function getAllCLPSProfiles(): CLPSLanderConstraintProfile[] {
  return Object.values(CLPS_LANDER_PROFILES);
}



// ============================================================================
// NASA VIPER & Artemis LTV Heavy Surface Carrier Profile (Milestone 100)
// ============================================================================
export const NASA_VIPER_LTV_PROFILE: CLPSLanderConstraintProfile = {
  id: "viper-ltv-carrier",
  name: "Griffin-VIPER / Artemis LTV Rover Carrier",
  contractor: "Astrobotic & NASA Glenn / Johnson Space Center",
  program: "NASA CLPS",
  missionClass: "Heavy Cargo & Rover Carrier",
  wetMassKg: 5900,
  dryMassKg: 1950,
  payloadCapacityKg: 500,
  dimensions: {
    heightMeters: 4.5,
    diameterMeters: 4.2,
    landingFootprintM2: 18.5,
  },
  powerSpecs: {
    nominalBaseLoadWatts: 450,
    peakScienceWatts: 850,
    survivalHeaterWatts: 180,
    solarArrayPeakWatts: 1200,
    solarArrayOrientation: "articulated-gimbal",
    batteryCapacityWh: 15000,
    allowableBlackoutHours: 54, // Extended cryogenic PSR shadow dwell
  },
  terrainTolerances: {
    maxSlopeDeg: 12.0,
    maxObstacleHeightCm: 35,
    surfaceBearingStrengthKPa: 18.0,
  },
  telecomSpecs: {
    primaryBand: "X-Band",
    commArchitecture: "Dual Direct & Relay",
    txPowerWatts: 25,
    antennaGainDbi: 28.5,
    antennaType: "High-Gain Steerable Parabolic",
    dsnApertureRequiredM: 34,
    minLinkMarginDb: 4.2,
  },
  thermalLimits: {
    minOperatingTempKelvin: 40,
    maxOperatingTempKelvin: 395,
    cryoSurvivalMethod: "RHU (Radioisotope Heater Unit) & Multi-Layer Insulation",
  },
  referenceMissions: ["NASA VIPER South Pole Traverse", "Artemis III/IV LTV Deployment", "Nobile Crater Ice Drill"],
};

// Auto-register to global profiles directory
CLPS_LANDER_PROFILES["viper-ltv-carrier"] = NASA_VIPER_LTV_PROFILE;
