# Kling AI API SDK for RunAPI

The kling ai api SDK packages JavaScript, Ruby, and Go clients for Kling on RunAPI. Use this kling ai api SDK for text-to-video, image-to-video, video-to-video, animation, and editing workflows that need typed installs, JSON request bodies, task polling, and consistent RunAPI errors across services.

Kling belongs to the Kuaishou catalog on RunAPI. The public model page is https://runapi.ai/models/kling; variant pages below carry pricing, rate-limit, and commercial-usage details. The public `kling-sdk` repository groups the JavaScript, Ruby, and Go packages for this model.

## Install

```bash
npm install @runapi.ai/kling
gem install runapi-kling
go get github.com/runapi-ai/kling-sdk/go@latest
```

## What you can build

- Build marketing clips, storyboard previews, creator tools, and agent video pipelines with the kling ai api SDK.
- Keep one model-specific repository while installing only the language package your app needs.
- Use `create` for submit-only jobs, `get` for status lookup, and `run` for submit-and-poll scripts.
- Handle authentication, validation, rate limits, insufficient credits, task failures, and polling timeouts through RunAPI SDK errors.

The JavaScript client exposes generations, ai avatars, v25 turbo generations, motion controls resources, and the Ruby and Go packages mirror the same RunAPI task lifecycle.

## JavaScript quick start

```typescript
import { KlingClient } from '@runapi.ai/kling';

const client = new KlingClient();

const task = await client.generations.create({
  // Pass the Kling request body documented at https://runapi.ai/docs#kling.
});

const status = await client.generations.get(task.id);
```

For short scripts, use `run` with the same JSON body to create the task and wait for completion. For web request handlers, prefer `create` plus webhook or later `get` polling so the server does not hold a worker open.

## Repository layout

- `js/` publishes `@runapi.ai/kling`.
- `ruby/` publishes `runapi-kling` when RubyGems publishing resumes.
- `go/` publishes `github.com/runapi-ai/kling-sdk/go` and depends on `github.com/runapi-ai/core-sdk/go`.

## Public links

- Model page: https://runapi.ai/models/kling
- SDK docs: https://runapi.ai/docs#sdk-kling
- Product docs: https://runapi.ai/docs#kling
- SDK repository: https://github.com/runapi-ai/kling-sdk
- Skill repository: https://github.com/runapi-ai/kling
- Provider comparison: https://runapi.ai/providers/kuaishou
- Full catalog: https://runapi.ai/models

## Pricing and variants

Use the most specific kling ai api variant page for pricing, rate limits, and commercial usage:
- [Kling 3.0](https://runapi.ai/models/kling/3.0)
- [AI avatar pro](https://runapi.ai/models/kling/ai-avatar-pro)
- [AI avatar standard](https://runapi.ai/models/kling/ai-avatar-standard)
- [V2.5 turbo text to video pro](https://runapi.ai/models/kling/v2.5-turbo-text-to-video-pro)
- [V2.5 turbo image to video pro](https://runapi.ai/models/kling/v2.5-turbo-image-to-video-pro)

Default pricing link for the kling ai api SDK: https://runapi.ai/models/kling/3.0

## FAQ

### Which package should I install for kling ai api work?

Install the model package for your language: `@runapi.ai/kling`, `runapi-kling`, or `github.com/runapi-ai/kling-sdk/go`. Install core SDK packages only when you are building shared SDK infrastructure.

### Where should public links point?

Primary kling ai api links point to https://runapi.ai/models/kling. Pricing and usage-policy links point to variant pages such as https://runapi.ai/models/kling/3.0. Provider comparisons point to https://runapi.ai/providers/kuaishou, and broad browsing points to https://runapi.ai/models.

## License

Licensed under the Apache License, Version 2.0.
