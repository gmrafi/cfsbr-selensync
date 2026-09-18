"use client";

import React, { useState } from "react";
import SiteComparisonMatrix from "./site-comparison-matrix";
import { Badge } from "@/components/ui/badge";

export default function HomeSiteComparison() {
  const [siteAId, setSiteAId] = useState<string>("malapert-mountain");
  const [siteBId, setSiteBId] = useState<string>("shackleton-connecting-ridge");

  return (
    <section id="site-comparison" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-300 dark:border-slate-800 scroll-mt-16">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <Badge variant="outline" className="text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-xs font-semibold shadow-xs">
            NASA Artemis &amp; CLPS Mission Trade-Offs
          </Badge>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-sans tracking-tight">
            Interactive Landing Site Comparison
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Quickly evaluate trade-offs between continuous solar power generation and line-of-sight communications to Earth. Select any two candidate landing zones to perform an instant side-by-side analysis.
          </p>
        </div>

        <SiteComparisonMatrix
          siteAId={siteAId}
          siteBId={siteBId}
          onSelectSiteA={setSiteAId}
          onSelectSiteB={setSiteBId}
        />
      </div>
    </section>
  );
}
