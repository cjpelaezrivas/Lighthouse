export class HtmlService {
    preprocessRawHtml(html: string) {
        return html.replaceAll(/<p>({{.*}})<\/p>/g, "$1"); //Removes <p> HTML surrounding tags;
    }

    postProcessRawHtml(html: string) {
        return html.replaceAll(/<(\w+)>\s*?<\/\1>/g, ""); //Removes all empty HTML tags
    }
}
