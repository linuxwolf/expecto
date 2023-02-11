/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import typing from "../../src/assertions/typing.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/typing", () => {
  describe("mixin ExpectoTyping", () => {
    const ExpectoTyping = typing(ExpectoBase);

    describe(".exists", () => {
      describe("basics", () => {
        it("passes if actual is not undefined or null", () => {
          let test, result;

          test = new ExpectoTyping(true);
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping(123123412341n);
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping(42);
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping("some string");
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping({});
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping([]);
          result = test.exists;
          assert(result === test);
        });
        it("passes on falsy things that do exist", () => {
          let test, result;

          test = new ExpectoTyping(false);
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping(0n);
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping(0);
          result = test.exists;
          assert(result === test);

          test = new ExpectoTyping("");
          result = test.exists;
          assert(result === test);
        });
        it("fails if null", () => {
          const test = new ExpectoTyping(null);
          let passed = false;

          try {
            test.exists;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if undefined", () => {
          const test = new ExpectoTyping(undefined);
          let passed = false;

          try {
            test.exists;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("negated", () => {
        it("passes if null", () => {
          const test = new ExpectoTyping(null);
          const result = test.not.exists;
          assert(result === test);
        });
        it("passes if undefined", () => {
          const test = new ExpectoTyping(undefined);
          const result = test.not.exists;
          assert(result === test);
        });
        it("fails if defined", () => {
          const test = new ExpectoTyping(new Date());
          let passed = false;

          try {
            test.not.exists;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".undefined", () => {
      describe("basics", () => {
        it("passes if undefined", () => {
          const test = new ExpectoTyping(undefined);
          const result = test.undefined;
          assert(result === test);
        });
        it("fails if truthy defined", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(true);
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(42);
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("some string");
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(new Date());
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if falsy defined", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(false);
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(0);
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(null);
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("");
          try {
            test.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });

      describe("negated", () => {
        it("passes if truthy defined", () => {
          let test, result;

          test = new ExpectoTyping(true);
          result = test.not.undefined;
          assert(result === test);

          test = new ExpectoTyping(42);
          result = test.not.undefined;
          assert(result === test);

          test = new ExpectoTyping("some string");
          result = test.not.undefined;
          assert(result === test);

          test = new ExpectoTyping(new Date());
          result = test.not.undefined;
          assert(result === test);
        });
        it("passes if falsy defined", () => {
          let test, result;

          test = new ExpectoTyping(false);
          result = test.not.undefined;
          assert(result === test);

          test = new ExpectoTyping(0);
          result = test.not.undefined;
          assert(result === test);

          test = new ExpectoTyping(null);
          result = test.not.undefined;
          assert(result === test);

          test = new ExpectoTyping("");
          result = test.not.undefined;
          assert(result === test);
        });
        it("fails if undefined", () => {
          const test = new ExpectoTyping(undefined);
          let passed = false;

          try {
            test.not.undefined;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".null", () => {
      describe("basics", () => {
        it("passes on null", () => {
          const test = new ExpectoTyping(null);
          const result = test.null;
          assert(result === test);
        });
        it("throws on truthy not null", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(true);
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(123);
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("some string");
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(new Date());
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws on falsy not null", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(undefined);
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(false);
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(0);
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("");
          try {
            test.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("negated", () => {
        it("passes no truthy not null", () => {
          let test, result;

          test = new ExpectoTyping(true);
          result = test.not.null;
          assert(result === test);

          test = new ExpectoTyping(123);
          result = test.not.null;
          assert(result === test);

          test = new ExpectoTyping("some string");
          result = test.not.null;
          assert(result === test);

          test = new ExpectoTyping(new Date());
          result = test.not.null;
          assert(result === test);
        });
        it("passes on falsy not null", () => {
          let test, result;

          test = new ExpectoTyping(undefined);
          result = test.not.null;
          assert(result === test);

          test = new ExpectoTyping(false);
          result = test.not.null;
          assert(result === test);

          test = new ExpectoTyping(0);
          result = test.not.null;
          assert(result === test);

          test = new ExpectoTyping("");
          result = test.not.null;
          assert(result === test);
        });
        it("throws on null", () => {
          const test = new ExpectoTyping(null);
          let passed = false;

          try {
            test.not.null;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".true", () => {
      describe("basics", () => {
        it("passes on true", () => {
          const test = new ExpectoTyping(true);
          const result = test.true;
          assert(result === test);
        });
        it("throws on falsy", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(undefined);
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(false);
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(0);
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("");
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws on truthy not true", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(42);
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("some string");
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(new Date());
          try {
            test.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("negated", () => {
        it("passes on truthy not true", () => {
          let test;
          let result;

          test = new ExpectoTyping(42);
          result = test.not.true;
          assert(result === test);

          test = new ExpectoTyping("some string");
          result = test.not.true;
          assert(result === test);

          test = new ExpectoTyping(new Date());
          result = test.not.true;
          assert(result === test);
        });
        it("passes on falsy", () => {
          let test;
          let result;

          test = new ExpectoTyping(undefined);
          result = test.not.true;
          assert(result === test);

          test = new ExpectoTyping(false);
          result = test.not.true;
          assert(result === test);

          test = new ExpectoTyping(0);
          result = test.not.true;
          assert(result === test);

          test = new ExpectoTyping("");
          result = test.not.true;
          assert(result === test);
        });
        it("throws on true", () => {
          const test = new ExpectoTyping(true);
          let passed = false;

          try {
            test.not.true;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".false", () => {
      describe("basics", () => {
        it("passes on false", () => {
          const test = new ExpectoTyping(false);
          const result = test.false;
          assert(result === test);
        });
        it("throws on truthy", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(true);
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(42);
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("some string");
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(new Date());
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("throws on falsy not false", () => {
          let test;
          let passed = false;

          test = new ExpectoTyping(undefined);
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping(null);
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          test = new ExpectoTyping("");
          try {
            test.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("negated", () => {
        it("passes on truthy", () => {
          let test;
          let result;

          test = new ExpectoTyping(true);
          result = test.not.false;
          assert(test === result);

          test = new ExpectoTyping(42);
          result = test.not.false;
          assert(test === result);

          test = new ExpectoTyping("some string");
          result = test.not.false;
          assert(test === result);

          test = new ExpectoTyping(new Date());
          result = test.not.false;
          assert(test === result);
        });
        it("passes on falsy not false", () => {
          let test;
          let result;

          test = new ExpectoTyping(undefined);
          result = test.not.false;
          assert(test === result);

          test = new ExpectoTyping(null);
          result = test.not.false;
          assert(test === result);

          test = new ExpectoTyping("");
          result = test.not.false;
          assert(test === result);
        });
        it("throws on false", () => {
          const test = new ExpectoTyping(false);
          let passed = false;

          try {
            test.not.false;
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".NaN", () => {
      describe("basics", () => {
        it("passes if NaN", () => {
          const test = new ExpectoTyping(NaN);
          const result = test.NaN;
          assert(result === test);
        });
        it("fails if number is not NaN", () => {
          const test = new ExpectoTyping(42);
          let caught = true;

          try {
            test.NaN;
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("fails if not a number", () => {
          const test = new ExpectoTyping("some string");
          let caught = true;

          try {
            test.NaN;
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
      });
      describe("negate", () => {
        it("fails if NaN", () => {
          const test = new ExpectoTyping(NaN);
          let caught = true;

          try {
            test.not.NaN;
            caught = false;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(caught, "expected error not thrown");
        });
        it("passes if number is not NaN", () => {
          const test = new ExpectoTyping(42);
          const result = test.not.NaN;
          assert(result === test);
        });
        it("passes if not a number", () => {
          const test = new ExpectoTyping("some string");
          const result = test.not.NaN;
          assert(result === test);
        });
      });
    });

    describe(".typeOf()", () => {
      describe("basics", () => {
        it("passes on correct typeOf", () => {
          let test;
          let result;

          test = new ExpectoTyping(true);
          result = test.typeOf("boolean");
          assert(result === test);

          test = new ExpectoTyping(1234567890n);
          result = test.typeOf("bigint");
          assert(result === test);

          test = new ExpectoTyping(42);
          result = test.typeOf("number");
          assert(result === test);

          test = new ExpectoTyping(() => {});
          result = test.typeOf("function");
          assert(result === test);

          test = new ExpectoTyping("some string");
          result = test.typeOf("string");
          assert(result === test);

          test = new ExpectoTyping({ "foo": "foo value" });
          result = test.typeOf("object");
          assert(result === test);

          test = new ExpectoTyping(["foo", "bar"]);
          result = test.typeOf("object");
          assert(result === test);
        });
        it("fails on incorrect typeOf", () => {
          const test = new ExpectoTyping(new Date());
          let passed = false;

          try {
            test.typeOf("number");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          try {
            test.typeOf("foo");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails on incorrect typeOf, with a custom message", () => {
          const test = new ExpectoTyping(new Date());
          let passed = false;

          try {
            test.typeOf("number", "not a number");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("not a number"));
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("negated", () => {
        it("passes on incorrect typeOf", () => {
          const test = new ExpectoTyping(new Date());
          let result;

          result = test.not.typeOf("boolean");
          assert(result === test);

          result = test.not.typeOf("foo");
          assert(result === test);
        });
        it("fails on correct typeOf", () => {
          const test = new ExpectoTyping(new Date());
          let passed = false;

          try {
            test.not.typeOf("object");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails on correct typeOf, with custom message", () => {
          const test = new ExpectoTyping(new Date());
          let passed = false;

          try {
            test.not.typeOf("object", "not an object");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("not an object"));
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe(".instanceOf()", () => {
      class BaseType {}
      class SubType extends BaseType {}

      const target = new SubType();

      describe("basics", () => {
        it("passes on exact match", () => {
          const test = new ExpectoTyping(target);
          const result = test.instanceOf(SubType);
          assert(result === test);
        });
        it("passes on super match", () => {
          const test = new ExpectoTyping(target);
          let result;

          result = test.instanceOf(BaseType);
          assert(result === test);

          result = test.instanceOf(Object);
          assert(result === test);
        });
        it("fails on no match", () => {
          const test = new ExpectoTyping(target);
          let passed = false;

          try {
            test.instanceOf(Date);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails on no match, with custom message", () => {
          const test = new ExpectoTyping(target);
          let passed = false;

          try {
            test.instanceOf(Date, "not a Date");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("not a Date"));
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("negated", () => {
        it("fails on exact match", () => {
          const test = new ExpectoTyping(target);
          let passed = false;

          try {
            test.not.instanceOf(SubType);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails on exact match, with custom message", () => {
          const test = new ExpectoTyping(target);
          let passed = false;

          try {
            test.not.instanceOf(SubType, "is a SubType");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("is a SubType"));
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails on super match", () => {
          const test = new ExpectoTyping(target);
          let passed = false;

          try {
            test.not.instanceOf(BaseType);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          try {
            test.not.instanceOf(Object);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails on super match, with a custom message", () => {
          const test = new ExpectoTyping(target);
          let passed = false;

          try {
            test.not.instanceOf(BaseType, "is a BaseType");
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
            assert(err.message.includes("is a BaseType"));
          }
          assert(!passed, "expected error not thrown");

          try {
            test.not.instanceOf(Object);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("passes on no match", () => {
          const test = new ExpectoTyping(target);
          const result = test.not.instanceOf(Date);
          assert(result === test);
        });
      });
    });
  });
});
