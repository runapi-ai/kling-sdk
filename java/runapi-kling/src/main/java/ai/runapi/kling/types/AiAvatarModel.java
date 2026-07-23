package ai.runapi.kling.types;

import com.fasterxml.jackson.annotation.JsonCreator;

/** Model slug for ai avatar operations. */
public final class AiAvatarModel extends KlingValue {
  /** kling-ai-avatar-pro model slug. */
  public static final AiAvatarModel KLING_AI_AVATAR_PRO = new AiAvatarModel(GeneratedModels.AVATAR_KLING_AI_AVATAR_PRO);
  /** kling-ai-avatar-standard model slug. */
  public static final AiAvatarModel KLING_AI_AVATAR_STANDARD = new AiAvatarModel(GeneratedModels.AVATAR_KLING_AI_AVATAR_STANDARD);
  /** kling-ai-avatar-v1-pro model slug. */
  public static final AiAvatarModel KLING_AI_AVATAR_V1_PRO = new AiAvatarModel(GeneratedModels.AVATAR_KLING_AI_AVATAR_V1_PRO);
  /** kling-v1-avatar-standard model slug. */
  public static final AiAvatarModel KLING_V1_AVATAR_STANDARD = new AiAvatarModel(GeneratedModels.AVATAR_KLING_V1_AVATAR_STANDARD);

  /** Creates a model value from a literal model slug. */
  @JsonCreator
  public AiAvatarModel(String value) {
    super(value);
  }
}
