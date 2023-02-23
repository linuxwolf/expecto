/**
 * @file The membership assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { equal } from "../../deps/src/asserts.ts";

import { ExpectoConstructor } from "../base.ts";
import { DEEP, NOT } from "../flags.ts";
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
  return class ExpectoPropertied extends Base {
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

    members(expected: unknown[], msg?: string): this {
      const deep = this.hasFlag(DEEP);
      const any = this.hasFlag(ANY);

      let result = !any;
      if (this.actual instanceof Map) {
        const map = this.actual as Map<unknown, unknown>;
        for (const k of expected) {
          const present = map.has(k);
          result = (any) ? result || present : result && present;
        }
      } else if (this.actual instanceof Set) {
        const set = this.actual as Set<unknown>;
        for (const e of expected) {
          const f = filterFor(e, deep);
          const present = [...set].filter(f).length > 0;
          result = (any) ? result || present : result && present;
        }
      } else if (Array.isArray(this.actual)) {
        const arr = this.actual as Array<unknown>;
        for (const e of expected) {
          const f = filterFor(e, deep);
          const present = arr.filter(f).length > 0;
          result = (any) ? result || present : result && present;
        }
      } else if (isObject(this.actual)) {
        // deno-lint-ignore ban-types
        const obj = this.actual as Object;
        for (const k of expected) {
          const present = (k as string) in obj;
          result = (any) ? result || present : result && present;
        }
      } else {
        result = false;
      }

      this.check(result, {
        expected,
        positiveOp: any
          ? "does not have any members of"
          : "does not have all members of",
        negativeOp: any
          ? "does have any members of"
          : "does have all members of",
        message: msg,
      });

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
      this.check(result, {
        expected: name,
        positiveOp: own
          ? "does not have own property"
          : "does not have property",
        negativeOp: own ? "does have own property" : "does have property",
        message: msg,
      });

      if (!not) {
        // deno-lint-ignore no-explicit-any
        const prop = (this.actual as any)[name];
        return this.create(prop);
      }

      return this;
    }
  };
}
