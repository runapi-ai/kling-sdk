package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for text to video operations. */
public final class TextToVideoModel extends KlingValue {
  /** kling-3.0 model slug. */
  public static final TextToVideoModel KLING_3_0 = new TextToVideoModel("kling-3.0");
  /** kling-v3-turbo-text-to-video model slug. */
  public static final TextToVideoModel KLING_V3_TURBO_TEXT_TO_VIDEO = new TextToVideoModel("kling-v3-turbo-text-to-video");
  /** kling-v2.1-master-text-to-video model slug. */
  public static final TextToVideoModel KLING_V2_1_MASTER_TEXT_TO_VIDEO = new TextToVideoModel("kling-v2.1-master-text-to-video");
  /** kling-v2.5-turbo-text-to-video-pro model slug. */
  public static final TextToVideoModel KLING_V2_5_TURBO_TEXT_TO_VIDEO_PRO = new TextToVideoModel("kling-v2.5-turbo-text-to-video-pro");

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public TextToVideoModel(String value) {
    super(value);
  }
}
