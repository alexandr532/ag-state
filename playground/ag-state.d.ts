declare module "src/AG_Type" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-17
     */
    export type AG_Leaf = string | number | boolean | null | undefined;
}
declare module "src/utils/Cyrb53" {
    /**
     * cyrb53 (c) 2018 bryc (github.com/bryc)
     *
     * A fast and simple hash function with decent collision resistance.
     * Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
     * Public domain. Attribution appreciated.
     * ---
     * @param str String to transform in to 53 bit hash.
     * @param seed Any number to change output hash result for the same string.
     * @returns 53 bit hash number.
     *
     * @example
     * "501c2ba782c97901" = cyrb53("a");
     * "459eda5bc254d2bf" = cyrb53("b");
     * "fbce64cc3b748385" = cyrb53("revenge");
     * "fb1d85148d13f93a" = cyrb53("revenue");
     * "76fee5e6598ccd5c" = cyrb53("revenue", 1);
     * "1f672e2831253862" = cyrb53("revenue", 2);
     * "2b10de31708e6ab7" = cyrb53("revenue", 3);
     */
    export function cyrb53(str: string, seed?: number): number;
}
declare module "src/utils/JSON" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-16
     */
    /**
     * Replacer function used with JSON.stringify to convert Maps and Sets to
     * objects with data type and array value before stringification
     *
     * @example JSON.stringify(obj, replacer);
     */
    export function replacer(key: string, value: any): any;
    /**
     * Reviver function used with JSON.parse to convert strings with data typed
     * objects, that were stringified using replacer function, back to Maps and Sets.
     *
     * @example JSON.parse(str, reviver);
     */
    export function reviver(key: string, value: any): any;
}
declare module "src/utils/Tree" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-17
     */
    export function isATreeLeaf(item: any): boolean;
}
declare module "src/systems/AG_UpdateOne" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-17
     */
    import { AG_ChainTree } from "src/AG_ChainTree";
    export function updateOneSystem(this: AG_ChainTree, key: string | number, value: any): void;
}
declare module "src/systems/AG_Update" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-17
     */
    import { AG_ChainTree } from "src/AG_ChainTree";
    export function updateSystem(this: AG_ChainTree, state: any, hash?: number): number;
}
declare module "src/AG_ChainTree" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-17
     */
    import { AG_Leaf } from "src/AG_Type";
    export class AG_ChainTree {
        _ag_data: Map<string | number, {
            hash?: number | undefined;
            value: AG_ChainTree | AG_Leaf;
        }>;
        _ag_hash: number | undefined;
        constructor(state?: any);
        _ag_update: (state: any, hash?: number | undefined) => number;
    }
}
declare module "src/AG_State" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-16
     */
    import { AG_ChainTree } from "src/AG_ChainTree";
    export default class AG_State extends AG_ChainTree {
        private static _instance;
        static instance(id: any, state?: object): AG_State;
        protected constructor(state?: object);
    }
}
declare module "index" {
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-16
     */
    import AG_State from "src/AG_State";
    export const _State: typeof AG_State;
    export const State: AG_State;
}
//# sourceMappingURL=ag-state.d.ts.map