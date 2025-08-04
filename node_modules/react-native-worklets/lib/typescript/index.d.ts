import './publicGlobals';
export { setDynamicFeatureFlag } from './featureFlags/dynamicFlags';
export { createWorkletRuntime, runOnRuntime } from './runtimes';
export { shareableMappingCache } from './shareableMappingCache';
export type { MakeShareableClone } from './shareables';
export { makeShareable, makeShareableCloneOnUIRecursive, makeShareableCloneRecursive, } from './shareables';
export { callMicrotasks, executeOnUIRuntimeSync, runOnJS, runOnUI, runOnUIAsync, } from './threads';
export { isWorkletFunction } from './workletFunction';
export type { IWorkletsModule, WorkletsModuleProxy } from './WorkletsModule';
export { WorkletsModule } from './WorkletsModule';
export type { ShareableRef, WorkletFunction, WorkletRuntime, WorkletStackDetails, } from './workletTypes';
//# sourceMappingURL=index.d.ts.map