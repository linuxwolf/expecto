/**
 * @file The string-based assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoConstructor } from "../base.ts";

export default function stringed<
  TargetType,
  BaseType extends ExpectoConstructor<TargetType>,
>(Base: BaseType) {
  return class ExpectoStringed extends Base {
    substring(expected: string, msg?: string): this {
      if (typeof this.actual !== "string") {
        throw new TypeError(`${Deno.inspect(this.actual)} is not a string`);
      }

      const result = this.actual.includes(expected);
      return this.check(result, {
        expected,
        positiveOp: "does not have substring",
        negativeOp: "does have substring",
        message: msg,
      });
    }

    startsWith(expected: string, msg?: string): this {
      if (typeof this.actual !== "string") {
        throw new TypeError(`${Deno.inspect(this.actual)} is not a string`);
      }

      const result = this.actual.startsWith(expected);
      return this.check(result, {
        expected,
        positiveOp: "does not start with",
        negativeOp: "does start with",
        message: msg,
      });
    }

    endsWith(expected: string, msg?: string): this {
      if (typeof this.actual !== "string") {
        throw new TypeError(`${Deno.inspect(this.actual)} is not a string`);
      }

      const result = this.actual.endsWith(expected);
      return this.check(result, {
        expected,
        positiveOp: "does not end with",
        negativeOp: "does end with",
        message: msg,
      });
    }
  };
}
