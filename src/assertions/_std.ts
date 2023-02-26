/**
 * @file Factory method for the standard assertions
 *
 * @copyright 2023 Matthew A. Miller
 */
import { ExpectoConstructor } from "../base.ts";
import core from "./core.ts";
import typing from "./typing.ts";
import membership from "./membership.ts";
import stringed from "./stringed.ts";
import promised from "./promised.ts";

export default function _std<
  T,
  BaseType extends ExpectoConstructor<T>,
>(Base: BaseType) {
  let mixin;

  mixin = Base;
  mixin = core(mixin);
  mixin = typing(mixin);
  mixin = membership(mixin);
  mixin = stringed(mixin);
  mixin = promised(mixin);

  return mixin;
}
