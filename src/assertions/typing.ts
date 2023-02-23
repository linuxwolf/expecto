/**
 * @file The type-information assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoConstructor } from "../base.ts";

export default function typing<
  T,
  BaseType extends ExpectoConstructor<T>,
>(Base: BaseType) {
  return class ExpectoTyping extends Base {
    exists(msg?: string): this {
      const result = (this.actual !== null) && (this.actual !== undefined);
      this.check(result, {
        positiveOp: "does not exist",
        negativeOp: "does exist",
        message: msg,
      });

      return this;
    }

    undefined(msg?: string): this {
      const result = this.actual === undefined;
      this.check(result, {
        positiveOp: "is undefined",
        negativeOp: "is defined",
        message: msg,
      });

      return this;
    }

    null(msg?: string): this {
      const result = this.actual === null;
      this.check(result, {
        positiveOp: "is not null",
        negativeOp: "is null",
        message: msg,
      });

      return this;
    }

    true(msg?: string): this {
      const result = (typeof this.actual === "boolean") &&
        (this.actual === true);
      this.check(result, {
        positiveOp: "is not true",
        negativeOp: "is true",
        message: msg,
      });

      return this;
    }

    false(msg?: string): this {
      const result = (typeof this.actual === "boolean") &&
        (this.actual === false);
      this.check(result, {
        positiveOp: "is not false",
        negativeOp: "is false",
        message: msg,
      });

      return this;
    }

    NaN(msg?: string): this {
      const result = (typeof this.actual === "number") && isNaN(this.actual);
      this.check(result, {
        positiveOp: "is not NaN",
        negativeOp: "is NaN",
        message: msg,
      });

      return this;
    }

    typeOf(expected: string, msg?: string): this {
      const result = (typeof this.actual) === expected;
      this.check(result, {
        expected,
        positiveOp: "is not a type of",
        negativeOp: "is a type of",
        message: msg,
      });

      return this;
    }

    instanceOf(
      expected: new (...args: unknown[]) => unknown,
      msg?: string,
    ): this {
      const result = this.actual instanceof expected;
      this.check(result, {
        expected,
        positiveOp: "is not an instance of",
        negativeOp: "is an instance of",
        message: msg,
      });

      return this;
    }
  };
}
