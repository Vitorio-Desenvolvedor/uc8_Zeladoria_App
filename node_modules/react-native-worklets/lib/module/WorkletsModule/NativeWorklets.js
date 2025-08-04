'use strict';

import { WorkletsTurboModule } from "../specs/index.js";
import { checkCppVersion } from "../utils/checkCppVersion.js";
import { jsVersion } from "../utils/jsVersion.js";
import { WorkletsError } from "../WorkletsError.js";
export function createNativeWorkletsModule() {
  return new NativeWorklets();
}
class NativeWorklets {
  #workletsModuleProxy;
  #shareableUndefined;
  #shareableNull;
  #shareableTrue;
  #shareableFalse;
  constructor() {
    globalThis._WORKLETS_VERSION_JS = jsVersion;
    if (global.__workletsModuleProxy === undefined && !globalThis._WORKLET) {
      WorkletsTurboModule?.installTurboModule();
    }
    if (global.__workletsModuleProxy === undefined) {
      throw new WorkletsError(`Native part of Worklets doesn't seem to be initialized.
See https://docs.swmansion.com/react-native-worklets/docs/guides/troubleshooting#native-part-of-worklets-doesnt-seem-to-be-initialized for more details.`);
    }
    if (__DEV__) {
      checkCppVersion();
    }
    this.#workletsModuleProxy = global.__workletsModuleProxy;
    this.#shareableNull = this.#workletsModuleProxy.makeShareableNull();
    this.#shareableUndefined = this.#workletsModuleProxy.makeShareableUndefined();
    this.#shareableTrue = this.#workletsModuleProxy.makeShareableBoolean(true);
    this.#shareableFalse = this.#workletsModuleProxy.makeShareableBoolean(false);
  }
  makeShareableClone(value, shouldPersistRemote, nativeStateSource) {
    return this.#workletsModuleProxy.makeShareableClone(value, shouldPersistRemote, nativeStateSource);
  }
  makeShareableImport(from, to) {
    return this.#workletsModuleProxy.makeShareableImport(from, to);
  }
  makeShareableString(str) {
    return this.#workletsModuleProxy.makeShareableString(str);
  }
  makeShareableNumber(num) {
    return this.#workletsModuleProxy.makeShareableNumber(num);
  }
  makeShareableBoolean(bool) {
    return bool ? this.#shareableTrue : this.#shareableFalse;
  }
  makeShareableBigInt(bigInt) {
    return this.#workletsModuleProxy.makeShareableBigInt(bigInt);
  }
  makeShareableUndefined() {
    return this.#shareableUndefined;
  }
  makeShareableNull() {
    return this.#shareableNull;
  }
  makeShareableTurboModuleLike(props, proto) {
    return this.#workletsModuleProxy.makeShareableTurboModuleLike(props, proto);
  }
  makeShareableObject(obj, shouldRetainRemote, nativeStateSource) {
    return this.#workletsModuleProxy.makeShareableObject(obj, shouldRetainRemote, nativeStateSource);
  }
  makeShareableHostObject(obj) {
    return this.#workletsModuleProxy.makeShareableHostObject(obj);
  }
  makeShareableArray(array, shouldRetainRemote) {
    return this.#workletsModuleProxy.makeShareableArray(array, shouldRetainRemote);
  }
  makeShareableMap(keys, values) {
    return this.#workletsModuleProxy.makeShareableMap(keys, values);
  }
  makeShareableSet(values) {
    return this.#workletsModuleProxy.makeShareableSet(values);
  }
  makeShareableInitializer(obj) {
    return this.#workletsModuleProxy.makeShareableInitializer(obj);
  }
  makeShareableFunction(func) {
    return this.#workletsModuleProxy.makeShareableFunction(func);
  }
  makeShareableWorklet(worklet, shouldPersistRemote) {
    return this.#workletsModuleProxy.makeShareableWorklet(worklet, shouldPersistRemote);
  }
  scheduleOnUI(shareable) {
    return this.#workletsModuleProxy.scheduleOnUI(shareable);
  }
  executeOnUIRuntimeSync(shareable) {
    return this.#workletsModuleProxy.executeOnUIRuntimeSync(shareable);
  }
  createWorkletRuntime(name, initializer) {
    return this.#workletsModuleProxy.createWorkletRuntime(name, initializer);
  }
  scheduleOnRuntime(workletRuntime, shareableWorklet) {
    return this.#workletsModuleProxy.scheduleOnRuntime(workletRuntime, shareableWorklet);
  }
  reportFatalErrorOnJS(message, stack, name, jsEngine) {
    return this.#workletsModuleProxy.reportFatalErrorOnJS(message, stack, name, jsEngine);
  }
  setDynamicFeatureFlag(name, value) {
    this.#workletsModuleProxy.setDynamicFeatureFlag(name, value);
  }
}
//# sourceMappingURL=NativeWorklets.js.map