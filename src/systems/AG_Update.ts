/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @AG_State 2022-08-17
 */
import { AG_ChainTree } from '../AG_ChainTree';
import { cyrb53 } from '../utils/Cyrb53';
import { replacer } from '../utils/JSON';
import { updateOneSystem } from './AG_UpdateOne';

export function updateSystem(this: AG_ChainTree, state: any, hash?: number): number {

  hash = hash == null ? cyrb53(JSON.stringify(state, replacer)) : hash;
  if (hash === this._ag_hash) {
    return hash;
  }
  const existingKeys = new Set<string | number>();
  if (Array.isArray(state)) {
    for (let i = 0; i < state.length; i++) {
      existingKeys.add(i);
      updateOneSystem.bind(this, i, state);
    }
  } else {
    for (let key in state) {
      if (!state.hasOwnProperty(key)) {
        continue;
      }
      existingKeys.add(key);
      updateOneSystem.bind(this, key, state[key]);
    }
  }
  const keys: Array<string | number> = Array.from(this._ag_data.keys());
  keys.forEach((key: string | number) => {
    if (!existingKeys.has(key)) {
      this._ag_data.delete(key);
    }
  });
  this._ag_hash = hash;
  return hash;
}
