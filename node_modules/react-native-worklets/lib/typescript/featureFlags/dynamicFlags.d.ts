type DynamicFlagsType = {
    EXAMPLE_DYNAMIC_FLAG: boolean;
    init(): void;
    setFlag(name: DynamicFlagName, value: boolean): void;
};
type DynamicFlagName = keyof Omit<Omit<DynamicFlagsType, 'setFlag'>, 'init'>;
/** @knipIgnore */
export declare const DynamicFlags: DynamicFlagsType;
export declare function setDynamicFeatureFlag(name: DynamicFlagName, value: boolean): void;
export {};
//# sourceMappingURL=dynamicFlags.d.ts.map