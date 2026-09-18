"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { calculateMCDARankings, SiteMCDAScore } from "@/lib/gis/site-mcda";
import { Layers, Award, CheckCircle2 } from "lucide-react";

interface CockpitMCDAMatrixProps {
  activeSiteId: string;
  onSelectSite: (siteId: string) => void;
  isDarkMode?: boolean;
}

export default function CockpitMCDAMatrix({
  activeSiteId,
  onSelectSite,
  isDarkMode = false,
}: CockpitMCDAMatrixProps) {
  const rankings = useMemo(() => calculateMCDARankings(), []);

  const cardBg = isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";
  const itemBorder = isDarkMode ? "border-slate-800" : "border-slate-200";

  return (
    <div className={`h-full flex flex-col p-3 space-y-2 select-none overflow-y-auto ${cardBg}`}>
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <Layers className="w-4 h-4 text-[#4e6aff]" />
          <span>Multi-Criteria Decision Analysis (MCDA)</span>
        </div>
        <Badge variant="outline" className="text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300">
          Weights: P40% C30% S20% R10%
        </Badge>
      </div>

      {/* Rankings List */}
      <div className="space-y-2">
        {rankings.map((site) => {
          const isSelected = site.siteId === activeSiteId;

          return (
            <div
              key={site.siteId}
              onClick={() => onSelectSite(site.siteId)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-blue-50/80 border-[#4e6aff] shadow-xs ring-1 ring-[#4e6aff]/40"
                  : isDarkMode
                  ? "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                  : "bg-slate-50/70 border-slate-300 hover:border-slate-400 hover:bg-slate-100/70"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    site.rank === 1 ? "bg-amber-500 text-slate-950 font-extrabold" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}>
                    {site.rank}
                  </span>
                  <span className="font-bold text-xs text-slate-900 dark:text-white">{site.siteName}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-extrabold font-mono text-[#4e6aff]">{site.compositeScore}</span>
                  <span className="text-[10px] text-slate-500 font-mono">/100</span>
                </div>
              </div>

              {/* Sub-scores Grid */}
              <div className="grid grid-cols-4 gap-1.5 mt-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-500">Power</span>
                  <span className="font-bold font-mono text-amber-700 dark:text-amber-400">{site.powerScore}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-500">DTE</span>
                  <span className="font-bold font-mono text-cyan-700 dark:text-cyan-400">{site.commsScore}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-500">Slope</span>
                  <span className="font-bold font-mono text-emerald-700 dark:text-emerald-400">{site.slopeScore}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <span className="block text-[10px] text-slate-500">Ice Science</span>
                  <span className="font-bold font-mono text-blue-700 dark:text-blue-400">{site.scienceScore}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 leading-snug">
                {site.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
