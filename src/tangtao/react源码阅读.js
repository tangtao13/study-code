/*
 * @Author: myname
 * @Date: 2021-03-17 14:32:03
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-18 09:31:11
 */
export type RootTag = 0 | 1 | 2;

export const LegacyRoot = 0;
export const BlockingRoot = 1;
export const ConcurrentRoot = 2;

//todo 创建react root根节点 type: FiberRootNode
root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container);

/**
 *  创建FiberRootNode 和 FiberNode
 * legacyCreateRootFromDOMContainer
 *    =>  createLegacyRoot
 *      =>  createLegacyRoot
 *          =>  new ReactDOMBlockingRoot(container, 0, undefined);
 *             => this._internalRoot = createRootImpl(container, tag, options);
 *                  => createContainer
 *                      => createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks);
 *                          =>
 */

function legacyRenderSubtreeIntoContainer() {
    let root: RootType = (container._reactRootContainer: any);
    let fiberRoot;
    if (!root) {
        //todo 初始化挂载
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
        fiberRoot = root._internalRoot; //FiberRootNode 节点

        if (typeof callback === 'function') {
            const originalCallback = callback;
            callback = function () {
                //todo 将ReactDOM.render函数的callback 在第一个非HTMLELement节点实例上调用
                const instance = getPublicRootInstance(fiberRoot);
                originalCallback.call(instance);
            };
        }
        // Initial mount should not be batched.
        // 初始化挂载批量进行
        unbatchedUpdates(() => {
            updateContainer(children, fiberRoot, parentComponent, callback);
        });
    } else {
        fiberRoot = root._internalRoot;
        if (typeof callback === 'function') {
            const originalCallback = callback;
            callback = function () {
                const instance = getPublicRootInstance(fiberRoot);
                originalCallback.call(instance);
            };
        }
        // Update
        updateContainer(children, fiberRoot, parentComponent, callback);
    }

    return getPublicRootInstance(fiberRoot);
}

function createRootImpl(container, tag = 0, options = undefined) {
    //todo 创建FiberRootNode 节点
    const root = createContainer(container, tag, false, null);

    markContainerAsRoot(root.current, container);

    //todo 绑定支持的合成事件
    const rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
    listenToAllSupportedEvents(rootContainerElement);
}

function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
    const root = new FiberRootNode(containerInfo, tag, hydrate);

    // Cyclic construction. This cheats the type system right now because
    // stateNode is any.
    //todo 创建FiberNode 节点
    const uninitializedFiber = createHostRootFiber(tag);

    //todo 根FiberRootNode 和 根FiberNode互相持有
    root.current = uninitializedFiber;
    uninitializedFiber.stateNode = root;

    //todo 初始化更新队列，并赋值给 root.updateQueue
    initializeUpdateQueue(uninitializedFiber);

    return root;
}

/**
 * FiberRootNode 结构
 */
class FiberRootNode {
    constructor(containerInfo, tag, hydrate) {
        this.tag = tag;
        this.containerInfo = containerInfo; //要挂载到的DOM节点
        this.pendingChildren = null;
        this.current = null; //  存储根FiberNode节点
        this.pingCache = null;
        this.finishedWork = null;
        this.timeoutHandle = noTimeout;
        this.context = null;
        this.pendingContext = null;
        this.hydrate = hydrate;
        this.callbackNode = null;
        this.callbackPriority = NoLanePriority;
        this.eventTimes = createLaneMap(NoLanes);
        this.expirationTimes = createLaneMap(NoTimestamp);

        this.pendingLanes = NoLanes;
        this.suspendedLanes = NoLanes;
        this.pingedLanes = NoLanes;
        this.expiredLanes = NoLanes;
        this.mutableReadLanes = NoLanes;
        this.finishedLanes = NoLanes;

        this.entangledLanes = NoLanes;
        this.entanglements = createLaneMap(NoLanes);
    }
}

/**
 * 更新队列
 * @param {*} fiber
 */
export function initializeUpdateQueue<State>(fiber: Fiber): void {
    const queue: UpdateQueue<State> = {
        baseState: fiber.memoizedState,
        firstBaseUpdate: null,
        lastBaseUpdate: null,
        shared: {
            pending: null, //存放 VNode 节点
        },
        effects: null, //
    };
    fiber.updateQueue = queue;
}

//批量更新
export function unbatchedUpdates<A, R>(fn: (a: A) => R, a: A): R {
    const prevExecutionContext = executionContext;
    executionContext &= ~BatchedContext;
    executionContext |= LegacyUnbatchedContext;
    try {
        return fn(a);
    } finally {
        executionContext = prevExecutionContext;
        if (executionContext === NoContext) {
            // Flush the immediate callbacks that were scheduled during this batch
            resetRenderTimer();
            flushSyncCallbackQueue();
        }
    }
}

function updateContainer(
    element: ReactNodeList, //VDOM
    container: OpaqueRoot, //FiberRootNode
    parentComponent: ?React$Component<any, any>, //父组件
    callback: ?Function //回调函数
): Lane {
    const current = container.current; // 根 FiberNode
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(current); //更新轨道

    const context = getContextForSubtree(parentComponent);
    if (container.context === null) {
        container.context = context;
    } else {
        container.pendingContext = context;
    }

    //todo 根据开始时间和轨道，创建更新队列对象
    const update = createUpdate(eventTime, lane);
    // Caution: React DevTools currently depends on this property
    // being called "element".
    update.payload = {element};

    callback = callback === undefined ? null : callback;
    if (callback !== null) {
        update.callback = callback;
    }

    enqueueUpdate(current, update); //校验更新队列对象是否是null
    scheduleUpdateOnFiber(current, lane, eventTime); //开始调度更新Fiber
    return lane;
}

//todo 调度更新： 1.渲染阶段 =》生成Fiber节点，  2. 提交阶段 =》 挂载DOM
function scheduleUpdateOnFiber(fiber: Fiber, lane: Lane, eventTime: number) {
    checkForNestedUpdates(); // 检查更新队列栈，最深为50
    //todo: 递归更新fiber节点的lane, 并返回根FiberRootNode的stateNode，即挂载的DOM节点
    const root = markUpdateLaneFromFiberToRoot(fiber, lane);

    // Mark that the root has a pending update.
    markRootUpdated(root, lane, eventTime);

    //
    // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
    // root inside of batchedUpdates should be synchronous, but layout updates
    // should be deferred until the end of the batch.
    if (lane === SyncLane) {
        if (
            // Check if we're inside unbatchedUpdates
            (executionContext & LegacyUnbatchedContext) !== NoContext &&
            // Check if we're not already rendering
            (executionContext & (RenderContext | CommitContext)) === NoContext
        ) {
            // Register pending interactions on the root to avoid losing traced interaction data.
            schedulePendingInteractions(root, lane);

            // This is a legacy edge case. The initial mount of a ReactDOM.render-ed
            // root inside of batchedUpdates should be synchronous, but layout updates
            // should be deferred until the end of the batch.
            performSyncWorkOnRoot(root);
        }
    }
}

//todo 这是不通过Scheduler的同步任务的入口点
function performSyncWorkOnRoot(root) {
    flushPassiveEffects();
}

function flushPassiveEffects() {}
