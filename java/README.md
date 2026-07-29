# Kling Java SDK for RunAPI

[![Maven Central](https://img.shields.io/maven-central/v/ai.runapi/runapi-kling)](https://central.sonatype.com/artifact/ai.runapi/runapi-kling)

The Kling Java SDK is the language-specific package for Kling on RunAPI. Use it when your Java application needs typed builders, strict request validation, task status lookup, local polling helpers, file uploads, account helpers, and consistent RunAPI errors for Kling workflows.

This README is the Java package guide inside the public `kling-sdk` repository. For the repository overview, start at `../README.md`; for model details, use https://runapi.ai/models/kling; for API reference, use https://runapi.ai/docs/api/kling/text-to-video; for SDK docs, use https://runapi.ai/docs/resources/sdks.

## Requirements

The Java SDK targets Java 8 bytecode and is tested on Java 8, 11, 17, and 21.

## Install

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

Use the BOM when multiple RunAPI Java modules are installed:

```kotlin
dependencies {
  implementation(platform("ai.runapi:runapi-bom:0.2.9"))
  implementation("ai.runapi:runapi-kling")
}
```

Maven BOM:

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>ai.runapi</groupId>
      <artifactId>runapi-bom</artifactId>
      <version>0.2.9</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
```

## Quick Start

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

## Kling O1 reference media

```java
import java.util.Arrays;

CompletedTextToVideoResponse result = client.textToVideo().run(
    TextToVideoParams.builder()
        .model(TextToVideoModel.KLING_O1)
        .prompt("Keep <<<image_1>>> beside the performer from <<<video_1>>>")
        .referenceImageUrls(Arrays.asList("https://cdn.runapi.ai/public/samples/portrait.jpg"))
        .referenceVideoUrl("https://cdn.runapi.ai/public/samples/video.mp4")
        .referenceVideoType("feature")
        .preserveReferenceVideoAudio(true)
        .mode("pro")
        .durationSeconds(5)
        .build()
);
```

Number reference images in prompt order as `<<<image_1>>>`, `<<<image_2>>>`, and so on; the optional video is `<<<video_1>>>`. With a video, send at most four images. Do not combine `last_frame_image_url` with reference images or a reference video. A `feature` reference video may be used with the required first frame; `base` cannot be combined with frame inputs. O1 requests are five seconds and keep sound disabled. Pricing and limits: https://runapi.ai/models/kling/o1.

The client builder reads `RUNAPI_API_KEY` when `.apiKey(...)` is omitted. Set `RUNAPI_BASE_URL` or `.baseUrl(...)` only when using a non-default RunAPI endpoint.

## Task Lifecycle

Most media endpoints are asynchronous. `create(params)` submits a task and returns its id, `get(id)` fetches the latest task state, and `run(params)` creates the task and polls until it reaches a terminal state. Synchronous resources expose `run(params)` only.

```java
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.KlingClient;
import ai.runapi.kling.types.TextToVideoParams;
import ai.runapi.kling.types.TextToVideoResponse;
import ai.runapi.kling.types.TextToVideoModel;

KlingClient client = KlingClient.builder()
    .apiKey(System.getenv("RUNAPI_API_KEY"))
    .build();

TextToVideoParams params = TextToVideoParams.builder()
    .model(TextToVideoModel.KLING_3_0)
    .prompt("A crane shot over a snowy mountain village")
    .aspectRatio("16:9")
    .outputResolution("720p")
    .durationSeconds(3)
    .build();

TaskCreateResponse task = client.textToVideo().create(params);
TextToVideoResponse status = client.textToVideo().get(task.getId());
```

## Files

Each model package depends transitively on `ai.runapi:runapi-core`, so you can upload files through any model client.

```java
import ai.runapi.core.files.FileCreateParams;
import ai.runapi.core.files.FileUploadResponse;
import java.nio.file.Paths;

FileUploadResponse uploaded = client.files().create(
    FileCreateParams.fromPath(Paths.get("input.png"))
        .fileName("input.png")
        .build()
);
```

URL and base64 sources use the same entry point:

```java
FileUploadResponse fromUrl = client.files().create(
    FileCreateParams.fromUrl("https://cdn.runapi.ai/public/samples/input.png")
        .fileName("input.png")
        .build()
);

FileUploadResponse fromBase64 = client.files().create(
    FileCreateParams.fromBase64("iVBORw0KGgo...")
        .fileName("input.png")
        .build()
);
```

RunAPI-generated file URLs are temporary. Download and store generated images, videos, audio, or other files in your own durable storage within 7 days; do not treat returned URLs as long-term assets.

## Request Options

```java
import ai.runapi.core.RequestOptions;
import java.time.Duration;

RequestOptions options = RequestOptions.builder()
    .pollingInterval(Duration.ofSeconds(3))
    .pollingMaxWait(Duration.ofMinutes(20))
    .maxRetries(0)
    .build();
```

Per-request options can override timeout, retries, headers, and polling behavior.

## Error Handling

All SDK errors extend `RunApiException`.

```java
import ai.runapi.core.errors.RateLimitException;
import ai.runapi.core.errors.RunApiException;
import ai.runapi.core.errors.ValidationException;

try {
  client.textToVideo().run(params);
} catch (ValidationException error) {
  System.err.println(error.getMessage());
} catch (RateLimitException error) {
  System.err.println(error.getRetryAfter());
} catch (RunApiException error) {
  System.err.println(error.getCode() + " " + error.getStatusCode());
}
```

## Links

- Model page: https://runapi.ai/models/kling
- SDK docs: https://runapi.ai/docs/resources/sdks
- Product docs: https://runapi.ai/docs/api/kling/text-to-video
- Pricing and rate limits: https://runapi.ai/models/kling/3.0
- Full catalog: https://runapi.ai/models
- Repository: https://github.com/runapi-ai/kling-sdk

## License

Licensed under the Apache License, Version 2.0.
