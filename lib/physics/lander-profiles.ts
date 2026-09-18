export interface CLPSLanderProfile {
  id: string;
  name: string;
  contractor: string;
  massKg: number;
  payloadCapacityKg: number;
  solarArray: {
    areaM2: number;
    cellEfficiency: number;
    orientation: "vertical-cylinder" | "horizontal-flat" | "tilted-fixed" | "articulated-tracking";
    dustDegradationFactor: number;
    peakWatts: number;
  };
  battery: {
    capacityWh: number;
    voltageV: number;
    nominalBaseLoadWatts: number;
    cryoHeaterWatts: number;
    maxShadowHoursNominal: number;
  };
  telecom: {
    txPowerWatts: number;
    antennaGainDbi: number;
    antennaType: string;
    band: string;
    downlinkRateKbps: number;
  };
  primaryMissions: string[];
}

export const CLPS_LANDER_PROFILES: CLPSLanderProfile[] = [
  {
    id: "nova-c",
    name: "Intuitive Machines Nova-C",
    contractor: "Intuitive Machines",
    massKg: 1908,
    payloadCapacityKg: 130,
    solarArray: {
      areaM2: 2.6,
      cellEfficiency: 0.30,
      orientation: "vertical-cylinder",
      dustDegradationFactor: 0.94,
      peakWatts: 800,
    },
    battery: {
      capacityWh: 1600,
      voltageV: 28,
      nominalBaseLoadWatts: 140,
      cryoHeaterWatts: 75,
      maxShadowHoursNominal: 7.5,
    },
    telecom: {
      txPowerWatts: 15,
      antennaGainDbi: 26.5,
      antennaType: "Steerable Parabolic X-Band High Gain Dish",
      band: "X-Band (8.45 GHz)",
      downlinkRateKbps: 2000,
    },
    primaryMissions: ["IM-1 Odysseus", "IM-2 Athena (Shackleton)", "IM-3 Malapert"],
  },
  {
    id: "griffin",
    name: "Astrobotic Griffin Mission 1",
    contractor: "Astrobotic Technology",
    massKg: 6200,
    payloadCapacityKg: 475,
    solarArray: {
      areaM2: 5.2,
      cellEfficiency: 0.31,
      orientation: "vertical-cylinder",
      dustDegradationFactor: 0.96,
      peakWatts: 1650,
    },
    battery: {
      capacityWh: 4200,
      voltageV: 32,
      nominalBaseLoadWatts: 220,
      cryoHeaterWatts: 110,
      maxShadowHoursNominal: 12.8,
    },
    telecom: {
      txPowerWatts: 25,
      antennaGainDbi: 28.0,
      antennaType: "Dual-Gimbal X-Band Phased Reflector",
      band: "X-Band (8.42 GHz)",
      downlinkRateKbps: 4500,
    },
    primaryMissions: ["NASA VIPER Rover Carrier", "Artemis Polar Cargo"],
  },
  {
    id: "blue-ghost",
    name: "Firefly Blue Ghost",
    contractor: "Firefly Aerospace",
    massKg: 1950,
    payloadCapacityKg: 155,
    solarArray: {
      areaM2: 2.4,
      cellEfficiency: 0.29,
      orientation: "vertical-cylinder",
      dustDegradationFactor: 0.92,
      peakWatts: 680,
    },
    battery: {
      capacityWh: 1400,
      voltageV: 28,
      nominalBaseLoadWatts: 125,
      cryoHeaterWatts: 60,
      maxShadowHoursNominal: 7.2,
    },
    telecom: {
      txPowerWatts: 15,
      antennaGainDbi: 25.0,
      antennaType: "Body-Fixed Horn & Patch Array",
      band: "X-Band (8.45 GHz)",
      downlinkRateKbps: 1800,
    },
    primaryMissions: ["CLPS Task Order 19D", "Mare Crisium Payload"],
  },
  {
    id: "viper-rover",
    name: "NASA VIPER Polar Rover",
    contractor: "NASA Ames / Johnson Space Center",
    massKg: 430,
    payloadCapacityKg: 70,
    solarArray: {
      areaM2: 1.4,
      cellEfficiency: 0.30,
      orientation: "tilted-fixed",
      dustDegradationFactor: 0.90,
      peakWatts: 380,
    },
    battery: {
      capacityWh: 1200,
      voltageV: 28,
      nominalBaseLoadWatts: 90,
      cryoHeaterWatts: 50,
      maxShadowHoursNominal: 8.5,
    },
    telecom: {
      txPowerWatts: 10,
      antennaGainDbi: 22.0,
      antennaType: "Direct-to-Earth Steerable Mast Antenna",
      band: "X-Band (8.41 GHz)",
      downlinkRateKbps: 1000,
    },
    primaryMissions: ["Nobile Crater Ice Prospecting", "PSR Volatiles Drilling"],
  },
];
