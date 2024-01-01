// 创建全局 XMLHttpRequest 对象,在发送请求操作会用到
var xhr = new XMLHttpRequest();

function activeUpload(){
    var uploadinput = $('uploadAvater')
    uploadinput.click();
}

function changeAvater() {
    // 头像文件上传后转化成的base编码
    var avaterimageURL;
    // 图片后缀
    var imgExtention;
    // 获取 input 元素
    var imageInput = $("uploadAvater");

    // 添加 change 事件监听器
    imageInput.addEventListener('change', function() {
        // 获取用户选择的文件
        var selectedFile = imageInput.files[0];
        imgExtention = selectedFile.name.split('.').pop().toLowerCase();
        setCookie('avaterExtention', imgExtention, 7);
        console.log('imgext: ' + imgExtention);

        if (selectedFile) {
            // 使用 FileReader 读取文件，并在加载完成后设置头像的 src 属性
            var reader = new FileReader();
            reader.onload = function(event) {
                // 设置头像元素的 src 属性为文件的临时 URL
                var imagesrc = event.target.result;
                // alert(imagesrc);
                $("userAvater").src = imagesrc;
                $("navAvater").src = imagesrc;
                avaterimageURL = imagesrc.substring(imagesrc.indexOf(',') + 1);
                console.log('pustavaurl: ' + avaterimageURL);
                // 将头像上传到图床
                postAvater(avaterimageURL, imgExtention);
            };
            reader.readAsDataURL(selectedFile);
            alert("头像修改成功！");
        } else {
            // 用户取消选择文件或未选择有效文件的处理
            alert("未选择有效的图片文件，头像未修改。");
        }
    });

    // 模拟点击 input 元素，触发文件选择对话框
    imageInput.click();
}

function postAvater(img, imgExtention){
    var username = getCookie('account');
    var imageBedurl = 'http://3zureus.vm.szu.moe:8080/image/user/upload'

    var dataToSend = {
        'base64Image' : img,
        'imageName' : username + '_avaterImage.' + imgExtention
    }
    // console.log(username + '_avaterImage.' + imgExtention);
    postData(imageBedurl, dataToSend, function(err, response) {
        if (err) {
            console.error('Error:', xhr.status, xhr.statusText);
        } else {
          console.log('成功响应：', response);
          // 处理响应数据
        }
      });
}

function saveName() {
    var name = $("new-userName").value;
    if(name == ""){
        alert("请填写要修改的内容！");
        return;
    }
    $("currentName").innerHTML = "当前称昵：" + name;
    setCookie('username', name, 7);
    $("new-userName").value = "";
    $('userName').innerHTML = name;
    alert("修改成功");
    return true;
}

function saveSex() {
    var sex = $("userSex").value;
    $("currentSex").innerHTML = "性别：" + sex;
    if(sex == ""){
        alert("请填写要修改的内容！");
        return;
    }
    setCookie('usersex', sex, 7);
    $("userSex").value = "";
    alert("修改成功");
    return true;
}

function saveSign() {
    var signtext = $("changedSign").value;
    if(signtext.trim() === ""){
        alert("请填写个性签名！");
        return;
    }
    $("currentSign").innerHTML = signtext;
    setCookie('usersign', signtext, 7);
    $("changedSign").value = "";
    alert("修改成功");
    return true;
}

function postData(url, data, callback) {
    xhr.responseType = 'json';
    xhr.open("POST", url, true);
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
  
document.addEventListener("DOMContentLoaded", loadUserInfo);
function loadUserInfo() {
    var username = getCookie('username');
    var usersex = getCookie('usersex');
    var usersign = getCookie('usersign');

    // 检查每个 Cookie 是否为空，如果为空则赋予初始值
    if (!username) {
        // 如果 username 为空，给对应的元素赋初始值
        username = 'Guest';
    }
    if (!usersex) {
        // 如果 usersex 为空，给对应的元素赋初始值
        usersex = 'Unknown';
    }
    if (!usersign) {
        // 如果 usersign 为空，给对应的元素赋初始值
        usersign = 'No sign yet';
    }

    // 然后使用获取到的值进行后续操作，例如将它们赋值给页面上的元素
    // 例如，使用 jQuery 设置元素的值
    $('userName').innerHTML = username;
    $('currentName').innerHTML = '当前称昵：' + username;
    $('currentSex').innerHTML = '性别：' + usersex;
    $('currentSign').innerHTML = usersign;
}
