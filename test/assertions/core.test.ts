/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import core from "../../src/assertions/core.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/core", () => {
  describe("mixin ExpectoCore", () => {
    const ExpectoCore = core(ExpectoBase);

    describe(".equal()", () => {
      const target = new Date("2022-12-23T12:34:56.789Z");

      describe("basics", () => {
        it("passes on success", () => {
          const test = new ExpectoCore(target);
          const result = test.equal(target);
          assert(result === test);
        });
        it("throws on failure", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.equal(new Date("2022-11-22T01:23:45.678Z"));
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws with message on failure", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.equal(new Date(), "oopsies!");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("oopsies!"));
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("deeply", () => {
        it("passes on success", () => {
          const test = new ExpectoCore(target);
          const result = test.deep.equal(new Date(target.getTime()));
          assert(result === test);
        });
        it("throws on failure", () => {
          const test = new ExpectoCore(target);

          try {
            test.deep.equal(new Date("2022-11-22T01:23:45.678Z"));
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });

      describe("negated", () => {
        it("passes on 'failure'", () => {
          const test = new ExpectoCore(target);
          const result = test.not.equal(new Date("2022-11-22T01:23:45.678Z"));
          assert(result === test);
        });
        it("throws on 'success'", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.not.equal(target);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("negated AND deeply", () => {
        it("passes on 'failure'", () => {
          const test = new ExpectoCore(target);
          const result = test.not.deep.equal(
            new Date("2022-11-22T01:23:45.678Z"),
          );
          assert(result === test);
        });
        it("throws on 'success'", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.not.deep.equal(target);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".equals()", () => {
      const target = new Date("2022-12-23T12:34:56.789Z");

      describe("basics", () => {
        it("passes on success", () => {
          const test = new ExpectoCore(target);
          const result = test.equals(target);
          assert(result === test);
        });
        it("throws on failure", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.equals(new Date("2022-11-22T01:23:45.678Z"));
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws with message on failure", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.equals(new Date(), "oopsies!");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("oopsies!"));
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("deeply", () => {
        it("passes on success", () => {
          const test = new ExpectoCore(target);
          const result = test.deep.equals(new Date(target.getTime()));
          assert(result === test);
        });
        it("throws on failure", () => {
          const test = new ExpectoCore(target);

          try {
            test.deep.equals(new Date("2022-11-22T01:23:45.678Z"));
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });

      describe("negated", () => {
        it("passes on 'failure'", () => {
          const test = new ExpectoCore(target);
          const result = test.not.equals(new Date("2022-11-22T01:23:45.678Z"));
          assert(result === test);
        });
        it("throws on 'success'", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.not.equals(target);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("negated AND deeply", () => {
        it("passes on 'failure'", () => {
          const test = new ExpectoCore(target);
          const result = test.not.deep.equals(
            new Date("2022-11-22T01:23:45.678Z"),
          );
          assert(result === test);
        });
        it("throws on 'success'", () => {
          const test = new ExpectoCore(target);
          let passed = false;

          try {
            test.not.deep.equals(target);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".throw()", () => {
      class TestError extends Error {
        override name = "TestError";

        // deno-lint-ignore no-explicit-any
        constructor(...args: any[]) {
          super(...args);
          Object.setPrototypeOf(this, TestError.prototype);
        }
      }

      const passTarget = () => {
        throw new TestError("I failed");
      };
      const failNoneTarget = () => {/* I don't throw ... */};
      const failDiffTarget = () => {
        throw new RangeError("I failed differently");
      };

      describe("basics", () => {
        it("passes on successful throw", () => {
          const test = new ExpectoCore(passTarget);
          const result = test.throw();
          assert(result !== test);
          assert(result instanceof ExpectoBase);
          assert(result.actual instanceof Error);
        });
        it("passes on successful throw of expected type", () => {
          const test = new ExpectoCore(passTarget);
          const result = test.throw<TestError>(TestError);
          assert(result !== test);
          assert(result instanceof ExpectoBase);
          assert(result.actual instanceof TestError);
        });
        it("throws TypeError if actual is not a function", () => {
          const test = new ExpectoCore(42);
          let passed = false;

          try {
            test.throw();
            passed = true;
          } catch (err) {
            assert(err instanceof TypeError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws on failed non-throw", () => {
          const test = new ExpectoCore(failNoneTarget);
          let passed = false;

          try {
            test.throw();
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws on failed different-type", () => {
          const test = new ExpectoCore(failDiffTarget);
          let passed = false;

          try {
            test.throw(TestError);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("negated", () => {
        it("passes on 'failure (no throw)'", () => {
          const test = new ExpectoCore(failNoneTarget);
          const result = test.not.throw();
          assert(result === test);
        });
        it("passes on 'failure (throw other)'", () => {
          const test = new ExpectoCore(failDiffTarget);
          const result = test.not.throw(TestError);
          assert(result === test);
        });
        it("throws on 'success (any throw)'", () => {
          const test = new ExpectoCore(passTarget);
          let passed = false;

          try {
            test.not.throw();
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws on 'success (throw expected)'", () => {
          const test = new ExpectoCore(passTarget);
          let passed = false;

          try {
            test.not.throw(TestError);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });
  });
});
