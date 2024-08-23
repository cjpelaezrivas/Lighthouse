import { fileUtils } from "./file-utils";
import { objectUtils } from "./object-utils";

export const markdownUtils = {
    getMetadata(mdFile: string) {
        let [metadata, _] = this.splitMetadataAndBody(mdFile);

        return metadata;
    },

    getBody(mdFile: string) {
        let [_, mdBody] = this.splitMetadataAndBody(mdFile);

        return mdBody;
    },

    splitMetadataAndBody(mdFile: string): [object, string] {
        const mdContent = fileUtils.readFile(mdFile);
        
        const regex = /(?:---(.*?)---)?(.*)/s;
        const regexResult = regex.exec(mdContent.trim());
    
        if(!regexResult) {
            return [{}, ""];
        }
    
        const metadata = objectUtils.parseYaml(regexResult[1]?.trim());
        const mdBody = `\n${regexResult[2]?.trim()}`;
    
        return [metadata, mdBody];
    }
};
