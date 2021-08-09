/**
 * XMLHttpRequest
 * 在现代 Web 开发中，出于以下三种原因，我们还在使用 XMLHttpRequest：
 *   - 历史原因：我们需要支持现有的使用了 XMLHttpRequest 的脚本。
 *   - 我们需要兼容旧浏览器，并且不想用 polyfill（例如为了使脚本更小）。
 *   - 我们需要做一些 fetch 目前无法做到的事情，例如跟踪上传进度。
 */
let xhr = new XMLHttpRequest();
xhr.onload = function () {
    console.log(`Loaded:${xhr.status}  ${xhr.response}`);
};
xhr.onerror = function () {
    console.log(`Network Error`);
};
xhr.onprogress = function (event) {
    // event.loaded 已经下载了多少字节
    // event.lengthComputable = true ，当服务器发送了Content-Length header时
    // event.total 总字节数（如果lengthComputable为true）
    console.log(`Received ${event.loaded} of ${event.total}`);
};

//todo: 可恢复的文件上传
/**
 * 算法：
 *  1. 创建一个文件ID，以唯一标识我们要上传的文件
 *  2. 向服务器发送一个请求，询问它已经有了多少字节
 */

//todo: 长轮询
async function subscribe() {
    let response = await fetch('/subscribe');
    if (respoonse.status == 502) {
        //状态502是连接超时错误，连接挂起时间过长时可能发生
        //远程服务器或代理会关闭它让我们重新连接
        await subscribe();
    } else if (response.status !== 200) {
        showMessage(response.statusText);
        await new Promise((resolve) => settimeout(resolve, 1000));
        await subscribe();
    } else {
        //获取并显示消息
        let message = await response.text();
        showMessage(message);
        //再次调用subscribe()以获取下一条消息
        subscribe();
    }
}
subscribe();
function showMessage() {}
