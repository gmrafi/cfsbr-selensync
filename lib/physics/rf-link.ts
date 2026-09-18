/**
 * Electrical & Electronic Engineering (EEE) Workstream:
 * Direct-to-Earth (DTE) RF Link Budget & Deep Space Network (DSN) Comm Window Calculations
 */

export interface RFTransceiverSpecs {
  frequencyGHz: number;         // e.g. 8.4 GHz (X-band deep space) or 26.0 GHz (Ka-band)
  txPowerWatts: number;         // Transmitter RF power (e.g. 10W to 50W)
  txAntennaGainDbi: number;     // Lander/Rover high-gain antenna (HGA) gain (e.g. 28 dBi)
  rxGroundStation: "DSN-34m" | "DSN-70m" | "Commercial-13m";
  systemNoiseTempKelvin: number;// Receiver system noise temperature (e.g. 135K)
  dataRateKbps: number;         // Required transmission throughput in kbps (e.g. 2000 kbps for HD video)
}

export interface RFLinkBudgetResult {
  frequencyGHz: number;
  distanceKm: number;
  freeSpacePathLossDb: number; // FSPL = 20*log10(d) + 20*log10(f) + 92.45
  rxPowerDbm: number;          // Received power level at Earth ground terminal
  ebN0Db: number;              // Energy per bit to noise power spectral density ratio
  requiredEbN0Db: number;      // Threshold for QPSK/LDPC BER < 10^-6 (typically ~3.5 dB)
  linkMarginDb: number;        // Margin over threshold (healthy link requires > 3.0 dB)
  isLinkClosed: boolean;       // True if linkMarginDb >= 3.0 dB
}

export const DEFAULT_CLPS_RF_SPECS: RFTransceiverSpecs = {
  frequencyGHz: 8.45,         // X-band Space Research Band
  txPowerWatts: 20,           // 20 Watts RF (~43 dBm)
  txAntennaGainDbi: 26.5,     // 0.6m Steerable Parabolic Dish
  rxGroundStation: "DSN-34m", // Deep Space Network 34m Beam Waveguide
  systemNoiseTempKelvin: 120,
  dataRateKbps: 1500,         // 1.5 Mbps telemetry + imagery downlink
};

/**
 * Calculates free-space path loss (FSPL) in decibels.
 * Distance in km, Frequency in GHz:
 * FSPL(dB) = 20 * log10(d_km) + 20 * log10(f_GHz) + 92.45
 */
export function calculateFreeSpacePathLoss(distanceKm: number, frequencyGHz: number): number {
  if (distanceKm <= 0 || frequencyGHz <= 0) return 0;
  const fspl = 20 * Math.log10(distanceKm) + 20 * Math.log10(frequencyGHz) + 92.45;
  return Number(fspl.toFixed(2));
}

/**
 * Computes RF link margin for direct-to-Earth transmissions across the lunar distance (363,000 - 405,000 km).
 */
export function calculateDTERFLinkBudget(
  distanceKm: number,
  earthElevationDeg: number,
  specs: RFTransceiverSpecs = DEFAULT_CLPS_RF_SPECS
): RFLinkBudgetResult {
  // If Earth is below the horizon, link cannot be closed
  if (earthElevationDeg <= 0) {
    return {
      frequencyGHz: specs.frequencyGHz,
      distanceKm,
      freeSpacePathLossDb: 0,
      rxPowerDbm: -999,
      ebN0Db: -99,
      requiredEbN0Db: 3.5,
      linkMarginDb: -99,
      isLinkClosed: false,
    };
  }

  const fsplDb = calculateFreeSpacePathLoss(distanceKm, specs.frequencyGHz);
  const txPowerDbm = 10 * Math.log10(specs.txPowerWatts * 1000);
  const eirpDbm = txPowerDbm + specs.txAntennaGainDbi;

  // Ground station gain (DSN 34m at X-band ~ 68 dBi, 70m ~ 74 dBi, Commercial 13m ~ 58 dBi)
  let rxGainDbi = 68.0;
  if (specs.rxGroundStation === "DSN-70m") rxGainDbi = 74.2;
  else if (specs.rxGroundStation === "Commercial-13m") rxGainDbi = 58.5;

  // Additional atmospheric & pointing losses (dB)
  const atmosphericLossDb = 0.5;
  const pointingLossDb = 0.8;

  const rxPowerDbm = eirpDbm - fsplDb + rxGainDbi - atmosphericLossDb - pointingLossDb;

  // Boltzmann constant k = 1.380649e-23 J/K -> -228.6 dBW/(Hz*K) -> -198.6 dBm/(Hz*K)
  const kDbmHz = -198.6;
  const noisePowerDensityDbmHz = kDbmHz + 10 * Math.log10(specs.systemNoiseTempKelvin);
  const dataRateDbHz = 10 * Math.log10(specs.dataRateKbps * 1000);

  const ebN0Db = rxPowerDbm - noisePowerDensityDbmHz - dataRateDbHz;
  const requiredEbN0Db = 3.5; // Modern DVB-S2 / LDPC coding threshold
  const linkMarginDb = ebN0Db - requiredEbN0Db;

  return {
    frequencyGHz: specs.frequencyGHz,
    distanceKm: Math.round(distanceKm),
    freeSpacePathLossDb: fsplDb,
    rxPowerDbm: Number(rxPowerDbm.toFixed(2)),
    ebN0Db: Number(ebN0Db.toFixed(2)),
    requiredEbN0Db,
    linkMarginDb: Number(linkMarginDb.toFixed(2)),
    isLinkClosed: linkMarginDb >= 3.0,
  };
}
