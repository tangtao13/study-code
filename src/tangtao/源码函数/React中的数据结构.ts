/*
 * @Author: myname
 * @Date: 2021-03-22 10:23:50
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-22 10:35:19
 */
/**
 * FiberRoot
 */

type BaseFiberRootProperties = {|
    //root节点，render方法接收的第二个参数
    containerInfo: any,
    //只有在持久更新中会用到，也就是不支持增量更新的平台，react-dom中不会用到
    pendingChildren: any,
    //当前应用对应的Fiber对象，是Root Fiber
    current: Fiber,
    /**
     * 以下的优先级是用来区分：
     *  1） 没有提交（committed）的任务
     *  2） 没有提交的挂起任务
     *  3） 没有提交的可能被挂起的任务
     * 我们选择不追踪每个单租的阻塞登记，为了兼顾性能
     *  The earliest and latest priority levels that are suspended from commiting.
     *  最老的和最新的在提交的时候被挂起的任务
     */
    earliestSuspendedTime: ExpirationTime,
    latestSuspenedTime:ExpirationTime,
}