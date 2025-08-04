'use strict';

import { logger } from "../logger.js";
import { WorkletsModule } from "../WorkletsModule/index.js";
/** @knipIgnore */
export const DynamicFlags = {
  EXAMPLE_DYNAMIC_FLAG: true,
  init() {
    Object.keys(DynamicFlags).forEach(key => {
      if (key !== 'init' && key !== 'setFlag') {
        WorkletsModule.setDynamicFeatureFlag(key, DynamicFlags[key]);
      }
    });
  },
  setFlag(name, value) {
    if (name in DynamicFlags) {
      DynamicFlags[name] = value;
      WorkletsModule.setDynamicFeatureFlag(name, value);
    } else {
      logger.warn(`The feature flag: '${name}' no longer exists, you can safely remove invocation of \`setDynamicFeatureFlag('${name}')\` from your code.`);
    }
  }
};
DynamicFlags.init();

// Public API function to update a feature flag
export function setDynamicFeatureFlag(name, value) {
  DynamicFlags.setFlag(name, value);
}
//# sourceMappingURL=dynamicFlags.js.map