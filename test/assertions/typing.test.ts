/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError, fail } from "std/testing/asserts.ts";
import { describe, it } from "std/testing/bdd.ts";

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

          try {
            test.exists;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("fails if undefined", () => {
          const test = new ExpectoTyping(undefined);

          try {
            test.exists;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          try {
            test.exists;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          test = new ExpectoTyping(true);
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(42);
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("some string");
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(new Date());
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("fails if falsy defined", () => {
          let test;

          test = new ExpectoTyping(false);
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(0);
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(null);
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("");
          try {
            test.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          try {
            test.not.undefined;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          test = new ExpectoTyping(true);
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(123);
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("some string");
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(new Date());
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws on falsy not null", () => {
          let test;

          test = new ExpectoTyping(undefined);
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(false);
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(0);
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("");
          try {
            test.null;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          try {
            test.not.null;
            fail("expected error not null");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          test = new ExpectoTyping(undefined);
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(false);
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(0);
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("");
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws on truthy not true", () => {
          let test;

          test = new ExpectoTyping(42);
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("some string");
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(new Date());
          try {
            test.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          try {
            test.not.true;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          test = new ExpectoTyping(true);
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(42);
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("some string");
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(new Date());
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws on falsy not false", () => {
          let test;

          test = new ExpectoTyping(undefined);
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping(null);
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          test = new ExpectoTyping("");
          try {
            test.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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

          try {
            test.not.false;
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });
    });

    describe(".typeOf", () => {
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
        it("throws on incorrect typeOf", () => {
          const test = new ExpectoTyping(new Date());

          try {
            test.typeOf("number");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          try {
            test.typeOf("foo");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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
        it("throws on correct typeOf", () => {
          const test = new ExpectoTyping(new Date());

          try {
            test.not.typeOf("object");
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });
    });

    describe(".instanceOf", () => {
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
        it("throws on no match", () => {
          const test = new ExpectoTyping(target);

          try {
            test.instanceOf(Date);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
      });
      describe("negated", () => {
        it("throws on exact match", () => {
          const test = new ExpectoTyping(target);

          try {
            test.not.instanceOf(SubType);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
        });
        it("throws on super match", () => {
          const test = new ExpectoTyping(target);

          try {
            test.not.instanceOf(BaseType);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }

          try {
            test.not.instanceOf(Object);
            fail("expected error not thrown");
          } catch (err) {
            assert(err instanceof AssertionError);
          }
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
