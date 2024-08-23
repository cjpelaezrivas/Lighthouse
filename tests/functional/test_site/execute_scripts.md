---
title: Execute scripts
output:
  execute:
    before_each:
      - "_scripts/file-execution.js::main('before_each')"
    after_each: [
      "_scripts/file-execution.js::main('after_each')",
    ]
---

# {{title}}

This file should generate `before_each.txt` and `after_each.txt` files on output directory.
