#!/usr/bin/env node
try {
    var reporter = require('nodeunit').reporters.default;
}
catch(e) {
    console.log("Cannot find nodeunit module.");
    console.log("You can install dependencies by doing: npm install");
    console.log("");
    process.exit();
}

reporter.run(['test']);