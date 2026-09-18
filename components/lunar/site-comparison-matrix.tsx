"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LUNAR_SOUTH_POLE_CANDIDATES } from "@/lib/gis/lunar-sites";
import { Sun, Radio, ShieldAlert, Sparkles, Scale, ArrowRight, Mountain } from "lucide-react";
import Link from "next/link";

interface SiteComparisonMatrixProps {
  siteAId: string;
  siteBId: string;
  onSelectSiteA: (id: string) => void;
  onSelectSiteB: (id: string) => void;
  isDarkMode?: boolean;
}

export default function SiteComparisonMatrix({
  siteAId,
  siteBId,
  onSelectSiteA,
  onSelectSiteB,
  isDarkMode = false,
}: SiteComparisonMatrixProps) {
  const siteA = LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === siteAId) || LUNAR_SOUTH_POLE_CANDIDATES[0];
  const siteB = LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === siteBId) || LUNAR_SOUTH_POLE_CANDIDATES[1];

  return (
    <Card className="border border-slate-300 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 rounded-xl overflow-hidden transition-colors">
      <CardHeader className="pb-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white font-sans">
                Side-by-Side Lunar Landing Site Feasibility Matrix
              </CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-xs">
                Direct trade-off evaluation between illumination potential, DTE comms availability, and cryogenic survival risk.
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="text-xs font-mono bg-white dark:bg-slate-900 text-[#4e6aff] border-[#4e6aff]/40">
            CLPS Evaluation Protocol
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* Site Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 space-y-1.5">
            <label className="text-xs font-bold text-blue-900 dark:text-blue-300 block flex items-center justify-between">
              <span>Candidate Site A (Primary)</span>
              <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">{siteA.latitude}°S</span>
            </label>
            <select
              value={siteA.id}
              onChange={(e) => onSelectSiteA(e.target.value)}
              className="w-full text-xs font-bold p-2 border border-blue-300 dark:border-blue-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <option key={site.id} value={site.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {site.name} ({site.latitude}°S, {site.longitude}°E)
                </option>
              ))}
            </select>
          </div>

          <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-purple-950/20 space-y-1.5">
            <label className="text-xs font-bold text-purple-900 dark:text-purple-300 block flex items-center justify-between">
              <span>Candidate Site B (Comparison)</span>
              <span className="font-mono text-[10px] text-purple-600 dark:text-purple-400">{siteB.latitude}°S</span>
            </label>
            <select
              value={siteB.id}
              onChange={(e) => onSelectSiteB(e.target.value)}
              className="w-full text-xs font-bold p-2 border border-purple-300 dark:border-purple-800 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <option key={site.id} value={site.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {site.name} ({site.latitude}°S, {site.longitude}°E)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-950 text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-800">
                <th className="p-3 font-bold">Evaluation Parameter</th>
                <th className="p-3 font-bold text-blue-700 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40 border-l border-r border-slate-200 dark:border-slate-800">
                  {siteA.name.split(" ")[0]}
                </th>
                <th className="p-3 font-bold text-purple-700 dark:text-purple-400 bg-purple-50/50 dark:bg-purple-950/40">
                  {siteB.name.split(" ")[0]}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="p-3 font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                  Peak Sunlight Window
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-bold text-slate-900 dark:text-white border-l border-r border-slate-200 dark:border-slate-800">
                  {siteA.solarIlluminationPotential}
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-bold text-slate-900 dark:text-white">
                  {siteB.solarIlluminationPotential}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Radio className="w-4 h-4 text-blue-500 shrink-0" />
                  Direct-To-Earth (DTE) Visibility
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-semibold border-l border-r border-slate-200 dark:border-slate-800">
                  {siteA.dteDirectToEarthStatus}
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-semibold">
                  {siteB.dteDirectToEarthStatus}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Mountain className="w-4 h-4 text-emerald-500 shrink-0" />
                  LOLA Altimetry Elevation &amp; Coords
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 font-mono text-[11px] border-l border-r border-slate-200 dark:border-slate-800">
                  +{siteA.elevationMeters}m ({siteA.latitude}°S, {siteA.longitude}°E)
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 font-mono text-[11px]">
                  +{siteB.elevationMeters}m ({siteB.latitude}°S, {siteB.longitude}°E)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  Primary Scientific Target
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 text-xs leading-relaxed border-l border-r border-slate-200 dark:border-slate-800">
                  {siteA.scientificInterest}
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10 text-xs leading-relaxed">
                  {siteB.scientificInterest}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-medium flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                  Target Missions
                </td>
                <td className="p-3 bg-blue-50/20 dark:bg-blue-950/10 border-l border-r border-slate-200 dark:border-slate-800">
                  <div className="flex flex-wrap gap-1">
                    {siteA.targetMissions.map((m, idx) => (
                      <span key={idx} className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-semibold">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-3 bg-purple-50/20 dark:bg-purple-950/10">
                  <div className="flex flex-wrap gap-1">
                    {siteB.targetMissions.map((m, idx) => (
                      <span key={idx} className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] font-semibold">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Strategic Verdict & Action */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="space-y-1">
            <div className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Strategic Architecture Synthesis
            </div>
            <div className="text-xs font-semibold text-slate-200">
              {siteA.elevationMeters > siteB.elevationMeters
                ? `${siteA.name.split(" ")[0]} holds elevation advantage (+${siteA.elevationMeters - siteB.elevationMeters}m), minimizing crater rim shadow occlusion.`
                : `${siteB.name.split(" ")[0]} holds elevation advantage (+${siteB.elevationMeters - siteA.elevationMeters}m), providing higher solar line-of-sight.`}
            </div>
          </div>
          <Link href={`/dashboard?site=${siteA.id}`}>
            <Button size="sm" className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white font-bold text-xs h-8 px-3 shrink-0">
              Simulate {siteA.name.split(" ")[0]}
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
