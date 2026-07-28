package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for image to video operations. */
public final class ImageToVideoModel extends KlingValue {
  /** kling-o1 model slug. */
  public static final ImageToVideoModel KLING_O1 = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_O1);
  /** kling-v2.6 model slug. */
  public static final ImageToVideoModel KLING_V2_6 = new ImageToVideoModel("kling-v2.6");
  /** kling-v3-omni model slug. */
  public static final ImageToVideoModel KLING_V3_OMNI = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_V3_OMNI);
  /** kling-v3-turbo-image-to-video model slug. */
  public static final ImageToVideoModel KLING_V3_TURBO_IMAGE_TO_VIDEO = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_V3_TURBO_IMAGE_TO_VIDEO);
  /** kling-v2.1-master-image-to-video model slug. */
  public static final ImageToVideoModel KLING_V2_1_MASTER_IMAGE_TO_VIDEO = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_V2_1_MASTER_IMAGE_TO_VIDEO);
  /** kling-v2.1-pro model slug. */
  public static final ImageToVideoModel KLING_V2_1_PRO = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_V2_1_PRO);
  /** kling-v2.1-standard model slug. */
  public static final ImageToVideoModel KLING_V2_1_STANDARD = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_V2_1_STANDARD);
  /** kling-v2.5-turbo-image-to-video-pro model slug. */
  public static final ImageToVideoModel KLING_V2_5_TURBO_IMAGE_TO_VIDEO_PRO = new ImageToVideoModel(GeneratedModels.IMAGE_TO_VIDEO_KLING_V2_5_TURBO_IMAGE_TO_VIDEO_PRO);

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public ImageToVideoModel(String value) {
    super(value);
  }
}
