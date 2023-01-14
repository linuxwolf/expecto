/**
 * @file Helper types for defining Mixins
*/

// deno-lint-ignore-file no-explicit-any

// workaround for error TS2545 (from https://stackoverflow.com/a/64493510)
type Properties<BaseType> = BaseType extends new (props: infer P) => any ? P : never
type Instance<BaseType> = BaseType extends new (...args: any[]) => infer I ? I : never

export type MixinConstuctor<A, B> = new (props: Properties<A> & Properties<B>) => Instance<A> & Instance<B>
