package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for ai avatar operations. */
public final class AiAvatarModel extends KlingValue {
  /** kling-ai-avatar-pro model slug. */
  public static final AiAvatarModel KLING_AI_AVATAR_PRO = new AiAvatarModel("kling-ai-avatar-pro");
  /** kling-ai-avatar-standard model slug. */
  public static final AiAvatarModel KLING_AI_AVATAR_STANDARD = new AiAvatarModel("kling-ai-avatar-standard");
  /** kling-ai-avatar-v1-pro model slug. */
  public static final AiAvatarModel KLING_AI_AVATAR_V1_PRO = new AiAvatarModel("kling-ai-avatar-v1-pro");
  /** kling-v1-avatar-standard model slug. */
  public static final AiAvatarModel KLING_V1_AVATAR_STANDARD = new AiAvatarModel("kling-v1-avatar-standard");

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public AiAvatarModel(String value) {
    super(value);
  }
}
