/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError, equal, fail } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import membership, { ANY, ALL } from "../../src/assertions/membership.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/propertied", () => {
  const ExpectoMembership = membership(ExpectoBase);

  const baseThing = Object.create(null, {
    foo: {
      value: "foo string",
      enumerable: true,
    },
  });
  const subThing = Object.create(baseThing, {
    bar: {
      value: "bar string",
      enumerable: true,
    },
  });
  const thing = Object.create(subThing, {
    baz: {
      value: "baz string",
      enumerable: true,
    },
  });

  describe(".all/.any", () => {
    const ExpectoUnderTest = class ExpectoUnderTest<T> extends ExpectoMembership {
      override flags() {
        return super.flags();
      }
    }

    it("sets the 'all' flag on .all", () => {
      const test = new ExpectoUnderTest(new Date());
      assert(test.all === test);
      assert(equal(test.flags(), [ALL]));
    });
    it("sets the 'any' flag on .any", () => {
      const test = new ExpectoUnderTest(new Date());
      assert(test.any === test);
      assert(equal(test.flags(), [ANY]));
    });
    it("swaps 'any' for 'all'", () => {
      const test = new ExpectoUnderTest(new Date());

      test.all;
      test.any;
      assert(equal(test.flags(), [ANY]));
    });
    it("swaps 'all' for 'any'", () => {
      const test = new ExpectoUnderTest(new Date());

      test.any;
      test.all;
      assert(equal(test.flags(), [ALL]));
    });
  });

  describe(".members()", () => {
    describe("maps", () => {
      const actual = new Map([["foo", "foo value"], ["bar", "bar value"], ["baz", "baz value"], ["flub", "flub value"]]);

      describe("defaults", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if a strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "bar"]);
          assert(result === test);
        });
        it("succeeds if a loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["bar", "flub"]);
          assert(result === test);
        });
        it("fails if some are not present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.members(["bar", "not"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.members(["far", "not"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.members(["bar", "not"]);
          assert(result === test);

          result = test.not.members(["far", "not"]);
          assert(result === test);
        });
        it("fails if negated all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.members(["foo", "bar"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("all", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if a strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "bar"]);
          assert(result === test);
        });
        it("succeeds if a loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["bar", "flub"]);
          assert(result === test);
        });
        it("fails if some are not present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.all.members(["bar", "not"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.all.members(["far", "not"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.all.members(["bar", "not"]);
          assert(result === test);

          result = test.not.all.members(["far", "not"]);
          assert(result === test);
        });
        it("fails if negated all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.all.members(["foo", "bar"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("any", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if any members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["far", "bar", "car", "par"]);
          assert(result === test);
        });
        it("fails is none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.any.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated none are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.not.any.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails is negated some are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.any.members(["bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe("sets", () => {
      const actual = new Set(["foo", "bar", "baz", "flub"]);

      describe("defaults", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if the strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["bar", "baz"]);
          assert(result === test);
        });
        it("succeeds if the loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "baz"]);
          assert(result === test);
        });
        it("fails if some are not present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.members(["bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.members(["bar", "car", "par"]);
          assert(result === test);

          result = test.not.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails if negated all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.members(["foo", "bar"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("all", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if the strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["bar", "baz"]);
          assert(result === test);
        });
        it("succeeds if the loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "baz"]);
          assert(result === test);
        });
        it("fails if some are not present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.all.members(["bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.all.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.all.members(["bar", "car", "par"]);
          assert(result === test);

          result = test.not.all.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails if negated all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.all.members(["foo", "bar"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("any", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if some members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["far", "bar", "car", "par"]);
          assert(result === test);
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.any.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated none are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.not.any.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails if negated some/all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.any.members(["far", "bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          try {
            test.not.any.members(["foo", "bar", "baz", "flub"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe("arrays", () => {
      const actual = [ "foo", "bar", 42, true ];

      describe("defaults", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "bar", 42, true]);
          assert(result === test);
        });
        it("succeeds if the strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["bar", 42]);
          assert(result === test);
        });
        it("succeeds if the loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["bar", true]);
          assert(result === test);
        });
        it("fails if some are not present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;
          try {
            test.members(["not", 42]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;
          try {
            test.members(["not", 5280]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.members(["not", 42]);
          assert(result === test);

          result = test.not.members(["not", 5280]);
          assert(result === test);
        });
      });
      describe("all", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "bar", 42, true]);
          assert(result === test);
        });
        it("succeeds if the strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["bar", 42]);
          assert(result === test);
        });
        it("succeeds if the loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["bar", true]);
          assert(result === test);
        });
        it("fails if some are not present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;
          try {
            test.all.members(["not", 42]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;
          try {
            test.all.members(["not", 5280]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.all.members(["not", 42]);
          assert(result === test);

          result = test.not.all.members(["not", 5280]);
          assert(result === test);
        });
      });
      describe("any", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["foobaz", "bar", 42, true]);
          assert(result === test);
        });
        it("succeeds if any members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["baz", "bar", 5280, false]);
          assert(result === test);
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;
          try {
            test.any.members(["not", 5280]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated non are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.not.any.members(["not", 5280]);
          assert(result === test);
        });
        it("fails if negated some are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.any.members(["not", 42]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe("objects", () => {
      const actual = {
        foo: "foo value",
        bar: "bar value",
        baz: "baz value",
        flub: "flub value",
      };

      describe("defaults", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if a strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["bar", "baz"]);
          assert(result === test);
        });
        it("succeeds if a loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.members(["foo", "baz"]);
          assert(result === test);
        });
        it("fails if some are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.members(["far", "bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.members(["far", "bar", "car", "par"]);
          assert(result === test);

          result = test.not.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails if all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.members(["foo", "bar"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("all", () => {
        it("succeeds if all members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if a strict superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["bar", "baz"]);
          assert(result === test);
        });
        it("succeeds if a loose superset of members are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.all.members(["foo", "baz"]);
          assert(result === test);
        });
        it("fails if some are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.all.members(["far", "bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.all.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated some/none are present", () => {
          const test = new ExpectoMembership(actual);
          let result;

          result = test.not.all.members(["far", "bar", "car", "par"]);
          assert(result === test);

          result = test.not.all.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails if all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.all.members(["foo", "bar"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
      describe("any", () => {
        it("succeeds if all are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["foo", "bar", "baz", "flub"]);
          assert(result === test);
        });
        it("succeeds if any are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.any.members(["far", "bar", "car", "par"]);
          assert(result === test);
        });
        it("fails if none are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.any.members(["far", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
        it("succeeds if negated none are present", () => {
          const test = new ExpectoMembership(actual);
          const result = test.not.any.members(["far", "car", "par"]);
          assert(result === test);
        });
        it("fails if negated some/all are present", () => {
          const test = new ExpectoMembership(actual);
          let passed = false;

          try {
            test.not.any.members(["far", "bar", "car", "par"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");

          try {
            test.not.any.members(["foo", "bar", "baz", "flub"]);
            passed = true;
          } catch (err) {
            assert(err instanceof AssertionError);
          }
          assert(!passed, "expected error not thrown");
        });
      });
    });

    describe("something else", () => {
      it("fails if actual is not an array/map/set/object", () => {
        let passed = false;

        try {
          new ExpectoMembership(true).members(["length", "valueOf"]);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(42).members(["length", "valueOf"]);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(1234567890n).members(["length", "valueOf"]);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership("some string").members(["length", "valueOf"]);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(null).members(["length", "valueOf"]);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(undefined).members(["length", "valueOf"]);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");
      });
      it("succeeds if negated not an array/map/set/object", () => {
        let test, result;

        test = new ExpectoMembership(true);
        result = test.not.members(["length", "valueOf"]);
        assert(result === test);

        test = new ExpectoMembership(42);
        result = test.not.members(["length", "valueOf"]);
        assert(result === test);

        test = new ExpectoMembership(1234567890n);
        result = test.not.members(["length", "valueOf"]);
        assert(result === test);

        test = new ExpectoMembership("some string");
        result = test.not.members(["length", "valueOf"]);
        assert(result === test);

        test = new ExpectoMembership(null);
        result = test.not.members(["length", "valueOf"]);
        assert(result === test);

        test = new ExpectoMembership(undefined);
        result = test.not.members(["length", "valueOf"]);
        assert(result === test);
      });
    });
  });

  describe(".property()", () => {
    describe("basics", () => {
      it("succeeds if actual has own property", () => {
        const test = new ExpectoMembership(thing);
        const result = test.property("baz");
        assert(result.actual === "baz string");
      });
      it("succeeds if actual has property in its prototype", () => {
        const test = new ExpectoMembership(thing);
        const result = test.property("bar");
        assert(result.actual === "bar string");
      });
      it("succeeds if actual has property anywhere in its prototype chain", () => {
        const test = new ExpectoMembership(thing);
        const result = test.property("foo");
        assert(result.actual === "foo string");
      });
      it("fails if actual does not have the property", () => {
        const test = new ExpectoMembership(thing);

        try {
          test.property("bat");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }
      });
      it("fails if actual is not an object", () => {
        let passed = false;

        try {
          new ExpectoMembership(true).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(42).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(1234567890n).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership("some string").property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(null).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(undefined).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");
      });
      it("fails with the given message", () => {
        try {
          new ExpectoMembership(thing).property("bat", "not property 'bat'");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
          assert(err.message.includes("not property 'bat'"));
        }
      });
    });

    describe("negate", () => {
      it("succeeds if actual does not have property", () => {
        const test = new ExpectoMembership(thing);
        const result = test.not.property("bat");
        assert(result === test);
      });
      it("fails if actual does have property", () => {
        const test = new ExpectoMembership(this);

        try {
          test.not.property("baz");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }

        try {
          test.not.property("bar");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }

        try {
          test.not.property("foo");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }
      });
      it("succeeds if actual is not an object", () => {
        let test, result;

        test = new ExpectoMembership(true);
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoMembership(42);
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoMembership(1234567890n);
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoMembership("foo string");
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoMembership(null);
        result = test.not.property("foo");
        assert(result === test);
      });
    });
  });

  describe(".own", () => {
    describe("basics", () => {
      it("succeeds if actual has own property", () => {
        const test = new ExpectoMembership(thing).own;
        const result = test.property("baz");
        assert(result.actual === "baz string");
      });
      it("fails if actual has property in prototype chain", () => {
        const test = new ExpectoMembership(thing);

        try {
          test.own.property("bar");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }

        try {
          test.own.property("foo");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }
      });
      it("fails if actual is not an object", () => {
        let passed = false;

        try {
          new ExpectoMembership(true).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(42).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(1234567890n).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership("foo thing").own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(null).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoMembership(undefined).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");
      });
    });
  });
});
