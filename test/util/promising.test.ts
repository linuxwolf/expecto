/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import { maybePromise, promisify } from "../../src/util/promising.ts";

describe("util/promising", () => {
  describe("maybePromise()", () => {
    it("returns true for a Promise", () => {
      const check = Promise.resolve(42);
      assert(maybePromise(check));
    });
    it("returns true for object with `.then`", () => {
      const check = {
        then(resolve: (_: unknown) => unknown) {
          resolve(42);
        },
      };
      assert(maybePromise(check));
    });
    it("returns false for primitives", () => {
      let check;

      check = true;
      assert(!maybePromise(check));

      check = false;
      assert(!maybePromise(check));

      check = 42;
      assert(!maybePromise(check));

      check = 1234567890n;
      assert(!maybePromise(check));

      check = "something";
      assert(!maybePromise(check));
    });
    it("returns false for undefined/null", () => {
      let check;

      check = undefined;
      assert(!maybePromise(check));

      check = null;
      assert(!maybePromise(check));
    });
  });
  describe("promisify()", () => {
    describe("successes", () => {
      it("returns the provided promise", () => {
        const value: PromiseLike<number> = Promise.resolve(42);
        const result = promisify(value);
        assert(result === value);
      });
      it("returns a PromiseLike for a primitive", async () => {
        let value;
        let result;

        value = true;
        result = promisify(value);
        assert(result instanceof Promise);
        assert((await result) === value);

        value = 42;
        result = promisify(value);
        assert(result instanceof Promise);
        assert((await result) === value);

        value = 1234567890n;
        result = promisify(value);
        assert(result instanceof Promise);
        assert((await result) === value);

        value = "some string";
        result = promisify(value);
        assert(result instanceof Promise);
        assert((await result) === value);
      });
    });
    describe("failures", () => {
      it("rejects if passed an Error", async () => {
        const value = new Error("oops");
        const result = promisify(value);
        assert(typeof result.then === "function");

        let passed = false;
        try {
          await result;
          passed = true;
        } catch (err) {
          assert(err.message === "oops");
        }
        assert(!passed, "expected error not thrown");
      });
    });
  });
});
