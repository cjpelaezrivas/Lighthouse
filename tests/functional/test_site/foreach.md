---
title: Foreach test
fruits: [ apple, pinnaple, pear, banana, peach ]
brands: [ Nissan, Toyota, Mercedes ]
countries: Spain
person:
  name: John
  age: 23
entries: [ Entry 1, Entry 2 ]
tags: [ tag1, tag2, tag3 ]
links: [
  [path1, text1],
  [path2, text2],
  [path3, text3],
  [path4, text4]
]
objects:
  - name: Object 1
    tags: [tag A, tag B]
  - name: Object 2
    tags: [tag C, tag D]
---

# {{title}}

## Listing elements of a list:

<ul>
  {{foreach fruit fruits}}
    <div>
      <li>{{fruit}}</li>
    </div>
  {{foreach-end}}
</ul>

## Listing elements of a list using tag:

<ul>
  {{foreach brand brands}}
    <li>{{brand}}</li>
  {{foreach-end brands}}
</ul>

## Listing elements of a list declared as a single element:

<ul>
  {{foreach country countries}}
    <div>
      <li>{{country}}</li>
    </div>
  {{foreach-end}}
</ul>

## Listing elements of an object list declared as a single element:

<ul>
  {{foreach person person}}
    <div>
      <li>{{person}}</li>
    </div>
  {{foreach-end}}
</ul>

## Inline foreachs:

<ul>
  {{foreach fruit fruits}}<div><li>{{fruit}}</li></div>{{foreach-end}}
</ul>

## Empty foreach:

<ul>
  {{foreach fruit fruits}}{{foreach-end}}
</ul>

## Nested bucles:

{{foreach entry entries}}
  ### {{entry}}
  <ul>
    {{foreach tag tags}}
      <li>{{tag}}</li>
    {{foreach-end tags}}
  </ul>
{{foreach-end entries}}

## Nested bucles 2:

{{foreach entry entries}}
  ### {{entry}}
  <ul>
    {{foreach tag tags}}
      <li>{{tag}}</li>
    {{foreach-end}}
  </ul>
{{foreach-end entries}}

## Nested bucles 3:

{{foreach entry entries}}
  ### {{entry}}
  <ul>
    {{foreach tag tags}}
      <li>{{tag}}</li>
    {{foreach-end tags}}
  </ul>
{{foreach-end}}

## Nested bucles 4:

{{foreach entry entries}}
  ### {{entry}}
  <ul>
    {{foreach tag tags}}
      <li>{{tag}}</li>
    {{foreach-end}}
  </ul>

{{foreach-end}}

## Accessing to different parts of an element:

{{foreach link links}}
  <a href="{{link[0]}}">{{link[1]}}</a>
{{foreach-end}}

## Accessing to different parts of an element B:

{{foreach object objects}}
  ### {{object.name}}
  <ul>
    {{foreach tag object.tags}}
      <li>{{tag}}</li>
    {{foreach-end object.tags}}
  </ul>
{{foreach-end objects}}

## Accessing to different parts of an element B 2:

{{foreach object objects}}
  ### {{object.name}}
  Tags:
  <ul>
    {{foreach tag object.tags}}
      <li>{{tag}}</li>
    {{foreach-end}}
  </ul>
{{foreach-end objects}}

## Incorrect use of bucles for accessing to different parts of an element B:

{{foreach object objects}}
  ### {{object.name}}
  Tags:
  <ul>
    {{foreach tag object.tags}}
      <li>{{tag}}</li>
    {{foreach-end}}
  </ul>
{{foreach-end}}
