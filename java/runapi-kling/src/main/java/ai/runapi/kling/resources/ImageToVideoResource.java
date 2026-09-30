package ai.runapi.kling.resources;

import ai.runapi.core.ClientOptions;
import ai.runapi.core.RequestOptions;
import ai.runapi.core.http.HttpTransport;
import ai.runapi.core.polling.TaskCreateResponse;
import ai.runapi.kling.types.CompletedImageToVideoResponse;
import ai.runapi.kling.types.ImageToVideoParams;
import ai.runapi.kling.types.ImageToVideoResponse;

/** Image To Video operations. */
public final class ImageToVideoResource extends KlingResource {
  /** API endpoint path for image to video operations. */
  public static final String ENDPOINT = "/api/v1/kling/image_to_video";

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
}
