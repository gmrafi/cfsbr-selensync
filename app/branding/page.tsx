"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Copy, Check, Palette, Image as ImageIcon, Satellite, X } from "lucide-react"
import { useState, useRef } from "react"

export default function BrandingPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSection(section)
    setTimeout(() => setCopiedSection(null), 2000)
  }

  const downloadPNG = (size: number, transparent: boolean = true) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = size
    canvas.height = size

    if (!transparent) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, size, size)
    }

    const gradient = ctx.createLinearGradient(0, 0, size, size)
    gradient.addColorStop(0, '#4e6aff')
    gradient.addColorStop(1, '#6d5bff')
    
    const padding = size * 0.15
    const iconSize = size - padding * 2
    const borderRadius = iconSize * 0.15

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.roundRect(padding, padding, iconSize, iconSize, borderRadius)
    ctx.fill()

    ctx.fillStyle = '#ffffff'
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = size * 0.04
    
    const centerX = size / 2
    const centerY = size / 2
    const iconScale = size * 0.25

    ctx.fillRect(centerX - iconScale * 0.3, centerY - iconScale * 0.15, iconScale * 0.6, iconScale * 0.3)
    ctx.fillRect(centerX - iconScale * 0.8, centerY - iconScale * 0.1, iconScale * 0.4, iconScale * 0.2)
    ctx.fillRect(centerX + iconScale * 0.4, centerY - iconScale * 0.1, iconScale * 0.4, iconScale * 0.2)

    const dataUrl = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `orbitedge-logo-${size}x${size}${transparent ? '-transparent' : ''}.png`
    a.click()
  }

  const brandColors = [
    { name: "Primary Blue", hex: "#4e6aff", rgb: "rgb(78, 106, 255)" },
    { name: "Secondary Purple", hex: "#6d5bff", rgb: "rgb(109, 91, 255)" },
    { name: "Dark Gray", hex: "#171717", rgb: "rgb(23, 23, 23)" },
    { name: "Text Gray", hex: "#374151", rgb: "rgb(55, 65, 81)" },
    { name: "Background", hex: "#f9fafb", rgb: "rgb(249, 250, 251)" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12 text-center">
          <Badge className="mb-4 bg-blue-600">Brand Assets</Badge>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] bg-clip-text text-transparent">
            OrbitEdge Branding
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Download high-quality PNG logo files and brand colors
          </p>
        </div>

        <Card className="mb-8 border-2 border-blue-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Logo Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-600">On Light Background</h3>
                <div className="bg-white rounded-lg p-12 border-2 border-gray-200 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4e6aff] to-[#6d5bff] rounded-lg flex items-center justify-center shadow-lg">
                      <Satellite className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] bg-clip-text text-transparent">
                        OrbitEdge
                      </h1>
                      <p className="text-xs text-gray-600">The Operating System for Low Earth Orbit</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-sm text-gray-600">On Dark Background</h3>
                <div className="bg-gray-900 rounded-lg p-12 border-2 border-gray-700 flex items-center justify-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4e6aff] to-[#6d5bff] rounded-lg flex items-center justify-center shadow-lg">
                      <Satellite className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] bg-clip-text text-transparent">
                        OrbitEdge
                      </h1>
                      <p className="text-xs text-gray-400">The Operating System for Low Earth Orbit</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Download PNG Files (High Quality)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Icon Only (Square)</h3>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { size: 64, label: "64×64px" },
                  { size: 128, label: "128×128px" },
                  { size: 256, label: "256×256px" },
                  { size: 512, label: "512×512px" },
                ].map((item) => (
                  <div key={item.size} className="space-y-2">
                    <div className="bg-white rounded-lg p-6 border-2 border-gray-200 flex items-center justify-center aspect-square">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#4e6aff] to-[#6d5bff] rounded-lg flex items-center justify-center shadow-lg">
                        <Satellite className="w-10 h-10 text-white" />
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => downloadPNG(item.size, true)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      {item.label}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full"
                      onClick={() => downloadPNG(item.size, false)}
                    >
                      White BG
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Brand Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-5 gap-4">
              {brandColors.map((color) => (
                <div key={color.name} className="space-y-3">
                  <div 
                    className="w-full h-32 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform border-2 border-gray-200"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => copyToClipboard(color.hex, color.name)}
                  />
                  <div className="space-y-1">
                    <p className="font-semibold text-sm">{color.name}</p>
                    <div className="flex items-center justify-between">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{color.hex}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(color.hex, color.name)}
                      >
                        {copiedSection === color.name ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                    </div>
                    <code className="text-xs text-gray-600">{color.rgb}</code>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200">
          <CardHeader>
            <CardTitle>Logo Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600 flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  Do&apos;s
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Maintain proper spacing around the logo</li>
                  <li>✓ Use official brand colors</li>
                  <li>✓ Keep the logo proportional when resizing</li>
                  <li>✓ Use on clean, contrasting backgrounds</li>
                  <li>✓ Download PNG for easy use</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-red-600 flex items-center gap-2">
                  <X className="w-5 h-5" />
                  Don&apos;ts
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✗ Don&apos;t distort or stretch the logo</li>
                  <li>✗ Don&apos;t change brand colors</li>
                  <li>✗ Don&apos;t add shadows or effects</li>
                  <li>✗ Don&apos;t rotate the logo</li>
                  <li>✗ Don&apos;t use low-resolution versions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
