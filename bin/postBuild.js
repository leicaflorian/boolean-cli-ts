"use strict";
const fs = require('fs');
const path = require('path');
const packageFile = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8');
if (packageFile) {
    const { version } = JSON.parse(packageFile);
    fs.writeFileSync(path.resolve(__dirname, '../bin/version.txt'), version);
}
