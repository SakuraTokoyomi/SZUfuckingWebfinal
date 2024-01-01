function $(id) {
    return document.getElementById(id);
}

function activeUpload(){
    var uploadinput = $('uploadAvater')
    uploadinput.click();
}

function changeAvater() {
    // 获取 input 元素
    var imageInput = $("uploadAvater");

    // 添加 change 事件监听器
    imageInput.addEventListener('change', function() {
        // 获取用户选择的文件
        var selectedFile = imageInput.files[0];

        if (selectedFile) {
            // 使用 FileReader 读取文件，并在加载完成后设置头像的 src 属性
            var reader = new FileReader();
            reader.onload = function(event) {
                // 设置头像元素的 src 属性为文件的临时 URL
                var imagesrc = event.target.result;
                // alert(imagesrc);
                $("userAvater").src = imagesrc;
                $("navAvater").src = imagesrc;
                avaterimageURL = imagesrc;
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