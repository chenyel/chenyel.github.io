# LQAY Style Blog Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前 `Hexo + Argon` 博客改造成接近 `blog.lqay.cn` 的完整版本，包括首页沉浸式首屏、统一壳层、文章页重构、悬浮播放器、看板娘与评论区集成。

**Architecture:** 保留 Argon 的数据与 helper，重写页面壳层与关键组件。首页、文章页和独立页统一进入 `lq-shell` 结构，自定义悬浮模块和配置项独立挂载，样式集中收敛到新的 `lq-*` 组件命名体系。

**Tech Stack:** Hexo 7, EJS, Argon theme, CSS, local search XML, existing comment integrations, Node test runner

---

## File Structure Map

**Likely modify**

- `D:\blog\_config.yml`
- `D:\blog\source\_data\argon.yml`
- `D:\blog\themes\argon\layout\layout.ejs`
- `D:\blog\themes\argon\layout\header.ejs`
- `D:\blog\themes\argon\layout\footer.ejs`
- `D:\blog\themes\argon\layout\sidebar.ejs`
- `D:\blog\themes\argon\layout\index.ejs`
- `D:\blog\themes\argon\layout\post.ejs`
- `D:\blog\themes\argon\layout\_partial\content-preview.ejs`
- `D:\blog\themes\argon\layout\_partial\content-article.ejs`
- `D:\blog\themes\argon\layout\_partial\content-page.ejs`
- `D:\blog\themes\argon\layout\_partial\article-bottom.ejs`
- `D:\blog\themes\argon\source\style.css`
- `D:\blog\themes\argon\source\argontheme.js`
- `D:\blog\tests\layout-shell.test.mjs`

**Likely create**

- `D:\blog\themes\argon\layout\_partial\lq-home-hero.ejs`
- `D:\blog\themes\argon\layout\_partial\lq-rightbar.ejs`
- `D:\blog\themes\argon\layout\_partial\lq-player.ejs`
- `D:\blog\themes\argon\layout\_partial\lq-live2d.ejs`
- `D:\blog\themes\argon\layout\_partial\lq-comment-shell.ejs`
- `D:\blog\source\img\` 下新增背景图、Logo、播放器占位资源、看板娘资源

## Task 1: Stabilize configuration and text sources

**Files:**

- Modify: `D:\blog\_config.yml`
- Modify: `D:\blog\source\_data\argon.yml`

- [ ] 清理站点标题、描述、菜单、作者信息和页脚文案的乱码来源。
- [ ] 统一首页标题、副标题、导航菜单、作者名、友情链接等文案来源，避免模板内散落硬编码。
- [ ] 新增一组自定义配置项，至少覆盖：
  - `home_hero_background`
  - `home_hero_overlay`
  - `home_slogan`
  - `show_lq_player`
  - `show_lq_live2d`
  - `show_lq_rightbar`
  - `comment_style`
- [ ] 保持现有 `giscus`、`waline`、`twikoo` 配置结构不破坏，只增加外层样式控制配置。

## Task 2: Build the unified shell

**Files:**

- Modify: `D:\blog\themes\argon\layout\layout.ejs`
- Modify: `D:\blog\themes\argon\layout\sidebar.ejs`
- Create: `D:\blog\themes\argon\layout\_partial\lq-rightbar.ejs`

- [ ] 将当前 `layout.ejs` 从“Banner + sidebar + content-area”的默认拼装改成统一 `lq-shell`。
- [ ] 在新壳层中明确以下容器：
  - `lq-shell`
  - `lq-left-column`
  - `lq-main-column`
  - `lq-right-column`
- [ ] 左栏复用现有侧栏信息，但输出新的包裹类名，避免直接依赖 Argon 默认结构。
- [ ] 右栏单独抽成 partial，方便首页、文章页、独立页按需展示不同模块。
- [ ] 移动端为左右栏设计折叠或抽屉式降级，不保留三栏硬挤布局。

## Task 3: Rebuild the top navigation and homepage hero

**Files:**

- Modify: `D:\blog\themes\argon\layout\header.ejs`
- Modify: `D:\blog\themes\argon\layout\index.ejs`
- Create: `D:\blog\themes\argon\layout\_partial\lq-home-hero.ejs`

- [ ] 将导航改造成透明悬浮导航，首页首屏覆盖在背景图之上。
- [ ] 支持图标 + 文案导航项，搜索入口保留但改成新的触发按钮 `lq-search-trigger`。
- [ ] 首页引入 `lq-home-hero`，渲染：
  - 背景图
  - 遮罩层
  - 站点标题
  - slogan
  - 向下滚动提示
- [ ] 首页 Hero 下方继续渲染文章列表，但不要让文章卡片在第一屏压住主视觉。
- [ ] 处理滚动后导航可读性，必要时增加背景或模糊层。

## Task 4: Rebuild article and page cards

**Files:**

- Modify: `D:\blog\themes\argon\layout\_partial\content-preview.ejs`
- Modify: `D:\blog\themes\argon\layout\_partial\content-article.ejs`
- Modify: `D:\blog\themes\argon\layout\_partial\content-page.ejs`
- Modify: `D:\blog\themes\argon\layout\post.ejs`

- [ ] 首页文章列表卡片改造成 `lq-article-card`。
- [ ] 独立页面内容容器改造成 `lq-page-card`。
- [ ] 文章正文容器与首页预览卡视觉分层一致，但正文阅读宽度更舒适。
- [ ] 保留现有文章元信息能力，但重新布局时间、分类、字数和阅读时长。
- [ ] 文章页继续保留封面、标签、附加内容、上下篇和评论挂载点。

## Task 5: Inject floating widgets

**Files:**

- Create: `D:\blog\themes\argon\layout\_partial\lq-player.ejs`
- Create: `D:\blog\themes\argon\layout\_partial\lq-live2d.ejs`
- Modify: `D:\blog\themes\argon\layout\footer.ejs`
- Modify: `D:\blog\themes\argon\source\argontheme.js`

- [ ] 将右下悬浮播放器做成独立 partial，并通过配置控制显示。
- [ ] 如果先不接真实远程歌单，则首版使用本地配置的音频地址、封面、标题和作者信息。
- [ ] 将左下看板娘做成独立 partial，支持欢迎语与移动端隐藏策略。
- [ ] 统一悬浮组件的层级，避免和搜索、返回顶部、侧栏按钮互相遮挡。
- [ ] 对超小屏设备做降级：播放器缩小或折叠，看板娘可隐藏。

## Task 6: Wrap the comment system in the new visual shell

**Files:**

- Modify: `D:\blog\themes\argon\layout\_partial\article-bottom.ejs`
- Create: `D:\blog\themes\argon\layout\_partial\lq-comment-shell.ejs`

- [ ] 在文章页评论区域外层加统一 `lq-comment-shell`。
- [ ] 保持现有评论供应商逻辑不变，只改变展示容器和标题结构。
- [ ] 如果多个评论系统开关关闭，评论区容器也应一起不渲染。

## Task 7: Consolidate styles into an LQ layer

**Files:**

- Modify: `D:\blog\themes\argon\source\style.css`

- [ ] 为新的壳层、Hero、三栏、文章卡、页面卡、右栏模块、播放器、看板娘、评论区、搜索触发器建立 `lq-*` 样式组。
- [ ] 优先新增样式而不是粗暴覆盖原有全局类名。
- [ ] 完成以下响应式断点处理：
  - 桌面三栏
  - 平板双栏或压缩三栏
  - 手机单栏
- [ ] 保证首页首屏在 1920 宽度与手机宽度下都能正常展示，不出现标题被悬浮组件压住的问题。

## Task 8: Update behavior scripts

**Files:**

- Modify: `D:\blog\themes\argon\source\argontheme.js`

- [ ] 为透明导航滚动状态、Hero 滚动提示、右栏折叠、播放器展开收起等补充交互。
- [ ] 保持现有 Argon 功能可用，避免破坏懒加载、PJAX、目录联动和回到顶部。
- [ ] 如站点仍启用 PJAX，确认浮动组件不会在页面切换后重复初始化。

## Task 9: Align tests with the new shell

**Files:**

- Modify: `D:\blog\tests\layout-shell.test.mjs`

- [ ] 保留现有对 `lq-shell`、`lq-left-column`、`lq-right-column`、`lq-search-trigger` 的断言。
- [ ] 增加首页 Hero 断言，如 `lq-home-hero`。
- [ ] 增加文章页评论壳层或右栏模块断言。
- [ ] 增加独立页 `lq-page-card` 断言。
- [ ] 如播放器和看板娘最终静态输出到 HTML，也为其补充存在性断言。

## Task 10: Verify generated output

**Files:**

- Verify: `D:\blog\public\index.html`
- Verify: `D:\blog\public\about\index.html`
- Verify: representative post output under `D:\blog\public\YYYY\MM\DD\...`

- [ ] 运行 `npm run build` 或 `npx hexo generate`。
- [ ] 运行 `node --test tests/layout-shell.test.mjs`。
- [ ] 打开生成后的首页检查首屏、导航、播放器、看板娘、滚动状态和移动端压缩。
- [ ] 打开文章页检查目录、正文、评论区和右栏布局。
- [ ] 记录任何因为素材路径、编码或脚本初始化导致的问题，再进入二轮收口。

## Suggested execution order

1. 配置清理
2. 统一壳层
3. 首页 Hero 与导航
4. 文章/页面卡片
5. 评论壳层
6. 播放器与看板娘
7. 样式收口
8. 交互脚本
9. 测试与生成验证

## Risks to watch closely

- `header.ejs` 目前承载了大量原有导航和 Banner 逻辑，重构时最容易牵连全站。
- `style.css` 体积较大，若不使用新前缀命名，后续很难维护。
- 播放器与看板娘属于浮动高干扰组件，移动端最容易破版。
- 现有测试目标已经和实际页面不一致，说明必须先以模板为准重新打通生成链路。

## Ready-to-start checkpoints

- [ ] 已准备首页背景图与站点标语
- [ ] 已决定评论系统优先使用 `giscus` 还是 `waline`
- [ ] 已决定播放器使用本地静态歌曲还是远程歌单
- [ ] 已决定看板娘使用静态挂件还是后续再接 live2d
