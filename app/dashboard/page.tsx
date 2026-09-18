import LunarMissionDashboard from "@/components/lunar/lunar-mission-dashboard"

export const metadata = {
  title: "SelenSync // CLPS Flight Dynamics Console - NASA Space Apps 2026",
  description: "Zero-scroll NASA CLPS Tactical Mission Operations Console for Artemis Lunar South Pole Landers.",
}

export default function DashboardPage() {
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#4e6aff]/20">
      <LunarMissionDashboard />
    </div>
  )
}
