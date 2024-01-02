const serverHost = "http://3zureus.vm.szu.moe:8080";
// const serverHost = "http://localhost:8080";
var countImg = 0;
var MAX_FILE_SIZE = 3;
var ImgBoxs = document.getElementsByClassName("imgContainer");
var UploadInput = document.getElementsByClassName("uploadInput")[0];
var UploadBox = document.getElementsByClassName("uploadBox")[0];
// 从这个页面请求中的POST数据获取问题的id，然后根据id获取问题的内容，然后填充到页面中
var userID = getCookie('userid');



//todo: 从cookie中获取token
// var Token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoMCIsInVzZXJuYW1lIjoidXNlcjEiLCJ1c2VySUQiOjEsImV4cCI6MTcwNDIxMDA3OX0.M7hEbHTKd3LwymR13X6BAge1OEbgooZfFagrbWkyvQ0";
var Token = getCookie('Token');

const updateQueryString = window.location.search;

// 解析查询字符串为对象形式
const updateParams = new URLSearchParams(updateQueryString);

// 获取特定参数的值
const QAID = updateParams.get('QAID') == null ? 0 : parseInt(updateParams.get('QAID'));
const isQuestionUpdate = QAID !== 0;
var testEditor;

let content;
var config;


function reload(){
    // 检查localStorage questionTmp是否存在
    if (localStorage.getItem('questionTmp') !== null) {
        // 如果存在，将其填充到页面中
    }
}







if(isQuestionUpdate) {
    var xhr = new XMLHttpRequest();
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
                console.log(xhr.responseText);
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
        // 检查localStorage questionTmp是否存在
        if (localStorage.getItem('questionTmp') !== null) {
            // 如果存在，比较两个问题的id是否相同
            var questionTmp = JSON.parse(localStorage.getItem('questionTmp'));
            if (questionTmp.questionId === QAID) {
                // 如果id相同，将其填充到页面中
                document.getElementById('questionEditorTitle').value = questionTmp.title;
                content = questionTmp.content;
                // 设置底部图片
                clearImg();
            }
        }

        console.log("content: ", content);
        config = {
            width: "100%",
            height: "80vh",
            // 编辑器中的初始内容
            markdown: content,
            path: "../node_modules/editor.md/lib/",
            saveHTMLToTextarea: true
        };
        testEditor = editormd("editor", config);
    }
    xhr.send();
}else{
    content = '# 在这里描述自己的问题';
    if (localStorage.getItem('questionTmp') !== null) {
        // 如果存在，比较两个问题的id是否相同
        var questionTmp = JSON.parse(localStorage.getItem('questionTmp'));
        if (questionTmp.questionId === QAID) {
            // 如果id相同，将其填充到页面中
            document.getElementById('questionEditorTitle').value = questionTmp.title;
            content = questionTmp.content;
            clearImg();
        }

    }
    config = {
        width: "100%",
        height: "80vh",
        // 编辑器中的初始内容
        markdown: content,
        path: "../node_modules/editor.md/lib/",
        saveHTMLToTextarea: true
    };
    testEditor = editormd("editor", config);
}



// testEditor = editormd("editor", config);

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


function calculateBase64FromSrc(src) {
    return  new Promise((resolve, reject) => {
        var img = new Image();

        img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var dataURL = canvas.toDataURL('image/png');
            resolve(dataURL);
        };

        img.onerror = function () {
            reject(new Error('Failed to load the image'));
        };
        img.src = src;
    });
}


function postAvater(img, imgExtention) {
    console.log("开始上传图片");
    var imageBedurl = 'http://3zureus.vm.szu.moe:8080/image/user/upload'
    var dataToSend = {
        'base64Image': img,
        'imageName': imgExtention
    }
    // console.log(username + '_avaterImage.' + imgExtention);
    postData(imageBedurl, dataToSend, function (err, response) {
        if (err) {
            console.error('Error:', xhr.status, xhr.statusText);
        } else {
            console.log('成功响应：', response);
            // 处理响应数据
        }
    });
}

// 获取图片的 Base64 值

// 对每张图片进行MD5计算并拼接URL

async function sendQuestionContent() {

    var title = document.getElementById('questionEditorTitle').value;
    var content = testEditor.getMarkdown();
    var images = document.getElementsByClassName('imgAdd');

    // new array to store imgUrls, size = images.length
    let imgUrls = [];
    let uploadPromises = [];
    for (const image of images) {
        if (image.src === "") {
            continue;
        }
        if (image.src.includes('http://3zureus.vm.szu.moe:8080/')) {
            imgUrls.push(image.src.split('http://3zureus.vm.szu.moe:8080')[1]);
            continue;
        }
        try {
            var base64Value = await calculateBase64FromSrc(image.src);
            base64Value = base64Value.split('base64,')[1];
            // console.log(base64Value)
            var md5 = CryptoJS.MD5(base64Value).toString();
            var imgName = md5 + '.png';
            image.src = serverHost + '/image/user/' + imgName;
            imgUrls.push('/image/user/' + imgName);
            uploadPromises.push(postAvater(base64Value, imgName));
        } catch (error) {
            console.error(error);
        }
    }
    try {
        await Promise.all(uploadPromises);
    } catch (error) {
        console.error("Error uploading images:", error);
    }

    console.log(imgUrls); // 在这里检查是否正确获取了 imgUrls

    var data
    // console.log(data);
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    // xhr.open("POST", serverHost + "/webapi/QA/update-question", true);
    if (isQuestionUpdate){
        data = {
            "questionId": QAID,
            "title": title,
            "content": content,
            "imgUrls": imgUrls,
            "authorId": userID
        };
        xhr.open("POST", serverHost+"/webapi/QA/update-question", true);
    }else{
        data = {
            "title": title,
            "content": content,
            "imgUrls": imgUrls,
            "authorId": userID
        };
        xhr.open("POST", serverHost+"/webapi/QA/add-question", true);
    }

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Token", Token);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                localStorage.removeItem('questionTmp');
                // 如果状态码为 200 表示请求成功
                let jsonResponse = xhr.response;
                console.log(jsonResponse);
                alert("Success！");
                window.location.href = "../html/QA.html";
            } else if (xhr.status === 400) {
                console.log(xhr.response);
                alert("Fail！");
            } else {
                // 如果状态码不为 200，请求可能失败或者出现错误
                console.error('Request failed with status:', xhr.status);
                console.log(xhr.response);
                alert("Fail！");
            }
            // console.log("onreadystatechange 1st if triggered!");
        }
    }
    console.log(data);
    // data.imgUrls = JSON.stringify(data.imgUrls);
    console.log(data);
    console.log(data.imgUrls);
    console.log(JSON.stringify(data))
    xhr.send(JSON.stringify(data));
}


function postData(url, data, callback) {
    xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // 如果状态码为 200 表示请求成功
                let jsonResponse = xhr.response;
                console.log(jsonResponse);
            } else if (xhr.status === 400) {
                alert(xhr.response);
            } else {
                // 如果状态码不为 200，请求可能失败或者出现错误
                console.error('Request failed with status:', xhr.status);
                console.log(xhr.response);
            }
            // console.log("onreadystatechange 1st if triggered!");
        }
    }
    xhr.send(JSON.stringify(data));
}

function back(){
    // 将            "questionId": QAID,
    //             "title": title,
    //             "content": content,
    //             "imgUrls": imgUrls,
    //             "authorId": userID
    // 保存到浏览器的Local Storage中
    var title = document.getElementById('questionEditorTitle').value;
    var content = testEditor.getMarkdown();
    var images = document.getElementsByClassName('imgAdd');
    var imgUrls = [];
    for (const img of images) {
        imgUrls.push(img.src);
    }
    var data = {
        "questionId": QAID,
        "title": title,
        "content": content,
        "imgUrls": imgUrls,
        "authorId": userID
    };
    localStorage.setItem('questionTmp', JSON.stringify(data));
    history.back();
}


function clearImg() {
    // 移除<div class = "uploadBox">中的所有的<img class = "imgAdd">
    var images = document.getElementsByClassName('imgAdd');
    console.log(images);
    while (images.length > 0) {
        images[0].parentNode.removeChild(images[0]);
    }
    countImg = 0;
}