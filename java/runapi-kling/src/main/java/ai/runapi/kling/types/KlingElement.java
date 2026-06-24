package ai.runapi.kling.types;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Nested request item for typed parameter builders. */
public final class KlingElement {
  private final String name;
  private final String description;
  private final List<String> elementInputUrls;
  private final List<String> elementInputVideoUrls;

  private KlingElement(Builder builder) {
    this.name = KlingParamUtils.requireNonBlank(builder.name, "name");
    this.description = builder.description;
    this.elementInputUrls = KlingParamUtils.strings(builder.elementInputUrls);
    this.elementInputVideoUrls = KlingParamUtils.strings(builder.elementInputVideoUrls);
  }

  /** Creates a new KlingElement builder. */
  public static Builder builder() {
    return new Builder();
  }

  /** Returns the item name. */
  public String getName() {
    return name;
  }

  /** Returns the item description. */
  public String getDescription() {
    return description;
  }

  /** Returns the element input image URLs. */
  public List<String> getElementInputUrls() {
    return elementInputUrls;
  }

  /** Returns the element input video URLs. */
  public List<String> getElementInputVideoUrls() {
    return elementInputVideoUrls;
  }

  Map<String, Object> toMap() {
    Map<String, Object> raw = new LinkedHashMap<String, Object>();
    raw.put("name", KlingParamUtils.wireValue(name));
    raw.put("description", KlingParamUtils.wireValue(description));
    raw.put("element_input_urls", KlingParamUtils.wireValue(elementInputUrls));
    raw.put("element_input_video_urls", KlingParamUtils.wireValue(elementInputVideoUrls));
    return KlingParamUtils.compact(raw);
  }

  /** Builder for {@link KlingElement}. */
  public static final class Builder {
    private String name;
    private String description;
    private List<String> elementInputUrls;
    private List<String> elementInputVideoUrls;

    private Builder() {}

    /** Sets the item name. */
    public Builder name(String value) {
      this.name = KlingParamUtils.requireNonBlank(value, "name");
      return this;
    }

    /** Sets the item description. */
    public Builder description(String value) {
      this.description = KlingParamUtils.requireNonBlank(value, "description");
      return this;
    }

    /** Sets the element input image URLs. */
    public Builder elementInputUrls(List<String> value) {
      this.elementInputUrls = value;
      return this;
    }

    /** Sets the element input video URLs. */
    public Builder elementInputVideoUrls(List<String> value) {
      this.elementInputVideoUrls = value;
      return this;
    }

    /** Builds an immutable KlingElement. */
    public KlingElement build() {
      return new KlingElement(this);
    }
  }
}
