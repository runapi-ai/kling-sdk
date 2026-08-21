package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for edit video operations. */
public final class EditVideoModel extends KlingValue {
  /** kling-v3-omni-reference model slug. */
  public static final EditVideoModel KLING_V3_OMNI_REFERENCE = new EditVideoModel(GeneratedModels.EDIT_VIDEO_KLING_V3_OMNI_REFERENCE);
  /** kling-v3-omni-edit model slug. */
  public static final EditVideoModel KLING_V3_OMNI_EDIT = new EditVideoModel(GeneratedModels.EDIT_VIDEO_KLING_V3_OMNI_EDIT);

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public EditVideoModel(String value) {
    super(value);
  }
}
