/**
 * @file Contains the base Expecto wrapper class.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { assert } from "../deps/src/asserts.ts";
import { DEEP, Flags, hasFlag, NOT } from "./flags.ts";

interface CheckDetails {
  message?: string;
  expected?: unknown;
  positiveOp: string;
  negativeOp: string;
}

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
  get also(): this {
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
  get been(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get does(): this {
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
  get of(): this {
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

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get which(): this {
    return this;
  }

  /**
   * Gets this ExpectoBase; helps readability of expect assertions.
   */
  get with(): this {
    return this;
  }

  // ### RE-TARGETING ###

  /**
   * Creates a new Expecto of the same type as this current Expecto, with its
   * actual as `actual`.  All of the flags set on this Expecto are also set
   * on the returned Expecto.
   *
   * @param actual The new actual value
   * @returns a new Expecto of the same type as this Expecto
   */
  protected create<ResultType>(actual: ResultType): this {
    const ctor = Object.getPrototypeOf(this).constructor;
    const result = new ctor(actual);
    result.#flags.apply(this.#flags);

    return result;
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

  /**
   * Checks if the given flag is set.
   *
   * @param name The name of the flag
   * @returns `true` if the flag is set
   */
  protected hasFlag(name: string): boolean {
    return hasFlag(this.#flags, name);
  }

  /**
   * Sets the given flag on this Expecto.
   *
   * @param name The name of the flag
   */
  protected setFlag(name: string) {
    this.#flags.set(name);
  }
  /**
   * Unsets the given flag on this Expecto.
   *
   * @param name The name of the flag
   */
  protected unsetFlag(name: string) {
    this.#flags.unset(name);
  }
  /**
   * Toggles the given flag on this Expecto.
   *
   * @param name The name of the flag
   * @returns `true` if the flag is now set; `false` otherwise
   */
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

  protected check(result: boolean, details: CheckDetails): this {
    const not = this.hasFlag(NOT);
    this.#flags.clear();

    const msg = details.message || (() => {
      const oper = not ? details.negativeOp : details.positiveOp;
      const msg = ("expected" in details)
        ? `${Deno.inspect(this.actual)} ${oper} ${
          Deno.inspect(details.expected)
        }`
        : `${Deno.inspect(this.actual)} ${oper}`;
      return msg;
    })();
    if (not) result = !result;
    assert(result, msg);

    return this;
  }
}

/**
 * Type for the constructor of an ExpectoBase type.
 */
// deno-lint-ignore no-explicit-any
export type ExpectoConstructor<T> = new (...args: any[]) => ExpectoBase<T>;
