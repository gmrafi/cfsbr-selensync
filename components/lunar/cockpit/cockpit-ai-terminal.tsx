"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Terminal, Send, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
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
}

export default function CockpitAITerminal({
  site,
  lander,
  timeOffsetHours,
  isSunOccluded,
  isEarthOccluded,
  solarWatts,
  batterySoC,
}: CockpitAITerminalProps) {
  const [messages, setMessages] = useState<Array<{ role: "system" | "user" | "afshara"; text: string; time: string }>>([
    {
      role: "system",
      text: "AFSHARA TACTICAL ADVISORY DAEMON // ONLINE (NASA SPICE & LOLA KERNEL LINKED)",
      time: "00:00:00",
    },
    {
      role: "afshara",
      text: `Tactical flight analysis for ${lander.name} on ${site.name}. Solar power currently generating ${solarWatts.toFixed(0)}W. Battery capacity is at ${batterySoC.toFixed(0)}%. ${isSunOccluded ? "WARNING: Crater rim topographic occlusion detected. Cryogenic heaters drawing 85W." : "Nominal solar grazing angle confirmed. Direct-to-Earth carrier locked."}`,
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
      replyText = `FLIGHT BRIEFING [${site.name.split(" ")[0]}]: Landing site elevation is ${site.elevationMeters}m MSL. Topographic slope is 3.8° (well within the 10.0° tip-over constraint). DTE communication is continuous via DSN Goldstone/Canberra. Recommend keeping science drill duty cycle to 45 minutes to preserve battery thermal reserve.`;
    } else if (q.includes("Shadow") || q.includes("shadow") || q.includes("Cryo")) {
      replyText = `CRYO ANALYSIS: Current battery state of charge is ${batterySoC.toFixed(0)}%. In maximum crater shadow ingress, lander will sustain internal temperatures above -180°C for approximately 7.5 to 12.8 hours using 85W active line heating.`;
    } else {
      replyText = `TELEMETRY ACKNOWLEDGED: Position ${site.latitude}°S, ${site.longitude}°E verified. Solar insolation model operating at 1,361 W/m² AM0. All subsystems reporting nominal parameters for Artemis support mission.`;
    }

    const aiMsg = { role: "afshara" as const, text: replyText, time: new Date().toISOString().slice(11, 19) };
    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputVal("");
  };

  return (
    <div className="h-full flex flex-col p-2 select-none overflow-hidden text-xs font-mono">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 shrink-0">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
          <Terminal className="w-3.5 h-3.5" />
          <span>AFSHARA // FLIGHT TACTICAL TERMINAL</span>
        </div>
        <Badge variant="outline" className="text-[9px] bg-cyan-950/60 text-cyan-300 border-cyan-500/40">
          PROMPT ENGINE v3.4
        </Badge>
      </div>

      {/* Terminal Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-2 my-2 pr-1 custom-scrollbar text-[11px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-2 rounded border ${
              m.role === "system"
                ? "bg-zinc-950/80 border-zinc-800 text-zinc-400 text-[10px]"
                : m.role === "user"
                ? "bg-blue-950/40 border-blue-800/60 text-blue-200"
                : "bg-zinc-900 border-zinc-800 text-zinc-200"
            }`}
          >
            <div className="flex justify-between text-[9px] text-zinc-500 mb-0.5">
              <span className="font-bold text-zinc-400 uppercase">
                {m.role === "afshara" ? "AFSHARA AI STRATEGIST" : m.role}
              </span>
              <span>{m.time}</span>
            </div>
            <p className="font-sans leading-relaxed text-xs">{m.text}</p>
          </div>
        ))}
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex gap-1.5 pb-2 overflow-x-auto shrink-0 text-[10px]">
        <button
          onClick={() => handleSend("Generate Artemis Flight Briefing")}
          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 whitespace-nowrap"
        >
          Flight Briefing
        </button>
        <button
          onClick={() => handleSend("Evaluate Cryo Shadow Blackout Risk")}
          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 whitespace-nowrap"
        >
          Cryo Shadow Risk
        </button>
        <button
          onClick={() => handleSend("Verify DTE Comm Window Reliability")}
          className="px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 whitespace-nowrap"
        >
          DTE Reliability
        </button>
      </div>

      {/* Input Box */}
      <div className="flex gap-1.5 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Query tactical mission strategist..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-[#4e6aff]"
        />
        <Button
          size="sm"
          onClick={() => handleSend()}
          className="h-7 px-2.5 bg-[#4e6aff] hover:bg-[#3d59ef] text-white text-xs font-mono"
        >
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
