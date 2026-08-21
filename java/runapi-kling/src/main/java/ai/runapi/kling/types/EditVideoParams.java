package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for edit video operations. */
public final class EditVideoParams {
  private final String model;
  private final String prompt;
  private final String sourceVideoUrl;
  private final String sourceTaskId;
  private final List<String> referenceImageUrls;
  private final Integer durationSeconds;
  private final String outputResolution;
  private final String aspectRatio;
  private final Boolean enableSound;
  private final String callbackUrl;

  private EditVideoParams(Builder builder) {
    this.model = KlingParamUtils.requireNonBlankTrim(builder.model, "model");
    this.prompt = KlingParamUtils.requireNonBlank(builder.prompt, "prompt");
    this.sourceVideoUrl = builder.sourceVideoUrl;
    this.sourceTaskId = builder.sourceTaskId;
    this.referenceImageUrls = KlingParamUtils.strings(builder.referenceImageUrls);
    this.durationSeconds = builder.durationSeconds;
    this.outputResolution = builder.outputResolution;
    this.aspectRatio = builder.aspectRatio;
    this.enableSound = builder.enableSound;
    this.callbackUrl = builder.callbackUrl;
  }

  /** Creates a new EditVideoParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "kling/edit-video";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", KlingParamUtils.wireValue(model));
    raw.put("prompt", KlingParamUtils.wireValue(prompt));
    raw.put("source_video_url", KlingParamUtils.wireValue(sourceVideoUrl));
    raw.put("source_task_id", KlingParamUtils.wireValue(sourceTaskId));
    raw.put("reference_image_urls", KlingParamUtils.wireValue(referenceImageUrls));
    raw.put("duration_seconds", KlingParamUtils.wireValue(durationSeconds));
    raw.put("output_resolution", KlingParamUtils.wireValue(outputResolution));
    raw.put("aspect_ratio", KlingParamUtils.wireValue(aspectRatio));
    raw.put("enable_sound", KlingParamUtils.wireValue(enableSound));
    raw.put("callback_url", KlingParamUtils.wireValue(callbackUrl));
    return KlingParamUtils.compact(raw);
  }

  /** Builder for {@link EditVideoParams}. */
  public static final class Builder {
    private String model;
    private String prompt;
    private String sourceVideoUrl;
    private String sourceTaskId;
    private List<String> referenceImageUrls;
    private Integer durationSeconds;
    private String outputResolution;
    private String aspectRatio;
    private Boolean enableSound;
    private String callbackUrl;

    private Builder() {}

    /** Sets the model slug using a typed model value. */
    public Builder model(EditVideoModel value) {
      this.model = java.util.Objects.requireNonNull(value, "model").value();
      return this;
    }

    /** Sets the model slug using a string value. */
    public Builder model(String value) {
      this.model = KlingParamUtils.requireNonBlankTrim(value, "model");
      return this;
    }

    /** Sets the video description. */
    public Builder prompt(String value) {
      this.prompt = KlingParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets a caller-owned source video URL. */
    public Builder sourceVideoUrl(String value) {
      this.sourceVideoUrl = KlingParamUtils.requireNonBlank(value, "sourceVideoUrl");
      return this;
    }

    /** Sets a completed compatible task ID. */
    public Builder sourceTaskId(String value) {
      this.sourceTaskId = KlingParamUtils.requireNonBlank(value, "sourceTaskId");
      return this;
    }

    /** Sets ordered reference image URLs. */
    public Builder referenceImageUrls(List<String> value) {
      this.referenceImageUrls = value;
      return this;
    }

    /** Sets the output duration in seconds. */
    public Builder durationSeconds(int value) {
      this.durationSeconds = value;
      return this;
    }

    /** Sets the output resolution. */
    public Builder outputResolution(String value) {
      this.outputResolution = KlingParamUtils.requireNonBlank(value, "outputResolution");
      return this;
    }

    /** Sets the output aspect ratio. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = KlingParamUtils.requireNonBlank(value, "aspectRatio");
      return this;
    }

    /** Sets whether synchronized sound is enabled. */
    public Builder enableSound(boolean value) {
      this.enableSound = value;
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = KlingParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Builds immutable edit video parameters. */
    public EditVideoParams build() {
      return new EditVideoParams(this);
    }
  }
}
