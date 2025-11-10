---
title: "Go Style Guide"
permalink: /notebook/go-style-guide
excerpt: "Guidelines for writing Idiomatic Go code"
toc: true
toc_sticky: true
last_modified_at: 2025-08-11T10:00:00-04:00
---

Mainly notes from the
book [100 Go Mistakes and How to Avoid Them](https://www.manning.com/books/100-go-mistakes-and-how-to-avoid-them)

### Happy path on the left, errors and edge cases on the right

```go
// Bad
if val == 42 {
  doStuff()
} else {
  return errors.New("val is not 42")
}

// Good
if val != 42 {
  return errors.New("val is not 42")
} 
doStuff()
```

### If an if block returns, don't add else (see above)

### Avoid shadowing variables

Leads to confusion, nasty bugs.

```golang
//Bad
var f *File
if (customFileName != nil) {
    r, err := os.Open(customFileName)
    if err != nil {
        // handle error
    }
} else  {
    f, err := os.Open(defaultFileName)
    if err != nil {
        // handle error
    }
}

//Good
var f *File
var err error
if (customFileName != nil) {
    f, err = os.Open(customFileName)
} else  {
    f, err = os.Open(defaultFileName)
}
if err != nil {
    // handle error
}
```

### Avoid using init functions

They make testing and code understanding more difficult (harder to reason about state). They can potentially depend on
the
filename ordering if a package has multiple init functions (so subject to renaming files).

### Interfaces on the Consumer Side

Go satisfies interfaces implicitly (there's no `implements` keyword or anything like that).

This allows for the consumer to define its own interface, exactly as it needs it. The producer can satisfy that
interface
implicitly, without needing to depend on the consumer's package.

This leads to better abstractions and interface segregation.

### Use the functional options pattern

In languages like java, it's very common to use chained setters (variations of the builder pattern) to configure objects.
That could work in go, but it limits us if we want to do any sort of validation in those setters. Returning an error from
a setter would mean that they can no longer be chained. 

Other languages have optional parameters (go doesn't have them).

A workaround would be to require a config struct (an empty one would mean that defaults are applied), but that is still not 
ideal, as it requires client changes every time we add a new field to the config struct (even if it's unused by the client).

The functional options pattern allows us to have optional parameters, and also to validate them, while maintaining a 
convenient api

```go

type options struct {
   config1 *int 
   config2 int  
}

type Option func(options *options) error

func WithConfig1(config1 int) Option {
   return func(options *options) error {
      options.config1 = &config1
      return nil
   }
}

func WithConfig2(config2 int) Option {
   return func(options *options) error {
      if config2 < 0 {
         return errors.New("config2 must be positive")
      }
      options.config2 = config2
      return nil
   }
}

func NewThing(options ...Option) (*Thing, error) {
   opts := &options{}
   for _, opt := range options {
      if err := opt(opts); err != nil {
         return nil, err
      }
   }
   var config1 int
   if opts.config1 == nil {
      config1 = someDefaultValue()
   }
   return &Thing{config1, opts.config2}, nil
}

```
