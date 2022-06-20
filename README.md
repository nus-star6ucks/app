# VMCS

## Setup

1. node.js (v12 ~ v16 应该都行)
  macOS 可以考虑使用 [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) 或者 [官网](https://nodejs.org/en/) 下载安装包（LTS 版本），Windows 直接去官网下载就好了。
2. `git clone` 项目到本地，执行 `npm install`（遇到网络问题可以输入 `npm config set registry https://registry.npm.taobao.org` 更换为淘宝源）
3. 通过 IntelliJ IDEA 或者 VSCode 运行 `api/src/main/../.../vmcs` 目录下的 `VmcsApplication.java`，Spring Boot 会占用本地 `8081` 端口
4. 在项目根目录下输入 `npm run dev`，electron 会占用本地 `3344` 端口

## Config

示例导入文件（先解压）：[input.json.zip](https://github.com/nus-star6ucks/app/files/8928922/input.json.zip)
