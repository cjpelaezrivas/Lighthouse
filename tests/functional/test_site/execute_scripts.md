---
title: Execute scripts
execute:
  before_each:
    - "_scripts/file-execution.js::main('before_each')"
  before_save_each:
    - "_scripts/file-execution.js::modifyFileContent()"
  after_each: [
    "_scripts/file-execution.js::main('after_each')",
  ]
---

# {{title}}

This file should generate `before_each.txt` and `after_each.txt` files on output directory.

[TO BE REPLACED BY SCRIPT]
