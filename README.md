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

- [INSTALLING](#installing)
- [USING](#using)
  - [Predicates and Prepositions](#predicates-and-prepositions)
  - [Flags](#flags)
    - [`deep` flag](#deep-flag)
    - [`not` flag](#not-flag)
  - [`Core` (**std**)](#core-std)
    - [`equal(expected [, message ])` check](#equalexpected--message--check)
    - [`throw([ errorType [, message ] ])` check](#throw-errortype--message---check)
  - [`Typing` (**std**)](#typing-std)
    - [`exists` check](#exists-check)
    - [`undefined` check](#undefined-check)
    - [`null` check](#null-check)
    - [`true` check](#true-check)
    - [`false` check](#false-check)
    - [`NaN` check](#nan-check)
    - [`typeOf(type [, msg ])` check](#typeoftype--msg--check)
    - [`instanceOf(instancClass [, msg ])` check](#instanceofinstancclass--msg--check)
  - [`Membership` (**std**)](#membership-std)
    - [`any` flag](#any-flag)
    - [`all` flag](#all-flag)
    - [`members([ expected[] [, message ] ])` check](#members-expected--message---check)
    - [`own` flag](#own-flag)
    - [`property(name [, message ])` check](#propertyname--message--check)
  - [`Promised` (**std**)](#promised-std)
    - [`eventually` modifier](#eventually-modifier)
    - [`rejected` check](#rejected-check)
    - [`rejectedWith([ errorType [, msg ] ])` check](#rejectedwith-errortype--msg---check)
  - [`Mocked` (**mock**)](#mocked-mock)
    - [`called([ count [, msg ] ])` check](#called-count--msg---check)
    - [`calledWith(args [, msg ])` check](#calledwithargs--msg--check)
- [EXTENDING](#extending)
  - [Performing Checks](#performing-checks)
  - [Helpers](#helpers)

## INSTALLING

Install like most Deno dependencies, by importing the module(s).

There are a handful of entrypoints:

* `mod/index.ts` (**std**) — This is the standard setup; exports `expect` and `use`, initialized with the `core`, `typing`, `membership`, and `promised` assertions.
* `mod/mocked.ts` (**mock**) — This exports the `mocked` assertion mixin that can be applied via `use`, as the [std/testing/mock](https://deno.land/std/testing/mock.ts) implementation it assumes as `mock`.  Requires `mod/index.ts`.

In addition, the following are useful to extend Expecto:

* `mod/mixin.ts` — exports helper types and utilities for creating custom mixins.

## USING

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

Modifies the succeeding check to perform a deep check instead of a strict or shallow check.

```typescript
expect({foo: "foo value"}).to.deep.equal({foo: "foo value"});
```

Multiple instances of `deep` before a check behave as if it were only one specified.

#### `not` flag

Modifies the succeeding check to be negated.

```typescript
expect(() => { doStuff() }).to.not.throw();
```

As with English, two `not`s before an assertion cancel each other out:

```typescript
expect(() => { throw new Error() }).to.not.not.throw(); // NOT RECOMMENDED!
```

### `Core` (**std**)

#### `equal(expected [, message ])` check

Compares that `actual` strictly equals (`===`) the given value.

```typescript
expect(42).to.equal(42);
expect(someObj).to.equal(anotherObj);
```

If `deep` is applied beforehand, then a comprehensive equality check is performed instead.

```typescript
expect(someObj).to.deep.equal({foo: "foo value"});
```

If `not` is applied beforehand, then the check is negated (strictly or deeply).

```typescript
expect(someObj).to.not.equal(anotherObj);
expect(someObj).to.not.deep.equal({bar: "far value"});
```

A custom message can be provided, which will be used if the check fails.

```typescript
expect(someObj).to.equal(anotherObj, "objects aren't the same");
expect(someObj).to.not.equal(diffObj, "shouldn't match, but do");
```

#### `throw([ errorType [, message ] ])` check

Checks that `actual` throws an error when invoked:

```typescript
expect(() => throw new Error("oops")).to.throw();
```

A class derived from `Error` can be provided as the first argument, to check if the thrown error is an instance of that class.

```typescript
expect(() => throw new TypeError("bad type")).to.throw(TypeError);
```

If the check succeeds, the returned `Expecto` has the thrown error instance as its `actual`, so that further checks can be made on the error.

```typescript
expect(() => throw new Error("oops")).to.throw().with.property("message").which.equal("oops");
```

A custom message can be provided as the last argument, which is used if the check fails.

```typescript
expect(() => throw new TypeError("oops")).to.throw(RangeError, "oops");
```

If `not` is applied beforehand, the check is negated (and `actual` is unchanged).

```typescript
expect(() => {}).to.not.throw();
```

This means, if an error type is provided, the check can succeed if `actual` throws a different error type.

```typescript
expect(() => throw new TypeError("oops")).to.not.throw(RangeError); // NOT RECOMMENDED
```

If `actual` is not a function, a `TypeError` is thrown instead of an `AssertionError`.  This occurs regardless if `not` is applied.

```typescript
expect(42).to.throw();      // throws TypeError
expect(42).to.not.throw();  // still throws TypeError
```

### `Typing` (**std**)

#### `exists` check

Checks that `actual` exists: is not `null` nor `undefined`.

```typescript
expect(someValue).to.exist;
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(null).to.not.exist;
expect(undefined).to.not.exist;
```

#### `undefined` check

Checks that `actual` is `undefined`.

```typescript
expect(someValue).to.be.undefined;
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(42).to.not.be.undefined;
expect(null).to.no.be.undefined;
```

#### `null` check

Checks that `actual` is `null`.

```typescript
expect(someValue).to.be.null;
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(42).to.not.be.null;
expect(undefined).to.not.be.null;
```

#### `true` check

Checks that `actual` is the boolean `true`.

```typescript
expect(someValue).to.be.true;
```

It is not enough to be truthy, only `true` will pass.

```typescript
expect(true).to.be.true;            // SUCCEEDS
expect("some value").to.be.true;    // FAILS
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(false).to.not.be.true;
expect("some value").to.not.be.true;
```
#### `false` check

Checks that `actual` is the boolean `false`.

```typescript
expect(someValue).to.be.false;
```

If it not enough to be falsy, only `false` will pass.

```typescript
expect(false).to.be.false;  // SUCCEEDS
expect("").to.be.false;     // FAILS
expect(null).to.be.false;   // FAILS
```

If `not` is applied beforeuand, it negates the check.

```typescript
expect(true).to.not.be.false;
expect("").to.not.be.false;
```

#### `NaN` check

Checks that `actual` is a number and is `NaN`.  This check is necessary since `NaN !== NaN` in Javascript/Typescript!

```typescript
expect(someNumber).is.NaN;  // SUCCEEDS if someNumber is NaN

expect(NaN).to.equal(NaN);  // ALWAYS FAILS!
```

The check fails (throws `AssertionError`) if `actual` is not a number.

```typescript
expect("some string").is.NaN;   // FAILS with AssertionError
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(42).is.not.NaN;
```

#### `typeOf(type [, msg ])` check

Checks that `actual` is of the given type, where `typing` is one of:

* `bigint`
* `boolean`
* `number`
* `object`
* `string`

```typescript
expect(someValue).is.a.typeOf("string");
```

A custom message can be provided, which is used if the check fails.

```typescript
expect(42).is.a.typeOf("string", "not a string!");
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(42).to.not.be.a.typeOf("string");
```

#### `instanceOf(instancClass [, msg ])` check

Checks that `actual` is an instance of the given class.

```typescript
expect(someValue).is.an.instanceOf(SomeClass);
```

A custom message can be provided, which will be used if the check fails.

```typescript
expect(new Date()).is.an.instanceOf(RegExp, "not a Regexp!");
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(new Date()).to.not.be.an.instanceOf(RegExp);
```

### `Membership` (**std**)

#### `any` flag

Modifies the succeeding check to only require one of the members to be present, on a membership check.

```typescript
expect(["foo", "bar"]).to.have.any.members(["foo", "baz", "flag"]);
```

This flag cancels the `all` flag.

#### `all` flag

Modifies the succeeding check to require all of the members to be present, on a membership check.

```typescript
expect(["foo", "bar"]).to.have.all.memebers(["foo", "bar"]);
```

Note that, for `members()`, this is its default behavior; it has no effect other than readability.

This flag cancels the `any` flag.

#### `members([ expected[] [, message ] ])` check

Checks that `actual` is in possession of all of the given members.  The exact behavior depends on the type of `actual`:

* **`Map<K, V>`**: checks that all of the given members are keys on `actual`

    ```typescript
    const someValue = new Map();
    someValue.set("foo", "foo value");
    someValue.set("bar", "bar value");

    ....

    expect(someValue).to.have.members(["foo", "bar"])
    ```

* **`Set<V>`**: checks that all of the given members are contained in Set `actual`

    ```typescript
    const someValue = new Set();
    someValue.add("foo");
    someValue.add("bar");

    ....

    expect(someValue).to.have.members(["foo", "bar"]);
    ```

* **`Array<V>`**: checks that all of the given members are elements in the array `actual`

    ```typescript
    const someValue = ["foo", "bar"];

    ....

    expect(someValue).to.have.members(["foo", "bar"]);
    ```

* **`Object`**: checks that all of the given members are properties on `actual`

    ```typescript
    const someValue = {
        foo: "foo value",
        bar: "bar balue",
    }

    ....

    expect(someValue).to.have.members(["foo", "bar"]);
    ```

If `any` is applied beforehand, it checks that **any _one_** of the values is present.

```typescript
const someValue = ["foo", "bar"];

....

expect(someValue).to.have.any.members(["foo", "baz"]);  // SUCCEEDS
expect(someValue).to.have.any.members(["baz", "flag"]); // FAILS
```

By default a strict comparison is used. If `deep` is applied beforehand, a comprehensive equality comparison is used.

```typescript
const someValue = new Set([
    { foo: "foo value" },
    { bar: "bar value" },
]);

....

expect(someValue).to.have.deep.members([
    { foo: "foo value" },
    { bar: "bar value" },
]);
```

If `not` is applied beforehand, the check is negated.

```typescript
expect({
    foo: "foo value",
    bar: "bar value",
}).to.not.have.members([ "car", "par" ]);
```

#### `own` flag

Modifies the succeeding check to expect `actual` to own the property.

```typescript
expect({foo: "foo value"}).to.have.own.property("foo");
```

#### `property(name [, message ])` check

Checks that `actual` is an object which has the given property.

```typescript
expect(someValue).to.have.property("foo");
```

If `own` is applied beforehand, the check only succeeds if `actual` has the property directly and not from its prototype chain.

```typescript
expect(someValue).to.have.own.property("foo");
```

If the check succeeds, the returned `Expecto` has the property's value as its `actual`, so that further checks can be made on the property.

```typescript
expect(someValue).to.have.property("foo").to.be.a.typeOf("string").which.equal("foo value")
```
A custom message can be provided, which will be used if the check fails.

```typescript
expect({foo: "foo value"}).to.have.property("bar", "no bar!!");
```

If `not` is applied beforehand, it negates the check (and `actual` is unchanged).

```typescript
expect({foo: "foo value"}).to.not.have.property("bar");
```

### `Promised` (**std**)

#### `eventually` modifier

Treats `actual` as a promise and defers all modifiers and checks until that promise is fulfilled.

The returned `Expecto` is essentially a thenable Proxy; all the predicates, flags, and checks applied after `eventually` are resolved when the `Execpto` is resolved (e.g., by `await`ing).

```typescript
await expect(somePromise).to.eventually.be.a.typeOf("string").which.equal("fulfilled!");
```

The ordering of the chain is maintained, just deferred.

#### `rejected` check

Checks that `actual` is a promise that is rejected, asynchronously.  Like `.eventually`, the `Expecto` returned by this check is a thenable Proxy.  The check will actually be performed once the promise is fulfilled (e.g., by `await`ing).

```typescript
await expect(somePromsie).to.be.rejected;
```

If the check succeeds, the returned `Expecto` has the rejection reason as its `actual`, so that further checks can be made on the error.

```typescript
const somePromise = Promise.reject(new Error("oops!"));

....

await expect(somePromise).to.be.rejected.with.property("message").to.equal("oops!");
```

If `not` is applied beforehand, it negates the check; `actual` is changed the resolved value.

```typescript
const somePromise = Promise.resolve("some string");

....

await expect(somePromise).to.not.be.rejected.and.is.typeOf("string");
```

#### `rejectedWith([ errorType [, msg ] ])` check

Checks that `actual` is a promise that is rejected, asynchronously.  Like `.eventually`, the `Expecto` returned by this check is a thenable Proxy.  The check will actually be performed once the promise is fulfilled (e.g., by `await`ing).

```typescript
await expect(somePromise).to.be.rejectedWith();
```

If the check succeeds, the returned `Expecto` has the rejection reason as its `actual`, so that further checks can be made on the error.

```typescript
await expect(somePromise).to.be.rejectedWith().with.property("message").to.equal("oops");
```

A class can be provided as the first argument, to check if the thrown errorr is an instance of that class.

```typescript
await expect(() => Promise.reject(new TypeError("wrong type"))).to.be.rejectedWith(TypeError);
```

A custom message can be provided as the last argument, which is used if the check fails.

```typescript
await expect(() => Promise.reject(new RangeError("out of bounds"))).to.be.rejectedWith(TypeError, "not a type error!");
```

If `not` is applied beforehand, it negates the check.

```typescript
await expect(Promise.resolve("some string")).to.not.be.rejectedWith();
```

**Note** this means the check succeeds if the promise successfully resolved _**or**_ was rejected with a different error!

### `Mocked` (**mock**)

#### `called([ count [, msg ] ])` check

Checks that `actual` is a Spy or Stub and was called.

```typescript
expect(someSpy).to.have.been.called();
```

A count can be provided in the first argument, that checks the spy was called that number of times.

```typescript
someSpy();
someSpy();

....

expect(someSpy).to.have.been.called(2);
```

A custom message can be provided as the last argument, which is used if the check fails.

```typescript
expect(someSpy).to.have.been.called(undefined, "spy never called");
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(someSpy).to.have.not.been.called();
```

**NOTE** the negated check can succeed if a count is provided to `called()` and the spy is called a different number of times (e.g., called 5 times but checking for `.called(3)`)!

If `actual` is not a Spy or Stub, a `TypeError` is thrown istead of an `AssertionError`.  This occurs regardless if `not` is applied.

```typescript
expect(42).to.have.been.called();                   // throws TypeError
expect("some string").to.have.not.been.called();    // still throws TypeError
```

#### `calledWith(args [, msg ])` check

Checks that `actual` is a Spy or Stub that was called with the given arguments.

```typescript
expect(someSpy).to.have.been.calledWith(["foo", "bar"]);
```

If `actual` was called multiple times, this check succeeds if at least one of those calls included the given arguments.  By default this check performs a strict (===) equality check over the arguments.

If `deep` is applied beforehand, a comprehensive equality check of the arguments is performed.

```typescript
someSpy({
    "foo": "foo value",
    "bar": "bar value",
});

expect(someSpy).to.have.been.calledWith([ {"foo": "foo value", "bar": "bar value" }]);      // fails
expect(someSpy).to.have.been.deep.calledWith([ {"foo": "foo value", "bar": "bar value" }]); // succeeds
```

If `not` is applied beforehand, it negates the check.

```typescript
expect(someSpy).to.not.have.been.calledWith(["foo", "bar"]);
```

If `actual` is not a Spy or Stub, a `TypeError` is thrown istead of an `AssertionError`.  This occurs regardless if `not` is applied.

```typescript
expect(42).to.have.been.calledWith([]);                 // throws TypeError
expect("some string").to.have.not.been.calledWith([]);  // still throws TypeError
```

## EXTENDING

Expecto can be extended with additional checks and/or flags using the mixin pattern.

Get started by importing `mod/mixin.ts` module to access the symbols and utilities for developing your own mixins.

To add a custom mixin to Expecto, implement a factory function that takes the current Expecto-derived class and returns a new Expecto-derived class.

```typescript
import type { CheckDetails, ExpectoConstructor } from "https://deno.land/x/expecto/mod/mixin.ts";

import { meetsExpectations } from "./custom.ts";

export function customMixin<TargetType, BaseType extends ExpectoConstructor<TargetType>>(Base: BaseType) {
    return class CustomMixin extends Base {
        constructor(...args: any[]) {
            super(...args);
        }

        cusomCheck(): this {
            let result = meetsExpectations(this.actual);
            this.check(result, {
                positiveOp: "does not meet expectations",
                negativeOp: "meets expectations",
            } as CheckDetails)
            return this;
        }
    };
}


### Performing Checks

The assertion check is performed using `.check(result: boolean, details: CheckDetails)`; `result` is the result to verify, and `details` provides the following:

* `expected`: `unknown` (*OPTIONAL*) — What `actual` is expected to be
* `positiveOp`: `string` — The operation description if a positive (not `.not`) test fails
* `negativeOp`: `string` — The operation description if a negatved (`.not`) test fails
* `message`: `string` (*OPTIONAL*) — The messge—in its entirety—to use if the test fails

The `.check()` method—by default—tests if `result` is truthy, and throws an `AssertionError` if it is not.  If the `not` flag is applied, it instead tests if `result` is falsy, and throws an `AssertionError` if it is not.  If `message` is not provided, the rest of `details` is used to construct the error message.

### Helpers

The following protected members are available to mixins to aid in checks:

* `.flags(): string[]` — Retrieves a snapshot of currently-set flags on this Expecto.  A flag is set if its name is in the returned array.
* `.hasFlag(flag: string): boolean` — Returns `true` if the given flag is set.
* `.setFlag(flag: string)` — Sets the given flag, including it in the values returned by `flags()`.
* `.unsetFlag(flag: string)`— Removes the given flag, excluding it in the values returned by `flags()`.
* `.toggleFlag(flag: string): boolean` — Toggles the given flag; sets it if it was not before, or unsets it if it was; retursn the current state (`true` for set, `false` otherwise).
* `.create<T>(actual: T): this` — Creates a new Expecto of the same type as this Expecto, using `actual` as the target value and with all the flags currently set on this Expecto.
