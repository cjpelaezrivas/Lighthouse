const pjson = require("../../package.json");
const fs = require("fs");
const chalk = require("chalk");

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
    "toc_header_footer",
    "ignore",
    "if",
    "foreach",
    "code",
    "processing_file",
    "include",
    "include_md",
    "include_config",
    "generate",
    "alternative_template",
    "execute_scripts",
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
    "after_each.txt",
    "sitemap.xml"
];

let results = [];

(function () {
    printSeparator();
    print("Lighthouse - Functional test");
    print(`version ${pjson.version}`);
    printSeparator();
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
            printError(error);
            result = false;
        }

        result
            ? print(`✔  SUCCESSFUL SCENARIO`, "green")
            : print(`❌ FAILED SCENARIO`, "red");
        results.push({
            success: result,
            scenario: scenario,
        });
    });

    printSeparator();
    print("Functional test results:");
    results.forEach((result) =>
        print(
            `${result.success ? "✔ " : "❌ "} ${result.scenario}`,
            result.success ? "green" : "red"
        )
    );

    const totalScenarios = scenarios.length;
    const successfulScenarios = results.filter(
        (result) => result.success
    ).length;
    printSeparator();
    print(`Successful scenarios: ${successfulScenarios} of ${totalScenarios}`, "bold");
    printSeparator();

    if (successfulScenarios < totalScenarios) {
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
            `Assert exception: ${file} file was ${
                isExpected ? "not " : ""
            }found in output directory, and it was ${
                isExpected ? "" : "not "
            }expected`
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

function printSeparator() {
    print("============================================");
}

function printError(errorMessage, ...color) {
    print(errorMessage, "red", "bold");
}

function print(text, ...styles) {
    console.log(`${applyStyles(text, styles)}`);
}

function applyStyles(text, ...styles) {
    return styles.reduce((styledText, style) => {
        if (chalk[style]) {
            return chalk[style](styledText);
        } else {
            return styledText;
        }
    }, text);
}
