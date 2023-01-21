/**
 * @file The core assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

// deno-lint-ignore-file no-explicit-any

import { equal } from "../../deps/src/asserts.ts";
import { ExpectoConstructor } from "../base.ts";
import { DEEP, NOT } from "../flags.ts";
import { MixinConstuctor } from "../mixin.ts";

export default function core<
  T,
  BaseType extends ExpectoConstructor<T>,
>(Base: BaseType) {
  const MixIn = class ExpectoCore<T> extends (Base as any) {
    constructor(...args: any[]) {
      super(...args);
    }

    equal(expected: T, msg?: string): this {
      const deep = this.hasFlag(DEEP);
      const not = this.hasFlag(NOT);

      let result = deep
        ? equal(this.actual, expected)
        : this.actual === expected;
      result = not ? !result : result;

      if (!msg) {
        const verb = not ? "is" : "is not";
        const oper = deep ? "deeply equal" : "strictly equal";

        msg = `${Deno.inspect(this.actual)} ${verb} ${oper} to ${
          Deno.inspect(expected)
        }`;
      }
      this.assert(result, msg);

      return this;
    }

    throw<E extends Error>(
      errType?: new (...args: unknown[]) => E,
      msg?: string,
    ): this {
      const not = this.hasFlag(NOT);
      if (typeof this.actual !== "function") {
        throw new TypeError(`${Deno.inspect(this.actual)} not a function`);
      }

      let caught = false;
      let failure: E | undefined = undefined;
      try {
        this.actual();
      } catch (err) {
        if (errType) {
          caught = err instanceof errType;
          failure = caught && err;
        } else {
          caught = true;
          failure = err;
        }
      }

      if (not) {
        caught = !caught;
      }
      const oper = not ? "did throw" : "did not throw";
      if (!msg) {
        msg = `${Deno.inspect(this.actual)} ${oper}`;
        if (errType) {
          msg += ` ${errType.name}`;
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
