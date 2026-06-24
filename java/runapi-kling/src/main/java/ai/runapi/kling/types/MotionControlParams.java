package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for motion control operations. */
public final class MotionControlParams {
  private final String model;
  private final String sourceImageUrl;
  private final String referenceVideoUrl;
  private final String prompt;
  private final String outputResolution;
  private final String characterOrientation;
  private final String backgroundSource;
  private final String callbackUrl;

  private MotionControlParams(Builder builder) {
    this.model = KlingParamUtils.requireNonBlankTrim(builder.model, "model");
    this.sourceImageUrl = KlingParamUtils.requireNonBlank(builder.sourceImageUrl, "sourceImageUrl");
    this.referenceVideoUrl = KlingParamUtils.requireNonBlank(builder.referenceVideoUrl, "referenceVideoUrl");
    this.prompt = builder.prompt;
    this.outputResolution = builder.outputResolution;
    this.characterOrientation = builder.characterOrientation;
    this.backgroundSource = builder.backgroundSource;
    this.callbackUrl = builder.callbackUrl;
  }

  /** Creates a new MotionControlParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "kling/motion-control";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", KlingParamUtils.wireValue(model));
    raw.put("source_image_url", KlingParamUtils.wireValue(sourceImageUrl));
    raw.put("reference_video_url", KlingParamUtils.wireValue(referenceVideoUrl));
    raw.put("prompt", KlingParamUtils.wireValue(prompt));
    raw.put("output_resolution", KlingParamUtils.wireValue(outputResolution));
    raw.put("character_orientation", KlingParamUtils.wireValue(characterOrientation));
    raw.put("background_source", KlingParamUtils.wireValue(backgroundSource));
    raw.put("callback_url", KlingParamUtils.wireValue(callbackUrl));
    return KlingParamUtils.compact(raw);
  }



  /** Builder for {@link MotionControlParams}. */
  public static final class Builder {
    private String model;
    private String sourceImageUrl;
    private String referenceVideoUrl;
    private String prompt;
    private String outputResolution;
    private String characterOrientation;
    private String backgroundSource;
    private String callbackUrl;

    private Builder() {}

    /** Sets the model slug using a typed model value. */
    public Builder model(MotionControlModel value) {
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

    /** Sets the reference video URL. */
    public Builder referenceVideoUrl(String value) {
      this.referenceVideoUrl = KlingParamUtils.requireNonBlank(value, "referenceVideoUrl");
      return this;
    }

    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = KlingParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the output resolution. */
    public Builder outputResolution(String value) {
      this.outputResolution = KlingParamUtils.requireNonBlank(value, "outputResolution");
      return this;
    }

    /** Sets the character orientation. */
    public Builder characterOrientation(String value) {
      this.characterOrientation = KlingParamUtils.requireNonBlank(value, "characterOrientation");
      return this;
    }

    /** Sets the background source. */
    public Builder backgroundSource(String value) {
      this.backgroundSource = KlingParamUtils.requireNonBlank(value, "backgroundSource");
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = KlingParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Builds immutable motion control parameters. */
    public MotionControlParams build() {
      return new MotionControlParams(this);
    }
  }
}
