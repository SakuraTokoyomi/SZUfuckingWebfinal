function $(id) {
    return document.getElementById(id);
}

function turnToRegisterPage() {
    let front = $("cover");
    front.classList.add('turn');

    let back = $("back");
    back.classList.add('turn2');
}

function turnToLoginPage() {
    let front = $("cover");
    front.classList.remove('turn');

    let back = $("back");
    back.classList.remove('turn2');
}

function login() {
    var account = $("account");
    var password = $("password");
    var isRememberPassword = $("savepwd").checked;

    // 验证账号
    var accountRegex = /^1[0-9]{10}$/; // 手机号正则表达式
    if (!accountRegex.test(account.value)) {
        alert("请输入有效的手机号码作为账号");
        return;
    }

    // 验证密码
    if (password.value.length < 6) {
        alert("密码长度不能少于 6 个字符");
        return;
    }

    // 执行登录操作
    // ...
    alert("登录成功！");
}

function register() {
    var account = document.getElementById('account-reg').value;
    var password = document.getElementById('password-reg').value;
    var confirmPassword = document.getElementById('repassword-reg').value;
    var accessCode = document.getElementById('accesscode').value;

    // 验证手机号
    var accountRegex = /^1[0-9]{10}$/; // 手机号正则表达式
    if (!accountRegex.test(account)) {
        alert('请输入有效的手机号码作为账号');
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
    return true;
}

function sendVertificationCode(phoneNumber) {
    // 禁用发送按钮防止重复点击
    var sendButton = $('sendVer');
    sendButton.disabled = true;
    sendButton.classList.add('disabled')
  
    // 发送验证码请求
    // var xhr = new XMLHttpRequest();
    // xhr.open('POST', '/send-code', true);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.onreadystatechange = function() {
    //   if (xhr.readyState === XMLHttpRequest.DONE) {
    //     if (xhr.status === 200) {
    //       // 验证码发送成功
    //       var response = JSON.parse(xhr.responseText);
    //       // 处理验证码发送成功后的操作
    //     } else {
    //       // 验证码发送失败
    //       var response = JSON.parse(xhr.responseText);
    //       // 处理验证码发送失败后的操作
    //     }
    //   }
    // };
  
    // var data = JSON.stringify({ phoneNumber: phoneNumber });
    // xhr.send(data);

    // 后端操作或调用api向手机号发送验证码
    startCountdown(60); // 启动倒计时，60 秒
  }
  
  function startCountdown(duration) {
    var countdownTimer = setInterval(function() {
      var sendButton = $('sendVer');
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

  function forgetPassword(){
    let front = $("cover");
    front.classList.add('turn');

    let back = $("back2");
    back.classList.add('turn2');
  }

  function turnToLoginFromForget(){
    let front = $("cover");
    front.classList.remove('turn');

    let back = $("back2");
    back.classList.remove('turn2');
  }

  function updatePassword(){
    alert("密码修改成功！");
  }