/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @AG_State 2022-08-17
 */
import { AG_Leaf } from './AG_Type';
import { cyrb53 } from './utils/Cyrb53';
import { replacer } from './utils/JSON';
import { isATreeLeaf } from './utils/Tree';

export class AG_ChainTree {
  private __ag_data = new Map<string | number, {
    hash?: number,
    value: AG_ChainTree | AG_Leaf
  }>;

  private __ag_hash: number | undefined;

  public constructor(state?: any) {
    if (state != null) {
      this._ag_update(state)
    }
  }

  public _ag_update(state: any, hash?: number): number {
    hash = hash == null ? cyrb53(JSON.stringify(state, replacer)) : hash;
    if (hash === this.__ag_hash) {
      return hash;
    }
    this.__ag_updateTree(state);
    this.__ag_hash = hash;
    return hash;
  }

  private __ag_updateTree(state: any) {
    const existingKeys = new Set<string | number>();
    if (Array.isArray(state)) {
      for (let i = 0; i < state.length; i++) {
        existingKeys.add(i);
        this.__ag_updateOne(i, state[i])
      }
    } else {
      for (let key in state) {
        if (!state.hasOwnProperty(key)) {
          continue;
        }
        existingKeys.add(key);
        this.__ag_updateOne(key, state[key]);
      }
    }
    const keys = Array.from(this.__ag_data.keys());
    keys.forEach((key: string | number) => {
      if (!existingKeys.has(key)) {
        this.__ag_data.delete(key);
      }
    });
  }
  
  private __ag_updateOne(key: string | number, value: any) {
    const data = this.__ag_data.get(key);
    if (data == null) {
      if (isATreeLeaf(value)) {
        this.__ag_data.set(key, { value });
        return;
      }
      const tree = new AG_ChainTree();
      this.__ag_data.set(key, {
        hash: tree._ag_update(value),
        value: tree
      });
      return;
    }
    if (data.value instanceof AG_ChainTree) {
      const stateString = JSON.stringify(value, replacer);
      const hash = cyrb53(stateString);
      if (data.hash === hash) {
        return;
      }
      data.hash = data.value._ag_update(value, hash);
    }
  }
}
