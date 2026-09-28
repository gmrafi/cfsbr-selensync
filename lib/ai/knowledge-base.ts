/**
 * Asteria AI Mission Strategist — Scientific & Strategic Knowledge Base
 * SelenSync — NASA Space Apps Challenge 2026 (CLPS Lunar Mission Browser)
 * 
 * Lead Mission Strategists: Afshara Tasneem Zoa & Labiba Mahzabin
 * Strategy & Research Lead, CFSBR SpaceWeb
 * 
 * Synthesizes authoritative planetary science and mission engineering rules from:
 * 1. NASA Artemis III Science Definition Report (NASA/SP-20205009602)
 * 2. NASA CLPS (Commercial Lunar Payload Services) Payload Operations Protocols
 * 3. JPL Deep Space Network (DSN) 810-005 Telecom Link Design Handbook
 * 4. LRO LOLA (Lunar Orbiter Laser Altimeter) Topographic & Illumination Datasets
 */

import { FeasibilityScoreResult, SiteEvaluationCriteria } from "@/lib/strategy/site-scoring";
import { CLPSLanderConstraintProfile } from "@/lib/data/clps-profiles";

/**
 * Core Lunar South Pole Environmental & Celestial Constants
 */
export const LUNAR_SOUTH_POLE_ENVIRONMENT = {
  axialTiltDeg: 1.5424, // Small obliquity to the ecliptic causing grazing solar angles
  grazingSolarElevationMinDeg: 1.5,
  grazingSolarElevationMaxDeg: 3.5,
  meanSynodicMonthDays: 29.53059, // 708.7 hours per full lunar day/night cycle
  diurnalThermalRangeKelvin: {
    sunlitRegolithMax: 390,      // ~117°C during peak illumination
    shadowedRegolithMin: 40,     // ~ -233°C in PSR cold traps (one of the coldest spots in the Solar System)
    subsurfaceEquilibrium: 220,  // ~ -53°C at 1 meter depth
  },
  solarConstantAM0WattsM2: 1361.0, // Top of atmosphere / lunar surface AM0 irradiance
  regolithDustDepositionFactor: 0.92, // 8% optical transmission loss from electrostatic regolith dust
  lunarRadiusKm: 1737.4,
  gravityMPerS2: 1.62,
} as const;

/**
 * Authoritative Artemis III Science Objectives (NASA SP-20205009602)
 */
export const ARTEMIS_III_SCIENCE_OBJECTIVES = [
  {
    code: "GOAL-1",
    theme: "Understanding Planetary Processes",
    description: "Investigating the impact history, crater morphology, and regolith churning of the South Pole-Aitken (SPA) basin.",
  },
  {
    code: "GOAL-2",
    theme: "Lunar Volatiles & Cryogenic Retention",
    description: "Determining the origin, abundance, chemical composition, and isotopic ratios of water ice in Permanently Shadowed Regions (PSRs).",
  },
  {
    code: "GOAL-3",
    theme: "Direct-to-Earth Telecommunications & Libration Stability",
    description: "Establishing high-rate X/Ka-band RF telemetry links back to NASA DSN 34m/70m aperture ground stations across libration cycles.",
  },
  {
    code: "GOAL-4",
    theme: "ISRU (In-Situ Resource Utilization) Precursor Operations",
    description: "Validating regolith volatiles extraction, microwave sintering, and autonomous landing hazard mitigation for sustained Artemis basecamps.",
  },
];

/**
 * Deep Space Network (DSN) Operational Reference Stations
 */
export const DSN_GROUND_STATIONS = [
  {
    id: "goldstone",
    name: "Goldstone Deep Space Communications Complex",
    location: "Mojave Desert, California, USA",
    apertures: ["DSS-14 (70m)", "DSS-24 (34m BWG)", "DSS-26 (34m BWG)"],
    primaryBand: "X-Band (8.45 GHz)",
  },
  {
    id: "madrid",
    name: "Madrid Deep Space Communications Complex",
    location: "Robledo de Chavela, Spain",
    apertures: ["DSS-63 (70m)", "DSS-65 (34m HEF)", "DSS-54 (34m BWG)"],
    primaryBand: "X-Band (8.45 GHz)",
  },
  {
    id: "canberra",
    name: "Canberra Deep Space Communication Complex",
    location: "Tidbinbilla, Australian Capital Territory",
    apertures: ["DSS-43 (70m)", "DSS-34 (34m BWG)", "DSS-36 (34m BWG)"],
    primaryBand: "X-Band (8.45 GHz)",
  },
];

/**
 * Core Strategic Heuristics used by Asteria AI to advise flight directors
 */
export const STRATEGIC_HEURISTICS = {
  /**
   * Explains why grazing solar elevation angles (1.5°–3.5°) cause moving crater rim shadows
   */
  explainGrazingSunShadows: (): string => {
    return (
      `Because the Moon's axial obliquity to the ecliptic is only 1.54°, the Sun never climbs high in the polar sky. ` +
      `Instead, it skims along the local horizon at grazing topocentric elevations typically between 1.5° and 3.5°. ` +
      `At an elevation angle of θ = 2.0°, an obstacle such as a 2,000-meter crater rim or massif casts a shadow length ` +
      `of L = h / tan(θ) ≈ 57.3 kilometers across the surface. ` +
      `As the sub-solar longitude moves ~0.55° per Earth day, these colossal shadows sweep continuously across the terrain. ` +
      `A lander resting on a crater floor will experience abrupt, prolonged cryogenic blackouts, while massifs like ` +
      `Malapert Mountain (elevation >5,000m) project above the shadow horizon to achieve over 90% annual illumination.`
    );
  },

  /**
   * Calculates emergency battery reserves and survival duration when terrain blocks DSN line-of-sight
   */
  calculateEmergencyBatteryReserves: (
    batteryCapacityWh: number,
    baseLoadWatts: number,
    survivalHeaterWatts: number,
    blackoutHours: number
  ): {
    totalPowerConsumptionWatts: number;
    requiredEnergyWh: number;
    remainingCapacityWh: number;
    depthOfDischargePercent: number;
    isSurvivalViable: boolean;
    operationalAdvice: string;
  } => {
    const totalPowerConsumptionWatts = baseLoadWatts + survivalHeaterWatts;
    const requiredEnergyWh = totalPowerConsumptionWatts * blackoutHours;
    const remainingCapacityWh = batteryCapacityWh - requiredEnergyWh;
    const depthOfDischargePercent = Number(((requiredEnergyWh / batteryCapacityWh) * 100).toFixed(1));
    const isSurvivalViable = depthOfDischargePercent <= 80.0; // Standard Li-ion 80% maximum depth of discharge for spaceflight

    let operationalAdvice = "";
    if (depthOfDischargePercent <= 50.0) {
      operationalAdvice = `Optimal battery reserve: Depth of discharge is only ${depthOfDischargePercent}%. Primary and secondary science payloads can remain on standby during shadow.`;
    } else if (depthOfDischargePercent <= 80.0) {
      operationalAdvice = `Manageable discharge (${depthOfDischargePercent}% DoD): Shed non-critical scientific instruments and disable telemetry transmitters to conserve cell chemistry.`;
    } else {
      operationalAdvice = `CRITICAL BATTERY DEFICIT: Projected DoD of ${depthOfDischargePercent}% exceeds safe 80% cell limit by ${(depthOfDischargePercent - 80).toFixed(1)}%. Immediate load-shedding required: power down avionics to deep sleep mode and reduce heater threshold to prevent irreversible cell freezing below 253K.`;
    }

    return {
      totalPowerConsumptionWatts,
      requiredEnergyWh,
      remainingCapacityWh,
      depthOfDischargePercent,
      isSurvivalViable,
      operationalAdvice,
    };
  },

  /**
   * Formulates specific mitigation advice when an operator selects a high-risk landing site
   */
  formulateRiskMitigationAdvice: (
    site: SiteEvaluationCriteria,
    scoreResult: FeasibilityScoreResult,
    lander?: CLPSLanderConstraintProfile
  ): string[] => {
    const advice: string[] = [];

    // 1. High Slope Mitigation
    if (site.maxSlopeDeg > 10.0) {
      advice.push(
        `[TERRAIN HAZARD - SLOPE ${site.maxSlopeDeg}°]: High risk of dynamic tip-over on touchdown. ` +
        `Enforce real-time optical/LIDAR Hazard Detection and Avoidance (HDA) during terminal descent. ` +
        `Constrain touchdown horizontal velocity to < 0.4 m/s and divert to localized landing terraces with slopes < 6°.`
      );
    }

    // 2. Prolonged Blackout Mitigation
    if (site.longestBlackoutHours > 24.0) {
      advice.push(
        `[CRYOGENIC BLACKOUT - ${site.longestBlackoutHours}h]: Shadow duration threatens to freeze avionics and cold-trap propulsion lines. ` +
        `Transition lander bus into 'Survival Hibernation Mode': disable payload buses, orient vertical solar arrays to the expected ingress azimuth, ` +
        `and utilize phase-change thermal materials or secondary Li-ion survival banks to power thermal loop heaters.`
      );
    }

    // 3. Comms / Earth Libration Mitigation
    if (site.minEarthElevationDeg < 0.5) {
      advice.push(
        `[COMMUNICATION OCCULTATION - MIN ELEVATION ${site.minEarthElevationDeg}°]: Terrestrial libration causes Earth to dip near or beneath the obstacle horizon. ` +
        `Pre-program autonomous operational sequences during Earth blackout windows. ` +
        `Buffer science telemetry in high-reliability radiation-tolerant solid-state recorders, and schedule high-throughput burst transmissions ` +
        `during positive libration peaks when Earth elevation exceeds 3.0°.`
      );
    }

    // 4. Volatile Sampling Opportunity
    if (site.psrDistanceKm <= 2.0) {
      advice.push(
        `[PRIME SCIENCE SORTIE]: Candidate is within ${site.psrDistanceKm} km of water-ice bearing PSRs. ` +
        `Deploy surface rovers (VIPER or scout micro-rovers) into the shadowed crater rim using headlights and secondary battery packs ` +
        `to acquire neutron spectrometer ground-truth data.`
      );
    }

    return advice;
  },
};
