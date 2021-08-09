/*
 * @Author: myname
 * @Date: 2021-06-24 09:33:40
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-06-28 16:23:19
 */
const container = {
    _reactRootContainer: legacyCreateRootFromDOMContainer(container, forceHydrate),
};

function render(element, container, callback) {
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
}

function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    var root = container._reactRootContainer;
    var fiberRoot;
    if (!root) {
        //初次渲染，挂载DOM
        //todo 根据container创建创建根节点实例
        root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
        fiberRoot = root._internalRoot;

        // Initial mount should not be batched.
        unbatchedUpdates(function () {
            updateContainer(children, fiberRoot, parentComponent, callback);
        });
    } else {
        //更新渲染
        fiberRoot = root._internalRoot;
        if (typeof callback === 'function') {
            var _originalCallback = callback;
            callback = function () {
                var instance = getPublicRootInstance(fiberRoot);
                _originalCallback.call(instance);
            };
        }
        //更新
        updateContainer(children, fiberRoot, parentComponent, callback);
    }
    return getPublicRootInstance(fiberRoot);
}

function unbatchedUpdates(fn, a) {
    var prevExecutionContext = executionContext;
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

function legacyCreateRootFromDOMContainer(container, forceHydrate) {
    return createLegacyRoot(
        container,
        shouldHydrate
            ? {
                  hydrate: true,
              }
            : undefined
    );
}

function createLegacyRoot(container, options) {
    return new ReactDOMBlockingRoot(container, LegacyRoot, options);
}
function ReactDOMBlockingRoot(container, tag, options) {
    this._internalRoot = createRootImpl(container, tag, options);
}

//创建fiberRoot
function createRootImpl(container, tag, options) {
    //fiberRoot的DOM节点
    var root = createContainer(container, tag, hydrate);
    markContainerAsRoot(root.current, container);
    {
        var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
        listenToAllSupportedEvents(rootContainerElement);
    }
    return root;
}

function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
    return createFiberRoot(containerInfo, tag, hydrate);
}
function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
    // root是fiberRoot的DOM节点
    var root = new FiberRootNode(containerInfo, tag, hydrate);

    // stateNode is any.
    var uninitializedFiber = createHostRootFiber(tag);
    root.current = uninitializedFiber;
    uninitializedFiber.stateNode = root;
    initializeUpdateQueue(uninitializedFiber);
    return root;
}

function createHostRootFiber(tag) {
    var mode;

    if (tag === ConcurrentRoot) {
        mode = ConcurrentMode | BlockingMode | StrictMode;
    } else if (tag === BlockingRoot) {
        mode = BlockingMode | StrictMode;
    } else {
        mode = NoMode;
    }
    // HostRoot 3
    return createFiber(HostRoot, null, null, mode);
}

var createFiber = function (tag, pendingProps, key, mode) {
    // $FlowFixMe: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, pendingProps, key, mode);
};

function FiberNode(tag, pendingProps, key, mode) {
    // Instance
    this.tag = tag;
    this.key = key;
    this.elementType = null;
    this.type = null;
    this.stateNode = null;

    // Fiber
    this.return = null;
    this.child = null;
    this.sibling = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = pendingProps;
    this.memoizedProps = null;
    this.updateQueue = null;
    this.memoizedState = null;
    this.dependencies = null;
    this.mode = mode;

    // Effects
    this.flags = NoFlags;
    this.nextEffect = null;
    this.firstEffect = null;
    this.lastEffect = null;
    this.lanes = NoLanes;
    this.childLanes = NoLanes;
    this.alternate = null;

    {
        // Note: The following is done to avoid a v8 performance cliff.
        //
        // Initializing the fields below to smis and later updating them with
        // double values will cause Fibers to end up having separate shapes.
        // This behavior/bug has something to do with Object.preventExtension().
        // Fortunately this only impacts DEV builds.
        // Unfortunately it makes React unusably slow for some applications.
        // To work around this, initialize the fields below with doubles.
        //
        // Learn more about this here:
        // https://github.com/facebook/react/issues/14365
        // https://bugs.chromium.org/p/v8/issues/detail?id=8538
        this.actualDuration = Number.NaN;
        this.actualStartTime = Number.NaN;
        this.selfBaseDuration = Number.NaN;
        this.treeBaseDuration = Number.NaN; // It's okay to replace the initial doubles with smis after initialization.
        // This won't trigger the performance cliff mentioned above,
        // and it simplifies other profiler code (including DevTools).

        this.actualDuration = 0;
        this.actualStartTime = -1;
        this.selfBaseDuration = 0;
        this.treeBaseDuration = 0;
    }

    {
        // This isn't directly used but is handy for debugging internals:
        this._debugID = debugCounter++;
        this._debugSource = null;
        this._debugOwner = null;
        this._debugNeedsRemount = false;
        this._debugHookTypes = null;

        if (!hasBadMapPolyfill && typeof Object.preventExtensions === 'function') {
            Object.preventExtensions(this);
        }
    }
}

function FiberRootNode(containerInfo, tag, hydrate) {
    this.tag = tag;
    this.containerInfo = containerInfo;
    this.pendingChildren = null;
    this.current = null;
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

    {
        this.mutableSourceEagerHydrationData = null;
    }

    {
        this.interactionThreadID = tracing.unstable_getThreadID();
        this.memoizedInteractions = new Set();
        this.pendingInteractionMap = new Map();
    }

    {
        switch (tag) {
            case BlockingRoot:
                this._debugRootType = 'createBlockingRoot()';
                break;

            case ConcurrentRoot:
                this._debugRootType = 'createRoot()';
                break;

            case LegacyRoot:
                this._debugRootType = 'createLegacyRoot()';
                break;
        }
    }
}

function rerenderState(initialState) {
    return rerenderReducer((state, action) => {
        return typeof action === 'function' ? action(state) : action;
    }, initialState);
}

const [p, setP] = useState(0);
setP(1);
setP((state) => state + 1);

dispather(state, action);

/**
 * hooks
 */

// The work-in-progress fiber. I've named it differently to distinguish it from
// the work-in-progress hook.
let currentlyRenderingFiber = null;

// Hooks are stored as a linked list on the fiber's memoizedState field. The
// current hook list is the list that belongs to the current fiber. The
// work-in-progress hook list is a new list that will be added to the
// work-in-progress fiber.
let currentHook = null;
let workInProgressHook = null;

/**
 * @<Props,SecondArg>
 * @param current: Fiber|null
 * @param workInProgress: Fiber
 * @param Component: (p:props,arg:SecondArg) => any
 * @param props: Props
 * @param SecondArg: SecondArg
 * @param nextRenderLanes:Lanes
 * @returns any
 */
export function renderWithHook(current, workInProgress, Component, props, secondArg, nextRenderLanes) {
    renderLanes = nextRenderLanes;
    currentlyRenderingFiber = workInProgress;

    workInProgress.memoizedState = null;
    workInProgress.updateQueue = null;
    workInProgress.lanes = NoLanes;

    //以下变量应该被重置
    // currentHook = null;
    // workInProgressHook = null;
    // didScheduleRenderPhaseUpdate = false;

    ReactCurrentDispatcher.current =
        current === null || current.memoizedState === null ? HookDispatcherOnMount : HookDispatcherOnUpdate;

    let children = Component(props, secondArg);

    // 检查是否有渲染阶段更新
    if (didScheduleRenderPhaseUpdateDuringThisPass) {
        //只要渲染阶段更新继续，就保持循环渲染
        //被调度。使用计数器来防止无限循环
        let numberOfReRenders = 0;
        do {
            didScheduleRenderPhaseUpdateDuringThisPass = false;

            numberOfReRenders += 1;

            //从列表的开头重新开始
            currentHook = null;
            workInProgressHook = null;
            workInProgress.updateQueue = null;

            ReactCurrentDispatcher.current = HookDispatcherOnReRender;
            children = Component(props, secondArg);
        } while (didScheduleRenderPhaseUpdateDuringThisPass);
    }

    //我们可以假设前一个调度器总是这个调度器，因为我们设置了它
    //在渲染阶段的开始，没有重入。
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;

    //此检查使用 currentHook，因此它在 DEV 和 prod 包中的工作方式相同。
    //hookTypesDev 可以捕获更多情况（例如上下文），但仅限于 DEV 包。
    const didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
    renderLanes = NoLanes;
    currentlyRenderingFiber = null;
    currentHook = null;
    workInProgressHook = null;

    didScheduleRenderPhaseUpdate = false;

    if (enableLazyContextPropagation) {
        if (current !== null) {
            if (!checkIfWorkInProgressReceiveUpdate()) {
                const currentDependencies = current.dependencies;

                if (currentDependencies !== null && checkIfContextChanged(currentDependencies)) {
                    markWorkInProgressReceivedUpdate();
                }
            }
        }
    }

    return children;
}

export function bailoutHooks(current, workInProgress, lanes) {
    workInProgress.updateQueue = current.updateQueue;
    //不需要在这里重置，因为他们在完成阶段已经被重置
    workInProgress.flags &= ~(PassiveEffect | UpdateEffect);
    current.lanes = removeLanes(current.lanes, lanes);
}

export function resetHooksAfterThrow() {
    ReactCurrentDispatcher.current = ContextOnlyDispatcher;
    if (didScheduleRenderPhaseUpdate) {
        let hook = currentlyRenderingFiber.memoizedState;
        while (hook !== null) {
            const queue = hook.queue;
            if (queue !== null) {
                queue.pending = null;
            }
            hook = hook.next;
        }
        didScheduleRenderingPhaseUpdate = false;
    }

    renderLanes = NoLanes;
    currentlyRenderingFiber = null;

    currentHook = null;
    workInProgressHook = null;

    didScheduleRenderPhaseUpdateDuringThisPass = false;
}

function mountWorkInProgressHook() {
    const hook = {
        memoizedState: null,

        baseState: null,
        baseQueue: null,
        queue: null,

        next: null,
    };

    if (workInProgressHook === null) {
        //这是链表中的第一个hook
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
        //添加到列表的末尾
        workInProgressHook = workInProgress.next = hook;
    }

    return workInProgress;
}

function updateWorkInProgressHook() {
    let nextCurrentHook;
    if (currentHook === null) {
        const current = currentlyRenderingFiber.alternate;
        if (current !== null) {
            nextCurrentHook = current.memoizedState;
        } else {
            nextCurrentHook = null;
        }
    } else {
        nextCurrentHook = null;
    }

    let nextWorkInProgressHook;
    if (workInProgressHook === null) {
        nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
    } else {
        nextWorkInProgressHook = workInProgress.next;
    }

    if (nextWorkInProgressHook !== null) {
        //已经有一个正在进行中的工作。重复使用它
        workInProgressHook = nextWorkInProgressHook;
        nextWorkInProgressHook = workInProgressHook.next;

        currentHook = nextCurrentHook;
    } else {
        //从当前hook克隆
        currentHook = nextCurrentHook;

        const newHook = {
            memoizedState: currentHook.memoizedState,

            baseState: currentHook.baseState,
            baseQueue: current.baseQueue,
            queue: currentHook.queue,

            next: null,
        };

        if (workInProgressHook === null) {
            currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
        } else {
            workInProgressHook = workInProgressHook.next = newHook;
        }
        return workInProgressHook;
    }
}

function createFunctionComponentUpdateQueue() {
    return {
        lastEffect: null,
    };
}

function basicStateReducer(state, action) {
    return typeof action === 'function' ? action(state) : action;
}

function mountReducer(reducer, initialArg, init) {
    const hook = mountWorkInProgressHook();
    let initialState;
    if (init !== undefined) {
        initialState = init(initialArg);
    } else {
        initialState = initialArg;
    }
    hook.memoizedState = hook.baseState = initialState;
    const queue = (hook.queue = {
        pending: null,
        interleaved: null,
        lanes: NoLanes,
        dispatch: null,
        lastRenderedReducer: reducer,
        lastRenderedState: initialState,
    });
    const dispatch = (queue.dispatch = dispatchAction.bind(null, currentlyRenderingFiber, queue));
    return [hook.memoizedState, dispatch];
}

function dispatchAction(fiber, queue, action) {
    const eventTime = requestEventTime();
    const lane = requestUpdateLane(fiber);

    const update = {
        lane,
        action,
        eagerReducer: null,
        eagerState: null,
        next: null,
    };

    const alternate = fiber.alternate;

    if (fiber === currentlyRenderingFiber || (alternate !== null && alternate === currentlyRenderingFiber)) {
        // This is a render phase update. Stash it in a lazily-created map of
        // queue -> linked list of updates. After this render pass, we'll restart
        // and apply the stashed updates on top of the work-in-progress hook.
        didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
        const pending = queue.pending;
        if (pending === null) {
            //这是第一次更新。创建一个循环列表。
            update.next = update;
        } else {
            update.next = pending.next;
            pending.next = update;
        }
        queue.pending = update;
    } else {
        if (isInterleavedUpdate(fiber, lane)) {
            const interleaved = queue.interleaved;
            if (interleaved === null) {
                update.next = update;
                pushInterleavedQueue(queue);
            } else {
                update.next = interleaved.next;
                interleaved.next = update;
            }
            queue.interleaved = udpate;
        } else {
            const pending = queue.pending;
            if (pending === null) {
                update.next = update;
            } else {
                update.next = pending.next;
                pending.next = update;
            }
            queue.pending = update;
        }
        if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
            const lastRenderedReducer = queue.lastRenderedReducer;
            if (lastRenderedReducer !== null) {
                let preDispatcher;
                try {
                    const currentState = queue.lastRenderedState;
                    const eagerState = lastRenderedReducer(currentState, action);
                    update.eagerReducer = lastRenderedReducer;
                    update.eagerState = eagerState;
                    if (is(eagerState, currentState)) {
                        return;
                    }
                } catch (error) {
                } finally {
                }
            }
        }

        const root = scheduleUpdateOnFiber(fiber, lane, eventTime);
        if (isTransitionLane(lane) && root !== null) {
            let queueLanes = queue.lanes;

            // If any entangled lanes are no longer pending on the root, then they
            // must have finished. We can remove them from the shared queue, which
            // represents a superset of the actually pending lanes. In some cases we
            // may entangle more than we need to, but that's OK. In fact it's worse if
            // we *don't* entangle when we should.
            queueLanes = intersectLanes(queueLanes, root.pendingLanes);

            // Entangle the new transition lane with the other transition lanes.
            const newQueueLanes = mergeLanes(queueLanes, lane);
            queue.lanes = newQueueLanes;
            // Even if queue.lanes already include lane, we don't know for certain if
            // the lane finished since the last time we entangled it. So we need to
            // entangle it again, just to be sure.
            markRootEntangled(root, newQueueLanes);
        }
    }
}

const HooksDispatcherOnMount = {
    readContext,

    useCallback: mountCallback,
    useContext: readContext,
    useEffect: mountEffect,
    useImperativeHandle: mountImperativeHandle,
    useLayoutEffect: mountLayoutEffect,
    useMemo: mountMemo,
    useReducer: mountReducer,
    useRef: mountRef,
    useState: mountState,
    useDebugValue: mountDebugValue,
    useDeferredValue: mountDeferredValue,
    useTransition: mountTransition,
    useMutableSource: mountMutableSource,
    useOpaqueIdentifier: mountOpaqueIdentifier,

    unstable_isNewReconciler: enableNewReconciler,
};

if (enableCache) {
    HooksDispatcherOnMount.getCacheForType = getCacheForType;
    HooksDispatcherOnMount.useCacheRefresh = mountRefresh;
}

const HooksDispatcherOnUpdate = {
    readContext,

    useCallback: updateCallback,
    useContext: readContext,
    useEffect: updateEffect,
    useImperativeHandle: updateImperativeHandle,
    useLayoutEffect: updateLayoutEffect,
    useMemo: updateMemo,
    useReducer: updateReducer,
    useRef: updateRef,
    useState: updateState,
    useDebugValue: updateDebugValue,
    useDeferredValue: updateDeferredValue,
    useTransition: updateTransition,
    useMutableSource: updateMutableSource,
    useOpaqueIdentifier: updateOpaqueIdentifier,

    unstable_isNewReconciler: enableNewReconciler,
};
if (enableCache) {
    HooksDispatcherOnUpdate.getCacheForType = getCacheForType;
    HooksDispatcherOnUpdate.useCacheRefresh = updateRefresh;
}

export const ContextOnlyDispatcher = {
    readContext,

    useCallback: throwInvalidHookError,
    useContext: throwInvalidHookError,
    useEffect: throwInvalidHookError,
    useImperativeHandle: throwInvalidHookError,
    useLayoutEffect: throwInvalidHookError,
    useMemo: throwInvalidHookError,
    useReducer: throwInvalidHookError,
    useRef: throwInvalidHookError,
    useState: throwInvalidHookError,
    useDebugValue: throwInvalidHookError,
    useDeferredValue: throwInvalidHookError,
    useTransition: throwInvalidHookError,
    useMutableSource: throwInvalidHookError,
    useOpaqueIdentifier: throwInvalidHookError,

    unstable_isNewReconciler: enableNewReconciler,
};
