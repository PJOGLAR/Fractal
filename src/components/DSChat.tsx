import { useState, useRef, useCallback } from 'react'
import { GoogleGenAI, Modality } from '@google/genai'
import { MicCapture, AudioPlayer } from '../lib/audioUtils'
import './DSChat.css'

type CallStatus = 'idle' | 'connecting' | 'connected' | 'error'

interface TranscriptEntry {
  id: string
  role: 'user' | 'assistant'
  text: string
}

const MODEL_NAME = 'gemini-3.1-flash-live-preview'

export function DSChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState<CallStatus>('idle')
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const sessionRef = useRef<any>(null)
  const micRef = useRef<MicCapture | null>(null)
  const playerRef = useRef<AudioPlayer | null>(null)
  const currentUserLineRef = useRef<string>('')
  const currentModelLineRef = useRef<string>('')

  const appendTranscript = (role: 'user' | 'assistant', text: string, replace: boolean) => {
    setTranscript(prev => {
      if (replace && prev.length > 0 && prev[prev.length - 1].role === role) {
        const copy = [...prev]
        copy[copy.length - 1] = { ...copy[copy.length - 1], text }
        return copy
      }
      return [...prev, { id: `${role}-${Date.now()}`, role, text }]
    })
  }

  const startCall = useCallback(async () => {
    setErrorMsg(null)
    setStatus('connecting')

    try {
      // 1. Pedir token efímero al backend (la API key nunca sale del servidor)
      const tokenRes = await fetch('/api/live-token', { method: 'POST' })
      if (!tokenRes.ok) throw new Error('No se pudo obtener el token de sesión')
      const { token } = await tokenRes.json()

      // 2. Conectar a Gemini Live usando el token efímero como si fuera la API key
      const ai = new GoogleGenAI({ apiKey: token })
      playerRef.current = new AudioPlayer()

      const session = await ai.live.connect({
        model: MODEL_NAME,
        config: {
          responseModalities: [Modality.AUDIO],
        },
        callbacks: {
          onopen: () => {
            setStatus('connected')
          },
          onmessage: (message: any) => {
            const serverContent = message.serverContent

            if (!serverContent) return

            // Audio de respuesta del modelo
            const parts = serverContent.modelTurn?.parts || []
            for (const part of parts) {
              if (part.inlineData?.data) {
                playerRef.current?.playChunk(part.inlineData.data)
              }
            }

            // Transcripción de lo que dice el usuario
            if (serverContent.inputTranscription?.text) {
              currentUserLineRef.current += serverContent.inputTranscription.text
              appendTranscript('user', currentUserLineRef.current, true)
            }

            // Transcripción de lo que responde el modelo
            if (serverContent.outputTranscription?.text) {
              currentModelLineRef.current += serverContent.outputTranscription.text
              appendTranscript('assistant', currentModelLineRef.current, true)
            }

            // Turno completo → reiniciar buffers de línea actual
            if (serverContent.turnComplete) {
              currentUserLineRef.current = ''
              currentModelLineRef.current = ''
            }

            // Interrupción (el usuario empezó a hablar mientras el modelo respondía)
            if (serverContent.interrupted) {
              playerRef.current?.clear()
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live error:', err)
            setErrorMsg('Se perdió la conexión con el asistente de voz.')
            setStatus('error')
          },
          onclose: () => {
            setStatus('idle')
          }
        }
      })

      sessionRef.current = session

      // 3. Iniciar captura de micrófono y enviar audio en tiempo real
      const mic = new MicCapture((base64Pcm) => {
        sessionRef.current?.sendRealtimeInput({
          audio: { data: base64Pcm, mimeType: 'audio/pcm;rate=16000' }
        })
      })
      await mic.start()
      micRef.current = mic

    } catch (err) {
      console.error('Error iniciando llamada:', err)
      setErrorMsg('No se pudo iniciar la llamada. Verificá los permisos del micrófono.')
      setStatus('error')
    }
  }, [])

  const endCall = useCallback(() => {
    micRef.current?.stop()
    micRef.current = null

    playerRef.current?.close()
    playerRef.current = null

    sessionRef.current?.close()
    sessionRef.current = null

    currentUserLineRef.current = ''
    currentModelLineRef.current = ''

    setStatus('idle')
  }, [])

  const handleClose = () => {
    if (status === 'connected' || status === 'connecting') {
      endCall()
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Botón flotante */}
      <button
        className="ds-chat-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir asistente de voz del Design System"
      >
        🎙️
      </button>

      {/* Modal del chat */}
      {isOpen && (
        <div className="ds-chat-modal">
          <div className="ds-chat-container">
            {/* Header */}
            <div className="ds-chat-header">
              <div className="ds-chat-title">
                <span className="ds-chat-icon">🎨</span>
                <h3>Fractal DS Assistant</h3>
              </div>
              <button onClick={handleClose} className="ds-chat-close">
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="ds-chat-messages">
              {transcript.length === 0 && status === 'idle' && (
                <div className="ds-chat-welcome">
                  <p>¡Hola! 👋 Soy el asistente de voz del Design System Fractal.</p>
                  <p>Apretá el botón de abajo para empezar a hablar. Podés preguntarme sobre:</p>
                  <ul>
                    <li>🧩 Componentes disponibles</li>
                    <li>🎨 Tokens y variables</li>
                    <li>📝 Uso y buenas prácticas</li>
                  </ul>
                  <p className="ds-chat-voice-tip">
                    🎤 <strong>Nota:</strong> vas a necesitar dar permiso de micrófono al navegador.
                  </p>
                </div>
              )}

              {transcript.map((entry) => (
                <div key={entry.id} className={`ds-chat-message ${entry.role}`}>
                  <div className="ds-chat-message-content">
                    {entry.role === 'assistant' && <span className="ds-chat-avatar">🤖</span>}
                    <div className="ds-chat-text">{entry.text}</div>
                  </div>
                </div>
              ))}

              {errorMsg && (
                <div className="ds-chat-message assistant">
                  <div className="ds-chat-message-content">
                    <span className="ds-chat-avatar">⚠️</span>
                    <div className="ds-chat-text">{errorMsg}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Controles de llamada */}
            <div className="ds-chat-call-controls">
              {status === 'idle' || status === 'error' ? (
                <button className="ds-chat-call-btn start" onClick={startCall}>
                  🎙️ Iniciar conversación
                </button>
              ) : status === 'connecting' ? (
                <button className="ds-chat-call-btn connecting" disabled>
                  Conectando...
                </button>
              ) : (
                <button className="ds-chat-call-btn end" onClick={endCall}>
                  🛑 Terminar conversación
                </button>
              )}
              {status === 'connected' && (
                <span className="ds-chat-live-indicator">● En vivo</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
