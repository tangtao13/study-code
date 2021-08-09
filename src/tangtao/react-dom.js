/**
 * 手写react
 */

function isStringOrNumber(sth) {
    return typeof sth === 'string' || typeof sth === 'number';
}

/**
 * todo: 将vnode变成node
 * @param {*} vnode
 * @returns
 */
function createNode(vnode) {
    let node;
    const {type} = vnode;
    if (typeof type === 'string') {
        //如果是原生节点
        node = updateHostCompent(vnode);
    } else if (isStringOrNumber(vnode)) {
        //文本节点
        node = updateTextComponent(vnode);
    } else if (typeof type === 'function') {
        node = type.isReactComponent ? updateClassComponent(vnode) : updateFunctionComponent(vnode);
    } else {
        //todo:fragment组件
        node = updateFragment(vnode);
    }

    return node;
}
//todo:fragment组件
function updateFragment(vnode) {
    const node = document.createDocumentFragment();
    reconcileChildren(node, vnode.props.children);
    return node;
}
//todo:更新类组件
function updateClassComponent(vnode) {
    const {type, props} = vnode;
    const instance = new type(props);
    const node = createNode(instance.render());
    return node;
}
//todo:更新函数组件
function updateFunctionComponent(vnode) {
    const {type, props} = vnode;
    const children = type(props);
    const node = createNode(children);
    return node;
}

//todo:更新文本节点
function updateTextComponent(vnode) {
    const node = document.createTextNode(vnode);
    return node;
}

//todo:更新原生节点
function updateHostCompent(vnode) {
    let {type, props} = vnode;
    const node = document.createElement(type);
    updateNode(node, props);
    reconcileChildren(node, props.children);
    return node;
}

//todo: 渲染子节点
function reconcileChildren(parentNode, children) {
    const newChildren = Array.isArray(children) ? children : [children];

    for (let i = 0; i < newChildren.length; i++) {
        let child = newChildren[i];
        render(child, parentNode);
    }
}

//todo: 更新节点的属性
function updateNode(node, props) {
    Object.keys(props)
        .filter((k) => {
            return k !== 'children';
        })
        .forEach((k) => {
            node[k] = props[k];
        });
}

function render(vnode, container) {
    console.log(vnode);
    const node = createNode(vnode);
    container.appendChild(node);
}

let ReactDOM = {};
ReactDOM.render = render;
export default ReactDOM;
