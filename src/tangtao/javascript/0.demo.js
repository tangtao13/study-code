/*
 * @Author: myname
 * @Date: 2021-05-07 13:52:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-05-26 16:00:43
 */

const {act} = require('react-dom/test-utils');
const resolve = require('resolve');

var obj = {
    key1: 1,
    key2: 2,
};

console.log(Object.keys(obj));
console.log(delete obj.key1);
console.log(Object.keys(obj));

//斐波那契数列
function fib(num) {
    if (num === 0) return 0;
    if (num === 1) return 1;
    return fib(num - 2) + fib(num - 1);
}

console.log(fib(6));

function fib1(num, res1 = 0, res2 = 1) {
    if (num == 0) {
        return res1;
    }
    return fib1(num - 1, res2, res1 + res2);
}
console.log(fib1(7));

/***---------位运算符开发作用------------------- */

var FLAG_A = 1; // 0001
var FLAG_B = 2; // 0010
var FLAG_C = 4; // 0100
var FLAG_D = 8; // 1000

var flags = 5; // 二进制： 0101

flags & FLAG_C; // 0101 & 0100 0100

<a href="javascript: void(document.form.submit())"></a>;

// 将switch...case语句改成对象结构
function doAction(action) {
    var actions = {
        hack: function () {
            return 'hack';
        },
        slash: function () {
            return 'slash';
        },
        run: function () {
            return 'run';
        },
    };
    if (typeof actions[action] !== 'function') {
        throw new Error('Invalid action.');
    }
    return actions[action]();
}
doAction('doAction');

//判断变量是否为对象的函数
function isObject(value) {
    return value === Object(value);
}
isObject([]); //true
isObject(true); //false

//手写实现bind()
//todo: 不支持 new(funA.bind(thisArg,args))
// var unboundSlice = Array.prototype.slice;
// var slice = Function.prototype.apply.bind(unboundSlice);
if (!Function.prototype.bind) {
    (function () {
        var slice = Array.prototype.slice;
        Function.prototype.bind = function () {
            var thatFunc = this,
                thatArg = arguments[0];
            var args = slice.call(arguments, 1);
            if (typeof thatFunc !== 'function') {
                throw new TypeError('错误');
            }

            return function () {
                var funcArgs = args.concat(slice.call(arguments));
                thatFunc.apply(thatArg, funcArgs);
            };
        };
    })();
}

//手写apply函数
if (!Function.prototype.apply) {
    (function () {
        var slice = Array.prototype.slice;
        Function.prototype.apply = function () {
            var thatFunc = this,
                thatArg = arguments[0];
            var args = slice.call(arguments, 1);
            if (typeof thatFunc !== 'function') {
                throw new TypeError('错误');
            }

            return thatArg.thatFunc(args);
        };
    })();
}

//多重继承 Mixin(混入)
function M1() {
    this.hello = 'hello';
}

function M2() {
    this.world = 'world';
}

function S() {
    M1.call(this);
    M2.call(this);
}

S.prototype = Object.create(M1.prototype);
Object.assign(S.prototype, M2.prototype);
S.prototype.constructor = S;

//promise的实现

class Promise {
    constructor(fn) {
        //初始化
        this.state = 'pending';
        this.value = null;
        this.reason = null;

        //保存队列数组
        this.fulfilledCallbacks = [];
        this.rejectedCallbacks = [];

        //成功
        const fulfill = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                this.fulfilledCallbacks.forEach((cb) => cb());
            }
        };

        //失败
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                this.rejectedCallbacks.forEach((cb) => cb());
            }
        };

        //执行函数
        try {
            fn(fulfill, reject);
        } catch (e) {
            reject(e);
        }
    }

    then(onFulfiled, onRejected) {
        return new Promise((fulfill, reject) => {
            if (this.state === 'fulfilled') {
                fulfill(onFulfiled(this.value));
            } else if (this.state === 'rejected') {
                reject(onRejected(this.reason));
            } else if (this.state === 'pending') {
                this.fulfilledCallbacks.push(() => {
                    fulfill(onFulfiled(this.value));
                });
                this.rejectedCallbacks.push(() => {
                    reject(onRejected(this.reason));
                });
            }
        });
    }
}

const countPrimes = function (n) {
    let count = 0;
    let signs = new Uint8Array(n);
    for (let i = 2; i < n; i++) {
        if (!signs[i - 1]) {
            count++;

            for (let j = i * i; j <= n; j += i) {
                signs[j - 1] = true;
            }
        }
    }

    return count;
};
countPrimes(2);

/************************ */
let user = {}; // user 没有 address 属性

alert(user?.address?.street);

/**
洗牌算法： 从一个数组中随机的取出一个数，概率相同, 抽奖也可以用这个算法
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
shuffle([1, 2, 3]);

//闭包sum

function sum(a) {
    return function (b) {
        return a + b;
    };
}
sum(1)(2);

//间谍装饰器
function work(a, b) {
    alert(a + b);
}

function spy(fn) {
    return function pn() {
        pn.calls = pn.calls ? pn.calls : [];

        pn.calls.push(arguments);
        fn.apply(this, arguments);
    };
}

function spy(func) {
    function wrapper(...args) {
        // using ...args instead of arguments to store "real" array in wrapper.calls
        wrapper.calls.push(args);
        return func.apply(this, args);
    }
    wrapper.calls = [];
    return wrapper;
}

work = spy(work);
work(1, 2); // 3
work(4, 5); // 9

for (let args of work.calls) {
    alert('call:' + args.join()); // "call:1,2", "call:4,5"
}

function delay(fn, ms) {
    return function wrapper() {
        setTimeout(() => fn.apply(this, arguments), ms);
    };
}

function debounce(fn, ms, options = {}) {
    let firstTime = Data.now();
    return function () {
        const currentTime = Data.now();
        if (currentTime - firstTime >= 1000) {
            setTimeout(() => {
                fn.apply(this, arguments);
                firstTime = Data.now();
            }, ms);
        } else {
            firstTime = currentTime;
        }
    };
}

function debounce(func, ms) {
    let timeout;
    return function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, arguments), ms);
    };
}

function throttle(func, ms) {
    let isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper() {
        if (isThrottled) {
            // (2)
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments); // (1)

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false; // (3)
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
}

let dictionary = Object.create(null, {
    toString: {
        // 定义 toString 属性
        value() {
            // value 是一个 function
            return Object.keys(this).join();
        },
    },
});

dictionary.apple = 'Apple';
dictionary.__proto__ = 'test';

alert(dictionary);

/**
 * 订阅发布模式
 *
 */

let evnetMixin = {
    //订阅
    on(eventName, handler) {
        if (this._eventHandlers) {
            this._eventHandlers = [];
        }
        if (!this._eventHandlers[eventName]) {
            this._eventHandlers[eventName] = [];
        }
        this._eventHandlers[eventName].push(handler);
    },
    //取消订阅
    off(eventName, handler) {
        let handlers = this._eventHandlers?.[eventName];
        if (!handlers) return;
        for (let i = 0; i < handlers.length; i++) {
            if (handlers[i] === handler) {
                handlers.splice(i--, 1);
            }
        }
    },
    //发布
    trigger(eventName, ...args) {
        const handlers = this._eventHandlers?.[eventName];
        if (!handlers) return;
        handlers.forEach((handler) => {
            handler.apply(this, args);
        });
    },
};

// 创建一个 class
class Menu {
    choose(value) {
        this.trigger('select', value);
    }
}
// 添加带有事件相关方法的 mixin
Object.assign(Menu.prototype, eventMixin);

let menu = new Menu();

// 添加一个事件处理程序（handler），在被选择时被调用：
menu.on('select', (value) => alert(`Value selected: ${value}`));

// 触发事件 => 运行上述的事件处理程序（handler）并显示：
// 被选中的值：123
menu.choose('123');

//包装异常
class ReadError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = 'ReadError';
    }
}

class ValidationEoor extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class PropertyRequiredError extends ValidationEoor {
    constructor(property) {
        super('No property: ' + property);
        this.name = 'PropertyRequiredError';
        this.property = property;
    }
}

function validateUser(user) {
    if (!user.age) {
        throw new PropertyRequiredError('age');
    }

    if (!user.name) {
        throw new PropertyRequiredError('name');
    }
}

function readUser(json) {
    let user;
    try {
        user = JSON.parse(json);
    } catch (err) {
        if (err instanceof SyntaxError) {
            throw new ReadError('SyntaxError', err);
        } else {
            throw err;
        }
    }

    try {
        validateUser(user);
    } catch (error) {
        if (error instanceof ValidationError) {
            throw new ReadError('Validation Error', error);
        } else {
            throw error;
        }
    }
}

try {
    readUser('{bad json}');
} catch (e) {
    if (e instanceof ReadError) {
        alert(e);
        // Original error: SyntaxError: Unexpected token b in JSON at position 1
        alert('Original error: ' + e.cause);
    } else {
        throw e;
    }
}

//测试
class FormatError extends SyntaxError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
    }
}

let err = new FormatError('formatting error');

alert(err.message); // formatting error
alert(err.name); // FormatError
alert(err.stack); // stack

alert(err instanceof FormatError); // true
alert(err instanceof SyntaxError); // true（因为它继承自 SyntaxError）

/**
 * Promise
 */

function loadScript(src) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.head.append(script);
    });
}

await 1;

/**
 *“种子伪随机（seeded pseudo-random）generator”。它们将“种子（seed）”作为第一个值，然后使用公式生成下一个值。以便相同的种子
 *（seed）可以产出（yield）相同的序列，因此整个数据流很容易复现。我们只需要记住种子并重复它即可。
 *  这样的公式的一个示例如下，它可以生成一些均匀分布的值：
 *  next = previous * 16807 % 2147483647
 */
function* pseudoRandom(seed) {
    let value = seed;
    while (true) {
        value = (value * 16807) % 2147483647;
        yield value;
    }
}
let generator = pseudoRandom(1);
generator.next();

for (let index of person) {
}

function a() {}

/**
 * 尾调用优化
 */
function tco(f) {
    var value;
    var active = false;
    var accumulated = [];

    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                value = f.apply(this, accumulated.shift());
            }
            active = false;
            return value;
        }
    };
}

var sum = tco(function (x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1);
    } else {
        return x;
    }
});

sum(1, 100000);
// 100001

function tco(f) {
    let value;
    let active = false;
    let accumulated = [];
    return function accumulator() {
        accumulated.push(arguments);
        if (!active) {
            active = true;
            while (accumulated.length) {
                value = f.apply(this, accumulated.pop());
            }
            active = false;
            return value;
        }
    };
}
var sum = tco(function (x, y) {
    if (y > 0) {
        return sum(x + 1, y - 1);
    } else {
        return x;
    }
});

//对象拷贝
const clone2 = Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);

const clone3 = Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));

//todo:使用 Proxy 实现观察者模式

const queuedObservers = new Set();
function observable(object) {
    const proxy = new proxy(object, {
        get(target, key) {
            return Reflect.get(target, key);
        },
        set(target, key, value) {
            queuedObservers.forEach((observe) => observe());
            return Reflect.set(target, key, value);
        },
    });
    return proxy;
}
function observe(fn) {
    queuedObservers.add(fn);
}
const person = observable({
    name: '张三',
    age: 20,
});

function print() {
    console.log(`${person.name}, ${person.age}`);
}

observe(print);
person.name = '李四';

new Promise((resolve, reject) => {
    console.log('外部promise'); // 1
    resolve();
})
    .then(() => {
        // 注册1
        console.log('外部第一个then'); // 2
        new Promise((resolve, reject) => {
            console.log('内部promise'); //3
            resolve();
        })
            .then(() => {
                console.log('内部第一个then'); // 注册2
            })
            .then(() => {
                console.log('内部第二个then'); // 注册4
            });
        return new Promise((resolve, reject) => {
            console.log('内部promise2'); //4
            resolve();
        })
            .then(() => {
                console.log('内部第一个then2'); // 注册3
            })
            .then(() => {
                console.log('内部第二个then2'); // 注册5
            });
    })
    .then(() => {
        console.log('外部第二个then'); //注册6
    });

/**
 * Generator
 */

function* fibonacci() {
    let [prev, curr] = [0, 1];
    for (;;) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

for (let n of fibonacci()) {
    if (n > 1000) break;
    console.log(n);
}

function run(fn) {
    var gen = fn();

    function next(err, data) {
        var result = gen.next(data);
        if (result.done) return;
        result.value(next);
    }

    next();
}

function* g() {
    // ...
}

run(g);

/**
 * 动态规划
 *  找出一个数组的最长上升子序列
 */
let array = [3, 7, 22, 4, 8, 18, 9, 11, 12];
function findMax(array) {
    let dp = [];
    for (let i = 0; i < array.length; i++) {
        let dpk = [];
        if (i == 0) {
            dp[i] = Array.of(array[i]);
            continue;
        }
        for (let j = 0; j < i; j++) {
            if (array[i] > array[j]) {
                dpk[j] = [...dp[j], array[i]];
            } else {
                dpk[j] = Array.of(array[i]);
            }
        }
        dp[i] = dpk.reduce((a, b) => (b.length > a.length ? b : a), []);
    }
    let maxDp = dp.reduce((a, b) => (b.length > a.length ? b : a), []);
    return maxDp;
}
findMax(array);

/**
 * 贪心、二分法
 *  [3, 7, 22, 4, 8, 18, 9, 11, 12];
 */
function findMaxString(array) {
    let stack = [];
    let cloneStack = [];
    debugger;
    for (let i = 0; i < array.length; i++) {
        if (!stack.length) {
            stack.push(array[i]);
            cloneStack = [...stack];
            continue;
        }
        if (array[i] > stack[stack.length - 1]) {
            stack.push(array[i]);
            cloneStack = [...stack];
            continue;
        }
        cloneStack = [...stack];
        //因为数组升序，可以使用用二分法插入
        const index = searchInsert(stack, array[i]);
        stack.splice(index + 1, 1, array[i]);
        // for (let j = 0; j < stack.length; j++) {
        //     if (stack[j] > array[i]) {
        //         stack.splice(j, 1, array[i]);
        //         break;
        //     }
        // }
    }
    return cloneStack;
}

//二分查找插入
function searchInsert(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let mid = -1;
    while (left <= right) {
        mid = Math.floor((left + right) / 2);
        if (arr[mid] > target) {
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else if (arr[mid] == target) {
            return mid;
        }
    }
    return left;
}
findMaxString([1, 3, 4, 2]);

function searchInsert1(arr, target) {
    let left = 0;
    let right = arr.length;
    let mid = -1;
    while (left < right) {
        mid = Math.floor((left + right) / 2);
        if (arr[mid] > target) {
            right = mid - 1;
        } else if (arr[mid] < target) {
            left = mid + 1;
        }
    }
    return left;
}
