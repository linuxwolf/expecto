/**
 * @file The mock assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { equal } from "../../deps/src/asserts.ts";
import { type Spy } from "../../deps/src/mock.ts";

import { ExpectoConstructor } from "../base.ts";
import { DEEP, NOT } from "../flags.ts";
import { MixinConstructor } from "../mixin.ts";

function createArgReducer(
  actual: unknown[],
  deep: boolean,
): (acc: boolean, value: unknown, idx: number) => boolean {
  if (deep) {
    return (acc, value, idx) => {
      return acc && equal(value, actual[idx]);
    };
  }

  return (acc, value, idx) => {
    return acc && (value === actual[idx]);
  };
}

// deno-lint-ignore no-explicit-any
function asSpy(actual: any): Spy {
  const spy = actual as Spy;
  if (
    spy.calls !== undefined && spy.original !== undefined &&
    spy.restore !== undefined
  ) {
    return spy;
  }
  throw new TypeError("is not a Spy");
}

export default function mocked<
  T,
  BaseType extends ExpectoConstructor<T>,
>(Base: BaseType) {
  // deno-lint-ignore no-explicit-any
  const MixIn = class ExpectoMocked<T> extends (Base as any) {
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    called(count?: number, msg?: string): this {
      const spy = asSpy(this.actual);
      const not = this.hasFlag(NOT);
      const callCounts = spy.calls.length;

      let result = (count !== undefined)
        ? callCounts === count
        : callCounts > 0;

      if (not) result = !result;
      if (!msg) {
        let oper = (not) ? "has been called" : "has not been called";
        if (count !== undefined) {
          oper += `${count} times`;
        }
        msg = `${Deno.inspect(spy)} ${oper}`;
      }
      this.assert(result, msg);

      return this;
    }

    calledWith<Args extends unknown[]>(args: Args, msg?: string): this {
      const spy = asSpy(this.actual);
      const deep = this.hasFlag(DEEP);
      const not = this.hasFlag(NOT);
      const calls = spy.calls;

      let result = false;
      for (const c of calls) {
        const reducer = createArgReducer(c.args, deep);
        let check = c.args.length === args.length;
        check = args.reduce(reducer, check);
        result = result || check;
      }

      if (not) result = !result;
      if (!msg) {
        const oper = not ? "called with" : "not called with";
        msg = `${Deno.inspect(spy)} ${oper} ${Deno.inspect(args)}`;
      }
      this.assert(result, msg);

      return this;
    }
  };

  return MixIn as MixinConstructor<typeof MixIn, BaseType>;
}
