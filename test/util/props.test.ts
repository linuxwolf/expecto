/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, equal } from "std/testing/asserts.ts";
import { describe, it } from "std/testing/bdd.ts";

import { findPropertyDescriptor } from "../../src/util/props.ts";

class BaseKind {
  foo() {}
  baz() {}
}

class SubKind extends BaseKind {
  bar() {}
  override baz() {}
}

describe("util/props", () => {
  describe("findPropertyDescriptor()", () => {
    it("finds the descriptor on the object itself", () => {
      // deno-lint-ignore no-explicit-any
      const thing: any = new SubKind();
      const propKey = "stuff";
      thing.stuff = 42;
      const result = findPropertyDescriptor(thing, propKey);
      assert(typeof result !== "undefined");
      assert(equal(result, Object.getOwnPropertyDescriptor(thing, propKey)));
    });
    it("finds the descriptor on the direct class", () => {
      const target = new SubKind();
      const propKey = "bar";
      const result = findPropertyDescriptor(target, propKey);
      assert(typeof result !== "undefined");
      assert(equal(result, Object.getOwnPropertyDescriptor(SubKind.prototype, propKey)));
    });
    it("finds the descriptor of an override method", () => {
      const target = new SubKind();
      const propKey = "baz";
      const result = findPropertyDescriptor(target, propKey);
      assert(typeof result !== "undefined");
      assert(equal(result, Object.getOwnPropertyDescriptor(SubKind.prototype, propKey)));
    });
    it("finds the descriptor from a superclass", () => {
      const target = new SubKind();
      const propKey = "foo";
      const result = findPropertyDescriptor(target, propKey);
      assert(typeof result !== "undefined");
      assert(equal(result, Object.getOwnPropertyDescriptor(BaseKind.prototype, propKey)));
    });
    it("finds the descriptor from Object", () => {
      const target = new SubKind();
      const propKey = "toString";
      const result = findPropertyDescriptor(target, propKey);
      assert(typeof result !== "undefined");
      assert(equal(result, Object.getOwnPropertyDescriptor(Object.prototype, propKey)));
    });
    it("returns undefined if no such property", () => {
      const target = new SubKind();
      const propKey = "notHere";
      const result = findPropertyDescriptor(target, propKey);
      assert(typeof result === "undefined");
    });
  });
});
