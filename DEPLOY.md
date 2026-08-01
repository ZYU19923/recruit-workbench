# 部署到 Vercel — 需要 GitHub Personal Access Token

## 你的 GitHub
- 用户名: zyu19923
- Repo: https://github.com/zyu19923/recruit-workbench

## 生成 Token
在浏览器打开: https://github.com/settings/tokens/new
- Note: recruit-workbench-deploy
- Expiration: 90 days
- Scope: 勾选 **repo**
- 点 Generate token，复制生成的 token（ghp_开头）

## 需要执行的操作
有了 token 后告诉我，我会：
1. Push 代码到 GitHub（4个 commit 需要同步）
2. 部署到 Vercel

本地需要做的事情（在 cmd 窗口执行）:
```
cd /d D:\Project\recruit-workbench
git push origin main
```
（会弹出浏览器让你登录 GitHub）
