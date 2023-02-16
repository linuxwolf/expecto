/**
 * @file Exports for developing custom Mixins
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoBase, ExpectoConstructor } from "../src/base.ts";
import { MixinConstructor } from "../src/mixin.ts";
import { DEEP, NOT } from "../src/flags.ts";

export { DEEP, ExpectoBase, NOT };
export type { ExpectoConstructor, MixinConstructor };
