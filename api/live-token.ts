import { GoogleGenAI } from '@google/genai'
import componentData from '../src/data/component-data.json'
import templateData from '../src/data/template-data.json'

// Este endpoint genera un token efímero para que el cliente (navegador)
// se conecte directamente a la API de Gemini Live vía WebSocket.
// La API key real NUNCA se expone al cliente, solo este token de corta duración.
// Nota: los JSON se importan de forma estática para que funcionen en Edge Runtime
// (Edge no soporta el módulo "fs" de Node).

function buildSystemInstruction(): string {
  try {
    const components = (componentData as any).components || []
    const templates = (templateData as any).components || []
    const foundations = (componentData as any).foundations || {}
    const extractedAt = (componentData as any).extractedAt

    return `Eres un asistente de voz experto del Design System Fractal de Telecom Personal Pay.
Respondes por audio en español, de forma breve, clara y conversacional (esto es una llamada de voz, no un chat de texto).

CONTEXTO DEL DESIGN SYSTEM (extraído: ${extractedAt}):
- Componentes disponibles: ${components.length}
- Templates disponibles: ${templates.length}
- Colecciones de tokens: ${foundations.collections?.join(', ') || 'N/A'}
- Tokens primitivos: ${foundations.primitiveTokens?.length || 0}
- Tokens semánticos: ${foundations.semanticTokens?.length || 0}

COMPONENTES PRINCIPALES:
${components.slice(0, 15).map((c: any) => `- ${c.componentName} (${c.category}): ${c.bindings.length} tokens vinculados`).join('\n')}

INSTRUCCIONES:
1. Responde en español, con oraciones cortas pensadas para ser escuchadas, no leídas.
2. Evita listas largas o bloques de código extensos habladas; resume lo esencial.
3. Si preguntan por un componente específico, da su propósito, variantes principales y algún token relevante.
4. Si no tenés información específica sobre algo, decilo con naturalidad y ofrecé buscar en la documentación.
5. Sé cálido y directo, como un compañero de equipo del Design System.`
  } catch (error) {
    console.error('Error cargando datos del DS para system instruction:', error)
    return 'Eres un asistente de voz del Design System Fractal. Responde en español de forma breve y clara.'
  }
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'GEMINI_API_KEY no configurada en el servidor' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const now = new Date()
    const expireTime = new Date(now.getTime() + 30 * 60 * 1000) // 30 min para enviar mensajes
    const newSessionExpireTime = new Date(now.getTime() + 1 * 60 * 1000) // 1 min para iniciar sesión

    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: expireTime.toISOString(),
        newSessionExpireTime: newSessionExpireTime.toISOString(),
        liveConnectConstraints: {
          model: 'gemini-3.1-flash-live-preview',
          config: {
            responseModalities: ['AUDIO'],
            systemInstruction: {
              parts: [{ text: buildSystemInstruction() }]
            },
            outputAudioTranscription: {},
            inputAudioTranscription: {},
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
            }
          }
        }
      }
    })

    return new Response(JSON.stringify({ token: token.name }), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error creando token efímero:', error)
    return new Response(JSON.stringify({ error: 'No se pudo crear el token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export const config = {
  runtime: 'edge'
}