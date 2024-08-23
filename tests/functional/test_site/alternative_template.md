---
title: A more complex example with an alternative template test
author: [ 'Author 1', 'Author 2' ]
document:
  template: _templates/alternative.html
  include:
    before_body: [ "{{include _include/navbar.html}}", ]
    after_body: [ "{{include _include/footer.html}}", ]
---

# {{title}}

This is the body section
