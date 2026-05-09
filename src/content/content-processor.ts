export class ContentProcessor {
    postProcessMD(md: string) {
        return md.replaceAll(/([^\s`])(\n#+)/gm, "$1\n$2"); // Includes a new line before Markdown titles, if not empty
    }

    preprocessRawHtml(html: string) {
        return html.replaceAll(/<p>({{.*}})<\/p>/g, "$1"); //Removes <p> HTML surrounding Lighthouse tags
    }

    postProcessRawHtml(html: string) {
        return html.replaceAll(/<(\w+)>\s*?<\/\1>/g, ""); //Removes all empty HTML tags
    }
}
