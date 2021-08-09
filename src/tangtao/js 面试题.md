####JS 面试题

-   介绍 js 的节本类型:

    -   js 一共有 6 种基本类型：分别是 Undefined, Null, Boolean, Number, String, 还有在 ES6 中  
        新增的 Symbol 和 ES10 中新 增的 BigInt 类型。
    -   Symbol 代表创建后独一无二且不可变的数据类型，它的出现主要是为了解决可能出现的全局变量冲突的问题。
    -   使用 BigInt 可以安全的存储和操作大整数，即使这个整数已经超出了 Number 能够表示的安全整数范围。

-   JavaScript 有几种类型的值？ 你能画一下它们的内存图么？

    -   栈： 原始数据类型（Undefined、 Null、BOOlean、 Number、String）
    -   堆： 引用数据类型（对象、数组和函数）
