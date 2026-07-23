package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedTextToVideoResponse;
import ai.runapi.kling.types.ExtendVideoParams;
import ai.runapi.kling.types.TextToVideoResponse;

/** Extend Video operations. */
public final class ExtendVideoResource extends KlingResource {
  public static final String ENDPOINT = "/api/v1/kling/extend_video";
  private static final String CONTRACT_MODEL = "kling-v2.5-turbo-text-to-video-pro";

  public ExtendVideoResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  public TaskCreateResponse create(ExtendVideoParams params) {
    return create(params, RequestOptions.none());
  }

  public TaskCreateResponse create(ExtendVideoParams params, RequestOptions options) {
    return createTaskWithContractModel(params.action(), params.toMap(), CONTRACT_MODEL, options);
  }

  public TextToVideoResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  public TextToVideoResponse get(String id, RequestOptions options) {
    return getTask(id, options, TextToVideoResponse.class);
  }

  public CompletedTextToVideoResponse run(ExtendVideoParams params) {
    return run(params, RequestOptions.none());
  }

  public CompletedTextToVideoResponse run(ExtendVideoParams params, RequestOptions options) {
    return runTaskWithContractModel(
        params.action(), params.toMap(), CONTRACT_MODEL, options,
        TextToVideoResponse.class, CompletedTextToVideoResponse.class);
  }
}
