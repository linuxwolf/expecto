/**
 * @file Contains the base Expecto wrapper class.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "../deps/src/asserts.ts";
import { DEEP, Flags, hasFlag, NOT } from "./flags.ts";

/**
 * Base Expecto wrapper class.
 */
export class ExpectoBase<T> {
  /**
   * The value under test.
   */
  readonly actual: T;

  #flags = new Flags();

  /**
   * Creates a new ExpectoBase wrapping the given value.
   *
   * @param actual The value to test.
   */
  constructor(actual: T) {
    this.actual = actual;
  }

  // ### IDENTITY PROPERTIES ###

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get a(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get an(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get and(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get be(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get has(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get have(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get is(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get that(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get to(): this {
    return this;
  }

  // ### FLAGS ###

  /**
   * Exports a snapshot of the flags current applied to this ExpectoBase.
   *
   * **NOTE:** as a snapshot, the array does not change if other flags
   * are later set or unset on this `ExpectoBase`.
   *
   * @returns The array of currently-set flags.
   */
  protected flags(): string[] {
    return new Flags(this.#flags).all();
  }

  protected hasFlag(name: string): boolean {
    return hasFlag(this.#flags, name);
  }

  protected applyFlags(other: ExpectoBase<T>) {
    this.#flags.apply(other.#flags);
  }

  protected setFlag(name: string) {
    this.#flags.set(name);
  }
  protected unsetFlag(name: string) {
    this.#flags.unset(name);
  }
  protected toggleFlag(name: string): boolean {
    return this.#flags.toggle(name);
  }

  /**
   * Applies the {@link NOT} flag to subsequent assertions; hints that
   * checks should be negated.
   */
  get not(): this {
    this.toggleFlag(NOT);
    return this;
  }

  /**
   * Applies the {@link DEEP} flag to subsequent assertions; hints that
   * checks should perform deep comparisons, if applicable.
   */
  get deep(): this {
    this.setFlag(DEEP);
    return this;
  }

  // ### Main Assert ###
  /**
   * Asserts that `expr` evaluates to `true`; if not throws an {@link
   * AssertionError}.
   *
   * @param expr The expression to evaluate.
   * @param [msg] The message if the assertion fails.
   * @returns This `ExpectoBase`
   */
  protected assert(expr: boolean, msg?: string): this {
    this.#flags.clear();

    assert(expr, msg);

    return this;
  }
}

/**
 * Type for the constructor of an ExpectoBase type.
 */
// deno-lint-ignore no-explicit-any
export type ExpectoConstructor<T> = new (...args: any[]) => ExpectoBase<T>;
