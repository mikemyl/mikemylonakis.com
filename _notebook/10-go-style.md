---
title: "Go Style Guide"
permalink: /notebook/go-style-guide
excerpt: "Guidelines for writing Idiomatic Go code"
toc: true
toc_sticky: true
last_modified_at: 2025-08-11T10:00:00-04:00
---

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

They make testing and code understanding more difficult (harder to reason about state). They can potentially depend on the
filename ordering if a package has multiple init functions (so subject to renaming files).


### Interfaces on the Consumer Side

Go satisfies interfaces implicitly (there's no `implements` keyword or anything like that).

This allows for the consumer to define its own interface, exactly as it needs it. The producer can satisfy that interface
implicitly, without needing to depend on the consumer's package.

This leads to better abstractions and interface segregation.