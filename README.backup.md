# Records

### npm link: 本地安装

**使用场景**
在本地开发npm模块的时候，我们可以使用npm link命令，将npm 模块链接到对应的运行项目中去，方便地对模块进行调试和测试

我们在本地开发npm模块时，一般需要解决本地模块的调用测试，比如现在开发模块A, 需要在自己的应用B里导入并使用。
那么我们就可以通过npm link的方式，将模块A链接到B对应的node_modules下面。

将要被其他应用使用的模块(比如A)链接到全局包路径下

```sh
cd 模块A所在的根目录下

npm link 
# 将会创建一条软连接，从全局包路径指向当前执行路径，
# 比如 /usr/local/lib/node_modules/xxxx -> {当前根目录路径}/xxxx
```
创建一个从全局包指向当前目录node_modules/下对应包的链接
 ```sh
cd <应用B所在的根目录下>
npm link xxxx
# 将会创建一条链接从全局包指向当前局部包，从而打通整个链路
# 比如 {应用B根目录}/node_modules/xxxx ->  /usr/local/lib/node_modules/xxxx -> {模块A根目录路径}/xxxx
 ```

 `npm link`的方式可以实时测试，也就是保存文件后可以实时看到，不需要再npm link了

**用完了如何去除软链呢？**

```sh
# 先在使用npm包的项目的文件目录下解除特定的链接
npm unlink packageName
```

```sh
# 再在npm包所在的文件目录下去除全局链接
npm unlink 
```

```sh
# 强制解除创建的某个特定全局链接
sudo npm rm --global packageName

# 查看所有创建的全局链接名称
npm ls --global --depth 0
```

**npm 版本介绍**
 > https://zhuanlan.zhihu.com/p/420704082

```sh
查看tag
npm dist-tag ls vue

结果
beta: 3.2.0-beta.8
csp: 1.0.28-csp
latest: 2.6.14
next: 3.2.20

安装
npm install vue@latest latest指向的版本
npm install vue@beta   beta指向的版本

tag如何指向版本(不打tag 默认为latest)
npm publish --tag beta

publish tag 修改
npm dist-tag add pkg@1.0.0 latest
npm dist-tag add pkg@1.0.1-beta.0 beta
```


 ```sh
npm version major 结果0.0.1->1.0.0
npm version minor 结果0.0.1->0.1.0
npm version patch 结果0.0.1->0.0.2
npm version prerelease 结果0.0.1 -> 0.0.2-0
npm version prerelease --preid=beta  结果0.0.1->0.0.2-beta.0
npm version prerelease 0.0.2-beta.0  结果0.0.1->0.0.2-beta.0
 ```

```sh
- 第一个稳定版本号为1.0.0
- beta版本号从0开始，比如：1.0.0-beta.0
- 使用npm version工具进行版本升级(npm 自带)
- prerelease只保留beta（仅使用beta,清爽）
- 只有 latest 和 beta 两个标签 
- latest tag永远指向最新的稳定版本
- beta tag永远指向最新的beta公测版本
- beta 发版， 必须加 --tag beta
- git 仓库和 tag 保持一致
```

```sh
小版本迭代开发 beta

1.2.0-beta.0

npm version prerelease --preid=beta
package.json version 1.2.0-beta.0

npm publish --tag=beta

1.2.0-beta.1

npm version prerelease --preid=beta
package.json version 1.2.0-beta.1

npm publish --tag=beta

```

```sh
npm version prerelease --preid=beta

packjsion version 1.0.0-beta.1

npm publish --tag=beta


#npm 打了tag 好像会同步到git上

git tags [-l]

git push origin --tags 提交多个tag
```

公司内部

"name": "@固定namespace/xxxx",

```sh
# package.json
# 增加maintainers

"maintainers": [
    {
      "name": "xxxx",
      "email": "xxxxx.com"
    }
  ]
```
 
```sh
npm whoami

npm login

npm version patch |  | major

npm publish


```
**peerDependencies**
Example1:
```sh
假如myProject依赖pluginA，而pluginA中设置了peerDependencies，这时，在peerDependencies中的依赖就不会出现在pluginA目录下的node_modules中，而是，在myProject安装pluginA时，会提醒使用者，也需要安装pluginA中peerDependencies中的依赖，为什么可以这样，原因是：pluginA的目录下如果没找到node_modules，则会往父级找node_modules


所以说，开发pluginA时，`npm i` 也不会把peerDependencies中的依赖不会安装进去
```


Vue 开发插件、组件可以通过`vue init webpack [app-name]` or `vue init webpack-simple [app-name]`，前提要全局安装@vue/init
> https://www.jianshu.com/p/9177fd988558

React 如何开发组件 插件


npm link 和 peerDependencies 的问题可以参考 https://www.jianshu.com/p/dcbc81e7bf01

### 注意事项

- 各个依赖的版本
- 要提交到仓库后才能发布到npm