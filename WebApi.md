# 首页部分

## 1. `GET` /webapi/QA/getNews 最新n条问答

### 描述

获取最新n条

### 请求

#### Query参数

| 字段名 | 类型 | 是否必需 | 描述               |
| :----- | :--- | :------- | :----------------- |
| Limit  | 整数 | 是       | 需要的最新的问答数 |

#### 范例

`/webapi/QA/getNews?Limit=5`

### 响应

```json
{
    "Success":true,
    "Data":[
      {
        "QAID":1,
        "Title":"title1",
        "Content":"Content1",  //你看看要不要裁剪
        "CreateAt":1697763500,
        "DetailsPage":"QADeltail?QAID=1"
      },
      {
        "QAID":2,
        "Title":"title2",
        "Content":"Content2",  //你看看要不要裁剪
        "CreateAt":1697763500,
        "DetailsPage":"QADeltail?QAID=2"
      },
    ]
}
```

先这样吧，有就改呗


http://3zureus.vm.szu.moe:8080/swagger-ui/index.html


你们测试的样例

```python
import requests

headers = {
    'accept': '*/*',
    'Token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhdXRoMCIsInVzZXJuYW1lIjoiY2JiIiwidXNlcklEIjoxMSwiZXhwIjoxNzA0MDQ0NzgwfQ.TV6aqIMXf9wUFf-Nf4hMIwPBxtycu1Y1TWvXm_USXso',
    'Content-Type': 'application/json',
}

json_data = {
    'username': 'cbb',
    'oldpassword': '1234567',
    'newpassword': '123456',
}

response = requests.post('http://localhost:8080/user/changePassword', headers=headers, json=json_data)

print(response.content)

```

对了，还有测试账号：
```
user: user1 , password: pass1
user: user2 , password: pass2
user: user3 , password: pass3
user: user4 , password: pass4
user: test1 , password: 123456
```