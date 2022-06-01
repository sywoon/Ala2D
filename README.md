# Ala2D(阿拉2d引擎)
基于laya2.5 简化引擎 了解内部实现原理


## 创建工程
1 npm init
npm install gulp --save-dev

2 手动创建gulpfile.js
```
function defaultTask(cbk) {
    cbk();
}
exports.default = defaultTask;
```
gulp运行

3 tsc --init
npm i gulp-cli --save-dev
npm i gulp-typescript --save-dev
npm i typescript --save-dev

npm install -D rollup rollup-plugin-node-resolve rollup-plugin-commonjs rollup-plugin-eslint rollup-plugin-typescript2 @typescript-eslint/parser typescript @babel/core

4 从工程复制index.html index.js

5 配置tsconfig.json
开启sourceMap  各种strict开关
package.json
"target": "es5",       -》 es2015
"module": "commonjs",   -》 es2015
"lib": ["dom", "es2015"],     
"sourceMap": true,       


6 为vsc添加编译配置
f5 选择chrome
修改.vscode/launch.json    端口号改为3000

7 编译ts
gulp
得到dist/*.js


8 运行服务器
npm i lite-server --save-dev
package.json
"scripts": {
    "server": "lite-server",
    
npm run server
or
cmd /c server2.bat

9 vsc添加编译配置
f5 选择chrome
修改.vscode/launch.json    端口号改为3000



## 环境初始化
```
  npm install -g gulp@4.0.2
  npm install -g gulp-cli@2.3.0
  npm install -g lite-server@2.5.4
  
  npm install
  npm run server
  gulp
  f5 开始调试

  or
  ctrl + ~ 开启控制台
  gulp 编译 默认开了watch模式
  cmd /c server2.bat  使用anywhere启动浏览器  默认的lite-server比较慢
```
