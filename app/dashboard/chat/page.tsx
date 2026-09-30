"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import UniversalHeader from "@/components/universal-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Send, Bot, User, Satellite, Rocket, Globe, Zap, Sparkles, MessageSquare, 
  TrendingUp, Shield, Clock, Download, Trash2, Copy, ThumbsUp, ThumbsDown, 
  RefreshCw, Radio, Compass, Sun, Moon, Info, Check, CheckCircle2, ChevronRight,
  Share2, Bookmark, Terminal, HelpCircle
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  liked?: boolean
  disliked?: boolean
  bookmarked?: boolean
  provider?: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

const LUNAR_SAMPLE_PROMPTS = [
  {
    title: "Solar Illumination Analysis",
    prompt: "What is the expected solar elevation and power output for Malapert Mountain during lunar summer?",
    icon: Sun,
    category: "Power"
  },
  {
    title: "DTE Link Budget",
    prompt: "Calculate the X-band DTE link margin to a 34m DSN station with Earth elevation at 4.2°.",
    icon: Radio,
    category: "Comms"
  },
  {
    title: "Landing Site Comparison",
    prompt: "Compare Shackleton Connecting Ridge vs Malapert Mountain for a 14-day CLPS landing mission.",
    icon: Compass,
    category: "Site Selection"
  },
  {
    title: "Shadow & PSR Cold Traps",
    prompt: "How does terrain horizon masking impact thermal survival in permanently shadowed regions?",
    icon: Moon,
    category: "Thermal"
  },
  {
    title: "Vertical vs Flat Panels",
    prompt: "Why are vertical cylindrical solar arrays superior at lunar polar latitudes below 85°S?",
    icon: Zap,
    category: "Architecture"
  },
  {
    title: "Blackout Survival Strategy",
    prompt: "Propose battery reserve and sleep-mode strategies during a 54-hour topographic eclipse.",
    icon: Shield,
    category: "Operations"
  },
  {
    title: "Water-Ice ISRU Prospecting",
    prompt: "Assess water-ice volatile extraction feasibility and rover traverse safety inside Faustini Crater PSR.",
    icon: Globe,
    category: "Resources"
  },
  {
    title: "Slope & Tip-Over Risk",
    prompt: "Evaluate terrain slope hazard and tip-over probability for Blue Ghost lander on de Gerlache Ridge.",
    icon: TrendingUp,
    category: "Landing Hazard"
  },
  {
    title: "Nova-C vs Griffin Trade",
    prompt: "Compare Intuitive Machines Nova-C vs Astrobotic Griffin for a 14-day surface mission at de Gerlache Ridge.",
    icon: Rocket,
    category: "Lander Trade"
  },
  {
    title: "DSN Ground Network Visibility",
    prompt: "Verify Ka-band high-gain downlink telemetry rates to Madrid DSN 70m station at -86.5°S latitude.",
    icon: Satellite,
    category: "Telemetry"
  },
  {
    title: "Cryogenic Sleep Budget",
    prompt: "Propose an emergency sleep-mode power budget for Intuitive Machines Nova-C under 12-hour shadow transit.",
    icon: Sparkles,
    category: "Power Budget"
  },
  {
    title: "MCDA Site Ranking Matrix",
    prompt: "What is the optimal landing site score using the 0-100 MCDA matrix for Haworth Crater rim?",
    icon: CheckCircle2,
    category: "Scoring"
  }
]

const DEMO_QUERIES = [
  "Assess solar illumination stability and cryogenic shadow endurance for Malapert Mountain during the Artemis III window.",
  "Calculate Direct-to-Earth X-band link margin to NASA DSN 34m dishes with Earth elevation at 4.2°.",
  "Compare Shackleton Connecting Ridge vs Malapert Peak for a 14-day CLPS mission with 100W base load.",
  "Analyze line-of-sight RF blockage between Shackleton Rim and Amundsen Crater relay station.",
  "Propose an emergency sleep-mode power budget for Intuitive Machines Nova-C under 12-hour shadow transit.",
  "What is the optimal landing site score using the 0-100 MCDA matrix for Haworth Crater rim?",
  "Why are vertical cylindrical solar arrays superior to flat horizontal panels below 85°S latitude?",
  "Assess water-ice volatile extraction feasibility and rover traverse safety inside Faustini Crater PSR.",
  "Compare Intuitive Machines Nova-C vs Astrobotic Griffin for a 14-day surface mission at de Gerlache Ridge.",
  "Verify Ka-band high-gain downlink telemetry rates to Madrid DSN 70m station at -86.5°S latitude.",
  "Evaluate thermal survival strategies for Astrobotic Griffin lander during a 54-hour topographic eclipse.",
  "Model surface slope hazard and tip-over probability for Blue Ghost lander on de Gerlache Ridge."
]

const STRATEGIST_CAPABILITIES = [
  { name: "Solar Ephemeris & Horizon Masking", icon: Sun, desc: "High-resolution topographic illumination modeling" },
  { name: "Direct-to-Earth RF Link Budgets", icon: Radio, desc: "ITU / DSN 34m & 70m carrier margins and loss calculations" },
  { name: "Candidate Site Feasibility", icon: Compass, desc: "Malapert, Shackleton, de Gerlache & Haworth trade-offs" },
  { name: "CLPS Payload Optimization", icon: Rocket, desc: "Nova-C, Griffin, and Blue Ghost mission profile tuning" },
]

// The 6 aerospace conversations (6 * 2 = 12 messages) that run automatically one after another on Ctrl+G
const AUTO_DEMO_CONVERSATIONS = [
  {
    query: "Evaluate Malapert Mountain (85.99°S, 2.93°E) for the upcoming Artemis III landing window.",
    response: "### Feasibility Evaluation: Malapert Mountain Massif\n- **MCDA Suitability Score**: **84.8 / 100** (Tier-1 Prime Candidate)\n- **Solar Illumination**: **86.4%** continuous daylight during lunar summer. Low grazing solar angles (1.4° – 2.8°) require **2.5 m² vertical cylindrical solar arrays** to mitigate 97% cosine loss.\n- **Direct-to-Earth (DTE) RF Visibility**: Earth elevation maintains **+4.1° to +6.8°** clearance above surrounding massifs, ensuring uninterrupted line-of-sight to NASA DSN 34m/70m subnetworks.\n- **Slope & Landing Hazard**: Summit plateau offers contiguous landing patches with **< 5.2° slope**, safely below the 10° dynamic tip-over threshold."
  },
  {
    query: "Calculate the direct-to-Earth X-band link margin to NASA DSN Canberra 34m beam waveguide station.",
    response: "### DTE RF Link Budget: Canberra Complex (DSS-43 / DSS-34)\n- **Carrier Frequency**: X-band Downlink 8.45 GHz\n- **Free Space Path Loss (FSPL)**: **-216.4 dB** (at 384,400 km mean distance)\n- **Lander EIRP**: 15W High-Gain Antenna (HGA) = **+32.5 dBW**\n- **Ground Station G/T**: **+53.2 dB/K** (Cryogenic Low Noise Amplifier)\n- **Calculated Link Margin**: **+5.8 dB** (exceeds NASA's +3.0 dB flight rule reserve).\n- **Supported Data Rate**: Sustains **2.0 Mbps uncompressed telemetry** and HD mission video streaming."
  },
  {
    query: "What is the worst-case topographic shadow duration at Shackleton Connecting Ridge, and what battery reserve is required?",
    response: "### Cryogenic Shadow Analysis: Shackleton Connecting Ridge\n- **Maximum Eclipse Duration**: **54.2 continuous hours** during southern winter minimum.\n- **Cryogenic Sink Temperature**: Drops to **40 K (-233°C)** in permanent shadow regions.\n- **Base Power Demand**: 100W continuous payload load = **5.42 kWh energy capacity**.\n- **Survival Strategy**:\n  1. Trigger deep sleep hibernation reducing housekeeping draw to **32W** (sensor heaters only).\n  2. Reduces battery mass penalty from 18.2 kg to **6.8 kg Li-ion (260 Wh/kg)**.\n  3. Integrated RHU (Radioisotope Heater Unit) thermal loops prevent propellant line freeze-up."
  },
  {
    query: "Why are vertical cylindrical solar arrays superior to flat horizontal panels below 85°S latitude?",
    response: "### Polar Solar Geometry Trade Study: Grazing Angles\n- **Solar Vector Angle**: The Sun skims the horizon at **1.54° ± 1.5°** elevation relative to the local horizontal plane.\n- **Cosine Degradation**: Horizontal panels suffer effective area reduction to \n  *A_eff = A · sin(1.5°) ≈ 0.026 · A* (yielding **>97% cosine loss**).\n- **Vertical 360° Cylindrical Array**: Captures normal solar incidence horizontally as the sub-solar longitude sweeps 360° across the 29.5-day synodic cycle.\n- **Specific Output**: Yields **340 W/m² peak** vs **11 W/m²** for flat panels—a **30.9x power capture multiplier**."
  },
  {
    query: "Assess water-ice volatile extraction feasibility and rover traverse safety inside Faustini Crater PSR.",
    response: "### ISRU Volatile Prospecting: Faustini Crater PSR\n- **Estimated Volatiles**: LEND and Diviner thermal mapping confirm **5.5 ± 1.2 wt% equivalent water-ice** in the upper 1m regolith.\n- **Topographic Hazard**: Crater wall slope averages **18.4°**, exceeding the 12° robotic traverse rollover safety limit.\n- **Traverse Protocol**:\n  - Deploy a tethered rappelling micro-rover from the outer rim (87.1°S).\n  - Active LiDAR illumination and laser retro-reflectors required due to zero ambient light and severe radar clutter."
  },
  {
    query: "Compare Intuitive Machines Nova-C vs Astrobotic Griffin for a 14-day surface mission at de Gerlache Ridge.",
    response: "### CLPS Lander Platform Evaluation: de Gerlache Ridge (-88.5°S)\n- **Payload Capacity**: Nova-C (130 kg) vs Griffin (450 kg VIPER-class rover platform).\n- **Power Architecture**: Nova-C top-mounted deployable (200W) vs Griffin integrated vertical body panels (450W).\n- **Slope Tolerance**: Nova-C (12.0° max slope) vs Griffin (8.5° strict limit due to elevated center of gravity).\n- **Eclipse Endurance**: Nova-C (12-hour shadow battery buffer) vs Griffin (18.5-hour reserve).\n- **Strategic Recommendation**: Nova-C is superior for high-relief undulating topography, whereas Griffin is recommended for heavy ISRU drilling payloads."
  }
]

const INITIAL_WELCOME_MESSAGE: Message = {
  id: "init-0",
  content:
    "Greetings! I'm **Asteria** (Autonomous Surface Topography & Ephemeris Risk Intelligence Assistant), your **AI Lunar Mission Strategist** for SelenSync. I specialize in NASA Artemis and CLPS mission optimization at the lunar south pole.\n\nI can assist you with:\n- **Solar Illumination & Power Windows** (topographic shadow calculations)\n- **Direct-to-Earth (DTE) RF Link Margins** (DSN 34m/70m stations)\n- **Landing Site Feasibility Analysis** (Malapert, Shackleton, de Gerlache, Haworth)\n- **Thermal Management & Eclipse Survival Strategies**\n\nWhat lunar mission scenario would you like to evaluate?",
  sender: "ai",
  timestamp: new Date(),
  provider: "groq"
}

export default function ChatPage() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME_MESSAGE])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAutoTyping, setIsAutoTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isDemoRunningRef = useRef(false)
  const abortDemoRef = useRef(false)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Stop running demo safely
  const stopDemo = useCallback(() => {
    abortDemoRef.current = true
    isDemoRunningRef.current = false
    setIsAutoTyping(false)
    setIsLoading(false)
    setInputMessage("")
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDemo()
    }
  }, [stopDemo])

  // Automated 6-conversation execution engine triggered by Ctrl+G
  const runSixConversationsDemo = useCallback(async () => {
    if (isDemoRunningRef.current) {
      stopDemo()
      return
    }

    isDemoRunningRef.current = true
    abortDemoRef.current = false
    setIsAutoTyping(true)

    const sleep = (ms: number) =>
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          resolve(!abortDemoRef.current)
        }, ms)
        typingTimerRef.current = timer
      })

    try {
      for (let i = 0; i < AUTO_DEMO_CONVERSATIONS.length; i++) {
        if (abortDemoRef.current) break

        const conv = AUTO_DEMO_CONVERSATIONS[i]

        // 1. Realistic live typing into the input box character by character
        for (let c = 1; c <= conv.query.length; c++) {
          if (abortDemoRef.current) break
          setInputMessage(conv.query.slice(0, c))
          const ok = await sleep(18)
          if (!ok) break
        }

        if (abortDemoRef.current) break
        await sleep(280) // brief natural pause before dispatch

        if (abortDemoRef.current) break
        // 2. Post user message
        const userMsg: Message = {
          id: `demo-u-${i}-${Date.now()}`,
          content: conv.query,
          sender: "user",
          timestamp: new Date()
        }
        setInputMessage("")
        setMessages((prev) => [...prev, userMsg])

        // 3. Show Asteria computing indicator
        setIsLoading(true)
        await sleep(650) // authentic computing latency

        if (abortDemoRef.current) {
          setIsLoading(false)
          break
        }

        // 4. Post Asteria AI response
        const aiMsg: Message = {
          id: `demo-a-${i}-${Date.now()}`,
          content: conv.response,
          sender: "ai",
          timestamp: new Date(),
          provider: "groq"
        }
        setIsLoading(false)
        setMessages((prev) => [...prev, aiMsg])

        // 5. Natural pause between conversations so viewer can absorb each round
        if (i < AUTO_DEMO_CONVERSATIONS.length - 1) {
          await sleep(1300)
        }
      }
    } finally {
      isDemoRunningRef.current = false
      setIsAutoTyping(false)
      setIsLoading(false)
      setInputMessage("")
    }
  }, [stopDemo])

  // Keyboard listener: Ctrl+G (or Cmd+G) triggers the full 6-chat demo; Esc cancels it
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault()
        runSixConversationsDemo()
      } else if (e.key === 'Escape' && isDemoRunningRef.current) {
        e.preventDefault()
        stopDemo()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [runSixConversationsDemo, stopDemo])

  const handleSendMessage = useCallback(async (textOverride?: string) => {
    const textToSend = (textOverride !== undefined ? textOverride : inputMessage).trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: messages.slice(-6).map((m) => ({
            sender: m.sender,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Mission Assistant network error')
      }

      const data = await response.json()
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message || "Unable to compute lunar telemetry at this moment.",
        sender: "ai",
        timestamp: new Date(),
        provider: data.provider || 'ai'
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err: any) {
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `**Mission Telemetry Notice**: ${err.message || 'AI engine is currently calculating ephemeris offline.'}\n\nBased on baseline CLPS parameters at Malapert Mountain (85.99°S, 2.93°E), continuous solar exposure reaches **86.4%** with an Earth DTE elevation clearance of **> 4.1°**, supporting uninterrupted X-band telemetry with **+5.8 dB link margin**.`,
        sender: "ai",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }, [inputMessage, isLoading, messages])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, liked: !m.liked, disliked: false } : m))
    )
  }

  const toggleDislike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, disliked: !m.disliked, liked: false } : m))
    )
  }

  const handleExportTranscript = () => {
    const transcript = messages
      .map((m) => `[${m.timestamp.toLocaleTimeString()}] ${m.sender === 'user' ? 'USER' : 'ASTERIA (AI STRATEGIST)'}:\n${m.content}\n`)
      .join('\n----------------------------------------\n\n')
    
    const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `selensync-mission-session-${new Date().toISOString().slice(0, 10)}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleClearChat = () => {
    stopDemo()
    if (confirm('Clear current lunar mission planning session?')) {
      setMessages([INITIAL_WELCOME_MESSAGE])
    }
  }

  return (
    <div className="min-h-screen lg:h-screen lg:max-h-screen bg-slate-50 flex flex-col lg:overflow-hidden">
      <UniversalHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 py-2 sm:px-6 sm:py-3 flex flex-col gap-2.5 min-h-0 lg:overflow-hidden">
        {/* Top Control Banner */}
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 sm:py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-[#4e6aff] via-[#6366f1] to-[#7c3aed] p-0.5 shadow-sm flex items-center justify-center border-2 border-white/40">
                <div className="w-full h-full rounded-[10px] bg-slate-950/20 backdrop-blur-xs flex items-center justify-center text-white">
                  <Bot className="h-6 w-6 text-white drop-shadow-xs" />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">Asteria</h1>
                <Badge className="bg-[#4e6aff]/10 text-[#4e6aff] hover:bg-[#4e6aff]/20 border-[#4e6aff]/30 font-medium text-[11px] py-0">
                  AI Mission Strategist
                </Badge>
                <Badge variant="outline" className="text-emerald-700 bg-emerald-50 border-emerald-200 text-[11px] py-0 hidden sm:inline-flex">
                  Online
                </Badge>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">
                CLPS & Artemis South Pole trajectories, solar illumination, and RF telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWelcomeDialog(true)}
              className="text-xs border-slate-300 hover:bg-slate-100 text-slate-700 h-8"
            >
              <Info className="h-3.5 w-3.5 mr-1 text-[#4e6aff]" />
              Capabilities
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportTranscript}
              className="text-xs border-slate-300 hover:bg-slate-100 text-slate-700 h-8"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearChat}
              className="text-xs border-rose-200 text-rose-600 hover:bg-rose-50 h-8"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          </div>
        </div>

        {/* Main Grid: Prompt Chips Sidebar & Chat Conversation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 min-h-0 lg:overflow-hidden items-stretch">
          {/* Left Sidebar: Quick Prompts & Mission Specs */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-3 min-h-0 overflow-y-auto pr-1 order-2 lg:order-1">
            <Card className="bg-white border-slate-200 shadow-xs">
              <CardHeader className="py-2.5 px-3.5 pb-2">
                <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#4e6aff]" />
                  Mission Prompt Library
                </CardTitle>
                <CardDescription className="text-[11px] text-slate-500">
                  Select a template to query lunar terrain and telemetry
                </CardDescription>
              </CardHeader>
              <CardContent className="px-3.5 pb-3 space-y-2 max-h-[340px] overflow-y-auto pr-1">
                {LUNAR_SAMPLE_PROMPTS.map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:border-[#4e6aff]/40 hover:bg-blue-50/50 transition-all text-xs group flex items-start gap-2.5 bg-white cursor-pointer"
                    >
                      <div className="p-1 rounded bg-slate-100 group-hover:bg-[#4e6aff]/10 text-slate-600 group-hover:text-[#4e6aff] transition-colors shrink-0">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-800 group-hover:text-[#4e6aff] flex items-center justify-between text-[11px]">
                          <span className="truncate">{item.title}</span>
                          <span className="text-[9px] text-slate-400 font-normal shrink-0 ml-1">{item.category}</span>
                        </div>
                        <p className="text-slate-500 mt-0.5 line-clamp-1 text-[11px] leading-snug">
                          {item.prompt}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-white to-blue-50/40 border-slate-200 shadow-xs">
              <CardHeader className="py-2 px-3.5">
                <CardTitle className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-[#4e6aff]" />
                  Active Mission Context
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3.5 pb-2.5 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500">Target Region:</span>
                  <span className="font-semibold text-slate-800">Lunar South Pole (&gt;85°S)</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500">Default Site:</span>
                  <span className="font-semibold text-slate-800">Malapert Massif (-85.99°, 2.93°)</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500">Solar Array:</span>
                  <span className="font-semibold text-slate-800">2.5 m² Vertical (30% Eff)</span>
                </div>
                <div className="flex justify-between py-0.5 border-b border-slate-100">
                  <span className="text-slate-500">RF Ground:</span>
                  <span className="font-semibold text-slate-800">DSN 34m Beam Waveguide</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-500">AI Model:</span>
                  <span className="font-semibold text-[#4e6aff]">Llama 3.3 70B & Gemini 2.5</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Main Chat Window */}
          <div className="col-span-1 lg:col-span-8 flex flex-col h-[520px] sm:h-[600px] lg:h-full bg-white border border-slate-200 rounded-xl shadow-xs min-h-0 overflow-hidden order-1 lg:order-2">
            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-4 bg-slate-50/40 min-h-0" ref={scrollAreaRef}>
              {messages.map((message) => {
                const isUser = message.sender === "user"
                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#4e6aff] to-[#7c3aed] flex items-center justify-center shrink-0 shadow-xs mt-0.5 border border-[#4e6aff]/40 text-white">
                        <Bot className="h-4 w-4" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[80%] flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-xs font-semibold text-slate-700">
                          {isUser ? "Mission Lead" : "Asteria"}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                          isUser
                            ? "bg-gradient-to-r from-[#4e6aff] to-[#6366f1] text-white rounded-tr-xs"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                        }`}
                      >
                        <div className="whitespace-pre-wrap space-y-2 text-[13px] sm:text-sm">
                          {message.content.split('\n\n').map((paragraph, pIdx) => {
                            // Basic bold parsing
                            const formatted = paragraph.split(/(\*\*.*?\*\*)/g).map((chunk, cIdx) => {
                              if (chunk.startsWith('**') && chunk.endsWith('**')) {
                                return <strong key={cIdx} className={isUser ? "text-white font-bold" : "text-slate-900 font-semibold"}>{chunk.slice(2, -2)}</strong>
                              }
                              return chunk
                            })
                            return <p key={pIdx}>{formatted}</p>
                          })}
                        </div>
                      </div>

                      {/* AI Response Action Buttons */}
                      {!isUser && (
                        <div className="flex items-center gap-1 mt-1 px-1 text-slate-400 text-xs">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(message.id, message.content)}
                            className="h-6 px-2 text-slate-500 hover:text-[#4e6aff] hover:bg-slate-100 text-[11px]"
                          >
                            {copiedId === message.id ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-emerald-600" />
                                <span className="text-emerald-600">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                <span>Copy</span>
                              </>
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLike(message.id)}
                            className={`h-6 px-2 ${message.liked ? 'text-[#4e6aff] bg-blue-50' : 'text-slate-500 hover:text-[#4e6aff]'}`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleDislike(message.id)}
                            className={`h-6 px-2 ${message.disliked ? 'text-rose-600 bg-rose-50' : 'text-slate-500 hover:text-rose-600'}`}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <Avatar className="h-8 w-8 border border-slate-300 shrink-0 shadow-xs mt-0.5">
                        <AvatarFallback className="bg-slate-800 text-white font-bold text-[10px]">
                          YOU
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              })}

              {isLoading && (
                <div className="flex gap-3 items-start">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-[#4e6aff] to-[#7c3aed] flex items-center justify-center shrink-0 shadow-xs mt-0.5 border border-[#4e6aff]/40 text-white">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-[#4e6aff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-[#4e6aff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-[#4e6aff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        Asteria is computing orbital ephemeris and terrain visibility...
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 sm:p-3.5 border-t border-slate-200 bg-white shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage()
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask Asteria about lunar south pole illumination, link budgets, or CLPS landing sites..."
                  className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-[#4e6aff] text-slate-900 placeholder:text-slate-400 py-4 text-xs sm:text-sm"
                  disabled={isLoading || isAutoTyping}
                />
                <Button
                  type="submit"
                  disabled={isLoading || isAutoTyping || !inputMessage.trim()}
                  className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white px-4 py-4 rounded-xl transition-all shadow-sm hover:shadow-[#4e6aff]/30"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 px-1">
                <span className="truncate">AI models: Llama 3.3 70B & Gemini 2.5 • Trained on NASA PDS, LOLA & Artemis standards</span>
                <span className="hidden sm:inline">Press Enter to dispatch telemetry query</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Capabilities Info Modal */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="max-w-xl bg-white border border-slate-200 text-slate-900">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-[#4e6aff] to-[#7c3aed] flex items-center justify-center text-white shadow-sm border border-[#4e6aff]/40">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  Asteria — AI Lunar Mission Strategist
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  SelenSync Core Intelligence Architecture
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 text-sm text-slate-700 py-2">
            <p className="leading-relaxed">
              Asteria (Autonomous Surface Topography & Ephemeris Risk Intelligence Assistant) is designed specifically for Artemis and Commercial Lunar Payload Services (CLPS) mission planners. She evaluates complex South Pole topography, low solar elevations, Direct-to-Earth link visibility, and shadow persistence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {STRATEGIST_CAPABILITIES.map((cap, i) => {
                const Icon = cap.icon
                return (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 mb-1">
                      <Icon className="h-4 w-4 text-[#4e6aff]" />
                      <span>{cap.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{cap.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={() => setShowWelcomeDialog(false)}
              className="bg-[#4e6aff] hover:bg-[#3d59ef] text-white"
            >
              Start Mission Consultation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
