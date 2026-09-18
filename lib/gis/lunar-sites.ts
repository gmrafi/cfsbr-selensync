/**
 * Lunar South Pole Candidate Landing Sites for CLPS & Artemis Missions
 */

export interface LunarCandidateSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  lat: number;
  lon: number;
  elevationMeters: number;
  description: string;
  scientificInterest: string;
  solarIlluminationPotential: string;
  dteDirectToEarthStatus: string;
  targetMissions: string[];
  clpsPriority: "Priority 1 (Primary)" | "Priority 2 (Secondary)" | "Priority 3 (Contingency)";
  scientificSignificance: string;
  solarIlluminationFraction: number;
  maxSlopeDeg: number;
  estimatedIcePurity: string;
  notes: string;
}

export const LUNAR_SOUTH_POLE_CANDIDATES: LunarCandidateSite[] = [
  {
    id: "malapert-mountain",
    name: "Malapert Mountain (Peak of Eternal Light)",
    latitude: -85.99,
    longitude: 2.93,
    lat: -85.99,
    lon: 2.93,
    elevationMeters: 5000,
    description: "High elevation massif near the lunar south pole providing near-continuous line of sight to Earth and high solar illumination.",
    scientificInterest: "High-altitude relay platform, ancient anorthosite crust samples, panoramic lunar horizon viewing.",
    solarIlluminationPotential: "85% - 93% annual sunlight visibility",
    dteDirectToEarthStatus: "Continuous to semi-continuous direct LOS with low horizon obstruction.",
    targetMissions: ["Artemis III / IV", "CLPS Intuitive Machines IM-2", "VIPER / Surface Relays"],
    clpsPriority: "Priority 1 (Primary)",
    scientificSignificance: "5,000m massif serving as an optimal optical/telecom relay and long-duration solar outpost.",
    solarIlluminationFraction: 0.89,
    maxSlopeDeg: 8.5,
    estimatedIcePurity: "Low on ridge (volatiles in flanking valleys)",
    notes: "Prime candidate for human and robotic missions due to exceptional solar and Earth visibility.",
  },
  {
    id: "shackleton-ridge",
    name: "Shackleton Connecting Ridge",
    latitude: -89.9,
    longitude: 0.0,
    lat: -89.9,
    lon: 0.0,
    elevationMeters: 4200,
    description: "Prominent ridge connecting Shackleton crater rim with the south polar highland, with permanently shadowed regions (PSR) on one side and solar illuminated peaks on the other.",
    scientificInterest: "Direct access to volatile-rich PSR cold traps and water ice reserves in Shackleton crater floor.",
    solarIlluminationPotential: "80% - 90% peak illumination during lunar summer",
    dteDirectToEarthStatus: "High visibility windows during lunar nodal cycle.",
    targetMissions: ["Artemis Base Camp", "CLPS Commercial Landers"],
    clpsPriority: "Priority 1 (Primary)",
    scientificSignificance: "Boundary between near-permanent illumination and cryogenic cold traps (40 Kelvin).",
    solarIlluminationFraction: 0.86,
    maxSlopeDeg: 12.0,
    estimatedIcePurity: "5.5 wt% water ice in crater interior",
    notes: "Direct gateway to deep volatile extraction; precision landing required near 12° slope boundary.",
  },
  {
    id: "de-gerlache-rim",
    name: "de Gerlache Rim",
    latitude: -88.5,
    longitude: -88.3,
    lat: -88.5,
    lon: -88.3,
    elevationMeters: 3800,
    description: "Asymmetric crater rim offering high thermal stability and gentle slope traverses down towards shadowed cold traps.",
    scientificInterest: "Traversable slopes for robotic rovers entering cryogenic volatile zones.",
    solarIlluminationPotential: "75% - 85% seasonal illumination",
    dteDirectToEarthStatus: "Periodic Earth visibility with favorable libration windows.",
    targetMissions: ["NASA CLPS Payloads", "Autonomous Rover Prospecting"],
    clpsPriority: "Priority 2 (Secondary)",
    scientificSignificance: "Gentle topographic gradients provide safe egress into permanently shadowed terrain.",
    solarIlluminationFraction: 0.81,
    maxSlopeDeg: 7.1,
    estimatedIcePurity: "3.8 wt% water-equivalent hydrogen",
    notes: "Excellent landing safety margins with manageable rover traversal gradients.",
  },
  {
    id: "haworth-rim",
    name: "Haworth Crater Rim",
    latitude: -87.4,
    longitude: -5.1,
    lat: -87.4,
    lon: -5.1,
    elevationMeters: 3400,
    description: "Extensive rim system adjacent to one of the coldest known permanently shadowed regions in the solar system (approx. 40 Kelvin).",
    scientificInterest: "Deep volatile storage, primordial impact melt investigation.",
    solarIlluminationPotential: "70% - 80% illumination on elevated ridges",
    dteDirectToEarthStatus: "Direct Earth line-of-sight during affirmative libration cycles.",
    targetMissions: ["CLPS Cryogenic Drill Demonstrations", "Lunar Resource In-Situ Utilization (ISRU)"],
    clpsPriority: "Priority 2 (Secondary)",
    scientificSignificance: "Cryogenic thermal regime preserves ancient volatile inventory and organic precursors.",
    solarIlluminationFraction: 0.76,
    maxSlopeDeg: 11.2,
    estimatedIcePurity: "4.2 wt% confirmed cryogenic volatiles",
    notes: "High scientific yield for drill missions; shadow masking requires careful solar planning.",
  },
  {
    id: "faustini-rim",
    name: "Faustini Rim Plateau",
    latitude: -87.3,
    longitude: 77.0,
    lat: -87.3,
    lon: 77.0,
    elevationMeters: 3200,
    description: "Wide, stable highland plateau on the rim of Faustini crater, offering smooth touch-down landing safety ellipses.",
    scientificInterest: "In-situ resource utilization (ISRU) demonstration and regolith mineralogy profiling.",
    solarIlluminationPotential: "72% - 82% seasonal sunlight",
    dteDirectToEarthStatus: "Favorable direct communications window with DSS-43 and DSS-14.",
    targetMissions: ["Artemis Surface Mobility", "Commercial Cargo CLPS"],
    clpsPriority: "Priority 2 (Secondary)",
    scientificSignificance: "Wide landing ellipse with low obstacle density and stable regolith bearing capacity.",
    solarIlluminationFraction: 0.77,
    maxSlopeDeg: 6.8,
    estimatedIcePurity: "2.9 wt% hydrogen equivalent",
    notes: "Ideal for large commercial cargo landers requiring broad landing ellipses.",
  },
  {
    id: "nobile-rim",
    name: "Nobile Crater Rim 1",
    latitude: -85.2,
    longitude: 53.5,
    lat: -85.2,
    lon: 53.5,
    elevationMeters: 2800,
    description: "Gently sloping highland ridge selected for NASA VIPER rover path exploration, with accessible micro-cold traps.",
    scientificInterest: "Volatile subsurface mapping and ground truth validation for orbital neutron spectrometers.",
    solarIlluminationPotential: "68% - 78% illumination",
    dteDirectToEarthStatus: "Wide Earth visibility arcs due to lower latitude positioning.",
    targetMissions: ["NASA VIPER Polar Rover", "Astrobotic Griffin 1"],
    clpsPriority: "Priority 1 (Primary)",
    scientificSignificance: "Target exploration site for NASA's VIPER polar volatile prospecting rover.",
    solarIlluminationFraction: 0.74,
    maxSlopeDeg: 8.0,
    estimatedIcePurity: "3.5 wt% surface and subsurface ice",
    notes: "Thoroughly mapped landing corridor with extensive ground-truth mobility plans.",
  },
  {
    id: "amundsen-rim",
    name: "Amundsen Rim Highlands",
    latitude: -84.5,
    longitude: 82.8,
    lat: -84.5,
    lon: 82.8,
    elevationMeters: 3600,
    description: "Extensive impact basin rim exposing deep South Pole-Aitken (SPA) basin ejecta and ancient lunar mantle material.",
    scientificInterest: "Sampling South Pole-Aitken basin deep crustal impact melt.",
    solarIlluminationPotential: "65% - 75% periodic illumination",
    dteDirectToEarthStatus: "High elevation ensures continuous line-of-sight above local obstacles.",
    targetMissions: ["ESA European Large Logistics Lander", "Sample Return Probes"],
    clpsPriority: "Priority 3 (Contingency)",
    scientificSignificance: "Exposure of deep planetary crust from the largest, oldest impact basin on the Moon.",
    solarIlluminationFraction: 0.70,
    maxSlopeDeg: 9.4,
    estimatedIcePurity: "2.1 wt% volatiles",
    notes: "Primary sample return scientific target; lower overall solar illumination duration.",
  },
  {
    id: "leibnitz-beta",
    name: "Leibnitz Beta Plateau",
    latitude: -85.8,
    longitude: 29.8,
    lat: -85.8,
    lon: 29.8,
    elevationMeters: 4800,
    description: "Second highest elevation feature near the lunar south pole, acting as a natural solar power tower and radio relay mast.",
    scientificInterest: "Permanent high-altitude optical and radio observatory platform.",
    solarIlluminationPotential: "82% - 91% annual illumination",
    dteDirectToEarthStatus: "Superb line-of-sight clearing surrounding crater walls.",
    targetMissions: ["Long-Duration Power Station", "Artemis Base Camp Relay"],
    clpsPriority: "Priority 2 (Secondary)",
    scientificSignificance: "Strategic commanding peak for polar communication relays and continuous solar collection.",
    solarIlluminationFraction: 0.88,
    maxSlopeDeg: 9.0,
    estimatedIcePurity: "Low on summit ridge",
    notes: "Top architectural candidate for permanent solar power towers and multi-band transceivers.",
  },
];

/**
 * NASA Lunar Reconnaissance Orbiter (LRO) Raster Tile and WMTS Tile Configurations
 */
export const NASA_LUNAR_TILE_SOURCES = {
  // LRO WAC Global Morphologic Mosaic (Visible)
  wacMosaic: {
    id: "nasa-lro-wac-mosaic",
    type: "raster",
    tiles: [
      "https://trek.nasa.gov/tiles/Moon/EQ/LRO_WAC_Mosaic_Global_303P_100m/1.0.0/default/default028mm/{z}/{y}/{x}.jpg",
    ],
    tileSize: 256,
    attribution: "NASA / GSFC / Arizona State University (LROC)",
  },
  // LOLA Lunar Topography / Color Elevation
  lolaElevationColor: {
    id: "nasa-lola-color-dem",
    type: "raster",
    tiles: [
      "https://trek.nasa.gov/tiles/Moon/EQ/LOLA_ClrShade_Global_128ppd/1.0.0/default/default028mm/{z}/{y}/{x}.png",
    ],
    tileSize: 256,
    attribution: "NASA / Goddard Space Flight Center (LOLA Science Team)",
  },
  // Lunar South Pole 85-90S Polar Stereographic
  southPoleStereographic: {
    id: "nasa-lro-southpole-sp",
    type: "raster",
    tiles: [
      "https://trek.nasa.gov/tiles/Moon/SP/LRO_NAC_SouthPole_mosaic/1.0.0/default/default028mm/{z}/{y}/{x}.png",
    ],
    tileSize: 256,
    attribution: "NASA / LROC Science Operations Center",
  },
} as const;
