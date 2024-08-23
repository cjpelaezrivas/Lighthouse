---
title: If test
visible: true
force_not_visible: false
conditionsA: [true, true, true]
conditionsB: [true, true, false]
conditionsC: [true, false, n/a]
conditionsD: [false, n/a, n/a]
---

# {{title}}

## Block of code visibility

{{if visible}}
  **This text has to be shown**
{{if-end}}

{{if visible}}
  **This tagged block of text has to be shown**
{{if-end visible}}

{{if not_visible}}
  **This text has NOT to be shown**
{{if-end}}

{{if force_not_visible}}
  **This text has NOT to be shown, despite the variable has value**
{{if-end}}

## Selections with if-else

{{if not_visible}}
  **This text has NOT to be shown**
{{if-else}}
  *This text is the if-else section*
{{if-end}}

{{if not_visible}}
  **This text has NOT to be shown**
{{if-else}}
  *This tagged text is the if-else section*
{{if-end not_visible}}

## Inline ifs

{{if visible}}**This tagged block of text has to be shown**{{if-end visible}}

{{if visible}}**This tagged block of text has to be shown**{{if-else}}{{if-end visible}}

{{if visible}}**This tagged block of text has to be shown**{{if-end visible}}

{{if not_visible}}**This text has NOT to be shown**{{if-else}}*This text is the if-else section*{{if-end}}

{{if not_visible}}{{if-else}}*This text is the if-else section*{{if-end}}

## Nested ifs

{{if conditionsA[0]}}
  {{if conditionsA[1]}}
    {{if conditionsA[2]}}
      **Nested text that should be shown**
    {{if-else}}
      **Nested text of if-else section that should NOT be shown**
    {{if-end}}
  {{if-end}}
{{if-end}}

{{if conditionsB[0]}}
  {{if conditionsB[1]}}
    {{if conditionsB[2]}}
      **Nested text that should NOT be shown**
    {{if-else}}
      **Nested text of if-else section that should be shown**
    {{if-end}}
  {{if-end}}
{{if-end}}

{{if conditionsC[0]}}
  {{if conditionsC[1]}}
    {{if conditionsC[2]}}
      **Nested text that should NOT be shown**
    {{if-end}}
  {{if-else}}
    **Nested text of a more external if-else section that should be shown**
  {{if-end}}
{{if-end}}

{{if conditionsD[0]}}
  {{if conditionsD[1]}}
    {{if conditionsD[2]}}
      **Nested text that should NOT be shown**
    {{if-else}}
      **Nested text of if-else section that should NOT be shown**
    {{if-end}}
  {{if-end conditionsD[1]}}
{{if-end}}
