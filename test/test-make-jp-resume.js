#!/usr/bin/env node

"use strict";

let assert = require('assert');
let resume = require('../');
let fs = require("fs");

describe("test render html", () => {
    it('empty case', () => {
        let html = resume.render_html();
        assert.equal(typeof html, 'string');
        assert.notEqual(html.indexOf('<html'), -1);
        assert.equal(html.indexOf('ヤマダ タロウ'), -1);
        assert.equal(html.indexOf('これはサンプルです。'), -1);
    });

    it('has config case', () => {
        let data = resume.parse_config(__dirname + '/test_config.json');
        let html = resume.render_html(data);
        assert.equal(typeof html, 'string');
        assert.notEqual(html.indexOf('<html'), -1);
        assert.notEqual(html.indexOf('ヤマダ タロウ'), -1);
        assert.notEqual(html.indexOf('これはサンプルです。'), -1);
    });
});

describe("test config", () => {
    it('error case', () => {
        assert.throws(() => {
            resume.parse_config(__dirname + '/error_config.json.err');
        });
    });

    it('success case', () => {
        let data = resume.parse_config(__dirname + '/test_config.json');
        assert.equal(data.gender, "男");
        assert.equal(data.academic_histories.length, 2);
    });
});
