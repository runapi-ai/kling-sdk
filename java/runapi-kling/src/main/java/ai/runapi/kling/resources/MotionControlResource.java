package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedMotionControlResponse;
import ai.runapi.kling.types.MotionControlParams;
import ai.runapi.kling.types.MotionControlResponse;

/** Motion Control operations. */
public final class MotionControlResource extends KlingResource {
  /** API endpoint path for motion control operations. */
  public static final String ENDPOINT = "/api/v1/kling/motion_control";

  /** Creates a resource bound to the supplied transport and client options. */
  public MotionControlResource(HttpTransport transport, ClientOptions options) {
    super(transport, options, ENDPOINT);
  }

  /** Creates a motion control task. */
  public TaskCreateResponse create(MotionControlParams params) {
    return create(params, RequestOptions.none());
  }

  /** Creates a motion control task with per-request options. */
  public TaskCreateResponse create(MotionControlParams params, RequestOptions options) {
    return createTask(params.action(), params.toMap(), options);
  }

  /** Retrieves a motion control task by ID. */
  public MotionControlResponse get(String id) {
    return get(id, RequestOptions.none());
  }

  /** Retrieves a motion control task by ID with per-request options. */
  public MotionControlResponse get(String id, RequestOptions options) {
    return getTask(id, options, MotionControlResponse.class);
  }

  /** Creates a motion control task and polls until it completes. */
  public CompletedMotionControlResponse run(MotionControlParams params) {
    return run(params, RequestOptions.none());
  }

  /** Creates a motion control task with per-request options and polls until it completes. */
  public CompletedMotionControlResponse run(MotionControlParams params, RequestOptions options) {
    return runTask(params.action(), params.toMap(), options, MotionControlResponse.class, CompletedMotionControlResponse.class);
  }
}
