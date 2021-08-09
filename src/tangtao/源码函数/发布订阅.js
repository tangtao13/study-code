/*
 * @Author: myname
 * @Date: 2021-03-25 14:45:04
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-25 16:10:19
 */
class Observer {
    constructor() {
        //事件中心
        this.event = {};
    }

    //发布 => 调用事件中心对应的函数
    publish(eventName, ...args) {
        if (this.event[eventName]) {
            this.event[eventName].forEach((cb) => {
                cb.apply(this, args);
            });
        }
    }

    //订阅 => 像事件中心添加事件
    subscribe(eventName, callback) {
        if (this.event[eventName]) {
            this.event[eventName].push(callback);
        } else {
            this.event[eventName] = [callback];
        }
    }

    //取消订阅
    unSubscribe(eventName, callback) {
        if (this.event[eventName]) {
            this.event[eventName] = this.event[eventName].filters((cb) => cb !== callback);
        }
    }
}

/**
 * JS 原生API实现
 */

//todo: apply()
Function.prototype.myApply = function (context, args) {
    //为context设置函数属性
    context.fn = this;

    let result = context.fn(...args);
    delete context.fn;
    return result;
};

//todo: call() 除了args，和apply一样
Function.prototype.myCall = function (context, ...args) {
    context.fn = this;
    let result = context.fn(...args);
    delete context.fn;
    return result;
};

//todo: bind()
//使用【闭包+apply】实现
Function.prototype.myBind = function (context, args1) {
    return (...args2) => this.apply(context, [...args1, ...args2]);
};

//todo: InstanceOf()
// 沿着父亲的原型链向上查找是否有儿子的原型
function myInstanceOf(son, father) {
    while (true) {
        son = Object.getPrototypeOf(son);
        if (!son) return false;
        if (son === father.prototype) return true;
    }
}
myInstanceOf([], Array);

//todo: new 关键字
function myNew(constructor_fn, ...args) {
    // 构造新的空对象
    let new_obj = {};
    new_obj.__proto__ = constructor_fn.prototype;
    let result = constructor_fn.apply(new_obj, args);
    //如果构造函数没有返回一个对象,则返回新创建的对象
    //如果构造函数返回了一个对象,则返回那个对象
    //如果构造函数返回原始值,则当作没有返回对象
    return result instanceof Object ? result : new_obj;
}

function Animal(name) {
    this.name = name;
}

let animal = myNew(Animal, 'dog');
console.log(animal.name);

//todo: 手写promise（常见promise.all,promise.race)
//Promise/A+ 规范规定的三种状态
const STATUS = {
    PENDING: 'pending',
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
};

class MyPromise {
    //构造函数接收一个执行回调
    constructor(executor) {
        this._status = STATUS.PENDING;
        this._value = undefined;
        this._resolveQueue = [];
        this.rejectQueue = [];
    }
}
