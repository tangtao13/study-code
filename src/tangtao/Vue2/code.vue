<!--
 * @Author: myname
 * @Date: 2021-06-11 08:50:48
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-06-11 11:36:15
-->
<template>
    <div>
        <base-input label="用户名" v-model="usename" required placeholder="请输入用户名"></base-input>
        <base-checkbox v-myfocus v-model="lovingVue"></base-checkbox>
        <base-input v-on:focus.native="onFocus"></base-input>
        <!-- .sync 修饰符 -->
        <text-document v-bind:title="doc.title" v-on:update:title="doc.title = $event"></text-document>
        <text-document v-bind:title.sync="doc.title"></text-document>
    </div>
</template>
<script>
const baseInput = {
    inheritAttrs: false,
    props: ['label', 'value'],
    template: `
        <label>
            {{label}}
            <input
                v-bind:="$attrs" 
                v-bind:lable="label" 
                v-bind:value="value" 
                v-on:input="$emit('input',$event.target.value)"
            >
        </label>
    `,
};
const baseInput1 = {
    inheritAttrs: false,
    props: ['label', 'value'],
    computed: {
        inputListeners: function () {
            const vm = this;
            // `Object.assign` 将所有的对象合并为一个新对象
            return Object.assign({}, this.$listeners, {
                // 然后我们添加自定义监听器，
                // 或覆写一些监听器的行为
                input: function (event) {
                    // 这里确保组件配合 `v-model` 的工作
                    vm.$emit('input', event.target.value);
                },
            });
        },
    },
    template: `
        <label>
            {{label}}
            <input
                v-bind:="$attrs" 
                v-bind:lable="label" 
                v-bind:value="value" 
                v-on="inputListeners"
            >
        </label>
    `,
};
const baseCheckbox = {
    model: {
        prop: 'checked',
        event: 'change',
    },
    prop: {
        checked: Boolean,
    },
    template: `
        <input
        type="checkbox"
        v-bind:checked="checked"
        v-on:change="$emit('change', $event.target.checked)"
        >
    `,
};

const AsyncComponent = () => ({
    // 需要加载的组件 (应该是一个 `Promise` 对象)
    component: import('./MyComponent.vue'),
    // 异步组件加载时使用的组件
    loading: LoadingComponent,
    // 加载失败时使用的组件
    error: ErrorComponent,
    // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    delay: 200,
    // 如果提供了超时时间且组件加载也超时了，
    // 则使用加载失败时使用的组件。默认值是：`Infinity`
    timeout: 3000,
});

export default {
    data: function () {
        return {
            doc: {
                title: 'test',
            },
        };
    },
    components: {
        'base-input': baseInput,
        'base-checkbox': baseCheckbox,
    },
    directives: {
        myfocus: {
            inserted: function (el) {
                el.focus();
            },
        },
    },
    methods: {
        onFocus: function () {},
    },
};
</script>
