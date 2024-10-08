---
title: 使用 Hexo 搭建和部署个人网站
date: '2023/04/23 05:36:00'
excerpt: 使用 Hexo+React 搭建个人静态博客系统的个人经验总结
alias:
  - post/Development/blog-solution/index.html
  - post/development/blog-solution/index.html
---

## 技术选型

在做博客之前先了解了一下国内已有的线上博客平台，因为其在**SEO和曝光**（自带流量，不用手动SEO）方面有一定的先天优势：

- **CSDN**：老牌国内社区，主要问题是**内容质量低，充斥着广告和复制粘贴翻译的低创，公开拿开源资料来收费**，~~还把导入MD的功能砍了~~（根据官方的说法是保留了MD导入的）
- **知乎**：问答社区，编写体验尚可，之前在上面写过几篇NLP的文章，内容质量有点参差不齐，编写体验不错，支持MD导入
- **掘金/思否**：查资料的时候经常看别人的文章，感觉这两家的内容质量还不错，观看体验尚可，但没在上面写过
- **博客园**：默认样式很丑，需要（个人直觉）在线配置有点麻烦，但自由度高，有SEO优化，部署相对方便（特别是对国内这种需要公安备案的环境）
- ~~新浪：已经死啦~~

上述平台中**知乎、掘金、思否我会尝试同步更新**，博客园随缘更新。

目前国外我了解的开放博客解决方案（或者说本地博客部署框架）有：

- **WordPress**：老牌博客框架，提供自己的在线平台；功能大而全，开发语言为PHP，个人不太熟悉，但实际写作过程中几乎不用接触代码
- **Hexo**：Node.JS框架，自定义程度高，整体较为轻量，**适合前端开发者**
- **Notion**：基于数据库的知识管理平台，支持页面公开发布，个人一直在用，最近也支持了Wiki模式，但鉴于无本地和URL为uuid等特性，这里没有把他当作博客的第一选择，而仅仅是用作个人知识管理，后续考虑编写hexo插件和调用Notion API打通hexo+Notion的工作流
- ~~Hugo：未作了解~~

最终，主要是因为个人对整个Hexo生态比较熟悉，选择了**Hexo**平台（并不是说其他平台不好）

对个人而言，**Hexo有以下优点**：

- 架构简单，整个CLI都是基于Node的，对JS开发者友好
- 使用JSON数据库存储元数据，方便扩展（缺点是体量大了可能会有性能缺陷，后续要考虑长期维护的话是一个问题）
- 插件较多，自定义性方便（后面会给到我的插件方案）
- 部署方便，可以直接使用Git进行CI/CD自动化部署（如Github Action）
- 主流平台（这里我使用**腾讯云**）都支持直接**通过serverless部署hexo**（不知道什么是serverless的可以参考我的[这篇博客](https://yitu.us.kg/posts/317388827/)）

## 博客架构

Hexo采用`hexo-6.3.0`和`node-v16.17.1`+`npm-v9`在本地构建，主题使用[Redefine](https://github.com/EvanNotFound/hexo-theme-redefine)（可能后续会进行改动和二次开发）。

在整个博客中，Hexo作为**静态网站框架**，起到**Hold整个Markdown博客数据库并渲染成HTML**、**渲染其他静态网页**两个作用。

> **如何创建Hexo博客这里就不再赘述了，网上有很多教程，这里也不做教程推荐。**

### Hexo配置与插件

参考我之前的项目 [KiritoKing/hexo-msdoc-renderer](https://github.com/KiritoKing/hexo-msdoc-renderer)，为博客增加以下基础功能：

- 根据目录自动添加分类，由插件[xu-song/hexo-auto-category](https://github.com/xu-song/hexo-auto-category)实现
- 为每个页面生成独立URL来替代原有Path，由插件[rozbo/hexo-abbrlink](https://github.com/rozbo/hexo-abbrlink)实现
- 修改默认渲染器为[hexojs/hexo-renderer-markdown-it](https://github.com/hexojs/hexo-renderer-markdown-it)提供更多MD拓展语法支持
- [图片上传到COS图床](#图床配置)中，由本地编辑器（Typora）实现（后续计划，将COS图床与Webify部署合并）
- ~~根据文档编辑时间自动编辑date的front-matter（开发中）~~

### 部署方案

- 项目源码使用Git，存储库位于Github，方便使用CI/CD自动化生成页面
- 页面部署可以**使用Github Action自动触发部署**（到Github Page），但这里我使用的是**腾讯云的Webify Serverless服务**，其自带CI部署可以在Push时自动生成页面并部署
- 评论系统实现采用[gitalk](https://github.com/gitalk/gitalk)实现，具体嵌入则由主题提供

### 其他页面

由于除了博客，个人网站还需要显示其他页面，目前个人有以下解决方案：

- 直接在`./source`中创建对应目录映射为URL，将单页面静态网站放在目录中，使用`_config.yml`中的`skip_render`选项跳过渲染（生成时直接拷贝到`public`中）
- Fork主题，添加指定页面的Scaffold代码，利用`./_data`动态渲染页面，模板EJS设计完成后PR
- 利用Serverless按量计费特性，直接创建新页面绑定到另一个域名，跨域跳转

方案A适用于不会经常改变的静态页面，如**个人简历**；方案B适用于动态页面，如项目列表，可能需要用Github抓取信息更新`yml`文件来刷新页面；方案C适用于不同架构创建的页面（如React页面），且该页面可能有频繁改动的情况。

### Hexo主题备选

因为做过不少Hexo外包项目，这里收集了一些我个人觉得不错的主题：

- [zhwangart/hexo-theme-acorn:](https://github.com/zhwangart/hexo-theme-acorn)：适用于中小型企业门户
- [volantis-x/hexo-theme-volantis](https://github.com/volantis-x/hexo-theme-volantis)：适合开放式博客平台（多人共建）
- [EvanNotFound/hexo-theme-redefine](https://github.com/EvanNotFound/hexo-theme-redefine)：适合个人展示型博客
- [nexmoe/hexo-theme-yet-the-books](https://github.com/nexmoe/hexo-theme-yet-the-books)：适合偏文学创作

### 后续开发计划

目前打算开发一个基于React+Next/Electron的**Hexo的GUI管理方案**（`hexo-utils`），不过**不是编辑器类型而是偏管理向**，按Package进行功能划分如下：

- `hexo-utils/git-utils`：实现可配置的自动化Git工作流

  - 自动添加暂存区
  - 根据暂存区改动自动添加Commit Message（配合自定义commitlint使用）
  - （可选）根据Git Log自动修改文章Front-Matter修改日期
  - （可选）推送到远程仓库
  - （可选）自动化CI部署

- `hexo-utils/core`：维护应用所需数据和逻辑，钩入hexo-hooks
  - 更完备的Draft管理：Draft中目录自动对应Post中目录
  - 根据Git Log自动生成和更新热力图
  - Tags管理: 维护一个本地的Tags库，为文章自动上标签、去标签、格式化标签（大小写）
- `hexo-utils/cli`：为`core`添加CLI入口
- `hexo-utils/webui`：为`core`添加Web-UI入口，作为**hexo插件**引用，用react+next实现
- `hexo-utils/client`：使用electron封装`core`功能，支持管理多个hexo目录
- `hexo-utils/notion-utils`：与Notion**双向同步**构建知识管理和分享体系
  - 将Draft和Post拍平后同步到Notion，使用一个Property进行区分
  - Notion中更新后的文章会自动导出并同步到指定的Repo中
  - 同理Repo中更新的内容也会同步到Notion数据库中

## Typora 图床配置

我一直都习惯用 Typora 进行写作，习惯了所以也入了正版~~（其实是当时不知道beta可以一直用~~。

### 图床配置

之前一直用的picgo的GUI客户端，因为最开始接触MD写作的时候并不会写前端和Node那一块，所以就用了gui，但越到后面越发现这个electron的客户端就是个性能累赘：不仅冷启动速度慢还经常卡死，而且是一个根本不必要的功能（指上传完全可以用cli实现），所以就借此机会切换到picgo-core。

> 切换到CLI后可以做到**0秒冷启动**的效果，非常顺滑，而且**没有一个额外的electron进程占后台**。本文所有图片均使用picgo-core上传。

首先你先要有一个包管理器（npm, yarn, pnpm）都可以：

```shell
# 这里以npm为例
npm i picgo -g
```

然后是配置图床，个人使用的是**腾讯云COS**作为图床：

1. 在[访问密钥](https://console.cloud.tencent.com/cam/capi)中获取你的AppId, SecretId, SecretId；在[存储桶列表](https://console.cloud.tencent.com/cos/bucket)获取Bucket和AP位置。
2. 建议在终端中运行 `picgo set uploader`运行CLI向导，运行完毕后你的配置文件应如下图所示：

![image-20230522214210799](https://picgo-1308055782.cos.ap-chengdu.myqcloud.com/picgo-core/image-20230522214210799.png)

![image-20230522214653844](https://picgo-1308055782.cos.ap-chengdu.myqcloud.com/picgo-core/image-20230522214653844.png)

3. 在Typora中 设置 -> 图像 设置好上传服务（如果你前面配置好了就可以直接验证，也可以打开配置文件检查一下）

![image-20230522214546431](https://picgo-1308055782.cos.ap-chengdu.myqcloud.com/picgo-core/2023/05/20230522221603.png)

上传成功会得到如下提示：

![image-20230522214745134](https://picgo-1308055782.cos.ap-chengdu.myqcloud.com/picgo-core/20230522221527.png)

4. **配置时间戳上传**，这里需要借用 [picgo-plugin-super-prefix](https://github.com/gclove/picgo-plugin-super-prefix) 这个插件。

首先全局安装这个包：

```shell
picgo install super-prefix
```

然后在配置文件里添加和修改下面的代码，就可以让图片存储在对应存储桶的`YYYY/MM/YYYYMMDDHHmmss.*`路径里（如`*/picgo-core/2023/05/20230522221603.png`）：

```json
{
	"picgoPlugins": {
		"picgo-plugin-super-prefix": true
	},
	"picgo-plugin-super-prefix": {
		"prefixFormat": "YYYY/MM/",
		"fileFormat": "YYYYMMDDHHmmss"
	}
}
```

## Serverless 部署

### 腾讯云Webify服务

> 利益相关：无，希望腾讯看到了早日给我打钱~~或者把我招进去~~
>
> （一些废话）这部分其实是2023年6月份才更新的，原因是想对博客做SEO优化，发现原来的部署总是失败，点开日志发现是环境缺失了一些包（详见[hexo-all-minifier](https://www.npmjs.com/package/hexo-all-minifier?activeTab=explore)）。前些日子正好学习了一些CI和Docker相关的知识，也了解了微服务和无服务（serverless）部署的基础知识，正好成为了研究部署工作的契机。

在我不知道什么时候，腾讯云的整个Serverless架构都发生了变化：

- Cloudbase 云开发：整个腾讯云微服务/无服务（serverless）的部署框架和底层平台实现，**按月订阅**并提供全部服务
  - 静态网页托管服务
  - 网络优化服务，如CDN
  - 后端即服务，如数据库、小程序后台等
  - Serverless服务，如云函数等
- Webify 云开发：Cloudbase的Web应用托管服务接口，对标vercel的微服务平台，提供了网页部署功能的封装，支持**按量计费**

![image-20230613224035052](https://picgo-1308055782.cos.ap-chengdu.myqcloud.com/picgo-core/2023/06/20230613224037.png)

虽然腾讯的文档很乱（痛批腾讯的一贯风格），不过整个Webify的体验是明显的好于Cloudbase+静态网页托管的流程的（虽然应该只是做了一层业务封装），整个体验上看起来是对标Vercel的，甚至支持一键部署。

上图就是现在我使用的腾讯云业务现在彼此的关系，所谓“Web应用托管”其实就是Serverless部署服务+提供“快捷网页托管”相关的Docker镜像，即新方案应该就是**旧方案的业务整合+拆分**，并没有本质上的区别。

> Web 应用托管采用**按量计费**模式，自身能力免费，应用按照其使用的 TCB 底层环境的各项资源独立计费，如静态托管等。

### Github Page

由于腾讯云的方案无法做加载优化（资源压缩处理）和SEO优化，原因是其Hexo模板的Dockerfile是写死的（而且node版本特别老），无法进行定制，因此我被迫尝试了其他方案进行尝试。这里先尝试了Github Page，因为其开源且文档丰富。

我对这里方案的要求有下：

- 体验对标收费的Serverless服务，即不创建额外仓库，且通过Action自动化构建流程
- 解决原有环境问题，支持进行SEO和加载优化
  - 使用`hexo-all-minifier` 做资源压缩和加载速度优化
  - 使用`hexo-seo` 做SEO优化

#### 部署教程

> 这里参考了[Hexo官方教程](https://hexo.io/zh-cn/docs/github-pages.html)

1. 创建Github Pages服务，根据Github Pages文档我们需要将hexo仓库更名为 `username.github.io` （注意这里username和我们的用户名必须完全匹配）
2. 编写Github Action工作流
   1. 使用 `node --version` 指令检查你电脑上的 Node.js 版本，并记下该版本
   2. 在储存库中建立 `.github/workflows/pages.yml`，具体代码如下，注意将`node-version` 字段的`16` 改成自己环境里的node版本
   3. 工作流定义在Push后会运行部署流程，并将生成的页面放在`gh-pages` 分支中（由`peaceiris/actions-gh-pages@v3` 定义）

```YAML
# .github/workflows/pages.yml

name: Pages

on:
  push:
    branches:
      - main # default branch

jobs:
  pages:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 16.x
        uses: actions/setup-node@v2
        with:
          node-version: "16"
      - name: Cache NPM dependencies
        uses: actions/cache@v2
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

1. 在仓库的Settings → Github Pages → Source中设置分支为`gh_pages`
2. 访问 [username.github.io](https://kiritoking.github.io) 就可以看见自己的网站啦

#### 添加CNAME解析

1. 在`./source` 目录下添加`CNAME` 文件，内容你自己的域名，如下所示

```text
yitu.us.kg
```

1. 在域名提供商处添加或修改DNS解析，我的是DNSPod，如下图所示

![img](https://secure2.wostatic.cn/static/kTtVCVJFznswWDgaFhhD1Y/image.png?auth_key=1688837942-843UhhkReGXiLpy1uBAnud-0-6ca7faae1be25c0065739b219b1bacb7)

#### CDN加速

在更新完博客部署方式的几小时后，我发现我的域名已经不能正常访问了，感叹一下防火墙的速度，要是搜索引擎的爬虫有这一半快就好了。

学习过计网的同学都知道，CDN是一种部署在端侧的缓存加速方案，CDN（内容分发网络）负责缓存通过网络的内容，并将这些缓存的内容传递给就近的用户，使用户可以从就近的CDN源获取而不是远方的源服务器。

正常情况下CDN是加速网络访问，缓解主信道压力的手段，在某些不可言说的特殊网络波动因素的影响下，CDN就成了拯救页面可访问性的救命稻草。

这里我选择Cloudfare的国内服务进行CDN加速服务，因为其对个人开发者提供**免费**服务。

1. 创建Cloudfare账号，点击创建网站，输入你的域名，选择服务套餐

![个人博客选择免费方案即可](https://secure2.wostatic.cn/static/m2WQH29E72vFrQjaHZDEXT/image.png?auth_key=1688922885-g32AXVHuS2LkqE9rRmjacV-0-c1fcb49042ca97a660c2e6b2892e5417)

1. 在你的域名注册机构→域名管理处更改DNS提供商为Cloudfare提供的两个链接，这里以腾讯云为例

```text
dayana.ns.cloudflare.com
rob.ns.cloudflare.com
```

![img](https://secure2.wostatic.cn/static/9LkaVc8c2XMvVkCFNqQLfj/image.png?auth_key=1688923173-t1gampvBGrSXw1XLKo4Guo-0-3e40b5172ed1e2d58797b7cd4127782c)

1. 等待一段时间后，Cloudfare就会接管DNS解析和CDN加速，如果你验证了邮箱也会收到邮件通知

当域名配置了HTTPS时可能会遇到“重定向次数过多”的问题，这是CDN的回源政策导致的，解决方案如下：

Cloudface默认提供了4种**回源（用户请求CDN服务器，CDN服务器请求源服务器再返回给用户的过程）**政策，当源网站和CDN的HTTPS（SSL）设置冲突时就会发生循环重定向。

- 关闭：完全不访问源站HTTPS
- 灵活（Flexible，默认情况）：当HTTPS没有配置或不受信任时，会访问HTTP 问题就出在这里，当源站支持HTTPS且配置了HTTP转HTTPS时，Flexible策略会访问HTTP，HTTP再通过源站转化成对HTTPS的访问，此时**又会回源到HTTP**，形成一个重定向闭环。将策略改成完全即可解决。
- 完全：必须使用HTTPS访问
- 完全（严格）：必须使用受信任的HTTPS证书访问

![img](https://secure2.wostatic.cn/static/nNKgTwh1UdXzJiv1VXiEig/image.png?auth_key=1688923559-k4sqQav6HMsN6iszq6Pzaj-0-c88ec5649933c4a84ea06aa6f4fa1cc1)

### Vercel部署

Vercel部署很简单，直接注册账号选仓库就行，一切都是自动化的。

## SEO 优化

---

## 参考链接

- [使用 Next.js + Hexo 重构我的博客 | Sukka's Blog (skk.moe)](https://blog.skk.moe/post/use-nextjs-and-hexo-to-rebuild-my-blog/#Nei-Rong-Guan-Li-Cong-Hexo-Dao-Next-js)
- [通过Hexo + Github Pages部署你的react项目 - 掘金 (juejin.cn)](https://juejin.cn/post/7208946311885586492)
- [Typora + PicGo-Core + 腾讯云COS 图床配置 - MrSu - 博客园 (cnblogs.com)](https://www.cnblogs.com/suguangti/p/14702744.html)
- [快速上手 | PicGo-Core](https://picgo.github.io/PicGo-Core-Doc/zh/guide/getting-started.html)
- [Upload Images - Typora Support (typoraio.cn)](https://support.typoraio.cn/Upload-Image/#picgo-core-command-line-opensource)
- [Picgo上传图片添加时间戳前缀*picgo super prefix*葡萄汁suki的博客-CSDN博客](https://blog.csdn.net/qq_42365842/article/details/124693106)
- [Hexo遇上Travis-CI：可能是最通俗易懂的自动发布博客图文教程 - 掘金 (juejin.cn)](https://juejin.cn/post/6844903517853843470)
- [概述 | 云开发 Webify (cloudbase.net)](https://webify.cloudbase.net/docs/introduction/)
- [首页 | 云开发 CloudBase - 一站式后端云服务](https://docs.cloudbase.net/)
- [使用 Vercel 和 Github 部署 Hexo 安装以及使用教程 - EvanNotFound's Blog (ohevan.com)](https://ohevan.com/vercel-hexo-configuration.html)
