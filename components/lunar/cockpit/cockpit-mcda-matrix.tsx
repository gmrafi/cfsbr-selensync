"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  getAllSiteFeasibilityRankings, 
  RankedFeasibilityScoreResult,
  MCDA_WEIGHTS 
} from "@/lib/strategy/site-scoring";
import { 
  Layers, 
  Award, 
  CheckCircle2, 
  Sun, 
  Radio, 
  Mountain, 
  Sparkles,
  AlertTriangle,
  ChevronRight
} from "lucide-react";

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
  const rankings = useMemo(() => getAllSiteFeasibilityRankings(), []);

  const cardBg = isDarkMode ? "bg-slate-900 text-slate-100" : "bg-white text-slate-900";
  const mutedText = isDarkMode ? "text-slate-400" : "text-slate-600";
  const borderCol = isDarkMode ? "border-slate-800" : "border-slate-200";

  return (
    <div className={`h-full flex flex-col p-3 space-y-2.5 select-none overflow-y-auto ${cardBg}`}>
      {/* Header with Strategist Attribution & Weights */}
      <div className={`flex flex-col gap-1.5 border-b pb-2.5 ${borderCol}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-[#4e6aff]/10 text-[#4e6aff]">
              <Layers className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-xs leading-none text-slate-900 dark:text-white">
                MCDA Feasibility Engine
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Lead: Afshara Tasneem Zoa &bull; CFSBR SpaceWeb
              </p>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className="text-[10px] font-mono px-2 py-0.5 bg-blue-50/70 dark:bg-slate-800 text-[#4e6aff] border-[#4e6aff]/30"
          >
            0–100 INDEX
          </Badge>
        </div>

        {/* Weights Bar */}
        <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded-md bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
            <Sun className="w-3 h-3" />
            <span>Sun {MCDA_WEIGHTS.SOLAR * 100}%</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <div className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400">
            <Radio className="w-3 h-3" />
            <span>DTE {MCDA_WEIGHTS.DTE * 100}%</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
            <Mountain className="w-3 h-3" />
            <span>Slope {MCDA_WEIGHTS.SLOPE * 100}%</span>
          </div>
          <span className="text-slate-300 dark:text-slate-600">&bull;</span>
          <div className="flex items-center gap-1 text-purple-700 dark:text-purple-400">
            <Sparkles className="w-3 h-3" />
            <span>Science {MCDA_WEIGHTS.SCIENCE * 100}%</span>
          </div>
        </div>
      </div>

      {/* Rankings Cards List */}
      <div className="space-y-2">
        {rankings.map((site: RankedFeasibilityScoreResult) => {
          const isSelected = 
            site.siteId === activeSiteId ||
            (site.siteId === "shackleton-ridge" && activeSiteId === "shackleton-connecting-ridge") ||
            (site.siteId === "shackleton-connecting-ridge" && activeSiteId === "shackleton-ridge");

          // Color for composite score badge
          const scoreColor = 
            site.feasibilityIndex >= 85 
              ? "text-emerald-600 dark:text-emerald-400" 
              : site.feasibilityIndex >= 75
              ? "text-blue-600 dark:text-blue-400"
              : "text-amber-600 dark:text-amber-400";

          return (
            <div
              key={site.siteId}
              onClick={() => onSelectSite(site.siteId)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? "bg-blue-50/90 dark:bg-blue-950/40 border-[#4e6aff] shadow-sm ring-1 ring-[#4e6aff]"
                  : isDarkMode
                  ? "bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
                  : "bg-slate-50/90 border-slate-300 hover:border-slate-400 hover:bg-slate-100/90"
              }`}
            >
              {/* Top Row: Rank, Name, Feasibility Score */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                      site.rank === 1
                        ? "bg-amber-400 text-slate-950 shadow-xs"
                        : site.rank === 2
                        ? "bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white"
                        : site.rank === 3
                        ? "bg-amber-700 text-white"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {site.rank}
                  </span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                      {site.siteName}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-0.5 shrink-0">
                  <span className={`text-base font-extrabold font-mono ${scoreColor}`}>
                    {site.feasibilityIndex}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">/100</span>
                </div>
              </div>

              {/* Multi-Variable Criteria Bars (Weighted Contribution) */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                    <span>Sun</span>
                    <span className="font-mono text-amber-700 dark:text-amber-400 font-bold">
                      {site.breakdown.solarScore}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${site.breakdown.solarScore}%` }} 
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                    <span>DTE</span>
                    <span className="font-mono text-cyan-700 dark:text-cyan-400 font-bold">
                      {site.breakdown.dteScore}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full rounded-full" 
                      style={{ width: `${site.breakdown.dteScore}%` }} 
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                    <span>Slope</span>
                    <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                      {site.breakdown.slopeScore}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full" 
                      style={{ width: `${site.breakdown.slopeScore}%` }} 
                    />
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 px-1.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-center">
                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                    <span>Ice/Sci</span>
                    <span className="font-mono text-purple-700 dark:text-purple-400 font-bold">
                      {site.breakdown.scienceScore}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full" 
                      style={{ width: `${site.breakdown.scienceScore}%` }} 
                    />
                  </div>
                </div>
              </div>

              {/* Verdict Pill & Recommendation */}
              <div className="mt-2 flex items-center justify-between text-[10px]">
                <span className="text-slate-600 dark:text-slate-400 font-medium truncate pr-2">
                  {site.verdict.split("(")[0].trim()}
                </span>
                <span className="text-[#4e6aff] flex items-center font-medium shrink-0 group-hover:translate-x-0.5 transition-transform">
                  Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
