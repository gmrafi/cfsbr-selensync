"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LUNAR_SOUTH_POLE_CANDIDATES, LunarCandidateSite } from "@/lib/gis/lunar-sites";
import { Sun, Radio, ShieldAlert, Sparkles, Scale, ArrowRight } from "lucide-react";

interface SiteComparisonMatrixProps {
  siteAId: string;
  siteBId: string;
  onSelectSiteA: (id: string) => void;
  onSelectSiteB: (id: string) => void;
}

export default function SiteComparisonMatrix({
  siteAId,
  siteBId,
  onSelectSiteA,
  onSelectSiteB,
}: SiteComparisonMatrixProps) {
  const siteA = LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === siteAId) || LUNAR_SOUTH_POLE_CANDIDATES[0];
  const siteB = LUNAR_SOUTH_POLE_CANDIDATES.find((s) => s.id === siteBId) || LUNAR_SOUTH_POLE_CANDIDATES[1];

  return (
    <Card className="border border-slate-200 shadow-md bg-white">
      <CardHeader className="pb-3 bg-gradient-to-r from-blue-900 to-indigo-950 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-indigo-300" />
            <CardTitle className="text-base font-semibold">Side-by-Side Site Feasibility Matrix</CardTitle>
          </div>
          <Badge className="bg-indigo-500/30 text-indigo-200 border-indigo-400/40 text-xs">
            CLPS Decision Engine
          </Badge>
        </div>
        <CardDescription className="text-slate-300 text-xs">
          Comparative assessment of solar illumination, DTE windows, and cryogenic blackout risk
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4 space-y-4">
        {/* Site Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Target Site A</label>
            <select
              value={siteA.id}
              onChange={(e) => onSelectSiteA(e.target.value)}
              className="w-full text-xs font-medium p-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">Target Site B</label>
            <select
              value={siteB.id}
              onChange={(e) => onSelectSiteB(e.target.value)}
              className="w-full text-xs font-medium p-2 border border-slate-200 rounded-md bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LUNAR_SOUTH_POLE_CANDIDATES.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-2.5 font-semibold">Evaluation Metric</th>
                <th className="p-2.5 font-semibold text-blue-700 bg-blue-50/50">{siteA.name.split(" ")[0]}</th>
                <th className="p-2.5 font-semibold text-purple-700 bg-purple-50/50">{siteB.name.split(" ")[0]}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="p-2.5 font-medium flex items-center gap-1.5 text-slate-600">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  Peak Sunlight Window
                </td>
                <td className="p-2.5 bg-blue-50/30 font-semibold">{siteA.solarIlluminationPotential}</td>
                <td className="p-2.5 bg-purple-50/30 font-semibold">{siteB.solarIlluminationPotential}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium flex items-center gap-1.5 text-slate-600">
                  <Radio className="w-3.5 h-3.5 text-emerald-500" />
                  DTE Earth Visibility
                </td>
                <td className="p-2.5 bg-blue-50/30">{siteA.dteDirectToEarthStatus}</td>
                <td className="p-2.5 bg-purple-50/30">{siteB.dteDirectToEarthStatus}</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium flex items-center gap-1.5 text-slate-600">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Surface Elevation & Slope
                </td>
                <td className="p-2.5 bg-blue-50/30">{siteA.elevationMeters}m ({siteA.latitude}°S, {siteA.longitude}°E)</td>
                <td className="p-2.5 bg-purple-50/30">{siteB.elevationMeters}m ({siteB.latitude}°S, {siteB.longitude}°E)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-medium flex items-center gap-1.5 text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Primary Science Interest
                </td>
                <td className="p-2.5 bg-blue-50/30 text-[11px] leading-tight">{siteA.scientificInterest}</td>
                <td className="p-2.5 bg-purple-50/30 text-[11px] leading-tight">{siteB.scientificInterest}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Verdict Badge */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-lg p-3 text-white flex items-center justify-between">
          <div>
            <div className="text-[11px] text-indigo-300 font-semibold uppercase tracking-wider">Strategic Recommendation</div>
            <div className="text-xs font-bold text-white mt-0.5">
              {siteA.id === "malapert-mountain"
                ? "Malapert: Maximum Solar Power & Continuous Direct-to-Earth Relay (Artemis Baseline)"
                : "Shackleton: Direct Volatile Cold Trap Proximity (High Science Value)"}
            </div>
          </div>
          <Badge className="bg-emerald-500 text-white text-xs px-2.5 py-1 shrink-0">
            Optimal Fit
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
