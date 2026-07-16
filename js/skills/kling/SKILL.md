---
name: kling
description: Generate and edit video with Kling through RunAPI. Use when the user asks an agent to create, edit, or transform video with Kling. Default to the RunAPI CLI for one-off generation; use SDKs only when the user is integrating RunAPI into an app or backend.
documentation: https://runapi.ai/models/kling.md
provider_page: https://runapi.ai/providers/kuaishou.md
catalog: https://runapi.ai/models.md
metadata:
  openclaw:
    homepage: https://runapi.ai/models/kling
    requires:
      bins:
      - runapi
    install:
    - kind: brew
      formula: runapi-ai/tap/runapi
      bins:
      - runapi
    envVars:
    - name: RUNAPI_API_KEY
      required: false
      description: Optional RunAPI API key; agents should prefer environment auth or saved CLI config. Browser login is interactive fallback only.
---

# Kling on RunAPI

Generate and edit video with Kling through RunAPI. The default path for one-off agent tasks is the `runapi` CLI; SDKs are for application integration.

## Critical: Integration Runtime

- Integration work (app, backend, worker, library, Rails service, Node service, Go service, webhook pipeline, or production codebase) uses the **SDK integration path** for the target language.
- One-off generation, editing, transformation, manual smoke tests, debugging, or user-requested CLI runs use the **CLI path** with the `runapi` binary. For full CLI-specific agent guidance, see https://github.com/runapi-ai/cli-skill.
- Never shell out to the `runapi` CLI as the production runtime integration layer.

## SDK integration path

When integrating Kling into an app, backend, worker, library, Rails service, Node service, Go service, webhook pipeline, or production workflow, start by checking the current SDK package and official usage. Confirm install commands, client methods (`create`, `get`, `run`), request fields, response shape, and error classes before using CLI help or raw HTTP examples. Use a RunAPI SDK package:

- JavaScript / TypeScript: `@runapi.ai/kling`
- PHP: `runapi-ai/kling`
- Ruby: `runapi-kling`
- Go: `github.com/runapi-ai/kling-sdk/go`

## CLI path

The `runapi` binary is the one-off and manual testing runtime dependency. For full CLI-specific agent guidance, see https://github.com/runapi-ai/cli-skill. Run `runapi auth status` first. For agents and headless runs, prefer `RUNAPI_API_KEY` or import it into saved config with `printf '%s' "$RUNAPI_API_KEY" | runapi auth import-token --token -`. Use `runapi login` only when the user explicitly wants interactive browser auth.

Inspect the available commands and request fields with CLI help:

```shell
runapi kling --help
runapi kling text-to-video --help
```

Run a one-off task (synchronous — polls until the task completes):

```shell
runapi kling text-to-video --input-file request.json
```

Submit asynchronously and poll separately:

```shell
runapi kling text-to-video --async --input-file request.json
runapi wait <task-id> --service kling --action text-to-video
```

Available commands: `text-to-video`, `avatar`, `image-to-video`, `motion-control`.

For Kling 3.0 text-to-video requests, keep `model: "kling-3.0"` and choose `output_resolution: "720p"`, `"1080p"`, or `"4k"` as needed.
For V3 Turbo text-to-video requests, use `model: "kling-v3-turbo-text-to-video"` with `output_resolution: "720p"` or `"1080p"`.
For V3 Turbo image-to-video requests, use `model: "kling-v3-turbo-image-to-video"` and provide `first_frame_image_url`.

## Generated file storage

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## References

- Model overview, pricing, and rate limits: https://runapi.ai/models/kling.md
- Provider comparison: https://runapi.ai/providers/kuaishou.md
- Full model catalog: https://runapi.ai/models.md

## Variants

- [Kling 3.0](https://runapi.ai/models/kling/3.0.md)
- [V3 Turbo text to video](https://runapi.ai/models/kling/v3-turbo-text-to-video.md)
- [V3 Turbo image to video](https://runapi.ai/models/kling/v3-turbo-image-to-video.md)
- [AI avatar pro](https://runapi.ai/models/kling/ai-avatar-pro.md)
- [AI avatar standard](https://runapi.ai/models/kling/ai-avatar-standard.md)
- [AI avatar v1 pro](https://runapi.ai/models/kling/ai-avatar-v1-pro.md)
- [V1 avatar standard](https://runapi.ai/models/kling/v1-avatar-standard.md)
- [V2.1 pro](https://runapi.ai/models/kling/v2.1-pro.md)
- [V2.1 standard](https://runapi.ai/models/kling/v2.1-standard.md)
- [V2.1 master text to video](https://runapi.ai/models/kling/v2.1-master-text-to-video.md)
- [V2.1 master image to video](https://runapi.ai/models/kling/v2.1-master-image-to-video.md)
- [V2.5 turbo text to video pro](https://runapi.ai/models/kling/v2.5-turbo-text-to-video-pro.md)
- [V2.5 turbo image to video pro](https://runapi.ai/models/kling/v2.5-turbo-image-to-video-pro.md)
