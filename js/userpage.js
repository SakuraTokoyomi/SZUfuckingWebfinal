function $(id) {
    return document.getElementById(id);
}

function changeAvatar() {
    var avatarElement = document.getElementById("userAvatar"); // 使用元素的ID获取头像元素
    avatarElement.src = url; // 设置头像元素的src属性为用户上传的图片URL
    alert("头像修改成功！");
}

function saveName() {
    var name = $("new-userName").value;
    $("currentName").innerHTML = "当前称昵：" + name;
    if(name == ""){
        alert("请填写要修改的内容！");
        return;
    }
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
    alert("修改成功");
    return true;
}