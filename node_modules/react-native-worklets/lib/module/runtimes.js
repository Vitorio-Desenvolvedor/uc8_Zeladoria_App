'use strict';

import { setupCallGuard } from "./callGuard.js";
import { getMemorySafeCapturableConsole, setupConsole } from "./initializers.js";
import { SHOULD_BE_USE_WEB } from "./PlatformChecker/index.js";
import { makeShareableCloneOnUIRecursive, makeShareableCloneRecursive } from "./shareables.js";
import { isWorkletFunction } from "./workletFunction.js";
import { registerWorkletsError, WorkletsError } from "./WorkletsError.js";
import { WorkletsModule } from "./WorkletsModule/index.js";

/**
 * Lets you create a new JS runtime which can be used to run worklets possibly
 * on different threads than JS or UI thread.
 *
 * @param name - A name used to identify the runtime which will appear in
 *   devices list in Chrome DevTools.
 * @param initializer - An optional worklet that will be run synchronously on
 *   the same thread immediately after the runtime is created.
 * @returns WorkletRuntime which is a
 *   `jsi::HostObject<worklets::WorkletRuntime>` - {@link WorkletRuntime}
 * @see https://docs.swmansion.com/react-native-reanimated/docs/threading/createWorkletRuntime
 */
// @ts-expect-error Check `runOnUI` overload.

export function createWorkletRuntime(name, initializer) {
  const runtimeBoundCapturableConsole = getMemorySafeCapturableConsole();
  return WorkletsModule.createWorkletRuntime(name, makeShareableCloneRecursive(() => {
    'worklet';

    setupCallGuard();
    registerWorkletsError();
    setupConsole(runtimeBoundCapturableConsole);
    initializer?.();
  }));
}

// @ts-expect-error Check `runOnUI` overload.

/** Schedule a worklet to execute on the background queue. */
export function runOnRuntime(workletRuntime, worklet) {
  'worklet';

  if (__DEV__ && !SHOULD_BE_USE_WEB && !isWorkletFunction(worklet)) {
    throw new WorkletsError('The function passed to `runOnRuntime` is not a worklet.');
  }
  if (globalThis._WORKLET) {
    return (...args) => global._scheduleOnRuntime(workletRuntime, makeShareableCloneOnUIRecursive(() => {
      'worklet';

      worklet(...args);
    }));
  }
  return (...args) => WorkletsModule.scheduleOnRuntime(workletRuntime, makeShareableCloneRecursive(() => {
    'worklet';

    worklet(...args);
  }));
}
//# sourceMappingURL=runtimes.js.map