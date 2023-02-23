/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, equal } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import * as mixin from "../../mod/mixin.ts";
// verifies the expected types are also exported
import type {
  // deno-lint-ignore no-unused-vars
  CheckDetails,
  // deno-lint-ignore no-unused-vars
  ExpectoConstructor,
} from "../../mod/mixin.ts";

describe("mod/mixin", () => {
  it("exports the desired symbols", () => {
    const keys = Object.keys(mixin).sort();
    assert(equal(keys, ["DEEP", "ExpectoBase", "NOT"]));
  });
});
