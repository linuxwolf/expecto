import { assert, AssertionError, equal } from "std/testing/asserts.ts";
import { beforeEach, describe, it } from "std/testing/bdd.ts";

import { ExpectoBase } from "../src/base.ts";
import { DEEP, NOT } from "../src/flags.ts";

describe("base", () => {
  class ExpectoUnderTest<T> extends ExpectoBase<T> {
    override exportFlags() { return super.exportFlags(); }
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
        const result = expecto.exportFlags();
        assert(equal(result, []));
      });
      describe(".deep", () => {
        it("sets the DEEP flag", () => {
          assert(!expecto.exportFlags().includes(DEEP));
          assert(expecto.deep === expecto);
          assert(equal(expecto.exportFlags(), [DEEP]));
        });
        it("keeps the DEEP flag once set", () => {
          assert(!expecto.exportFlags().includes(DEEP));

          expecto.deep;
          assert(expecto.exportFlags().includes(DEEP));
          assert(expecto.deep === expecto);
          assert(expecto.exportFlags().includes(DEEP));
        });
      });
      describe(".not", () => {
        it("sets the NOT flag", () => {
          assert(!expecto.exportFlags().includes(NOT));
          assert(expecto.not === expecto);
          assert(expecto.exportFlags().includes(NOT));
        });
        it("toggles the NOT flag on each property access", () => {
          assert(!expecto.exportFlags().includes(NOT));

          assert(expecto.not === expecto);
          assert(expecto.exportFlags().includes(NOT));

          assert(expecto.not === expecto);
          assert(!expecto.exportFlags().includes(NOT));
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
