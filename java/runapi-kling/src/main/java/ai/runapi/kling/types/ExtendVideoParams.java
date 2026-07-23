package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.Map;

/** Parameters for continuing a completed Kling V2.5 Turbo video. */
public final class ExtendVideoParams {
  private final String sourceTaskId;
  private final String mode;
  private final String prompt;
  private final String callbackUrl;

  private ExtendVideoParams(Builder builder) {
    this.sourceTaskId = KlingParamUtils.requireNonBlank(builder.sourceTaskId, "sourceTaskId");
    this.mode = builder.mode;
    this.prompt = builder.prompt;
    this.callbackUrl = builder.callbackUrl;
  }

  public static Builder builder() {
    return new Builder();
  }

  public String action() {
    return "kling/extend-video";
  }

  public Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("source_task_id", sourceTaskId);
    raw.put("mode", mode);
    raw.put("prompt", prompt);
    raw.put("callback_url", callbackUrl);
    return KlingParamUtils.compact(raw);
  }

  public static final class Builder {
    private String sourceTaskId;
    private String mode;
    private String prompt;
    private String callbackUrl;

    private Builder() {}

    public Builder sourceTaskId(String value) {
      this.sourceTaskId = KlingParamUtils.requireNonBlank(value, "sourceTaskId");
      return this;
    }

    public Builder mode(String value) {
      if (value != null && !"std".equals(value) && !"pro".equals(value)) {
        throw new IllegalArgumentException("mode must be std or pro");
      }
      this.mode = value;
      return this;
    }

    public Builder prompt(String value) {
      this.prompt = KlingParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    public Builder callbackUrl(String value) {
      this.callbackUrl = KlingParamUtils.requireNonBlank(value, "callbackUrl");
      return this;
    }

    public ExtendVideoParams build() {
      return new ExtendVideoParams(this);
    }
  }
}
