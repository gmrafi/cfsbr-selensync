/**
 * Lunar South Pole Candidate Landing Sites for CLPS & Artemis Missions
 */

export interface LunarCandidateSite {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  description: string;
  scientificInterest: string;
  solarIlluminationPotential: string;
  dteDirectToEarthStatus: string;
  targetMissions: string[];
}

export const LUNAR_SOUTH_POLE_CANDIDATES: LunarCandidateSite[] = [
  {
    id: "malapert-mountain",
    name: "Malapert Mountain (Peak of Eternal Light)",
    latitude: -85.99,
    longitude: 2.93,
    elevationMeters: 5000,
    description: "High elevation massif near the lunar south pole providing near-continuous line of sight to Earth and high solar illumination.",
    scientificInterest: "High-altitude relay platform, ancient anorthosite crust samples, panoramic lunar horizon viewing.",
    solarIlluminationPotential: "85% - 93% annual sunlight visibility",
    dteDirectToEarthStatus: "Continuous to semi-continuous direct LOS with low horizon obstruction.",
    targetMissions: ["Artemis III / IV", "CLPS Intuitive Machines IM-2", "VIPER / Surface Relays"],
  },
  {
    id: "shackleton-ridge",
    name: "Shackleton Connecting Ridge",
    latitude: -89.9,
    longitude: 0.0,
    elevationMeters: 4200,
    description: "Prominent ridge connecting Shackleton crater rim with the south polar highland, with permanently shadowed regions (PSR) on one side and solar illuminated peaks on the other.",
    scientificInterest: "Direct access to volatile-rich PSR cold traps and water ice reserves in Shackleton crater floor.",
    solarIlluminationPotential: "80% - 90% peak illumination during lunar summer",
    dteDirectToEarthStatus: "High visibility windows during lunar nodal cycle.",
    targetMissions: ["Artemis Base Camp", "CLPS Commercial Landers"],
  },
  {
    id: "de-gerlache-rim",
    name: "de Gerlache Rim",
    latitude: -88.5,
    longitude: -88.3,
    elevationMeters: 3800,
    description: "Asymmetric crater rim offering high thermal stability and gentle slope traverses down towards shadowed cold traps.",
    scientificInterest: "Traversable slopes for robotic rovers entering cryogenic volatile zones.",
    solarIlluminationPotential: "75% - 85% seasonal illumination",
    dteDirectToEarthStatus: "Periodic Earth visibility with favorable libration windows.",
    targetMissions: ["NASA CLPS Payloads", "Autonomous Rover Prospecting"],
  },
  {
    id: "haworth-rim",
    name: "Haworth Crater Rim",
    latitude: -87.4,
    longitude: -5.1,
    elevationMeters: 3400,
    description: "Extensive rim system adjacent to one of the coldest known permanently shadowed regions in the solar system (approx. 40 Kelvin).",
    scientificInterest: "Deep volatile storage, primordial impact melt investigation.",
    solarIlluminationPotential: "70% - 80% illumination on elevated ridges",
    dteDirectToEarthStatus: "Direct Earth line-of-sight during affirmative libration cycles.",
    targetMissions: ["CLPS Cryogenic Drill Demonstrations", "Lunar Resource In-Situ Utilization (ISRU)"],
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
