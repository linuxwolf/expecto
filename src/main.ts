/**
 * @file Primary exported interface
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoBase } from "./base.ts";
import { RegisterFunction, Registry } from "./registry.ts";
import _std from "./assertions/_std.ts";

let registry: Registry<unknown>;
reset();

/**
 * Registers the given support onto the Expecto
 *
 * @param register The factory to register
 */
export function use<T>(register: RegisterFunction<T>) {
  registry.apply(register as RegisterFunction<unknown>);
}

/**
 * Creates an Expecto wrapping `actual` for testing. The created Expecto has
 * all the plugins registered via `use` applied.
 *
 * @param actual The value to test
 * @returns An Expecto wrapping `actual`
 */
// deno-lint-ignore no-explicit-any
export function expect<T>(actual: T): any {
  return registry.create(actual);
}

/**
 * Resets the plugins back to only the standard-issue set.
 *
 * @private
 */
export function reset() {
  registry = new Registry<unknown>();
  registry.apply(_std);
}
