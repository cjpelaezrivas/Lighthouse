function main(type) {
    const content = `This file was generated from a ${type} call.`;
    fileUtils.writeFile(`${lighthouse.outputDirectory}${type}.txt`, content);
}

function modifyFileContent() {
    lighthouse.processingFile.content = lighthouse.processingFile.content
        .replace("[TO BE REPLACED BY SCRIPT]", "NEW CONTENT FROM SCRIPT");
}
