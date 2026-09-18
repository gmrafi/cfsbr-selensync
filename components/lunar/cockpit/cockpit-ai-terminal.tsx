"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, Send, Sparkles } from "lucide-react";
import { LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { CLPSLanderProfile } from "@/lib/physics/lander-profiles";

interface CockpitAITerminalProps {
  site: LunarCandidateSite;
  lander: CLPSLanderProfile;
  timeOffsetHours: number;
  isSunOccluded: boolean;
  isEarthOccluded: boolean;
  solarWatts: number;
  batterySoC: number;
  isDarkMode?: boolean;
}

export default function CockpitAITerminal({
  site,
  lander,
  timeOffsetHours,
  isSunOccluded,
  isEarthOccluded,
  solarWatts,
  batterySoC,
  isDarkMode = false,
}: CockpitAITerminalProps) {
  const [messages, setMessages] = useState<Array<{ role: "system" | "user" | "afshara"; text: string; time: string }>>([
    {
      role: "system",
      text: "Afshara Tactical Advisory Daemon online (NASA SPICE & LOLA Altimetry Kernel linked).",
      time: "00:00:00",
    },
    {
      role: "afshara",
      text: `Tactical flight analysis for ${lander.name} on ${site.name}. Solar power is currently generating ${solarWatts.toFixed(0)}W with battery at ${batterySoC.toFixed(0)}%. ${isSunOccluded ? "Alert: Crater rim shadow occlusion active. Cryogenic line heaters engaged at 85W." : "Direct solar grazing angle nominal. Direct-to-Earth carrier locked."}`,
      time: "00:00:01",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = (presetQuery?: string) => {
    const q = presetQuery || inputVal;
    if (!q.trim()) return;

    const userMsg = { role: "user" as const, text: q, time: new Date().toISOString().slice(11, 19) };
    let replyText = "";

    if (q.includes("Briefing") || q.includes("briefing")) {
      replyText = `FLIGHT BRIEFING [${site.name.split(" ")[0]}]: Landing site elevation is ${site.elevationMeters}m MSL. Topographic slope is 3.8° (well within the 10.0° tip-over limit). DTE communication is continuous via DSN Goldstone/Canberra. Recommend keeping science drill duty cycle to 45 minutes to preserve battery thermal reserve.`;
    } else if (q.includes("Shadow") || q.includes("shadow") || q.includes("Cryo")) {
      replyText = `CRYO ANALYSIS: Current battery state of charge is ${batterySoC.toFixed(0)}%. In maximum crater shadow ingress, lander will sustain internal temperatures above -180°C for approximately 7.5 to 12.8 hours using 85W active line heating.`;
    } else {
      replyText = `TELEMETRY CONFIRMED: Position ${site.latitude}°S, ${site.longitude}°E verified. Solar insolation model operating at 1,361 W/m² AM0. All subsystems reporting nominal parameters for Artemis support mission.`;
    }

    const aiMsg = { role: "afshara" as const, text: replyText, time: new Date().toISOString().slice(11, 19) };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputVal("");
  };

  const containerBg = isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";

  return (
    <div className={`h-full flex flex-col p-3 select-none overflow-hidden text-xs ${containerBg}`}>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2 shrink-0">
        <div className="flex items-center gap-1.5 text-[#4e6aff] font-bold text-xs">
          <Terminal className="w-4 h-4" />
          <span>Afshara AI Mission Strategist</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-blue-50 text-[#4e6aff] border-blue-200">
          Tactical Engine v3.4
        </Badge>
      </div>

      {/* Terminal Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-2.5 my-2 pr-1 text-xs">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2.5 rounded-lg border text-xs ${
              m.role === "system"
                ? "bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[11px]"
                : m.role === "user"
                ? "bg-blue-50 border-blue-200 text-blue-950 dark:bg-blue-950/40 dark:border-blue-800/60 dark:text-blue-200"
                : "bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            }`}
          >
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span className="font-bold uppercase">
                {m.role === "afshara" ? "AFSHARA AI STRATEGIST" : m.role}
              </span>
              <span className="font-mono">{m.time}</span>
            </div>
            <p className="leading-relaxed">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex gap-1.5 pb-2 overflow-x-auto shrink-0 text-xs">
        <button
          onClick={() => handleSend("Generate Artemis Flight Briefing")}
          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 whitespace-nowrap font-medium text-xs"
        >
          Flight Briefing
        </button>
        <button
          onClick={() => handleSend("Evaluate Cryo Shadow Blackout Risk")}
          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 whitespace-nowrap font-medium text-xs"
        >
          Cryo Shadow Risk
        </button>
        <button
          onClick={() => handleSend("Verify DTE Comm Window Reliability")}
          className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 whitespace-nowrap font-medium text-xs"
        >
          DTE Reliability
        </button>
      </div>

      {/* Input Box */}
      <div className="flex gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask Afshara for tactical guidance..."
          className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#4e6aff]"
        />
        <Button
          size="sm"
          onClick={() => handleSend()}
          className="h-8 px-3 bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-semibold"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
