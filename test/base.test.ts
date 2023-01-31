/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, AssertionError, equal } from "../deps/test/asserts.ts";
import { beforeEach, describe, it } from "../deps/test/bdd.ts";

import { ExpectoBase } from "../src/base.ts";
import { DEEP, NOT } from "../src/flags.ts";

describe("base", () => {
  class ExpectoUnderTest<T> extends ExpectoBase<T> {
    override derived<ResultType>(target: ResultType) {
      return super.derived(target);
    }
    override flags() {
      return super.flags();
    }
    override hasFlag(name: string) {
      return super.hasFlag(name);
    }
    override setFlag(name: string) {
      return super.setFlag(name);
    }
    override unsetFlag(name: string) {
      return super.unsetFlag(name);
    }
    override toggleFlag(name: string) {
      return super.toggleFlag(name);
    }
    override assert(expr: boolean, msg?: string) {
      return super.assert(expr, msg);
    }
  }

  describe("class ExpectoBase", () => {
    const target = new Date();

    describe("ctor", () => {
      it("constructs an ExpectoBase", () => {
        const result = new ExpectoBase(target);
        assert(result.actual === target);
      });
    });

    describe("identity properties", () => {
      it("returns self on identity", () => {
        const expecto = new ExpectoBase(target);
        const chain: (keyof typeof expecto)[] = [
          "a",
          "also",
          "an",
          "and",
          "be",
          "been",
          "does",
          "has",
          "have",
          "is",
          "of",
          "that",
          "to",
          "which",
          "with",
        ];

        for (const c of chain) {
          assert(expecto[c] === expecto);
        }
      });
    });

    describe("flags", () => {
      let expecto: ExpectoUnderTest<typeof target>;

      beforeEach(() => {
        expecto = new ExpectoUnderTest(target);
      });

      it("starts with no flags", () => {
        const result = expecto.flags();
        assert(equal(result, []));
        assert(!expecto.hasFlag(DEEP));
        assert(!expecto.hasFlag(NOT));
      });
      describe(".setFlag() / .unsetFlag() \ .toggleFlag()", () => {
        it("sets/unset an arbitrary flag", () => {
          assert(!expecto.flags().includes("foo"));
          expecto.setFlag("foo");
          assert(expecto.flags().includes("foo"));
          expecto.unsetFlag("foo");
          assert(!expecto.flags().includes("foo"));
        });
        it("toggles an arbitrary flag", () => {
          assert(!expecto.flags().includes("foo"));
          assert(expecto.toggleFlag("foo") === true);
          assert(expecto.flags().includes("foo"));
          assert(expecto.toggleFlag("foo") === false);
          assert(!expecto.flags().includes("foo"));
        });
      });
      describe(".deep", () => {
        it("sets the DEEP flag", () => {
          assert(!expecto.flags().includes(DEEP));
          assert(expecto.deep === expecto);
          assert(equal(expecto.flags(), [DEEP]));
          assert(expecto.hasFlag(DEEP));
        });
        it("keeps the DEEP flag once set", () => {
          assert(!expecto.flags().includes(DEEP));
          assert(!expecto.hasFlag(DEEP));

          assert(expecto.deep === expecto);
          assert(expecto.flags().includes(DEEP));
          assert(expecto.deep === expecto);
          assert(expecto.flags().includes(DEEP));
          assert(expecto.hasFlag(DEEP));
        });
      });
      describe(".not", () => {
        it("sets the NOT flag", () => {
          assert(!expecto.flags().includes(NOT));
          assert(!expecto.hasFlag(NOT));
          assert(expecto.not === expecto);
          assert(expecto.flags().includes(NOT));
          assert(expecto.hasFlag(NOT));
        });
        it("toggles the NOT flag on each property access", () => {
          assert(!expecto.flags().includes(NOT));
          assert(!expecto.hasFlag(NOT));

          assert(expecto.not === expecto);
          assert(expecto.flags().includes(NOT));
          assert(expecto.hasFlag(NOT));

          assert(expecto.not === expecto);
          assert(!expecto.flags().includes(NOT));
          assert(!expecto.hasFlag(NOT));
        });
      });
    });

    describe(".derived()", () => {
      it("creates a derived Expecto with the same type", () => {
        const base = new ExpectoUnderTest(new Date());
        const result = base.derived(42);
        assert(result instanceof ExpectoUnderTest);
        assert(equal(result.flags(), base.flags()));
      });

      it("applies flags from base onto derived", () => {
        const base = new ExpectoUnderTest(new Date());
        base.setFlag("NOT");
        base.setFlag("foo");

        const result = base.derived(42);
        assert(result instanceof ExpectoUnderTest);
        assert(base.flags().length > 0);
        assert(equal(result.flags(), base.flags()));
      });
    });

    describe(".assert()", () => {
      let expecto: ExpectoUnderTest<typeof target>;

      beforeEach(() => {
        expecto = new ExpectoUnderTest(target);
      });

      it("does nothing on success", () => {
        assert(expecto.assert(true) === expecto);
        assert(expecto.assert(true, "oopsie") === expecto);
      });
      it("throws on failure", () => {
        let passed = false;
        try {
          expecto.assert(false);
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
        }
        assert(!passed, "expected error not thrown");
      });
      it("throws with message on failure", () => {
        let passed = false;

        try {
          expecto.assert(false, "oopsie");
          passed = true;
        } catch (err) {
          assert(err instanceof AssertionError);
          assert(err.message.includes("oopsie"));
        }
        assert(!passed, "expected error not thrown");
      });
    });
  });
});
