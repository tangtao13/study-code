/*
 * @Author: myname
 * @Date: 2021-05-20 11:05:14
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-05-20 15:01:13
 */
let numbers = [1, 2, 3];
numbers = new Proxy(numbers, {
    get(target, prop, receiver) {
        console.log(receiver);
        if (prop in target) {
            return target[prop];
        }
        return 0;
    },
    set(target, prop, value, receiver) {
        if (typeof value === 'number') {
            target[prop] = value;
            return true;
        } else {
            return false;
        }
    },
});

console.log(numbers[1]);
console.log(numbers[123]);

console.log(numbers.push(4));
console.log(numbers.push('test'));

let user = {
    name: 'John',
};

user = new Proxy(user, {
    get(target, prop, receiver) {
        alert(`GET ${prop}`);
        return Reflect.get(target, prop, receiver); // (1)
    },
    set(target, prop, val, receiver) {
        alert(`SET ${prop}=${val}`);
        return Reflect.set(target, prop, val, receiver); // (2)
    },
});

let name = user.name; // 显示 "GET name"
user.name = 'Pete'; // 显示 "SET name=Pete"

//todo: 代理一个 getter
let user1 = {
    _name: 'Guest',
    get name() {
        return this._name;
    },
};
let userProxy = new Proxy(user1, {
    get(target, prop, receiver) {
        return target[prop];
    },
});

alert(userProxy.name);

let admin = {
    __proto__: userProxy,
    _name: 'Admin',
};

// 期望输出：Admin
alert(admin.name); // 输出：Guest (?!?)

/**
 * 可观察的（Observable）
 */
let globalMap = new WeakMap();
function globalObserve(target, handler) {
    if (globalMap.has(target)) {
        globalMap.get(target).push(handler);
    } else {
        globalMap.set(target, [handler]);
    }
}

let handlers = Symbol('handlers');
function makeObservable(target) {
    /* 你的代码 */
    target[handlers] = [];
    target.observe = function (handler) {
        this[handlers].push(handler);
    };
    const proxy = new Proxy(target, {
        set(target, prop, value, receiver) {
            const success = Reflect.set(target, prop, value, receiver);
            if (success) {
                this[handlers].forEach((handler) => handler(prop, value));
            }
            return success;
        },
    });
    return proxy;
}

let user = {};
user = makeObservable(user);

user.observe((key, value) => {
    alert(`SET ${key}=${value}`);
});

user.name = 'John'; // alerts: SET name=John

/**
 * 高级柯里化实现
 */
function curry(func) {
    return function curried(...args) {
        if (args.length >= func.length) {
            return func.apply(this, args);
        } else {
            return function (...args2) {
                return curried.apply(this, args.concat(args2));
            };
        }
    };
}
