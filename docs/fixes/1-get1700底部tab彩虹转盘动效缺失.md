# FIX-1: GET1700底部Tab彩虹转盘动效缺失

> 日期: 2026-03-05 | 状态: 已修复 | 严重程度: P2

## 现象

大厅底部 Tab 栏中间的 GET ₹1700 按钮在设计稿中应为转盘图片 + hue-rotate 彩虹流光动画，但实际显示为静态绿色渐变圆圈 + info 图标。

## 根因分析

BottomTabBar.tsx 未使用设计稿中引用的转盘图片资源，而是用 CSS `linear-gradient` 做了简单的绿色圆形占位。index.css 中虽已定义 `.get1700-wrap` 完整样式和 `rainbowRotate` 动画，但组件未使用对应的 HTML 结构。

## 修复方案

1. 从 1goplus.com 下载转盘图片保存为本地资源 `/assets/icons/get1700-wheel.png`
2. 将 BottomTabBar.tsx 中 GET ₹1700 按钮结构改为与设计稿一致的 `.get1700-wrap` > `img` + `.get1700-bg` 结构
3. 复用 index.css 中已有的 `.get1700-wrap`、`.get1700-wrap img`、`.get1700-bg` 样式
4. `rainbowRotate` 动画自动通过 `.get1700-wrap img` 选择器生效

## 变更文件

| 文件 | 修改说明 |
|------|----------|
| `frontend/public/assets/icons/get1700-wheel.png` | 新增转盘图片资源（从设计稿引用源下载） |
| `frontend/src/components/layout/BottomTabBar.tsx` | 替换为 img + get1700-wrap 结构，1:1 还原设计稿 |
| `frontend/src/index.css` | 删除无用的 `.get1700-ring` 类 |

## 验收标准

- [x] GET ₹1700 按钮显示为设计稿中的转盘图片
- [x] 图片持续播放 hue-rotate 彩虹流光动画（3秒一循环）
- [x] 图片尺寸、上浮定位、底部绿色背景块与设计稿一致
- [x] "GET ₹1700" 文字标签样式与设计稿一致
- [x] TypeScript 编译通过
