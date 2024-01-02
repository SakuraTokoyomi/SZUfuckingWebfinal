

function pageInit(){
    const serverHost = "http://3zureus.vm.szu.moe:8080";
    const urlParams = new URLSearchParams(window.location.search);
    const QAID = urlParams.get('QAID');

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function () {
        var testEditormdView;
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // 如果状态码为 200 表示请求成功

                let jsonResponse = xhr.response;
                // 设置问题标题
                document.getElementById("questionTitle").innerHTML = jsonResponse.Data.Title;
                // 设置问题内容

                var markdown = jsonResponse.Data.Content;
                testEditormdView = editormd.markdownToHTML("questionContent", {
                    markdown: markdown,//+ "\r\n" + $("#append-test").text(),
                    htmlDecode: "style,script,iframe",  // you can filter tags decode
                    tocm: true,    // Using [TOCM]
                    emoji: true,
                    taskList: true,
                    tex: true,  // 默认不解析
                    flowChart: true,  // 默认不解析
                    sequenceDiagram: true,  // 默认不解析
                });
                // 设置问题图片
                let questionImages = jsonResponse.Data.ImgUrls;
                let questionImagesHTML = "";
                for (let i = 0; i < questionImages.length; i++) {
                    questionImagesHTML += `<img src="${serverHost}${questionImages[i]}" class="imgAdd" alt="questionImage">`;
                }
                document.getElementById("questionImages").innerHTML = questionImagesHTML;
                // 设置问题时间,从Unix时间戳转换为正常时间
                let questionTime = new Date(jsonResponse.Data.CreatedAt * 1000);
                document.getElementById("questionTime").innerHTML = "发布时间<br>" + questionTime.toLocaleString();

                let buttonDiv = document.getElementById("moreButtonBox");
                let userID = parseInt(getCookie("userid"));
                console.log(typeof userID);
                console.log(typeof jsonResponse.Data.AuthorId);
                if (userID === jsonResponse.Data.AuthorId) {
                    let deleteButton = document.createElement("button");
                    deleteButton.innerHTML = "删除";
                    deleteButton.onclick = function () {
                        let deleteXHR = new XMLHttpRequest();
                        deleteXHR.responseType = 'json';
                        deleteXHR.onreadystatechange = function () {
                            if (deleteXHR.readyState === 4) {
                                if (deleteXHR.status === 200) {
                                    // 如果状态码为 200 表示请求成功
                                    alert("删除成功！");
                                    window.location.href = "QA.html";
                                } else if (deleteXHR.status === 400) {
                                    alert(deleteXHR.response);
                                } else {
                                    // 如果状态码不为 200，请求可能失败或者出现错误
                                    console.error('Request failed with status:', deleteXHR.status);
                                    console.log(deleteXHR.response);
                                }
                            }
                        }
                        deleteXHR.open('GET', serverHost + `/webapi/QA/delete-question?QAID=${QAID}&AuthorID=${userID}`, true);
                        deleteXHR.setRequestHeader("Token", getCookie("Token"));
                        deleteXHR.send();
                    }
                    buttonDiv.append(deleteButton);
                    let updateButton = document.createElement("button");
                    updateButton.innerHTML = "修改";
                    updateButton.onclick = function () {
                        window.location.href = `questionEditor.html?QAID=${QAID}`;
                    }
                    buttonDiv.append(updateButton);
                    moreButtonHeight = "125px";
                }
                let answerButton = document.createElement("button");
                answerButton.innerHTML = "回答";
                answerButton.onclick = function () {
                    window.location.href = `answerEditor.html?QAID=${QAID}`;
                }
                buttonDiv.append(answerButton);

                // 设置回答内容, 在id为answer-box的div中后插入添加回答内容，如果没有回答则添加等待添加回答的提示
                let answerHTML = "";
                let answers = jsonResponse.Data.Answers;
                let answersBox = document.getElementById("answer-box");
                if (answers.length === 0) {
                    let noAnswer = document.createElement("div");
                    let noAnswerWords = document.createElement("p");
                    noAnswerWords.className = "noAnswerWords";
                    noAnswerWords.innerHTML = "暂无回答，快来添加回答吧！";
                    noAnswer.append(noAnswerWords);
                    answersBox.append(noAnswer);
                } else {
                    for (let i = 0; i < answers.length; i++) {
                        let answer = document.createElement("div");
                        let answerContent = document.createElement("div");
                        let answerImages = document.createElement("div");
                        let answerTime = document.createElement("div");
                        let answerContentWords = document.createElement("p");
                        answerContentWords.innerHTML = answers[i].Content;
                        answerContent.append(answerContentWords);
                        answer.append(answerContent);
                        let imgUrls = answers[i].ImgUrls;
                        for (let j = 0; j < imgUrls.length; j++) {
                            let answerImage = document.createElement("img");
                            answerImage.src = serverHost + imgUrls[j];
                            answerImages.append(answerImage);
                        }
                        answer.append(answerImages);
                        let answerTimeDate = new Date(answers[i].CreatedAt * 1000);
                        answerTime.innerHTML = answerTimeDate.toLocaleString();
                        answer.append(answerTime);
                        answersBox.append(answer);
                    }
                    answersBox.insertAdjacentHTML("afterend", answerHTML);
                }

            } else if (xhr.status === 400) {
                alert(xhr.responseText);
            } else {
                // 如果状态码不为 200，请求可能失败或者出现错误
                console.error('Request failed with status:', xhr.status);
                console.log(xhr.responseText);
            }
            // console.log("onreadystatechange 1st if triggered!");
        }
    }
    xhr.open('GET', serverHost + `/webapi/QA/get-detail?QAID=${QAID}`, true);
    // xhr.open('GET', `addRentalServer.php`, true);
    xhr.send();


    document.getElementById('search').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // 阻止表单默认提交行为
            var searchTerm = encodeURIComponent(this.value); // 获取并编码输入框的值
            window.location.href = 'search.html?Keyword=' + searchTerm; // 跳转到 search.html 并附加搜索词
        }
    });


    updateTime();
// Refresh time every second
    setInterval(updateTime, 1000);
}

function updateTime() {
    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    const currentDateTime = now.toLocaleString(undefined, options);
    document.getElementById('current-time').textContent = `Current Time : ${currentDateTime}`;
}


var moreButtonHeight = "40px";
pageInit();

var isrightDivClick = false;
function rightDivOnClick(){
    console.log("rightDivOnClick triggered!")
    var findNine = document.getElementsByClassName("findNine")[0];
    if(isrightDivClick){
        isrightDivClick = false;
        findNine.style.height="0px";
    }else{
        isrightDivClick = true;
        // findNine.style.display = "block";
        // findNine.style.animation = "findNine 1s ease-in-out";
        findNine.style.height=moreButtonHeight;
    }
}
function back(){
    window.history.back();
}
