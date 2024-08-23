function main(type) {
    const content = `This file was generated from a ${type} call.`;
    fileUtils.writeFile(`${lighthouse.outputDirectory}${type}.txt`, content);
}
