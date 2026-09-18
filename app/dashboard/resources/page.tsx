"use client"

import DashboardHeader from "@/components/dashboard/dashboard-header"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ResourceCard from "@/components/dashboard/resources/resource-card"
import { resources } from "@/lib/resources"
import { useMemo, useState } from "react"

export default function ResourcesPage() {
	const [q, setQ] = useState("")
	const [agency, setAgency] = useState<string | null>(null)
	const [category, setCategory] = useState<string | null>(null)

	const agencies = ["NASA", "USGS", "CSA", "ESA"]
	const categories = [
		"Debris & Safety",
		"Open Data",
		"Earth Observation",
		"Visualization",
		"Policy & History",
	]

	const filtered = useMemo(() => {
		return resources.filter((r) => {
			const matchesQ = q
				? [r.title, r.description, r.agency, r.category, r.tags.join(" ")]
						.join(" ")
						.toLowerCase()
						.includes(q.toLowerCase())
				: true
			const matchesAgency = agency ? r.agency === agency : true
			const matchesCategory = category ? r.category === category : true
			return matchesQ && matchesAgency && matchesCategory
		})
	}, [q, agency, category])

	return (
		<div className="min-h-screen bg-gray-50">
			<DashboardHeader />
			<main className="container mx-auto px-4 py-8 max-w-7xl">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Space Data & Resources</h1>
					<p className="text-gray-600">
						Curated links to NASA and partner agency datasets, tools, and references to power your LEO business ideas.
					</p>
					<p className="text-xs text-gray-500 mt-2">
						NASA does not endorse any non-U.S. Government entity and is not responsible for information on non-U.S. Government websites. Follow each site's data use parameters.
					</p>
				</div>

				<Card className="p-4 mb-6 border-0 shadow-sm">
					<div className="grid md:grid-cols-3 gap-4">
						<Input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search datasets, tools, or agencies"
						/>
						<div className="flex flex-wrap gap-2 items-center">
							<span className="text-sm text-gray-600">Agency:</span>
							<Badge onClick={() => setAgency(null)} variant={agency === null ? "default" : "outline"} className="cursor-pointer">
								All
							</Badge>
							{agencies.map((a) => (
								<Badge key={a} onClick={() => setAgency(a)} variant={agency === a ? "default" : "outline"} className="cursor-pointer">
									{a}
								</Badge>
							))}
						</div>
						<div className="flex flex-wrap gap-2 items-center">
							<span className="text-sm text-gray-600">Category:</span>
							<Badge onClick={() => setCategory(null)} variant={category === null ? "default" : "outline"} className="cursor-pointer">
								All
							</Badge>
							{categories.map((c) => (
								<Badge key={c} onClick={() => setCategory(c)} variant={category === c ? "default" : "outline"} className="cursor-pointer">
									{c}
								</Badge>
							))}
						</div>
					</div>
				</Card>

				<div className="grid md:grid-cols-2 gap-6">
					{filtered.map((r) => (
						<ResourceCard
							key={r.id}
							title={r.title}
							agency={r.agency}
							category={r.category}
							description={r.description}
							url={r.url}
							tags={r.tags}
						/>
					))}
				</div>
			</main>
		</div>
	)
}
