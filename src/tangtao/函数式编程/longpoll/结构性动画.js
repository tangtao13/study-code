/*
 * @Author: myname
 * @Date: 2021-06-04 14:57:57
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-06-04 15:04:34
 */

/**
 *
 * @param {duration}
 *      动画总时间
 * @param {timing(timeFraction)}
 *      时序函数，类似 CSS 属性 transition-timing-function，
 *  传入一个已过去的时间与总时间之比的小数（0 代表开始，1 代表结束），
 *  返回动画完成度（类似 Bezier 曲线中的 y）。
 * @param {draw(progress)}
 *      获取动画完成状态并绘制的函数。
 *  值 progress = 0 表示开始动画状态，progress = 1 表示结束状态。
 *  这是实际绘制动画的函数。
 */
function animate({timing, draw, duration}) {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        //timeFraction 从0增加到1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) {
            timeFraction = 1;
        }

        //计算当前的动画状态
        let progress = timing(timeFraction);

        //绘制
        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}
