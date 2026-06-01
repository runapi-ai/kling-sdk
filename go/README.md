# Kling AI API Go SDK for RunAPI

The kling ai api Go SDK is the language-specific package for Kling on RunAPI. Use this kling ai api package for text-to-video, image-to-video, video editing, and animation flows when your application needs JSON request bodies, task status lookup, and consistent RunAPI errors in Go.

This kling ai api README is the Go package guide inside the public `kling-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/kling; for API reference, use https://runapi.ai/docs#kling; for SDK docs, use https://runapi.ai/docs#sdk-kling.

## Install

```bash
go get github.com/runapi-ai/kling-sdk/go@latest
```

## Quick start

```go
import (
  "context"

  "github.com/runapi-ai/kling-sdk/go/kling"
)

client, err := kling.NewClient()
task, err := client.Generations.Create(context.Background(), kling.GenerationParams{
  // Pass the Kling JSON request body from https://runapi.ai/docs#kling.
})
status, err := client.Generations.Get(context.Background(), task.ID)
```

Use `create` when you want to submit a task and return quickly, `get` when you need the latest task state, and `run` when a script should create and poll until completion. In web request handlers, prefer `create` plus webhook or later `get` polling so a worker is not held open.

## Language notes

Use the public Go module with `github.com/runapi-ai/core-sdk/go` options when building video services, CLIs, or workers. The available resources include text-to-video, image-to-video, AI avatars, V2.1/V2.5 video variants, and motion controls. Keep `RUNAPI_API_KEY` in the environment or your secret manager; never commit API keys or callback secrets.

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
