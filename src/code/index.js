/*
 * @Author: myname
 * @Date: 2021-05-08 13:46:48
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-05-08 14:07:07
 */

(function (list) {
    function require(file) {
        var exports = {};
        (function (exports, code) {
            eval(code);
        })(exports, list[file]);
        return exports;
    }
    require('index.js');
})({
    'index.js': `
 var add = require('add.js').default
 console.log(add(1 , 2))
 `,
    'add.js': `exports.default = function(a,b){return a + b}`,
});
