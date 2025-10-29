import type { VoiceCommand } from '@/types/ai'

import OpenAIRealtimeClient from './openai-client'

export interface VoiceAssistantOptions {
  apiKey: string
}

export class VoiceAssistant {
  private readonly client: OpenAIRealtimeClient

  constructor(options: VoiceAssistantOptions) {
    this.client = new OpenAIRealtimeClient({ apiKey: options.apiKey })
  }

  startListening(onMessage: (command: VoiceCommand) => void) {
    const ws = this.client.connect()
    ws.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'transcript') {
        onMessage({
          sessionId: data.session_id,
          transcript: data.text,
          intent: data.intent ?? 'unknown',
          confidence: data.confidence ?? 0,
          issuedAt: new Date().toISOString(),
          entities: [],
        })
      }
    })
  }

  send(payload: unknown) {
    this.client.send(payload)
  }

  stop() {
    this.client.close()
  }
}

export default VoiceAssistant
