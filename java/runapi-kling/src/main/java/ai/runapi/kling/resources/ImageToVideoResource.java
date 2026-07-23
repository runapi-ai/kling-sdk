package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.errors.ValidationException;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedImageToVideoResponse;
import ai.runapi.kling.types.ImageToVideoParams;
import ai.runapi.kling.types.ImageToVideoResponse;
import java.util.List;
import java.util.Map;

/** Image To Video operations. */
public final class ImageToVideoResource extends KlingResource {
  /** API endpoint path for image to video operations. */
  public static final String ENDPOINT = "/api/v1/kling/image_to_video";
  private static final String V26_MODEL = "kling-v2.6";
  private static final String V3_OMNI_MODEL = "kling-v3-omni";
  private static final String V3_TURBO_MODEL = "kling-v3-turbo-image-to-video";
  private static final List<String> V3_TURBO_UNSUPPORTED_FIELDS = java.util.Arrays.asList(
      "aspect_ratio",
      "negative_prompt",
      "cfg_scale",
      "last_frame_image_url");

  /** Creates a resource bound to the supplied transport and client options. */
  public ImageToVideoResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  /** Creates a image to video task. */
  public TaskCreateResponse create(ImageToVideoParams params) {
    return create(params, RequestOptions.none());
  }

  /** Creates a image to video task with per-request options. */
  public TaskCreateResponse create(ImageToVideoParams params, RequestOptions options) {
    return createTask(params.action(), params.toMap(), options);
  }

  /** Retrieves a image to video task by ID. */
  public ImageToVideoResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  /** Retrieves a image to video task by ID with per-request options. */
  public ImageToVideoResponse get(String id, RequestOptions options) {
    return getTask(id, options, ImageToVideoResponse.class);
  }

  /** Creates a image to video task and polls until it completes. */
  public CompletedImageToVideoResponse run(ImageToVideoParams params) {
    return run(params, RequestOptions.none());
  }

  /** Creates a image to video task with per-request options and polls until it completes. */
  public CompletedImageToVideoResponse run(ImageToVideoParams params, RequestOptions options) {
    return runTask(params.action(), params.toMap(), options, ImageToVideoResponse.class, CompletedImageToVideoResponse.class);
  }

  @Override
  protected void validateBody(String action, Map<String, Object> body) {
    if (V26_MODEL.equals(body.get("model"))) {
      validateV26Body(body);
    }
    if (V3_OMNI_MODEL.equals(body.get("model")) && fieldPresent(body, "last_frame_image_url")) {
      Object duration = body.get("duration_seconds");
      if (duration != null && ((Number) duration).intValue() != 5) {
        throw new ValidationException("last_frame_image_url requires duration_seconds 5 for kling-v3-omni");
      }
    }
    if (!V3_TURBO_MODEL.equals(body.get("model"))) {
      return;
    }

    for (String field : V3_TURBO_UNSUPPORTED_FIELDS) {
      if (fieldPresent(body, field)) {
        throw new ValidationException(field + " is not supported by " + V3_TURBO_MODEL);
      }
    }
  }

  private static void validateV26Body(Map<String, Object> body) {
    if (Boolean.TRUE.equals(body.get("enable_sound")) && !"pro".equals(body.get("mode"))) {
      throw new ValidationException("enable_sound requires mode pro for kling-v2.6");
    }
    if (!fieldPresent(body, "last_frame_image_url")) {
      return;
    }
    if (!"pro".equals(body.get("mode"))) {
      throw new ValidationException("last_frame_image_url requires mode pro for kling-v2.6");
    }
    if (body.containsKey("duration_seconds") && ((Number) body.get("duration_seconds")).intValue() != 5) {
      throw new ValidationException("last_frame_image_url requires duration_seconds 5 for kling-v2.6");
    }
  }

  private static boolean fieldPresent(Map<String, Object> params, String field) {
    if (!params.containsKey(field)) {
      return false;
    }
    Object value = params.get(field);
    if (Boolean.FALSE.equals(value)) {
      return true;
    }
    return present(value);
  }

  private static boolean present(Object value) {
    if (value == null || Boolean.FALSE.equals(value)) {
      return false;
    }
    if (value instanceof String) {
      return !((String) value).trim().isEmpty();
    }
    if (value instanceof List<?>) {
      return !((List<?>) value).isEmpty();
    }
    if (value instanceof Map<?, ?>) {
      return !((Map<?, ?>) value).isEmpty();
    }
    return true;
  }
}
