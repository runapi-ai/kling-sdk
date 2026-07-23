<p align="center">
  <a href="https://github.com/runapi-ai/kling">
    <h3 align="center">Kling AI API Skill for RunAPI</h3>
  </a>
</p>

<p align="center">
  Install this agent skill, inspect Kling fields, then run jobs through the RunAPI CLI.
</p>

<p align="center">
  <a href="https://runapi.ai/models/kling"><strong>Model Reference</strong></a> · <a href="https://github.com/runapi-ai/cli"><strong>CLI</strong></a> · <a href="https://github.com/runapi-ai/kling-sdk"><strong>SDK</strong></a>
</p>

<div align="center">

[![skills.sh](https://www.skills.sh/b/runapi-ai/kling)](https://www.skills.sh/runapi-ai/kling/kling)
[![ClawHub](https://img.shields.io/badge/ClawHub-runapi--kling-111827)](https://clawhub.ai/runapi-ai/runapi-kling)
[![License](https://img.shields.io/github/license/runapi-ai/kling)](https://github.com/runapi-ai/kling/blob/main/LICENSE)

</div>
<br/>

Generate video, AI avatars, and motion-controlled clips with the Kling SDK. This skill helps Claude Code, Codex, Gemini CLI, Cursor, and 50+ agents integrate Kling through RunAPI.

The canonical agent file is `skills/kling/SKILL.md`.

## Install

```bash
npx skills add runapi-ai/kling -g
```

Or paste this prompt to your AI agent:

```text
Install the kling skill for me:

1. Clone https://github.com/runapi-ai/kling
2. Copy the skills/kling/ directory into your
   user-level skills directory (e.g. ~/.claude/skills/
   for Claude Code, ~/.codex/skills/ for Codex).
3. Verify that SKILL.md is present.
4. Confirm the install path when done.
```

## Quick example

```typescript
import { KlingClient } from '@runapi.ai/kling';

const client = new KlingClient();
const result = await client.textToVideo.run({
  model: 'kling-3.0',
  prompt: 'A cat walking through a sunlit garden',
  output_resolution: '4k',
});
const url = result.videos[0].url;
```

Kling 2.6 uses `model: 'kling-v2.6'` for both text-to-video and image-to-video. Set `mode: 'pro'` before enabling sound; final-frame image-to-video requests also use `duration_seconds: 5`.
Kling V3 Omni uses `model: 'kling-v3-omni'` for both text-to-video and image-to-video. Image-to-video requires `first_frame_image_url`; final-frame requests also use `duration_seconds: 5`.

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
- [Kling 2.6](https://runapi.ai/models/kling/v2.6)
- [Kling V3 Omni](https://runapi.ai/models/kling/v3-omni)
- [V3 Turbo text to video](https://runapi.ai/models/kling/v3-turbo-text-to-video)
- [V3 Turbo image to video](https://runapi.ai/models/kling/v3-turbo-image-to-video)
- [AI avatar pro](https://runapi.ai/models/kling/ai-avatar-pro)
- [AI avatar standard](https://runapi.ai/models/kling/ai-avatar-standard)
- [AI avatar v1 pro](https://runapi.ai/models/kling/ai-avatar-v1-pro)
- [V1 avatar standard](https://runapi.ai/models/kling/v1-avatar-standard)
- [V2.1 pro](https://runapi.ai/models/kling/v2.1-pro)
- [V2.1 standard](https://runapi.ai/models/kling/v2.1-standard)
- [V2.1 master text to video](https://runapi.ai/models/kling/v2.1-master-text-to-video)
- [V2.1 master image to video](https://runapi.ai/models/kling/v2.1-master-image-to-video)
- [V2.5 turbo text to video pro](https://runapi.ai/models/kling/v2.5-turbo-text-to-video-pro)
- [V2.5 turbo image to video pro](https://runapi.ai/models/kling/v2.5-turbo-image-to-video-pro)

## Agent rules

- Integration work uses the target language SDK; one-off generation, manual smoke tests, debugging, or user-requested CLI runs use the RunAPI CLI skill: https://github.com/runapi-ai/cli-skill
- RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.
- Keep API keys in `RUNAPI_API_KEY` or RunAPI CLI config; never commit secrets.
- Prefer `create`, `get`, and `run` JSON passthrough patterns instead of inventing flags for every model parameter.
- For pricing, rate-limit, and commercial-usage answers, link to the variant page rather than the repository README.

## License

Licensed under the Apache License, Version 2.0.
