# Dakai 的 LeetCode 刷题博客

这是博客的公开静态镜像，部署到 GitHub Pages。

它不依赖数据库或登录：题解内容集中在 `content/problems.ts`，首页目录、筛选、收藏与各题详情页都会由该数据自动生成。

## 本地预览

```bash
npm ci
npm run build:pages
```

构建结果位于 `out/`。每次推送到 `main`，GitHub Actions 会自动重新构建并发布镜像。

## 更新题解

1. 在 `content/problems.ts` 新增或更新题目记录。
2. 运行 `npm run build:pages` 确认静态构建通过。
3. 推送到 `main`，等待 GitHub Pages 自动发布。

原始 Sites 博客与本仓库使用同一份内容结构；后续新增题解时，同步这份文件即可。
