# EXPECTO!

An assertion library with an "expect" style interface, inspired by [Chai's](https://www.chaijs.com/api/bdd/) and built for [Deno](https://deno.land).  This is not a one-for-one clone of Chai; rather it is the subset that the authors find most useful with semantics the authors find most intuitive.

It wraps the value under test to provide a collection of properties and methods for chaining assertions.

```typescript
import { expect } from "https://deno.land/x/expecto/mod/index.ts";

Deno.test(() => {
    expect(42).to.equal(42);

    expect({foo: "foo value"}).to.deep.equal({foo: "foo value"});
});

```

## INSTALLING

Install like most Deno dependencies, by importing the module(s).

There are a handful of entrypoints:

* `mod/index.ts` (**std**) — This is the standard setup; exports `expect` and `use`, initialized with the `core`, `typing`, `membership`, and `promised` assertions.
* `mod/mocked.ts` (**mock**) — This exports the `mocked` assertion mixin that can be applied via `use`, as the [std/testing/mock](https://deno.land/std/testing/mock.ts) implementation it assumes as `mock`.  Requires `mod/index.ts`.

In addition, the following are useful to extend Expecto:

* `mod/mixin.ts` — exports helper types and utilities for creating custom mixins.

## USAGE

Assertions are made by calling `expect()` with the value under test (`actual`) then chaining properties for assertion checks.

Additional checks and properties can be applied using `use()`.

```typescript
use(mocked);
use(customMixin);

Deno.test(() => {
    const spied = mocked.spy(nestedFunc);

    const result = topFunc();
    expect(result).to.customCheck();
    expect(spied).to.be.called(1).and.calledWith(["foo", "bar"]);
});
```

### Predicates and Prepositions

The following predicates only return the current instance of `Expecto`; they assist with the readility of assertions.

* `a` / `an`
* `also`
* `and`
* `be`
* `been`
* `does`
* `has` / `have`
* `is`
* `of`
* `that`
* `to`
* `which`
* `with`

### Flags

The following "flag" properties are used to modify the assertion that follows them.  There are two built-in flags, and mixins can provide others.

Some important notes:

* Not all modifiers are supported by all assertions
* Once an assertion is processed in a chain, all previously-set flags are cleared

#### `deep` flag

Modifies the succeeding assertion to perform a deep check instead of a strict or shallow check.

```typescript
expect({foo: "foo value"}).to.deep.equal({foo: "foo value"});
```

Multiple instances of `deep` before a check behave as if it were only one specified.

#### `not` flag

Modifies the succeeding assertion to be negated.

```typescript
expect(() => { doStuff() }).to.not.throw();
```

As with English, two `not`s before an assertion cancel each other out:

```typescript
expect(() => { throw new Error() }).to.not.not.throw(); // NOT RECOMMENDED!
```

### `Core` (**std**)

#### `equal(e[, msg])` check

Compares that `actual` strictly equals (`===`) the given value.

```typescript
expect(42).to.equal(42);
expect(someObj).to.equal(anotherObj);
```

If `deep` is applied beforehand, then a deep equality check is performed instead.

```typescript
expect(someObj).to.deep.equal({foo: "foo value"});
```

If `not` is applied beforehand, then the check is negated (strictly or deeply).

```typescript
expect(someObj).to.not.equal(anotherObj);
expect(someObj).to.not.deep.equal({bar: "far value"});
```

A custom message can be provided, which will be used if the assertion fails.

```typescript
expect(someObj).to.equal(anotherObj, "objects aren't the same");
expect(someObj).to.not.equal(diffObj, "shouldn't match, but do");
```

#### `throw([errorType[, msg]])` check

Checks that `actual` throws an error when invoked:

```
expect(() => throw new Error("oops")).to.throw();
```

A class derived from `Error` can be provided as the first argument, to check if the thrown error is an instance of that class.

```typescript
expect(() => throw new TypeError("bad type")).to.throw(TypeError);
```

If the check succeeds, the returned `Expecto` switches `actual` to the error instance thrown, so further checks can be made.

```typescript
expect(() => throw new Error("oops")).to.throw().with.property("message").which.equal("oops");
```

The check can have a custom message as the last argument, which is used if the check fails.

```typescript
expect(() => throw new TypeError("oops")).to.throw(RangeError, "oops");
```

If `not` is applied beforehand, the check is negated.

```typescript
expect(() => {}).to.not.throw();
```

This means, if an error type is provided, the check can succeed if `actual` throws a different error type.

```typescript
expect(() => throw new TypeError("oops")).to.not.throw(RangeError); // NOT RECOMMENDED
```

If `actual` is not a function, a `TypeError` is thrown instead of an `AssertionError`.  This occurs regardless if `not` is applied.

```typescript
expect(42).to.throw();
```

### `Typing` (**std**)

### `Membership` (**std**)

### `Promised` (**std**)

### `Mocked` (**mock**)

## EXTENDING
