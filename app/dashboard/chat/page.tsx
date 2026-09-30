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
  }
]

const DEMO_QUERIES = [
  "Assess solar illumination stability and cryogenic shadow endurance for Malapert Mountain during the Artemis III window.",
  "Calculate Direct-to-Earth X-band link margin to NASA DSN 34m dishes with Earth elevation at 4.2°.",
  "Compare Shackleton Connecting Ridge vs Malapert Peak for a 14-day CLPS mission with 100W base load.",
  "Analyze line-of-sight RF blockage between Shackleton Rim and Amundsen Crater relay station."
]

const STRATEGIST_CAPABILITIES = [
  { name: "Solar Ephemeris & Horizon Masking", icon: Sun, desc: "High-resolution topographic illumination modeling" },
  { name: "Direct-to-Earth RF Link Budgets", icon: Radio, desc: "ITU / DSN 34m & 70m carrier margins and loss calculations" },
  { name: "Candidate Site Feasibility", icon: Compass, desc: "Malapert, Shackleton, de Gerlache & Haworth trade-offs" },
  { name: "CLPS Payload Optimization", icon: Rocket, desc: "Nova-C, Griffin, and Blue Ghost mission profile tuning" },
]

export default function ChatPage() {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Greetings! I'm **Asteria** (Autonomous Surface Topography & Ephemeris Risk Intelligence Assistant), your **AI Lunar Mission Strategist** for SelenSync. I specialize in NASA Artemis and CLPS mission optimization at the lunar south pole.\n\nI can assist you with:\n- **Solar Illumination & Power Windows** (topographic shadow calculations)\n- **Direct-to-Earth (DTE) RF Link Margins** (DSN 34m/70m stations)\n- **Landing Site Feasibility Analysis** (Malapert, Shackleton, de Gerlache, Haworth)\n- **Thermal Management & Eclipse Survival Strategies**\n\nWhat lunar mission scenario would you like to evaluate?",
      sender: "ai",
      timestamp: new Date(),
      provider: "groq"
    },
  ])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isAutoTyping, setIsAutoTyping] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const demoQueryIndexRef = useRef(0)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages, isLoading])

  // Cleanup typing timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current)
      }
    }
  }, [])

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

  // Realistic character-by-character auto-typing demo query
  const triggerDemoAutoType = useCallback(() => {
    if (isLoading || isAutoTyping) return
    setIsAutoTyping(true)
    const query = DEMO_QUERIES[demoQueryIndexRef.current % DEMO_QUERIES.length]
    demoQueryIndexRef.current += 1

    let charIndex = 0
    setInputMessage("")

    if (typingTimerRef.current) clearInterval(typingTimerRef.current)

    typingTimerRef.current = setInterval(() => {
      charIndex++
      if (charIndex <= query.length) {
        setInputMessage(query.slice(0, charIndex))
      } else {
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current)
          typingTimerRef.current = null
        }
        setTimeout(() => {
          setIsAutoTyping(false)
          handleSendMessage(query)
        }, 400)
      }
    }, 28)
  }, [isLoading, isAutoTyping, handleSendMessage])

  // Keyboard shortcut listener for Ctrl+G / Cmd+G
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'g' || e.key === 'G')) {
        e.preventDefault()
        triggerDemoAutoType()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerDemoAutoType])

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
    if (confirm('Clear current lunar mission planning session?')) {
      setMessages([
        {
          id: Date.now().toString(),
          content: "Session reset. Ready for new lunar mission parameter analysis.",
          sender: "ai",
          timestamp: new Date()
        }
      ])
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
              <CardContent className="px-3.5 pb-3 space-y-2">
                {LUNAR_SAMPLE_PROMPTS.slice(0, 4).map((item, idx) => {
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
