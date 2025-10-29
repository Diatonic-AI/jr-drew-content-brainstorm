export interface OpenAIRealtimeOptions {
  apiKey: string
  model?: string
  endpoint?: string
}

export class OpenAIRealtimeClient {
  private websocket?: WebSocket
  private readonly options: OpenAIRealtimeOptions

  constructor(options: OpenAIRealtimeOptions) {
    this.options = { model: 'gpt-4o-realtime-preview', endpoint: 'wss://api.openai.com/v1/realtime', ...options }
  }

  connect() {
    const url = `${this.options.endpoint}?model=${this.options.model}`
    this.websocket = new WebSocket(url, ['realtime', `openai-insecure-api-key.${this.options.apiKey}`])
    return this.websocket
  }

  send(payload: unknown) {
    this.websocket?.send(JSON.stringify(payload))
  }

  close() {
    this.websocket?.close()
  }
}

export default OpenAIRealtimeClient
