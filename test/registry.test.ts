/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";
import { ExpectoBase, ExpectoConstructor } from "../src/base.ts";

import { Registry } from "../src/registry.ts";

describe("registry", () => {
  const target = new Date();

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
      function dummy<T>(Base: ExpectoConstructor<T>): ExpectoConstructor<T> {
        return class DummyExpecto<T> extends Base {
          dummy(): DummyExpecto<T> {
            return this;
          }
        };
      }

      let result = registry.create(target);
      assert(!("dummy" in result));

      registry.apply(dummy);
      result = registry.create(target);
      assert("dummy" in result);
    });
  });
});
