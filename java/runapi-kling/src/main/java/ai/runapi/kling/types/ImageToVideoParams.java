package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for image to video operations. */
public final class ImageToVideoParams {
  private final String model;
  private final String prompt;
  private final String firstFrameImageUrl;
  private final String callbackUrl;
  private final String mode;
  private final Boolean enableSound;
  private final Integer durationSeconds;
  private final String outputResolution;
  private final String negativePrompt;
  private final Double cfgScale;
  private final String lastFrameImageUrl;
  private final String aspectRatio;
  private final List<String> referenceImageUrls;
  private final String referenceVideoUrl;
  private final String referenceVideoType;
  private final Boolean preserveReferenceVideoAudio;

  private ImageToVideoParams(Builder builder) {
    this.model = KlingParamUtils.requireNonBlankTrim(builder.model, "model");
    this.prompt = KlingParamUtils.requireNonBlank(builder.prompt, "prompt");
    this.firstFrameImageUrl = KlingParamUtils.requireNonBlank(builder.firstFrameImageUrl, "firstFrameImageUrl");
    this.callbackUrl = builder.callbackUrl;
    this.mode = builder.mode;
    this.enableSound = builder.enableSound;
    this.durationSeconds = builder.durationSeconds;
    this.outputResolution = builder.outputResolution;
    this.negativePrompt = builder.negativePrompt;
    this.cfgScale = builder.cfgScale;
    this.lastFrameImageUrl = builder.lastFrameImageUrl;
    this.aspectRatio = builder.aspectRatio;
    this.referenceImageUrls = KlingParamUtils.strings(builder.referenceImageUrls);
    this.referenceVideoUrl = builder.referenceVideoUrl;
    this.referenceVideoType = builder.referenceVideoType;
    this.preserveReferenceVideoAudio = builder.preserveReferenceVideoAudio;
  }

  /** Creates a new ImageToVideoParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "kling/image-to-video";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", KlingParamUtils.wireValue(model));
    raw.put("prompt", KlingParamUtils.wireValue(prompt));
    raw.put("first_frame_image_url", KlingParamUtils.wireValue(firstFrameImageUrl));
    raw.put("callback_url", KlingParamUtils.wireValue(callbackUrl));
    raw.put("mode", KlingParamUtils.wireValue(mode));
    raw.put("enable_sound", KlingParamUtils.wireValue(enableSound));
    raw.put("duration_seconds", KlingParamUtils.wireValue(durationSeconds));
    raw.put("output_resolution", KlingParamUtils.wireValue(outputResolution));
    raw.put("negative_prompt", KlingParamUtils.wireValue(negativePrompt));
    raw.put("cfg_scale", KlingParamUtils.wireValue(cfgScale));
    raw.put("last_frame_image_url", KlingParamUtils.wireValue(lastFrameImageUrl));
    raw.put("aspect_ratio", KlingParamUtils.wireValue(aspectRatio));
    raw.put("reference_image_urls", KlingParamUtils.wireValue(referenceImageUrls));
    raw.put("reference_video_url", KlingParamUtils.wireValue(referenceVideoUrl));
    raw.put("reference_video_type", KlingParamUtils.wireValue(referenceVideoType));
    raw.put("preserve_reference_video_audio", KlingParamUtils.wireValue(preserveReferenceVideoAudio));
    return KlingParamUtils.compact(raw);
  }



  /** Builder for {@link ImageToVideoParams}. */
  public static final class Builder {
    private String model;
    private String prompt;
    private String firstFrameImageUrl;
    private String callbackUrl;
    private String mode;
    private Boolean enableSound;
    private Integer durationSeconds;
    private String outputResolution;
    private String negativePrompt;
    private Double cfgScale;
    private String lastFrameImageUrl;
    private String aspectRatio;
    private List<String> referenceImageUrls;
    private String referenceVideoUrl;
    private String referenceVideoType;
    private Boolean preserveReferenceVideoAudio;

    private Builder() {}

    /** Sets the model slug using a typed model value. */
    public Builder model(ImageToVideoModel value) {
      this.model = java.util.Objects.requireNonNull(value, "model").value();
      return this;
    }

    /** Sets the model slug using a string value. */
    public Builder model(String value) {
      this.model = KlingParamUtils.requireNonBlankTrim(value, "model");
      return this;
    }


    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = KlingParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the first frame image URL. */
    public Builder firstFrameImageUrl(String value) {
      this.firstFrameImageUrl = KlingParamUtils.requireNonBlank(value, "firstFrameImageUrl");
      return this;
    }

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = KlingParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Sets the generation mode (std or pro) for supported models. */
    public Builder mode(String value) {
      this.mode = KlingParamUtils.requireNonBlank(value, "mode");
      return this;
    }

    /** Sets whether the selected model generates synchronized sound. */
    public Builder enableSound(boolean value) {
      this.enableSound = value;
      return this;
    }

    /** Sets the duration in seconds. */
    public Builder durationSeconds(int value) {
      this.durationSeconds = value;
      return this;
    }

    /** Sets the output resolution. */
    public Builder outputResolution(String value) {
      this.outputResolution = KlingParamUtils.requireNonBlank(value, "outputResolution");
      return this;
    }

    /** Sets the negative prompt describing what to avoid. */
    public Builder negativePrompt(String value) {
      this.negativePrompt = KlingParamUtils.requireNonBlank(value, "negativePrompt");
      return this;
    }

    /** Sets the cfg scale. */
    public Builder cfgScale(double value) {
      this.cfgScale = value;
      return this;
    }

    /** Sets the last frame image URL. Kling O1 cannot combine it with reference image or video fields. */
    public Builder lastFrameImageUrl(String value) {
      this.lastFrameImageUrl = KlingParamUtils.requireNonBlank(value, "lastFrameImageUrl");
      return this;
    }

    /** Sets the output aspect ratio. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = KlingParamUtils.requireNonBlank(value, "aspectRatio");
      return this;
    }

    /** Sets the ordered reference image URLs. Kling O1 cannot combine them with a last frame. */
    public Builder referenceImageUrls(List<String> value) {
      this.referenceImageUrls = value;
      return this;
    }

    /** Sets the reference video URL. Kling O1 cannot combine it with a last frame. */
    public Builder referenceVideoUrl(String value) {
      this.referenceVideoUrl = KlingParamUtils.requireNonBlank(value, "referenceVideoUrl");
      return this;
    }

    /** Sets whether the reference video is a base edit or feature reference. */
    public Builder referenceVideoType(String value) {
      this.referenceVideoType = KlingParamUtils.requireNonBlank(value, "referenceVideoType");
      return this;
    }

    /** Sets whether to preserve the reference video's original audio. */
    public Builder preserveReferenceVideoAudio(boolean value) {
      this.preserveReferenceVideoAudio = value;
      return this;
    }

    /** Builds immutable image to video parameters. */
    public ImageToVideoParams build() {
      return new ImageToVideoParams(this);
    }
  }
}
