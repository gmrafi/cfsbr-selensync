"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Sun, 
  Terminal, 
  Download, 
  ShieldAlert 
} from "lucide-react";

interface TelemetryEvent {
  id: string;
  met: string;
  utcTime: string;
  system: "RF_DSN" | "POWER_THERMAL" | "TOPOGRAPHY" | "AUTONOMY";
  severity: "INFO" | "WARNING" | "CRITICAL" | "NOMINAL";
  message: string;
}

interface CockpitTelemetryLogProps {
  timeOffsetHours: number;
  siteName: string;
  isSunInShadow: boolean;
  isEarthOccluded: boolean;
  rfLinkMarginDb: number;
}

export default function CockpitTelemetryLog({
  timeOffsetHours,
  siteName,
  isSunInShadow,
  isEarthOccluded,
  rfLinkMarginDb,
}: CockpitTelemetryLogProps) {
  const [filter, setFilter] = useState<string>("ALL");
  const [commandSuccessMessage, setCommandSuccessMessage] = useState<string | null>(null);

  // Dynamic synthesized mission events based on current simulated time
  const events: TelemetryEvent[] = useMemo(() => {
    const list: TelemetryEvent[] = [
      {
        id: "evt-01",
        met: "MET +00d 00h 00m",
        utcTime: "2026-06-21 00:00:00 UTC",
        system: "AUTONOMY",
        severity: "NOMINAL",
        message: `Landing touchdown confirmed on ${siteName}. Subsystems initialization complete.`,
      },
      {
        id: "evt-02",
        met: "MET +00d 01h 15m",
        utcTime: "2026-06-21 01:15:00 UTC",
        system: "POWER_THERMAL",
        severity: "INFO",
        message: "Triple-junction vertical solar arrays deployed. AM0 solar constant locked at 1361 W/m².",
      },
      {
        id: "evt-03",
        met: "MET +00d 03h 40m",
        utcTime: "2026-06-21 03:40:00 UTC",
        system: "RF_DSN",
        severity: "NOMINAL",
        message: "Goldstone DSS-14 70m carrier lock acquired. 2000 kbps telemetry downlink established.",
      },
    ];

    if (isSunInShadow) {
      list.push({
        id: "evt-shadow",
        met: `MET +00d ${String(timeOffsetHours % 24).padStart(2, "0")}h 00m`,
        utcTime: "CURRENT SIMULATED INSTANT",
        system: "TOPOGRAPHY",
        severity: "WARNING",
        message: `Topographic crater rim occluding solar disc. Entering cryogenic battery discharge cycle.`,
      });
    }

    if (isEarthOccluded) {
      list.push({
        id: "evt-rf-los",
        met: `MET +00d ${String(timeOffsetHours % 24).padStart(2, "0")}h 00m`,
        utcTime: "CURRENT SIMULATED INSTANT",
        system: "RF_DSN",
        severity: "CRITICAL",
        message: `Direct-to-Earth vector occulted by southern highland massif. LOS blackout active.`,
      });
    } else {
      list.push({
        id: "evt-rf-nominal",
        met: `MET +00d ${String(timeOffsetHours % 24).padStart(2, "0")}h 00m`,
        utcTime: "CURRENT SIMULATED INSTANT",
        system: "RF_DSN",
        severity: "NOMINAL",
        message: `DSN Link Budget verified healthy (+${rfLinkMarginDb} dB margin above QPSK threshold).`,
      });
    }

    return list.reverse();
  }, [timeOffsetHours, siteName, isSunInShadow, isEarthOccluded, rfLinkMarginDb]);

  const filteredEvents = useMemo(() => {
    if (filter === "ALL") return events;
    return events.filter((e) => e.system === filter || e.severity === filter);
  }, [events, filter]);

  const sendUplinkCommand = (cmd: string) => {
    setCommandSuccessMessage(`Command "${cmd}" beamed to DSN 34m aperture. Acknowledgment in ~2.56s.`);
    setTimeout(() => {
      setCommandSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-4">
      {/* Event Stream Card */}
      <Card className="border border-slate-300 bg-white shadow-xs">
        <CardHeader className="p-4 pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#4e6aff]" />
              Flight Director Mission Chronology &amp; Anomaly Telemetry
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Live automated system events logged during lunar south pole tactical operations
            </CardDescription>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {["ALL", "RF_DSN", "POWER_THERMAL", "WARNING"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  filter === f
                    ? "bg-[#4e6aff] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-4 space-y-2">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-mono"
            >
              <div className="flex items-start gap-2.5">
                {evt.severity === "CRITICAL" ? (
                  <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                ) : evt.severity === "WARNING" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{evt.met}</span>
                    <Badge variant="outline" className="text-[9px] py-0 px-1.5 bg-white text-slate-600">
                      {evt.system}
                    </Badge>
                  </div>
                  <p className="text-slate-700 mt-1 font-sans text-xs">{evt.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0">{evt.utcTime}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Ground Command Uplink Console */}
      <Card className="border border-slate-300 bg-white shadow-xs">
        <CardHeader className="p-4 pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#4e6aff]" />
            Ground Command Uplink Transmitter (Goldstone / Madrid / Canberra)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Queue and transmit telecommands across Deep Space Network uplink carrier (7.19 GHz)
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {commandSuccessMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 font-mono flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {commandSuccessMessage}
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendUplinkCommand("CMD_PING_TRANSPONDER")}
              className="text-xs border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700"
            >
              Ping Transponder
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendUplinkCommand("CMD_CYCLE_CRYO_HEATERS")}
              className="text-xs border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700"
            >
              Cycle Cryo Heaters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendUplinkCommand("CMD_DEPLOY_HGA_GIMBAL")}
              className="text-xs border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700"
            >
              Align High Gain Dish
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => sendUplinkCommand("CMD_PAYLOAD_POW_CYCLE")}
              className="text-xs border-slate-300 hover:bg-blue-50 hover:border-blue-300 text-slate-700"
            >
              Power Cycle Payloads
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
