"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, AreaChart, Area } from "recharts";
import { Zap, Radio, Sun, Globe } from "lucide-react";

export interface TelemetryDataPoint {
  hour: number;
  timeLabel: string;
  sunElevationDeg: number;
  earthElevationDeg: number;
  solarWatts: number;
  rfLinkMarginDb: number;
  isDTEAvailable: boolean;
}

interface TelemetryChartsProps {
  data: TelemetryDataPoint[];
  currentHourOffset: number;
  siteName: string;
}

export default function TelemetryCharts({
  data,
  currentHourOffset,
  siteName,
}: TelemetryChartsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Chart 1: Solar Illumination & Power Generation Output */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <CardTitle className="text-sm font-bold text-slate-900">Solar Array Power Generation Curve</CardTitle>
            </div>
            <Badge className="bg-amber-100 text-amber-800 text-[10px] border-amber-300">
              Watts (W) vs Time
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            {"P = A · η · S₀ · max(0, sin(θ_elev)) · H_topo (2.5m² GaAs Array)"}
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#ffffff", fontSize: "11px" }}
                  formatter={(val: any) => [`${(Number(val) || 0).toFixed(1)} Watts`, "Generated Power"]}
                />
                <ReferenceLine x={`+${currentHourOffset}h`} stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" label={{ value: "Now", fill: "#3b82f6", fontSize: 10 }} />
                <Area type="monotone" dataKey="solarWatts" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#solarGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Chart 2: Sun vs Earth Elevation & Direct-to-Earth (DTE) Link Margin */}
      <Card className="border border-slate-200 shadow-sm bg-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-500" />
              <CardTitle className="text-sm font-bold text-slate-900">Sun & Earth Topocentric Elevation</CardTitle>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 text-[10px] border-emerald-300">
              Horizon Altitude (Degrees)
            </Badge>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Topocentric elevation angles relative to 0° geometric horizon
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 10 }} stroke="#94a3b8" domain={[-15, 30]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", color: "#ffffff", fontSize: "11px" }}
                />
                <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1.5} label={{ value: "Horizon 0°", fill: "#ef4444", fontSize: 10 }} />
                <ReferenceLine x={`+${currentHourOffset}h`} stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="sunElevationDeg" name="Sun Elevation (°)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="earthElevationDeg" name="Earth Elevation (°)" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
