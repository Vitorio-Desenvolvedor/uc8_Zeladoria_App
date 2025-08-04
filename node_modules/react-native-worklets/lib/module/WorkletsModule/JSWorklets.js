'use strict';

import { IS_JEST } from "../PlatformChecker/index.js";
import { mockedRequestAnimationFrame } from "../runLoop/mockedRequestAnimationFrame.js";
import { WorkletsError } from "../WorkletsError.js";
export function createJSWorkletsModule() {
  return new JSWorklets();
}

// In Node.js environments (like when static rendering with Expo Router)
// requestAnimationFrame is unavailable, so we use our mock.
// It also has to be mocked for Jest purposes (see `initializeUIRuntime`).
const requestAnimationFrameImpl = IS_JEST || !globalThis.requestAnimationFrame ? mockedRequestAnimationFrame : globalThis.requestAnimationFrame;
class JSWorklets {
  makeShareableClone() {
    throw new WorkletsError('makeShareableClone should never be called in JSWorklets.');
  }
  makeShareableString() {
    throw new WorkletsError('makeShareableString should never be called in JSWorklets.');
  }
  makeShareableNumber() {
    throw new WorkletsError('makeShareableNumber should never be called in JSWorklets.');
  }
  makeShareableBoolean() {
    throw new WorkletsError('makeShareableBoolean should never be called in JSWorklets.');
  }
  makeShareableBigInt() {
    throw new WorkletsError('makeShareableBigInt should never be called in JSWorklets.');
  }
  makeShareableUndefined() {
    throw new WorkletsError('makeShareableUndefined should never be called in JSWorklets.');
  }
  makeShareableNull() {
    throw new WorkletsError('makeShareableNull should never be called in JSWorklets.');
  }
  makeShareableTurboModuleLike() {
    throw new WorkletsError('makeShareableTurboModuleLike should never be called in JSWorklets.');
  }
  makeShareableObject() {
    throw new WorkletsError('makeShareableObject should never be called in JSWorklets.');
  }
  makeShareableMap() {
    throw new WorkletsError('makeShareableMap should never be called in JSWorklets.');
  }
  makeShareableSet() {
    throw new WorkletsError('makeShareableSet should never be called in JSWorklets.');
  }
  makeShareableImport() {
    throw new WorkletsError('makeShareableImport should never be called in JSWorklets.');
  }
  makeShareableHostObject() {
    throw new WorkletsError('makeShareableHostObject should never be called in JSWorklets.');
  }
  makeShareableArray() {
    throw new WorkletsError('makeShareableArray should never be called in JSWorklets.');
  }
  makeShareableInitializer() {
    throw new WorkletsError('makeShareableInitializer should never be called in JSWorklets.');
  }
  makeShareableFunction(_func) {
    throw new WorkletsError('makeShareableRemoteFunction should never be called in JSWorklets.');
  }
  makeShareableWorklet() {
    throw new WorkletsError('makeShareableWorklet should never be called in JSWorklets.');
  }
  scheduleOnUI(worklet) {
    // TODO: `requestAnimationFrame` should be used exclusively in Reanimated

    // @ts-ignore web implementation has still not been updated after the rewrite,
    // this will be addressed once the web implementation updates are ready
    requestAnimationFrameImpl(worklet);
  }
  executeOnUIRuntimeSync(_shareable) {
    throw new WorkletsError('`executeOnUIRuntimeSync` is not available in JSWorklets.');
  }
  createWorkletRuntime(_name, _initializer) {
    throw new WorkletsError('createWorkletRuntime is not available in JSWorklets.');
  }
  scheduleOnRuntime() {
    throw new WorkletsError('scheduleOnRuntime is not available in JSWorklets.');
  }
  reportFatalErrorOnJS() {
    throw new WorkletsError('reportFatalErrorOnJS should never be called in JSWorklets.');
  }
  setDynamicFeatureFlag(_name, _value) {
    // noop
  }
}
//# sourceMappingURL=JSWorklets.js.map