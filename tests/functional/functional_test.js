const pjson = require("../../package.json");
const fs = require("fs");

const Color = {
    Reset: "\x1b[0m",
    Bright: "\x1b[1m",
    Dim: "\x1b[2m",
    Underscore: "\x1b[4m",
    Blink: "\x1b[5m",
    Reverse: "\x1b[7m",
    Hidden: "\x1b[8m",

    FgBlack: "\x1b[30m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgMagenta: "\x1b[35m",
    FgCyan: "\x1b[36m",
    FgWhite: "\x1b[37m",
    FgGray: "\x1b[90m",

    BgBlack: "\x1b[40m",
    BgRed: "\x1b[41m",
    BgGreen: "\x1b[42m",
    BgYellow: "\x1b[43m",
    BgBlue: "\x1b[44m",
    BgMagenta: "\x1b[45m",
    BgCyan: "\x1b[46m",
    BgWhite: "\x1b[47m",
    BgGray: "\x1b[100m",
};

const testPath = "./tests/functional/test_site/";
const generatedPath = testPath + "_generated_site/";
const expectedPath = testPath + "_expected_site/";

const scenarios = [
    "markdown",
    "+markdown_join.html", // testing debug flag
    "+markdown_raw.html", // testing debug flag
    "sub_directory/subdirectory",
    "destination_sub_directory/move_to_other", // origin_sub_directory/move_to_other
    "move_to_root", // origin_sub_directory/move_to_root
    "substitution",
    "headers",
    "toc",
    "if",
    "foreach",
    "processing_file",
    "include",
    "include_md",
    "generate",
    "alternative_template",
    "!change_name.html",
    "new_name", // change_name
    "!configuration_from_script.html",
    "this-name-comes-from-js-code-execution", // configuration_from_script
    "file_to_be_copied_a",
    "file_to_be_copied_b.yml", // _configuration > copy_files
    "file_to_be_copied_c.yml", // _configuration > copy_files
    "!ignored_file.ignored",
    "!sub_directory/_ignored_sub_directory_file.html",
    "!sub_directory_ignored/ignored.html",
    "before_all.txt",
    "after_all.txt",
    "before_each.txt",
    "after_each.txt"
];

let results = [];

(function () {
    print("===========================");
    print("Lighthouse - Functional test");
    print(`version ${pjson.version}`);
    print("===========================");
    print(`${scenarios.length} scenarios found`);

    scenarios.forEach((scenario) => {
        print(`--- ${scenario} ---`);

        let result;
        try {
            if (scenario.startsWith("+")) {
                result = checkFileExistence(scenario, true);
            } else if (scenario.startsWith("!")) {
                result = checkFileExistence(scenario, false);
            } else {
                result = checkFile(scenario);
            }
        } catch (error) {
            printError(error)
            result = false;
        }

        result
            ? print(`✔ SUCCESSFUL SCENARIO`, Color.FgGreen)
            : print(`❌ FAILED SCENARIO`, Color.FgRed);
        results.push({
            success: result,
            scenario: scenario,
        });
    });

    print("===========================");
    print("Functional test results:");
    results.forEach((result) =>
        print(
            `${result.success ? "✔" : "❌"} ${result.scenario}`,
            result.success ? Color.FgGreen : Color.FgRed
        )
    );

    const totalScenarios = scenarios.length;
    const successfulScenarios = results.filter((result) => result.success).length;
    print(
        `Successful scenarios: ${successfulScenarios} of ${totalScenarios}`
    );
    print("===========================");

    if(successfulScenarios < totalScenarios) {
        process.exit(1);
    }
})();

function checkFileExistence(scenario, isExpected) {
    const file = scenario.substring(1);
    const exists = fs.existsSync(generatedPath + file);

    if (exists === isExpected) {
        return true;
    } else {
        print(
            `Assert exception: ${file} file was ${isExpected ? "not " : ""}found in output directory, and it was ${isExpected ? "" : "not "}expected`
        );

        return false;
    }
}

function checkFile(scenario) {
    const file = scenario + (!scenario.includes(".") ? ".html" : "");
    const generatedFile = readFile(generatedPath + file);
    const expectedFile = readFile(expectedPath + file);

    return assetAreEquals(expectedFile, generatedFile);
}

function readFile(filePath, codification = "utf8") {
    return fs.readFileSync(filePath, codification);
}

function assetAreEquals(expectedText, generatedValue) {
    const expectedSplit = expectedText.trim().split("\n");
    const generatedSplit = generatedValue.trim().split("\n");

    if (expectedSplit.length !== generatedSplit.length) {
        print(
            `Assert exception: Generated and expected files have different number of lines`
        );
        return false;
    }

    let areEquals = true;
    for (let i = 0; i < expectedSplit.length; i++) {
        let expected = cleanBlankCharacters(expectedSplit[i]);
        let generated = cleanBlankCharacters(generatedSplit[i]);

        if (!!expected && expected !== generated) {
            print(
                `Line ${
                    i + 1
                } - Expected '${generated}' to be equals to '${expected}'`
            );
            areEquals = false;
        }
    }

    return areEquals;
}

function cleanBlankCharacters(input) {
    return input.replaceAll("\r", "");
}

function print(message, ...color) {
    console.log(`${color.join("")}${message}${Color.Reset}`);
}

function printError(errorMessage, ...color) {
    console.error(`${color.join("")}${errorMessage}${Color.Reset}`);
}
