/*
 * @Author: myname
 * @Date: 2021-03-23 15:21:55
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-23 18:11:00
 */
var NoLanes = 0;

function renderRootSync(root, lanes) {
    do {
        try {
            workLoopSync();
            break;
        } catch (thrownValue) {
            handleError(root, thrownValue);
        }
    } while (true);
}

function workLoopSync() {
    while (workInProgress !== null) {
        performUnitOfWork(workInProgress);
    }
}

function performUnitOfWork(unitOfWork) {
    var current = unitOfWork.alternate;
    setCurrentFiber(unitOfWork);
    var next;
    if ((unitOfWork.mode & ProfileMode) !== NoMode) {
        startProfilerTimer(unitOfWork);
        next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
        stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
    } else {
        next = beginWork$1(current, unitOfWork, subtreeRenderLanes);
    }

    resetCurrentFiber();
    unitOfWork.memoizedProps = unitOfWork.pendingProps;

    if (next === null) {
        completeUnitOfWork(unitOfWork);
    } else {
        workInProgress = next;
    }

    ReactCurrentOwner$2.current = null;
}

//todo
function beginWork(current, workInProgress, renderLanes) {
    var updateLanes = workInProgress.lanes;
    if (current !== null) {
        var oldProps = current.memoizedProps;
        var newProps = workInProgress.memoizedProps;

        if (
            oldProps !== newProps ||
            hasContextChanged() || // Force a re-render if the implementation changed due to hot reload:
            workInProgress.type !== current.type
        ) {
            //If props or context changed, mark the fiber as having performed work.
            didReceiveUpdate = true;
        } else if (!includesSomeLane(renderLanes, updateLanes)) {
            // This fiber does not have any pending work. Bailout without entering the begin phase. There's still some bookkeeping we that needs to be done in this optimized path, mostly pushing stuff onto the stack.
            didReceiveUpdate = false;
            switch (workInProgress.tag) {
                case HostRoot:
                    break;
            }

            return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes);
        } else {
            if ((current.flags & ForceUpdateForLegacySuspense) !== NoFlags) {
                // This is a special case that only exists for legacy mode.
                // See https://github.com/facebook/react/pull/19216.
                didReceiveUpdate = true;
            } else {
                // An update was scheduled on this fiber, but there are no new props
                // nor legacy context. Set this to false. If an update queue or context
                // consumer produces a changed value, it will set this to true. Otherwise,
                // the component will assume the children have not changed and bail out.
                didReceiveUpdate = false;
            }
        }
    } else {
        didReceiveUpdate = false;
    }

    // Before entering the begin phase, clear pending update priority.
    // TODO: This assumes that we're about to evaluate the component and process
    // the update queue. However, there's an exception: SimpleMemoComponent
    // sometimes bails out later in the begin phase. This indicates that we should
    // move this assignment out of the common path and into each branch.

    workInProgress.lanes = NoLanes;
    switch (workInProgress.tag) {
        //value: 2
        //todo: 高阶组件？ 区分ClassComponent还是FunctionComponent
        case IndeterminateComponent: {
            return mountIndeterminateComponent(current, workInProgress, workInProgress.type, renderLanes);
        }
        //value: 16
        case LazyComponent: {
            var elementType = workInProgress.elementType;
            return mountLazyComponent(current, workInProgress, elementType, updateLanes, renderLanes);
        }
        //value: 0
        case FunctionComponent: {
            var _Component = workInProgress.type;
            var unresolvedProps = workInProgress.pendingProps;
            var resolvedProps =
                workInProgress.elementType === _Component
                    ? unresolveProps
                    : resolveDefaultProps(_Component, unresolvedProps);
            return updateFunctionComponent(current, workInProgress, _Component, resolvedProps, renderLanes);
        }
        //value: 1
        case ClassComponent: {
            var _Component2 = workInProgress.type;
            var _unresolvedProps = workInProgress.pendingProps;
            var _resolvedProps =
                workInProgress.elementType === _Component2
                    ? _unresolvedProps
                    : resolveDefaultProps(_Component2, unresolvedProps);
            return updateClassComponent(current, workInProgress, _Component2, _resolvedProps, renderLanes);
        }
        //value: 3
        case HostRoot:
            return updateHostRoot(current, workInProgress, renderLanes);
        //value: 5
        case HostComponent:
            return updateHostComponent(current, workInProgress, renderLanes);
        //value: 6
        case HostText:
            return updateHostText(current, workInProgress);
        //value: 13
        case SuspenseComponent:
            return updateSuspenseCompnent(current, workInProgress, renderLanes);
        //value: 4
        case HostPortal:
            return updatePortalCompoennt(current, workInProgress, renderLanes);
        //value: 11
        case ForwardRef: {
            var type = workInProgress.type;
            var _unresolvedProps2 = workInProgress.pendingProps;
            var _resolvedProps2 =
                workInProgress.elementType === type ? _unresolvedProps2 : resolveDefaultProps(type, _unresolvedProps2);
            return updateForwardRef(current, workInProgress, type, _resolvedProps2, renderLanes);
        }
        //value:7
        case Fragment:
            return updateFragment(current, workInProgress, renderLanes);
        //value:8
        case Mode:
            return updateMode(current, workInProgress, renderLanes);
        //value:12
        case Profiler:
            return updateProfiler(current, workInProgress, renderLanes);
        //value:10
        case ContextProvider:
            return updateContextProvider(current, workInProgress, renderLanes);
        //value:9
        case ContextConsumer:
            return updateContextConsumer(current, workInProgress, renderLanes);
        //value:14
        case MemoCompoent: {
            var _type2 = workInProgress.type;
            // Resolve outer props first, then resolve inner props.
            var _unresolvedProps3 = workInProgress.pendingProps;
            var _resolvedProps3 = resolveDefaultProps(_type2, _unresolvedProps3);
            {
                if (workInProgress.type !== workInProgress.elementType) {
                    var outerPropTypes = _type2.outerPropTypes;
                    if (outerPropTypes) {
                        checkPropTypes(outerPropTypes, _resolvedProps3, 'prop', getComponentName(_type2));
                    }
                }
            }
            _resolvedProps3 = resolveDefaultProps(_type2, _resolvedProps3);
            return updateMemoComponent(current, workInProgress, _type2, _resolvedProps3, updateLanes, renderLanes);
        }
        //value:15
        case SimpleMemoComponent: {
            return updateSimpleMemoComponent(
                current,
                workInProgress,
                workInProgress.type,
                workInProgress.pendingProps,
                updateLanes,
                renderLanes
            );
        }
        //value:17
        case IncompleteClassComponent: {
            var _Component3 = workInProgress.type;
            var _unresolvedProps4 = workInProgress.pendingProps;
            var _resolvedProps4 =
                workInProgress.elementType === _Component3
                    ? _unresolvedProps4
                    : resolveDefaultProps(_Component3, _unresolvedProps4);
            return mountIncompleteClassComponent(current, workInProgress, _Component3, _resolvedProps4, renderLanes);
        }
        //value:19
        case SuspenseListComponent: {
            return updateSuspenseListComponent(current, workInProgress, renderLanes);
        }
        //value:20
        case FundamentalComponent: {
            break;
        }
        //value:21
        case ScopeCompoent: {
            break;
        }
        //value:22
        case Block: {
            break;
        }
        //value:23
        case OffscreenComponent: {
            return updateOffscreenComponent(current, workInProgress, renderLanes);
        }
        //value:24
        case LegacyHiddenComponent: {
            return updateLegacyHiddenComponent(current, workInProgress, renderLanes);
        }
        default:
            break;
    }

    {
        {
            throw Error(
                'Unknown unit of work tag (' +
                    workInProgress.tag +
                    '). This error is likely caused by a bug in React. Please file an issue.'
            );
        }
    }
}

var beginWork$1;
{
    var dummyFiber = null;
    beginWork$1 = function (current, unitOfWork, lanes) {
        var originalWorkInProgressCopy = assignFiberPropertiesInDEV(dummyFiber, unitOfWork);
        try {
            return beginWork(current, unitOfWork, lanes);
        } catch (originError) {
            if (
                originalError !== null &&
                typeof originalError === 'object' &&
                typeof originalError.then === 'function'
            ) {
                // Don't replay promises. Treat everything else like an error.
                throw originalError;
            } // Keep this code in sync with handleError; any changes here must have
            // corresponding changes there.

            resetContextDependencies();
            resetHooksAfterThrow(); // Don't reset current debug fiber, since we're about to work on the
            // same fiber again.
            // Unwind the failed stack frame

            unwindInterruptedWork(unitOfWork); // Restore the original properties of the fiber.

            assignFiberPropertiesInDEV(unitOfWork, originalWorkInProgressCopy);

            if (unitOfWork.mode & ProfileMode) {
                // Reset the profiler timer.
                startProfilerTimer(unitOfWork);
            } // Run beginWork again.

            invokeGuardedCallback(null, beginWork, null, current, unitOfWork, lanes);

            if (hasCaughtError()) {
                var replayError = clearCaughtError(); // `invokeGuardedCallback` sometimes sets an expando `_suppressLogging`.
                // Rethrow this error instead of the original one.

                throw replayError;
            } else {
                // This branch is reachable if the render phase is impure.
                throw originalError;
            }
        }
    };
}

function updateHostRoot(current, workInProgress, renderLanes) {
    reconcileChildren(current, workInProgress, nextChildren, renderLanes);
}

function reconcileChildren(current, workInProgress, nextChildren, renderLanes) {
    if (current === null) {
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren, renderLanes);
    } else {
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren, renderLanes);
    }
}

function reconcileChildFibers(returnFiber, currentFirstChild, newChild, lanes) {
    //todo: 处理简写的Fragment组件
    var isUnkeyedTopLevelFragment =
        typeof newChild === 'object' &&
        newChild !== null &&
        newChild.type === REACT_FRAGMENT_TYPE &&
        newChild.key === null;
    if (isUnkeyedTopLevelFragment) {
        newChild = newChild.props.children;
    } // Handle object types

    var isObject = typeof newChild === 'object' && newChild !== null;
    if (isObject) {
        switch (newChild.$$typeof) {
            case REACT_ELEMENT_TYPE:
                return placeSingleChild(reconcileSingleElement(returnFiber, currentFirstChild, newChild, lanes));
            case REACT_PORTAL_TYPE:
                return placeSingleChild(reconcileSinglePortal(returnFiber, currentFirstChild, newChild, lanes));
        }
    }

    if (typeof newChild === 'string' || typeof newChild === 'number') {
        return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFirstChild, '' + newChild, lanes));
    }

    if (isArray$1(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFirstChild, newChild, lanes);
    }

    if (getIteratorFn(newChild)) {
        return reconcileChildrenIterator(returnFiber, currentFirstChild, newChild, lanes);
    }

    if (isObject) {
        throwOnInvalidObjectType(returnFiber, newChild);
    }

    {
        if (typeof newChild === 'function') {
            warnOnFunctionType(returnFiber);
        }
    }

    if (typeof newChild === 'undefined' && !isUnkeyedTopLevelFragment) {
        // If the new child is undefined, and the return fiber is a composite
        // component, throw an error. If Fiber return types are disabled,
        // we already threw above.
        switch (returnFiber.tag) {
            case ClassComponent: {
                {
                    var instance = returnFiber.stateNode;

                    if (instance.render._isMockFunction) {
                        // We allow auto-mocks to proceed as if they're returning null.
                        break;
                    }
                }
            }
            // Intentionally fall through to the next case, which handles both
            // functions and classes
            // eslint-disable-next-lined no-fallthrough

            case Block:
            case FunctionComponent:
            case ForwardRef:
            case SimpleMemoComponent: {
                {
                    {
                        throw Error(
                            (getComponentName(returnFiber.type) || 'Component') +
                                '(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null.'
                        );
                    }
                }
            }
        }
    } // Remaining cases are all treated as empty.

    return deleteRemainingChildren(returnFiber, currentFirstChild);
}
