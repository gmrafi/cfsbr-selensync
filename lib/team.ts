export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio?: string;
  email?: string;
  avatar: string;
  image?: string;
  status: "active" | "pending";
  permissions: string[];
  track?: "Leadership" | "Computer Science" | "Electrical & Electronic Engineering" | "Aerospace & Science";
}

export const coreTeamMembers: TeamMember[] = [
  {
    id: "lead-1",
    name: "Md Golam Mubasshir Rafi",
    role: "Lead",
    title: "Product Architecture & Spatial Analytics",
    bio: "Lead architect for SelenSync 3D spatial computation, lunar ephemeris integration, and responsive mission planning UI.",
    email: "rafi@cfsbr.org",
    avatar: "MR",
    image: "/team/rafi.png",
    status: "active",
    permissions: ["Full Access", "System Architecture", "Deployment"],
    track: "Leadership",
  },
  {
    id: "lead-2",
    name: "Afshara Tasneem Zoa",
    role: "Co-Lead",
    title: "Strategy & Research",
    bio: "Co-lead directing mission science requirements, CLPS literature synthesis, and lunar operations strategy.",
    email: "zoa@cfsbr.org",
    avatar: "AZ",
    image: "/team/afshara.png",
    status: "active",
    permissions: ["Full Access", "Mission Planning", "Science Directives"],
    track: "Leadership",
  },
];
