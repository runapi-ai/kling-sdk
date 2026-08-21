package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for text to video operations. */
public final class TextToVideoModel extends KlingValue {
  /** kling-3.0 model slug. */
  public static final TextToVideoModel KLING_3_0 = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_3_0);
  /** kling-o1 model slug. */
  public static final TextToVideoModel KLING_O1 = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_O1);
  /** kling-v2.6 model slug. */
  public static final TextToVideoModel KLING_V2_6 = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_V2_6);
  /** kling-v3-omni model slug. */
  public static final TextToVideoModel KLING_V3_OMNI = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_V3_OMNI);
  /** kling-v3-omni-reference model slug. */
  public static final TextToVideoModel KLING_V3_OMNI_REFERENCE = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_V3_OMNI_REFERENCE);
  /** kling-v3-turbo-text-to-video model slug. */
  public static final TextToVideoModel KLING_V3_TURBO_TEXT_TO_VIDEO = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_V3_TURBO_TEXT_TO_VIDEO);
  /** kling-v2.1-master-text-to-video model slug. */
  public static final TextToVideoModel KLING_V2_1_MASTER_TEXT_TO_VIDEO = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_V2_1_MASTER_TEXT_TO_VIDEO);
  /** kling-v2.5-turbo-text-to-video-pro model slug. */
  public static final TextToVideoModel KLING_V2_5_TURBO_TEXT_TO_VIDEO_PRO = new TextToVideoModel(GeneratedModels.TEXT_TO_VIDEO_KLING_V2_5_TURBO_TEXT_TO_VIDEO_PRO);

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public TextToVideoModel(String value) {
    super(value);
  }
}
