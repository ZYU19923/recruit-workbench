# 招聘工作台 — 部署指南

## 公网访问
https://recruit-workbench.vercel.app

## 本地启动
```bash
cd D:/Project/recruit-workbench
npm install --legacy-peer-deps
npm run dev
```
打开 http://localhost:3000

## 功能清单
- Dashboard 概览
- 岗位管理 (列表 + 看板拖拽)
- 候选人管理 (详情 + 阶段切换 + 沟通时间线)
- 沟通记录
- 面试管理 (列表 + 日历视图)
- Offer 管理
- 工作日志 (日/周/月)
- 待办事项
- 数据分析 (阶段分布 / 月度趋势 / 渠道来源 / 转化漏斗 / 岗位进度)
- 全局搜索
- CSV 导出
- JSON 全量备份 导入/导出
- PWA (可安装到桌面)
- 简历文件上传 (IndexedDB)
- 暗色模式
- 备注面板
