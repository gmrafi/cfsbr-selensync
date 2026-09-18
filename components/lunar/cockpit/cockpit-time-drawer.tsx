"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Clock, 
  Flag,
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
}: CockpitTimeDrawerProps) {
  const days = Math.floor(currentOffsetHours / 24);
  const hours = Math.floor(currentOffsetHours % 24);

  return (
    <div className="h-14 shrink-0 border-t border-zinc-800 bg-zinc-950/95 px-3 sm:px-4 flex items-center justify-between gap-3 text-xs select-none z-20">
      {/* 1. Play/Pause, Reset & Speed Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant={isAutoPlaying ? "destructive" : "default"}
          onClick={onToggleAutoPlay}
          className={`h-8 px-2.5 text-xs font-mono font-bold gap-1.5 ${
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
          className="h-8 px-2 text-xs border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 font-mono"
          title="Reset to Mission Touchdown (T+00h)"
        >
          <RotateCcw className="w-3 h-3 mr-1 text-zinc-400" />
          T+00h
        </Button>

        {/* Speed Multipliers */}
        <div className="hidden sm:flex items-center gap-0.5 bg-zinc-900 border border-zinc-800 rounded p-0.5 text-[10px] font-mono font-bold">
          {[1, 5, 20].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeedMultiplier(s)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                speedMultiplier === s
                  ? "bg-[#4e6aff] text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. Central 14-Day (336h) Timeline Slider */}
      <div className="flex-1 max-w-2xl px-2 flex flex-col justify-center">
        <div className="flex justify-between text-[10px] font-mono text-zinc-400 mb-1">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold">T+{String(currentOffsetHours).padStart(3, "0")}h</span>
            <span className="text-zinc-500">/ T+{maxHours}h (Day {days}.{Math.floor((hours / 24) * 10)})</span>
          </div>

          <div className="flex items-center gap-2">
            {isSunInShadow ? (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 animate-pulse" /> SHADOW OCCLUSION ACTIVE
              </span>
            ) : (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Sun className="w-3 h-3" /> GRAZING ILLUMINATION
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
      <div className="hidden lg:flex items-center gap-1 shrink-0 font-mono text-[10px]">
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
            className={`px-2 py-1 rounded border transition-colors ${
              maxHours === preset.hours
                ? "bg-zinc-800 border-[#4e6aff] text-white font-bold"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
