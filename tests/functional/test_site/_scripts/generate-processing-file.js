function main() {
    return `
    <ul>
        <li>${lighthouse.processingFile.path}</li>
        <li>${lighthouse.processingFile.name}</li>
        <li>${lighthouse.processingFile.extension}</li>
    </ul>
    `;
}
