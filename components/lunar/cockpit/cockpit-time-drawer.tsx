"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sun,
  Flame
} from "lucide-react";

interface CockpitTimeDrawerProps {
  currentOffsetHours: number;
  maxHours: number;
  simulatedDate: Date;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  onResetTime: () => void;
  onChangeOffsetHours: (hours: number) => void;
  onSetMaxHours: (max: number) => void;
  speedMultiplier: number;
  onChangeSpeedMultiplier: (speed: number) => void;
  isSunInShadow: boolean;
  isDarkMode?: boolean;
}

export default function CockpitTimeDrawer({
  currentOffsetHours,
  maxHours,
  simulatedDate,
  isAutoPlaying,
  onToggleAutoPlay,
  onResetTime,
  onChangeOffsetHours,
  onSetMaxHours,
  speedMultiplier,
  onChangeSpeedMultiplier,
  isSunInShadow,
  isDarkMode = false,
}: CockpitTimeDrawerProps) {
  const days = Math.floor(currentOffsetHours / 24);
  const hours = Math.floor(currentOffsetHours % 24);

  const containerBg = isDarkMode 
    ? "bg-slate-900 border-slate-800 text-slate-100" 
    : "bg-white border-slate-300 text-slate-900 shadow-xs";

  return (
    <div className={`h-14 shrink-0 border-t px-3 sm:px-5 flex items-center justify-between gap-4 text-xs select-none z-20 transition-colors ${containerBg}`}>
      {/* 1. Play/Pause, Reset & Speed Controls */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          size="sm"
          variant={isAutoPlaying ? "destructive" : "default"}
          onClick={onToggleAutoPlay}
          className={`h-8 px-3 text-xs font-bold gap-1.5 shadow-xs ${
            !isAutoPlaying ? "bg-[#4e6aff] hover:bg-[#3d59ef] text-white" : ""
          }`}
        >
          {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {isAutoPlaying ? "PAUSE" : "PLAY"}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onResetTime}
          className="h-8 px-2.5 text-xs border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 font-medium"
          title="Reset to Mission Touchdown (T+00h)"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1 text-slate-500" />
          T+00h
        </Button>

        {/* Speed Multipliers */}
        <div className="hidden sm:flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md p-0.5 text-xs font-bold">
          {[1, 5, 20].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeedMultiplier(s)}
              className={`px-2 py-0.5 rounded transition-colors ${
                speedMultiplier === s
                  ? "bg-[#4e6aff] text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. Central 14-Day (336h) Timeline Slider */}
      <div className="flex-1 max-w-2xl px-2 flex flex-col justify-center">
        <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 mb-1 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-900 dark:text-white font-bold font-mono">T+{String(currentOffsetHours).padStart(3, "0")}h</span>
            <span className="text-slate-500">/ T+{maxHours}h (Day {days}.{Math.floor((hours / 24) * 10)})</span>
          </div>

          <div className="flex items-center gap-2">
            {isSunInShadow ? (
              <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 animate-pulse" /> Shadow Active
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Sun className="w-3.5 h-3.5" /> Sunlight Active
              </span>
            )}
          </div>
        </div>

        <div className="relative">
          <Slider
            value={[currentOffsetHours]}
            min={0}
            max={maxHours}
            step={1}
            onValueChange={(val) => onChangeOffsetHours(val[0])}
            className="cursor-pointer py-1"
          />
        </div>
      </div>

      {/* 3. Timeline Window Presets */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-xs font-semibold">
        {[
          { label: "24h Descent", hours: 24 },
          { label: "7d Traverse", hours: 168 },
          { label: "14d Lunar Day", hours: 336 },
        ].map((preset) => (
          <button
            key={preset.hours}
            onClick={() => {
              onSetMaxHours(preset.hours);
              if (currentOffsetHours > preset.hours) {
                onChangeOffsetHours(preset.hours);
              }
            }}
            className={`px-2.5 py-1 rounded-md border transition-colors ${
              maxHours === preset.hours
                ? "bg-slate-900 dark:bg-slate-700 text-white border-slate-900"
                : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
