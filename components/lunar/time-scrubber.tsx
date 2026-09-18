"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, FastForward, Clock, Calendar } from "lucide-react";

interface TimeScrubberProps {
  currentOffsetHours: number;
  maxHours: number;
  baseDate: Date;
  onChangeOffsetHours: (hours: number) => void;
  onSetMaxHours: (max: number) => void;
}

export default function TimeScrubber({
  currentOffsetHours,
  maxHours,
  baseDate,
  onChangeOffsetHours,
  onSetMaxHours,
}: TimeScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Playback timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onChangeOffsetHours(currentOffsetHours >= maxHours ? 0 : currentOffsetHours + 1);
      }, 500); // 1 hour step every 500ms
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentOffsetHours, maxHours, onChangeOffsetHours]);

  const activeDate = new Date(baseDate.getTime() + currentOffsetHours * 3600 * 1000);

  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <CardContent className="p-3.5 space-y-3">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-900">Timeline Simulation Scrubber</span>
            <Badge variant="outline" className="text-[11px] bg-slate-50 border-slate-200">
              UTC: {activeDate.toUTCString().replace("GMT", "UTC")}
            </Badge>
          </div>

          {/* Timespan Selector Buttons (24h, 7 Days, 14 Days) */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-md">
            {[
              { label: "24 Hours", hours: 24 },
              { label: "7 Days", hours: 168 },
              { label: "14 Days (Lunar Day)", hours: 336 },
            ].map((span) => (
              <button
                key={span.hours}
                onClick={() => onSetMaxHours(span.hours)}
                className={`text-[11px] px-2.5 py-1 rounded transition-colors font-medium ${
                  maxHours === span.hours ? "bg-white text-blue-600 shadow-xs font-semibold" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {span.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1">
          <Slider
            value={[currentOffsetHours]}
            min={0}
            max={maxHours}
            step={1}
            onValueChange={(val) => onChangeOffsetHours(val[0])}
            className="w-full cursor-pointer py-1"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>T+00h (Mission Start)</span>
            <span className="font-semibold text-blue-600">
              T+{String(currentOffsetHours ?? 0).padStart(3, "0")}h / T+{maxHours ?? 168}h (Day {(((currentOffsetHours ?? 0) / 24) || 0).toFixed(1)})
            </span>
            <span>T+{maxHours ?? 168}h End of Window</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-8 px-3 text-xs gap-1.5 border-slate-300"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              {isPlaying ? "Pause Simulation" : "Auto-Play Timeline"}
            </Button>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onChangeOffsetHours(0)}
              className="h-8 px-2 text-xs text-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Simulated Step: <strong>1.0 Hour</strong></span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
