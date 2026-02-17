# User Story: AIOS GPT-Style Brainstorming Interface (v2.0)

**Objective:** Upgrade the current terminal bridge to a modern Chat interface that facilitates project ideation and automatic task sharding.

**Requirements:**
1. **Chat UI:** A clean, modern interface inspired by ChatGPT (React/Tailwind).
2. **Brainstorming Mode:** An active listener mode for `@analyst` and `@pm` to discuss ideas.
3. **Task Sharder:** A button or command that takes the final idea and automatically executes `@pm *shard-prd` to create actionable stories.
4. **Agent Tabs:** Sidebar to switch between raw logs (terminal) and the Brainstorming Chat.

**Execution Strategy:**
- The Squad will develop this in a new branch `feature/v2-chat-ui`.
- Use `shadcn/ui` for the components.
- Auto-deploy back to the current Railway URL.

**Handoff to @aios-master:**
1. Execute `*spec-pipeline` for the "Brainstorming GPT Interface".
2. Assign `@ux-design-expert` to create the layout structure.
3. Assign `@dev` to implement the React components and integration with `server.js`.
