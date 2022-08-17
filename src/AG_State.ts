/**
 * Copyright (c) Alexandr <alexandr532@proton.me>.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree
 *
 * @AG_State 2022-08-16
 */

import {AG_ChainTree} from './AG_ChainTree';

export class AG_State extends AG_ChainTree {
  private static _instance: Map<any, AG_State> = new Map();

  public static instance(id: any, state?: object): AG_State {
    let instance = AG_State._instance.get(id);
    if (!instance) {
      instance = new AG_State(state);
      AG_State._instance.set(id, instance);
      return instance;
    }
    if (state == null) {
      return instance
    }
    instance.update(state);
    return instance;
  }


  protected constructor(state?: object) {
    super(state);
  }
}
