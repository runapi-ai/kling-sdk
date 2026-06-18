<p align="center">
  <a href="https://runapi.ai"><img src="https://runapi.ai/icon.svg" height="56" alt="RunAPI"></a>
</p>

<h3 align="center">
  <a href="https://github.com/runapi-ai/kling-sdk">Kling API SDK for RunAPI</a>
</h3>

<p align="center">
  Kling API SDKs for JavaScript, Ruby, and Go on RunAPI.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@runapi.ai/kling)](https://www.npmjs.com/package/@runapi.ai/kling)
[![RubyGems](https://img.shields.io/gem/v/runapi-kling)](https://rubygems.org/gems/runapi-kling)
[![Go Reference](https://pkg.go.dev/badge/github.com/runapi-ai/kling-sdk/go.svg)](https://pkg.go.dev/github.com/runapi-ai/kling-sdk/go)
[![License](https://img.shields.io/github/license/runapi-ai/kling-sdk)](https://github.com/runapi-ai/kling-sdk/blob/main/LICENSE)

</div>
<br/>

The kling ai api SDK packages JavaScript, Ruby, and Go clients for Kling on RunAPI. Use this kling ai api SDK for text-to-video, image-to-video, animation, avatar, and motion-control workflows that need typed installs, JSON request bodies, task polling, and consistent RunAPI errors across services.

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

The JavaScript client exposes text-to-video, image-to-video, AI avatar, V2.1/V2.5 video, and motion-control resources, and the Ruby and Go packages mirror the same RunAPI task lifecycle.

For Kling 3.0 text-to-video, keep the public model id as `kling-3.0`; set `output_resolution` to `720p`, `1080p`, or `4k` when you need to choose the output resolution.

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
- [AI avatar v1 pro](https://runapi.ai/models/kling/ai-avatar-v1-pro)
- [V1 avatar standard](https://runapi.ai/models/kling/v1-avatar-standard)
- [V2.1 pro](https://runapi.ai/models/kling/v2.1-pro)
- [V2.1 standard](https://runapi.ai/models/kling/v2.1-standard)
- [V2.1 master text to video](https://runapi.ai/models/kling/v2.1-master-text-to-video)
- [V2.1 master image to video](https://runapi.ai/models/kling/v2.1-master-image-to-video)
- [V2.5 turbo text to video pro](https://runapi.ai/models/kling/v2.5-turbo-text-to-video-pro)
- [V2.5 turbo image to video pro](https://runapi.ai/models/kling/v2.5-turbo-image-to-video-pro)

Default pricing link for the kling ai api SDK: https://runapi.ai/models/kling/3.0

## Generated file storage

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## FAQ

### Which package should I install for kling ai api work?

Install the model package for your language: `@runapi.ai/kling`, `runapi-kling`, or `github.com/runapi-ai/kling-sdk/go`. Install core SDK packages only when you are building shared SDK infrastructure.

### Where should public links point?

Primary kling ai api links point to https://runapi.ai/models/kling. Pricing and usage-policy links point to variant pages such as https://runapi.ai/models/kling/3.0. Provider comparisons point to https://runapi.ai/providers/kuaishou, and broad browsing points to https://runapi.ai/models.

## License

Licensed under the Apache License, Version 2.0.
