/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import { ExpectoBase } from "../../src/base.ts";
import _std from "../../src/assertions/_std.ts";

describe("assertions/_std", () => {
  describe("_std()", () => {
    it("returns the 'standard' Expecto", () => {
      const ExpectoResult = _std(ExpectoBase);
      const test = new ExpectoResult(42);
      assert("deep" in test);
      assert("not" in test);

      assert("equal" in test);
      assert("throw" in test);

      assert("instanceOf" in test);
      assert("typeOf" in test);

      assert("eventually" in test);
      assert("rejected" in test);
    });
  });
});
