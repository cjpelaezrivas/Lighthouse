---
title: Include a file content and alternative template test
document:
  template: _templates/test_include.html
file-from-variable: _include/test_include_b.html
---

# {{title}}

{{include _include/test_include_b.html}}

[...]: # (Tag in tag approach -- The variable value could come from anywhere)
{{include {{file-from-variable}}}}

{{i _include/test_include_c.html}}

{{i _include/dotted.path/test_include.html}}