---
title: Substitution test
substitution: this part is taken from a variable
multiline_value: "This is line 1<br/>
This is line 2<br/>
This is line 3<br/>"
values:
  deep:
    other_value: other value
list: ["first value", "second value"]
list_with_multiline_values: [
  "first line <br/>
  second line",
  "third line <br/>
  fourth line",
]
---

# {{title}}

This is a text where **{{substitution}}**. In this way, we can check that the substitution are done in a correct way. This *{{values.deep.other_value}}* is taken from a deeper variable.

Next section is taken from a variable whose value has more than one line:
{{multiline_value}}

Here, there is an example of a value taken from a list. This is the second element: -{{list[1]}}-

Now, This is an example of a value taken from a list whose values are multiline. This is the first element: -{{list_with_multiline_values[0]}}-

Finally, this is an example of the use of an unknown variable: {{unknown.variable}}
