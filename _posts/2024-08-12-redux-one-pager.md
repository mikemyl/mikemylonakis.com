---
title:  "Redux One Pager"
excerpt: "A one-page overview of Redux"
header:
    teaser: /assets/images/posts/redux.png
categories:
  - Web
tags:
  - javascript
  - redux
toc: true
toc_sticky: true
last_modified_at: 2024-08-12T07:06:41-02:00
---

![no-alignment]({{ site.url }}{{ site.baseurl }}/assets/images/posts/redux.png)


## Introduction

Redux is a JavaScript library for managing application state. In simple terms, it works like this:

- The state of the whole application is stored in an single-store object. 
- The way to change a piece state is using an action, an object describing what happened.
- The action is then processed by one or more reducers, which are functions that take some piece of state and the action and return the updated state.

## Redux API

Redux is a tiny library, with a very small API surface. Here are the main functions:

- `compose`
- `createStore`
- `applyMiddleware`
- `combineReducers`
- `bindActionCreators`

### compose

`compose` is a utility function that takes any number of functions and combines them into a single function that is the
equivalent of calling each function in turn.

```javascript
const lower = (s) => s.toLowerCase();
const addUnderscore = (s) => s + "_";
const repeatThreeTimes = (s) => s + s + s;

// Instead of this:
repeatThreeTimes(lower(addUnderscore("foo")))

// We can define this:
const addUnderscoreLowerRepeatThreeTimes = compose(
    repeatThreeTimes,
    lower,
    addUnderscore
);

// And then use it like this:
addUnderscoreLowerRepeatThreeTimes("foo");
```

### createStore

{% capture notice-type %}
Note that this function is marked as deprecated - `configureStore` from [redux-toolkit](https://redux-toolkit.js.org/api/configureStore)
should be used instead.
{% endcapture %}

<div class="notice--info">{{ notice-type | markdownify }}</div>

`createStore` is the function that creates the Redux store, which is the object that holds the state of the application.

To create that store we need to give it a reducer. As described earlier, a reducer is a function that takes the current state and the action that took place,
and returns the new state. Here's a basic example:

```javascript
const initialState = { value: 0 };

const ADD = "ADD";

const add = (num) => ({ type: ADD, payload: num });

const reducer = (state = initialState, action) => {
    if (action.type === ADD) {
        return { value: state.value + action.payload };
    }
    // If the action is not recognized, return the current state
    return state;
};

const store = createStore(reducer);
```

Once we have the store, we can call the following functions on it:

- `getState` - returns the current state of this store
- `dispatch` - dispatches an action to the store
- `subscribe` - adds a listener that will be called every time an action is dispatched
- `replaceReducer` - replaces the reducer function of the store

#### store.getState

`getState` is a function that returns the current state of the store.

```javascript
const store = createStore(reducer);

console.log(store.getState());
````

#### store.dispatch

As its name suggests, `dispatch` is the function that dispatches an action to the store. This action is an object that describes what happened. At a minimum,
it should have a `type` property, which is a string that describes the action. It can optionally have a `payload` property (like the `ADD` action above).

```javascript

const store = createStore(reducer);

console.log(store.getState());
// { value: 0 }
store.dispatch(add(2));

console.log(store.getState());
// { value: 2 }
```

#### store.subscribe

`subscribe` is a function that adds a listener that will be called every time an action is fired. Calling `subscribe` returns a function that can be called to
unsubscribe:

```javascript
const subscriber = () => console.log("Store Updated: " + store.getState().value);

const unsubscribe = store.subscribe(subscriber);

store.dispatch(add(2));
// Store Updated: 2

unsubscribe();

store.dispatch(add(3));
// Nothing happens
```

#### store.replaceReducer

`replaceReducer` is a function that replaces the reducer function of the store. This is not very commonly used, but it can be useful in some cases, such as hot-reloading:

```javascript
store.dispatch(add(2));

console.log(store.getState());
// { value: 2 }

const newReducer = (state = { value: 0 }, action) => {
    if (action.type === ADD) {
        return { value: state.value - action.payload };
    }
    return state;
};

store.replaceReducer(newReducer);

store.dispatch(add(2));

console.log(store.getState());
// { value: 0 }
```

### applyMiddleware

`applyMiddleware` is a function that takes a list of middleware functions and combines them together to form an `enhancer`. An enhancer is a
function that takes the `createStore` function and returns a new `createStore` function that applies the middleware.

```javascript

const logger = (store) => (next) => (action) => {
    console.log("Action: ", action);
    // Before the action is handled or the next middleware function.
    const result = next(action);
    // After the action is handled
    console.log("State: ", store.getState());
    return result;
};

const store = createStore(reducer, applyMiddleware(logger));
```


### combineReducers

As the number of actions in an application grows, it becomes harder to manage them all in a single reducer. It is therefore 
common to split the reducer into multiple smaller reducers, each managing a different piece of state.

The problem is that `createStore` expects a single reducer function. `combineReducers` is a function that takes an object with reducers and returns a single reducer.


```javascript
const counterReducer = (state = { value: 0 }, action) => {
    if (action.type === "ADD") {
        return { value: state.value + action.payload };
    }
    return state;
};

const userReducer = (state = { name: "John" }, action) => {
    if (action.type === "CHANGE_NAME") {
        return { name: action.payload };
    }
    return state;
};

const rootReducer = combineReducers({
    counter: counterReducer,
    user: userReducer
});

const store = createStore(rootReducer);
```


### bindActionCreators

Every time we want to dispatch our `add` action, we need to call `store.dispatch(add(2))`. This can be a bit cumbersome,
especially if we have a lot of actions in our app. `bindActionCreators` is a function that takes an object with action creators and the store's `dispatch` function,
and returns an object with the same keys, but with the `dispatch` function already called:

```javascript

const actionCreators = {
    add,
    subtract: (num) => ({ type: "SUBTRACT", payload: num })
};

const actions = bindActionCreators(actionCreators, store.dispatch);

actions.add(2); // instead of store.dispatch(add(2))
actions.subtract(3); // instead of store.dispatch(subtract(3))
```

