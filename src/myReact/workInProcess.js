/*
 * @Author: myname
 * @Date: 2021-06-23 10:58:14
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-06-23 11:15:30
 */
let nextUnitWork = null;

function workInProgress(wip) {
    //todo 处理自己

    const {type} = wip;
    if (isString(type)) {
        updateHostComponent(wip);
    }

    //返回下一个任务
    if (wip.child) {
        return wip.child;
    }
    let nextWip = wip;
    while (nextWip) {
        if (nextWip.sibling) {
            return nextWip.sibling;
        }
        nextWip = nextWip.return;
    }
}

//更新原生标签组件
function updateHostComponent(wip) {
    let fiber = createFiber(wip);
}

function createFiber(vnode, parenFiber) {
    return {
        type: vnode.type,
        props: vnode.props,
        index: 0,
        key: vnode.key,
        child: null,
        sibling: null,
        return: parenFiber,
        stateNode: null,
    };
}

function workLoop(IdleDeadline) {
    if (nextUnitWork && IdleDeadline.timeRemaining() > 0) {
        //1. 更新当前任务
        //2. 返回下一个任务
        nextUnitWork = workInProgress(nextUnitWork);
    }
    //没有任务，进行提交操作
}

window.requestIdleCallback(workLoop);
