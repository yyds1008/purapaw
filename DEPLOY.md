# PuraPaw 猫砂制造商网站 — 自定义域名部署指南

## 最简单方案：部署到 Render.com（免费 + 支持自定义域名）

### 第 1 步：把代码传到 GitHub

1. 打开 https://github.com/new 新建一个仓库，名字填 `purapaw`，选 Private，点 Create。
2. 在本机（Windows）打开命令行，进入项目文件夹：
   ```
   git init
   git add .
   git commit -m "init purapaw"
   git branch -M main
   git remote add origin https://github.com/你的用户名/purapaw.git
   git push -u origin main
   ```
   （如果没装 git，去 https://git-scm.com 下载安装）

### 第 2 步：在 Render 上部署

1. 打开 https://render.com → 右上角 **Sign Up** → 选 **GitHub** 登录
2. 点 **New +** → 选 **Web Service**
3. 选刚才创建的 `purapaw` 仓库
4. 配置：
   - **Name**: purapaw
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
5. 点 **Create Web Service**
6. 等 1-2 分钟构建完成，Render 会给你一个地址：`https://purapaw.onrender.com`

### 第 3 步：绑定你买的域名

1. 在 Render 的 Web Service 页面，点左侧 **Settings**
2. 往下找到 **Custom Domains** → 点 **Add Custom Domain**
3. 输入你买的域名，比如 `purapaw.com` → 点 **Add**
4. Render 会给你一条 DNS 记录，类似：
   ```
   类型: CNAME
   主机记录: @  (或 www)
   记录值: purapaw.onrender.com
   ```
   或者：
   ```
   类型: A
   主机记录: @
   记录值: 76.76.21.21
   ```

### 第 4 步：去你买域名的平台配 DNS

登录你买域名的平台（不管哪个平台都有 DNS 管理），添加 Render 给你的那条记录：

- 如果是 **CNAME**：添加 CNAME 记录，主机填 `@` 或 `www`，值填 Render 给的地址
- 如果是 **A 记录**：添加 A 记录，主机填 `@`，值填 Render 给的 IP

**注意**：如果你要用 `www.你的域名.com`，加一条 CNAME：`www → purapaw.onrender.com`

### 第 5 步：等待 DNS 生效 + 自动 HTTPS

- DNS 生效通常需要 10-30 分钟（最长 24 小时）
- Render 会自动为你配置 **HTTPS 证书**（免费）
- 生效后，浏览器输入 `https://你的域名.com` 就能直接打开网站

---

## 后台管理

- 地址：`https://你的域名.com/admin/login`
- 用户名：`admin`
- 密码：`admin123`

## 数据说明

- 网站内容存储在 `data/site.json` 文件中（JSON 文件持久化）
- Render 免费版会在 15 分钟无访问后休眠，首次访问需等 30 秒冷启动
- 如需 7×24 不休眠，升级 Render 付费版（$7/月）

---

## 备选方案：Railway.app

如果不想用 Render，Railway 也一样：

1. 打开 https://railway.app → 用 GitHub 登录
2. **New Project** → **Deploy from GitHub repo** → 选 `purapaw` 仓库
3. 自动检测 Node.js → 自动安装依赖 → 自动启动
4. 部署成功后点 **Settings** → **Networking** → **Generate Domain**
5. 点 **Custom Domain** → 输入你买的域名
6. Railway 给你 DNS 记录，去域名平台配上即可

---

## 常见问题

| 问题 | 解决 |
|------|------|
| 域名打不开 | 等 DNS 生效（最多 24h），或检查 DNS 记录是否填对 |
| 显示不安全连接 | 等 Render 自动签发 HTTPS 证书（几分钟） |
| 网站休眠了 | Render 免费版 15 分钟无访问会休眠，访问会自动唤醒（约 30 秒） |
| 后台改了内容不见了 | Render 免费版重启会清空文件存储；如需持久化，升级付费版或接数据库 |

## 需要改密码？

登录后台 → 暂不支持在线改密码。如需改，编辑 `server.js` 里的密码 hash。
