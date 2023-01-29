/**
 * @file The properties assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoConstructor } from "../base.ts";
import { NOT } from "../flags.ts";
import { MixinConstructor } from "../mixin.ts";
import { findPropertyDescriptor } from "../util/props.ts";

export const OWN = "own";

export default function propertied<
  TargetType,
  BaseType extends ExpectoConstructor<TargetType>,
>(Base: BaseType) {
  const MixIn = class ExpectoPropertied<T extends TargetType> extends // deno-lint-ignore no-explicit-any
  (Base as any) {
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    property(name: string, msg?: string): this {
      const not = this.hasFlag(NOT);
      const isObj = typeof this.actual === "object" && (this.actual !== null);

      let result = isObj && (name in this.actual);
      if (not) result = !result;

      if (!msg) {
        const oper = not ? "does have property" : "does not have property";
        msg = `${Deno.inspect(this.actual)} ${oper} "${name}"`;
      }
      this.assert(result, msg);

      if (!not) {
        const prop = this.actual[name];
        return this.derived(prop);
      }

      return this;
    }
  };

  return MixIn as MixinConstructor<typeof MixIn, BaseType>;
}
