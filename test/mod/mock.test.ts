/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, equal } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import * as mock from "../../mod/mock.ts";
// verifies the expected types are also exported
// deno-lint-ignore no-unused-vars
import { type Spy, type Stub } from "../../mod/mock.ts";

describe("mod/mock", () => {
  it("exports the desired symbols", () => {
    const keys = Object.keys(mock).sort();
    assert(equal(keys, ["default", "spy", "stub"]))
  });
});
