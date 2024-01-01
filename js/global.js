var avaterimageURL;

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

function loadAvater() {
  var islogin = getCookie('loginState');
  if (islogin === "true") {
    $·("navAvater").src = avaterimageURL;

  }
}
document.addEventListener("DOMContentLoaded", loadAvater);
