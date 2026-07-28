<p align="center">
  <a href="https://runapi.ai"><img src="https://runapi.ai/icon.svg" height="56" alt="RunAPI"></a>
</p>

<h3 align="center">
  <a href="https://github.com/runapi-ai/kling-sdk">Kling API SDK for RunAPI</a>
</h3>

<p align="center">
  Kling API SDKs for JavaScript, Python, Ruby, Go, Java, and PHP on RunAPI.
</p>

<div align="center">

[![npm](https://img.shields.io/npm/v/@runapi.ai/kling)](https://www.npmjs.com/package/@runapi.ai/kling)
[![PyPI](https://img.shields.io/pypi/v/runapi-kling)](https://pypi.org/project/runapi-kling/)
[![RubyGems](https://img.shields.io/gem/v/runapi-kling)](https://rubygems.org/gems/runapi-kling)
[![Go Reference](https://pkg.go.dev/badge/github.com/runapi-ai/kling-sdk/go.svg)](https://pkg.go.dev/github.com/runapi-ai/kling-sdk/go)
[![Maven Central](https://img.shields.io/maven-central/v/ai.runapi/runapi-kling)](https://central.sonatype.com/artifact/ai.runapi/runapi-kling)
[![License](https://img.shields.io/github/license/runapi-ai/kling-sdk)](https://github.com/runapi-ai/kling-sdk/blob/main/LICENSE)

</div>
<br/>

The Kling API SDK packages JavaScript, Python, Ruby, Go, Java, and PHP clients for Kling on RunAPI. Use it for text-to-video, image-to-video, avatar, motion-control, and V2.5 Turbo continuation workflows when your app needs typed request builders, predictable task polling, file upload helpers, account helpers, and consistent RunAPI errors.

Kling is listed in the RunAPI model catalog at https://runapi.ai/models/kling. Variant pages below carry pricing, rate-limit, and commercial-usage details. The public `kling-sdk` repository groups the non-PHP language packages, examples, CI, and release tags for this model. The PHP package is released from a split Composer repository.

## Install

```bash
npm install @runapi.ai/kling
pip install runapi-kling
gem install runapi-kling
go get github.com/runapi-ai/kling-sdk/go@latest
```

Gradle:

```kotlin
dependencies {
  implementation("ai.runapi:runapi-kling:0.1.6")
}
```

Maven:

```xml
<dependency>
  <groupId>ai.runapi</groupId>
  <artifactId>runapi-kling</artifactId>
  <version>0.1.6</version>
</dependency>
```

Use the Java BOM when installing multiple RunAPI Java modules:

```kotlin
dependencies {
  implementation(platform("ai.runapi:runapi-bom:0.2.7"))
  implementation("ai.runapi:runapi-kling")
}
```

The PHP package is published from the split Composer repository as `runapi-ai/kling`; see https://github.com/runapi-ai/kling-php for PHP install and examples.

## What you can build

- Build apps, agent workflows, batch jobs, and production services around Kling requests.
- Install only the language package your app needs while keeping one model-specific repository for docs and releases.
- Use `create` for submit-only jobs, `get` for status lookup, and `run` for submit-and-poll scripts.
- Upload local files, URL files, or base64 files through shared RunAPI file helpers.
- Handle validation, authentication, rate limits, insufficient credits, task failures, and polling timeouts through RunAPI SDK errors.

## Java quick start

```java
import ai.runapi.kling.KlingClient;
import ai.runapi.kling.types.TextToVideoParams;
import ai.runapi.kling.types.CompletedTextToVideoResponse;
import ai.runapi.kling.types.TextToVideoModel;

KlingClient client = KlingClient.builder()
    .apiKey(System.getenv("RUNAPI_API_KEY"))
    .build();

CompletedTextToVideoResponse result = client.textToVideo().run(
    TextToVideoParams.builder()
        .model(TextToVideoModel.KLING_3_0)
        .prompt("A crane shot over a snowy mountain village")
        .aspectRatio("16:9")
        .outputResolution("720p")
        .durationSeconds(3)
        .build()
);
```

Java packages target Java 8 bytecode and are tested on Java 8, 11, 17, and 21. Each model artifact depends on `ai.runapi:runapi-core`, so application code normally installs only `ai.runapi:runapi-kling`.

## Kling 2.6

Use `kling-v2.6` for text-to-video, image-to-video, or motion-control requests. Sound requires `mode: "pro"`; an image-to-video final frame additionally requires a five-second request. Motion control requires `source_image_url`, `output_resolution`, and `character_orientation`; its `reference_video_url` may be 3-10 seconds for image orientation or 3-30 seconds for video orientation, and it does not accept `background_source`.

```typescript
const result = await client.imageToVideo.run({
  model: 'kling-v2.6',
  prompt: 'Camera follows the cyclist through fog as the city lights appear',
  first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
  mode: 'pro',
  duration_seconds: 5,
  enable_sound: true,
  last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
});
```

## Kling O1 reference media

Use `kling-o1` with ordered public HTTP(S) JPG, JPEG, or PNG reference images and an optional public HTTP(S) MP4 or MOV reference video. Mention every reference in `prompt` as `<<<image_1>>>`, `<<<image_2>>>`, and `<<<video_1>>>`. When a video is present, up to four reference images are allowed. Do not combine `last_frame_image_url` with reference images or a reference video. A `feature` reference video may be used with the required first frame; a `base` reference video cannot be combined with frame inputs. O1 requests are five seconds, use `std` or `pro`, and keep sound disabled.

```typescript
const result = await client.textToVideo.run({
  model: 'kling-o1',
  prompt: 'Keep <<<image_1>>> beside the performer from <<<video_1>>>',
  reference_image_urls: ['https://cdn.runapi.ai/public/samples/portrait.jpg'],
  reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
  reference_video_type: 'feature',
  preserve_reference_video_audio: true,
  mode: 'pro',
  duration_seconds: 5,
});
```

## Kling V3 Omni

Use `kling-v3-omni` for text-to-video or image-to-video requests with `720p`, `1080p`, or `4k` output resolution and optional synchronized sound. Image-to-video requires a first frame; a final frame can be used only with a five-second request.

```typescript
const result = await client.imageToVideo.run({
  model: 'kling-v3-omni',
  prompt: 'Camera follows the cyclist through fog as the city lights appear',
  first_frame_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
  last_frame_image_url: 'https://cdn.runapi.ai/public/samples/image.jpg',
  output_resolution: '1080p',
  duration_seconds: 5,
  enable_sound: true,
});
```

## Task lifecycle

Most media endpoints are asynchronous. `create()` submits a task and returns its id, `get(id)` fetches the latest task state, and `run(params)` creates the task and polls until it reaches a terminal state. In web request handlers, prefer `create()` plus webhook or later `get()` polling so the server does not hold a worker open.

## Repository layout

- `js/` publishes `@runapi.ai/kling`.
- `python/` publishes `runapi-kling`.
- `ruby/` publishes `runapi-kling`.
- `go/` publishes `github.com/runapi-ai/kling-sdk/go`.
- `java/` publishes `ai.runapi:runapi-kling` and uses `ai.runapi:runapi-core`.

## Public links

- Model page: https://runapi.ai/models/kling
- SDK docs: https://runapi.ai/docs#sdk-kling
- Product docs: https://runapi.ai/docs#kling
- SDK repository: https://github.com/runapi-ai/kling-sdk
- PHP package repository: https://github.com/runapi-ai/kling-php
- Skill repository: https://github.com/runapi-ai/kling
- Provider comparison: https://runapi.ai/providers/kuaishou
- Full catalog: https://runapi.ai/models

## Pricing and variants

Use the most specific Kling variant page for pricing, rate limits, and commercial usage:
- [Kling 3.0](https://runapi.ai/models/kling/3.0)
- [Kling O1](https://runapi.ai/models/kling/o1)
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

Default pricing link for the Kling SDK: https://runapi.ai/models/kling/3.0

## File storage

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## FAQ

### Which package should I install for Kling work?

Install the model package for your language: `@runapi.ai/kling` on npm, `runapi-kling` on PyPI, `runapi-kling` on RubyGems, `github.com/runapi-ai/kling-sdk/go`, `ai.runapi:runapi-kling` on Maven Central, or `runapi-ai/kling` on Packagist. Install core SDK packages only when you are building shared SDK infrastructure.

### Where should public links point?

Primary Kling links point to https://runapi.ai/models/kling. Pricing and usage-policy links point to variant pages such as https://runapi.ai/models/kling/3.0. Provider comparisons point to https://runapi.ai/providers/kuaishou, and broad browsing points to https://runapi.ai/models.

## License

Licensed under the Apache License, Version 2.0.
