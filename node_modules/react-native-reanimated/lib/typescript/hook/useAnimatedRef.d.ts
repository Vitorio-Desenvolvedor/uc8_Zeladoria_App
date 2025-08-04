import type { Component } from 'react';
import type { AnimatedRef } from './commonTypes';
declare function useAnimatedRefWeb<TComponent extends Component>(): AnimatedRef<TComponent>;
/**
 * Lets you get a reference of a view that you can use inside a worklet.
 *
 * @returns An object with a `.current` property which contains an instance of a
 *   component.
 * @see https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedRef
 */
export declare const useAnimatedRef: typeof useAnimatedRefWeb;
export {};
//# sourceMappingURL=useAnimatedRef.d.ts.map