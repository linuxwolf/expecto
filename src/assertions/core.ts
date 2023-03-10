/**
 * @file The core assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { equal } from "../../deps/src/asserts.ts";
import { ExpectoConstructor } from "../base.ts";
import { DEEP } from "../flags.ts";

export default function core<
  T,
  BaseType extends ExpectoConstructor<T>,
>(Base: BaseType) {
  return class ExpectoCore extends Base {
    equal(expected: unknown, msg?: string): this {
      const deep = this.hasFlag(DEEP);

      const result = deep
        ? equal(this.actual, expected)
        : this.actual === expected;

      this.check(result, {
        expected,
        positiveOp: deep ? "is not deeply equal" : "is not strictly equal",
        negativeOp: deep ? "is deeply equal" : "is not deeply equal",
        message: msg,
      });

      return this;
    }
    equals(expected: unknown, msg?: string): this {
      return this.equal(expected, msg);
    }

    throw<E extends Error>(
      errType?: new (...args: unknown[]) => E,
      msg?: string,
    ): this {
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

      this.check(caught, {
        ...(errType && { expected: errType }),
        positiveOp: "did not throw",
        negativeOp: "did thrown",
        message: msg,
      });

      if (!failure) {
        return this;
      }

      const ctor = Object.getPrototypeOf(this).constructor;
      return new ctor(failure);
    }
  };
}
