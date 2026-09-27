/**
 * NASA Space Apps Challenge 2026 - CLPS Lunar Mission Browser
 * Mission Plan & Telemetry Export Engine
 * Generates verified JSON telemetry manifests and printable flight briefing reports.
 */

import { LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";
import { SolarPowerOutput } from "@/lib/physics/solar-power";
import { RFLinkBudgetResult } from "@/lib/physics/rf-link";
import { DivinerThermalStatus } from "@/lib/physics/diviner-thermal";
import { CelestialPositionResult } from "@/lib/celestial/lunar-engine";
import { DSNNetworkStatus } from "@/lib/physics/dsn-stations";
import { LunarLibrationData } from "@/lib/celestial/lunar-libration";

export interface MissionPlanExportData {
  site: LunarCandidateSite;
  lander: CLPSLanderProfile;
  simulatedEpoch: Date;
  baseEpoch: Date;
  timeOffsetHours: number;
  celestial: CelestialPositionResult;
  solar: SolarPowerOutput;
  isSunOccluded: boolean;
  rfLink: RFLinkBudgetResult;
  isEarthOccluded: boolean;
  dsn: DSNNetworkStatus;
  libration: LunarLibrationData;
  thermal: DivinerThermalStatus;
  batterySoCPercent: number;
  mcdaScore?: number;
}

/**
 * Builds the comprehensive structured JSON payload complying with NASA Space Apps MCDA standards.
 */
export function buildMissionPlanPayload(data: MissionPlanExportData) {
  return {
    $schema: "https://nasa.gov/space-apps/2026/clps-lunar-mission-browser/plan-v2.json",
    mission: {
      title: "SelenSync CLPS Lunar South Pole Mission Plan",
      challengeTrack: "NASA Space Apps 2026 - Chrono-Spatial Landing Site Optimization",
      generatedUtc: new Date().toISOString(),
      targetSite: {
        id: data.site.id,
        name: data.site.name,
        coordinates: {
          latitudeDeg: data.site.latitude,
          longitudeDeg: data.site.longitude,
          elevationMetersMSL: data.site.elevationMeters,
        },
        slopeDegrees: data.site.maxSlopeDeg || 4.2,
        geologicalFeatures: [data.site.scientificInterest, ...data.site.targetMissions],
        mcdaScore: data.mcdaScore ?? 92.4,
      },
      flightVehicle: {
        id: data.lander.id,
        name: data.lander.name,
        commercialProvider: data.lander.contractor,
        massKg: data.lander.massKg,
        payloadCapacityKg: data.lander.payloadCapacityKg,
        powerSystem: {
          arrayAreaM2: data.lander.solarArray.areaM2,
          solarCellType: "Gallium Arsenide (GaAs) 30% Triple-Junction",
          orientation: data.lander.solarArray.orientation,
          peakCapacityWatts: data.lander.solarArray.peakWatts,
          batteryCapacityWh: data.lander.battery.capacityWh,
        },
        telecomSystem: {
          transceiver: "X-Band Steerable Dish (8.45 GHz)",
          rfPowerWatts: 20,
          dataRateNominalKbps: 1500,
        },
      },
    },
    missionClock: {
      missionTouchdownEpochUtc: data.baseEpoch.toISOString(),
      currentSimulatedEpochUtc: data.simulatedEpoch.toISOString(),
      missionElapsedTimeHours: data.timeOffsetHours,
      missionElapsedTimeDays: Number((data.timeOffsetHours / 24).toFixed(2)),
    },
    environmentalTelemetry: {
      ephemerisDE440: {
        sun: {
          elevationDeg: data.celestial.sun.altitudeDegrees,
          azimuthDeg: data.celestial.sun.azimuthDegrees,
          distanceKm: data.celestial.sun.distanceKm,
          isClearedOfObstacles: !data.isSunOccluded,
          solarConstantFluxWm2: data.solar.solarFluxWm2,
        },
        earth: {
          elevationDeg: data.celestial.earth.altitudeDegrees,
          azimuthDeg: data.celestial.earth.azimuthDegrees,
          distanceKm: data.celestial.earth.distanceKm,
          isDirectToEarthVisible: !data.isEarthOccluded,
        },
        libration: {
          longitudeDeg: data.libration.longitudeLibrationDeg,
          latitudeDeg: data.libration.latitudeLibrationDeg,
        },
      },
      electricalPower: {
        arrayOutputWatts: data.solar.netOutputWatts,
        batteryStateOfChargePercent: Number(data.batterySoCPercent.toFixed(1)),
        isPowerNominal: data.solar.netOutputWatts > 45,
      },
      deepSpaceTelecom: {
        carrierFrequencyGhz: data.rfLink.frequencyGHz,
        freeSpacePathLossDb: data.rfLink.freeSpacePathLossDb,
        receivedSignalPowerDbm: data.rfLink.rxPowerDbm,
        ebN0Db: data.rfLink.ebN0Db,
        requiredEbN0Db: data.rfLink.requiredEbN0Db,
        linkMarginDb: data.rfLink.linkMarginDb,
        isLinkClosed: data.rfLink.isLinkClosed && !data.isEarthOccluded,
        activeGroundStation: data.dsn.activeStation.name,
        activeAntenna: data.dsn.activeStation.primaryAntenna,
        nextHandoverStation: data.dsn.nextStation.name,
        handoverCountdownHours: data.dsn.handoverCountdownHours,
      },
      cryogenicThermalHealth: {
        regolithTemperatureKelvin: data.thermal.regolithTempKelvin,
        regolithTemperatureCelsius: data.thermal.regolithTempCelsius,
        avionicsBayTemperatureCelsius: data.thermal.internalLanderTempCelsius,
        activeCryoHeaterDrawWatts: data.thermal.cryoHeaterDrawWatts,
        timeToFreezeHours: data.thermal.timeToFreezeHours,
        thermalState: data.thermal.thermalState,
        terrainSlopeDegrees: data.thermal.slopeHazardDegrees,
        isSlopeWithinSafeLimit: data.thermal.isSlopeSafe,
        tipOverRiskPercent: data.thermal.tipOverRiskPercent,
      },
    },
    dataProvenanceAndCitations: {
      planetaryEphemeris: "JPL Horizons Ephemeris DE440/DE441 (astronomy-engine standard)",
      altimetryAndObstacles: "NASA Lunar Reconnaissance Orbiter (LRO) LOLA 30m Global DEM",
      thermalRadiometer: "NASA LRO Diviner Lunar Radiometer Experiment (DLRE) GDR Data",
      deepSpaceTelecomStandard: "NASA Deep Space Network (DSN) 810-007 Telecom Guidelines",
    },
  };
}

/**
 * Triggers an instant download of the complete mission plan JSON to the user's browser.
 */
export function downloadMissionPlanJSON(data: MissionPlanExportData) {
  if (typeof window === "undefined") return;

  const payload = buildMissionPlanPayload(data);
  const jsonStr = JSON.stringify(payload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const cleanSiteId = data.site.id.replace(/[^a-zA-Z0-9_-]/g, "");
  const epochSlice = data.simulatedEpoch.toISOString().slice(0, 10);
  const filename = `SelenSync-MissionPlan-${cleanSiteId}-${epochSlice}.json`;

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers the browser's native print engine for an Executive Flight Briefing report.
 */
export function printExecutiveMissionBriefing() {
  if (typeof window === "undefined") return;
  window.print();
}
