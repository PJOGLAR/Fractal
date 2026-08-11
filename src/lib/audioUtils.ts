// Utilidades de audio para Gemini Live API
// Captura del micrófono en PCM 16-bit/16kHz y reproducción de audio PCM 16-bit/24kHz

// --- Captura de micrófono → PCM 16kHz ---

export class MicCapture {
  private audioContext: AudioContext | null = null
  private stream: MediaStream | null = null
  private sourceNode: MediaStreamAudioSourceNode | null = null
  private processorNode: ScriptProcessorNode | null = null
  private onChunk: (base64Pcm: string) => void

  constructor(onChunk: (base64Pcm: string) => void) {
    this.onChunk = onChunk
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      }
    })

    // AudioContext a 16kHz nativo si el navegador lo permite
    this.audioContext = new AudioContext({ sampleRate: 16000 })
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream)

    // ScriptProcessorNode (deprecado pero de amplio soporte y simple para PCM streaming)
    const bufferSize = 2048
    this.processorNode = this.audioContext.createScriptProcessor(bufferSize, 1, 1)

    this.processorNode.onaudioprocess = (event) => {
      const inputData = event.inputBuffer.getChannelData(0)
      const pcm16 = floatTo16BitPCM(inputData)
      const base64 = arrayBufferToBase64(pcm16.buffer as ArrayBuffer)
      this.onChunk(base64)
    }

    this.sourceNode.connect(this.processorNode)
    this.processorNode.connect(this.audioContext.destination)
  }

  stop() {
    this.processorNode?.disconnect()
    this.sourceNode?.disconnect()
    this.stream?.getTracks().forEach(track => track.stop())
    this.audioContext?.close()

    this.processorNode = null
    this.sourceNode = null
    this.stream = null
    this.audioContext = null
  }
}

function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length)
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
  return output
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// --- Reproducción de audio de respuesta (PCM 24kHz) ---

export class AudioPlayer {
  private audioContext: AudioContext
  private nextStartTime = 0
  private activeSources: AudioBufferSourceNode[] = []

  constructor() {
    this.audioContext = new AudioContext({ sampleRate: 24000 })
  }

  playChunk(base64Pcm: string) {
    const bytes = base64ToArrayBuffer(base64Pcm)
    const pcm16 = new Int16Array(bytes)
    const float32 = new Float32Array(pcm16.length)
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 0x8000
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000)
    audioBuffer.getChannelData(0).set(float32)

    const source = this.audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(this.audioContext.destination)

    const now = this.audioContext.currentTime
    const startTime = Math.max(now, this.nextStartTime)
    source.start(startTime)
    this.nextStartTime = startTime + audioBuffer.duration

    this.activeSources.push(source)
    source.onended = () => {
      this.activeSources = this.activeSources.filter(s => s !== source)
    }
  }

  // Detiene toda la reproducción en curso (usado en interrupciones)
  clear() {
    this.activeSources.forEach(source => {
      try { source.stop() } catch { /* ya terminado */ }
    })
    this.activeSources = []
    this.nextStartTime = this.audioContext.currentTime
  }

  close() {
    this.clear()
    this.audioContext.close()
  }
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}
