/**
 * @file The type-information assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoConstructor } from "../base.ts";
import { NOT } from "../flags.ts";
import { MixinConstructor } from "../mixin.ts";

export default function typing<
  T,
  BaseType extends ExpectoConstructor<T>,
>(Base: BaseType) {
  // deno-lint-ignore no-explicit-any
  const MixIn = class ExpectoTyping<T> extends (Base as any) {
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    get exists(): this {
      const not = this.hasFlag(NOT);

      let result = (this.actual !== null) && (this.actual !== undefined);
      if (not) result = !result;

      const oper = not ? "does exist" : "does not exist";
      const msg = `${Deno.inspect(this.actual)} ${oper}`;
      this.assert(result, msg);

      return this;
    }

    get undefined(): this {
      const not = this.hasFlag(NOT);

      let result = this.actual === undefined;
      if (not) result = !result;

      const oper = not ? "is undefined" : "is defined";
      const msg = `${Deno.inspect(this.actual)} ${oper}`;
      this.assert(result, msg);

      return this;
    }

    get null(): this {
      const not = this.hasFlag(NOT);

      let result = this.actual === null;
      if (not) result = !result;

      const oper = not ? "is null" : "is not null";
      const msg = `${Deno.inspect(this.actual)} ${oper}`;
      this.assert(result, msg);

      return this;
    }

    get true(): this {
      const not = this.hasFlag(NOT);

      let result = (typeof this.actual === "boolean") && (this.actual === true);
      if (not) result = !result;

      const oper = not ? " is true" : "is not true";
      const msg = `${Deno.inspect(this.actual)} ${oper}`;
      this.assert(result, msg);

      return this;
    }

    get false(): this {
      const not = this.hasFlag(NOT);

      let result = (typeof this.actual === "boolean") &&
        (this.actual === false);
      if (not) result = !result;

      const oper = not ? "is false" : "is not false";
      const msg = `${Deno.inspect(this.actual)} ${oper}`;
      this.assert(result, msg);

      return this;
    }

    get NaN(): this {
      const not = this.hasFlag(NOT);

      let result = (typeof this.actual === "number") && isNaN(this.actual);
      if (not) result = !result;

      const oper = not ? "is NaN" : "is not NaN";
      const msg = `${Deno.inspect(this.actual)} ${oper}`;
      this.assert(result, msg);

      return this;
    }

    typeOf(typing: string, msg?: string): this {
      const not = this.hasFlag(NOT);

      let result = (typeof this.actual) === typing;
      if (not) result = !result;

      if (!msg) {
        const oper = not ? "is type of" : "is not type of";
        msg = `${Deno.inspect(this.actual)} ${oper} ${typing}`;
      }
      this.assert(result, msg);

      return this;
    }

    instanceOf(
      instType: new (...args: unknown[]) => unknown,
      msg?: string,
    ): this {
      const not = this.hasFlag(NOT);

      let result = this.actual instanceof instType;
      if (not) result = !result;

      if (!msg) {
        const oper = not ? "is instance of" : "is not instance of";
        msg = `${Deno.inspect(this.actual)} ${oper} ${instType.name}`;
      }
      this.assert(result, msg);

      return this;
    }
  };

  return MixIn as MixinConstructor<typeof MixIn, BaseType>;
}
