/**
 * 下载服务器上文件的方法
 * @param {String} url
 * @param {String} name
 */
export function fileDownload(url, name) {
  if (url && name) {
    // IE10+ 浏览器特殊处理
    if (navigator.msSaveBlob) {
      const fileIPAddress =
        process.env.NODE_ENV === "development" ?
        "http://10.19.11.35:8080/prod-api" :
        "http://120.52.31.129/prod-api";
      url = url.replace("/ftp-api", fileIPAddress);
      window.open(url, "_blank");
    } else {
      let a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
    }
  }
}
