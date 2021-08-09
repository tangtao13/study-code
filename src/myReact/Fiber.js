/*
 * @Author: myname
 * @Date: 2021-06-23 10:11:30
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-06-23 12:25:37
 */
let nextUnitOfWork = null;
let wipRoot = null;

function render(vnode, container) {
    wipRoot = {
        type: container.nodeName,
        props: {
            children: [vnode],
        },
        stateNode: container,
    };
    nextUnitOfWork = wipRoot;
}

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
    if (!wip.stateNode) {
        wip.stateNode = createNode(wip);
    }
    reconcileChildren(wip, wip.props.children);
    console.log(wip);
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
    if (nextUnitOfWork && IdleDeadline.timeRemaining() > 0) {
        //1. 更新当前任务
        //2. 返回下一个任务
        nextUnitOfWork = workInProgress(nextUnitOfWork);
    } else {
        //没有任务，进行提交操作
        commitRoot();
    }

    window.requestIdleCallback(workLoop);
}

function commitRoot() {
    if (!wipRoot) return;
    commitWorker(wipRoot.child);
    wipRoot = null;
}
function commitWorker(workInProgress) {
    if (!workInProgress) {
        return;
    }
    //setp 1: 更新自己
    let parentNodeFiber = workInProgress.return;
    while (!parentNodeFiber.stateNode) {
        parentNodeFiber = parentNodeFiber.return;
    }
    const parentNode = parentNodeFiber.stateNode;
    if (workInProgress.stateNode) {
        parentNode.appendChild(workInProgress.stateNode);
    }

    //setp 2: 更新第一个子节点
    commitWorker(workInProgress.child);
    //setp 3: 更新兄弟节点
    commitWorker(workInProgress.sibling);
}
window.requestIdleCallback(workLoop);

function createNode(vnode) {
    const {type} = vnode;
    let node = null;
    if (isString(type)) {
        node = createHostNode(vnode);
    }
    return node;
}

function createHostNode(vnode) {
    const {type} = vnode;
    const node = document.createElement(type);
    updateHostNode(node, vnode.props);
    return node;
}

//更新属性
function updateHostNode(node, props) {
    Object.keys(props).forEach((key) => {
        if (key === 'children') {
            if (isString(props[key])) node.textContent = props[key] + '';
        } else if (key.slice(0, 2) === 'on') {
            const eventName = key.slice(2, 3).toLowerCase() + key.slice(3);
            node.addEventListener(eventName, props[key]);
        } else {
            node[key] = props[key];
        }
    });
}

//更新子节点
function reconcileChildren(parentFiber, children) {
    if (isString(children)) return;
    let preFiber = null;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let fiber = createFiber(child, parentFiber);
        if (preFiber == null) {
            parentFiber.child = fiber;
        } else {
            preFiber.sibling = fiber;
        }
        preFiber = fiber;
    }
}

function isString(type) {
    return typeof type == 'string';
}
let ReactDOM = {};
ReactDOM.render = render;
export default ReactDOM;
