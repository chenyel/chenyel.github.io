export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const upstreamBase = String(env.NETEASE_UPSTREAM_BASE_URL || "").replace(/\/$/, "");

    if (url.pathname === "/playlists") {
      return Response.json([
        {
          id: "9724541268",
          title: "默认歌单",
          tag: "兜底",
          description: "代理不可用时，先使用这张默认歌单。"
        }
      ]);
    }

    if (url.pathname.startsWith("/playlist/")) {
      const playlistId = url.pathname.split("/").pop();
      return proxyJson(`${upstreamBase}/playlist/${playlistId}`, env.NETEASE_API_KEY);
    }

    if (url.pathname.startsWith("/player/playlist/")) {
      const playlistId = url.pathname.split("/").pop();
      return proxyJson(`${upstreamBase}/player/playlist/${playlistId}`, env.NETEASE_API_KEY);
    }

    return new Response("Not found", { status: 404 });
  }
};

async function proxyJson(url, apiKey) {
  if (!url || !apiKey) {
    return Response.json({ error: "Proxy is not configured" }, { status: 500 });
  }

  const upstream = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`
    }
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") || "application/json; charset=utf-8"
    }
  });
}
