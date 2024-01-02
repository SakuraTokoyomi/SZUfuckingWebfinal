function $(id) {
  return document.getElementById(id);
}

function $$(className, location) {
  return document.getElementsByClassName(className)[location];
}

function jumpToUserInfo() {
  window.location.href = "../html/usrinfo.html"
}

// cookie写入与读取
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
  var cookieName = name + "=";
  var cookieArray = document.cookie.split(';');
  for (var i = 0; i < cookieArray.length; i++) {
    var cookie = cookieArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(cookieName) === 0) {
      return decodeURIComponent(cookie.substring(cookieName.length));
    }
  }
  return null;
}

function deleteCookie(cookieName) {
  document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}


function loadAvater() {
  var islogin = getCookie('loginState');
  var account = getCookie('account');
  var avaterimageURL;
  var avaterExtention = getCookie('avaterExtention');
  if (islogin === "true") {
    avaterimageURL = 'http://3zureus.vm.szu.moe:8080/image/user/' + account + '_avaterImage.' + avaterExtention;
    console.log('current avater: ' + avaterimageURL);
  }
  else avaterimageURL= '../image/login.png';
  $("navAvater").src = avaterimageURL;
  // userinfo page
  $('userAvater').src = avaterimageURL;
}
document.addEventListener("DOMContentLoaded", loadAvater);

// 向服务端发送POST请求
function postData(url, data, callback) {
  xhr.open("POST", url, true);
  xhr.responseType = 'json';
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
          if (xhr.status === 200) {
              // 如果状态码为 200 表示请求成功
              let jsonResponse = xhr.response;
              console.log(jsonResponse);
          }
          else if (xhr.status === 400){
              alert(xhr.response);
          }
          else {
              // 如果状态码不为 200，请求可能失败或者出现错误
              console.error('Request failed with status:', xhr.status);
              console.log(xhr.response);
          }
          // console.log("onreadystatechange 1st if triggered!");
      }
  }
  xhr.send(JSON.stringify(data));
}

function stringToDecimal(str) {
  // 将字符串转换为十六进制
  let hexString = '';
  for (let i = 0; i < str.length; i++) {
    hexString += str.charCodeAt(i).toString(16);
  }
  
  // 将十六进制串转换为十进制数字
  const decimalNumber = parseInt(hexString, 16) % 100;
  
  return decimalNumber;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function logout(){
  deleteCookie('userid');
  deleteCookie('loginState');
  deleteCookie('username');
  deleteCookie('usersign');
  deleteCookie('avaterExtention');
  deleteCookie('password');
  deleteCookie('account');
  deleteCookie('usersex');
  deleteCookie('isSavepwd');
  // alert('登出完毕');
  window.location.href = '../html/login.html';
}