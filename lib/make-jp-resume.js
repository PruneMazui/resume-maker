#!/usr/bin/env node
"use strict";
let fs = require("fs");

module.exports = {
    output_pdf: function(config_file, export_file) {
        // @todo refactor & error handling
        let data = {};

        if (config_file && fs.existsSync(config_file)) {
            try {
                data = JSON.parse(fs.readFileSync(config_file, "utf8"));
            } catch (error) {
                console.log(error.message);
                return;
            }
        }

        let html = this.render_html(data);

        let options = { format: "A4" };

        require("html-pdf")
            .create(html, options)
            .toFile(export_file, function(err, res) {
                if (err) {
                    return console.log(err);
                }
                console.log(res); // { filename: '/app/businesscard.pdf' }
            });
    },

    render_html: function(data) {
        let assign = {
            data: data
        };

        {
            let academic_histories = data.academic_histories || [];
            let work_histories = data.work_histories || [];

            let academic_flg = academic_histories.length == 0;
            let work_flg = work_histories.length == 0;

            let make_return = (value, year, month) => {
                let ret = {
                    year: "",
                    month: "",
                    value: ""
                };

                if (typeof value == "object") {
                    year = value.year;
                    month = value.month;
                    value = value.value;
                }

                if (typeof value == "string") {
                    ret.value = value;
                }

                if (typeof year == "string") {
                    ret.year = year;
                }

                if (typeof month == "string") {
                    ret.month = month;
                }

                return ret;
            };

            // 表示用の関数をオブジェクトに拡張しておく
            assign.fetch_history = index => {
                if (!academic_flg) {
                    academic_flg = true;
                    return make_return("学歴");
                }

                if (academic_histories.length > 0) {
                    return make_return(academic_histories.shift());
                }

                if (!work_flg) {
                    if (index == 12) {
                        // １ページ目の最下段だったときはスキップ
                        return make_return();
                    }
                    work_flg = true;
                    return make_return("職歴");
                }

                if (work_histories.length > 0) {
                    return make_return(work_histories.shift());
                }

                return make_return();
            };

            let licenses = data.licenses || [];
            assign.fetch_license = () => {
                if (licenses.length > 0) {
                    return make_return(licenses.shift());
                }

                return make_return();
            };

            assign.echo = (key, default_value) => {
                if (typeof data[key] == "undefined") {
                    return default_value || "";
                }
                return data[key];
            };
        }

        const template_path = require("path").resolve(
            __dirname + "/../resource/template.ejs"
        );
        let template = fs.readFileSync(template_path, "utf8");
        return require("ejs").render(template, assign);
    },

    generate_config: function() {
        // @todo implements
    },

    help: function() {
        // @todo implements
    }
};
