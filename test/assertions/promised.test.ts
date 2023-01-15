/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError, fail } from "std/testing/asserts.ts";
import { describe, it } from "std/testing/bdd.ts";

import promised from "../../src/assertions/promised.ts";
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

  const ExpectoPromised = promised(ExpectoBase);

  describe(".rejected()", () => {
    const passTarget = () => (Promise.reject(new TestError("I reject")));
    const failNonTarget = () => (Promise.resolve("I fulfill"));
    const failDiffTarget =
      () => (Promise.reject(new RangeError("I reject differently")));

    describe("basics", () => {
      describe("successes", () => {
        it("passes if Promise rejects", async () => {
          const target = passTarget();
          const test = new ExpectoPromised(target);
          const result = await test.rejected();
          assert(result instanceof ExpectoPromised);
          assert(result.actual instanceof TestError);
        });
        it("passes if function rejects", async () => {
          const test = new ExpectoPromised(passTarget);
          const result = await test.rejected();
          assert(result instanceof ExpectoPromised);
          assert(result.actual instanceof TestError);
        });
      });
      describe("failures", () => {
        it("fails if target is not a Promise or a function", async () => {
          let test;

          test = new ExpectoPromised(42);
          try {
            await test.rejected();
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoPromised(new Date());
          try {
            await test.rejected();
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("fails if Promise fulfills", async () => {
          const target = failNonTarget();
          const test = new ExpectoPromised(target);

          try {
            await test.rejected();
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws with message if Promise fulfills", async () => {
          const target = failNonTarget();
          const test = new ExpectoPromised(target);

          try {
            await test.rejected(undefined, "unexpected success");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("unexpected success"));
          }
        });
        it("fails if function fulfills", async () => {
          const test = new ExpectoPromised(failNonTarget);

          try {
            await test.rejected();
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws with message if function fulfills", async () => {
          const test = new ExpectoPromised(failNonTarget);

          try {
            await test.rejected(undefined, "unexpected success");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("unexpected success"));
          }
        });
      });
    });

    describe("with Error type", () => {
      describe("successes", () => {
        it("passes if Promise rejects with TestError", async () => {
          const target = passTarget();
          const test = new ExpectoPromised(target);
          const result = await test.rejected(TestError);
          assert(result instanceof ExpectoPromised);
          assert(result.actual instanceof TestError);
          assert(result.actual.message === "I reject");
        });
        it("passes if function rejects with TestError", async () => {
          const test = new ExpectoPromised(passTarget);
          const result = await test.rejected(TestError);
          assert(result instanceof ExpectoPromised);
          assert(result.actual instanceof TestError);
          assert(result.actual.message === "I reject");
        });
      });
      describe("failures", () => {
        it("fails if Promise rejects with different error", async () => {
          const target = failDiffTarget();
          const test = new ExpectoPromised(target);

          try {
            await test.rejected(TestError);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws with message if Promise rejects with different error", async () => {
          const target = failDiffTarget();
          const test = new ExpectoPromised(target);

          try {
            await test.rejected(TestError, "unexpected result");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("unexpected result"));
          }
        });
        it("fails if function rejects with different error", async () => {
          const test = new ExpectoPromised(failDiffTarget);

          try {
            await test.rejected(TestError);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws with message if function rejects with different error", async () => {
          const test = new ExpectoPromised(failDiffTarget);

          try {
            await test.rejected(TestError, "unexpected result");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("unexpected result"));
          }
        });
      });
    });
    describe("negated basics", () => {
      describe("successes", () => {
        it("passes if Promise fulfills", async () => {
          const target = failNonTarget();
          const test = new ExpectoPromised(target);
          const result = await test.not.rejected();
          assert(result === test);
        });
        it("passes if function fulfills", async () => {
          const test = new ExpectoPromised(failNonTarget);
          const result = await test.not.rejected();
          assert(result === test);
        });
        it("passes if target is not a Promise or function", async () => {
          let test;
          let result;

          test = new ExpectoPromised(42);
          result = await test.not.rejected();
          assert(result === test);

          test = new ExpectoPromised(new Date());
          result = await test.not.rejected();
          assert(result === test);
        });
      });
      describe("failures", () => {
        it("fails if Promise fulfills", async () => {
          const target = failNonTarget();
          const test = new ExpectoPromised(target);

          try {
            await test.not.rejected();
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("fails if function fulfills", async () => {
          const test = new ExpectoPromised(failNonTarget);

          try {
            await test.not.rejected();
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });
    });
    describe("negated with Error type", () => {
      describe("successes", () => {
        it("passes if Promsie fulfills", async () => {
          const target = failNonTarget();
          const test = new ExpectoPromised(target);
          const result = await test.not.rejected(TestError);
          assert(result === test);
        });
        it("passes if function fulfills", async () => {
          const test = new ExpectoPromised(failNonTarget);
          const result = await test.not.rejected(TestError);
          assert(result === test);
        });
        it("passes if Promise rejects with different error", async () => {
          const target = failDiffTarget();
          const test = new ExpectoPromised(target);
          const result = await test.not.rejected(TestError);
          assert(result === test);
        });
        it("passes if function rejects with a different error", async () => {
          const test = new ExpectoPromised(failDiffTarget);
          const result = await test.not.rejected(TestError);
          assert(result === test);
        });
      });
      describe("failures", () => {
        it("fails if Promise rejects with TestError", async () => {
          const target = passTarget();
          const test = new ExpectoPromised(target);

          try {
            await test.not.rejected(TestError);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("fails if function rejects with TestError", async () => {
          const test = new ExpectoPromised(passTarget);

          try {
            await test.not.rejected(TestError);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });
    });
  });
});
