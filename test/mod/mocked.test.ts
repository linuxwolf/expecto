/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, equal } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import * as mock from "../../mod/mocked.ts";
// verifies the expected types are also exported

describe("mod/mock", () => {
  it("exports the desired symbols", () => {
    const keys = Object.keys(mock).sort();
    assert(equal(keys, ["default", "mock"]));
  });
});
