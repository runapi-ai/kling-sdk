package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for image to video operations. */
public final class ImageToVideoModel extends KlingValue {
  /** kling-v3-turbo-image-to-video model slug. */
  public static final ImageToVideoModel KLING_V3_TURBO_IMAGE_TO_VIDEO = new ImageToVideoModel("kling-v3-turbo-image-to-video");
  /** kling-v2.1-master-image-to-video model slug. */
  public static final ImageToVideoModel KLING_V2_1_MASTER_IMAGE_TO_VIDEO = new ImageToVideoModel("kling-v2.1-master-image-to-video");
  /** kling-v2.1-pro model slug. */
  public static final ImageToVideoModel KLING_V2_1_PRO = new ImageToVideoModel("kling-v2.1-pro");
  /** kling-v2.1-standard model slug. */
  public static final ImageToVideoModel KLING_V2_1_STANDARD = new ImageToVideoModel("kling-v2.1-standard");
  /** kling-v2.5-turbo-image-to-video-pro model slug. */
  public static final ImageToVideoModel KLING_V2_5_TURBO_IMAGE_TO_VIDEO_PRO = new ImageToVideoModel("kling-v2.5-turbo-image-to-video-pro");

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public ImageToVideoModel(String value) {
    super(value);
  }
}
