---
title:  "Javascript's Event Loop Explained"
excerpt: "Javascript's Event Loop Explained"
header:
    teaser: /assets/images/posts/event_loop_svg.svg
categories:
  - Web
tags:
  - javascript
toc: true
toc_sticky: true
last_modified_at: 2024-08-06T07:06:41-02:00
---

## Introduction

Javascript is a single-threaded language, which means that it can only execute one thing at a time (unlike multi-threaded languages like Java,
where multiple threads can run concurrently). This can be a problem when we have long-running tasks,
because they don't allow anything else - such us DOM events or any user interaction - to happen.

To solve this problem, Javascript allows asynchronous operations, which are non-blocking and allow other code to run while
we are waiting for the asynchronous operation to complete. This is done using the event loop.

## The Event Loop

What event loop does is the following:

1. It processes the call stack - meaning it executes any piece of (synchronous) code that is currently on the stack.
2. It checks the microtask queue. Microtasks are added to the queue when we use `Promise.then` or `Promise.catch`. If there are any microtasks in the queue, they are executed.
   If more microtasks are added to the queue while the event loop is processing them, they are executed immediately. That means that there is a chance that the event loop will never get to the next step.
3. It checks the macrotask queue. Macrotasks are added to the queue when we use `setTimeout`, `setInterval` or `requestAnimationFrame`.
   If there are any macrotasks in the queue, they are executed. Unlike the microtask queue, if more macrotasks are added to the queue while the event loop is processing them, 
   they won't be executed immediately -  but in the next iteration of the event loop instead.

![no-alignment]({{ site.url }}{{ site.baseurl }}/assets/images/posts/event_loop_svg.svg)

## Examples

#### Example 1 - synchronous code before the macrotask

```javascript
setTimeout(() => {console.log("Hi")}, 0)

console.log("Me first!")

// Output:
//  Me first!
//  Hi

```

#### Example 2 - a more complicated scenario

```javascript
function blockForSeconds(seconds) {
   const endTime = Date.now() + (seconds * 1000)
   while(Date.now() < endTime) {}
   console.log(`Blocked - for ${seconds} seconds`)
}

setTimeout(() => {
    console.log("I 'm third")
    let p = new Promise((resolve, reject) => {
        resolve("I 'm fourth")
    })
    p.then((value) => {
        blockForSeconds(2)
        console.log(value)
    })
}, 2000)
setTimeout(() => {console.log("I 'm last")}, 2000)

let p = new Promise((resolve, reject) => {
    blockForSeconds(2)
    resolve("I 'm second")
})
p.then((value) => console.log(value));
console.log("I 'm first")

// Output:
//  I 'm first
//  I 'm second
//  I 'm third
//  I 'm fourth
//  I 'm last
```

1. first line adds a task in the macrotask queue - due in 2 seconds  (event loop is executing synchronous code)
2. the second setTimeout adds another task in the macrotask queue - due in 2 seconds (event loop is executing synchronous code)
3. we then define a Promise, block for 2 seconds, and then have that promise resolve - and we add a microtask in the microtask queue using .then (event loop is executing synchronous code)
4. We console.log "I 'm first" (event loop is still executing synchronous code - even though 2 seconds have passed so the setTimout tasks are due)
5. The event loop checks the microtask queue and executes the microtask that was added in step 3. This microtask blocks for 2 seconds, so the event loop is blocked for 2 seconds. (event loop is executing tasks in microtask queue)
6. No more microtasks, no more sync code, so the event loop checks the macrotask queue and executes the first task that was added in step 1. This macrotask added a Promise (i.e. a microtask). (event loop is executing tasks in macrotask queue)
7. No more sync code,  so the event loop checks the microtask queue and executes the task that was added in the previous step. (event loop is executing tasks in microtask queue)
8. No more microtasks, no more sync code, so the event loop checks the macrotask queue and executes the second task that was added in step 2. (event loop is executing tasks in macrotask queue)

