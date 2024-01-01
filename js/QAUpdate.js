const serverHost = "http://3zureus.vm.szu.moe:8080";
var countImg = 0;
var MAX_FILE_SIZE = 3;
var ImgBoxs = document.getElementsByClassName("imgContainer");
var UploadInput = document.getElementsByClassName("uploadInput")[0];
var UploadBox = document.getElementsByClassName("uploadBox")[0];
// 从这个页面请求中的POST数据获取问题的id，然后根据id获取问题的内容，然后填充到页面中


const updateQueryString = window.location.search;

// 解析查询字符串为对象形式
const updateParams = new URLSearchParams(updateQueryString);

// 获取特定参数的值
const QAID = updateParams.get('QAID') == null ? 0 : parseInt(updateParams.get('QAID'));
const isQuestionUpdate = QAID !== 0;


let content;

const xhr = new XMLHttpRequest();
xhr.responseType = 'json';
xhr.open("GET", serverHost + `/webapi/QA/get-detail?QAID=${QAID}`, true);
xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {

            // 如果状态码为 200 表示请求成功
            let jsonResponse = xhr.response;
            console.log(jsonResponse);
            let questionTitle = jsonResponse.Data.Title;
            content = '' + jsonResponse.Data.Content;

            // 设置页面标题，id=questionEditorTitle
            document.getElementById('questionEditorTitle').value = questionTitle;
            // 设置底部图片
            let images = jsonResponse.Data.ImgUrls;
            for (let index = 0; index < images.length; index++) {
                const image = images[index];
                var newImg = document.createElement('img');
                newImg.src = serverHost + image;
                newImg.className = 'imgAdd';
                newImg.id = countImg.toString();
                newImg.addEventListener('dragstart', function (e) {
                    e.dataTransfer.setData("text/plain", this.id);
                });
                newImg.addEventListener('dragover', function (e) {
                    e.preventDefault();
                });
                newImg.addEventListener('drop', function (e) {
                    e.preventDefault();
                    // var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    var toIndex = parseInt(this.id);
                    console.log(index);
                    // 交换图片位置
                    swapImages(fromIndex, toIndex);
                });
                countImg++;
                var ImgBox = ImgBoxs[0];
                var lastImage = ImgBox.lastElementChild;
                ImgBox.insertBefore(newImg, lastImage);
            }
        } else if (xhr.status === 400) {
            content = '# 在这里描述自己的问题';
        } else {
            // 如果状态码不为 200，请求可能失败或者出现错误
            console.error('Request failed with status:', xhr.status);
            console.log(xhr.responseText);
            content = '# 在这里描述自己的问题';
        }
        // console.log("onreadystatechange 1st if triggered!");
    }
    // Description: 设置问题框的js
    console.log("content: ", content);
    var config = {
        width: "100%",
        height: "100vh",
        // 编辑器中的初始内容
        markdown: content,
        path: "../node_modules/editor.md/lib/",
        saveHTMLToTextarea: true
    };
    var testEditor = editormd("editor", config);
}
xhr.send();




// Description: 上传图片的js


// 使Box也拥有点击上传文件功能
UploadBox.addEventListener('click', function (e) {
    UploadInput.click();
});

// 拖拽物品导致颜色变化和离开的js
UploadBox.addEventListener('dragenter', function (e) {
    UploadBox.classList.add('drag');
});
UploadBox.addEventListener('dragover', function (e) {
    e.preventDefault();
});
UploadBox.addEventListener('dragleave', function (e) {
    UploadBox.classList.remove('drag');
});
UploadBox.addEventListener('drop', function (e) {
    e.preventDefault();
    UploadBox.classList.remove('drag');
    uploadPicture(e.dataTransfer.files);
});

UploadInput.addEventListener('change', function (e) {
    uploadPicture(e.target.files);
});


function uploadPicture(files) {
    for (let index = 0; index < files.length; index++) {
        const file = files[index];
        //过滤非图片
        if (!/\.(png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)$/.test(file.name)) {
            alert("仅支持PNG、jpg、jpeg、gif图片格式");
            break;
        }
        if (file.size > MAX_FILE_SIZE * 1024 * 1024) {
            console.log(file.size, MAX_FILE_SIZE);
            alert("图片文件过大！请上传小于" + MAX_FILE_SIZE + "MB的文件。");
            break;
        }

        var newImg = document.createElement('img');
        newImg.src = window.URL.createObjectURL(file);
        newImg.className = 'imgAdd';
        newImg.id = countImg.toString();
        newImg.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData("text/plain", this.id);
        });
        newImg.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        newImg.addEventListener('drop', function (e) {
            e.preventDefault();
            // var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            var fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
            var toIndex = parseInt(this.id);
            console.log(index);
            // 交换图片位置
            swapImages(fromIndex, toIndex);
        });
        countImg++;
        var ImgBox = ImgBoxs[0];
        var lastImage = ImgBox.lastElementChild;
        ImgBox.insertBefore(newImg, lastImage);
    }
}

function swapImages(fromIndex, toIndex) {
    var images = document.getElementsByClassName('imgAdd');
    console.log(images);
    console.log(fromIndex, toIndex);
    var tmp = images[fromIndex].src;
    images[fromIndex].src = images[toIndex].src;
    images[toIndex].src = tmp;
}

function sendQuestionContent(){
    var title = document.getElementById('questionEditorTitle').value;
    var content = testEditor.getMarkdown();
    var images = document.getElementsByClassName('imgAdd');

    var imgUrls = [];
    for (let index = 0; index < images.length; index++) {
        const image = images[index];
        imgUrls.push(image.src);
    }

    var data = {
        "QAID": QAID,
        "Title": title,
        "Content": content,
        "ImgUrls": imgUrls
    };
    console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("POST", serverHost + "/webapi/QA/update", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {

                // 如果状态码为 200 表示请求成功
                let jsonResponse = xhr.response;
                console.log(jsonResponse);
                alert("问题更新成功！");
                window.location.href = "../html/QADetail.html?QAID=" + QAID;
            } else if (xhr.status === 400) {
                alert("问题更新失败！");
            } else {
                // 如果状态码不为 200，请求可能失败或者出现错误
                console.error('Request failed with status:', xhr.status);
                console.log(xhr.responseText);
                alert("问题更新失败！");
            }
            // console.log("onreadystatechange 1st if triggered!");
        }
    }
    xhr.send(JSON.stringify(data));
}
