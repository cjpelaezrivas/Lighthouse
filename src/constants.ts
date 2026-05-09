
export const APP_COMMAND = "lighthouse";
export const APP_DESCRIPTION = "Static site generator using Markdown, HTML templates and JS scripts";
export const APP_VERSION_INFO = "es.prlazarus/lighthouse"
export const HEADER = `
===============================================================================
██╗     ██╗ ██████╗ ██╗  ██╗████████╗██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗
██║     ██║██╔════╝ ██║  ██║╚══██╔══╝██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝
██║     ██║██║  ███╗███████║   ██║   ███████║██║   ██║██║   ██║███████╗█████╗
██║     ██║██║   ██║██╔══██║   ██║   ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝
███████╗██║╚██████╔╝██║  ██║   ██║   ██║  ██║╚██████╔╝╚██████╔╝███████║███████╗
===============================================================================
`;

export const MD_EXTENSION = 'md';
export const YAML_EXTENSIONS = ['yml', 'yaml'];
export const HTML_EXTENSION = 'html';

export const BODY_TAG_REGEX = /(?:[ \t]*){{body}}(?:[ \t]*)/gs;
export const INCLUDE_ITEM_REGEX = /^(.+?)=>(.+?)$/gs;
export const EXECUTE_SCRIPT_FILE_REGEX = /^(.+(?:\.(js|JS)))(?:::((?:.+)\((?:.*)\)))?$/gs;

export const DEFAULT_OUTPUT_DIRECTORY = '_site';
export const CONFIGURATION_FILE_NAME = '_configuration.yml';
export const IGNORE_FILE_NAME = '.lighthouseignore';
export const DEFAULT_TEMPLATE = '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>{{body}}</body></html>';

export const PROCESSING_FILE_CONTENT_FIELD = "processingFile.content";

export const CONFIGURATION_SITE_BASE_URL = 'site.base_url';
export const CONFIGURATION_OUTPUT_DIRECTORY = 'output.directory';
export const CONFIGURATION_OUTPUT_COPY_FILES = 'output.copy_files';
export const CONFIGURATION_OUTPUT_SITEMAP_ENABLED = 'output.sitemap.enabled';
export const CONFIGURATION_OUTPUT_SITEMAP_EXTRA_LINKS = 'output.sitemap.extra_links';
export const CONFIGURATION_OUTPUT_SITEMAP_LASTMOD = 'output.sitemap.lastmod';
export const CONFIGURATION_EXECUTE_BEFORE_ALL = 'execute.before_all';
export const CONFIGURATION_EXECUTE_BEFORE_EACH = 'execute.before_each';
export const CONFIGURATION_EXECUTE_BEFORE_SAVE_EACH = 'execute.before_save_each';
export const CONFIGURATION_EXECUTE_AFTER_EACH = 'execute.after_each';
export const CONFIGURATION_EXECUTE_AFTER_ALL = 'execute.after_all';
export const CONFIGURATION_DOCUMENT_TEMPLATE = 'document.template';
export const CONFIGURATION_DOCUMENT_OUTPUT_PATH = 'document.output.path';
export const CONFIGURATION_DOCUMENT_OUTPUT_NAME = 'document.output.name';
export const CONFIGURATION_DOCUMENT_HEADERS_GENERATE_IDS = 'document.headers.generate_ids';
export const CONFIGURATION_DOCUMENT_HEADERS_SHOW_PERMALINKS = 'document.headers.permalinks.enabled';
export const CONFIGURATION_DOCUMENT_HEADERS_PERMALINK_SYMBOL = 'document.headers.permalinks.symbol';
export const CONFIGURATION_DOCUMENT_TOC_ENABLED = 'document.toc.enabled';
export const CONFIGURATION_DOCUMENT_TOC_LEVELS = 'document.toc.levels';
export const CONFIGURATION_DOCUMENT_TOC_HEADER = 'document.toc.header';
export const CONFIGURATION_DOCUMENT_TOC_FOOTER = 'document.toc.footer';
export const CONFIGURATION_PROCESSING_FILE_PATH = "processing_file.path";
export const CONFIGURATION_PROCESSING_FILE_NAME = "processing_file.name";
export const CONFIGURATION_PROCESSING_FILE_EXTENSION = "processing_file.extension";

export const VALUE_REQUIRED_EXCEPTION = "VALUE_REQUIRED_EXCEPTION";
export const FILE_NOT_FOUND_EXCEPTION = "FILE_NOT_FOUND_EXCEPTION";
export const VALIDATION_EXCEPTION = "VALIDATION_EXCEPTION";
