"use client";

import React from "react";
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
  isDarkMode?: boolean;
}

export default function TelemetryCharts({
  data,
  currentHourOffset,
  siteName,
  isDarkMode = false,
}: TelemetryChartsProps) {
  const cardBg = isDarkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900 shadow-xs";
  const gridStroke = isDarkMode ? "#1e293b" : "#e2e8f0";
  const axisStroke = isDarkMode ? "#64748b" : "#94a3b8";

  const maxHour = data && data.length > 0 ? data[data.length - 1].hour : 336;
  const tickInterval = maxHour <= 72 ? 12 : maxHour <= 168 ? 24 : 48;
  const axisTicks = React.useMemo(() => {
    const list = [];
    for (let h = 0; h <= maxHour; h += tickInterval) {
      list.push(h);
    }
    return list;
  }, [maxHour, tickInterval]);

  return (
    <div className="h-full flex flex-col gap-3 overflow-y-auto pr-1 select-none font-sans">
      {/* Chart 1: Solar Array Power Generation Curve */}
      <div className={`${cardBg} rounded-xl border p-3 flex flex-col gap-2 shrink-0`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Zap className="w-4 h-4 text-amber-500" />
            <span className="text-slate-900 dark:text-white">Solar Array Power Profile</span>
          </div>
          <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 text-[10px] font-mono">
            Watts (W) vs Time
          </Badge>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="solarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis 
                dataKey="hour" 
                type="number"
                domain={[0, maxHour]}
                ticks={axisTicks}
                tickFormatter={(val) => `+${val}h`}
                tick={{ fontSize: 9 }} 
                stroke={axisStroke} 
              />
              <YAxis 
                tick={{ fontSize: 9 }} 
                stroke={axisStroke} 
                domain={[0, "auto"]}
                allowDataOverflow={false}
                tickFormatter={(val) => `${Math.round(val)}`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", 
                  borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                  borderRadius: "8px", 
                  color: isDarkMode ? "#ffffff" : "#0f172a", 
                  fontSize: "11px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
                labelFormatter={(label) => `Timeline: +${label}h`}
                formatter={(val: any) => [`${Math.round(Number(val) || 0)} W`, "Generated Power"]}
              />
              <ReferenceLine 
                x={currentHourOffset} 
                stroke="#3b82f6" 
                strokeWidth={2} 
                strokeDasharray="3 3" 
                label={{ value: "Now", fill: "#3b82f6", fontSize: 10, position: "insideTopLeft", offset: 12 }} 
              />
              <Area type="monotone" dataKey="solarWatts" stroke="#d97706" strokeWidth={2} fillOpacity={1} fill="url(#solarGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Sun vs Earth Elevation & Horizon Line */}
      <div className={`${cardBg} rounded-xl border p-3 flex flex-col gap-2 shrink-0`}>
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Radio className="w-4 h-4 text-cyan-500" />
            <span className="text-slate-900 dark:text-white">Sun &amp; Earth Horizon Trajectory</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-mono">
            <span className="text-amber-500 font-bold">&bull; Sun</span>
            <span className="text-cyan-500 font-bold">&bull; Earth</span>
          </div>
        </div>

        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
              <XAxis 
                dataKey="hour" 
                type="number"
                domain={[0, maxHour]}
                ticks={axisTicks}
                tickFormatter={(val) => `+${val}h`}
                tick={{ fontSize: 9 }} 
                stroke={axisStroke} 
              />
              <YAxis 
                tick={{ fontSize: 9 }} 
                stroke={axisStroke} 
                domain={[-10, 20]} 
                tickFormatter={(val) => `${Math.round(val)}°`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: isDarkMode ? "#0f172a" : "#ffffff", 
                  borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                  borderRadius: "8px", 
                  color: isDarkMode ? "#ffffff" : "#0f172a", 
                  fontSize: "11px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
                labelFormatter={(label) => `Timeline: +${label}h`}
                formatter={(val: any, name: any) => [`${(Number(val) || 0).toFixed(2)}°`, name]}
              />
              <ReferenceLine y={0} stroke="#ef4444" strokeWidth={1.5} strokeDasharray="2 2" label={{ value: "0° Horizon", fill: "#ef4444", fontSize: 9 }} />
              <ReferenceLine x={currentHourOffset} stroke="#3b82f6" strokeWidth={2} strokeDasharray="3 3" />
              <Line type="monotone" dataKey="sunElevationDeg" name="Sun Elevation (°)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="earthElevationDeg" name="Earth Elevation (°)" stroke="#06b6d4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
