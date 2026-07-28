# Kling API Ruby SDK for RunAPI

The Kling Ruby SDK is the language-specific package for Kling on RunAPI. Use this package for video generation, animation, and video editing workflows when your application needs request bodies, task status lookup, and consistent RunAPI errors in Ruby.

This README is the Ruby package guide inside the public `kling-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/kling; for API reference, use https://runapi.ai/docs#kling; for SDK docs, use https://runapi.ai/docs#sdk-kling.

## Install

```bash
gem install runapi-kling
```

## Quick start

```ruby
require "runapi/kling"

client = RunApi::Kling::Client.new
task = client.text_to_video.create(
  # Pass the Kling JSON request body from https://runapi.ai/docs#kling.
)
status = client.text_to_video.get(task.id)
```

## Kling O1 reference media

```ruby
result = client.text_to_video.run(
  model: "kling-o1",
  prompt: "Keep <<<image_1>>> beside the performer from <<<video_1>>>",
  reference_image_urls: ["https://cdn.runapi.ai/public/samples/portrait.jpg"],
  reference_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
  reference_video_type: "feature",
  preserve_reference_video_audio: true,
  mode: "pro",
  duration_seconds: 5
)
```

Number reference images in prompt order as `<<<image_1>>>`, `<<<image_2>>>`, and so on; the optional video is `<<<video_1>>>`. With a video, send at most four images. Do not combine `last_frame_image_url` with reference images or a reference video. A `feature` reference video may be used with the required first frame; `base` cannot be combined with frame inputs. O1 requests are five seconds and keep sound disabled. Pricing and limits: https://runapi.ai/models/kling/o1.

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Language notes

Use Ruby keyword arguments and the `RunApi::Kling` error classes when building video jobs, Rails workers, or scripts. The available resources are `text_to_video`, `ai_avatar`, `image_to_video`, and `motion_control`. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

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
