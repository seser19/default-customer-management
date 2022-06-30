## 安装依赖

```bash
npm install --registry=https://registry.npm.taobao.org
```
>由于工程中的包不是很好能一次性安装到位，开发人员使用下载代码后先运行 npm install

## 本地运行

```bash
npm run dev / yarn dev
```
```bash
 http://localhost:1024
```

## 打包

```bash
# 打包正式环境
npm run build:prod  / yarn build:prod

# 打包预发布环境
npm run build:stage 
```

## 项目开发可参考的相关文档

### 工程所选用框架提供的资料
>[前端手册](http://doc.ruoyi.vip/ruoyi-vue/document/qdsc.html#%E5%89%8D%E7%AB%AF%E6%89%8B%E5%86%8C)

### `Chrome` 浏览器开发时，推荐使用官方提供的插件 `vue-devtools`