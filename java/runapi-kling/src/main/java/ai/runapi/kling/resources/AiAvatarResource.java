package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedAiAvatarResponse;
import ai.runapi.kling.types.AiAvatarParams;
import ai.runapi.kling.types.AiAvatarResponse;

/** Ai Avatar operations. */
public final class AiAvatarResource extends KlingResource {
  /** API endpoint path for ai avatar operations. */
  public static final String ENDPOINT = "/api/v1/kling/ai_avatar";

  /** Creates a resource bound to the supplied transport and client options. */
  public AiAvatarResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  /** Creates a ai avatar task. */
  public TaskCreateResponse create(AiAvatarParams params) {
    return create(params, RequestOptions.none());
  }

  /** Creates a ai avatar task with per-request options. */
  public TaskCreateResponse create(AiAvatarParams params, RequestOptions options) {
    return createTask(params.action(), params.toMap(), options);
  }

  /** Retrieves a ai avatar task by ID. */
  public AiAvatarResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  /** Retrieves a ai avatar task by ID with per-request options. */
  public AiAvatarResponse get(String id, RequestOptions options) {
    return getTask(id, options, AiAvatarResponse.class);
  }

  /** Creates a ai avatar task and polls until it completes. */
  public CompletedAiAvatarResponse run(AiAvatarParams params) {
    return run(params, RequestOptions.none());
  }

  /** Creates a ai avatar task with per-request options and polls until it completes. */
  public CompletedAiAvatarResponse run(AiAvatarParams params, RequestOptions options) {
    return runTask(params.action(), params.toMap(), options, AiAvatarResponse.class, CompletedAiAvatarResponse.class);
  }
}
