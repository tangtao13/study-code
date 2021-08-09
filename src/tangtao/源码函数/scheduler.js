/*
 * @Author: myname
 * @Date: 2021-03-22 15:44:12
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-22 15:56:44
 */

/**
 * todo: scheduleCallbackWithExpirationTime
 *  异步进行root 任务调度就是通过这个方法来做的，这里最主要的就是调用了
 * scheduler的scheduleDeferredCallback方法（在scheduler包中是scheduleWork）
 *   传入的是回调函数performAsyncWork，以及一个包含timeout超时事件的对象
 */
const NoWork = 0;
function scheduleCallbackWithExpirationTime(root: FiberRoot, expirationTime: ExpirationTime) {
    if (callbackExpirationTime !== NoWork) {
        if (expirationTime > callbackExpirationTime) {
            return;
        } else {
            if (callbackID !== null) {
                cancelDeferredCallback(callbackID);
            }
        }
    } else {
        startRequestCallbackTimer();
    }

    callbackExpirationTime = expirationTime;
    const currentMs = now() - originalStartimeMs;
    const expirationTimeMs = expirationTimeToMs(expirationTime);
    const timeout = expirationTimeMs - currentMs;
    callbackID = scheduleDeferredCallback(performAsyncWork, {timeout});
}
