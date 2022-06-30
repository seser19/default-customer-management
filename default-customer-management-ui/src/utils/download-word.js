'use strict';

/**
 * 通过页面下载文件
 * @param fileName
 * @param stream
 */
export function downloadWord(fileName, stream,suffix) {
    let timestamp = new Date().getTime();
    const decodedData = atob(stream);
    let n = decodedData.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = decodedData.charCodeAt(n);
    }
    if (window.navigator.msSaveOrOpenBlob) {
        // IE浏览器
        const blob = new MSBlobBuilder();
        blob.append(u8arr);
        window.navigator.msSaveOrOpenBlob(blob.getBlob(), fileName + '.'+suffix);
    } else {
        // 其他浏览器
        const dataFile = new File([u8arr], '文件名', {type: suffix});
        const trigger = document.createElement('a');
        trigger.href = window.URL.createObjectURL(dataFile);
        trigger.download = trigger.download = fileName + '.'+suffix;
        trigger.click();
    }
}
