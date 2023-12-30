//错误计数
var loginErrCount = 0;
var freezeTime;

function $(id) {
  return document.getElementById(id);
}

function $$(className, location) {
  return document.getElementsByClassName(className)[location];
}

function turnToRegisterPage() {
  document.title = "注册";
  let front = $("cover");
  front.classList.add('turn');

  let back = $("back");
  back.classList.add('turn2');
}

function turnToLoginPage() {
  document.title = "登录";
  let front = $("cover");
  front.classList.remove('turn');

  let back = $("back");
  back.classList.remove('turn2');
}

// 登录部分
var freezeTime = 0; // 冻结时间，单位为秒
var loginErrCount = 0; // 密码输入错误次数

function login() {
  var account = $("account");
  var password = $("password");
  var isRememberPassword = $("savepwd").checked;

  // 输入的密码与正确的密码
  var inputpwd = "1234";
  var truepwd = "1234";

  // 验证账号
  var accountRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 手机号正则表达式
  if (!accountRegex.test(account.value)) {
    alert("请输入有效的邮箱！");
    return;
  }

  // 验证密码
  if (password.value.length < 6) {
    alert("密码长度不能少于 6 个字符");
    return;
  }

  if (freezeTime > 0) {
    alert("登录操作冻结中，还剩" + Math.ceil(freezeTime / 60) + "分钟。");
    return;
  }

  if (loginErrCount >= 5) {
    alert("密码输入错误次数过多，请10分钟后再试！");
    loginErrCount = 0;
    freezeTime = 10 * 60; // 冻结时间设置为10分钟
    count(freezeTime);
    return;
  }

  if (inputpwd !== truepwd) {
    alert("密码错误！请重新输入！");
    loginErrCount++;
    return;
  }

  // 执行登录操作
  savepwd();
  setCookie("account", account.value, 7);
  setCookie("password", password.value, 7);
  alert("登录成功！");
  window.location.href = "../html/usrinfo.html";
}

// 冻结登录操作计数
function count(duration) {
  var countdownTimer = setInterval(function () {
    duration--;
    freezeTime = duration;
    if (duration < 0) {
      clearInterval(countdownTimer);
      freezeTime = 0;
    }
  }, 1000);
}

// 注册部分
function register() {
  var account = document.getElementById('account-reg').value;
  var password = document.getElementById('password-reg').value;
  var confirmPassword = document.getElementById('repassword-reg').value;
  var accessCode = document.getElementById('accesscode').value;

  // 验证手机号
  var accountRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 手机号正则表达式
  if (!accountRegex.test(account)) {
    alert('请输入有效的邮箱作为账号');
    return false;
  }

  // 验证密码
  if (password.length < 6) {
    alert('密码长度不能少于 6 个字符');
    return false;
  }

  // 验证重复密码
  if (password !== confirmPassword) {
    alert('两次输入的密码不一致');
    return false;
  }

  // 验证验证码
  if (accessCode === '') {
    alert('请输入验证码');
    return false;
  }

  // 执行注册操作
  // ...

  // 返回 true 表示验证通过
  alert("提交成功！");
  alert("请继续完善个人信息！");
  window.location.href = "../html/usrinfo.html";
}

function updatePassword() {
  var account = document.getElementById('account-reset').value;
  var password = document.getElementById('password-reset').value;
  var confirmPassword = document.getElementById('repassword-reset').value;
  var accessCode = document.getElementById('accesscode-reset').value;

  var accountRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  if (!accountRegex.test(account)) {
    alert('请输入有效的邮箱作为账号');
    return false;
  }

  // 验证密码
  if (password.length < 6) {
    alert('密码长度不能少于 6 个字符');
    return false;
  }

  // 验证重复密码
  if (password !== confirmPassword) {
    alert('两次输入的密码不一致');
    return false;
  }

  // 验证验证码
  if (accessCode === '') {
    alert('请输入验证码');
    return false;
  }

  alert("密码修改成功！");
  location.reload();
}

// 发送验证码
function sendVertificationCode(btnnum) {
  // 禁用发送按钮防止重复点击
  var phoneNumber;
  var sendButton = $$('sendVer', btnnum);
  sendButton.disabled = true;
  sendButton.classList.add('disabled')

  // 发送验证码请求

  // 后端操作或调用api向邮箱发送验证码
  startCountdown(60, btnnum); // 启动倒计时，60 秒
}

function startCountdown(duration, btnnum) {
  var countdownTimer = setInterval(function () {
    var sendButton = $$("sendVer", btnnum);
    sendButton.innerHTML = '重新发送(' + duration + ')';
    duration--;

    if (duration < 0) {
      clearInterval(countdownTimer);
      sendButton.innerHTML = '发送验证码';
      sendButton.classList.remove('disabled')
      sendButton.disabled = false; // 启用发送按钮
    }
  }, 1000);
}

function turnToForgetPassword() {
  document.title = "忘记密码";
  let front = $("cover");
  front.classList.add('turn');

  let back = $("back2");
  back.classList.add('turn2');
}

function turnToLoginFromForget() {
  document.title = "登录";
  let front = $("cover");
  front.classList.remove('turn');

  let back = $("back2");
  back.classList.remove('turn2');
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

// 记住密码与登录状态保存
function savepwd() {
  if ($("savepwd").checked) {
    setCookie("isSavepwd", true, 7);
  }
  else {
    setCookie("isSavepwd", false);
  }
}

function loadLoginInfo() {
  $("account").value = "";
  $("password").value = "";
  // cookie存的是字符串
  var isSavepwd = Cookies.get('isSavepwd');
  console.log(isSavepwd);
  if (isSavepwd === "true") {
    var account = Cookies.get('account');
    var password = Cookies.get('password');
    $("account").value = account;
    $("password").value = password;
  }
}

//函数为传参而非调用
document.addEventListener("DOMContentLoaded", loadLoginInfo);