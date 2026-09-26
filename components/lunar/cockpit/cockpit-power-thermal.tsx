"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  Zap, 
  BatteryCharging, 
  BatteryWarning, 
  ThermometerSnowflake, 
  Sun, 
  Flame, 
  Layers, 
  CheckCircle2, 
  Cpu,
  Power
} from "lucide-react";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface CockpitPowerThermalProps {
  lander: CLPSLanderProfile;
  currentSolarWatts: number;
  isSunInShadow: boolean;
  timeOffsetHours: number;
  isDarkMode?: boolean;
}

export default function CockpitPowerThermal({
  lander,
  currentSolarWatts,
  isSunInShadow,
  timeOffsetHours,
  isDarkMode = false,
}: CockpitPowerThermalProps) {
  const [dustFactor, setDustFactor] = useState<number>(lander.solarArray.dustDegradationFactor);
  const [payloadActive, setPayloadActive] = useState<boolean>(true);
  const [cryoHeaterAuto, setCryoHeaterAuto] = useState<boolean>(true);

  // Electrical load calculations
  const avionicsLoadWatts = lander.battery.nominalBaseLoadWatts;
  const payloadLoadWatts = payloadActive ? 65 : 0;
  const heaterLoadWatts = isSunInShadow && cryoHeaterAuto ? lander.battery.cryoHeaterWatts : 15;
  const totalLoadWatts = avionicsLoadWatts + payloadLoadWatts + heaterLoadWatts;

  // Net power balance (Watts)
  const adjustedSolar = Number((currentSolarWatts * (dustFactor / lander.solarArray.dustDegradationFactor)).toFixed(1));
  const netPowerWatts = Number((adjustedSolar - totalLoadWatts).toFixed(1));

  // Dynamic Battery State of Charge (SoC %)
  const batterySoC = useMemo(() => {
    if (netPowerWatts >= 0) {
      return 100;
    }
    const dischargeRateWatts = Math.abs(netPowerWatts);
    const dischargeTimeHours = (timeOffsetHours % 14);
    const energyConsumedWh = dischargeRateWatts * dischargeTimeHours;
    const remainingWh = Math.max(0, lander.battery.capacityWh - energyConsumedWh);
    const percent = (remainingWh / lander.battery.capacityWh) * 100;
    return Number(percent.toFixed(1));
  }, [netPowerWatts, timeOffsetHours, lander.battery.capacityWh]);

  // Hours until battery depletion in shadow
  const hoursUntilCryoBlackout = useMemo(() => {
    if (netPowerWatts >= 0) return 999;
    const dischargeRate = Math.abs(netPowerWatts);
    const remainingWh = (lander.battery.capacityWh * batterySoC) / 100;
    return Number((remainingWh / dischargeRate).toFixed(1));
  }, [netPowerWatts, lander.battery.capacityWh, batterySoC]);

  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const innerBg = isDarkMode ? "bg-slate-950 border-slate-800" : "bg-slate-50 border-slate-200";

  return (
    <div className="h-full flex flex-col p-3 space-y-3 select-none overflow-y-auto font-sans">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Electrical Power &amp; Thermal Balance</span>
        </div>
        <Badge variant="outline" className="text-[10px] font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800">
          BUS: {lander.battery.voltageV}V DC
        </Badge>
      </div>

      {/* 2x2 Compact Metric Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {/* Card 1: Battery SoC */}
        <div className={`${cardBg} p-2.5 rounded-xl border space-y-1.5`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Battery SoC</span>
            {batterySoC > 30 ? (
              <BatteryCharging className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <BatteryWarning className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-mono font-extrabold ${batterySoC > 30 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
              {batterySoC}%
            </span>
            <span className="text-[10px] text-slate-400 font-mono">({lander.battery.capacityWh} Wh)</span>
          </div>
          <Progress value={batterySoC} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
        </div>

        {/* Card 2: Net Power Balance */}
        <div className={`${cardBg} p-2.5 rounded-xl border space-y-1.5`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Net Bus Margin</span>
            <Zap className={`w-3.5 h-3.5 ${netPowerWatts >= 0 ? "text-emerald-500" : "text-amber-500"}`} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-mono font-extrabold ${netPowerWatts >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
              {netPowerWatts >= 0 ? `+${netPowerWatts}` : netPowerWatts}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Watts</span>
          </div>
          <div className="text-[10px] font-medium truncate">
            {netPowerWatts >= 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Charging
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Flame className="w-3 h-3" /> Discharging
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Cryo Survival Buffer */}
        <div className={`${cardBg} p-2.5 rounded-xl border space-y-1`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Cryo Buffer</span>
            <ThermometerSnowflake className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-base font-mono font-extrabold text-slate-900 dark:text-white">
            {hoursUntilCryoBlackout > 100 ? "SAFE (>100h)" : `${hoursUntilCryoBlackout} hrs`}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            Heaters: {heaterLoadWatts}W
          </div>
        </div>

        {/* Card 4: Dust Degradation Factor */}
        <div className={`${cardBg} p-2.5 rounded-xl border space-y-1`}>
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[11px] font-medium">Solar Dust Factor</span>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400 text-[11px]">
              {(dustFactor * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[dustFactor * 100]}
            min={70}
            max={100}
            step={1}
            onValueChange={(val) => setDustFactor(val[0] / 100)}
            className="py-1 cursor-pointer"
          />
          <div className="text-[9px] text-slate-400 flex justify-between font-mono">
            <span>70% (Soiled)</span>
            <span>100% (Clean)</span>
          </div>
        </div>
      </div>

      {/* Subsystem Power Draw Breakdown */}
      <div className={`${cardBg} p-3 rounded-xl border space-y-2`}>
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#4e6aff]" />
            <span>Subsystem Power Telemetry</span>
          </div>
          <span className="font-mono text-xs text-[#4e6aff]">Total: {totalLoadWatts} W</span>
        </div>

        <div className="space-y-1.5 text-xs">
          {/* Avionics */}
          <div className={`flex items-center justify-between p-2 rounded-lg border ${innerBg}`}>
            <div>
              <span className="font-semibold block text-slate-900 dark:text-white">Flight Avionics &amp; IMU</span>
              <span className="text-[10px] text-slate-500">Continuous bus base load</span>
            </div>
            <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{avionicsLoadWatts} W</span>
          </div>

          {/* Science Payloads */}
          <div className={`flex items-center justify-between p-2 rounded-lg border ${innerBg}`}>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-white">Science Payloads</span>
                <Badge variant="outline" className={`text-[9px] px-1 py-0 ${payloadActive ? "text-emerald-700 dark:text-emerald-400 border-emerald-300" : "text-slate-400"}`}>
                  {payloadActive ? "ON" : "STANDBY"}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500">Drill, spectrometer &amp; imagers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{payloadLoadWatts} W</span>
              <Button
                size="sm"
                variant={payloadActive ? "outline" : "default"}
                onClick={() => setPayloadActive(!payloadActive)}
                className="h-6 px-2 text-[10px] font-bold"
              >
                {payloadActive ? "Sleep" : "Wake"}
              </Button>
            </div>
          </div>

          {/* Thermal Heaters */}
          <div className={`flex items-center justify-between p-2 rounded-lg border ${innerBg}`}>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-white">Cryogenic Heaters</span>
                <Badge variant="outline" className={`text-[9px] px-1 py-0 ${isSunInShadow ? "text-amber-700 dark:text-amber-400 border-amber-300" : "text-slate-400"}`}>
                  {isSunInShadow ? "ACTIVE" : "STANDBY"}
                </Badge>
              </div>
              <span className="text-[10px] text-slate-500">Auto-engaged during shadow</span>
            </div>
            <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{heaterLoadWatts} W</span>
          </div>
        </div>
      </div>
    </div>
  );
}
