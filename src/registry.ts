/**
 * @file Defines a registry for Expecto mixins.
 *
 * @copyright 2023 Matthew A. Miller
 */

import { ExpectoBase, ExpectoConstructor } from "./base.ts";

/** Function to register a new Expecto mixin */
export type RegisterFunction<T> = (
  Base: ExpectoConstructor<T>,
) => ExpectoConstructor<T>;

/**
 * Manages the Expecot wrapper mixins and creating instances with all applied
 * mixins.
 */
export class Registry<T> {
  #plugins: Set<RegisterFunction<T>>;
  #Current: ExpectoConstructor<T> = ExpectoBase;

  constructor() {
    this.#plugins = new Set();
  }

  /**
   * The Expecto wrapper type, with all mixins applied.
   */
  get type(): typeof ExpectoBase<T> {
    return this.#Current;
  }

  /**
   * Applies a new mixin within this Registry.
   *
   * @param fn The mixin register to apply.
   */
  apply(fn: RegisterFunction<T>) {
    const plugins = this.#plugins;
    if (!plugins.has(fn)) {
      plugins.add(fn);
      this.#Current = fn(this.#Current);
    }
  }

  /**
   * Creates a new Expecto wrapper over `target`.  This method applies all
   * registered mixins to `ExpectoBase`.
   *
   * @param target The value under test
   * @returns The Expecto wrapper over `target`
   */
  create(target: T): ExpectoBase<T> {
    return new this.#Current(target);
  }
}
