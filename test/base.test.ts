import { assert, AssertionError, equal } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";

import { ExpectoBase } from "../src/base.ts";
import { DEEP, NOT } from "../src/flags.ts";

describe("base", () => {
  class ExpectoUnderTest<T> extends ExpectoBase<T> {
    override flags() { return super.flags(); }
    override hasFlag(name: string) { return super.hasFlag(name); }
    override assert(expr: boolean, msg?: string) { return super.assert(expr, msg); }
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
        assert(expecto.a === expecto);
        assert(expecto.an === expecto);
        assert(expecto.and === expecto);
        assert(expecto.be === expecto);
        assert(expecto.has === expecto);
        assert(expecto.have === expecto);
        assert(expecto.is === expecto);
        assert(expecto.that === expecto);
        assert(expecto.to === expecto);
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
        try {
          expecto.assert(false);
          assert(false, "expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
        }
      });
      it("throws with message on failure", () => {
        try {
          expecto.assert(false, "oopsie");
          assert(false, "expected error not thrown");
        } catch (err) {
          assert(err instanceof AssertionError);
          assert(err.message.includes("oopsie"));
        }
      });
    });
  });
});
