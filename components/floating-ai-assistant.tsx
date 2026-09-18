"use client"

import React, { useState, useRef, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Bot, Send, X, Minimize2, Maximize2, Sparkles, MessageSquare,
  TrendingUp, Shield, Satellite, Zap, BarChart3, Globe, Rocket
} from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

// Page-specific context to help AI understand where user is
const PAGE_CONTEXTS = {
  '/dashboard': 'The user is viewing the main CLPS lunar mission control dashboard.',
  '/dashboard/map': 'The user is viewing the 3D Lunar South Pole map with candidate landing sites.',
  '/dashboard/analytics': 'The user is analyzing solar power curves, terrain obstruction, and DTE RF link budgets.',
  '/dashboard/chat': 'The user is consulting with the AI Lunar Mission Strategist.',
  '/dashboard/compliance': 'The user is reviewing lunar environmental safety, planetary protection, and ISRU protocols.',
  '/': 'The user is on the SelenSync homepage exploring CLPS mission planning capabilities.',
}

// Quick action suggestions based on current page
const PAGE_SUGGESTIONS: Record<string, string[]> = {
  '/dashboard': [
    "What is the current solar elevation at Shackleton?",
    "Check DTE communication window for Malapert",
    "Calculate worst-case blackout duration"
  ],
  '/dashboard/map': [
    "Compare Shackleton vs Malapert terrain slope",
    "Show permanently shadowed regions (PSRs)",
    "Explain South Pole polar stereographic projection"
  ],
  '/dashboard/analytics': [
    "Analyze DSN 34m X-band link margin",
    "Calculate 2.5m² vertical solar array output",
    "Explain Earth libration cycle effects"
  ],
  '/': [
    "How does SelenSync optimize CLPS missions?",
    "What landing sites are pre-configured?",
    "Explain lunar south pole shadow masking"
  ]
}

export default function FloatingAIAssistant() {
  const user = null;
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Get page-specific suggestions
  const currentSuggestions = PAGE_SUGGESTIONS[pathname] || PAGE_SUGGESTIONS['/']
  const pageContext = PAGE_CONTEXTS[pathname as keyof typeof PAGE_CONTEXTS] || ''

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputMessage.trim()
    if (!textToSend || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)
    setIsThinking(true)

    try {
      // Get user's full name for personalized greeting
      const userFullName = user?.firstName && user?.lastName 
        ? `${user.firstName} ${user.lastName}`
        : user?.firstName || user?.lastName || null

      // Build conversation history for API (exclude welcome message)
      const apiHistory = messages
        .filter(msg => msg.id !== Date.now().toString()) // Exclude just-added user message
        .map(msg => ({
          sender: msg.sender,
          content: msg.content
        }))

      // Call the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: apiHistory,
          userFullName: messages.length === 1 ? userFullName : null // Only greet on first user message
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(errorData.error || 'Failed to get AI response')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        sender: "ai",
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI Response Error:', error)
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment or visit the main chat page for a detailed conversation.",
        sender: "ai",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsThinking(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      // Add welcome message when first opened
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: "Hello! I'm **Afshara**, your **AI Lunar Mission Strategist**. I can assist you with lunar South Pole illumination cycles, CLPS lander payloads, terrain shadow masking, and Direct-to-Earth communication windows. Which candidate landing site or mission timeline would you like to evaluate?",
        sender: "ai",
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized)
    setIsMinimized(false)
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const clearChat = () => {
    setMessages([])
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: "Mission context reset. How can I assist your lunar operation?",
      sender: "ai",
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }

  // Format message content with markdown-style bold text
  const formatMessage = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>
      }
      return <span key={index}>{part}</span>
    })
  }

  if (!isOpen) {
    // Position on left for homepage, right for other pages
    const buttonPosition = pathname === '/' ? 'left-6' : 'right-6'
    
    return (
      <Button
        onClick={toggleOpen}
        className={`fixed bottom-6 ${buttonPosition} h-14 w-14 rounded-full bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white shadow-2xl hover:shadow-[#4e6aff]/50 transition-all duration-300 hover:scale-110 z-50 group`}
        aria-label="Open AI Mission Strategist"
      >
        <div className="relative">
          <Bot className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
        </div>
      </Button>
    )
  }

  const chatWindowClass = isMaximized 
    ? "fixed inset-4 z-50" 
    : isMinimized 
    ? `fixed bottom-6 ${pathname === '/' ? 'left-6' : 'right-6'} w-80 h-16 z-50`
    : `fixed bottom-6 ${pathname === '/' ? 'left-6' : 'right-6'} w-96 h-[600px] z-50`

  return (
    <Card className={`${chatWindowClass} transition-all duration-300 shadow-2xl border-2 border-[#4e6aff]/20 overflow-hidden`}>
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] text-white p-4 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white bg-purple-700">
              <AvatarFallback className="bg-purple-800 text-white font-bold">AZ</AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
            </span>
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Afshara</CardTitle>
            <p className="text-xs text-white/90">AI Lunar Mission Strategist</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            onClick={toggleMinimize}
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            onClick={toggleMaximize}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-white/20 text-white"
            onClick={toggleOpen}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-80px)] overflow-hidden">
          {/* Context Badge */}
          {pathname !== '/' && (
            <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex-shrink-0">
              <Badge variant="secondary" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Context: {pathname.split('/').pop() || 'Dashboard'}
              </Badge>
            </div>
          )}

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.sender === "ai" && (
                    <div className="flex flex-col items-center gap-1">
                      <Avatar className="h-8 w-8 border-2 border-[#4e6aff]/20">
                        <AvatarFallback className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] text-white text-xs">
                          AZ
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-gray-600 font-medium">Afshara</span>
                    </div>
                  )}
                  
                  <div
                    className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{formatMessage(message.content)}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex flex-col items-center gap-1">
                      <Avatar className="h-8 w-8 border-2 border-[#4e6aff]/20">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback className="bg-[#4e6aff] text-white text-xs">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-[10px] text-gray-600 font-medium">
                        {user?.lastName || user?.firstName || 'You'}
                      </span>
                    </div>
                  )}
                </div>
              ))}

              {isThinking && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 border-2 border-[#4e6aff]/20">
                    <AvatarFallback className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] text-white text-xs">
                      AZ
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-gray-100 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex-shrink-0">
              <p className="text-xs text-gray-600 mb-2 font-semibold">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {currentSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 hover:bg-[#4e6aff] hover:text-white hover:border-[#4e6aff] transition-all"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area - Fixed at bottom */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-[#4e6aff] to-[#6d5bff] hover:from-[#3d59ef] hover:to-[#5d4bef] text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {messages.length > 2 && (
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-gray-500 hover:text-gray-700 mt-2 w-full"
                onClick={clearChat}
              >
                Clear conversation
              </Button>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
