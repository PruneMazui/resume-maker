#!/usr/bin/env node
"use strict";

var args = process.argv.slice(2);

const help = () => {

};

const generate_config = () => {

};

const render_html = (data) => {
    const template_path = require('path').resolve(__dirname + '/../resource/template.ect');

    let academic_histories = data.academic_histories || [];
    let work_histories = data.work_histories || [];

    let academic_flg = academic_histories.length == 0;
    let work_flg = work_histories.length == 0;

    data.pop_history = function (index) {
        if (! academic_flg) {
            academic_flg = true;
            return {
                "year": "",
                "month": "",
                "value": "学歴"
            };
        }

        if (academic_histories.length > 0) {
            return academic_histories.shift();
        }

        if (! work_flg) {
            if (index == 12) { // １ページ目の最下段だったときはスキップ
                return {
                    "year": "",
                    "month": "",
                    "value": ""
                };
            }
            work_flg = true;
            return {
                "year": "",
                "month": "",
                "value": "職歴"
            };
        }

        if (work_histories.length > 0) {
            return work_histories.shift();
        }

        return {
            "year": "",
            "month": "",
            "value": ""
        };
    };

    let licenses = data.licenses || [];
    data.pop_license = function () {
        if (licenses.length > 0) {
            return licenses.shift();
        }

        return {
            "year": "",
            "month": "",
            "value": ""
        };
    };

    return require("ect")().render(template_path, data);
};

const make_pdf = (config_file, export_file) => {
    let fs = require("fs");

    let data = {};
    if (fs.existsSync(config_file)) {
        try {
            data = JSON.parse(fs.readFileSync(config_file, 'utf8'));
        } catch (error) {
            console.log(error.message)
            return;
        }
    }

    let html = render_html(data);

    // fs.writeFileSync("./hoge.html", html);

    let options = { format: "A4" };

    require("html-pdf").create(html, options).toFile(export_file, function(err, res) {
        if (err) {
            return console.log(err);
        }
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    
    process.cwd();
};

make_pdf("resume.json", "./hoge.pdf");
