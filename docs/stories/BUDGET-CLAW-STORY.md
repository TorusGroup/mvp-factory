# Requirements for Budget-Claw MVP

**Objective:** Create a standalone tool that visualizes token consumption for AI agents.

**Functional Requirements:**
1. A CLI tool that reads a JSON log of token usage.
2. Calculate total cost based on Gemini Flash 2026 pricing ($0.10/1M in, $0.30/1M out).
3. Export a simple HTML report with a bar chart of usage.

**Architecture:**
- Use Node.js + TypeScript.
- Use `chart.js` for the report.

**Squad Instruction:**
@pm *create-story "Implement Budget-Claw MVP Token Tracker"
@architect *create-plan
@dev *execute-subtask
