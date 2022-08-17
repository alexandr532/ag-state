/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @AG_State 2022-08-17
 */
import { AG_Leaf } from './AG_Type';
import { updateSystem } from './systems/AG_Update';

export class AG_ChainTree {
  public _ag_data = new Map<string | number, {
    hash?: number,
    value: AG_ChainTree | AG_Leaf
  }>;

  public _ag_hash: number | undefined;

  public constructor(state?: any) {
    if (state != null) {
      this._ag_update(state)
    }
  }

  public _ag_update = updateSystem.bind(this);

}
