// var EventEmitter = require('events');

// class Man extends EventEmitter {}

// var man = new Man();

// man.on('wakeup', function () {
//     console.log('man has woken up'); // 代码1
// });

// man.emit('wakeup');

// console.log('woman has woken up'); // 代码2

var crypto = require('crypto');
var fs = require('fs');
var path = require('path');

var secret = 'secret';
var hmac = crypto.createHmac('sha256', secret);
var input = fs.readFileSync(path.join(__dirname, 'test.txt'), {encoding: 'utf8'});

hmac.update(input);
console.log(hmac.digest('hex'));
