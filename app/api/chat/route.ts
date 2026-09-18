import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

// Initialize both AI providers
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

const SELENSYNC_SYSTEM_INSTRUCTION = `
You are Afshara, the AI Lunar Mission Strategist for SelenSync — an advanced mission planning engine designed for NASA's Artemis and Commercial Lunar Payload Services (CLPS) missions at the lunar south pole.

**DOMAIN EXPERTISE:**
- Lunar South Pole illumination cycles, low sun elevation angles (1.5° to 3.5°), and long seasonal shadows.
- Artemis and CLPS commercial lander payloads (e.g., Intuitive Machines Nova-C, Astrobotic Griffin/Peregrine, Firefly Blue Ghost).
- Direct-to-Earth (DTE) RF communication windows, Deep Space Network (DSN 34m/70m) link budgets, and X/Ka-band propagation.
- Permanently Shadowed Regions (PSRs), volatile cold traps, water ice prospecting, and in-situ resource utilization (ISRU).
- Candidate landing sites: Malapert Mountain (85.99°S, 2.93°E), Shackleton Connecting Ridge (89.9°S, 0.0°E), de Gerlache Rim (88.5°S, 88.3°W), and Haworth Crater Rim (87.4°S, 5.1°W).

**COMMUNICATION STYLE:**
- Write in concise, authoritative, professional aerospace paragraphs.
- Use **bold text** for critical orbital and engineering parameters (e.g. **DTE LOS**, **$\theta_{elev}$**, **Link Margin > 3 dB**).
- Provide actionable mission feasibility insights, thermal/power trade-offs, and survival strategies.
- Emphasize solar panel orientation (vertical cylindrical vs horizontal) and blackout mitigation.
`;

export async function POST(req: Request) {
  try {
    const { message, conversationHistory, userFullName } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    let text = '';
    let usedProvider = 'groq';

    try {
      // Try Groq first (Primary - Unlimited Free)
      const messages = [
        {
          role: 'system' as const,
          content: SELENSYNC_SYSTEM_INSTRUCTION
        },
        ...(conversationHistory?.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        })) || []),
        {
          role: 'user' as const,
          content: message
        }
      ];

      const chatCompletion = await groq.chat.completions.create({
        messages: messages,
        model: 'llama-3.3-70b-versatile', // Updated: Latest Groq model (faster & better)
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.8,
      });

      text = chatCompletion.choices[0]?.message?.content || '';
      usedProvider = 'groq';

    } catch (groqError: any) {
      console.warn('Groq API failed, falling back to Gemini:', groqError.message);
      
      // Fallback to Gemini if Groq fails
      try {
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-2.5-flash'
        });

        const history = [
          {
            role: 'user',
            parts: [{ text: SELENSYNC_SYSTEM_INSTRUCTION }]
          },
          {
            role: 'model',
            parts: [{ text: "Greetings! I'm Afshara, your **AI Lunar Mission Strategist** for SelenSync. I provide real-time guidance on CLPS mission architecture, South Pole solar illumination, DTE communications, and landing site feasibility. How can I assist your mission planning today?" }]
          },
          ...(conversationHistory?.map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          })) || [])
        ];

        const chat = model.startChat({
          history: history,
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.8,
            topK: 40,
          },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        text = response.text();
        usedProvider = 'gemini';

      } catch (geminiError: any) {
        console.error('Both Groq and Gemini failed:', geminiError);
        throw new Error('All AI providers are unavailable');
      }
    }

    // If this is the first user message (no previous conversation), add personalized greeting with user's name
    const isFirstMessage = !conversationHistory || conversationHistory.length === 0;
    if (isFirstMessage && userFullName) {
      text = `Hello **${userFullName}**! I'm Afshara, your **AI Lunar Mission Strategist** for SelenSync. I'm ready to assist with lunar south pole trajectory analysis, solar illumination modeling, and DTE RF link optimization.\n\n${text}`;
    }

    // Add AI provider credit at the end (shows which advanced AI is being used)
    // Impressive for student projects and demonstrations
    const aiCredit = usedProvider === 'groq' 
      ? '\n\n(- Powered By Llama 3.1)' 
      : '\n\n(- Powered By Gemini)';
    text = text + aiCredit;

    return NextResponse.json({
      message: text,
      success: true,
      provider: usedProvider // Let frontend know which AI was used
    });

  } catch (error: any) {
    console.error('AI API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get AI response',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
