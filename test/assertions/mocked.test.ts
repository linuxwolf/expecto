/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError } from "../../deps/test/asserts.ts";
import { beforeEach, describe, it } from "../../deps/test/bdd.ts";

import { type Spy, spy } from "../../deps/src/mock.ts";
import mocked from "../../src/assertions/mocked.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/mocked", () => {
  const ExpectoMocked = mocked(ExpectoBase);

  describe("mixin ExpectoMocked", () => {
    const fn = (..._args: unknown[]) => {};
    let spied: Spy;

    beforeEach(() => {
      spied = spy(fn);
    });

    describe(".called()", () => {
      it("throws if actual is not a Spy", () => {
        const test = new ExpectoMocked(fn);
        let caught = true;

        try {
          test.called();
          caught = false;
        } catch (err) {
          assert(err instanceof TypeError);
        }
        assert(caught, "expected error not thrown");
      });

      describe("basics", () => {
        beforeEach(() => {
          spied();
          spied(42);
          spied("foo", "bar");
          spied(["foo", "bar"]);
          spied({
            foo: "foo value",
            bar: "bar value",
          });
        });

        it("passes if actul is called at all", () => {
          const test = new ExpectoMocked(spied);
          const result = test.called();
          assert(result === test);
        });
        it("passes if actual is called the expected number of times", () => {
          const test = new ExpectoMocked(spied);
          const result = test.called(5);
          assert(result === test);
        });
        it("fails if not called", () => {
          spied = spy(fn);

          const test = new ExpectoMocked(spied);
          let caught = true;
          try {
            test.called();
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("fails if not called, with custom message", () => {
          spied = spy(fn);

          const test = new ExpectoMocked(spied);
          let caught = true;
          try {
            test.called(undefined, "never called");
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("never called"));
          }
          assert(caught, "expected error not thrown");
        });
        it("fails if not called the expected number of times", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.called(3);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");

          try {
            test.called(10);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("fails if not called the expected number of times, with custom message", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.called(2, "called too much");
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("called too much"));
          }
          assert(caught, "expected error not thrown");

          try {
            test.called(10, "called too little");
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("called too little"));
          }
          assert(caught, "expected error not thrown");
        });
      });

      describe("negated", () => {
        beforeEach(() => {
          spied();
          spied(42);
          spied("foo", "bar");
          spied(["foo", "bar"]);
          spied({
            foo: "foo value",
            bar: "bar value",
          });
        });

        it("passes if not called", () => {
          spied = spy(fn);

          const test = new ExpectoMocked(spied);
          const result = test.not.called();
          assert(result === test);
        });
        it("passes if not called the expected number of times", () => {
          const test = new ExpectoMocked(spied);
          let result: typeof test;

          result = test.not.called(3);
          assert(result === test);

          result = test.not.called(10);
          assert(result === test);
        });

        it("fails if called at all", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.not.called();
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("fails if called the expected number of times", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.not.called(5);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
      });
    });

    describe(".calledWith()", () => {
      const argsArray = ["foo", "bar"];
      const argsObject = {
        foo: "foo value",
        bar: "bar value",
      };

      beforeEach(() => {
        spied();
        spied(42);
        spied("foo", "bar");
        spied(argsArray);
        spied(argsObject);
      });

      it("throws if actual is not a Spy", () => {
        const test = new ExpectoMocked(fn);
        let caught = true;

        try {
          test.calledWith([]);
          caught = false;
        } catch (err) {
          assert(err instanceof TypeError);
        }
        assert(caught, "expected error not thrown");
      });

      describe("basics", () => {
        it("passes if called with no arguments", () => {
          const test = new ExpectoMocked(spied);
          const result = test.calledWith([]);
          assert(result === test);
        });
        it("passes if called with a single primitive argument", () => {
          const test = new ExpectoMocked(spied);
          const result = test.calledWith([42]);
          assert(result === test);
        });
        it("passes if called with multiple arguments", () => {
          const test = new ExpectoMocked(spied);
          const result = test.calledWith(["foo", "bar"]);
          assert(result === test);
        });
        it("passes if called with an array", () => {
          const test = new ExpectoMocked(spied);
          const result = test.calledWith([argsArray]);
          assert(result === test);
        });
        it("passes if called with an object", () => {
          const test = new ExpectoMocked(spied);
          const result = test.calledWith([argsObject]);
          assert(result === test);
        });
        it("fails if not called with the expected arguments", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.calledWith([1234]);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("fails if not called with the expectd arguments, with custom message", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.calledWith([1234], "not called correctly");
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("not called correctly"));
          }
          assert(caught, "expected error not thrown");
        });
      });

      describe("deep", () => {
        it("it fails on a shallow-checked array", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.calledWith([
              [...argsArray],
            ]);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("succeeds on a deep-checked array", () => {
          const test = new ExpectoMocked(spied);
          const result = test.deep.calledWith([
            [...argsArray],
          ]);
          assert(result === test);
        });

        it("it fails on a shallow-checked object", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.calledWith([
              { ...argsObject },
            ]);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("passes on a deep-checked object", () => {
          const test = new ExpectoMocked(spied);
          const result = test.deep.calledWith([
            { ...argsObject },
          ]);
          assert(result === test);
        });
      });

      describe("negated", () => {
        it("passes if not called with expected arguments", () => {
          const test = new ExpectoMocked(spied);
          const result = test.not.calledWith([1234]);
          assert(result === test);
        });
        it("fails if called with the expected arguments", () => {
          const test = new ExpectoMocked(spied);
          let caught = true;

          try {
            test.not.calledWith([]);
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
      });
    });
  });
});
