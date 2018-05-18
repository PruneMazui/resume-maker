#!/usr/bin/env node
"use strict";

let resume = require('../');

let args = process.argv.slice(2);

let config_file = args[0] || "resume.json";
let export_file = args[1] || "resume.pdf";

resume.run(config_file, export_file);
