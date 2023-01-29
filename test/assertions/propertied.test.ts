/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError, fail } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import propertied from "../../src/assertions/propertied.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/propertied", () => {
  const ExpectoPropertied = propertied(ExpectoBase);

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

  describe(".property()", () => {
    describe("basics", () => {
      it("succeeds if actual has own property", () => {
        const test = new ExpectoPropertied(thing);
        const result = test.property("baz");
        assert(result.actual === "baz string");
      });
      it("succeeds if actual has property in its prototype", () => {
        const test = new ExpectoPropertied(thing);
        const result = test.property("bar");
        assert(result.actual === "bar string");
      });
      it("succeeds if actual has property anywhere in its prototype chain", () => {
        const test = new ExpectoPropertied(thing);
        const result = test.property("foo");
        assert(result.actual === "foo string");
      });
      it("fails if actual does not have the property", () => {
        const test = new ExpectoPropertied(thing);

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
          new ExpectoPropertied(true).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(42).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(1234567890n).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied("some string").property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(null).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(undefined).property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");
      });
      it("fails with the given message", () => {
        try {
          new ExpectoPropertied(thing).property("bat", "not property 'bat'");
          fail("expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
          assert(err.message.includes("not property 'bat'"));
        }
      });
    });

    describe("negate", () => {
      it("succeeds if actual does not have property", () => {
        const test = new ExpectoPropertied(thing);
        const result = test.not.property("bat");
        assert(result === test);
      });
      it("fails if actual does have property", () => {
        const test = new ExpectoPropertied(this);

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

        test = new ExpectoPropertied(true);
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoPropertied(42);
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoPropertied(1234567890n);
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoPropertied("foo string");
        result = test.not.property("foo");
        assert(result === test);

        test = new ExpectoPropertied(null);
        result = test.not.property("foo");
        assert(result === test);
      });
    });
  });

  describe(".own", () => {
    describe("basics", () => {
      it("succeeds if actual has own property", () => {
        const test = new ExpectoPropertied(thing).own;
        const result = test.property("baz");
        assert(result.actual === "baz string");
      });
      it("fails if actual has property in prototype chain", () => {
        const test = new ExpectoPropertied(thing);

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
          new ExpectoPropertied(true).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(42).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(1234567890n).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied("foo thing").own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(null).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");

        try {
          new ExpectoPropertied(undefined).own.property("foo");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");
      });
    });
  });
});
