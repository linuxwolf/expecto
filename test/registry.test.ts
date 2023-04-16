/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "../deps/test/asserts.ts";
import { beforeEach, describe, it } from "../deps/test/bdd.ts";
import * as mock from "../deps/test/mock.ts";

import { Registry } from "../src/registry.ts";
import { ExpectoBase, ExpectoConstructor } from "../src/base.ts";

describe("registry", () => {
  const target = new Date();

  let dummy: mock.Spy;
  beforeEach(() => {
    const fn = (
      Base: ExpectoConstructor<unknown>,
    ): ExpectoConstructor<unknown> => {
      return class DummyExpecto<T> extends Base {
        dummy(): DummyExpecto<unknown> {
          return this;
        }
      };
    };
    dummy = mock.spy(fn);
  });

  describe("class Registry", () => {
    let registry: Registry<typeof target>;
    beforeEach(() => {
      registry = new Registry();
    });

    it("returns a generic ExpectoBase by default", () => {
      assert(registry.type === ExpectoBase);

      const result = registry.create(target);
      assert(result instanceof ExpectoBase);
    });
    it("applies a mixin and creates an instance with it", () => {
      let result = registry.create(target);
      assert(!("dummy" in result));

      registry.apply(dummy);
      result = registry.create(target);
      assert("dummy" in result);
      assert(dummy.calls.length === 1);
    });
    it("applies a mixin only once", () => {
      let result = registry.create(target);
      assert(!("dummy" in result));

      registry.apply(dummy);
      registry.apply(dummy);
      result = registry.create(target);
      assert("dummy" in result);
      assert(dummy.calls.length === 1);
    });
  });
});
