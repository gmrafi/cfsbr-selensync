"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Shield, Globe, Database, Layers } from "lucide-react"
import Link from "next/link"

export default function ResourceCard({
  title,
  agency,
  category,
  description,
  url,
  tags,
}: {
  title: string
  agency: string
  category: string
  description: string
  url: string
  tags: string[]
}) {
  const icon = category === "Debris & Safety" ? (
    <Shield className="w-5 h-5" />
  ) : category === "Visualization" ? (
    <Globe className="w-5 h-5" />
  ) : category === "Open Data" ? (
    <Database className="w-5 h-5" />
  ) : (
    <Layers className="w-5 h-5" />
  )

  return (
    <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">{icon}</div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <div className="text-sm text-gray-600">{agency} • {category}</div>
            </div>
          </div>
          <Link href={url} target="_blank">
            <Button variant="outline" size="sm" className="gap-2">
              Open <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-sm mb-3">{description}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <Badge key={t} variant="outline" className="text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
