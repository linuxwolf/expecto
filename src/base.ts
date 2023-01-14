/**
 * @file Contains the base Expecto wrapper class.
 *
 * @copyright 2023 Matthew A. Miller
 */

// deno-lint-ignore-file no-explicit-any

import { assert } from "std/testing/asserts.ts";
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
  get a(): any {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get an(): any {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get and(): any {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get be(): any {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get has(): ExpectoBase<T> {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get have(): ExpectoBase<T> {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get is(): ExpectoBase<T> {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get that(): ExpectoBase<T> {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get to(): ExpectoBase<T> {
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

  /**
   * Applies the {@link NOT} flag to subsequent assertions; hints that
   * checks should be negated.
   */
  get not(): any {
    this.#flags.toggle(NOT);
    return this;
  }

  /**
   * Applies the {@link DEEP} flag to subsequent assertions; hints that
   * checks should perform deep comparisons, if applicable.
   */
  get deep(): any {
    this.#flags.set(DEEP);
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
  protected assert(expr: boolean, msg?: string): any {
    this.#flags.clear();

    assert(expr, msg);

    return this;
  }
}

/**
 * Type for the constructor of an ExpectoBase type.
 */
export type ExpectoConstructor<T> = new (...args: any[]) => ExpectoBase<T>;
