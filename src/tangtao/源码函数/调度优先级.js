/*
 * @Author: myname
 * @Date: 2021-03-23 15:00:37
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-23 15:00:57
 */
function getCurrentPriorityLevel() {
    switch (Scheduler_getCurrentPriorityLevel()) {
        case Scheduler_ImmediatePriority: //1
            return ImmediatePriority$1;

        case Scheduler_UserBlockingPriority: //2
            return UserBlockingPriority$2;

        case Scheduler_NormalPriority: //3
            return NormalPriority$1;

        case Scheduler_LowPriority: //4
            return LowPriority$1;

        case Scheduler_IdlePriority: //5
            return IdlePriority$1;

        default: {
            {
                throw Error('Unknown priority level.');
            }
        }
    }
}
