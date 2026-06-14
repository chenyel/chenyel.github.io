# NetEase Music Proxy Example

这个示例的目的只有一个：把第三方 `NETEASE_API_KEY` 留在代理层，不暴露到静态 Hexo 前端。

## Why

- 博客是静态站点
- 前端里出现的 key 都会暴露给访问者
- 音乐页只应该请求你自己的代理接口

## Recommended Runtime

- `Cloudflare Workers`
- 或者 `Vercel`

## Expected Routes

- `GET /playlists`
- `GET /playlist/:id`
- `GET /player/playlist/:id`

## Environment Variables

- `NETEASE_API_KEY`
- `NETEASE_UPSTREAM_BASE_URL`

## Response Shape

`GET /playlists` 推荐返回：

```json
[
  {
    "id": "9724541268",
    "title": "默认歌单",
    "tag": "兜底",
    "description": "代理不可用时，先使用这张默认歌单。",
    "trackCount": 24,
    "cover": "https://example.com/cover.jpg"
  }
]
```

`GET /playlist/:id` 推荐返回：

```json
{
  "id": "9724541268",
  "title": "默认歌单",
  "tag": "兜底",
  "description": "代理不可用时，先使用这张默认歌单。",
  "trackCount": 24,
  "cover": "https://example.com/cover.jpg",
  "tracks": []
}
```

`GET /player/playlist/:id` 推荐返回：

```json
[
  {
    "title": "Song A",
    "artist": "Artist A",
    "cover": "https://example.com/cover.jpg",
    "audio": "https://example.com/audio.mp3",
    "lrc": "https://example.com/song.lrc"
  }
]
```

## Integration Notes

- 前端配置字段使用 `music_api_base_url`
- 当前音乐页在代理不可用时会自动退回到默认歌单模式
- 如果你后续要把顶部沉浸区做得更丰富，可以优先扩展 `GET /playlist/:id`
