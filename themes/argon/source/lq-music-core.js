(function (root, factory) {
	var api = factory();
	if (typeof module === "object" && module.exports) {
		module.exports = api;
	}
	root.LqMusicCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
	function sanitizeText(value) {
		return String(value || "")
			.replace(/[\u0000-\u001F\u007F-\u009F\u200B-\u200D\uFEFF]/g, "")
			.trim();
	}

	function joinArtist(value) {
		if (Array.isArray(value)) {
			return value
				.map(function (item) {
					if (item && typeof item === "object") {
						return item.name || item.artist || item.author || "";
					}
					return item;
				})
				.map(sanitizeText)
				.filter(Boolean)
				.join(" / ");
		}
		if (value && typeof value === "object") {
			return sanitizeText(value.name || value.artist || value.author || "");
		}
		return sanitizeText(value);
	}

	function parseLqLyrics(input) {
		if (!input) {
			return [];
		}

		return String(input)
			.split(/\r?\n/)
			.reduce(function (result, line) {
				var matches = Array.from(line.matchAll(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g));
				if (!matches.length) {
					return result;
				}

				var text = sanitizeText(line.replace(/\[\d{2,}:\d{2}(?:\.\d{2,3})?\]/g, ""));
				if (!text) {
					return result;
				}

				matches.forEach(function (match) {
					var minutes = Number(match[1] || 0);
					var seconds = Number(match[2] || 0);
					var fraction = String(match[3] || "");
					var divisor = fraction.length === 3 ? 1000 : 100;
					var time = minutes * 60 + seconds + (fraction ? Number(fraction) / divisor : 0);
					result.push({
						time: Number(time.toFixed(3)),
						text: text
					});
				});
				return result;
			}, [])
			.sort(function (left, right) {
				return left.time - right.time;
			});
	}

	function normalizeLqTrack(track, index) {
		if (!track || typeof track !== "object") {
			return null;
		}

		var src = sanitizeText(track.url || track.src || track.audio);
		if (!src) {
			return null;
		}

		var artist = joinArtist(track.artist || track.author || track.ar || track.singer);
		return {
			id: sanitizeText(track.id || index + 1),
			title: sanitizeText(track.name || track.title || "Untitled Track"),
			artist: artist || "Unknown Artist",
			cover: sanitizeText(track.pic || track.cover || track.poster),
			src: src,
			lyric: typeof track.lyric === "string" ? track.lyric : "",
			lrcUrl: sanitizeText(track.lrc || track.lrcUrl),
		};
	}

	function normalizeLqPlaylist(payload) {
		var list = Array.isArray(payload)
			? payload
			: payload && Array.isArray(payload.playlist)
				? payload.playlist
				: payload && Array.isArray(payload.songs)
					? payload.songs
					: [];

		return list
			.map(function (track, index) {
				return normalizeLqTrack(track, index);
			})
			.filter(Boolean);
	}

	function findLqActiveLyricIndex(lyrics, currentTime) {
		if (!Array.isArray(lyrics) || !lyrics.length) {
			return -1;
		}

		for (var index = lyrics.length - 1; index >= 0; index -= 1) {
			if (currentTime >= Number(lyrics[index].time || 0)) {
				return index;
			}
		}
		return -1;
	}

	return {
		findLqActiveLyricIndex: findLqActiveLyricIndex,
		normalizeLqPlaylist: normalizeLqPlaylist,
		normalizeLqTrack: normalizeLqTrack,
		parseLqLyrics: parseLqLyrics
	};
});
