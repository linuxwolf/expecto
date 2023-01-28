/**
 * @copyright 2023 Matthew A. Miller
 */

import { assert, equal } from "../../deps/test/asserts.ts";
import { describe, it } from "../../deps/test/bdd.ts";

import * as index from "../../mod/index.ts";

describe("mod/index", () => {
  it("exports the desired symbols", () => {
    assert(equal(Object.keys(index).sort(), ["expect", "use"]));
  });
});
