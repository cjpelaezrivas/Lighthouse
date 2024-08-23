const { execSync } = require('child_process');
const pjson = require("../package.json");
(function () {
    try {
        execSync(`git tag -a v${pjson.version} -m "version ${pjson.version}"`, { stdio: 'inherit' });
    } catch (error) {
        console.error('Error creating git version tag:', error);
        process.exit(1);
    }
})();
