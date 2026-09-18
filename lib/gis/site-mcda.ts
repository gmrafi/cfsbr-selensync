/**
 * Multi-Criteria Decision Analysis (MCDA) Matrix for Lunar South Pole Landing Sites
 * Weighted scientific scoring model:
 * Power (40%) + Comms (30%) + Slope Hazard (20%) + PSR Science & Volatiles (10%)
 */

export interface SiteMCDAScore {
  siteId: string;
  siteName: string;
  powerScore: number;       // Out of 100 (weighted 0.40)
  commsScore: number;       // Out of 100 (weighted 0.30)
  slopeScore: number;       // Out of 100 (weighted 0.20)
  scienceScore: number;     // Out of 100 (weighted 0.10)
  compositeScore: number;   // Total weighted score
  rank: number;
  recommendation: string;
  slopeDeg: number;
  annualSunPercent: number;
}

export const SITE_MCDA_DATA: Record<string, Omit<SiteMCDAScore, "compositeScore" | "rank">> = {
  "malapert-mountain": {
    siteId: "malapert-mountain",
    siteName: "Malapert Mountain Massif",
    powerScore: 94,
    commsScore: 98,
    slopeScore: 88,
    scienceScore: 78,
    slopeDeg: 3.8,
    annualSunPercent: 91.2,
    recommendation: "OPTIMAL BASE: Near-continuous Earth visibility & solar stability.",
  },
  "shackleton-ridge": {
    siteId: "shackleton-ridge",
    siteName: "Shackleton Connecting Ridge",
    powerScore: 88,
    commsScore: 84,
    slopeScore: 72,
    scienceScore: 98,
    slopeDeg: 7.4,
    annualSunPercent: 86.5,
    recommendation: "HIGH SCIENCE: Direct access to Shackleton volatile-rich PSR cold traps.",
  },
  "de-gerlache-rim": {
    siteId: "de-gerlache-rim",
    siteName: "de Gerlache Crater Rim",
    powerScore: 82,
    commsScore: 80,
    slopeScore: 85,
    scienceScore: 84,
    slopeDeg: 4.6,
    annualSunPercent: 81.0,
    recommendation: "BALANCED TRAVERSE: Gentle slopes toward cryogenic ice prospects.",
  },
  "haworth-rim": {
    siteId: "haworth-rim",
    siteName: "Haworth Crater Rim",
    powerScore: 74,
    commsScore: 76,
    slopeScore: 79,
    scienceScore: 92,
    slopeDeg: 6.2,
    annualSunPercent: 74.8,
    recommendation: "DEEP CRYO TARGET: Extreme cold traps (40K) for ISRU drill trials.",
  },
};

export function calculateMCDARankings(): SiteMCDAScore[] {
  const scores: SiteMCDAScore[] = Object.values(SITE_MCDA_DATA).map((item) => {
    const composite = item.powerScore * 0.40 +
                      item.commsScore * 0.30 +
                      item.slopeScore * 0.20 +
                      item.scienceScore * 0.10;
    return {
      ...item,
      compositeScore: Number(composite.toFixed(1)),
      rank: 0,
    };
  });

  // Sort descending
  scores.sort((a, b) => b.compositeScore - a.compositeScore);
  scores.forEach((s, idx) => {
    s.rank = idx + 1;
  });

  return scores;
}
