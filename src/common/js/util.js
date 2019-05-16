/* 
**
解析url
http://localhost:8089/?id=1233&name=name#/goods
....?id=123456&name=xiaolongbao
解析成：{id:123456,name:"xiaolongbao"}
*/
export default function () {
  let urlString = window.location.search;
  let obj = {};
  //           ?  id   = 1233
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = urlString.match(reg); // 返回值是数组 ["?id=123456","&name=xiaolongbao"]
    arr.forEach((item) => {
      // substring(index) 返回值是字符串 从index开始，包括index向后截取字符串
      let tempArr = item.substring(1).split("=");

      // obj[tempArr[0]] = tempArr[1];
      // encodeURIComponent和decodeURIComponent可以编码和解码URI特殊字符（如#，/，￥等），而decodeURI则不能。
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val
    })

  return obj;
}