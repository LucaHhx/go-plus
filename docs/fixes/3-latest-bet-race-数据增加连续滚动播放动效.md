# FIX-3: Latest bet & Race 数据增加连续滚动播放动效

> 日期: 2026-03-05 | 状态: 已修复 | 严重程度: P2

## 现象

Latest bet & Race 区域的投注数据为静态列表，没有滚动播放动效，缺乏实时动态感。

## 根因分析

LatestBetRace 组件直接渲染所有行数据，无滚动逻辑和动画。

## 修复方案

1. 使用 CSS `@keyframes` 实现匀速连续向上滚动动画
2. 数据列表复制一份拼接，形成无缝循环（A+B 双列表）
3. 固定可视区域高度（7 行），超出部分 `overflow: hidden`
4. 鼠标悬停时暂停动画（`animationPlayState: paused`）
5. 使用 CSS 自定义属性 `--scroll-distance` 动态设置滚动距离
6. 切换 Tab 时自动重置滚动状态

## 变更文件

| 文件 | 修改说明 |
|------|----------|
| `frontend/src/pages/home/components/LatestBetRace.tsx` | 重写为连续滚动模式，双列表无缝循环 |
| `frontend/src/index.css` | 添加 `betScrollUp` 关键帧和 `.bet-scroll-track` 动画类 |

## 验收标准

- [x] 投注数据匀速连续向上滚动，无卡顿
- [x] 滚动到末尾后无缝循环回到开头
- [x] 鼠标悬停时暂停滚动
- [x] 切换 Tab 后重新开始滚动
- [x] 数据不足 7 行时不滚动
- [x] TypeScript 编译通过
