/**
 * Computer Science (CS) Workstream:
 * Local Horizon Elevation Obstacle Profiler (360° Azimuth Skyline) from Lunar Digital Elevation Models (DEM)
 */

export interface HorizonObstaclePoint {
  azimuthDeg: number;         // 0° to 359° in discrete steps
  horizonElevationDeg: number;// Minimum elevation angle required to clear crater rim / massif
  terrainDistanceMeters: number;
}

export interface HorizonProfileResult {
  siteId: string;
  siteName: string;
  observerLatitude: number;
  observerLongitude: number;
  observerElevationMeters: number;
  azimuthStepDeg: number;
  profile: HorizonObstaclePoint[];
  maxObstacleElevationDeg: number;
  minObstacleElevationDeg: number;
  averageHorizonDeg: number;
}

/**
 * Checks if a celestial body (Sun or Earth) is occluded by local topography (crater walls, ridges).
 *
 * @param bodyAltitudeDeg Target body elevation
 * @param bodyAzimuthDeg Target body azimuth
 * @param horizonProfile Precomputed 360° horizon profile array
 * @returns boolean: true if visible above topography, false if shadowed/occluded
 */
export function isBodyClearedOfTopography(
  bodyAltitudeDeg: number,
  bodyAzimuthDeg: number,
  horizonProfile: HorizonObstaclePoint[]
): boolean {
  if (bodyAltitudeDeg <= 0) return false;

  const normalizedAzimuth = ((bodyAzimuthDeg % 360) + 360) % 360;
  // Find closest azimuth bucket
  const closestPoint = horizonProfile.reduce((prev, curr) => {
    const prevDiff = Math.abs(prev.azimuthDeg - normalizedAzimuth);
    const currDiff = Math.abs(curr.azimuthDeg - normalizedAzimuth);
    return currDiff < prevDiff ? curr : prev;
  });

  return bodyAltitudeDeg > closestPoint.horizonElevationDeg;
}

/**
 * Generates an analytical synthetic horizon elevation mask for South Pole landing candidates
 * based on LOLA 128ppd topographic slopes.
 * (Will be integrated with raw Geotiff / LOLA grid parser by CS team).
 */
export function generateSyntheticHorizonProfile(
  siteId: string,
  lat: number,
  lon: number,
  elevMeters: number,
  stepDeg: number = 5
): HorizonProfileResult {
  const profile: HorizonObstaclePoint[] = [];
  let maxElev = -90;
  let minElev = 90;
  let sumElev = 0;

  // Analytical representation of crater rim relief
  const isMalapert = Math.abs(lat - -85.99) < 0.5;
  const isShackleton = Math.abs(lat - -89.9) < 0.5;

  for (let az = 0; az < 360; az += stepDeg) {
    let obstacleDeg = 0;

    if (isMalapert) {
      // Malapert Mountain is high elevation (massif), has low horizon obstruction (0.5° - 1.8°)
      obstacleDeg = 0.8 + 0.6 * Math.sin(((az + 45) * Math.PI) / 180);
    } else if (isShackleton) {
      // Shackleton ridge has crater rim walls rising 2° - 4.5° towards southern azimuths
      obstacleDeg = 1.5 + 2.2 * Math.cos(((az - 180) * Math.PI) / 180);
    } else {
      // General highland terrain profile
      obstacleDeg = 1.2 + 1.0 * Math.sin((az * 2 * Math.PI) / 180);
    }

    obstacleDeg = Math.max(0.2, Number(obstacleDeg.toFixed(2)));
    maxElev = Math.max(maxElev, obstacleDeg);
    minElev = Math.min(minElev, obstacleDeg);
    sumElev += obstacleDeg;

    profile.push({
      azimuthDeg: az,
      horizonElevationDeg: obstacleDeg,
      terrainDistanceMeters: Math.round(15000 + 10000 * Math.sin((az * Math.PI) / 180)),
    });
  }

  return {
    siteId,
    siteName: isMalapert ? "Malapert Mountain" : isShackleton ? "Shackleton Ridge" : "South Pole Candidate",
    observerLatitude: lat,
    observerLongitude: lon,
    observerElevationMeters: elevMeters,
    azimuthStepDeg: stepDeg,
    profile,
    maxObstacleElevationDeg: Number(maxElev.toFixed(2)),
    minObstacleElevationDeg: Number(minElev.toFixed(2)),
    averageHorizonDeg: Number((sumElev / profile.length).toFixed(2)),
  };
}
