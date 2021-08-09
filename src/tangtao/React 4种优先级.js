let listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
    listenerPriority
);

export function createEventListenerWrapperWithPriority(
    targetContainer: EventTarget,
    domEventName: DOMEventName,
    eventSystemFlags: EventSystemFlags,
    priority?: EventPriority
): Function {
    const eventPriority = priority === undefined ? getEventPriorityForPluginSystem(domEventName) : priority;
    let listenerWrapper;
    switch (eventPriority) {
        case DiscreteEvent:
            listenerWrapper = dispatchDiscreteEvent;
            break;
        case UserBlockingEvent:
            listenerWrapper = dispatchUserBlockingUpdate;
            break;
        case ContinuousEvent:
        default:
            listenerWrapper = dispatchEvent;
            break;
    }
    return listenerWrapper.bind(null, domEventName, eventSystemFlags, targetContainer);
}

function dispatchUserBlockingUpdate(domEventName, eventSystemFlags, container, nativeEvent) {
    runWithPriority(
        UserBlockingPriority,
        dispatchEvent.bind(null, domEventName, eventSystemFlags, container, nativeEvent)
    );
}

function unstable_runWithPriority(priorityLevel, eventHandler) {
    switch (priorityLevel) {
        case ImmediatePriority:
        case UserBlockingPriority:
        case NormalPriority:
        case LowPriority:
        case IdlePriority:
            break;
        default:
            priorityLevel = NormalPriority;
    }
    // 记录优先级到Scheduler内部的变量里
    currentPriorityLevel = priorityLevel;
    var previousPriorityLevel = currentPriorityLevel;
    try {
        return eventHandler();
    } finally {
        currentPriorityLevel = previousPriorityLevel;
    }
}

const classComponentUpdater = {
    enqueueSetState(inst, payload, callback) {
        // 依据事件优先级创建update的优先级
        const lane = requestUpdateLane(fiber, suspenseConfig);
        const update = createUpdate(eventTime, lane, suspenseConfig);
        update.payload = payload;
        enqueueUpdate(fiber, update);
        // 开始调度
        scheduleUpdateOnFiber(fiber, lane, eventTime);
    },
};

function ensureRootIsScheduled(root: FiberRoot, currentTime: number) {
    // 获取nextLanes，顺便计算任务优先级
    const nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes);
    // 获取上面计算得出的任务优先级
    const newCallbackPriority = returnNextLanesPriority();
}

function getHighestPriorityLanes(lanes: Lanes | Lane): Lanes {
    // 都是这种比较赋值的过程，这里只保留两个以做简要说明
    const inputDiscreteLanes = InputDiscreteLanes & lanes;
    if (inputDiscreteLanes !== NoLanes) {
        return_highestLanePriority = InputDiscreteLanePriority;
        return inputDiscreteLanes;
    }
    if ((lanes & InputContinuousHydrationLane) !== NoLanes) {
        return_highestLanePriority = InputContinuousHydrationLanePriority;
        return InputContinuousHydrationLane;
    }
    return lanes;
}

export const SyncLanePriority: LanePriority = 17;
export const SyncBatchedLanePriority: LanePriority = 16;
const InputDiscreteHydrationLanePriority: LanePriority = 15;
export const InputDiscreteLanePriority: LanePriority = 14;
const InputContinuousHydrationLanePriority: LanePriority = 13;
export const InputContinuousLanePriority: LanePriority = 12;
const DefaultHydrationLanePriority: LanePriority = 11;
export const DefaultLanePriority: LanePriority = 10;
const TransitionShortHydrationLanePriority: LanePriority = 9;
export const TransitionShortLanePriority: LanePriority = 8;
const TransitionLongHydrationLanePriority: LanePriority = 7;
export const TransitionLongLanePriority: LanePriority = 6;
const RetryLanePriority: LanePriority = 5;
const SelectiveHydrationLanePriority: LanePriority = 4;
const IdleHydrationLanePriority: LanePriority = 3;
const IdleLanePriority: LanePriority = 2;
const OffscreenLanePriority: LanePriority = 1;
export const NoLanePriority: LanePriority = 0;
