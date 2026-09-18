"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { calculateMCDARankings, SiteMCDAScore } from "@/lib/gis/site-mcda";
import { Layers, Award, CheckCircle2, TrendingUp } from "lucide-react";

interface CockpitMCDAMatrixProps {
  activeSiteId: string;
  onSelectSite: (siteId: string) => void;
}

export default function CockpitMCDAMatrix({
  activeSiteId,
  onSelectSite,
}: CockpitMCDAMatrixProps) {
  const rankings = useMemo(() => calculateMCDARankings(), []);

  return (
    <div className="h-full flex flex-col p-2 space-y-2 select-none overflow-y-auto custom-scrollbar text-xs">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
        <div className="flex items-center gap-1.5 text-zinc-200 font-mono font-bold text-[11px]">
          <Layers className="w-3.5 h-3.5 text-[#4e6aff]" />
          <span>MULTI-CRITERIA DECISION ANALYSIS (MCDA)</span>
        </div>
        <Badge variant="outline" className="text-[9px] font-mono bg-zinc-900 text-zinc-400 border-zinc-700">
          WEIGHTS: P40% C30% S20% R10%
        </Badge>
      </div>

      {/* Rankings List */}
      <div className="space-y-1.5">
        {rankings.map((site) => {
          const isSelected = site.siteId === activeSiteId;

          return (
            <div
              key={site.siteId}
              onClick={() => onSelectSite(site.siteId)}
              className={`p-2 rounded-lg border transition-all cursor-pointer font-mono ${
                isSelected
                  ? "bg-[#4e6aff]/15 border-[#4e6aff] text-white"
                  : "bg-zinc-950/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold ${
                    site.rank === 1 ? "bg-amber-500 text-black" : "bg-zinc-800 text-zinc-300"
                  }`}>
                    {site.rank}
                  </span>
                  <span className="font-bold text-xs">{site.siteName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#4e6aff]">{site.compositeScore}</span>
                  <span className="text-[9px] text-zinc-500">/100</span>
                </div>
              </div>

              {/* Sub-scores Bar */}
              <div className="grid grid-cols-4 gap-1 mt-1.5 text-[9px] text-zinc-400">
                <div className="bg-zinc-900 p-1 rounded border border-zinc-800 text-center">
                  <span className="block text-[8px] text-zinc-500">PWR (40%)</span>
                  <span className="font-bold text-amber-300">{site.powerScore}</span>
                </div>
                <div className="bg-zinc-900 p-1 rounded border border-zinc-800 text-center">
                  <span className="block text-[8px] text-zinc-500">DTE (30%)</span>
                  <span className="font-bold text-cyan-300">{site.commsScore}</span>
                </div>
                <div className="bg-zinc-900 p-1 rounded border border-zinc-800 text-center">
                  <span className="block text-[8px] text-zinc-500">SLP (20%)</span>
                  <span className="font-bold text-emerald-300">{site.slopeScore}</span>
                </div>
                <div className="bg-zinc-900 p-1 rounded border border-zinc-800 text-center">
                  <span className="block text-[8px] text-zinc-500">ICE (10%)</span>
                  <span className="font-bold text-blue-300">{site.scienceScore}</span>
                </div>
              </div>

              <div className="text-[9px] text-zinc-400 mt-1 font-sans italic">
                {site.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
