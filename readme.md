
<h1 align="center">Lighthouse</h1>
<p align="center">Static site generator using Markdown, HTML templates and JS scripts; coded in Node.js</p>

<p align="center"><img src="docs/images/logo.png" width="512" height="512" alt=""></p>

Lighthouse is a static site generator designed to streamline the creation of a web page using templates and Markdown files.

Using the global or per file configuration, the output of each page can customize as needed. This way each page can have a different template or be generated using different criteria.

The integration with *Javascript* code can be used to generate dynamically parts of the site. It is possible even to open local files to process them and generate the site base on that content.

Once the site has been generated, it can be uploaded to Github pages or any other similar service. This tool is perfect to create blogs, personal sites or documentation pages for your projects, as they are generated once and all visitors get the same content.

[See this project in Github](https://github.com/cjpelaezrivas/Lighthouse).

### Sites using Lighthouse

- https://cjpelaezrivas.dev - My personal site
- https://prlazarus.es - Software related blog in Spanish
- https://cjpelaezrivas.dev/ProjectCreationFX - A Java game engine project page

> [!NOTE]
> If you have used Lighthouse to build your site and you desire to include it on this list, please, contact me 😀.

## How to install

```sh
npm install -g
```

The command `lighthouse` should be available after the installation.

## How to run

```sh
lighthouse (<path-to-your-site-directory>|<path-to-file-to-process>)
```

Alternatively, this can be used:

```sh
npm run build && node ./target/main.js (<path-to-your-site-directory>|<path-to-file-to-process>)
```

### Run parameters

| Parameter               | Description                                                                                                                                                                                                 | Default value                 |
|-------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------|
| path-to-site-directory  | Optional. Tells Lighthouse where is the sources to generate the site                                                                                                                                        | Current directory             |
| path-to-file-to-process | Optional. If specified, Lighthouse will only process this file. Useful when you have a working site and your are updating only one file, allowing you to update it without having to process the whole site | None. All files are processed |
| --minify                | Optional. Enables the minification of generated files, if disabled a prettier formatter is used                                                                                                             | false                         |
| --debug                 | Optional. Enables debug mode to show not found variables and files messages on generated files, also generates intermediate MD files while processing and shows more information on the logs                | false                         |

## Getting started

Start creating your first site following the next steps:

1. Create the configuration file : `_configuration.yaml`

```yaml
site_title: Your new static site
```

2. Create the a Markdown formatted file with your content: `index.md`
```md
# {{site_title}}

Welcome to your new static site generated using **Lighthouse**!
```

3. Execute Lighthouse command to generate the site
```bash
lighthouse (<path-to-site-directory>)
```

4. Check the new `_site` directory that contains your new generated site. The `index.html` should have this content:
```html
<h1>Your new static site</h1>

Welcome to your new static site generated using <b>Lighthouse</b>!
```

### Using a custom template

It is possible to set a custom template file on `_configuration.yml` file, or on the `yaml` header inside any `md` file. The template to be used has to be used on a `html` file that needs to be referenced on the required configuration path as can be seen bellow.

```html
<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8" />
  <title>{{title}}</title>
</head>

<body>
  {{body}}
</body>

</html>
```

```yaml
document:
  template: path/to/your/template/file.html
```

> [!NOTE]
> Remember to include the special `{{body}}` tag inside your template, so the content of the processed `md` file that use this template can include their content there.

### Tags on your Markdown files

It is possible to include multiple tags on your `html` template files and `md` files. This is the list of tags that Lighthouse supports now:

- foreach
- if
- \<variables\>
- include
- generate

#### foreach tag

This tag is in charge of the expansion of your template. It allows to repeat a given number of time a section of your template or your document, using different variables to do it.

To use it on your documents:
- `{{foreach <variable> <list>}}<your-code>{{foreach-end}}`
- `{{foreach <variable> <list>}}<your-code>{{foreach-end <list>}}`

`list` element is a collection of elements on your configuration. `variable` is a variable name you declare for each loop, and allows you to access the element of the collection the loop is processing on each iteration.

It is possible to create nested `foreach` expressions, so you can create more complex structures.

> [!NOTE]
> Pay attention there are two ways of declaring a `foreach`. The second way allows to mark the closing mark to know the end of a given loop.

#### if tag

The aim of this tag is the selection of different blocks on your template or document. Depending of the value of a given variable, one side or the other of the block is used.

To use it on your document:
- `{{if <variable>}}<your-code>{{if-end}}`
- `{{if <variable>}}<your-code>{{if-end <variable>}}`
- `{{if <variable>}}<your-code>{{if-else}}<alternative-code>{{if-end}}`
- `{{if <variable>}}<your-code>{{if-else}}<alternative-code>{{if-end <variable>}}`

The value of `variable` is used to select the section of the tag. It is used Javascript to evaluate the variable, so the same conditions are applied for the truthfulness or nullability of an expression.

It is possible to create nested `if` expressions, so you can create more complex structures.

> [!NOTE]
> Here, there are also two ways of declaring an `if`. The second way allows to mark the closing mark to know the end of a given loop.

#### variable tags

It is possible to create tag with any given value and use them on any part of the template or document. If the variable is not found on the configuration, a log will be printed on the console and it will replaced by an empty string.

> [!NOTE]
> If the debug mode is active, not found variables will be replaced by an error template on the output document.

### Including external files

To include static content from other files on your template or document, the `include` tag can be used.

To use it on your document:
- `{{include <path-to-your-file>}}`
- `{{i <path-to-your-file>}}`

This tag can be also used on Markdown header section:
```md
---
title: Include a file content
custom:
  path:
    include: {{include _include/file_a.md}}
---

# {{title}}

{{i _include/file_b.html}}

{{custom.path.include}}
```

This tag will load the content of the given file and will be replaced with the text that is inside the file. This is not only limited to `html` or `md` files, any text file can be loaded using this method.

### Generating code using Javascript

There is also ways to generate dynamic content to your templates or documents. For that purpose the `generate` tag is here.

To use it on your document:
- `{{generate <path-to-your-js-file>}}`
- `{{g <path-to-your-js-file>}}`
- `{{generate <path-to-your-js-file>::<function-to-call>(<parameters>)}}`
- `{{g <path-to-your-js-file>::<function-to-call>(<parameters>)}}`

Example of usage:

File `file_a.js`:
```js
function main() {
  return "This content comes from JS code.";
}
```

File `file_b.js`:
```js
function execute(value) {
  return value.toUpperCase();
}
```

```md
---
title: Generate content using JS
custom:
  path:
    generate: {{generate _scripts_/file_a.js}}
  variable: This should appear in capital letters
---

# {{title}}

{{g _scripts_/file_b.js::execute({{custom.variable}})}}

{{custom.path.generate}}
```

> [!NOTE]
> If not call function is set on the tag, the `main` function with no parameters will be invoked.

### Looking for more examples?

If you need more examples or use cases, you may want to go to the test section, where most of the scenarios to generate sites are covered. You can discover some more complex usages of Lighthouse there.

### Reserved configuration

As the user has full freedom to set the Markdown configuration on the `yaml` header, it has to be taken into account that some configuration paths are used internally by the application.

Make sure to don't override them by mistake. This is the list of them and a short description of their use:

```
output:
  directory // Directory where the converted files will be stored
  copy_files // Array of files (and destination name) to be copied to the output file
  execute:
    before_all // Array of scripts to execute before starting processing files and directories
    before_each // Array of scripts to execute before processing the file where it is set
    after_each // Array of scripts to execute after processing the file where it is set
    after_all // Array of scripts to execute after processing all files and directories
document:
  template //Template the file is using
  output:
    path // Alternative path inside `output.directory` where the converted file will be stored
    name // Alternative converted file name
  headers
    generate_ids // Enables if IDs are generated and headers are converted to anchors on HTML output files
  toc:
    enabled // Enables TOC
    levels // Array to configure the visible levels of the TOC
    header // Text to be included before the TOC
    footer // Text to be included after the TOC
processingFile: // Path to the current MD file the application is processing. Not present if processing non MD files
    path // Complete path to the file, including name and extension
    name // Name of the file is being converted
    extension // Extension of the file is being converted
```

## Licenses

Lighthouse is licensed under the terms of the **GNU General Public License v3.0** (GPL-3.0).

Full text of the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

The Lighthouse icon is published under the a [Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-nc-sa/4.0/).
