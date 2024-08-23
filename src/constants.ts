
export const HEADER = `
===============================================================================
██╗     ██╗ ██████╗ ██╗  ██╗████████╗██╗  ██╗ ██████╗ ██╗   ██╗███████╗███████╗
██║     ██║██╔════╝ ██║  ██║╚══██╔══╝██║  ██║██╔═══██╗██║   ██║██╔════╝██╔════╝
██║     ██║██║  ███╗███████║   ██║   ███████║██║   ██║██║   ██║███████╗█████╗
██║     ██║██║   ██║██╔══██║   ██║   ██╔══██║██║   ██║██║   ██║╚════██║██╔══╝
███████╗██║╚██████╔╝██║  ██║   ██║   ██║  ██║╚██████╔╝╚██████╔╝███████║███████╗
===============================================================================
`;

export const DEBUG_FLAG = '--debug';
export const MINIFY_FLAG = '--minify';

export const MD_EXTENSION = 'md';
export const HTML_EXTENSION = 'html';

export const BODY_TAG_REGEX = /(?:[ \t]*){{body}}(?:[ \t]*)/gs;
export const INCLUDE_ITEM_REGEX = /^(.+?)=>(.+?)$/gs;
export const EXECUTE_SCRIPT_FILE_REGEX = /^(.+\.js)(?:::((?:.+)\((?:.*)\)))?$/gs;

export const DEFAULT_OUTPUT_DIRECTORY = '_site';
export const CONFIGURATION_FILE_NAME = '_configuration.yml';
export const IGNORE_FILE_NAME = '.lighthouseignore';
export const DEFAULT_TEMPLATE = '<!DOCTYPE html><html><head><meta charset="UTF-8"/></head><body>{{body}}</body></html>';

export const PROCESSING_FILE_PATH_FIELD = "processing_file_path";
export const PROCESSING_FILE_NAME_FIELD = "processing_file_name";
export const PROCESSING_FILE_EXTENSION_FIELD = "processing_file_extension";

export const CONFIGURATION_OUTPUT_DIRECTORY = 'output.directory';
export const CONFIGURATION_OUTPUT_COPY_FILES = 'output.copy_files';
export const CONFIGURATION_OUTPUT_EXECUTE_BEFORE_ALL = 'output.execute.before_all';
export const CONFIGURATION_OUTPUT_EXECUTE_BEFORE_EACH = 'output.execute.before_each';
export const CONFIGURATION_OUTPUT_EXECUTE_AFTER_EACH = 'output.execute.after_each';
export const CONFIGURATION_OUTPUT_EXECUTE_AFTER_ALL = 'output.execute.after_all';
export const CONFIGURATION_DOCUMENT_TEMPLATE = 'document.template';
export const CONFIGURATION_DOCUMENT_OUTPUT_PATH = 'document.output.path';
export const CONFIGURATION_DOCUMENT_OUTPUT_NAME = 'document.output.name';
export const CONFIGURATION_DOCUMENT_HEADERS_GENERATE_IDS = 'document.headers.generate_ids';
export const CONFIGURATION_DOCUMENT_TOC_ENABLED = 'document.toc.enabled';
export const CONFIGURATION_DOCUMENT_TOC_LEVELS = 'document.toc.levels';
export const CONFIGURATION_DOCUMENT_TOC_HEADER = 'document.toc.header';
export const CONFIGURATION_DOCUMENT_TOC_FOOTER = 'document.toc.footer';

export const VALUE_REQUIRED_EXCEPTION = "VALUE_REQUIRED_EXCEPTION";
export const FILE_NOT_FOUND_EXCEPTION = "FILE_NOT_FOUND_EXCEPTION";
