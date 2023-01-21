/**
 * @file Helper functions and types dealing with Promises.
 *
 * @copyright 2023 Matthew A. Miller
 */

/**
 * Checks if the given value can be treated as a promise.
 * 
 * @param check The value to check could be a promise
 * @returns `true` if `check` can be treated as a promise
 */
// deno-lint-ignore no-explicit-any
export function maybePromise(check: any): boolean {
  return !!check &&
    (typeof check === "object") &&
    (typeof check.then === "function");
}

/**
 * Turns a value into a Promise.
 * 
 * = If `value` is a function; it is called and its return value is converted
 *   to a Promise, or its thrown error is wrapped in a rejected Promise.
 * - If `value` is an Error; it is wrapped in a rejected Promise.
 * - If `value` is a Promise or PromiseLike, it is returned as-is
 * - Otherwise, `value` is wrapped in a fulfilled Promise.
 * 
 * @param value The value to wrap into a promise
 * @returns The wrapped promise, or a function that returns a promise.
 */
// deno-lint-ignore no-explicit-any
export function promisify(value: any): PromiseLike<any> {
  if (maybePromise(value)) {
    // deno-lint-ignore no-explicit-any
    return value as PromiseLike<any>;
  } else if (typeof value === "function") {
    try {
      return promisify(value());
    } catch (err) {
      return Promise.reject(err);
    }
  } else if (value instanceof Error) {
    return Promise.reject(value);
  }

  return Promise.resolve(value);
}

