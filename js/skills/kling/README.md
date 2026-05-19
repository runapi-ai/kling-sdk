# Kling AI API Skill for RunAPI

Generate video, AI avatars, and motion-controlled clips with the Kling SDK. This skill helps Claude Code, Codex, Gemini CLI, Cursor, and 50+ agents integrate Kling through RunAPI.

The canonical agent file is `skills/kling/SKILL.md`.

## Install

```bash
npx skills add runapi-ai/kling -g
```

Or manually: clone this repo and copy `skills/kling/` into your agent's skills directory.

## Quick example

```typescript
import { KlingClient } from '@runapi.ai/kling';

const client = new KlingClient();
const result = await client.textToVideo.run({
  model: 'kling-3.0',
  prompt: 'A cat walking through a sunlit garden',
});
const url = result.videos[0].url;
```

## Routing

- Model page: https://runapi.ai/models/kling
- Product docs: https://runapi.ai/docs#kling
- SDK docs: https://runapi.ai/docs#sdk-kling
- SDK repository: https://github.com/runapi-ai/kling-sdk
- Pricing and rate limits: https://runapi.ai/models/kling/3.0
- Provider comparison: https://runapi.ai/providers/kuaishou
- Browse all RunAPI models and skills: https://runapi.ai/models

## Variants

- [Kling 3.0](https://runapi.ai/models/kling/3.0)
- [AI avatar pro](https://runapi.ai/models/kling/ai-avatar-pro)
- [AI avatar standard](https://runapi.ai/models/kling/ai-avatar-standard)
- [V2.5 turbo text to video pro](https://runapi.ai/models/kling/v2.5-turbo-text-to-video-pro)
- [V2.5 turbo image to video pro](https://runapi.ai/models/kling/v2.5-turbo-image-to-video-pro)

## Agent rules

- Keep API keys in `RUNAPI_API_KEY` or RunAPI CLI config; never commit secrets.
- Prefer `create`, `get`, and `run` JSON passthrough patterns instead of inventing flags for every model parameter.
- For kling ai api pricing, rate-limit, and commercial-usage answers, link to the variant page rather than the repository README.

## License

Licensed under the Apache License, Version 2.0.
