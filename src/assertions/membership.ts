/**
 * @file The membership assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { equal } from "../../deps/src/asserts.ts";

import { ExpectoConstructor } from "../base.ts";
import { DEEP, NOT } from "../flags.ts";
import { MixinConstructor } from "../mixin.ts";
import { findPropertyDescriptor } from "../util/props.ts";

function isObject(check: unknown): boolean {
  return (typeof check === "object") && (check !== null);
}

export const OWN = "own";
export const ANY = "any";
export const ALL = "all";

function filterFor(expected: unknown, deep: boolean): (v: unknown) => boolean {
  return (deep) ? (v) => equal(v, expected) : (v) => (v === expected);
}

export default function membership<
  TargetType,
  BaseType extends ExpectoConstructor<TargetType>,
>(Base: BaseType) {
  const MixIn = class ExpectoPropertied<T extends TargetType> extends // deno-lint-ignore no-explicit-any
  (Base as any) {
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    get all(): this {
      this.unsetFlag(ANY);
      this.setFlag(ALL);
      return this;
    }

    get any(): this {
      this.unsetFlag(ALL);
      this.setFlag(ANY);
      return this;
    }

    get own(): this {
      this.setFlag(OWN);
      return this;
    }

    members(check: unknown[], msg?: string): this {
      const deep = this.hasFlag(DEEP);
      const not = this.hasFlag(NOT);
      const any = this.hasFlag(ANY);

      let result = !any;
      if (this.actual instanceof Map) {
        const map = this.actual as Map<unknown, unknown>;
        for (const k of check) {
          const present = map.has(k);
          result = (any) ? result || present : result && present;
        }
      } else if (this.actual instanceof Set) {
        const set = this.actual as Set<unknown>;
        for (const e of check) {
          const f = filterFor(e, deep);
          const present = [...set].filter(f).length > 0;
          result = (any) ? result || present : result && present;
        }
      } else if (Array.isArray(this.actual)) {
        const arr = this.actual as Array<unknown>;
        for (const e of check) {
          const f = filterFor(e, deep);
          const present = arr.filter(f).length > 0;
          result = (any) ? result || present : result && present;
        }
      } else if (isObject(this.actual)) {
        // deno-lint-ignore ban-types
        const obj = this.actual as Object;
        for (const k of check) {
          const present = (k as string) in obj;
          result = (any) ? result || present : result && present;
        }
      } else {
        result = false;
      }

      if (not) result = !result;
      if (!msg) {
        const oper = (any) ? "have any members" : "have all members";
        msg = `${Deno.inspect(this.actual)} ${
          not ? "does" : "does not"
        } ${oper} of ${Deno.inspect(check)}`;
      }
      this.assert(result, msg);

      return this;
    }

    property(name: string, msg?: string): this {
      const not = this.hasFlag(NOT);
      const own = this.hasFlag(OWN);
      const isObj = isObject(this.actual);

      let result = false;
      if (isObj) {
        if (own) {
          result =
            Object.getOwnPropertyDescriptor(this.actual, name) !== undefined;
        } else {
          result = findPropertyDescriptor(this.actual, name) !== undefined;
        }
      }
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
