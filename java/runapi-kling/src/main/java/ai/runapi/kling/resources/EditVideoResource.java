package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedTextToVideoResponse;
import ai.runapi.kling.types.EditVideoParams;
import ai.runapi.kling.types.TextToVideoResponse;

/** Edit video operations. */
public final class EditVideoResource extends KlingResource {
  /** API endpoint path for edit video operations. */
  public static final String ENDPOINT = "/api/v1/kling/edit_video";

  /** Creates a resource bound to the supplied transport and client options. */
  public EditVideoResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  /** Creates an edit video task. */
  public TaskCreateResponse create(EditVideoParams params) {
    return create(params, RequestOptions.none());
  }

  /** Creates an edit video task with per-request options. */
  public TaskCreateResponse create(EditVideoParams params, RequestOptions options) {
    return createTask(params.action(), params.toMap(), options);
  }

  /** Retrieves an edit video task by ID. */
  public TextToVideoResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  /** Retrieves an edit video task by ID with per-request options. */
  public TextToVideoResponse get(String id, RequestOptions options) {
    return getTask(id, options, TextToVideoResponse.class);
  }

  /** Creates an edit video task and polls until it completes. */
  public CompletedTextToVideoResponse run(EditVideoParams params) {
    return run(params, RequestOptions.none());
  }

  /** Creates an edit video task with per-request options and polls until it completes. */
  public CompletedTextToVideoResponse run(EditVideoParams params, RequestOptions options) {
    return runTask(
        params.action(), params.toMap(), options,
        TextToVideoResponse.class, CompletedTextToVideoResponse.class);
  }
}
