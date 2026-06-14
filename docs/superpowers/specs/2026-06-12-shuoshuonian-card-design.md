# Shuoshuonian Album Card Design Spec

**Date:** 2026-06-12

**Goal**

将站内所有带 `碎碎念` 标签的文章，从普通文章预览改造成“相册封面卡”浏览体验：列表中优先展示手动指定的封面图，点击后进入完整详情页阅读，同时保持与当前站点现有柔和、轻盈、圆角、略带梦感的整体风格一致。

**Current Project Context**

- 站点框架是 Hexo，主题为 `themes/argon`。
- 首页与标签页文章列表都通过 `themes/argon/layout/index.ejs` 渲染，并复用 `themes/argon/layout/_partial/content-preview.ejs`。
- 文章详情页通过 `themes/argon/layout/post.ejs` 和 `themes/argon/layout/_partial/content-article.ejs` 渲染。
- 主题已经原生支持文章手动封面字段：
  - `themes/argon/scripts/functions.js` 中 `has_thumbnail` / `get_thumbnail` 已可读取 `thumbnail`
  - `themes/argon/layout/_partial/content-preview.ejs` 和 `content-article.ejs` 已支持封面输出
- 当前存在旧的 `.shuoshuo-*` 与 `.shuoshuo-preview-*` 样式，但现阶段 `碎碎念` 列表并没有独立模板入口，而是和普通文章共用预览卡结构。
- 用户已经确认：
  - 每条碎碎念都手动指定封面图
  - 首页、归档、标签页里只要遇到 `碎碎念` 都应用同一套卡片规则
  - 视觉方向优先贴合当前站点风格，而不是切换到重杂志风或强实验风

**Design Direction**

本次设计采用“相册封面卡”方向，而不是信息密度较高的文章卡或偏纸质感的拍立得卡。

核心气质：

- 柔和，不做过强的冲撞色和锐利排版
- 轻梦感，但不做夸张滤镜或过度发光
- 图片先行，文字为辅助
- 像“把生活片段认真收进相册”，而不是“把短文压缩成新闻卡片”

**Experience Model**

**1. List Experience**

在首页、归档列表、标签页列表中：

- 非 `碎碎念` 文章继续使用现有文章预览卡
- 带 `碎碎念` 标签的文章切换为专用封面卡
- 卡片以大封面图为主视觉，承担主要吸引力
- 卡面只保留少量关键信息：标题、日期、短摘要、进入详情的轻提示
- 用户的浏览心智从“读摘要决定是否点开”变成“翻看封面决定是否点开”

**2. Detail Experience**

点击卡片后仍进入现有文章详情页，不引入弹窗、抽屉或伪单页切换。

这样做的原因：

- 保留当前 Hexo + Argon 文章详情页、评论、正文排版和链接分享能力
- 不制造新的阅读路径和维护分叉
- 让列表封面卡与详情页封面形成自然衔接，而不是两套脱节体验

**Page Model**

**1. Dedicated Shuoshuonian Preview Card**

专用卡片应满足以下结构目标：

- 使用手动封面图作为卡片主视觉
- 卡片比例偏竖向或中等偏高，接近相片/收藏卡的观感
- 图片表面覆盖轻微渐变遮罩，保证标题可读
- 标题放在视觉重心区，摘要不超过一小段
- 日期作为角标或小型信息条存在，弱于标题
- 提供明确可点击反馈，但 hover 动作保持轻量

不应出现以下情况：

- 在卡面堆叠阅读量、字数、阅读时长、分类等高密度信息
- 做成重杂志式多栏排版
- 与普通文章卡完全同权显示，导致视觉上失去“碎碎念是生活相册”的区分

**2. Shuoshuonian Detail Page**

详情页保持现有文章页架构，但对 `碎碎念` 的顶部视觉作更自然的衔接：

- 顶部继续使用同一张手动封面图
- 标题、日期、标签保留，但整体观感更克制
- 正文排版与阅读宽度保持当前站点可读性优先的规则
- 内容很短时，封面承担氛围；内容较长时，正文仍是完整文章体验

**Data Contract**

每条 `碎碎念` 文章的最小写法约定如下：

```yaml
---
title: 今天的标题
date: 2026-06-12 21:00:00
tags:
  - 碎碎念
thumbnail: /img/shuoshuonian/2026-06-12.jpg
---
```

规则定义：

- `tags` 中包含 `碎碎念`，视为碎碎念文章
- `thumbnail` 为碎碎念封面图来源
- 非 `碎碎念` 文章不受本次改造影响

**Fallback Rules**

虽然用户计划为每条碎碎念手动提供封面，但实现仍需安全兜底：

- `碎碎念` 且有 `thumbnail`：使用完整相册封面卡
- `碎碎念` 且无 `thumbnail`：使用简化的优雅兜底卡，保证布局不塌、链接可点、信息可读
- 非 `碎碎念`：走当前普通文章预览卡

兜底卡的目标不是与完整封面卡完全同级，而是：

- 不报错
- 不破版
- 不让列表中出现突兀的空白占位

**Implementation Boundaries**

本次设计优先复用现有主题能力，不引入新的数据流。

建议实现边界如下：

1. 在 `themes/argon/layout/_partial/content-preview.ejs` 中判断文章是否为 `碎碎念`
2. 为 `碎碎念` 输出独立卡片结构，为普通文章保留现有结构
3. 在 `themes/argon/source/style.css` 中新增一组专用样式，例如：
   - `lq-shuoshuonian-card`
   - `lq-shuoshuonian-cover`
   - `lq-shuoshuonian-overlay`
   - `lq-shuoshuonian-meta`
4. 尽量不复活旧 `.shuoshuo-preview-*` 视觉，而是建立一套更贴近当前主题的新命名
5. 详情页优先通过轻量条件样式或局部类名增强，不重写整篇文章模板逻辑

**Recommended File Scope**

- Modify: `D:\blog\themes\argon\layout\_partial\content-preview.ejs`
  Responsibility: 为 `碎碎念` 输出专用预览卡结构
- Modify: `D:\blog\themes\argon\source\style.css`
  Responsibility: 相册封面卡视觉、动效、响应式与兜底样式
- Modify if needed: `D:\blog\themes\argon\layout\_partial\content-article.ejs`
  Responsibility: 为 `碎碎念` 详情页增加轻量样式挂钩
- Modify sample content if needed: `D:\blog\source\_posts\*.md`
  Responsibility: 为现有碎碎念补充 `thumbnail` 示例

**Interaction Design**

- Hover 仅使用轻微上浮、阴影增强和封面微缩放
- 不使用夸张旋转、透视翻页或强烈发光
- 点击区域应覆盖整个卡片主体，而不是只有标题可点
- 移动端取消依赖 hover 的信息暴露，关键内容默认可见

**Responsive Behavior**

- 桌面端卡片可保持较强的图片展示比例
- 平板端降低边距和标题尺寸
- 移动端卡片高度收紧，确保封面仍然主导但不过度占屏
- 移动端摘要长度需要更短，避免一张卡过高

**Error Handling and Risk Control**

- `thumbnail` 缺失时不能让 `img` 为空或出现破损图标
- `碎碎念` 识别应基于标签文本，避免误伤普通文章
- 新样式应与现有普通文章卡隔离，避免全站预览卡一起被改坏
- 归档页如果仍复用同一列表 partial，需要验证新卡不会打破原有分页和间距
- 由于当前工作目录不是 Git 仓库，本轮无法依赖 git 提交记录做回溯或按技能要求提交 spec commit

**Testing Strategy**

至少验证以下结果：

- 首页中带 `碎碎念` 标签的文章显示为专用封面卡
- 标签页 `/tags/碎碎念/` 中所有碎碎念都显示为专用封面卡
- 其他标签页与普通文章列表维持当前样式
- 点击碎碎念卡片后能正常进入详情页
- 缺少 `thumbnail` 的碎碎念仍能正常显示兜底卡
- 移动端卡片不出现遮挡、溢出和文字不可读问题
- 深色模式下标题、遮罩和日期仍保持可读

**Out of Scope**

- 不在本轮引入碎碎念独立详情模板分支
- 不在本轮加入 Masonry 瀑布流或复杂筛选
- 不在本轮自动生成文字封面图
- 不在本轮改造普通文章卡片体系

**Acceptance Criteria**

- 站内所有带 `碎碎念` 标签的文章，在首页、归档列表、标签页列表中都显示为统一的相册封面卡
- 封面卡视觉与当前站点风格统一，而不是突兀的新设计体系
- 详情页仍保持正常文章阅读体验，并与封面图形成自然衔接
- 每条碎碎念可通过 `thumbnail` 手动指定封面图
- 缺图情况下页面仍稳定、可读、可点击
