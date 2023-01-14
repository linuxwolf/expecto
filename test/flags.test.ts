/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, equal } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";

import { Flags, hasFlag } from "../src/flags.ts";

describe("flags", () => {
  describe("class Flags", () => {
    describe("ctor", () => {
      it("constructs an empty Flags", () => {
        const result = new Flags();
        assert(equal(result.all(), []));
      });
      it("constructs a copy", () => {
        const flags = new Flags();
        flags.set("foo");
        flags.set("bar");
        flags.set("baz");

        const result = new Flags(flags);
        assert(equal(result.all(), flags.all()));
      });
    });
    describe("values", () => {
      let flags: Flags;

      beforeEach(() => {
        flags = new Flags();
      });

      it("get()s / set()s / unset()s a flag", () => {
        assert(!flags.get("foo"));
        flags.set("foo");
        assert(flags.get("foo"));
        flags.unset("foo");
        assert(!flags.get("foo"));
        flags.set("foo");
        assert(flags.get("foo"));
      });
      it("toggle()s a flag", () => {
        assert(!flags.get("foo"));

        assert(flags.toggle("foo"));
        assert(flags.get("foo"));

        assert(!flags.toggle("foo"));
        assert(!flags.get("foo"));
      });

      it("clear()s all values", () => {
        const flags = new Flags();
        flags.set("foo");
        flags.set("deep");
        flags.set("negate");
        assert(equal(flags.all(), ["deep", "foo", "negate"]));
        assert(flags.get("foo"));
        assert(flags.get("deep"));
        assert(flags.get("negate"));

        flags.clear();
        assert(!flags.get("foo"));
        assert(!flags.get("deep"));
        assert(!flags.get("negate"));
      });
    });
  });

  describe("hasFlag()", () => {
    let flags: Flags;

    beforeEach(() => {
      flags = new Flags();
      flags.set("foo");
    });

    it("checks a Flags if name is set", () => {
      assert(hasFlag(flags, "foo"));
      assert(!hasFlag(flags, "bar"));
    });
    it("checks an array if name is set", () => {
      assert(hasFlag(flags.all(), "foo"));
      assert(!hasFlag(flags.all(), "bar"));
    });
  });
});
