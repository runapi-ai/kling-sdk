package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Nested request item for typed parameter builders. */
public final class MultiPromptItem {
  private final String prompt;
  private final Integer durationSeconds;

  private MultiPromptItem(Builder builder) {
    this.prompt = KlingParamUtils.requireNonBlank(builder.prompt, "prompt");
    this.durationSeconds = java.util.Objects.requireNonNull(builder.durationSeconds, "durationSeconds");
  }

  /** Creates a new MultiPromptItem builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the text prompt. */
  public String getPrompt() {
    return prompt;
  }

  /** Returns the duration in seconds. */
  public Integer getDurationSeconds() {
    return durationSeconds;
  }

  Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("prompt", KlingParamUtils.wireValue(prompt));
    raw.put("duration_seconds", KlingParamUtils.wireValue(durationSeconds));
    return KlingParamUtils.compact(raw);
  }

  /** Builder for {@link MultiPromptItem}. */
  public static final class Builder {
    private String prompt;
    private Integer durationSeconds;

    private Builder() {}

    /** Sets the text prompt. */
    public Builder prompt(String value) {
      this.prompt = KlingParamUtils.requireNonBlank(value, "prompt");
      return this;
    }

    /** Sets the duration in seconds. */
    public Builder durationSeconds(int value) {
      this.durationSeconds = value;
      return this;
    }

    /** Builds an immutable MultiPromptItem. */
    public MultiPromptItem build() {
      return new MultiPromptItem(this);
    }
  }
}
