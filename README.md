## 懂你
> Match 社交匹配引擎 - 前端项目

## 项目运行&编辑环境 Build Setup
由于项目基于微信开发，必须在微信开发者工具中打开；具体操作：开发环境运行端口80，本地绑定host： match.changyou.com   80
开发者工具权限联系：杜薇


``` bash
# 建议安装npm源管理工具 nrm
npm install nrm -g

# 查看当前 nrm 内置的几个 npm源地址
nrm ls

# 切换到 cnpm
nrm use cnpm

# 安装依赖 install dependencies
cnpm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

## 项目布局
```
|-- build                            // webpack配置文件
|-- config                           // webpack 的配置文件
|-- build                            // 上线项目文件，放在服务器即可正常访问
|-- src                              // 源码目录
|   |-- assets                       // 静态文件
|       |-- img                      // 图片
|       |-- css                      // 各种样式文件
|          |-- common.css            // 公共样式文件
|   |-- components                   // 组件
|       |-- common                   // 公共组件
|
|   |-- mock                         // 模拟数据
|
|   |-- config                       // 基本配置
|       |-- env.js                   // 环境切换配置
|       |-- fetch.js                 // 获取数据
|       |-- mUtils.js                // 常用的js方法
|       |-- rem.js                   // px转换rem
|   |-- pages                        // 页面组件
|       |-- home                     // 业务主体流程
|           |-- index.vue            // base页面
|       |-- login                    // 登录
|       |-- 404.vue                  // 404
|
|   |-- router                       // 路由配置
|
|   |-- service                      // 数据交互统一调配
|       |-- getData.js               // 获取数据的统一调配文件，对接口进行统一管理
|
|   |-- store                        // vuex的状态管理
|       |-- action.js                // 配置actions
|       |-- getters.js               // 配置getters
|       |-- index.js                 // 引用vuex，创建store
|       |-- mutation-types.js        // 定义常量muations名
|       |-- mutations.js             // 配置mutations|
|
|   |-- static                       // 静态文件

|   |-- App.vue                      // 页面入口文件
|
|   |-- main.js                      // 程序入口文件，加载各种公共组件
|
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 代码编写规格
|-- .eslintrc.js                     // eslintrc配置
|-- .gitignore                       // 忽略的文件
|-- favicon.ico                      // 页面左上角小图标
|-- index.html                       // 入口html文件
|-- package.json                     // 项目及工具的依赖配置文件
|-- README.md                        // 说明

```
