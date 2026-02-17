# User Story: AIOS Console Bridge (Fase 1)

**Objective:** Create a lightweight web interface to mirror the AIOS terminal and allow direct command interaction.

**Requirements:**
1. **Real-time Log Stream:** Display raw output from the AIOS agent interactions.
2. **Command Input:** A simple text field to send commands (e.g., `*help`, `@dev *status`) to the orchestrator.
3. **Agent Identification:** Highlight which agent is speaking in the logs using color-coded tags.
4. **Minimalist UI:** Single-page Next.js app, "Terminal Dark" theme.

**Execution Plan:**
1. **@pm**: Formally accept the story and generate `docs/stories/STORY-001-console-bridge.md`.
2. **@architect**: Define the SSE (Server-Sent Events) or WebSocket bridge between the VPS terminal and the Web UI.
3. **@dev**: Implement the Next.js frontend and the backend relay script.
4. **@qa**: Verify that commands sent from the UI are correctly executed by the orchestrator.

**Handoff to @aios-master:** Start the `spec-pipeline` for this story immediately.
