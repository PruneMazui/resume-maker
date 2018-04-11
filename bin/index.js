#!/usr/bin/env node
"use strict";

var args = process.argv.slice(2);

const render_html = () => {
    const template_path = require('path').resolve(__dirname + '/../resource/template.html');
    return require("ect")().render(template_path, {});
};

const make_pdf = (config_file, export_file) => {
    let html = render_html();
    let options = { format: "A4" };

    require("html-pdf").create(html, options).toFile(export_file, function(err, res) {
        if (err) return console.log(err);
        console.log(res); // { filename: '/app/businesscard.pdf' }
    });
    
    process.cwd();
};

make_pdf("", "./hoge.pdf");

// yaml なり json なり markdown なり読み込み

// バリデーション

// HTMLテンプレートに埋め込み

// HTMLを temp に出力

// PDFを出力
