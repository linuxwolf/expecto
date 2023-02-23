/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError, equal } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";
import * as mock from "../../deps/test/mock.ts";

import promised from "../../src/assertions/promised.ts";
import core from "../../src/assertions/core.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/promised", () => {
  class TestError extends Error {
    override name = "TestError";

    // deno-lint-ignore no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      Object.setPrototypeOf(this, TestError.prototype);
    }
  }

  const ExpectoCore = core(ExpectoBase);
  const ExpectoPromised = promised(ExpectoCore);

  describe("mixin ExpectoPromised", () => {
    describe(".eventually", () => {
      describe("basics", () => {
        it("works with a Promise", async () => {
          const test = new ExpectoPromised(Promise.resolve(42)).eventually;
          assert(typeof test.then === "function");

          const result = await test;
          assert(result instanceof ExpectoPromised);
          assert((result.actual as unknown) === 42);
        });
        it("works with a value", async () => {
          const test = new ExpectoPromised(42).eventually;
          assert(typeof test.then === "function");

          const result = await test;
          assert(result instanceof ExpectoPromised);
          assert(result.actual === 42);
        });
      });
      describe("within the chain", () => {
        it("delays subsequent checks until fulfilled", async () => {
          const test = new ExpectoPromised(42);
          const spyEqual = mock.spy(ExpectoCore.prototype, "equal");

          let result: typeof test | PromiseLike<typeof test> = test.eventually
            .to
            .equal(42);
          assert(result instanceof ExpectoPromised);
          let calls = spyEqual.calls;
          assert(calls.length === 0);

          result = await result;
          assert(result instanceof ExpectoPromised);
          assert(result.actual === 42);
          calls = spyEqual.calls;
          assert(calls.length === 1);
          assert(equal(calls[0].args, [42]));

          spyEqual.restore();
        });
      });
      describe("not deferred", () => {
        it("does not defer Object properties", () => {
          const test = new ExpectoPromised(42).eventually;
          assert(typeof test.toString() === "string");
        });
        it("does not defer non-expect properties", () => {
          const test = new ExpectoPromised(42).eventually;
          assert(test.actual === 42);
        });
      });
      describe("edges", () => {
        it(".then() always resolves to the same value", async () => {
          const test = new ExpectoPromised(Promise.resolve(42)).eventually;
          const first = await test;
          assert((first.actual as unknown) === 42);
          const second = await test;
          assert((second.actual as unknown) === 42);
          assert(first === second);
        });
      });
    });

    describe(".rejected", () => {
      const passTarget = () => (Promise.reject(new TestError("I reject")));
      const failNonTarget = () => (Promise.resolve("I fulfill"));

      describe("basics", () => {
        describe("successes", () => {
          it("passes if Promise rejects", async () => {
            const target = passTarget();
            const test = new ExpectoPromised(target);
            const result = await test.rejected;
            assert(result instanceof ExpectoPromised);
            assert(result.actual instanceof TestError);
          });
        });

        describe("failures", () => {
          it("fails if target is not a Promise or a function", async () => {
            let test;
            let passed = false;

            test = new ExpectoPromised(42);
            try {
              await test.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");

            test = new ExpectoPromised(new Date());
            try {
              await test.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
          it("fails if Promise fulfills", async () => {
            const target = failNonTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.rejected;
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
        });
      });
    });

    describe(".rejectedWith()", () => {
      const passTarget = () => (Promise.reject(new TestError("I reject")));
      const failNonTarget = () => (Promise.resolve("I fulfill"));
      const failDiffTarget =
        () => (Promise.reject(new RangeError("I reject differently")));

      describe("basics", () => {
        describe("successes", () => {
          it("passes if Promise rejects", async () => {
            const target = passTarget();
            const test = new ExpectoPromised(target);
            const result = await test.rejectedWith();
            assert(result instanceof ExpectoPromised);
            assert(result.actual instanceof TestError);
          });
        });
        describe("failures", () => {
          it("fails if target is not a Promise or a function", async () => {
            let test;
            let passed = false;

            test = new ExpectoPromised(42);
            try {
              await test.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");

            test = new ExpectoPromised(new Date());
            try {
              await test.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
          it("fails if Promise fulfills", async () => {
            const target = failNonTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
          it("throws with message if Promise fulfills", async () => {
            const target = failNonTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.rejectedWith(undefined, "unexpected success");
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
              assert(err.message.includes("unexpected success"));
            }
            assert(!passed, "expected error not thrown");
          });
          it("fails if function fulfills", async () => {
            const test = new ExpectoPromised(failNonTarget);
            let passed = false;

            try {
              await test.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
          it("throws with message if function fulfills", async () => {
            const test = new ExpectoPromised(failNonTarget);
            let passed = false;

            try {
              await test.rejectedWith(undefined, "unexpected success");
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
              assert(err.message.includes("unexpected success"));
            }
            assert(!passed, "expected error not thrown");
          });
        });
      });

      describe("with Error type", () => {
        describe("successes", () => {
          it("passes if Promise rejects with TestError", async () => {
            const target = passTarget();
            const test = new ExpectoPromised(target);
            const result = await test.rejectedWith(TestError);
            assert(result instanceof ExpectoPromised);
            assert(result.actual instanceof TestError);
            assert(result.actual.message === "I reject");
          });
        });
        describe("failures", () => {
          it("fails if Promise rejects with different error", async () => {
            const target = failDiffTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.rejectedWith(TestError);
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
          it("throws with message if Promise rejects with different error", async () => {
            const target = failDiffTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.rejectedWith(TestError, "unexpected result");
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
              assert(err.message.includes("unexpected result"));
            }
            assert(!passed, "expected error not thrown");
          });
          it("fails if function rejects with different error", async () => {
            const test = new ExpectoPromised(failDiffTarget);
            let passed = false;

            try {
              await test.rejectedWith(TestError);
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
          it("throws with message if function rejects with different error", async () => {
            const test = new ExpectoPromised(failDiffTarget);
            let passed = false;

            try {
              await test.rejectedWith(TestError, "unexpected result");
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
              assert(err.message.includes("unexpected result"));
            }
            assert(!passed, "expected error not thrown");
          });
        });
      });
      describe("negated basics", () => {
        describe("successes", () => {
          it("passes if Promise fulfills", async () => {
            const target = failNonTarget();
            const test = new ExpectoPromised(target);
            const result = await test.not.rejectedWith();
            assert(result instanceof ExpectoPromised);
            assert((result.actual as unknown) === "I fulfill");
          });
          it("passes if target is not a Promise or function", async () => {
            let test;
            let result;

            test = new ExpectoPromised(42);
            result = await test.not.rejectedWith();
            assert(result instanceof ExpectoPromised);
            assert(result.actual === test.actual);

            test = new ExpectoPromised(new Date());
            result = await test.not.rejectedWith();
            assert(result instanceof ExpectoPromised);
            assert(result.actual === test.actual);
          });
        });
        describe("failures", () => {
          it("fails if Promise rejects", async () => {
            const target = passTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.not.rejectedWith();
              passed = true;
            } catch (err) {
              assert(err instanceof AssertionError);
            }
            assert(!passed, "expected error not thrown");
          });
        });
      });
      describe("negated with Error type", () => {
        describe("successes", () => {
          it("passes if Promsie fulfills", async () => {
            const target = failNonTarget();
            const test = new ExpectoPromised(target);
            const result = await test.not.rejectedWith(TestError);
            assert(result instanceof ExpectoPromised);
            assert((result.actual as unknown) === "I fulfill");
          });
          it("passes if Promise rejects with different error", async () => {
            const target = failDiffTarget();
            const test = new ExpectoPromised(target);
            const result = await test.not.rejectedWith(TestError);
            assert(result instanceof ExpectoPromised);
            assert(result.actual === target);
          });
        });
        describe("failures", () => {
          it("fails if Promise rejects with TestError", async () => {
            const target = passTarget();
            const test = new ExpectoPromised(target);
            let passed = false;

            try {
              await test.not.rejectedWith(TestError);
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
});
