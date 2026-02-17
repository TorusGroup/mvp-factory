# PRD - Agent @budget-monitor

**Status:** DRAFT (by Squad Alpha PM)
**Epic:** Token Control & ROI

## 1. Context & Goal
Create a specialized agent for the Synkra AIOS framework that monitors, calculates, and optimizes token consumption across all active squads.

## 2. Core Capabilities
- **Real-time Monitoring:** Intercept agent calls to track input/output tokens.
- **Cost Calculation:** Apply pricing logic for Gemini, OpenAI, and Anthropic.
- **Budget Alerts:** Trigger warnings when a session or project exceeds a defined USD threshold.
- **Optimization Suggestions:** Suggest `Context Caching` or `Summarization` when context grows beyond 100k tokens.

## 3. Technical Requirements
- Integration with `.aios-core/development/scripts/usage-tracker.js`.
- Configuration via `core-config.yaml` (budget limits).
- Reporting in Markdown format for the main session.

## 4. Acceptance Criteria
- [ ] Agent responds to `@budget-monitor *status`.
- [ ] Correctly calculates cost for Gemini 1.5 Flash.
- [ ] Detects when caching is eligible.
