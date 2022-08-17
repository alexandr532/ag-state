/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @AG_State 2022-08-17
 */
import { AG_ChainTree } from '../AG_ChainTree';
import { isATreeLeaf } from '../utils/Tree';
import { cyrb53 } from '../utils/Cyrb53';
import { replacer } from '../utils/JSON';

export function updateOneSystem(this: AG_ChainTree, key: string | number, value: any) {
  const data = this._ag_data.get(key);
  if (data == null) {
    if (isATreeLeaf(value)) {
      this._ag_data.set(key, { value });
      return;
    }
    const tree = new AG_ChainTree();
    this._ag_data.set(key, {
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
