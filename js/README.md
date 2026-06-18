# Kling AI API JavaScript SDK for RunAPI

The kling ai api JavaScript SDK is the language-specific package for Kling on RunAPI. Use this kling ai api package for text-to-video, image-to-video, video editing, and animation flows when your application needs JSON request bodies, task status lookup, and consistent RunAPI errors in JavaScript.

This kling ai api README is the JavaScript package guide inside the public `kling-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/kling; for API reference, use https://runapi.ai/docs#kling; for SDK docs, use https://runapi.ai/docs#sdk-kling.

## Install

```bash
npm install @runapi.ai/kling
```

## Quick start

```typescript
import { KlingClient } from '@runapi.ai/kling';

const client = new KlingClient();
const task = await client.generations.create({
  // Pass the Kling JSON request body from https://runapi.ai/docs#kling.
});
const status = await client.generations.get(task.id);
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Language notes

Use the TypeScript types in `src/types.ts` and the resource classes under `src/resources` when building video applications. The available resources include text-to-video, image-to-video, AI avatars, V2.1/V2.5 video variants, and motion controls. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

## Links

- Model page: https://runapi.ai/models/kling
- SDK docs: https://runapi.ai/docs#sdk-kling
- Product docs: https://runapi.ai/docs#kling
- Pricing and rate limits: https://runapi.ai/models/kling/3.0
- Provider comparison: https://runapi.ai/providers/kuaishou
- Full catalog: https://runapi.ai/models
- Repository: https://github.com/runapi-ai/kling-sdk

## License

Licensed under the Apache License, Version 2.0.
