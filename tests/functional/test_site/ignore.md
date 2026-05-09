---
title: Ignore blocks test
header-variable: "{{ignore}}{{not-replaced-variable-0}}{{ignore-end}}"
---

# {{title}}

## Ignoring Lighthouse tags from header

{{header-variable}}

## Ignoring Lighthouse tags

{{ignore}}
    {{not-replaced-variable-1}}
{{ignore-end}}

## Nested ignore blocks

{{ignore}}
    {{ignore}}
        {{not-replaced-variable-2}}<br/>
    {{ignore-end}}
    {{foreach var list}}
        {{not-replaced-variable-3}}
    {{foreach-end}}
{{ignore-end}}

## Ignoring blocks being included from another MD file

{{include _include/test_include_d.md}}

## Ignoring Lighthouse tags on code blocks

```
<ul>
{{ignore}}{{foreach role roles}}{{ignore-end}}
    <li>{{ignore}}{{role.name}}{{ignore-end}}</li>
{{ignore}}{{foreach-end}}{{ignore-end}}
</ul>

{{ignore}}
{{i _include/file_a.html}}
{{i _include/file_b.md}}
{{ignore-end}}
```

This works as well on in-line code blocks: `{{ignore}}{{not-replaced-variable-5}}{{ignore-end}}`