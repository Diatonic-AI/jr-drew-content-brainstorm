# AI Integration

- **Realtime Client:** `src/lib/ai/openai-client.ts` opens a WebSocket connection to the OpenAI Realtime API using the provided API key and model.
- **Voice Assistant:** `src/lib/ai/voice-assistant.ts` wraps the realtime client, listens for transcript messages, and normalizes them into `VoiceCommand` entries.
- **Productivity Coach:** `src/lib/ai/productivity-coach.ts` generates contextual `AIInsight` suggestions based on focus sessions and activity ratios.
- **State:** `aiStore` tracks assistant session lifecycle, insight queue, voice listening state, realtime stream status, and chat history.
- **Hooks:** `useVoiceAI` exposes helpers to toggle listening, submit commands, append messages, and manage insights/suggestions.
- **UI:** Productivity coach modal, insight cards, and auto-tag suggestion components surface AI feedback in the dashboard.
