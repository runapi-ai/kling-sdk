---
name: kling
description: Generate video (Kling 3.0 single/multi-shot, v2.5 Turbo text/image-to-video, AI avatars, motion-controlled video) through RunAPI.ai using the @runapi.ai/kling Node/TypeScript SDK. Use when the user asks to add Kling video generation, AI avatar talking heads, or motion-transfer video, or writes against @runapi.ai/kling. Triggers on "kling", "AI avatar", "motion control video", "可灵", "数字人", "@runapi.ai/kling".
documentation: https://runapi.ai/models/kling
provider_page: https://runapi.ai/providers/kuaishou
catalog: https://runapi.ai/models
---
# @runapi.ai/kling — RunAPI.ai Kling video generation

Build Node / TypeScript integrations that generate Kling video, talking-head avatars, and motion-transfer clips through RunAPI.ai.

## Setup

Requires **Node 18+** (global `fetch`).

```bash
npm install @runapi.ai/kling
```

Set your API key in the environment:

```dotenv
# .env
RUNAPI_API_KEY=runapi_xxx   # get one at https://runapi.ai/settings/api_keys
```

```ts
import { KlingClient } from '@runapi.ai/kling';

// The SDK reads RUNAPI_API_KEY from the environment automatically.
const client = new KlingClient();
```

Pass `{ apiKey }` explicitly if you manage secrets differently. `baseUrl` defaults to `https://runapi.ai`; override only for local development.

## Core recipe — text to video

```ts
const result = await client.textToVideo.run({
  model: 'kling-3.0',
  prompt: 'A cat walking through a sunlit garden',
  aspect_ratio: '16:9',
  duration: '5',
  mode: 'pro',
});

const url = result.videos[0].url;
```

`run()` creates the task, auto-polls, and resolves only when the task completes — `videos[0].url` is guaranteed on the resolved value. On failure it throws `TaskFailedError`; on polling timeout it throws `TaskTimeoutError`. Use `run()` for scripts and short-lived processes. For request handlers, split it:

```ts
const { id } = await client.textToVideo.create({ model: 'kling-3.0', prompt: '...' });
// return 202 immediately; fetch later:
const status = await client.textToVideo.get(id);
if (status.status === 'completed') { /* ... */ }
```

Do not hold a web worker open waiting on `run()`. Split + webhook is the production pattern.

`run()` polls every 2 s for up to 15 min by default. Tune when needed:

```ts
await client.textToVideo.run(params, { maxWaitMs: 30 * 60_000, pollIntervalMs: 5_000 });
```

If `TaskTimeoutError` fires, the task is still running server-side — resume with `textToVideo.get(id)` or finish via webhook.

## Image to video and multi-shot

Attach `image_urls` to animate a still frame. For multi-scene output, use `multi_shots: true` with per-shot prompts:

```ts
// Image to video
await client.textToVideo.run({
  model: 'kling-3.0',
  prompt: 'The dog starts running',
  image_urls: ['https://cdn.example.com/dog.jpg'],
  aspect_ratio: '16:9',
  sound: true,
});

// Multi-shot (audio is always on for multi-shot)
await client.textToVideo.run({
  model: 'kling-3.0',
  multi_shots: true,
  sound: true,
  aspect_ratio: '16:9',
  multi_prompt: [
    { prompt: 'Wide shot of a waterfall', duration: 4 },
    { prompt: 'Camera pans to a rainbow above', duration: 6 },
  ],
});
```

## v2.5 Turbo

Use the canonical text-to-video and image-to-video resources for the faster v2.5 Turbo variants:

```ts
// Text-to-video
await client.textToVideo.run({
  model: 'kling-v2.5-turbo-text-to-video-pro',
  prompt: 'A neon-lit alley at night, rain falling',
  aspect_ratio: '9:16',
  duration: '5',
});

// Image-to-video
await client.imageToVideo.run({
  model: 'kling-v2.5-turbo-image-to-video-pro',
  image_url: 'https://cdn.example.com/frame.jpg',
  prompt: 'The character walks forward slowly',
  duration: '10',
});
```

## AI avatars — talking-head video

Drive a portrait with an audio track:

```ts
const avatar = await client.aiAvatar.run({
  model: 'kling-ai-avatar-pro',
  image_url: 'https://cdn.example.com/headshot.jpg',
  audio_url: 'https://cdn.example.com/voiceover.mp3',
  prompt: 'Warm lighting, relaxed posture',
});

console.log(avatar.videos[0].url);
```

## Motion controls — transfer motion onto an image subject

Pass one or more driving videos plus one or more input images:

```ts
await client.motionControl.run({
  model: 'kling-3.0',
  input_urls: ['https://cdn.example.com/person.jpg'],
  video_urls: ['https://cdn.example.com/dance.mp4'],
  prompt: 'Match the dance motion exactly',
  mode: '1080p',
  character_orientation: 'image',
  background_source: 'input_image',
});
```

## Models

| Resource | `model` values |
|---|---|
| `textToVideo` | `kling-3.0`, `kling-v2.5-turbo-text-to-video-pro` |
| `imageToVideo` | `kling-v2.5-turbo-image-to-video-pro` |
| `aiAvatar` | `kling-ai-avatar-pro`, `kling-ai-avatar-standard` |
| `motionControl` | `kling-3.0` |

Exact credit costs per model are shown at https://runapi.ai/pricing and in the dashboard — do not hardcode prices in application code.

## Callbacks (webhooks)

Pass `callback_url` on `create()` (or any `run()` call) and RunAPI will POST the final payload to you:

```ts
await client.textToVideo.create({
  model: 'kling-3.0',
  prompt: '...',
  callback_url: 'https://your.app/webhooks/runapi/kling',
});
```

Payload shape:

```ts
{ id: string; status: 'completed' | 'failed'; videos?: { url: string }[]; error?: string }
```

**Always verify the signature before trusting the body.** RunAPI signs every callback with your account's Callback Secret (rotate at `/accounts/callback_secret`). Headers:

- `X-Callback-Id` — UUID, store to make handler idempotent
- `X-Callback-Timestamp` — unix seconds, reject if `|now - ts| > 300`
- `X-Callback-Signature` — base64 HMAC-SHA256 over `` `${id}.${ts}.${rawBody}` `` using the base64-decoded secret

```ts
import crypto from 'node:crypto';

function verify(raw: string, id: string, ts: string, sig: string, secret: string) {
  const key = Buffer.from(secret, 'base64');
  const mac = crypto.createHmac('sha256', key)
    .update(`${id}.${ts}.${raw}`)
    .digest('base64');
  return crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(sig));
}
```

Reply `2xx` within 10s; any non-2xx triggers retries.

## Errors

All errors are re-exported from `@runapi.ai/core`. Always `instanceof` — never string-match messages.

| Error | Status | Action |
|---|---|---|
| `AuthenticationError` | 401 | abort; surface "reconnect your API key" |
| `InsufficientCreditsError` | 402 | prompt user to top up at runapi.ai/billing |
| `ValidationError` | 400 / 422 | fix params; do not retry |
| `RateLimitError` | 429 | sleep `err.retryAfterMs`, then retry |
| `ServiceUnavailableError` | 503 / 455 | retry with backoff; transient service issue |
| `TaskFailedError` | — | show `err.details` to user; do not auto-retry |
| `TaskTimeoutError` | — | re-poll with `<resource>.get(id)` |

```ts
import { InsufficientCreditsError, TaskFailedError } from '@runapi.ai/kling';

try {
  await client.textToVideo.run({ model: 'kling-3.0', prompt: '...' });
} catch (err) {
  if (err instanceof InsufficientCreditsError) { /* surface top-up CTA */ }
  else if (err instanceof TaskFailedError)       { /* show err.details */ }
  else throw err;
}
```

## Gotchas

- `model` is required on every call across every resource.
- Multi-shot mode requires `multi_shots: true` **and** `sound: true` — audio cannot be disabled.
- `image_urls` accepts at most 1 image in multi-shot mode.
- Motion controls expect both `input_urls` (images) and `video_urls` (driving motion); each is an array.
- `duration` is a string (`'3'` to `'15'`), not a number — matching the wire format.
- `callback_url` must be reachable from the public internet. `localhost` / `127.0.0.1` URLs will never fire — use a tunnel (cloudflared, ngrok, tailscale funnel) when developing locally.

## Dig deeper

Package README (full API surface, all params): `node_modules/@runapi.ai/kling/README.md`. Types: `@runapi.ai/kling/dist/types.d.ts`. Product docs: https://runapi.ai/docs.

## RunAPI public routing

kling ai api public links use the API-379 catalog route map. The main kling ai api page is https://runapi.ai/models/kling. SDK docs live at https://runapi.ai/docs#sdk-kling and product docs live at https://runapi.ai/docs#kling.

Pricing, rate limits, and commercial usage for kling ai api should point to the most specific variant page:
- [Kling 3.0](https://runapi.ai/models/kling/3.0)
- [AI avatar pro](https://runapi.ai/models/kling/ai-avatar-pro)
- [AI avatar standard](https://runapi.ai/models/kling/ai-avatar-standard)
- [V2.5 turbo text to video pro](https://runapi.ai/models/kling/v2.5-turbo-text-to-video-pro)
- [V2.5 turbo image to video pro](https://runapi.ai/models/kling/v2.5-turbo-image-to-video-pro)

Compare Kling with other Kuaishou models at https://runapi.ai/providers/kuaishou. Browse every RunAPI model and skill at https://runapi.ai/models. SDK repository: https://github.com/runapi-ai/kling-sdk. Skill repository: https://github.com/runapi-ai/kling.
