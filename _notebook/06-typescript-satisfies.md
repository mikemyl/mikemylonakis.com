---
title:  "Typescript's Satisfies"
permalink: /notebook/typescript-satsifies/
excerpt: "The Satisfies keyword in Typescript"
toc: true
toc_sticky: true
last_modified_at: 2024-07-09T10:00:00-04:00
---

The satisfies keyword in Typescript is used to check if a type satisfies another type.

This is useful when we want to check if a type has a certain set of properties,
or if it implements a certain interface, without changing its original type. This way,
we ensure compatibility with a certain contract, which is useful as it protects us from 
API changes of some 3rd party library code that we are using. It also allows us to maintain the 
most specific type, while still being able to check if it satisfies a more general type.

Example:

```typescript
interface HasId {
    id: string;
}

interface AnimalWithId extends HasId {
    name?: string;
};

const dog: AnimalWithId = {
    id: '1',
    name: 'Rex'
};

dog.name.toUpperCase(); // Error: name can be undefined on the AnimalWithId type'.

const anotherDog = {
    id: '1',
    name: 'Rex'
} satisfies HasId;

anotherDog.name.toUpperCase(); // Okay, name is not undefined. We maintain the most specific type, while adhering to the HasId contract.
````

It also serves as documentation and improves readability.

Example:

```typescript
const meta = {
    title: 'Label',
    component: Label
} satisfies Meta;
```

Now the above example is a typical `default export` when drafting [storybook stories](https://storybook.js.org/docs/writing-stories).

The `satsfies` keyword here protects us from changes in the storybook API. If the API changes, the Typescript compiler
will catch it and we will have a chance to fix our meta variable before it becomes a runtime error.