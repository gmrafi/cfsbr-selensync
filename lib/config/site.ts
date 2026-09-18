export const siteConfig = {
  name: "SelenSync",
  shortName: "SelenSync",
  title: "SelenSync - CLPS Lunar South Pole Mission & Communication Browser",
  tagline: "Synchronizing Sunlight & Direct-to-Earth Windows for Lunar South Pole Operations.",
  description:
    "Intuitive 3D Lunar South Pole Mission & Communication Window Browser for Artemis and CLPS Operations. NASA Space Apps Challenge 2026.",
  year: "2026",
  challenge: "CLPS Lunar Mission Browser",
  event: "NASA International Space Apps Challenge 2026",
  organization: "CFSBR SpaceWeb",
  parentOrg: "Centre for Fintech & Strategic Business Research (CFSBR)",
  location: "Sylhet, Bangladesh",
  links: {
    github: "https://github.com/gmrafi/orbitegde2.0",
    spaceApps: "https://www.spaceappschallenge.org/2026/challenges/clps-lunar-mission-browser/",
  },
} as const;

export type SiteConfig = typeof siteConfig;
