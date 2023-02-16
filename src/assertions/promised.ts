/**
 * @file The promise assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoBase, ExpectoConstructor } from "../base.ts";
import { NOT } from "../flags.ts";
import { MixinConstructor } from "../mixin.ts";
import { findPropertyDescriptor } from "../util/props.ts";
import { promisify } from "../util/promising.ts";

// deno-lint-ignore no-explicit-any
type OpFunction = (current: any) => any;

function createGetOp(prop: string): OpFunction {
  return (current) => {
    return current[prop];
  };
}
function createApplyOp(
  target: (...args: unknown[]) => unknown,
  args: unknown[],
): OpFunction {
  return (current) => {
    return target.apply(current, args);
  };
}

// deno-lint-ignore no-explicit-any
type ResolveFunction<T = any> = (value?: any) => T;
// deno-lint-ignore no-explicit-any
type RejectFunction<T = never> = (reason?: any) => T;
// deno-lint-ignore no-explicit-any
type ThenFunction<ResolveType = any, RejectType = never> = (
  resolve: ResolveFunction<ResolveType>,
  reject: RejectFunction<RejectType>,
) => void;

const NONCHAIN_MEMBERS = [
  "actual",
  "create",
  "flags",
  "hasFlag",
  "setFlag",
  "unsetFlag",
  "appllyFlags",
];

class ExpectoProxyHandler {
  // deno-lint-ignore no-explicit-any
  start: any;
  readonly then: ThenFunction;

  #queue: OpFunction[] = [];
  // deno-lint-ignore no-explicit-any
  #result?: any;

  constructor(start: ExpectoBase<unknown>) {
    this.start = start;

    this.get = this.get.bind(this);

    this.then = (resolve: ResolveFunction, reject: RejectFunction) => {
      if (!this.#result) {
        Promise.resolve()
          .then(this.#finish.bind(this))
          .then((result) => (this.#result = result))
          .then(resolve, reject);
      } else {
        Promise.resolve(this.#result)
          .then(resolve, reject);
      }
    };
  }

  // deno-lint-ignore no-explicit-any
  get(target: any, propKey: string | symbol, receiver: unknown): any {
    // special case "then"
    if (propKey === "then") {
      return this.then;
    }

    // skip symbol-based properties
    if (typeof propKey === "symbol") {
      return Reflect.get(target, propKey, receiver);
    }

    // skip Object properties
    if (
      Object.getOwnPropertyNames(Object.prototype).includes(propKey) ||
      Object.getOwnPropertyNames(Object).includes(propKey)
    ) {
      return Reflect.get(target, propKey, receiver);
    }

    // skip actual & flag-related properties
    // TODO: Somehow do this within plugins
    if (
      NONCHAIN_MEMBERS.includes(propKey)
    ) {
      return Reflect.get(target, propKey, receiver);
    }

    const propDesc = findPropertyDescriptor(target, propKey);
    if (typeof propDesc?.value === "function") {
      const property = target[propKey];
      const fn: OpFunction = (...args) => {
        const op = createApplyOp(property, args);
        this.push(op);

        return receiver;
      };
      return thenify(this.then, fn);
    }

    const op = createGetOp(propKey);
    this.push(op);

    return receiver;
  }

  push(op: OpFunction) {
    this.#queue.push(op);
  }

  // deno-lint-ignore no-explicit-any
  async #finish(): Promise<any> {
    const queue = [...this.#queue];
    this.#queue = [];

    let result = this.start;
    for (const op of queue) {
      result = await op(result);
    }

    return result;
  }
}

// deno-lint-ignore no-explicit-any
function thenify<ResolveType = any, RejectType = never>(
  then: ThenFunction<ResolveType, RejectType>, // deno-lint-ignore no-explicit-any
  target: any, // deno-lint-ignore no-explicit-any
): any {
  target.then = then;
  return target;
}

export default function promised<
  TargetType,
  BaseType extends ExpectoConstructor<TargetType>,
>(Base: BaseType) {
  const MixIn = class ExpectoPromised<T extends TargetType> extends // deno-lint-ignore no-explicit-any
  (Base as any) {
    #handler?: ExpectoProxyHandler;

    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    #proxify(startWith?: OpFunction): this & PromiseLike<this> {
      const resolved = this.create(this.actual);
      const handler = resolved.#handler = new ExpectoProxyHandler(resolved);
      if (startWith) {
        handler.push(startWith);
      }
      const proxy = new Proxy(resolved, handler);

      return proxy;
    }

    get eventually(): typeof this & PromiseLike<typeof this> {
      const op: OpFunction = async (current) => {
        const result = await promisify(current.actual);
        return current.create(result);
      };
      const proxy = this.#proxify(op);

      return proxy;
    }

    get rejected(): this & PromiseLike<this> {
      return this.rejectedWith();
    }

    rejectedWith<E extends Error>(
      errType?: new (...args: unknown[]) => E,
      msg?: string,
    ): this & PromiseLike<this> {
      const op: OpFunction = async (current) => {
        const not = current.hasFlag(NOT);
        let caught = false;
        let failure: E | undefined = undefined;
        let result;

        try {
          const resolved = promisify(current.actual);
          result = await resolved;
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
        if (!msg) {
          const oper = not ? "was rejected" : "was not rejected";
          msg = `${Deno.inspect(this.actual)} ${oper}`;
          if (errType) {
            msg += " with " + errType.name;
          }
        }
        current.assert(caught, msg);

        if (failure) {
          return current.create(failure);
        }

        if (result !== undefined) {
          return current.create(result);
        }

        return current;
      };
      const proxy = this.#proxify(op);

      return proxy;
    }
  };

  return MixIn as MixinConstructor<typeof MixIn, BaseType>;
}
