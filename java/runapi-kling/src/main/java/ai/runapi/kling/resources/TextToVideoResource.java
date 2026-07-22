package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.errors.ValidationException;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedTextToVideoResponse;
import ai.runapi.kling.types.TextToVideoParams;
import ai.runapi.kling.types.TextToVideoResponse;
import java.util.List;
import java.util.Map;

/** Text To Video operations. */
public final class TextToVideoResource extends KlingResource {
  /** API endpoint path for text to video operations. */
  public static final String ENDPOINT = "/api/v1/kling/text_to_video";
  private static final String V26_MODEL = "kling-v2.6";
  private static final String V3_TURBO_MODEL = "kling-v3-turbo-text-to-video";
  private static final List<String> V3_TURBO_UNSUPPORTED_FIELDS = java.util.Arrays.asList(
      "enable_sound",
      "negative_prompt",
      "cfg_scale",
      "multi_shots",
      "multi_prompt",
      "first_frame_image_url",
      "last_frame_image_url",
      "kling_elements");

  /** Creates a resource bound to the supplied transport and client options. */
  public TextToVideoResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  /** Creates a text to video task. */
  public TaskCreateResponse create(TextToVideoParams params) {
    return create(params, RequestOptions.none());
  }

  /** Creates a text to video task with per-request options. */
  public TaskCreateResponse create(TextToVideoParams params, RequestOptions options) {
    return createTask(params.action(), params.toMap(), options);
  }

  /** Retrieves a text to video task by ID. */
  public TextToVideoResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  /** Retrieves a text to video task by ID with per-request options. */
  public TextToVideoResponse get(String id, RequestOptions options) {
    return getTask(id, options, TextToVideoResponse.class);
  }

  /** Creates a text to video task and polls until it completes. */
  public CompletedTextToVideoResponse run(TextToVideoParams params) {
    return run(params, RequestOptions.none());
  }

  /** Creates a text to video task with per-request options and polls until it completes. */
  public CompletedTextToVideoResponse run(TextToVideoParams params, RequestOptions options) {
    return runTask(params.action(), params.toMap(), options, TextToVideoResponse.class, CompletedTextToVideoResponse.class);
  }

  @Override
  protected void validateBody(String action, Map<String, Object> body) {
    if (V26_MODEL.equals(body.get("model"))
        && Boolean.TRUE.equals(body.get("enable_sound"))
        && !"pro".equals(body.get("mode"))) {
      throw new ValidationException("enable_sound requires mode pro for kling-v2.6");
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
