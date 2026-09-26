/**
 * Multi-Criteria Decision Analysis (MCDA) Site Scoring Engine
 * SelenSync — NASA Space Apps Challenge 2026 (CLPS Lunar Mission Browser)
 * 
 * Lead Mission Strategist: Afshara Tasneem Zoa
 * Strategy & Research Lead, CFSBR SpaceWeb
 * 
 * Evaluates lunar South Pole landing candidates on a normalized 0–100 Feasibility Index
 * based on multi-variable trade-offs between illumination stability, Earth communications,
 * topographic slope hazards, and proximity to Permanently Shadowed Regions (PSRs).
 */

export interface SiteEvaluationCriteria {
  siteId: string;
  siteName: string;
  latitude: number;             // Lunar South Pole: -80° to -90° S
  longitude: number;            // Selenographic longitude: -180° to +180°
  elevationMeters?: number;     // LOLA topography relative to reference sphere (1737.4 km)
  
  // 1. Solar Illumination Metrics (40% Weight)
  annualSunPercent: number;      // % of lunar synodic year illuminated (0-100)
  continuousDaylightHours: number; // Longest uninterrupted daylight window
  longestBlackoutHours: number;   // Longest consecutive topographic shadow period
  meanSolarElevationDeg: number;  // Mean topocentric elevation (typically 1.5° - 3.5°)

  // 2. Direct-to-Earth (DTE) Comms Metrics (30% Weight)
  dteVisibilityPercent: number;   // Line-of-Sight visibility to Earth considering lunar libration (0-100)
  meanEarthElevationDeg: number;  // Average topocentric Earth elevation angle
  minEarthElevationDeg: number;   // Minimum Earth elevation at lowest libration excursion

  // 3. Topographic Hazard / Slope Metrics (20% Weight)
  meanSlopeDeg: number;          // Mean surface slope across landing ellipse
  maxSlopeDeg: number;           // Maximum peak slope (>10° represents tip-over hazard)
  craterRimMaskHeightDeg?: number; // Average surrounding obstacle elevation angle

  // 4. Scientific Merit & PSR Proximity (10% Weight)
  psrDistanceKm: number;         // Distance in km to nearest cold trap / PSR boundary
  volatileConfidencePercent: number; // Estimated water-ice abundance confidence (0-100)
  scienceThemes?: string[];      // Relevant NASA Artemis III science objectives
}

export interface ScoringBreakdown {
  solarScore: number;           // Normalized 0–100
  solarWeighted: number;        // Scaled to 40% weight (0–40)
  dteScore: number;             // Normalized 0–100
  dteWeighted: number;          // Scaled to 30% weight (0–30)
  slopeScore: number;           // Normalized 0–100
  slopeWeighted: number;        // Scaled to 20% weight (0–20)
  scienceScore: number;         // Normalized 0–100
  scienceWeighted: number;      // Scaled to 10% weight (0–10)
  penalties: Array<{
    category: "solar" | "dte" | "slope" | "science";
    deduction: number;
    rationale: string;
  }>;
}

export type QualitativeVerdict =
  | "Optimal Mission Candidate (High Power / Prime Comms)"
  | "Viable with Operational Constraints (Moderate Blackout Risk)"
  | "High-Risk Zone (Requires Relay Satellites or RTG Support)";

export interface FeasibilityScoreResult {
  siteId: string;
  siteName: string;
  feasibilityIndex: number;     // 0–100 Composite Score
  breakdown: ScoringBreakdown;
  verdict: QualitativeVerdict;
  strategicRecommendations: string[];
  missionFitSummary: string;
  evaluatedAt: string;
}

// Evaluation Weights Config
export const MCDA_WEIGHTS = {
  SOLAR: 0.40,
  DTE: 0.30,
  SLOPE: 0.20,
  SCIENCE: 0.10,
} as const;

/**
 * Computes the Solar Illumination sub-score (0-100)
 * Evaluates annual sun percentage, continuous daylight duration, and penalizes severe blackout periods.
 */
export function computeSolarScore(criteria: SiteEvaluationCriteria): {
  score: number;
  penalties: ScoringBreakdown["penalties"];
} {
  const penalties: ScoringBreakdown["penalties"] = [];
  
  // Base score heavily driven by annual illumination percentage
  let score = criteria.annualSunPercent;

  // Bonus for sustained daylight windows (>= 240 hours / 10 Earth days)
  if (criteria.continuousDaylightHours >= 240) {
    score += 5;
  } else if (criteria.continuousDaylightHours < 72) {
    const deduction = 12;
    score -= deduction;
    penalties.push({
      category: "solar",
      deduction,
      rationale: `Brief continuous daylight window (${criteria.continuousDaylightHours}h) limits solar recharge window.`,
    });
  }

  // Blackout penalty: South Pole landers without RTGs suffer severe cryogenic risk if shadow > 24 hours
  if (criteria.longestBlackoutHours > 48) {
    const deduction = Math.min(25, (criteria.longestBlackoutHours - 48) * 0.4 + 10);
    score -= deduction;
    penalties.push({
      category: "solar",
      deduction: Number(deduction.toFixed(1)),
      rationale: `Prolonged blackout duration (${criteria.longestBlackoutHours}h) exceeds standard commercial battery endurance.`,
    });
  } else if (criteria.longestBlackoutHours > 24) {
    const deduction = 6;
    score -= deduction;
    penalties.push({
      category: "solar",
      deduction,
      rationale: `Moderate blackout period (${criteria.longestBlackoutHours}h) requires secondary battery cycling reserves.`,
    });
  }

  // Grazing angle penalty if mean solar elevation is sub-critical (< 1.5°)
  if (criteria.meanSolarElevationDeg < 1.5) {
    const deduction = 8;
    score -= deduction;
    penalties.push({
      category: "solar",
      deduction,
      rationale: `Extremely low grazing solar angle (${criteria.meanSolarElevationDeg.toFixed(1)}°) amplifies regolith dust cosine losses.`,
    });
  }

  return {
    score: Math.max(0, Math.min(100, Number(score.toFixed(1)))),
    penalties,
  };
}

/**
 * Computes Direct-to-Earth (DTE) RF Comms sub-score (0-100)
 * Evaluates line-of-sight visibility percentage and Earth elevation margin against crater obstacle masks.
 */
export function computeDTEScore(criteria: SiteEvaluationCriteria): {
  score: number;
  penalties: ScoringBreakdown["penalties"];
} {
  const penalties: ScoringBreakdown["penalties"] = [];
  
  // Baseline score driven by line-of-sight percentage
  let score = criteria.dteVisibilityPercent;

  // Libration excursion penalty: If Earth dips below 0° topocentric elevation, DTE communication cuts out
  if (criteria.minEarthElevationDeg < 0) {
    const deduction = 18;
    score -= deduction;
    penalties.push({
      category: "dte",
      deduction,
      rationale: `Lunar libration drives Earth below local horizon (min ${criteria.minEarthElevationDeg.toFixed(1)}°), inducing periodic RF occultation.`,
    });
  } else if (criteria.minEarthElevationDeg < 1.5) {
    const deduction = 8;
    score -= deduction;
    penalties.push({
      category: "dte",
      deduction,
      rationale: `Low minimum Earth elevation (${criteria.minEarthElevationDeg.toFixed(1)}°) risks multipath regolith interference.`,
    });
  }

  // Bonus for near-continuous line of sight (>= 90%)
  if (criteria.dteVisibilityPercent >= 90) {
    score += 5;
  }

  return {
    score: Math.max(0, Math.min(100, Number(score.toFixed(1)))),
    penalties,
  };
}

/**
 * Computes Topographic Slope & Landing Safety sub-score (0-100)
 * Standard CLPS landing legs tolerate up to 10° slopes; steeper slopes trigger severe landing failure risk.
 */
export function computeSlopeScore(criteria: SiteEvaluationCriteria): {
  score: number;
  penalties: ScoringBreakdown["penalties"];
} {
  const penalties: ScoringBreakdown["penalties"] = [];
  
  // Ideal flat terrain is <= 3° slope (Score ~ 100)
  let score = 100 - criteria.meanSlopeDeg * 6;

  // Peak slope penalty within landing ellipse (> 10° is critical hazard)
  if (criteria.maxSlopeDeg > 15) {
    const deduction = 30;
    score -= deduction;
    penalties.push({
      category: "slope",
      deduction,
      rationale: `Severe terrain gradient (max slope ${criteria.maxSlopeDeg}°) exceeds structural tip-over safety thresholds.`,
    });
  } else if (criteria.maxSlopeDeg > 10) {
    const deduction = 15;
    score -= deduction;
    penalties.push({
      category: "slope",
      deduction,
      rationale: `Localized slope peak (${criteria.maxSlopeDeg}°) exceeds 10° nominal landing gear tolerance.`,
    });
  }

  return {
    score: Math.max(0, Math.min(100, Number(score.toFixed(1)))),
    penalties,
  };
}

/**
 * Computes Scientific Merit & Volatiles / PSR Proximity sub-score (0-100)
 * Evaluates proximity to cold traps containing water ice and surface volatile concentrations.
 */
export function computeScienceScore(criteria: SiteEvaluationCriteria): {
  score: number;
  penalties: ScoringBreakdown["penalties"];
} {
  const penalties: ScoringBreakdown["penalties"] = [];
  
  // Proximity scoring curve: < 2km = 95-100, 2-5km = 80-90, 5-15km = 60-75, > 20km = lower
  let proximityBase: number;
  if (criteria.psrDistanceKm <= 2.0) {
    proximityBase = 95;
  } else if (criteria.psrDistanceKm <= 5.0) {
    proximityBase = 85;
  } else if (criteria.psrDistanceKm <= 12.0) {
    proximityBase = 70;
  } else if (criteria.psrDistanceKm <= 25.0) {
    proximityBase = 50;
  } else {
    proximityBase = 30;
    penalties.push({
      category: "science",
      deduction: 15,
      rationale: `Substantial distance to volatile-bearing cold traps (${criteria.psrDistanceKm} km) limits rover ingress capabilities.`,
    });
  }

  // Weight proximity base by volatile confidence level
  const volatileWeight = criteria.volatileConfidencePercent / 100;
  const score = proximityBase * 0.7 + (criteria.volatileConfidencePercent * 0.3);

  return {
    score: Math.max(0, Math.min(100, Number(score.toFixed(1)))),
    penalties,
  };
}

/**
 * Qualitative verdict mapper based on final Feasibility Index
 */
export function generateVerdict(score: number): QualitativeVerdict {
  if (score >= 80) {
    return "Optimal Mission Candidate (High Power / Prime Comms)";
  }
  if (score >= 65) {
    return "Viable with Operational Constraints (Moderate Blackout Risk)";
  }
  return "High-Risk Zone (Requires Relay Satellites or RTG Support)";
}

/**
 * Synthesizes actionable strategic recommendations based on the scoring breakdown
 */
export function generateStrategicRecommendations(
  criteria: SiteEvaluationCriteria,
  breakdown: ScoringBreakdown,
  verdict: QualitativeVerdict
): string[] {
  const recommendations: string[] = [];

  // Solar recommendations
  if (breakdown.solarScore >= 85) {
    recommendations.push(
      "Ideal for multi-month solar endurance; vertical cylindrical solar panels will yield continuous baseline power."
    );
  } else if (criteria.longestBlackoutHours > 24) {
    recommendations.push(
      `Mitigate ${criteria.longestBlackoutHours}h cryogenic blackout: allocate secondary Li-ion reserves or program low-power sleep modes.`
    );
  }

  // Comms recommendations
  if (breakdown.dteScore >= 85) {
    recommendations.push(
      "Direct-to-Earth X-Band link supports sustained telemetry streaming without requiring Lunar Gateway or orbital relay passes."
    );
  } else if (criteria.minEarthElevationDeg < 0) {
    recommendations.push(
      "Earth dips below local crater rim during lunar libration cycle: schedule uplink burst buffers or utilize orbital relay support."
    );
  }

  // Slope recommendations
  if (criteria.maxSlopeDeg > 10) {
    recommendations.push(
      `Terrain hazard alert: Peak slope of ${criteria.maxSlopeDeg}° requires active terrain relative navigation (TRN) with hazard avoidance during terminal descent.`
    );
  } else {
    recommendations.push(
      `Favorable landing topography (mean slope ${criteria.meanSlopeDeg}°): well within standard commercial lander tip-over margins.`
    );
  }

  // Science & PSR recommendations
  if (criteria.psrDistanceKm <= 3.0) {
    recommendations.push(
      `High-priority volatile science target: located only ${criteria.psrDistanceKm} km from cold trap perimeter; ideal for tethered or autonomous rover sorties.`
    );
  }

  return recommendations;
}

/**
 * Master MCDA Landing Site Feasibility Evaluation Engine
 */
export function evaluateSiteFeasibility(criteria: SiteEvaluationCriteria): FeasibilityScoreResult {
  const solar = computeSolarScore(criteria);
  const dte = computeDTEScore(criteria);
  const slope = computeSlopeScore(criteria);
  const science = computeScienceScore(criteria);

  const solarWeighted = Number((solar.score * MCDA_WEIGHTS.SOLAR).toFixed(2));
  const dteWeighted = Number((dte.score * MCDA_WEIGHTS.DTE).toFixed(2));
  const slopeWeighted = Number((slope.score * MCDA_WEIGHTS.SLOPE).toFixed(2));
  const scienceWeighted = Number((science.score * MCDA_WEIGHTS.SCIENCE).toFixed(2));

  const totalScore = Number((solarWeighted + dteWeighted + slopeWeighted + scienceWeighted).toFixed(1));
  const verdict = generateVerdict(totalScore);

  const allPenalties = [
    ...solar.penalties,
    ...dte.penalties,
    ...slope.penalties,
    ...science.penalties,
  ];

  const breakdown: ScoringBreakdown = {
    solarScore: solar.score,
    solarWeighted,
    dteScore: dte.score,
    dteWeighted,
    slopeScore: slope.score,
    slopeWeighted,
    scienceScore: science.score,
    scienceWeighted,
    penalties: allPenalties,
  };

  const recommendations = generateStrategicRecommendations(criteria, breakdown, verdict);

  let missionFitSummary = "";
  if (verdict === "Optimal Mission Candidate (High Power / Prime Comms)") {
    missionFitSummary = `${criteria.siteName} demonstrates premier operational feasibility (${totalScore}/100) with robust solar availability and uninterrupted Earth line-of-sight. Recommended for baseline CLPS delivery.`;
  } else if (verdict === "Viable with Operational Constraints (Moderate Blackout Risk)") {
    missionFitSummary = `${criteria.siteName} is mission-capable (${totalScore}/100) but requires managed operational protocols for intermittent shadows or terrain-induced libration dips.`;
  } else {
    missionFitSummary = `${criteria.siteName} poses significant operational hazards (${totalScore}/100). Surface survival demands RTG power sources, cryogenic survival heaters, or orbital relay constellation links.`;
  }

  return {
    siteId: criteria.siteId,
    siteName: criteria.siteName,
    feasibilityIndex: totalScore,
    breakdown,
    verdict,
    strategicRecommendations: recommendations,
    missionFitSummary,
    evaluatedAt: new Date().toISOString(),
  };
}

/**
 * Pre-configured canonical candidate landing site criteria (Lunar South Pole)
 */
export const CANONICAL_SITE_CRITERIA: Record<string, SiteEvaluationCriteria> = {
  "malapert-mountain": {
    siteId: "malapert-mountain",
    siteName: "Malapert Mountain Massif",
    latitude: -85.99,
    longitude: 2.93,
    elevationMeters: 5100,
    annualSunPercent: 91.2,
    continuousDaylightHours: 320,
    longestBlackoutHours: 14,
    meanSolarElevationDeg: 2.8,
    dteVisibilityPercent: 98.4,
    meanEarthElevationDeg: 4.8,
    minEarthElevationDeg: 1.9,
    meanSlopeDeg: 3.8,
    maxSlopeDeg: 8.2,
    psrDistanceKm: 6.4,
    volatileConfidencePercent: 78,
    scienceThemes: ["Volatile Cold Traps", "Regolith Stratigraphy", "Deep Space Relay"],
  },
  "shackleton-connecting-ridge": {
    siteId: "shackleton-connecting-ridge",
    siteName: "Shackleton Connecting Ridge",
    latitude: -89.44,
    longitude: 141.0,
    elevationMeters: 4200,
    annualSunPercent: 86.5,
    continuousDaylightHours: 240,
    longestBlackoutHours: 28,
    meanSolarElevationDeg: 2.1,
    dteVisibilityPercent: 84.0,
    meanEarthElevationDeg: 3.4,
    minEarthElevationDeg: -0.4,
    meanSlopeDeg: 7.4,
    maxSlopeDeg: 12.8,
    psrDistanceKm: 1.2,
    volatileConfidencePercent: 96,
    scienceThemes: ["Permanently Shadowed Regions", "ISRU Water-Ice Drill Trials"],
  },
  "de-gerlache-rim": {
    siteId: "de-gerlache-rim",
    siteName: "de Gerlache Crater Rim",
    latitude: -88.5,
    longitude: -88.3,
    elevationMeters: 3800,
    annualSunPercent: 81.0,
    continuousDaylightHours: 195,
    longestBlackoutHours: 36,
    meanSolarElevationDeg: 1.9,
    dteVisibilityPercent: 80.5,
    meanEarthElevationDeg: 2.9,
    minEarthElevationDeg: 0.2,
    meanSlopeDeg: 4.6,
    maxSlopeDeg: 9.1,
    psrDistanceKm: 3.5,
    volatileConfidencePercent: 84,
    scienceThemes: ["Cryogenic Ice Sampling", "Artemis Human Landing Ellipse"],
  },
  "haworth-crater-rim": {
    siteId: "haworth-crater-rim",
    siteName: "Haworth Crater Rim",
    latitude: -87.4,
    longitude: -5.1,
    elevationMeters: 2900,
    annualSunPercent: 74.8,
    continuousDaylightHours: 140,
    longestBlackoutHours: 62,
    meanSolarElevationDeg: 1.6,
    dteVisibilityPercent: 76.2,
    meanEarthElevationDeg: 2.1,
    minEarthElevationDeg: -1.2,
    meanSlopeDeg: 6.2,
    maxSlopeDeg: 14.5,
    psrDistanceKm: 0.8,
    volatileConfidencePercent: 94,
    scienceThemes: ["Ultra-Cold Volatile Retention (40 Kelvin)", "Neutron Spectrometry"],
  },
};
