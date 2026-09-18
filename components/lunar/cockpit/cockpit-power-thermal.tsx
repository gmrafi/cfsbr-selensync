"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
  ShieldAlert, 
  CheckCircle2, 
  Cpu 
} from "lucide-react";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface CockpitPowerThermalProps {
  lander: CLPSLanderProfile;
  currentSolarWatts: number;
  isSunInShadow: boolean;
  timeOffsetHours: number;
}

export default function CockpitPowerThermal({
  lander,
  currentSolarWatts,
  isSunInShadow,
  timeOffsetHours,
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
  const netPowerWatts = Number((currentSolarWatts * (dustFactor / lander.solarArray.dustDegradationFactor) - totalLoadWatts).toFixed(1));

  // Dynamic Battery State of Charge (SoC %)
  // Simulates battery capacity depletion during shadow and recharge during illumination
  const batterySoC = useMemo(() => {
    if (netPowerWatts >= 0) {
      return 100;
    }
    // Battery discharging
    const dischargeRateWatts = Math.abs(netPowerWatts);
    const dischargeTimeHours = (timeOffsetHours % 12); // periodic window
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

  return (
    <div className="space-y-4">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Battery State of Charge */}
        <Card className="border border-slate-300 bg-white shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Battery State of Charge</span>
              {batterySoC > 30 ? (
                <BatteryCharging className="w-4 h-4 text-emerald-600" />
              ) : (
                <BatteryWarning className="w-4 h-4 text-rose-600 animate-pulse" />
              )}
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {batterySoC}%
            </div>
            <div className="mt-2">
              <Progress value={batterySoC} className="h-2 bg-slate-100" />
            </div>
            <div className="text-[10px] text-slate-500 mt-2 flex justify-between font-mono">
              <span>Cap: {lander.battery.capacityWh} Wh</span>
              <span>Bus: {lander.battery.voltageV}V DC</span>
            </div>
          </CardContent>
        </Card>

        {/* Net Power Balance */}
        <Card className="border border-slate-300 bg-white shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Bus Power Balance</span>
              <Zap className={`w-4 h-4 ${netPowerWatts >= 0 ? "text-emerald-500" : "text-amber-500"}`} />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {netPowerWatts >= 0 ? `+${netPowerWatts}` : netPowerWatts} <span className="text-sm font-normal text-slate-500">Watts</span>
            </div>
            <div className="text-[11px] mt-2 font-medium">
              {netPowerWatts >= 0 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Positive Energy Margin
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Battery Discharging
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cryogenic Thermal Survival */}
        <Card className="border border-slate-300 bg-white shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Cryo Survival Buffer</span>
              <ThermometerSnowflake className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {hoursUntilCryoBlackout > 100 ? "CONTINUOUS" : `${hoursUntilCryoBlackout} hrs`}
            </div>
            <div className="text-[11px] text-slate-600 mt-2 font-mono">
              Heater Load: {heaterLoadWatts}W @ -180°C
            </div>
          </CardContent>
        </Card>

        {/* Dust Degradation Factor */}
        <Card className="border border-slate-300 bg-white shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Regolith Dust Factor</span>
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1">
              {(dustFactor * 100).toFixed(0)}% <span className="text-xs font-normal text-slate-500">Transmission</span>
            </div>
            <div className="mt-2">
              <Slider
                value={[dustFactor * 100]}
                min={70}
                max={100}
                step={1}
                onValueChange={(val) => setDustFactor(val[0] / 100)}
                className="py-1 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Power Distribution & Thermal Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Subsystems Power Draw Table */}
        <Card className="lg:col-span-7 border border-slate-300 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#4e6aff]" />
                  Electrical Power Distribution Subsystem (EPDS)
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Real-time power bus telemetry for {lander.name}
                </CardDescription>
              </div>
              <Badge className="bg-slate-100 text-slate-700 text-[10px] font-mono border border-slate-200">
                TOTAL: {totalLoadWatts} W
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">Avionics, IMU &amp; Star Trackers</span>
                <span className="font-mono font-bold text-slate-900">{avionicsLoadWatts} W</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Science Payloads &amp; Instruments</span>
                  <Badge variant="outline" className="text-[10px] bg-white">
                    {payloadActive ? "ACTIVE" : "STANDBY"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900">{payloadLoadWatts} W</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPayloadActive(!payloadActive)}
                    className="h-6 px-2 text-[10px] border-slate-300"
                  >
                    Toggle
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">Cryogenic Line Heaters</span>
                  <Badge variant="outline" className={`text-[10px] ${isSunInShadow ? "bg-amber-100 text-amber-800" : "bg-white"}`}>
                    {isSunInShadow ? "HEATING ON" : "PASSIVE"}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900">{heaterLoadWatts} W</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCryoHeaterAuto(!cryoHeaterAuto)}
                    className="h-6 px-2 text-[10px] border-slate-300"
                  >
                    {cryoHeaterAuto ? "AUTO" : "MANUAL"}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-medium text-slate-700">X-Band High Gain Downlink (HGA)</span>
                <span className="font-mono font-bold text-slate-900">{lander.telecom.txPowerWatts * 2.8} W (DC)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solar Array Geometry & Specifications */}
        <Card className="lg:col-span-5 border border-slate-300 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Photovoltaic Array Specifications
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Triple-junction solar cells tailored for lunar polar grazing incidence
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Array Configuration:</span>
              <span className="font-semibold text-slate-900 uppercase font-mono">{lander.solarArray.orientation}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Active Area:</span>
              <span className="font-semibold text-slate-900 font-mono">{lander.solarArray.areaM2} m²</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Cell Conversion Efficiency:</span>
              <span className="font-semibold text-slate-900 font-mono">{(lander.solarArray.cellEfficiency * 100).toFixed(1)}% (GaAs)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-600">Peak Rated Output (AM0):</span>
              <span className="font-semibold text-slate-900 font-mono">{lander.solarArray.peakWatts} W</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Max Nominal Shadow Tolerance:</span>
              <span className="font-semibold text-blue-700 font-mono">{lander.battery.maxShadowHoursNominal} hours</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
