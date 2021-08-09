/*
 * @Author: myname
 * @Date: 2021-03-23 08:57:32
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-23 09:00:37
 */

while (true) {
    queue = getNextQueue();
    task = queue.pop();
    execute(task);

    while (microtaskQueue.hasTasks()) {
        doMicrotask();
        if (isRepainTime()) {
            animationTasks = animationQueue.copyTasks();
            for (task in animationTasks) {
                doAnimationTask(task);
            }
            repaint();
        }
    }
}
