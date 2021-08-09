/*
 * @Author: myname
 * @Date: 2021-03-15 15:07:25
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-16 11:24:35
 */
let ReactDOM = {};

function isStringOrNumber(sth) {
    return typeof sth === 'string' || typeof sth === 'number';
}
/**
 *  fiber节点结构
 *    type   类型
 *    props  属性
 *   child  第一个子节点
 *   sibling  下一个兄弟节点
 *   return  父节点
 *  stateNode  原生标签的Dom节点
 */
//更新节点属性
function updateNode(node, props) {
    Object.keys(props).forEach((k) => {
        if (k === 'children') {
            if (isStringOrNumber(props[k])) {
                //node.appendChild(k)
                node.textContent = props[k] + '';
            } else {
            }
        } else {
            node[k] = props[k];
        }
    });
}

//创建节点
function createNode(workInProgress) {
    const {type, props} = workInProgress;
    const node = document.createElement(type);
    updateNode(node, props);
    return node;
}

//更新fragments组件
function updateFragmentComponent(workInProgress) {
    const {props} = workInProgress;
    reconcileChildren(workInProgress, props.children);
}

//更新类组件
function updateClassComponent(workInProgress) {
    const {type, props} = workInProgress;
    const instance = new type(props);
    const children = instance.render();
    reconcileChildren(workInProgress, children);
}

//更新函数组件
function updateFunctionComponent(workInProgress) {
    const {type, props} = workInProgress;
    const children = type(props);
    reconcileChildren(workInProgress, children);
}

//原生标签啊节点
function updateHostComponent(workInProgress) {
    if (!workInProgress.stateNode) {
        //创建DOM节点
        workInProgress.stateNode = createNode(workInProgress);
    }

    //todo: 协调子节点
    reconcileChildren(workInProgress, workInProgress.props.children);

    //打印fiber节点
    console.log('workInProgress', workInProgress);
}

function reconcileChildren(workInProgress, children) {
    if (isStringOrNumber(children)) {
        return;
    }

    const newChildren = Array.isArray(children) ? children : [children];

    let index = 0;
    let preSibling = null;
    while (index < newChildren.length) {
        const child = newChildren[index];
        const newFiber = {
            type: child.type,
            props: {...child.props},
            child: null,
            sibling: null,
            return: workInProgress,
            stateNode: null,
        };

        if (index === 0) {
            workInProgress.child = newFiber;
        } else {
            preSibling.sibling = newFiber;
        }
        preSibling = newFiber;
        index++;
    }
}

//渲染组件
//wipRoot: 正在工作的fiber的根节点
let wipRoot = null;
//下一个要渲染更新的任务  fiber
let nextUnitOfWork = null;
function render(vnode, container) {
    wipRoot = {
        type: 'div',
        props: {
            children: {...vnode},
        },
        stateNode: container,
    };
    nextUnitOfWork = wipRoot;
}

function performUnitOfWork(workInProgress) {
    //step1: 渲染更新fiber
    //todo:
    const {type} = workInProgress;
    //原生标签
    if (typeof type === 'string') {
        updateHostComponent(workInProgress);
    } else if (typeof type === 'function') {
        type.isReactComponent ? updateClassComponent(workInProgress) : updateFunctionComponent(workInProgress);
    } else {
        //更新fragment组件
        updateFragmentComponent(workInProgress);
    }

    //step2:返回一下个fiber
    //有长子
    if (workInProgress.child) {
        return workInProgress.child;
    }

    let nextFiber = workInProgress;

    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.return;
    }
}

function workLoop(deadline) {
    while (nextUnitOfWork && deadline.timeRemaining() > 1) {
        //todo: 渲染更新fiber,并且返回下一个任务
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    }

    //commit
    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

function commitRoot() {
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
/**
 * params:
 *   callback：接受一个参数 deadline，deadline是一个对象，对象上有两个属性
*       timeRemaining：timeRemaining属性是一个函数，
                函数的返回值表示当前空闲时间还剩下多少时间
*       didTimeout： didTimeout属性是一个布尔值，如果didTimeout是true，
                    那么表示本次callback的执行是因为超时的原因
 *   options 配置超时时间
 */
requestIdleCallback(workLoop);

ReactDOM.render = render;
export default ReactDOM;
