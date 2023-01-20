/**
 * @file The promoise assertions mixin.
 *
 * @copyright 2023 Matthew A. Miller
 */

// deno-lint-ignore-file no-explicit-any

import { ExpectoBase, ExpectoConstructor } from "../base.ts";
import { NOT } from "../flags.ts";
import { MixinConstuctor } from "../mixin.ts";
import { findPropertyDescriptor } from "../util/props.ts";

function maybePromise(check: any): boolean {
  return !!check &&
    (typeof check === "object") &&
    (typeof check.then === "function");
}

function promisify(value: any): Promise<any> | (() => Promise<any>) {
  if (maybePromise(value)) {
    return value as Promise<any>;
  } else if (typeof value === "function") {
    return value;
  }

  return Promise.resolve(value);
}

function createFor<T, X extends ExpectoBase<T>>(base: X, target: T) {
  const ctor = Object.getPrototypeOf(base).constructor;
  const result = new ctor(target);
  result.applyFlags(base);

  return result;
}

type OpFunction = (current: any) => any;

function createGetOp(prop: string): OpFunction {
  return (current) => {
    return current[prop];
  }
}
function createApplyOp(target: (...args: any[]) => any, args: any[]): OpFunction {
  return (current) => {
    return target.apply(current, args);
  };
}

type ResolveFunction<T = any> = (value?: any) => T;
type RejectFunction<T = never> = (reason?: any) => never;
type ThenFunction<ResolveType = any, RejectType = never> = (resolve: ResolveFunction<ResolveType>, reject: RejectFunction<RejectType>) => void;

class ExpectoProxyHandler {
  start: any;
  readonly then: ThenFunction;

  #queue: OpFunction[] = [];
  #result?: any;

  constructor(start: any) {
    this.start = start;

    this.get = this.get.bind(this);

    this.then = (resolve: ResolveFunction, reject: RejectFunction) => {
      if (!this.#result) {
        Promise.resolve()
          .then(this.#finish.bind(this))
          .then((result) => (this.#result = result))
          .then(resolve, reject);
      } else {
        Promise.resolve(this.#result);
      }
    };
  }

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
    if (Object.getOwnPropertyNames({}).includes(propKey)) {
      return Reflect.get(target, propKey, receiver);
    }

    const propDesc = findPropertyDescriptor(target, propKey);
    if (typeof propDesc?.value === "function") {
      const property = target[propKey];
      const fn = thenify(this.then, (...args: any[]): any => {
        const op = createApplyOp(property, args);
        this.push(op);

        return receiver;
      });
      return fn;
    }

    const op = createGetOp(propKey);
    this.push(op);

    return receiver;
  }

  push(op: OpFunction) {
    this.#queue.push(op);
  }

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

function thenify<ResolveType = any, RejectType = never>(then: ThenFunction<ResolveType, RejectType>, target: any): any {
  target.then = then;
  return target;
}

export default function promised<
  TargetType,
  BaseType extends ExpectoConstructor<TargetType>,
>(Base: BaseType) {
  const MixIn = class ExpectoPromised<T extends TargetType> extends (Base as any) {
    #handler?: any;

    constructor(...args: any[]) {
      super(...args);
    }

    #proxify(startWith?: OpFunction): typeof Proxy {
      const base = ((this as unknown) as ExpectoBase<Promise<any>>);
      const resolved = createFor(base, promisify(this.actual));
      const handler = resolved.#handler = new ExpectoProxyHandler(resolved);
      if (startWith) {
        handler.push(startWith);
      }
      const proxy = new Proxy(resolved, handler);

      return proxy;
    }

    get eventually(): any {
      const proxy = this.#proxify(async (current) => {
        const result = await current.actual;
        return createFor(current, result);
      });
      return proxy;
    }

    get rejected(): any {
      return this.rejectedWith();
    }

    rejectedWith<E extends Error>(
      errType?: new (...args: any[]) => E,
      msg?: string,
    ): any {
      const op = async (current: any): Promise<any> => {
        const not = current.hasFlag(NOT);
        let caught = false;
        let failure: E | undefined = undefined;
        let result;

        try {
          const actual = current.actual
          let resolved: Promise<any>;
          if (maybePromise(actual)) {
            resolved = current.actual;
          } else if (typeof actual === "function") {
            resolved = current.actual();
          } else {
            resolved = Promise.resolve(actual);
          }

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
        const oper = not ? "was rejected" : "was not rejected";
        if (!msg) {
          msg = `${Deno.inspect(this.actual)} ${oper}`;
          if (errType) {
            msg += " with " + errType.name;
          }
        }
        current.assert(caught, msg);

        if (failure) {
          return createFor(current, failure);
        }

        if (result !== undefined) {
          return createFor(current, result);
        }

        return current;
      };
      const proxy = this.#proxify(op);

      return proxy;
    }
  };

  return MixIn as MixinConstuctor<typeof MixIn, BaseType>;
}
