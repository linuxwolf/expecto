/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "../deps/test/asserts.ts";
import { beforeEach, describe, it } from "../deps/test/bdd.ts";
import * as mock from "../deps/test/mock.ts";

import { ExpectoConstructor } from "../src/base.ts";
import { MixinConstructor } from "../src/mixin.ts";
import { expect, reset, use } from "../src/main.ts";

function dummy<T, BaseType extends ExpectoConstructor<T>>(Base: BaseType) {
  // deno-lint-ignore no-explicit-any
  const MixIn = class ExpectoDummy<T> extends (Base as any) {
    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
    }

    dummy(): this {
      return this;
    }
  };

  return MixIn as MixinConstructor<typeof MixIn, BaseType>;
}

describe("main", () => {
  beforeEach(() => {
    reset();
  });

  it("creates an Expecto with the standard plugins", () => {
    const test = expect(42);
    assert(test.actual === 42);
    assert("deep" in test);
    assert("equal" in test);
    assert("instanceOf" in test);
    assert("eventually" in test);
    assert(!("dummy" in test));
  });
  it("registers and uses a plugin", () => {
    use(dummy);
    const test = expect(42);
    const spy = mock.spy(test, "dummy");
    assert(test.actual === 42);
    assert("deep" in test);
    assert("equal" in test);
    assert("instanceOf" in test);
    assert("eventually" in test);
    assert("dummy" in test);

    assert(test.dummy() === test);
    assert(spy.calls.length === 1);
  });
});
