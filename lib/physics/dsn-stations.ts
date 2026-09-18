export interface DSNStationInfo {
  id: string;
  name: string;
  location: string;
  country: string;
  latitude: number;
  longitude: number;
  primaryAntenna: string;
  secondaryAntenna: string;
  diameterMeters: number;
  elevationDeg: number;
  azimuthDeg: number;
  status: "ACTIVE" | "STANDBY" | "BELOW_HORIZON" | "HANDOFF";
  carrierSnrDb: number;
  rxMarginDb: number;
}

export interface DSNNetworkStatus {
  activeStation: DSNStationInfo;
  nextStation: DSNStationInfo;
  handoverCountdownHours: number;
  oneWayLightTimeSeconds: number;
  frequencyBand: string;
  totalUplinkPowerKw: number;
}

export const DSN_COMPLEXES = [
  {
    id: "goldstone",
    name: "Goldstone Deep Space Communications Complex",
    shortName: "Goldstone (GDSCC)",
    location: "Mojave Desert, California",
    country: "United States",
    latitude: 35.4267,
    longitude: -116.89,
    primaryAntenna: "DSS-14 (70m Mars)",
    secondaryAntenna: "DSS-24 (34m BWG)",
    diameterMeters: 70,
  },
  {
    id: "madrid",
    name: "Madrid Deep Space Communications Complex",
    shortName: "Madrid (MDSCC)",
    location: "Robledo de Chavela",
    country: "Spain",
    latitude: 40.4314,
    longitude: -4.248,
    primaryAntenna: "DSS-63 (70m)",
    secondaryAntenna: "DSS-65 (34m HEF)",
    diameterMeters: 70,
  },
  {
    id: "canberra",
    name: "Canberra Deep Space Communication Complex",
    shortName: "Canberra (CDSCC)",
    location: "Tidbinbilla, ACT",
    country: "Australia",
    latitude: -35.4014,
    longitude: 148.9817,
    primaryAntenna: "DSS-43 (70m Southern Cross)",
    secondaryAntenna: "DSS-34 (34m BWG)",
    diameterMeters: 70,
  },
];

/**
 * Calculates Moon visibility from Earth DSN complexes based on Earth's sidereal rotation and lunar position.
 */
export function calculateDSNNetworkStatus(
  simulatedDate: Date,
  lunarDistanceKm: number = 384400,
  isLunarLOSOccluded: boolean = false
): DSNNetworkStatus {
  const SPEED_OF_LIGHT_KMS = 299792.458;
  const oneWayLightTimeSeconds = Number((lunarDistanceKm / SPEED_OF_LIGHT_KMS).toFixed(3));

  // Earth rotation phase approximation (UTC hours -> Greenwich Mean Sidereal Time in degrees)
  const epoch = new Date(Date.UTC(2026, 0, 1, 0, 0, 0)).getTime();
  const hoursSinceEpoch = (simulatedDate.getTime() - epoch) / 3600000;
  const earthRotationDeg = (hoursSinceEpoch * 15.04107) % 360;

  // Approximate Moon geocentric longitude in inertial frame (moves ~13.2 deg/day)
  const moonInertialLonDeg = (hoursSinceEpoch * (13.176 / 24)) % 360;

  const stationResults: DSNStationInfo[] = DSN_COMPLEXES.map((complex) => {
    // Relative hour angle between station and Moon
    const stationEarthLon = (earthRotationDeg + complex.longitude + 360) % 360;
    const hourAngleDeg = Math.abs(stationEarthLon - moonInertialLonDeg);
    const normalizedHA = hourAngleDeg > 180 ? 360 - hourAngleDeg : hourAngleDeg;

    // Approximate elevation angle above local horizon (90 - HA with latitude projection)
    const latCos = Math.cos((complex.latitude * Math.PI) / 180);
    const rawElevation = 90 - (normalizedHA * 1.05) / Math.max(0.4, latCos);
    const elevationDeg = Number(Math.max(-30, Math.min(88, rawElevation)).toFixed(1));

    // Azimuth calculation
    const azimuthDeg = Number(((stationEarthLon - moonInertialLonDeg + 360) % 360).toFixed(1));

    let status: DSNStationInfo["status"] = "BELOW_HORIZON";
    let carrierSnrDb = 0;
    let rxMarginDb = 0;

    if (!isLunarLOSOccluded && elevationDeg >= 12) {
      status = "ACTIVE";
      carrierSnrDb = Number((34.5 + Math.sin((elevationDeg * Math.PI) / 180) * 8.2).toFixed(1));
      rxMarginDb = Number((carrierSnrDb - 14.0).toFixed(1));
    } else if (!isLunarLOSOccluded && elevationDeg >= 6) {
      status = "HANDOFF";
      carrierSnrDb = Number((24.0 + (elevationDeg - 6) * 1.5).toFixed(1));
      rxMarginDb = Number((carrierSnrDb - 14.0).toFixed(1));
    } else if (elevationDeg > 0) {
      status = "STANDBY";
    }

    return {
      id: complex.id,
      name: complex.shortName,
      location: complex.location,
      country: complex.country,
      latitude: complex.latitude,
      longitude: complex.longitude,
      primaryAntenna: complex.primaryAntenna,
      secondaryAntenna: complex.secondaryAntenna,
      diameterMeters: complex.diameterMeters,
      elevationDeg,
      azimuthDeg,
      status,
      carrierSnrDb,
      rxMarginDb,
    };
  });

  // Pick station with highest elevation as active primary, and second as next station
  const sorted = [...stationResults].sort((a, b) => b.elevationDeg - a.elevationDeg);
  const activeStation = sorted[0];
  const nextStation = sorted[1] || sorted[0];

  // Earth rotates ~15 deg/hour. Estimate hours until active station dips below 10 degrees
  const elevationAboveLimit = Math.max(0, activeStation.elevationDeg - 10);
  const handoverCountdownHours = Number((elevationAboveLimit / 11.5).toFixed(1));

  return {
    activeStation,
    nextStation,
    handoverCountdownHours,
    stations: stationResults,
    oneWayLightTimeSeconds,
    frequencyBand: "X-Band (8.45 GHz Deep Space Research)",
    totalUplinkPowerKw: 20.0,
  };
}
