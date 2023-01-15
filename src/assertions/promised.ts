/**
 * @file The promoise assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

// deno-lint-ignore-file no-explicit-any

import { ExpectoConstructor } from "../base.ts";
import { NOT } from "../flags.ts";
import { MixinConstuctor } from "../mixin.ts";

function maybePromise(check: any): boolean {
  return !!check &&
    (typeof check === "object") &&
    (typeof check.then === "function");
}

export default function promised<
  TargetType,
  BaseType extends ExpectoConstructor<TargetType>,
>(Base: BaseType) {
  const MixIn = class ExpectoPromised<T extends TargetType>
    extends (Base as any) {
    constructor(...args: any[]) {
      super(...args);
    }

    async rejected<E extends Error>(
      errType?: new (...args: any[]) => E,
      msg?: string,
    ): Promise<any> {
      const not = this.hasFlag(NOT);
      let resolved: Promise<any>;
      if (maybePromise(this.actual)) {
        resolved = this.actual;
      } else if (typeof this.actual === "function") {
        resolved = this.actual();
      } else {
        resolved = Promise.resolve(this.actual);
      }

      let caught = false;
      let failure: E | undefined = undefined;
      try {
        await resolved;
      } catch (err) {
        if (errType) {
          caught = err instanceof errType;
          failure = caught && err;
        } else {
          caught = true;
          failure = err;
        }
      }

      if (not) caught = !caught;
      const oper = -not ? "did throw" : "did not throw";
      if (!msg) {
        msg = `${Deno.inspect(this.actual)} ${oper}`;
        if (errType) {
          msg += "a " + errType.name;
        }
      }
      this.assert(caught, msg);

      if (!failure) {
        return this;
      }

      const ctor = Object.getPrototypeOf(this).constructor;
      return new ctor(failure);
    }
  };

  return MixIn as MixinConstuctor<typeof MixIn, BaseType>;
}
