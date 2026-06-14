# Music Page And Hero Motion Spec

**Date:** 2026-06-04

**Goal**

在保留当前 `Hexo + Argon` 博客主体结构的前提下，为站点新增一组更有记忆点但不过度喧闹的体验升级：

- 首页主标题进入时逐字蹦出
- 副标题延迟淡入
- 标签页失焦和回焦时切换标题文案
- 音乐页升级为“沉浸式播放器头图 + 网易云歌单墙”
- 网易云数据通过代理接口接入，避免在静态前端暴露第三方 `api key`

**Current Project Context**

- 当前主题为 `themes/argon`
- 首页和普通页面已经使用统一的 `lq-*` 视觉壳层
- 主题脚本 `themes/argon/source/argontheme.js` 已经内置 `banner-title` 打字入口
- 配置文件 `source/_data/argon.yml` 已存在 `banner_title`、`banner_subtitle`、`enable_banner_title_typing_effect` 等字段
- 当前音乐页 `source/music/index.md` 正在使用网易云 `meting` 歌单标签
- 当前站点是静态博客，没有服务端运行时，因此不能把第三方 `api key` 直接放进前端页面

**Design Summary**

本次设计分为两部分：

1. 首页与全站微交互升级
2. 音乐页结构升级与网易云数据接入方案

整体设计方向保持“安静、柔和、像个人日记”的气质，不做重赛博、重可视化或强侵入式动效。

## 1. Homepage Motion

**Primary behavior**

- 首页 Hero 主标题使用站点主标题文案
- 页面首次进入时，主标题按字符逐个出现
- 每个字符出现时带有轻微上弹感，而不是纯打字机光标效果
- 主标题完成后，副标题整体淡入并轻微上移
- 动效只在首页 Hero 强化，文章页和普通页面不复用同强度效果

**Motion style**

- 主标题节奏应偏轻快，接近常见个人博客首页开场效果
- 单字符动画建议包含：
  - 初始透明
  - 略微下沉
  - 出现时向上弹入并恢复原位
- 不建议保留明显的闪烁输入光标，避免破坏当前温和氛围

**Reduced motion**

- 若用户浏览器启用 `prefers-reduced-motion: reduce`，则关闭逐字蹦出效果
- 在 reduced motion 下，标题和副标题直接淡入

**Implementation boundary**

- 优先复用当前 `banner-title` 与 `banner-title-inner` 结构
- 若现有 `typeEffect` 仅支持纯文本递增，应在不破坏现有主题其他页面行为的前提下，扩展为“逐字包裹 span + CSS 动画”方案
- 首页 Hero 配置来源继续放在 `source/_data/argon.yml`

## 2. Tab Title Behavior

**Primary behavior**

- 用户离开当前标签页时，`document.title` 临时切换为提示文案
- 用户返回标签页时，标题先短暂显示欢迎回来类文案，再恢复正式标题

**Recommended copy**

- 失焦：`离开了……`
- 回来：`回来啦~`
- 恢复：页面原始标题

**Behavior rules**

- 只在浏览器支持 `visibilitychange` 时启用
- 不应永久覆盖页面原始标题
- 多次切换标签页时应避免定时器堆积
- 如果用户正处于文章页、关于页、音乐页等页面，恢复时必须准确回到该页原始标题，而不是统一回到站点首页标题

**Reduced risk**

- 标题切换逻辑应集中在主题脚本中统一初始化
- 若站点启用了 PJAX，页面切换后应重新读取当前页面原始标题，避免缓存旧值

## 3. Music Page Product Direction

音乐页采用“两段式结构”：

- 上半区：沉浸式播放器头图
- 下半区：网易云歌单墙

此页面不是单纯嵌入一个默认播放器，而是把音乐作为博客里的独立内容页来设计。

### 3.1 Hero Player Section

顶部区域建议包含：

- 当前歌单封面
- 歌单名称
- 一句短文案
- 歌单简介
- 播放入口
- 柔和的模糊背景晕染

**Recommended tone**

- 像“这一页存放最近让我安静下来的声音”
- 不做大面积霓虹、频谱条、重金属控制台式设计

**Visual behavior**

- 背景色从当前歌单封面提取主色，做轻模糊和渐变
- 封面卡片悬浮于背景上方
- 播放器控制区信息密度要低，避免把顶部做成工具面板

### 3.2 Playlist Wall

下半区展示一组可切换歌单卡片。

每张卡片建议包含：

- 封面
- 标题
- 分类或情绪标签
- 歌曲数量
- 一句简短说明

**Recommended groups**

- 学习的时候
- 深夜循环
- 随手收藏
- 最近单曲循环

**Interaction**

- 鼠标悬停时轻微抬升
- 封面产生轻微位移或高光变化
- 点击卡片后切换顶部当前歌单内容

## 4. Player Technology Choice

**Final recommendation**

第一版继续使用 `MetingJS + APlayer` 作为播放器内核。

**Reasoning**

- 当前项目已经在使用网易云 `meting` 标签
- 改造成本最低
- 能快速接入网易云歌单
- 页面视觉层可以独立重做，不必受默认播放器外观限制

**Planned layering**

- 播放器内核：`MetingJS + APlayer`
- 页面结构与视觉：主题自定义 HTML/CSS/JS
- 数据来源：自建轻代理接口

**Future migration path**

若后续需要更自由的样式和更长期的维护性，可逐步切换为：

- 自定义页面 UI
- `Plyr` 或原生 `audio` 作为底层播放控件

第一版不进行该迁移。

## 5. Netease Data Access Strategy

**Security rule**

第三方网易云 `api key` 不允许直接写入静态前端代码。

**Required architecture**

- 前端博客只请求自建代理接口
- 代理接口保存真实 `api key`
- 代理接口再向网易云相关服务请求数据

**Why**

- 静态页面内的任何 key 都会暴露给访问者
- 后续切换供应商、替换接口、加缓存时更容易维护

**Preferred deployment**

- 优先 `Cloudflare Workers`
- 备选 `Vercel`

## 6. Proxy API Contract

代理接口第一版建议提供以下只读能力：

### `GET /playlists`

返回歌单列表，字段建议包含：

- `id`
- `title`
- `cover`
- `description`
- `tag`
- `trackCount`

### `GET /playlist/:id`

返回单个歌单完整信息，字段建议包含：

- `id`
- `title`
- `cover`
- `description`
- `creator`
- `trackCount`
- `tracks`

### `GET /player/playlist/:id`

返回适配播放器的数据结构，至少应能映射出：

- 歌曲名
- 歌手
- 封面
- 音频地址
- 歌词地址或歌词文本

### Optional

- `GET /daily-track`
- `GET /featured-playlists`

第一版不是必须。

## 7. Compatibility Expectations

**Browser compatibility**

- 桌面端现代浏览器应正常工作
- 移动端需要接受自动播放限制

**Known constraints**

- 很多浏览器不会允许页面加载后自动有声播放
- `VIP / 下架 / 区域限制 / 私有歌单` 曲目可能无法播放
- 若代理无法返回可播放音频地址，则前端只能展示歌单信息，不能真正播放

**Fallback strategy**

- 若代理接口暂未就绪，音乐页保留当前 `meting` 单歌单兜底模式
- 页面结构先完成，数据源后接入

## 8. Configuration Strategy

建议在 `source/_data/argon.yml` 中新增或整理以下配置：

- `enable_home_title_motion`
- `home_title_motion_interval`
- `home_subtitle_reveal_delay`
- `tab_blur_title`
- `tab_focus_title`
- `music_page_intro`
- `music_featured_playlists`
- `music_api_base_url`

其中：

- `music_api_base_url` 指向你的代理服务根地址
- `music_featured_playlists` 用于指定歌单墙默认展示顺序
- 默认兜底歌单由 `music_featured_playlists` 的第一项提供，避免重复维护两个来源

## 9. Error Handling

- 如果首页标题为空，则回退为站点标题
- 如果标签页原始标题读取失败，则回退为站点标题
- 如果音乐代理接口请求失败：
  - 页面顶部显示简短提示
  - 歌单墙显示降级状态
  - 播放器回退到默认歌单或静态嵌入内容
- 如果某个歌单返回为空，不阻塞整页其他歌单展示

## 10. Testing Strategy

设计完成后实现阶段至少验证以下内容：

- 首页 Hero 存在主标题逐字动效容器
- `prefers-reduced-motion` 下标题不会逐字蹦出
- 切换标签页时标题会正确变化并恢复
- 音乐页存在顶部沉浸式区和下方歌单墙
- 代理接口异常时音乐页仍可渲染降级内容
- 手机宽度下播放器区和歌单墙不会破版

## 11. Out Of Scope For First Pass

- 不做实时音频频谱可视化
- 不做复杂歌词逐字同步高亮
- 不做用户登录、收藏、点赞、评论等音乐社区能力
- 不做多平台音乐源切换
- 不在第一版里重写整个播放器内核

## 12. Acceptance Criteria

- 首页进入时主标题逐字蹦出，副标题延迟淡入
- 切出标签页时标题变为提示文案，切回后恢复原始标题
- 音乐页从单一播放器嵌入升级为“顶部沉浸式展示 + 下方歌单墙”
- 第三方 `api key` 不暴露在静态前端
- 当代理不可用时，音乐页仍可降级为当前单歌单模式
- 整体风格与现有站点柔和、日记感的基调保持一致
