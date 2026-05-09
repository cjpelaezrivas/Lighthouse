
<h1 align="center">Lighthouse</h1>
<p align="center">Static site generator using Markdown, HTML templates and JS scripts; coded in Node.js</p>

<p align="center"><img src="docs/media/image/hero-background.jpg" height="480" alt=""></p>

## What is Lighthouse?

Lighthouse is a static site generator designed to streamline the creation of a web page using templates and Markdown files.

Using the global or per file configuration, the output of each page can customize as needed. This way each page can have a different template or be generated using different criteria.

The integration with *Javascript* code can be used to generate dynamically parts of the site. It is possible even to open local files to process them and generate the site base on that content.

Once the site has been generated, it can be uploaded to Github pages or any other similar service. This tool is perfect to create blogs, personal sites or documentation pages for your projects, as once they are generated all visitors get the same content.

See project documentation here: https://cjpelaezrivas.dev/Lighthouse.

### Sites using Lighthouse

- https://cjpelaezrivas.dev/Lighthouse - Lighthouse documentation site
- https://cjpelaezrivas.dev - My personal CV site
- https://prlazarus.es - Blog about Software Engineering, written in Spanish
- https://cjpelaezrivas.dev/ProjectCreationFX - Java 2D game engine project page

> [!NOTE]
> If you have used Lighthouse to build your site and you desire to include it on this list, please, contact me 😀.

## Super quick guide

It is recommended to follow the [getting started guide from the documentation site](https://cjpelaezrivas.dev/Lighthouse/getting-started.html), but if you are in a rush, this is a super quick guide to see how Lighthouse works.

### Download and install

```sh
# clone the project from this page
npm install -g
```

The command `lighthouse` should be available after the installation.

### Create a minimal site

> [!NOTE]
> Instead of creating your own, you may use [this minimal site](https://github.com/cjpelaezrivas/lighthouse-minimal) as an starting point.

```sh
mkdir your_site_dir
cd your_site_dir
```

1. Create the configuration file with this content: `_configuration.yaml`

```yaml
site_title: Your new static site
```

2. Create the a Markdown formatted file with your content: `index.md`
```md
# {{site_title}}

Welcome to your new static site generated using **Lighthouse**!
```

3. Execute Lighthouse command to generate the site:
```bash
lighthouse .
```

4. Check the new `_site` directory that contains your new generated site. The `index.html` should have this content:
```html
<h1>Your new static site</h1>

Welcome to your new static site generated using <b>Lighthouse</b>!
```

After these steps, you can go as further as you want: use custom templates and/or start using the *tags* Lighthouse offers to the site you need.

## Licenses

Lighthouse is licensed under the terms of the **GNU General Public License v3.0** (GPL-3.0).

Full text of the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html).

The Lighthouse icon is published under the a [Creative Commons
Attribution-NonCommercial-ShareAlike 4.0 International license](https://creativecommons.org/licenses/by-nc-sa/4.0/).
