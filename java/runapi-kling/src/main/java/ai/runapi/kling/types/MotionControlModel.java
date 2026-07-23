package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for motion control operations. */
public final class MotionControlModel extends KlingValue {
  /** kling-3.0 model slug. */
  public static final MotionControlModel KLING_3_0 = new MotionControlModel(GeneratedModels.MOTION_CONTROL_KLING_3_0);

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public MotionControlModel(String value) {
    super(value);
  }
}
