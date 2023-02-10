/**
 * @file Exports for testing mocks
 *
 * @copyright 2023 Matthew A. Miller
 */

import mocked from "../src/assertions/mocked.ts";
import { spy, stub, type Spy, type Stub} from "../deps/src/mock.ts";

export default mocked;
export {
  type Spy,
  type Stub,
  spy,
  stub,
}
