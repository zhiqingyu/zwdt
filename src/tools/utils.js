// utils.js 通常也包含一组实用函数，但更强调的是其在代码中的广泛使用，可能会包括一些与业务相关的实用函数。
import CryptoJS from "crypto-js";
import {
  sm2
} from 'sm-crypto'
import {
  sm4
} from 'gm-crypt'



// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("W7HZY7FXZH7LAEHQ "); //""中与后台一样  密码
const IV = CryptoJS.enc.Utf8.parse(); //""中与后台一样
let s = "W7HZY7FXZH7LAEHQ "
let codeStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//加密

/**
 * AES加密 ：字符串 key iv  返回base64
 */
function Encrypt(word, keyStr = s, ivStr) {
  let key = KEY
  let iv = IV
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
/**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
function Decrypt(word, keyStr = s, ivStr) {
  let key = KEY
  let iv = IV
  if (keyStr) {
    key = CryptoJS.enc.Utf8.parse(keyStr);
    iv = CryptoJS.enc.Utf8.parse(ivStr);
  }

  let base64 = CryptoJS.enc.Base64.parse(word);
  let src = CryptoJS.enc.Base64.stringify(base64);

  let decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}

let publicKey = '04655FC29B41B9105E6BA66C33F2AA8DBDA0CA1590FBED72E19411DDF298FBB951EFC5A5116CA25B027F42E9D4127BC0F31B6E97C3480B54CCDCF826606B30454E'
let privateKey = '00F3931037075666AABFECF7B1BD67918EDAE4B84E3CBC2011F500E74BB1883A80'

//加密
function encrypt2(str) {
  // console.log('04' + sm2.doEncrypt(str, publicKey, 0));
  return '04' + sm2.doEncrypt(str, publicKey, 0)
}

function decrypt2(str) {
  return sm2.doDecrypt(str.slice(2), privateKey, 0)
}

function encryption4(passWord) {
  let sm4Config = {
    //配置sm4参数
    key: 'HENG1AN2WEN3YIN4', //这里这个key值是跟后端要的
    mode: 'ecb', // 加密的方式有两种，ecb和cbc两种，也是看后端如何定义的，不过要是cbc的话下面还要加一个iv的参数，ecb不用
    iv: 'HENG1AN2WEN3YIN4',
    cipherType: 'base64',
  };
  let SM4 = new sm4(sm4Config);
  let Pwd = SM4.encrypt(passWord);
  return Pwd;
}
//sm4加密
function encryptSm4(str, key) {
  //str  字符串类型的
  let sm4en = new SM4Util();
  sm4en.secretKey = key;
  return sm4en.encryptData_ECB(str);
}
/**
 * 处理密钥字符格式
 * @param: key 需要转格式的字符
 */
function encParse(key) {
  return CryptoJs.enc.Latin1.parse(key);
}

/**
 * 判断是否是Base64格式的字符串
 */
function isBase64(str) {
  let reg = /^(([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=))|(([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{2}==))$/;
  return reg.test(str);
}


//根据时间段返回不同提示语

function getGreetingMsg() {
  const h = (new Date()).getHours();
  let greetingMsg = '';
  if (0 <= h && h < 6) {
    greetingMsg = '凌晨好';
  } else if (6 <= h && h <= 11) {
    greetingMsg = '早上好';
  } else if (11 < h && h <= 14) {
    greetingMsg = '中午好';
  } else if (14 < h && h <= 17) {
    greetingMsg = '下午好';
  } else if (17 < h && h <= 24) {
    greetingMsg = '晚上好';
  }
  return greetingMsg;
}

//截取查询字符串
function getUrlParamValue(name) {
  if (name == null || name == 'undefined') {
    return null;
  }
  let searchIndex = location.href.indexOf("?");
  let searchStr = decodeURI(location.href.substring(searchIndex))
  let infoIndex = searchStr.indexOf(name + "=");
  if (infoIndex == -1) {
    return null;
  }
  let searchInfo = searchStr.substring(infoIndex + name.length + 1);
  let tagIndex = searchInfo.indexOf("&");
  if (tagIndex != -1) {
    searchInfo = searchInfo.substring(0, tagIndex);
  }
  return searchInfo;
}

//通过线上url获取文件对象
function getImageFileFromUrl(url, imageName) {
  // imageName一定要带上后缀
  let p = new Promise((resolve, reject) => {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.setRequestHeader('Accept', 'image/jpeg');
    xhr.responseType = "blob";
    xhr.onload = () => {
      blob = xhr.response;
      let imgFile = new File([blob], imageName, {
        type: 'image/jpeg'
      });
      resolve(imgFile);
    };
    xhr.send();
  });
  return p;
}

/**
 * 获取url中"?"符后的字串
 * 并对键值对解析，将对应的value存入到theRequest数组中
 * 下表为key，满足数组下标的唯一性
 */


function getRequest(data) {
  var url = data;
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    let n = str.indexOf("?");
    let str2 = str.substr(n + 1)
    let strs = str2.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  //获得？之后的没改key=value中的所有value的集合
  return theRequest;
}

function getRequestaa(data) {
  var url = data;
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    let n = url.indexOf("?");
    let str2 = url.substr(n + 1)
    let strs = str2.split("&");
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
    }
  }
  console.log(theRequest)
  //获得？之后的没改key=value中的所有value的集合
  return theRequest;
}


// function GetRequest() {
// 	var url = window.location.search;
// 	var theRequest = new Object();
// 	if (url.indexOf("?") != -1) {
// 		var str = url.substr(9);
// 		theRequest = str;
// 	}
// 	return theRequest;
// }

function getQuery(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

function timestampToTime(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  // console.log("140-------",date)
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
}

function timestampToTime3(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  // console.log("140-------",date)
  var Y = date.getFullYear();
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
  var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return Y + '-' + M + '-' + D
}


function timestampToTime2(timestamp) {
  var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '';
  var Y = Y < 2000 ? Y + 1900 : Y
  var yy = Y.toString().substr(2, 2);
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  return yy + M + D;
}

function MathRand() {
  var Num = "";
  for (var i = 0; i < 6; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

function MathRand3() {
  var Num = "";
  for (var i = 0; i < 3; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}

function generateMixed(n) {
  var chars = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
  var res = "";
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 62);
    res += chars[id];
  }
  return res;

}

function sort_ascii(obj) {
  let arr = new Array();
  let num = 0;
  for (let i in obj) {
    arr[num] = i;
    num++;
  }
  let sortArr = arr.sort();
  //let sortObj = {};    //完成排序值
  let str = ''; //自定义排序字符串
  for (let i in sortArr) {
    str += sortArr[i] + '=' + obj[sortArr[i]] + '&';
  }
  //去除两侧字符串
  let char = '&'
  str = str.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
  return str;
}

function encodeName(str) {
  if (null != str && str != undefined) {
    if (str.length <= 2) {
      return '*' + str.substr(1, str.length)
    } else if (str.length <= 3) {
      return '**' + str.substr(2, str.length);
    } else if (str.length > 3 && str.length <= 6) {
      return "**" + str.substr(2, str.length);
    } else if (str.length > 6) {
      return str.substr(0, 2) + "****" + str.substr(6, str.length)
    }
  } else {
    return "";
  }
}
//身份证脱敏
function encodeSFZ(str) {
  if (str != null && str != undefined && str.length > 8) {
    return '**************' + str.substr(14, 18)
  } else {
    return str;
  }
}
//手机号脱敏 
function encodeSjh(str) {
  return str.substring(0, 3) + "****" + str.substring(7, 11)
}

function csjq() {
  let url = document.location.toString();
  console.log(url,"url::::::::;");
  let arrObj = url.split("?");
  let params = Object.create(null);
  if (arrObj.length > 1) {
    if (arrObj[1].indexOf("#/") > -1) {
      arrObj = arrObj[1].split("#/")[0];
      arrObj = arrObj.split("&");
    } else {
      arrObj = arrObj[1].split("&");
    }
    arrObj.forEach((item) => {
      item = item.split("=");
      params[item[0]] = item[1];
    });
  }
  return params;
}
export {
  encrypt2,
  decrypt2,
  encryptSm4,
  encryption4,
  getGreetingMsg,
  getUrlParamValue,
  Encrypt,
  Decrypt,
  getImageFileFromUrl,
  getRequest,
  getRequestaa,
  getQuery,
  timestampToTime,
  timestampToTime2,
  MathRand,
  MathRand3,
  generateMixed,
  sort_ascii,
  encodeName,
  encodeSFZ,
  timestampToTime3,
  encodeSjh,
  csjq
}