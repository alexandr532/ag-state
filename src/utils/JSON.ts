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
export function replacer(key: string, value: any): any {
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

/**
 * Reviver function used with JSON.parse to convert strings with data typed
 * objects, that were stringified using replacer function, back to Maps and Sets.
 * 
 * @example JSON.parse(str, reviver);
 */
export function reviver(key: string, value: any): any {
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
