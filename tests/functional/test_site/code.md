
---
title: Code test
name: Clippy
---

# {{title}}

## In-line code

This file us used to test code output, `like this one`.

## Code blocks

Bellow this line, there are a couple of code blocks.

Generic code block:

```
console.log("Hello, world!");
```

Syntax specified code block:

```java
class Programa {
    private static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

## Tags are replaced inside code

```js
console.log("Hello, {{name}}!");
```

## Loading files to be shown as code

```yaml
{{i _include/external_config/external_config_1.yaml}}
```