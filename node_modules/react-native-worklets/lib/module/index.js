'use strict';

import "./publicGlobals.js";
import { init } from "./initializers.js";
import { bundleModeInit } from "./workletRuntimeEntry.js";
init();
export { setDynamicFeatureFlag } from "./featureFlags/dynamicFlags.js";
export { createWorkletRuntime, runOnRuntime } from "./runtimes.js";
export { shareableMappingCache } from "./shareableMappingCache.js";
export { makeShareable, makeShareableCloneOnUIRecursive, makeShareableCloneRecursive } from "./shareables.js";
export { callMicrotasks, executeOnUIRuntimeSync, runOnJS, runOnUI, runOnUIAsync } from "./threads.js";
export { isWorkletFunction } from "./workletFunction.js";
export { WorkletsModule } from "./WorkletsModule/index.js";
// @ts-expect-error We must trick the bundler to include
// the `workletRuntimeEntry` file the way it cannot optimize it out.
if (globalThis._ALWAYS_FALSE) {
  // Bundle mode.
  bundleModeInit();
}
//# sourceMappingURL=index.js.map