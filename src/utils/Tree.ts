/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @AG_State 2022-08-17
 */

export function isATreeLeaf(item: any): boolean {
  return Array.isArray(item) || item instanceof Set || item instanceof Map
    || item != null && typeof item === 'object';
}
