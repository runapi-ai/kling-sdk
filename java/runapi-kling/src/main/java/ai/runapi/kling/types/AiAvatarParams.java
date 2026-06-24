package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for ai avatar operations. */
public final class AiAvatarParams {
  private final String model;
  private final String sourceImageUrl;
  private final String sourceAudioUrl;
  private final String prompt;
  private final String callbackUrl;

  private AiAvatarParams(Builder builder) {
    this.model = KlingParamUtils.requireNonBlankTrim(builder.model, "model");
    this.sourceImageUrl = KlingParamUtils.requireNonBlank(builder.sourceImageUrl, "sourceImageUrl");
    this.sourceAudioUrl = KlingParamUtils.requireNonBlank(builder.sourceAudioUrl, "sourceAudioUrl");
    this.prompt = KlingParamUtils.requireNonBlank(builder.prompt, "prompt");
    this.callbackUrl = builder.callbackUrl;
  }

  /** Creates a new AiAvatarParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "kling/avatar";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", KlingParamUtils.wireValue(model));
    raw.put("source_image_url", KlingParamUtils.wireValue(sourceImageUrl));
    raw.put("source_audio_url", KlingParamUtils.wireValue(sourceAudioUrl));
    raw.put("prompt", KlingParamUtils.wireValue(prompt));
    raw.put("callback_url", KlingParamUtils.wireValue(callbackUrl));
    return KlingParamUtils.compact(raw);
  }



  /** Builder for {@link AiAvatarParams}. */
  public static final class Builder {
    private String model;
    private String sourceImageUrl;
    private String sourceAudioUrl;
    private String prompt;
    private String callbackUrl;

    private Builder() {}

    /** Sets the model slug using a typed model value. */
    public Builder model(AiAvatarModel value) {
      this.model = java.util.Objects.requireNonNull(value, "model").value();
      return this;
    }

    /** Sets the model slug using a string value. */
    public Builder model(String value) {
      this.model = KlingParamUtils.requireNonBlankTrim(value, "model");
      return this;
    }


    /** Sets the source image URL. */
    public Builder sourceImageUrl(String value) {
      this.sourceImageUrl = KlingParamUtils.requireNonBlank(value, "sourceImageUrl");
      return this;
    }

    /** Sets the source audio URL. */
    public Builder sourceAudioUrl(String value) {
      this.sourceAudioUrl = KlingParamUtils.requireNonBlank(value, "sourceAudioUrl");
      return this;
    }

    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = KlingParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = KlingParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Builds immutable ai avatar parameters. */
    public AiAvatarParams build() {
      return new AiAvatarParams(this);
    }
  }
}
