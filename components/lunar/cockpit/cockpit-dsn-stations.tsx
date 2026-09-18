"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Radio, 
  Globe, 
  Satellite, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Antenna, 
  Clock, 
  ArrowUpRight 
} from "lucide-react";
import { DSNNetworkStatus, DSNStationInfo } from "@/lib/physics/dsn-stations";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface CockpitDSNStationsProps {
  dsnStatus: DSNNetworkStatus;
  lander: CLPSLanderProfile;
  isLunarLOSOccluded: boolean;
  rfLinkMarginDb: number;
}

export default function CockpitDSNStations({
  dsnStatus,
  lander,
  isLunarLOSOccluded,
  rfLinkMarginDb,
}: CockpitDSNStationsProps) {
  const [selectedAntennaType, setSelectedAntennaType] = useState<"34m" | "70m">("34m");

  const antennaGainBonusDb = selectedAntennaType === "70m" ? 6.2 : 0.0;
  const effectiveMarginDb = Number((rfLinkMarginDb + antennaGainBonusDb).toFixed(1));

  return (
    <div className="space-y-4">
      {/* Top Banner: Global DSN Tracking Summary */}
      <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#4e6aff]">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">NASA Deep Space Network (DSN) Active Interconnect</h3>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                GLOBAL LOCK
              </Badge>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Multi-aperture continuous coverage via Goldstone (USA), Madrid (Spain), and Canberra (Australia).
            </p>
          </div>
        </div>

        {/* Global Latency & RF Telemetry */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <span className="text-[10px] uppercase text-slate-500 block">One-Way Light Time (OWLT)</span>
            <span className="font-bold text-slate-900">{dsnStatus.oneWayLightTimeSeconds}s (~{(dsnStatus.oneWayLightTimeSeconds * 2).toFixed(3)}s RTT)</span>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-right">
            <span className="text-[10px] uppercase text-slate-500 block">Ground Antenna Mode</span>
            <div className="flex items-center gap-1 mt-0.5">
              <button
                onClick={() => setSelectedAntennaType("34m")}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  selectedAntennaType === "34m" ? "bg-blue-600 text-white" : "text-slate-600 bg-slate-200"
                }`}
              >
                34m BWG
              </button>
              <button
                onClick={() => setSelectedAntennaType("70m")}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                  selectedAntennaType === "70m" ? "bg-blue-600 text-white" : "text-slate-600 bg-slate-200"
                }`}
              >
                70m Dish
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Ground Station Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {dsnStatus.stations.map((station) => {
          const isActive = station.status === "ACTIVE" && !isLunarLOSOccluded;
          const isHandoff = station.status === "HANDOFF" && !isLunarLOSOccluded;

          return (
            <Card
              key={station.id}
              className={`border transition-all bg-white shadow-xs ${
                isActive
                  ? "border-[#4e6aff] ring-1 ring-[#4e6aff]/30"
                  : isHandoff
                  ? "border-amber-400"
                  : "border-slate-300 opacity-80"
              }`}
            >
              <CardHeader className="p-4 pb-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
                    {station.country}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-mono ${
                      isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold"
                        : isHandoff
                        ? "bg-amber-50 text-amber-700 border-amber-300 font-bold"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {isLunarLOSOccluded ? "LOS BLOCKED" : station.status}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 mt-1">{station.name}</CardTitle>
                <CardDescription className="text-xs text-slate-500">{station.location}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                {/* Elevation & Azimuth */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">Elevation</span>
                    <span
                      className={`font-bold text-sm ${
                        station.elevationDeg > 10 ? "text-emerald-700" : station.elevationDeg > 0 ? "text-amber-600" : "text-slate-400"
                      }`}
                    >
                      {station.elevationDeg > 0 ? `+${station.elevationDeg}°` : `${station.elevationDeg}°`}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 font-mono">
                    <span className="text-[10px] text-slate-500 block uppercase">Azimuth</span>
                    <span className="font-bold text-sm text-slate-800">{station.azimuthDeg}°</span>
                  </div>
                </div>

                {/* Assigned Antenna */}
                <div className="text-xs space-y-1 pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Antenna Aperture:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {selectedAntennaType === "70m" ? station.primaryAntenna : station.secondaryAntenna}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Carrier SNR:</span>
                    <span className="font-semibold text-slate-800 font-mono">
                      {isActive ? `${station.carrierSnrDb} dB-Hz` : "CARRIER UNLOCKED"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Telemetry Bitrate:</span>
                    <span className="font-semibold text-blue-700 font-mono">
                      {isActive ? `${lander.telecom.downlinkRateKbps} kbps` : "0 kbps"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lander Transceiver Link Budget Card */}
      <Card className="border border-slate-300 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Antenna className="w-4 h-4 text-[#4e6aff]" />
                Direct-to-Earth (DTE) RF Link Architecture ({lander.name})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Calculated link margin using {selectedAntennaType} DSN ground terminal at 8.45 GHz X-Band
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={`text-xs font-mono font-bold ${
                  effectiveMarginDb >= 3.0 && !isLunarLOSOccluded
                    ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                    : "bg-rose-100 text-rose-800 border-rose-200"
                }`}
              >
                LINK MARGIN: {isLunarLOSOccluded ? "0.0 dB (OCCLUDED)" : `+${effectiveMarginDb} dB`}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase block">TX Power</span>
            <span className="font-bold text-slate-900">{lander.telecom.txPowerWatts} W RF (+41.8 dBm)</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase block">Antenna Gain</span>
            <span className="font-bold text-slate-900">{lander.telecom.antennaGainDbi} dBi ({lander.telecom.antennaType.split(" ")[0]})</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase block">Modulation / Coding</span>
            <span className="font-bold text-slate-900">QPSK / LDPC Rate 1/2</span>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase block">Free-Space Path Loss</span>
            <span className="font-bold text-slate-900">~216.7 dB @ 384,400 km</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
