/*
 * Vue的全局配置
 */
Vue.config = {
    //为true时取消Vue所有的日志与警告，默认值为false
    silent: false,
    //自定义合并策略选项 { [key: string]:function }
    optionMergeStrategies: {
        _my_option: function (parent, child, vm) {
            return child + 1;
        },
    },
    //配置是否允许vue-devtools检查代码。开发版本默认为true，生产版本默认为false。
    // 务必在加载 Vue 之后，立即同步设置以下内容
    devtools: true,
    //指定组件的渲染和观察期间未捕获错误的处理函数。这个处理函数被调用时，可获取错误信息和 Vue 实例。
    //默认值：undefined
    //错误追踪服务 Sentry 和 Bugsnag 都通过此选项提供了官方支持。
    errorHandler: function (err, vm, info) {},
    //为 Vue 的运行时警告赋予一个自定义处理函数。注意这只会在开发者环境下生效，在生产环境下它会被忽略。
    //默认值：undefined
    warnHandler: function (msg, vm, trace) {},
    //类型：Array<string | RegExp>
    //默认值：[]
    //须使 Vue 忽略在 Vue 之外的自定义元素 (e.g. 使用了 Web Components APIs)。
    //否则，它会假设你忘记注册全局组件或者拼错了组件名称，从而抛出一个关于 Unknown custom element 的警告。
    ignoredElements: ['my-custom-web-component', 'another-web-component', /^icon-/],
    //类型：{ [key: string]: number | Array<number> }
    //默认值：{}
    //给 v-on 自定义键位设置别名。
    // <input type="text" @keyup.media-play-pause="method">
    keyCodes: {
        v: 86,
        f1: 112,
        //camelCase 不可用
        mediaPlayPause: 179,
        //使用kebab-case，且用双引号括起来
        'media-play-pause': 179,
        up: [38, 87],
    },
    //设置为 true 以在浏览器开发工具的性能/时间线面板中启用对组件初始化、编译、渲染和打补丁的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器上。
    performance: false,
    //设置为 false 以阻止 vue 在启动时生成生产提示。
    productionTip: true,
};

/**
 * optionMergeStrategies Demo
 */
Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
    return child + 1;
};

const Profile = Vue.extend({
    _my_option: 1,
});

//Profile.option_my_option = 2;

/**
 * 全局API
 */
/**
 * @param {Object} options 一个包含组件选项的对象
 * @description 使用基础Vue构造器，创建一个“子类”。
 * 注意: data选项必须是函数
 */
Vue.extend(options);

//todo 示例：
<div id="mount-point"></div>;
//创建构造器
let Profile = Vue.extend({
    tempalte: `<p>{{firstName}} {{lastName}} aka {{alias}} </p>`,
    data: function () {
        return {
            firstName: 'Walter',
            lastName: 'White',
            alias: 'Heiseberg',
        };
    },
});
new Profile().$mount('#mount-point');

/**
 * @param  {Function} [callback]
 * @param  {Object} [context]
 * 在下次 DOM 更新循环结束之后执行延迟回调。
 * 在修改数据之后立即使用这个方法，获取更新后的 DOM。
 */
Vue.nextTick([callback, context]);

//todo: 示例
//修改数据
vm.msg = 'Hello';
//DOM 还没有更新
Vue.nextTick(function () {
    //DOM 更新了
});
//作为一个Promise使用
Vue.nextTick().then(function () {
    //DOM更新了
});

/**
 * 向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
 * 它必须用于向响应式对象上添加新 property，因为 Vue 无法探测普通的新增 property
 * (比如 this.myObject.newProperty = 'hi')
 * @param {Object|Array} target
 * @param {String|number} propertyName/index
 * @param {any} value
 * 返回值：设置的值。
 * 注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。
 */
Vue.set(target, propertyName / index, value);
/**
 * 向响应式对象中添加一个 property，并确保这个新 property 同样是响应式的，且触发视图更新。
 */
Vue.delete(target, propertyName / index);
/**
 * @param {string} id
 * @param {Function | Object} [definition]
 * @description 注册或获取全局指令。
 */
Vue.directive(id, [definition]);
//todo 示例
Vue.directive('my-directive', {
    bind: function () {},
    inserted: function () {},
    update: function () {},
    componentUpdated: function () {},
    unbind: function () {},
});
