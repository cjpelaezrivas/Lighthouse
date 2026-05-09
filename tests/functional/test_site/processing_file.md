---
title: Gets the information of the file is being processed
external: "{{g _scripts/generate-processing-file.js}}"
file_path: "{{processing_file.path}}"
file_name: "{{processing_file.name}}"
file_extension: "{{processing_file.extension}}"
---

# {{title}}

Processing file information using substitution:

- {{processing_file.path}}
- {{processing_file.name}}
- {{processing_file.extension}}

Processing file information using scripts:

{{g _scripts/generate-processing-file.js}}

Getting processing file information from properties:

- {{file_path}}
- {{file_name}}
- {{file_extension}}

{{external}}
