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
    "Data":{
        "QAID":1,
        "Title":"title",
        "Content":"Content",  //你看看要不要裁剪
        "CreateAt":1697763500,
        "DetailsPage":"QADeltail?QAID=1"
    }
}
```

先这样吧，有就改呗
