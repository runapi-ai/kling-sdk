package ai.runapi.kling;

import ai.runapi.core.BaseClient;
import ai.runapi.core.ClientOptions;
import ai.runapi.core.http.HttpTransport;
import java.net.URI;
import ai.runapi.kling.resources.AiAvatarResource;
import ai.runapi.kling.resources.ExtendVideoResource;
import ai.runapi.kling.resources.ImageToVideoResource;
import ai.runapi.kling.resources.MotionControlResource;
import ai.runapi.kling.resources.TextToVideoResource;

/** Kling model-family Java SDK client. */
public final class KlingClient extends BaseClient {
  private final AiAvatarResource aiAvatar;
  private final ExtendVideoResource extendVideo;
  private final ImageToVideoResource imageToVideo;
  private final MotionControlResource motionControl;
  private final TextToVideoResource textToVideo;

  private KlingClient(ClientOptions options) {
    super(options);
    this.aiAvatar = new AiAvatarResource(transport(), options());
    this.extendVideo = new ExtendVideoResource(transport(), options());
    this.imageToVideo = new ImageToVideoResource(transport(), options());
    this.motionControl = new MotionControlResource(transport(), options());
    this.textToVideo = new TextToVideoResource(transport(), options());
  }

  /** Creates a new KlingClient builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Ai Avatar operations. */
  public AiAvatarResource aiAvatar() {
    return aiAvatar;
  }

  /** Extend Video operations. */
  public ExtendVideoResource extendVideo() {
    return extendVideo;
  }

  /** Image To Video operations. */
  public ImageToVideoResource imageToVideo() {
    return imageToVideo;
  }

  /** Motion Control operations. */
  public MotionControlResource motionControl() {
    return motionControl;
  }

  /** Text To Video operations. */
  public TextToVideoResource textToVideo() {
    return textToVideo;
  }

  /** Builder for {@link KlingClient}. */
  public static final class Builder extends BaseClient.Builder<Builder> {
    private Builder() {}

    /** Sets the API key. If omitted, the SDK reads {@code RUNAPI_API_KEY}. */
    @Override
    public Builder apiKey(String value) {
      return super.apiKey(value);
    }

    /** Sets the RunAPI base URL. If omitted, the SDK reads {@code RUNAPI_BASE_URL}. */
    @Override
    public Builder baseUrl(String value) {
      return super.baseUrl(value);
    }

    /** Sets the RunAPI base URL from a URI. */
    @Override
    public Builder baseUrl(URI value) {
      return super.baseUrl(value);
    }

    /** Sets a custom HTTP transport. User-provided transports are not closed by SDK clients. */
    @Override
    public Builder transport(HttpTransport value) {
      return super.transport(value);
    }

    /** Builds an immutable KlingClient. */
    @Override
    public KlingClient build() {
      return new KlingClient(options.build());
    }
  }
}
