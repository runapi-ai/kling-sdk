package ai.runapi.kling;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;

import ai.runapi.core.RequestOptions;
import ai.runapi.core.errors.ValidationException;
import ai.runapi.core.http.HttpRequest;
import ai.runapi.core.http.HttpResponse;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.http.JsonRequestBody;
import ai.runapi.core.json.Json;
import ai.runapi.kling.types.CompletedTextToVideoResponse;
import ai.runapi.kling.types.TextToVideoResponse;
import ai.runapi.kling.types.AiAvatarModel;
import ai.runapi.kling.types.AiAvatarParams;
import ai.runapi.kling.types.AiAvatarResponse;
import ai.runapi.kling.types.CompletedAiAvatarResponse;
import ai.runapi.kling.types.CompletedImageToVideoResponse;
import ai.runapi.kling.types.CompletedMotionControlResponse;
import ai.runapi.kling.types.CompletedTextToVideoResponse;
import ai.runapi.kling.types.ImageToVideoModel;
import ai.runapi.kling.types.ImageToVideoParams;
import ai.runapi.kling.types.ImageToVideoResponse;
import ai.runapi.kling.types.KlingElement;
import ai.runapi.kling.types.MotionControlModel;
import ai.runapi.kling.types.MotionControlParams;
import ai.runapi.kling.types.MotionControlResponse;
import ai.runapi.kling.types.MultiPromptItem;
import ai.runapi.kling.types.TextToVideoModel;
import ai.runapi.kling.types.TextToVideoParams;
import ai.runapi.kling.types.TextToVideoResponse;
import com.fasterxml.jackson.databind.JsonNode;
import java.io.ByteArrayOutputStream;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import org.junit.jupiter.api.Test;

class KlingClientTest {
  @Test
  void builderCreatesClientAndUniversalResources() {
    KlingClient client = KlingClient.builder().apiKey("sk-test").build();

    assertNotNull(client.textToVideo());
    assertNotNull(client.files());
    assertNotNull(client.account());
  }

  @Test
  void openValueClassesSerializeAsScalarStrings() throws Exception {
    String json = Json.mapper().writeValueAsString(new TextToVideoModel("kling-3.0"));

    assertEquals("\"kling-3.0\"", json);
    assertEquals(new TextToVideoModel("kling-3.0"), Json.mapper().readValue(json, TextToVideoModel.class));
  }

  @Test
  void createSendsExpectedRequestShape() throws Exception {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_123\",\"status\":\"processing\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    client.textToVideo().create(
        TextToVideoParams.builder()
            .model(TextToVideoModel.KLING_3_0)
            .prompt("A small red cube on a plain white table, studio product photo")
            .build()
    );

    assertEquals("POST", transport.request.getMethod().name());
    assertEquals("/api/v1/kling/text_to_video", transport.request.getPath());
    JsonNode body = bodyJson(transport.request);
    assertNotNull(body);
  }

  @Test
  void createSendsElementAudioAndTimeFields() throws Exception {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_elements\",\"status\":\"processing\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    client.textToVideo().create(
        TextToVideoParams.builder()
            .model(TextToVideoModel.KLING_3_0)
            .prompt("A bright room @element_dog @element_run")
            .klingElements(Arrays.asList(
                KlingElement.builder()
                    .name("element_dog")
                    .description("dog")
                    .elementInputUrls(Arrays.asList(
                        "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
                        "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg"))
                    .elementInputAudioUrls(Arrays.asList("https://cdn.runapi.ai/public/samples/music.mp3"))
                    .build(),
                KlingElement.builder()
                    .name("element_run")
                    .description("running dog")
                    .elementInputUrls(Arrays.asList("https://cdn.runapi.ai/public/samples/video.mp4"))
                    .startTime(1000)
                    .endTime(6000)
                    .build()))
            .build()
    );

    JsonNode elements = bodyJson(transport.request).get("kling_elements");
    assertEquals("https://cdn.runapi.ai/public/samples/music.mp3", elements.get(0).get("element_input_audio_urls").get(0).asText());
    assertEquals("https://cdn.runapi.ai/public/samples/video.mp4", elements.get(1).get("element_input_urls").get(0).asText());
    assertEquals(1000, elements.get(1).get("start_time").asInt());
    assertEquals(6000, elements.get(1).get("end_time").asInt());
  }

  @Test
  void createSendsV3TurboTextToVideoShape() throws Exception {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_v3\",\"status\":\"processing\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    client.textToVideo().create(
        TextToVideoParams.builder()
            .model(TextToVideoModel.KLING_V3_TURBO_TEXT_TO_VIDEO)
            .prompt("A silver train crossing a moonlit bridge")
            .durationSeconds(7)
            .aspectRatio("16:9")
            .outputResolution("1080p")
            .build());

    JsonNode body = bodyJson(transport.request);
    assertEquals("kling-v3-turbo-text-to-video", body.get("model").asText());
    assertEquals(7, body.get("duration_seconds").asInt());
    assertEquals("1080p", body.get("output_resolution").asText());
  }

  @Test
  void createRejectsV3TurboTextToVideoUnsupportedFields() {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_v3\",\"status\":\"processing\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    ValidationException error = assertThrows(
        ValidationException.class,
        () -> client.textToVideo().create(
            TextToVideoParams.builder()
                .model(TextToVideoModel.KLING_V3_TURBO_TEXT_TO_VIDEO)
                .prompt("A quiet city street after rain")
                .enableSound(false)
                .build()));

    assertEquals("enable_sound is not supported by kling-v3-turbo-text-to-video", error.getMessage());
    assertNull(transport.request);
  }

  @Test
  void createSendsV3TurboImageToVideoShape() throws Exception {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_v3_i2v\",\"status\":\"processing\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    client.imageToVideo().create(
        ImageToVideoParams.builder()
            .model(ImageToVideoModel.KLING_V3_TURBO_IMAGE_TO_VIDEO)
            .prompt("Camera glides toward the lighthouse")
            .firstFrameImageUrl("https://cdn.runapi.ai/public/samples/image-to-video.jpg")
            .durationSeconds(7)
            .outputResolution("720p")
            .build());

    JsonNode body = bodyJson(transport.request);
    assertEquals("kling-v3-turbo-image-to-video", body.get("model").asText());
    assertEquals("https://cdn.runapi.ai/public/samples/image-to-video.jpg", body.get("first_frame_image_url").asText());
    assertEquals("720p", body.get("output_resolution").asText());
  }

  @Test
  void createRejectsV3TurboImageToVideoUnsupportedFields() {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_v3_i2v\",\"status\":\"processing\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    ValidationException error = assertThrows(
        ValidationException.class,
        () -> client.imageToVideo().create(
            ImageToVideoParams.builder()
                .model(ImageToVideoModel.KLING_V3_TURBO_IMAGE_TO_VIDEO)
                .prompt("Camera glides toward the lighthouse")
                .firstFrameImageUrl("https://cdn.runapi.ai/public/samples/image-to-video.jpg")
                .lastFrameImageUrl("https://cdn.runapi.ai/public/samples/last-frame.jpg")
                .build()));

    assertEquals("last_frame_image_url is not supported by kling-v3-turbo-image-to-video", error.getMessage());
    assertNull(transport.request);
  }

  @Test
  void getDecodesTaskResponseAndExtraFields() {
    CapturingTransport transport = new CapturingTransport("{\"id\":\"task_456\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}],\"custom\":\"kept\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    TextToVideoResponse response = client.textToVideo().get("task_456");

    assertEquals("GET", transport.request.getMethod().name());
    assertEquals("/api/v1/kling/text_to_video/task_456", transport.request.getPath());
    assertEquals("completed", response.getStatus().value());
    assertNotNull(response.getVideos());
    assertEquals("kept", response.extraFields().get("custom").asText());
  }

  @Test
  void runPollsUntilCompletedAndKeepsExtraFields() {
    SequenceTransport transport = new SequenceTransport(
        "{\"id\":\"task_789\",\"status\":\"processing\"}",
        "{\"id\":\"task_789\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}],\"custom\":\"kept\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    CompletedTextToVideoResponse response = client.textToVideo().run(
        TextToVideoParams.builder()
            .model(TextToVideoModel.KLING_3_0)
            .prompt("A small red cube on a plain white table, studio product photo")
            .build(),
        RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build());

    assertEquals("completed", response.getStatus().value());
    assertNotNull(response.getVideos());
    assertEquals("kept", response.extraFields().get("custom").asText());
    assertEquals(2, transport.calls);
  }

  @Test
  void runRejectsCompletedResponseMissingResultField() {
    SequenceTransport transport = new SequenceTransport(
        "{\"id\":\"task_missing\",\"status\":\"processing\"}",
        "{\"id\":\"task_missing\",\"status\":\"completed\"}");
    KlingClient client = KlingClient.builder().apiKey("sk-test").transport(transport).build();

    assertThrows(
        ValidationException.class,
        () -> client.textToVideo().run(
                TextToVideoParams.builder()
                    .model(TextToVideoModel.KLING_3_0)
                    .prompt("A small red cube on a plain white table, studio product photo")
                    .build(),
            RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build()));
  }

    @Test
    void coversAiavatarResourceMethods() {
      CapturingTransport createTransport = new CapturingTransport("{\"id\":\"task_avatar\",\"status\":\"processing\"}");
      KlingClient createClient = KlingClient.builder().apiKey("sk-test").transport(createTransport).build();
      assertNotNull(createClient.aiAvatar().create(
              AiAvatarParams.builder()
                  .model(AiAvatarModel.KLING_AI_AVATAR_PRO)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .sourceAudioUrl("https://cdn.runapi.ai/public/samples/music.mp3")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build()
      ));

      CapturingTransport createWithOptionsTransport = new CapturingTransport("{\"id\":\"task_avatar_options\",\"status\":\"processing\"}");
      KlingClient createWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(createWithOptionsTransport).build();
      assertNotNull(createWithOptionsClient.aiAvatar().create(
              AiAvatarParams.builder()
                  .model(AiAvatarModel.KLING_AI_AVATAR_PRO)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .sourceAudioUrl("https://cdn.runapi.ai/public/samples/music.mp3")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.none()));

      CapturingTransport getTransport = new CapturingTransport("{\"id\":\"task_avatar\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getClient = KlingClient.builder().apiKey("sk-test").transport(getTransport).build();
      assertNotNull(getClient.aiAvatar().get("task_avatar"));

      CapturingTransport getWithOptionsTransport = new CapturingTransport("{\"id\":\"task_avatar_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(getWithOptionsTransport).build();
      assertNotNull(getWithOptionsClient.aiAvatar().get("task_avatar_options", RequestOptions.none()));

      SequenceTransport runTransport = new SequenceTransport(
          "{\"id\":\"task_avatar_run\",\"status\":\"processing\"}",
          "{\"id\":\"task_avatar_run\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runClient = KlingClient.builder().apiKey("sk-test").transport(runTransport).build();
      CompletedAiAvatarResponse runResponse = runClient.aiAvatar().run(
              AiAvatarParams.builder()
                  .model(AiAvatarModel.KLING_AI_AVATAR_PRO)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .sourceAudioUrl("https://cdn.runapi.ai/public/samples/music.mp3")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build());
      assertNotNull(runResponse);

      SequenceTransport runWithOptionsTransport = new SequenceTransport(
          "{\"id\":\"task_avatar_run_options\",\"status\":\"processing\"}",
          "{\"id\":\"task_avatar_run_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(runWithOptionsTransport).build();
      assertNotNull(runWithOptionsClient.aiAvatar().run(
              AiAvatarParams.builder()
                  .model(AiAvatarModel.KLING_AI_AVATAR_PRO)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .sourceAudioUrl("https://cdn.runapi.ai/public/samples/music.mp3")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build()));
    }

    @Test
    void coversImagetovideoResourceMethods() {
      CapturingTransport createTransport = new CapturingTransport("{\"id\":\"task_image_to_video\",\"status\":\"processing\"}");
      KlingClient createClient = KlingClient.builder().apiKey("sk-test").transport(createTransport).build();
      assertNotNull(createClient.imageToVideo().create(
              ImageToVideoParams.builder()
                  .model(ImageToVideoModel.KLING_V2_1_MASTER_IMAGE_TO_VIDEO)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .firstFrameImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .build()
      ));

      CapturingTransport createWithOptionsTransport = new CapturingTransport("{\"id\":\"task_image_to_video_options\",\"status\":\"processing\"}");
      KlingClient createWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(createWithOptionsTransport).build();
      assertNotNull(createWithOptionsClient.imageToVideo().create(
              ImageToVideoParams.builder()
                  .model(ImageToVideoModel.KLING_V2_1_MASTER_IMAGE_TO_VIDEO)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .firstFrameImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .build(),
          RequestOptions.none()));

      CapturingTransport getTransport = new CapturingTransport("{\"id\":\"task_image_to_video\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getClient = KlingClient.builder().apiKey("sk-test").transport(getTransport).build();
      assertNotNull(getClient.imageToVideo().get("task_image_to_video"));

      CapturingTransport getWithOptionsTransport = new CapturingTransport("{\"id\":\"task_image_to_video_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(getWithOptionsTransport).build();
      assertNotNull(getWithOptionsClient.imageToVideo().get("task_image_to_video_options", RequestOptions.none()));

      SequenceTransport runTransport = new SequenceTransport(
          "{\"id\":\"task_image_to_video_run\",\"status\":\"processing\"}",
          "{\"id\":\"task_image_to_video_run\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runClient = KlingClient.builder().apiKey("sk-test").transport(runTransport).build();
      CompletedImageToVideoResponse runResponse = runClient.imageToVideo().run(
              ImageToVideoParams.builder()
                  .model(ImageToVideoModel.KLING_V2_1_MASTER_IMAGE_TO_VIDEO)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .firstFrameImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build());
      assertNotNull(runResponse);

      SequenceTransport runWithOptionsTransport = new SequenceTransport(
          "{\"id\":\"task_image_to_video_run_options\",\"status\":\"processing\"}",
          "{\"id\":\"task_image_to_video_run_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(runWithOptionsTransport).build();
      assertNotNull(runWithOptionsClient.imageToVideo().run(
              ImageToVideoParams.builder()
                  .model(ImageToVideoModel.KLING_V2_1_MASTER_IMAGE_TO_VIDEO)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .firstFrameImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build()));
    }

    @Test
    void coversMotioncontrolResourceMethods() {
      CapturingTransport createTransport = new CapturingTransport("{\"id\":\"task_motion_control\",\"status\":\"processing\"}");
      KlingClient createClient = KlingClient.builder().apiKey("sk-test").transport(createTransport).build();
      assertNotNull(createClient.motionControl().create(
              MotionControlParams.builder()
                  .model(MotionControlModel.KLING_3_0)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .referenceVideoUrl("https://cdn.runapi.ai/public/samples/video.mp4")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build()
      ));

      CapturingTransport createWithOptionsTransport = new CapturingTransport("{\"id\":\"task_motion_control_options\",\"status\":\"processing\"}");
      KlingClient createWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(createWithOptionsTransport).build();
      assertNotNull(createWithOptionsClient.motionControl().create(
              MotionControlParams.builder()
                  .model(MotionControlModel.KLING_3_0)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .referenceVideoUrl("https://cdn.runapi.ai/public/samples/video.mp4")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.none()));

      CapturingTransport getTransport = new CapturingTransport("{\"id\":\"task_motion_control\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getClient = KlingClient.builder().apiKey("sk-test").transport(getTransport).build();
      assertNotNull(getClient.motionControl().get("task_motion_control"));

      CapturingTransport getWithOptionsTransport = new CapturingTransport("{\"id\":\"task_motion_control_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(getWithOptionsTransport).build();
      assertNotNull(getWithOptionsClient.motionControl().get("task_motion_control_options", RequestOptions.none()));

      SequenceTransport runTransport = new SequenceTransport(
          "{\"id\":\"task_motion_control_run\",\"status\":\"processing\"}",
          "{\"id\":\"task_motion_control_run\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runClient = KlingClient.builder().apiKey("sk-test").transport(runTransport).build();
      CompletedMotionControlResponse runResponse = runClient.motionControl().run(
              MotionControlParams.builder()
                  .model(MotionControlModel.KLING_3_0)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .referenceVideoUrl("https://cdn.runapi.ai/public/samples/video.mp4")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build());
      assertNotNull(runResponse);

      SequenceTransport runWithOptionsTransport = new SequenceTransport(
          "{\"id\":\"task_motion_control_run_options\",\"status\":\"processing\"}",
          "{\"id\":\"task_motion_control_run_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(runWithOptionsTransport).build();
      assertNotNull(runWithOptionsClient.motionControl().run(
              MotionControlParams.builder()
                  .model(MotionControlModel.KLING_3_0)
                  .sourceImageUrl("https://cdn.runapi.ai/public/samples/image.jpg")
                  .referenceVideoUrl("https://cdn.runapi.ai/public/samples/video.mp4")
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build()));
    }

    @Test
    void coversTexttovideoResourceMethods() {
      CapturingTransport createTransport = new CapturingTransport("{\"id\":\"task_text_to_video\",\"status\":\"processing\"}");
      KlingClient createClient = KlingClient.builder().apiKey("sk-test").transport(createTransport).build();
      assertNotNull(createClient.textToVideo().create(
              TextToVideoParams.builder()
                  .model(TextToVideoModel.KLING_3_0)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build()
      ));

      CapturingTransport createWithOptionsTransport = new CapturingTransport("{\"id\":\"task_text_to_video_options\",\"status\":\"processing\"}");
      KlingClient createWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(createWithOptionsTransport).build();
      assertNotNull(createWithOptionsClient.textToVideo().create(
              TextToVideoParams.builder()
                  .model(TextToVideoModel.KLING_3_0)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.none()));

      CapturingTransport getTransport = new CapturingTransport("{\"id\":\"task_text_to_video\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getClient = KlingClient.builder().apiKey("sk-test").transport(getTransport).build();
      assertNotNull(getClient.textToVideo().get("task_text_to_video"));

      CapturingTransport getWithOptionsTransport = new CapturingTransport("{\"id\":\"task_text_to_video_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient getWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(getWithOptionsTransport).build();
      assertNotNull(getWithOptionsClient.textToVideo().get("task_text_to_video_options", RequestOptions.none()));

      SequenceTransport runTransport = new SequenceTransport(
          "{\"id\":\"task_text_to_video_run\",\"status\":\"processing\"}",
          "{\"id\":\"task_text_to_video_run\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runClient = KlingClient.builder().apiKey("sk-test").transport(runTransport).build();
      CompletedTextToVideoResponse runResponse = runClient.textToVideo().run(
              TextToVideoParams.builder()
                  .model(TextToVideoModel.KLING_3_0)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build());
      assertNotNull(runResponse);

      SequenceTransport runWithOptionsTransport = new SequenceTransport(
          "{\"id\":\"task_text_to_video_run_options\",\"status\":\"processing\"}",
          "{\"id\":\"task_text_to_video_run_options\",\"status\":\"completed\",\"videos\":[{\"url\":\"https://file.runapi.ai/generated\"}]}");
      KlingClient runWithOptionsClient = KlingClient.builder().apiKey("sk-test").transport(runWithOptionsTransport).build();
      assertNotNull(runWithOptionsClient.textToVideo().run(
              TextToVideoParams.builder()
                  .model(TextToVideoModel.KLING_3_0)
                  .prompt("A small red cube on a plain white table, studio product photo")
                  .build(),
          RequestOptions.builder().pollingInterval(Duration.ofMillis(1)).pollingMaxWait(Duration.ofSeconds(1)).build()));
    }

  private static JsonNode bodyJson(HttpRequest request) throws Exception {
    JsonRequestBody body = (JsonRequestBody) request.getBody();
    ByteArrayOutputStream out = new ByteArrayOutputStream();
    body.writeTo(out);
    return Json.mapper().readTree(out.toByteArray());
  }

  private static final class CapturingTransport implements HttpTransport {
    private final String body;
    private HttpRequest request;

    private CapturingTransport(String body) {
      this.body = body;
    }

    public HttpResponse send(HttpRequest request) {
      this.request = request;
      return new HttpResponse(200, body, Collections.<String, java.util.List<String>>emptyMap());
    }

    public void close() {}
  }

  private static final class SequenceTransport implements HttpTransport {
    private final String[] responses;
    private int calls;

    private SequenceTransport(String... responses) {
      this.responses = responses;
    }

    public HttpResponse send(HttpRequest request) {
      String response = responses[Math.min(calls, responses.length - 1)];
      calls++;
      return new HttpResponse(200, response, Collections.<String, java.util.List<String>>emptyMap());
    }

    public void close() {}
  }
}
