"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search, Sparkles, Sun, Radio, Thermometer, Mountain, ShieldAlert } from "lucide-react";

interface GlossaryItem {
  id: string;
  term: string;
  category: "Celestial & Orbital" | "Electrical & Power" | "RF Communications" | "Thermal & Cryo" | "Geology & Terrain";
  icon: typeof Sun;
  simpleExplanation: string;
  aerospaceDetails: string;
  nasaImportance: string;
}

const GLOSSARY_ENTRIES: GlossaryItem[] = [
  {
    id: "psr",
    term: "PSR (Permanently Shadowed Region)",
    category: "Celestial & Orbital",
    icon: Mountain,
    simpleExplanation: "Deep crater pockets where sunlight has never shone for billions of years.",
    aerospaceDetails: "Because the Moon's axial tilt is only 1.54°, crater floors near the poles remain in eternal shadow. Temperatures stay near 40 Kelvin (-233°C), preserving billions of tons of ancient water ice.",
    nasaImportance: "Water ice is NASA's highest-value resource for producing liquid hydrogen/oxygen rocket propellant and life support.",
  },
  {
    id: "dte",
    term: "DTE (Direct-to-Earth Communication)",
    category: "RF Communications",
    icon: Radio,
    simpleExplanation: "A direct microwave line of sight between the lunar lander and giant antenna dishes on Earth.",
    aerospaceDetails: "Operates on X-band (8.45 GHz) with NASA Deep Space Network 34-meter parabolic antennas. Distance spans 363,000 to 405,000 km, incurring ~216.5 dB free-space path loss.",
    nasaImportance: "Eliminates the need for an expensive lunar relay satellite, but requires the lander to maintain clear line of sight over local crater rims.",
  },
  {
    id: "libration",
    term: "Lunar Libration (Wobble)",
    category: "Celestial & Orbital",
    icon: Sparkles,
    simpleExplanation: "The natural rocking and nodding motion of the Moon as seen from Earth.",
    aerospaceDetails: "Due to lunar orbital eccentricity (e=0.0549) and rotational tilt, the apparent sub-Earth point wanders by up to ±8° in longitude and ±6.7° in latitude over a 27.3-day sidereal cycle.",
    nasaImportance: "Libration causes Earth to slowly bob up and down along the lunar horizon, periodically cutting off Direct-to-Earth comms even if the lander is completely stationary.",
  },
  {
    id: "gaas-solar",
    term: "GaAs Triple-Junction Solar Panels",
    category: "Electrical & Power",
    icon: Sun,
    simpleExplanation: "Ultra-high-efficiency space solar panels that generate electricity from faint, grazing sunlight.",
    aerospaceDetails: "Constructed with multi-junction Gallium Arsenide semiconductor layers achieving ~30% conversion efficiency. Mounted as vertical cylinders on landers to maximize capture of low-angle horizontal rays.",
    nasaImportance: "Critical at the South Pole where the Sun never rises higher than 1.5° to 3.5° above the horizon.",
  },
  {
    id: "diviner-thermal",
    term: "Diviner Radiometer & Cold-Trap Model",
    category: "Thermal & Cryo",
    icon: Thermometer,
    simpleExplanation: "NASA temperature measurements showing how brutally cold the lunar surface gets.",
    aerospaceDetails: "Derived from the Diviner Lunar Radiometer Experiment (DLRE) on NASA's LRO spacecraft. Surface regolith drops to 40K in shadow and reaches ~220K during low-angle sunlight.",
    nasaImportance: "Landers must actively power cryogenic survival heaters (85W) to stop batteries and propellant lines from freezing solid.",
  },
  {
    id: "lola-dem",
    term: "LOLA Altimetry (Lunar Orbiter Laser Altimeter)",
    category: "Geology & Terrain",
    icon: Mountain,
    simpleExplanation: "NASA laser topographical radar map that measures the exact height of crater rims and slopes.",
    aerospaceDetails: "Provides 30-meter resolution digital elevation models (DEM). Used to calculate 360° horizon mask skylines that accurately predict solar and Earth occlusions.",
    nasaImportance: "Determines whether a lander will be engulfed in mountain shadow or risk tipping over on steep crater rims (>8.5° slope hazard).",
  },
  {
    id: "link-margin",
    term: "RF Link Margin (dB)",
    category: "RF Communications",
    icon: Radio,
    simpleExplanation: "The safety cushion between your radio signal strength and the point where the signal is lost.",
    aerospaceDetails: "Measured in decibels: Link Margin = (Eb/N0 received) - (Eb/N0 threshold). A positive margin > +3.0 dB guarantees error-free telemetry downlink across 384,400 km.",
    nasaImportance: "NASA flight rules mandate a minimum +3.0 dB margin before authorizing critical lander commands or payload downloads.",
  },
  {
    id: "solstice-tradeoff",
    term: "Solstice vs. Equinox Touchdown Windows",
    category: "Celestial & Orbital",
    icon: Sun,
    simpleExplanation: "The seasons on the Moon that dictate whether you get continuous power or deep freezing darkness.",
    aerospaceDetails: "During southern summer solstice (late December), the sub-solar latitude reaches maximum southern declination (-1.54°), providing peak continuous sunlight for 10-14 days. Equinoxes offer equalized but lower-elevation grazing angles.",
    nasaImportance: "Choosing the exact touchdown epoch determines whether a mission survives 14 days or freezes in permanent shadow within 48 hours.",
  },
];

interface CockpitGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function CockpitGlossaryModal({
  isOpen,
  onClose,
  isDarkMode = false,
}: CockpitGlossaryModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");

  const filteredItems = GLOSSARY_ENTRIES.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.aerospaceDetails.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "ALL" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0 border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xl rounded-2xl">
        <DialogHeader className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#4e6aff]/10 text-[#4e6aff] flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>CLPS Aerospace Glossary &amp; Field Guide</span>
                  <Badge variant="outline" className="text-[10px] bg-[#4e6aff]/10 text-[#4e6aff] border-[#4e6aff]/30">
                    Public &amp; Educator Layer
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Plain-English explanations and aerospace engineering context for NASA South Pole landing mechanics.
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Search Bar & Categories */}
          <div className="flex flex-col sm:flex-row gap-2 mt-3.5 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search aerospace concepts (e.g. PSR, Libration, DTE, Solar...)"
                className="pl-9 h-9 text-xs bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto pb-0.5 no-scrollbar text-xs">
              {["ALL", "Celestial & Orbital", "Electrical & Power", "RF Communications", "Thermal & Cryo", "Geology & Terrain"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#4e6aff] text-white"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {cat === "ALL" ? "All Fields" : cat.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable Entry Cards */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No matching aerospace concepts found for "{searchQuery}".
            </div>
          ) : (
            filteredItems.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:border-[#4e6aff]/40 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                        <IconComp className="w-4 h-4 text-[#4e6aff]" />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
                        {item.term}
                      </h4>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Plain English Summary */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 p-2.5 rounded-lg text-xs text-emerald-900 dark:text-emerald-300">
                    <span className="font-bold block text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-0.5">
                      Plain English for Public &amp; Students:
                    </span>
                    {item.simpleExplanation}
                  </div>

                  {/* Technical Aerospace Details */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Aerospace Mechanics: </span>
                    {item.aerospaceDetails}
                  </div>

                  {/* Why NASA Cares */}
                  <div className="text-[11px] text-[#4e6aff] dark:text-[#788eff] font-medium pt-1 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span>NASA Mission Impact: {item.nasaImportance}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
