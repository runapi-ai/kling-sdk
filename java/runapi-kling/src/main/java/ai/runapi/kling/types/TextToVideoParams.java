package ai.runapi.kling.types;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Parameters for text to video operations. */
public final class TextToVideoParams {
  private final String model;
  private final String prompt;
  private final String callbackUrl;
  private final Boolean enableSound;
  private final Integer durationSeconds;
  private final String aspectRatio;
  private final String outputResolution;
  private final String negativePrompt;
  private final Double cfgScale;
  private final Boolean multiShots;
  private final List<MultiPromptItem> multiPrompt;
  private final String firstFrameImageUrl;
  private final String lastFrameImageUrl;
  private final List<KlingElement> klingElements;

  private TextToVideoParams(Builder builder) {
    this.model = KlingParamUtils.requireNonBlankTrim(builder.model, "model");
    this.prompt = builder.prompt;
    this.callbackUrl = builder.callbackUrl;
    this.enableSound = builder.enableSound;
    this.durationSeconds = builder.durationSeconds;
    this.aspectRatio = builder.aspectRatio;
    this.outputResolution = builder.outputResolution;
    this.negativePrompt = builder.negativePrompt;
    this.cfgScale = builder.cfgScale;
    this.multiShots = builder.multiShots;
    this.multiPrompt = KlingParamUtils.list(builder.multiPrompt, "multiPrompt");
    this.firstFrameImageUrl = builder.firstFrameImageUrl;
    this.lastFrameImageUrl = builder.lastFrameImageUrl;
    this.klingElements = KlingParamUtils.list(builder.klingElements, "klingElements");
  }

  /** Creates a new TextToVideoParams builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the RunAPI action key for this request. */
  public String action() {
    return "kling/text-to-video";
  }

  /** Converts these parameters to the JSON request body shape. */
  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("model", KlingParamUtils.wireValue(model));
    raw.put("prompt", KlingParamUtils.wireValue(prompt));
    raw.put("callback_url", KlingParamUtils.wireValue(callbackUrl));
    raw.put("enable_sound", KlingParamUtils.wireValue(enableSound));
    raw.put("duration_seconds", KlingParamUtils.wireValue(durationSeconds));
    raw.put("aspect_ratio", KlingParamUtils.wireValue(aspectRatio));
    raw.put("output_resolution", KlingParamUtils.wireValue(outputResolution));
    raw.put("negative_prompt", KlingParamUtils.wireValue(negativePrompt));
    raw.put("cfg_scale", KlingParamUtils.wireValue(cfgScale));
    raw.put("multi_shots", KlingParamUtils.wireValue(multiShots));
    raw.put("multi_prompt", multiPromptToMaps(multiPrompt));
    raw.put("first_frame_image_url", KlingParamUtils.wireValue(firstFrameImageUrl));
    raw.put("last_frame_image_url", KlingParamUtils.wireValue(lastFrameImageUrl));
    raw.put("kling_elements", klingElementsToMaps(klingElements));
    return KlingParamUtils.compact(raw);
  }

  private static List<Map<String, Object>> multiPromptToMaps(List<MultiPromptItem> values) {
    if (values == null) {
      return null;
    }
    List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
    for (MultiPromptItem item : values) {
      result.add(item.toMap());
    }
    return java.util.Collections.unmodifiableList(result);
  }

  private static List<Map<String, Object>> klingElementsToMaps(List<KlingElement> values) {
    if (values == null) {
      return null;
    }
    List<Map<String, Object>> result = new ArrayList<Map<String, Object>>();
    for (KlingElement item : values) {
      result.add(item.toMap());
    }
    return java.util.Collections.unmodifiableList(result);
  }

  /** Builder for {@link TextToVideoParams}. */
  public static final class Builder {
    private String model;
    private String prompt;
    private String callbackUrl;
    private Boolean enableSound;
    private Integer durationSeconds;
    private String aspectRatio;
    private String outputResolution;
    private String negativePrompt;
    private Double cfgScale;
    private Boolean multiShots;
    private List<MultiPromptItem> multiPrompt;
    private String firstFrameImageUrl;
    private String lastFrameImageUrl;
    private List<KlingElement> klingElements;

    private Builder() {}

    /** Sets the model slug using a typed model value. */
    public Builder model(TextToVideoModel value) {
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

    /** Sets the webhook URL for task completion notifications. */
    public Builder callbackUrl(String value) {
      this.callbackUrl = KlingParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    /** Sets the enable sound. */
    public Builder enableSound(boolean value) {
      this.enableSound = value;
      return this;
    }

    /** Sets the duration in seconds. */
    public Builder durationSeconds(int value) {
      this.durationSeconds = value;
      return this;
    }

    /** Sets the output aspect ratio. */
    public Builder aspectRatio(String value) {
      this.aspectRatio = KlingParamUtils.requireNonBlank(value, "aspectRatio");
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

    /** Sets the multi-shot mode toggle. */
    public Builder multiShots(boolean value) {
      this.multiShots = value;
      return this;
    }

    /** Sets the multi prompt. */
    public Builder multiPrompt(List<MultiPromptItem> value) {
      this.multiPrompt = value;
      return this;
    }

    /** Sets the first frame image URL. */
    public Builder firstFrameImageUrl(String value) {
      this.firstFrameImageUrl = KlingParamUtils.requireNonBlank(value, "firstFrameImageUrl");
      return this;
    }

    /** Sets the last frame image URL. */
    public Builder lastFrameImageUrl(String value) {
      this.lastFrameImageUrl = KlingParamUtils.requireNonBlank(value, "lastFrameImageUrl");
      return this;
    }

    /** Sets the kling elements. */
    public Builder klingElements(List<KlingElement> value) {
      this.klingElements = value;
      return this;
    }

    /** Builds immutable text to video parameters. */
    public TextToVideoParams build() {
      return new TextToVideoParams(this);
    }
  }
}
