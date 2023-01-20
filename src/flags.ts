/**
 * @file Manages flags on Expect wrappers.
 *
 * @copyright 2023 Matthew A. Miller
 */

/**
 * Flag for negating a check.
 */
export const NOT = "not";
/**
 * Flag for deep comparisons in a check.
 */
export const DEEP = "deep";

/** Manages the flags on a specific owning object. */
export class Flags {
  #values: Record<string, boolean> = {};

  constructor(copy?: Flags) {
    if (copy) {
      this.#values = {
        ...copy.#values,
      };
    }
  }

  all(): string[] {
    return Object.entries(this.#values)
      .filter(([_, v]) => !!v)
      .map(([k, _]) => k)
      .sort();
  }

  /**
   * Retrieve the value for the given flag.  This method `false` if not set.
   *
   * @param name The named flag.
   * @returns `true` if the flag is set; `false` otherwise.
   */
  get(name: string): boolean {
    return this.#values[name] || false;
  }
  /**
   * Sets the given flag.
   *
   * @param name The named flag.
   */
  set(name: string) {
    this.#values[name] = true;
  }
  /**
   * Unsets the given flag.
   *
   * @param name The named flag.
   */
  unset(name: string) {
    delete this.#values[name];
  }
  /**
   * Toggles the given flag.  If it was previously `false` or unset, now it is
   * `true`; if it was `true`, not it is `false`.
   *
   * @param name The named flag
   * @returns The current value
   */
  toggle(name: string): boolean {
    const value = !this.get(name);
    if (value) {
      this.set(name);
    } else {
      this.unset(name);
    }
    return value;
  }

  /**
   * Applies all of the set values from the other Flags to this one.
   * 
   * Any values already set on this instance are retained, and all values from
   * `other` are applied on top.
   * 
   * @param other The other Flags to apply from.
   */
  apply(other: Flags) {
    this.#values = {
      ...this.#values,
      ...other.#values,
    };
  }

  /**
   * Clears all of the set flags.
   */
  clear() {
    this.#values = {};
  }
}

export function hasFlag(flags: Flags | string[], name: string): boolean {
  if (flags instanceof Flags) {
    flags = flags.all();
  }

  return flags.includes(name);
}
