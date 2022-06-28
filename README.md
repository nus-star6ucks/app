# VMCS

## Setup

1. node.js (v12 ~ v16 应该都行)
  macOS 可以考虑使用 [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) 或者 [官网](https://nodejs.org/en/) 下载安装包（LTS 版本），Windows 直接去官网下载就好了。
2. `git clone` 项目到本地，执行 `npm install`（遇到网络问题可以输入 `npm config set registry https://registry.npm.taobao.org` 更换为淘宝源）
3. 通过 IntelliJ IDEA 或者 VSCode 运行 `api/src/main/../.../vmcs` 目录下的 `VmcsApplication.java`，Spring Boot 会占用本地 `8081` 端口
4. 在项目根目录下输入 `npm run dev`，electron 会占用本地 `3344` 端口

## Config

示例导入文件（保存以下内容为任意 `.json` 文件）：

```json
{
    "users": [
        {
            "id": 1,
            "role": "Maintainer",
            "password": "123891",
            "status": "logout"
        }
    ],
    "machines": [
        {
            "id": 1,
            "name": "Star6ucks",
            "doorLocked": true
        }
    ],
    "coins": [
        {
            "id": 3,
            "name": "5c",
            "value": 5,
            "quantity": 22,
            "weight": 1
        },
        {
            "id": 4,
            "name": "10c",
            "value": 10,
            "quantity": 37,
            "weight": 1
        },
        {
            "id": 5,
            "name": "20c",
            "value": 20,
            "quantity": 9,
            "weight": 1
        },
        {
            "id": 6,
            "name": "50c",
            "value": 50,
            "quantity": 12,
            "weight": 1
        },
        {
            "id": 7,
            "name": "$1",
            "value": 100,
            "quantity": 10,
            "weight": 1
        }
    ],
    "drinks": [
        {
            "id": 1,
            "name": "Coca-Cola",
            "quantity": 4,
            "price": 75,
            "slotNum": 1
        },
        {
            "id": 2,
            "name": "Fanta",
            "quantity": 7,
            "price": 85,
            "slotNum": 2
        },
        {
            "id": 3,
            "name": "Sarsi",
            "quantity": 12,
            "price": 70,
            "slotNum": 3
        },
        {
            "id": 4,
            "name": "Soya Bean",
            "quantity": 0,
            "price": 60,
            "slotNum": 4
        },
        {
            "id": 5,
            "name": "Coca-Cola",
            "quantity": 1,
            "price": 75,
            "slotNum": 5
        }
    ]
}
```

## Note

1. 前端的核心代码在 `packages/renderer/src` 下（其余部分不需要关注），`openapi` 为 Apifox 生成代码，也不必关注。
2. 后端核心代码在 `api/` 下

