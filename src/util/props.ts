/**
 * @file Property utility functions and variables.
 * 
 * @copyright 2023 Matthew A. Miller
 */

/**
 * Find the PropertyDescriptor in the given target or any of its superclasses.
 * 
 * @param target The target to search 
 * @param propKey The name or symbol of the property to describe
 * @returns The `PropertyDescriptor` or `undefined` if not found
 */
export function findPropertyDescriptor<T>(target: T, propKey: string | symbol): PropertyDescriptor | undefined {
  const desc = Object.getOwnPropertyDescriptor(target, propKey);
  if (!desc) {
    const proto = Object.getPrototypeOf(target);
    if (!proto) { return undefined; }
    return findPropertyDescriptor(proto, propKey);
  }

  return desc;
}

