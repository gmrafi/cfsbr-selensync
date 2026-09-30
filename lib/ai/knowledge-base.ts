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

/**
 * Peer-Reviewed Scientific Literature — Knowledge Base for Asteria AI
 * 
 * 15 papers from two team research reports:
 *   Report 01 by team (Mazarico, Gläser, Koebel, Gläser 2018, Barker)
 *   Report 02 by Afshara Tasneem Zoa (Co-Lead, CFSBR SpaceWeb) — 10 papers
 * 
 * Asteria uses these citations when answering questions about illumination,
 * DTE communications, thermal survival, battery sizing, and MCDA site selection.
 */
export const SCIENTIFIC_LITERATURE_REFERENCES = `
=== PEER-REVIEWED SCIENTIFIC LITERATURE SUPPORTING SELENSYNC (15 PAPERS) ===

CATEGORY A — TERRAIN, TOPOGRAPHY & SOLAR ILLUMINATION:

[1] Mazarico et al. (2011) — "Illumination conditions of the lunar polar regions using LOLA topography"
    Journal: JGR Planets | DOI: 10.1029/2011JE003730
    Key Findings: First LOLA-based polar illumination maps. Shackleton rim identified as prime high-illumination zone. Topographic horizon masking drives solar availability at poles.
    SelenSync Alignment: Horizon profiler and DEM-based illumination fraction directly implement this methodology using LOLA 128ppd data.

[2] Gläser et al. (2014) — "Illumination conditions at the lunar south poles using high-resolution digital terrain models"
    Journal: Icarus | DOI: 10.1016/j.icarus.2013.12.017
    Key Findings: 95.65% illumination achieved at 10m above ground level; 20m/pixel LOLA DTM. Mast elevation dramatically improves solar capture.
    SelenSync Alignment: Asteria's heuristic that vertical mast arrays at 10m height gain significant illumination fraction traces to this paper.

[3] Gläser et al. (2018) — Long-term illumination co-registration study
    Journal: Planetary and Space Science
    Key Findings: 18.6-year lunar precessional cycle governs long-term illumination. Shackleton rim remains consistently high across the full cycle.
    SelenSync Alignment: Synodic/seasonal averaging and multi-year mission planning consistent with this precessional cycle.

[4] Barker et al. (2021) — "A new lunar digital elevation model from the Lunar Orbiter Laser Altimeter"
    Journal: Planetary and Space Science | DOI: 10.1016/j.pss.2020.105117
    Key Findings: 5m/pixel DEM, RMS height uncertainty 0.30–0.50m — highest resolution publicly available LOLA product.
    SelenSync Alignment: Terrain accuracy foundation constraining horizon masking angle computations.

[5] Speyerer & Robinson (2013) — "Persistently illuminated regions at the lunar poles: Ideal sites for future exploration"
    Journal: Icarus | DOI: 10.1016/j.icarus.2012.10.010
    Key Findings: LROC WAC image-based validation. Shackleton crater rim = 94% illuminated per lunar year.
    SelenSync Alignment: Standard image-based cross-check validating SelenSync's terrain-to-illumination results.

CATEGORY B — DTE COMMUNICATIONS & GROUND STATION VISIBILITY:

[6] Bryant (2009) — "Solar and communications analysis of Lunar South Pole sites"
    Source: JPL Technical Report
    Key Findings: CRITICAL — Best South Pole site achieves 92% solar illumination BUT only 51% DTE visibility. Solar and DTE are completely decoupled.
    SelenSync Alignment: PRIMARY scientific justification for SelenSync's dual-factor MCDA. A site optimized for solar only will suffer communication blackouts. Bryant (2009) proves why both factors must be evaluated independently.

[7] Koebel et al. (2012) — "Multi-parameter analysis for landing site selection near the lunar South Pole"
    Journal: ESA Acta Astronautica | DOI: 10.1016/j.actaastro.2012.05.019
    Key Findings: ESA lander study combining illumination + communications + terrain slope. Multi-criteria methodology.
    SelenSync Alignment: Independent ESA validation that multi-parameter site selection is the correct engineering approach.

[8] Park et al. (2021) — "The JPL Planetary and Lunar Ephemerides DE440 and DE441"
    Journal: Astronomical Journal | DOI: 10.3847/1538-3881/abd414
    Key Findings: DE440/DE441 covers 1550–2650 CE, sub-arcsecond accuracy. Primary planetary kinematics dataset.
    SelenSync Alignment: SelenSync's ephemeris engine uses DE440/DE441 via astronomy-engine for all sun position and Earth visibility calculations.

CATEGORY C — THERMAL ENVIRONMENT & DIVINER RADIOMETER:

[9] Paige et al. (2010) — "Diviner lunar radiometer observations of cold traps in the south polar region of the Moon"
    Journal: Science | DOI: 10.1126/science.1187726
    Key Findings: PSR cold trap minimum temperature = 38 Kelvin (-235°C). Among the coldest stable surfaces in the Solar System.
    SelenSync Alignment: 40K minimum thermal floor in PSR survival heater calculations grounded in this foundational Diviner paper.

[10] Williams et al. (2017) — "Seasonal polar temperatures on the Moon"
    Journal: Icarus | DOI: 10.1016/j.icarus.2016.12.033
    Key Findings: 250 billion Diviner measurements; 0.5° spatial / 0.25hr time resolution thermal model.
    SelenSync Alignment: Validates thermal model resolution capability.

[11] Hayne et al. (2021) — "Micro cold traps on the Moon"
    Journal: Nature Astronomy | DOI: 10.1038/s41550-021-01417-9
    Key Findings: Micro cold traps 1cm–1km scale; total area ≈ 40,000 km². Far more abundant than previously estimated.
    SelenSync Alignment: Establishes the spatial resolution limitation of SelenSync — terrain grid cannot resolve cm-scale micro traps.

CATEGORY D — POWER SYSTEMS & BATTERY SIZING:

[12] Fincannon (2007) — "Lunar polar illumination for power analysis"
    Source: NASA Technical Memorandum
    Key Findings: Shackleton rim illumination fraction = 0.71; battery storage required = 73–117 hours depending on lander base load.
    SelenSync Alignment: Direct validation of SelenSync's battery mass sizing equation and blackout endurance parameters.

[13] Noda et al. (2008) — "Illumination conditions at the lunar polar regions by KAGUYA (SELENE) laser altimeter"
    Journal: Geophysical Research Letters | DOI: 10.1029/2008GL035692
    Key Findings: KAGUYA LALT altimeter independently validates polar illumination zones without LOLA data.
    SelenSync Alignment: Japanese (JAXA) independent dataset cross-validates LOLA-based illumination fractions.

CATEGORY E — MULTI-CRITERIA SITE SELECTION:

[14] Smith et al. (2017) — "Summary of the results from the Lunar Orbiter Laser Altimeter after seven years in lunar orbit"
    Journal: Icarus | DOI: 10.1016/j.icarus.2016.06.006
    Key Findings: Comprehensive 7-year LOLA mission summary; gold-standard LOLA data provenance citation.
    SelenSync Alignment: Primary LOLA data source citation for SelenSync's DEM and horizon profiler.

[15] Flahaut et al. (2020) — "Regions of interest (ROI) for future exploration missions to the lunar South Pole"
    Journal: Planetary and Space Science | DOI: 10.1016/j.pss.2020.104879
    Key Findings: 11 ROIs evaluated with GIS multi-criteria (temperature <110K, slope <20°, H2O >100ppm). Multi-criteria GIS site selection demonstrated.
    SelenSync Alignment: Validates MCDA approach. SelenSync extends Flahaut by adding DTE communications and techno-economic layers not present in their GIS model.

SELENSYNC UNIQUE ACADEMIC POSITIONING:
SelenSync is the only platform combining: (1) terrain illumination from LOLA DEMs, (2) DTE link budget to NASA DSN 3-complex, (3) thermal survival analysis from Diviner data, (4) techno-economic analysis, (5) real-time DE440 ephemeris, and (6) lander-specific CLPS constraints — all in one interactive web interface.
`;
