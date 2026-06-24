package ai.runapi.kling.types;

import ai.runapi.core.types.RunApiValue;

abstract class KlingValue extends RunApiValue {
  KlingValue(String value) {
    super(value);
  }
}
