var AG = (function () {
    var defines = {};
    var entry = [null];
    function define(name, dependencies, factory) {
        defines[name] = { dependencies: dependencies, factory: factory };
        entry[0] = name;
    }
    define("require", ["exports"], function (exports) {
        Object.defineProperty(exports, "__cjsModule", { value: true });
        Object.defineProperty(exports, "default", { value: function (name) { return resolve(name); } });
    });
    var __extends = (this && this.__extends) || (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            if (typeof b !== "function" && b !== null)
                throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    var __importDefault = (this && this.__importDefault) || function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };
    define("src/AG_Type", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
    });
    define("src/utils/Cyrb53", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.cyrb53 = void 0;
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
        function cyrb53(str, seed) {
            if (seed === void 0) { seed = 0; }
            var h1 = 0xdeadbeef ^ seed;
            var h2 = 0x41c6ce57 ^ seed;
            for (var i = 0, ch = void 0; i < str.length; i++) {
                ch = str.charCodeAt(i);
                h1 = Math.imul(h1 ^ ch, 2654435761);
                h2 = Math.imul(h2 ^ ch, 1597334677);
            }
            h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
            h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
            return (4294967296 * (2097151 & h2) + (h1 >>> 0));
        }
        exports.cyrb53 = cyrb53;
    });
    // String.hashCode taken from Java dates back to 1981 from Gosling Emacs is
    // extremely weak, and makes zero sense performance-wise in modern JavaScript.
    // Implementations could be significantly faster by using ES6 Math.imul.
    //
    // A simple but high quality 53-bit hash. It's quite fast, provides good hash
    // description, and because it outputs 53 bits, has significantly lower collision
    // rates compared to any 32-bit hash.
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-16
     */
    define("src/utils/JSON", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.reviver = exports.replacer = void 0;
        /**
         * Replacer function used with JSON.stringify to convert Maps and Sets to
         * objects with data type and array value before stringification
         *
         * @example JSON.stringify(obj, replacer);
         */
        function replacer(key, value) {
            if (value instanceof Map) {
                return {
                    _Data_Type: "Map",
                    value: Array.from(value.entries())
                };
            }
            if (value instanceof Set) {
                return {
                    _Data_Type: "Set",
                    value: Array.from(value)
                };
            }
            return value;
        }
        exports.replacer = replacer;
        /**
         * Reviver function used with JSON.parse to convert strings with data typed
         * objects, that were stringified using replacer function, back to Maps and Sets.
         *
         * @example JSON.parse(str, reviver);
         */
        function reviver(key, value) {
            if (!value.hasOwnProperty('_Data_Type')) {
                return value;
            }
            if (value._Data_Type === 'Map') {
                return new Map(value.value);
            }
            if (value._Data_Type === 'Set') {
                return new Set(value.value);
            }
            return value;
        }
        exports.reviver = reviver;
    });
    /**
     * Copyright (c) Alexandr <alexandr532@proton.me>.
     *
     * This source code is licensed under the MIT license found in the
     * LICENSE file in the root directory of this source tree
     *
     * @AG_State 2022-08-17
     */
    define("src/utils/Tree", ["require", "exports"], function (require, exports) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.isATreeLeaf = void 0;
        function isATreeLeaf(item) {
            return Array.isArray(item) || item instanceof Set || item instanceof Map
                || item != null && typeof item === 'object';
        }
        exports.isATreeLeaf = isATreeLeaf;
    });
    define("src/systems/AG_UpdateOne", ["require", "exports", "src/AG_ChainTree", "src/utils/Tree", "src/utils/Cyrb53", "src/utils/JSON"], function (require, exports, AG_ChainTree_1, Tree_1, Cyrb53_1, JSON_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.updateOneSystem = void 0;
        function updateOneSystem(key, value) {
            var data = this._ag_data.get(key);
            if (data == null) {
                if ((0, Tree_1.isATreeLeaf)(value)) {
                    this._ag_data.set(key, { value: value });
                    return;
                }
                var tree = new AG_ChainTree_1.AG_ChainTree();
                this._ag_data.set(key, {
                    hash: tree._ag_update(value),
                    value: tree
                });
                return;
            }
            if (data.value instanceof AG_ChainTree_1.AG_ChainTree) {
                var stateString = JSON.stringify(value, JSON_1.replacer);
                var hash = (0, Cyrb53_1.cyrb53)(stateString);
                if (data.hash === hash) {
                    return;
                }
                data.hash = data.value._ag_update(value, hash);
            }
        }
        exports.updateOneSystem = updateOneSystem;
    });
    define("src/systems/AG_Update", ["require", "exports", "src/utils/Cyrb53", "src/utils/JSON", "src/systems/AG_UpdateOne"], function (require, exports, Cyrb53_2, JSON_2, AG_UpdateOne_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.updateSystem = void 0;
        function updateSystem(state, hash) {
            var _this = this;
            hash = hash == null ? (0, Cyrb53_2.cyrb53)(JSON.stringify(state, JSON_2.replacer)) : hash;
            if (hash === this._ag_hash) {
                return hash;
            }
            var existingKeys = new Set();
            if (Array.isArray(state)) {
                for (var i = 0; i < state.length; i++) {
                    existingKeys.add(i);
                    AG_UpdateOne_1.updateOneSystem.bind(this, i, state);
                }
            }
            else {
                for (var key in state) {
                    if (!state.hasOwnProperty(key)) {
                        continue;
                    }
                    existingKeys.add(key);
                    AG_UpdateOne_1.updateOneSystem.bind(this, key, state[key]);
                }
            }
            var keys = Array.from(this._ag_data.keys());
            keys.forEach(function (key) {
                if (!existingKeys.has(key)) {
                    _this._ag_data.delete(key);
                }
            });
            this._ag_hash = hash;
            return hash;
        }
        exports.updateSystem = updateSystem;
    });
    define("src/AG_ChainTree", ["require", "exports", "src/systems/AG_Update"], function (require, exports, AG_Update_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.AG_ChainTree = void 0;
        var AG_ChainTree = /** @class */ (function () {
            function AG_ChainTree(state) {
                this._ag_data = new Map;
                this._ag_update = AG_Update_1.updateSystem.bind(this);
                if (state != null) {
                    this._ag_update(state);
                }
            }
            return AG_ChainTree;
        }());
        exports.AG_ChainTree = AG_ChainTree;
    });
    define("src/AG_State", ["require", "exports", "src/AG_ChainTree"], function (require, exports, AG_ChainTree_2) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        var AG_State = /** @class */ (function (_super) {
            __extends(AG_State, _super);
            function AG_State(state) {
                return _super.call(this, state) || this;
            }
            AG_State.instance = function (id, state) {
                var instance = AG_State._instance.get(id);
                if (!instance) {
                    instance = new AG_State(state);
                    AG_State._instance.set(id, instance);
                    return instance;
                }
                if (state == null) {
                    return instance;
                }
                instance._ag_update(state);
                return instance;
            };
            AG_State._instance = new Map();
            return AG_State;
        }(AG_ChainTree_2.AG_ChainTree));
        exports.default = AG_State;
    });
    define("index", ["require", "exports", "src/AG_State"], function (require, exports, AG_State_1) {
        "use strict";
        Object.defineProperty(exports, "__esModule", { value: true });
        exports.State = exports._State = void 0;
        AG_State_1 = __importDefault(AG_State_1);
        exports._State = AG_State_1.default;
        exports.State = AG_State_1.default.instance('Master');
    });
    //# sourceMappingURL=ag-state.js.map
    'marker:resolver';

    function get_define(name) {
        if (defines[name]) {
            return defines[name];
        }
        else if (defines[name + '/index']) {
            return defines[name + '/index'];
        }
        else {
            var dependencies = ['exports'];
            var factory = function (exports) {
                try {
                    Object.defineProperty(exports, "__cjsModule", { value: true });
                    Object.defineProperty(exports, "default", { value: require(name) });
                }
                catch (_a) {
                    throw Error(['module "', name, '" not found.'].join(''));
                }
            };
            return { dependencies: dependencies, factory: factory };
        }
    }
    var instances = {};
    function resolve(name) {
        if (instances[name]) {
            return instances[name];
        }
        if (name === 'exports') {
            return {};
        }
        var define = get_define(name);
        if (typeof define.factory !== 'function') {
            return define.factory;
        }
        instances[name] = {};
        var dependencies = define.dependencies.map(function (name) { return resolve(name); });
        define.factory.apply(define, dependencies);
        var exports = dependencies[define.dependencies.indexOf('exports')];
        instances[name] = (exports['__cjsModule']) ? exports.default : exports;
        return instances[name];
    }
    if (entry[0] !== null) {
        return resolve(entry[0]);
    }
})();