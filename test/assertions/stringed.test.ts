/**
 * @copyright 2023 Matthew A. Miller
 */

import {
  assert,
  AssertionError,
  assertThrows,
} from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import stringed from "../../src/assertions/stringed.ts";
import { ExpectoBase } from "../../src/base.ts";

describe("assertions/stringed", () => {
  describe("mixin ExpectoStringed", () => {
    const ExpectoStringed = stringed(ExpectoBase);
    const actual = "this is a string!";

    describe(".substring()", () => {
      describe("basics", () => {
        it("passes if substring is present anywhere", () => {
          const test = new ExpectoStringed(actual);
          const result = test.substring("is a");
          assert(result === test);
        });
        it("passes if is substring", () => {
          const test = new ExpectoStringed(actual);
          const result = test.substring(actual);
          assert(result === test);
        });
        it("fails if substring not present", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.substring("not present"), AssertionError);
        });
        it("fails if substring not present, with custom message", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(
            () => test.substring("not present", "missing!"),
            AssertionError,
            "missing!",
          );
        });
        it("fails if some of substring not present", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(
            () => test.substring("this is not it"),
            AssertionError,
          );
        });
        it("throws TypeError if not a string", () => {
          assertThrows(() => {
            new ExpectoStringed(42).substring("42");
          }, TypeError);
        });
      });
      describe("negaged", () => {
        it("fails if substring is present anywhere", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.not.substring("this is"), AssertionError);
        });
        it("fails if is substring", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.not.substring(actual), AssertionError);
        });
        it("passes if substring not present", () => {
          const test = new ExpectoStringed(actual);
          const result = test.not.substring("not present");
          assert(result === test);
        });
        it("passes if some of substring not present", () => {
          const test = new ExpectoStringed(actual);
          const result = test.not.substring("this is not it");
          assert(result === test);
        });
        it("throws TypeError if not a string", () => {
          assertThrows(() => {
            new ExpectoStringed(42).not.substring("42");
          }, TypeError);
        });
      });
    });

    describe(".startsWith()", () => {
      describe("basics", () => {
        it("passes if substring", () => {
          const test = new ExpectoStringed(actual);
          const result = test.startsWith("this is");
          assert(result === test);
        });
        it("passes if whole", () => {
          const test = new ExpectoStringed(actual);
          const result = test.startsWith(actual);
          assert(result === test);
        });
        it("fails if it doesn't start with", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.startsWith("something else"), AssertionError);
        });
        it("fails if it doesn't start with, with custom message", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(
            () => test.startsWith("something else", "not a prefix"),
            AssertionError,
            "not a prefix",
          );
        });
        it("fails if it starts with some but not all", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.startsWith("this is not"), AssertionError);
        });
        it("throws TypeError if not a string", () => {
          assertThrows(() => {
            new ExpectoStringed(42).startsWith("4");
          }, TypeError);
        });
      });
      describe("negated", () => {
        it("fails if substring", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.not.startsWith("this is"), AssertionError);
        });
        it("fails if whole", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.not.startsWith(actual), AssertionError);
        });
        it("passes if doesn't start with", () => {
          const test = new ExpectoStringed(actual);
          const result = test.not.startsWith("something else");
          assert(result === test);
        });
        it("passes if starts with some but not all", () => {
          const test = new ExpectoStringed(actual);
          const result = test.not.startsWith("this is not");
          assert(result === test);
        });
        it("throws TypeError if not a string", () => {
          assertThrows(() => {
            new ExpectoStringed(42).not.startsWith("something");
          }, TypeError);
        });
      });
    });
    describe(".endsWith()", () => {
      describe("basics", () => {
        it("passes if substring", () => {
          const test = new ExpectoStringed(actual);
          const result = test.endsWith("a string!");
          assert(result === test);
        });
        it("passes if whole", () => {
          const test = new ExpectoStringed(actual);
          const result = test.endsWith(actual);
          assert(result === test);
        });
        it("fails if doesn't end with", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.endsWith("something else"), AssertionError);
        });
        it("fails if doesn't end with, with custome message", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(
            () => test.endsWith("something else", "not a suffix"),
            AssertionError,
            "not a suffix",
          );
        });
        it("fails if ends with some but not all", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.endsWith("not a string!"), AssertionError);
        });
        it("throws TypeError if not a string", () => {
          assertThrows(() => {
            new ExpectoStringed(42).endsWith("2");
          }, TypeError);
        });
      });
      describe("negated", () => {
        it("fails if substring", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.not.endsWith("a string!"), AssertionError);
        });
        it("fails if whole", () => {
          const test = new ExpectoStringed(actual);
          assertThrows(() => test.not.endsWith(actual), AssertionError);
        });
        it("passes if doesn't start with", () => {
          const test = new ExpectoStringed(actual);
          const result = test.not.endsWith("something else");
          assert(result === test);
        });
        it("passes if ends with some but not all", () => {
          const test = new ExpectoStringed(actual);
          const result = test.not.endsWith("not a string!");
          assert(result === test);
        });
        it("throws TypeError if not a string", () => {
          assertThrows(() => {
            new ExpectoStringed(42).not.endsWith("2");
          }, TypeError);
        });
      });
    });
  });
});
