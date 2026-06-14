import test from 'node:test'
import assert from 'node:assert/strict'

const musicCoreModule = await import('../themes/argon/source/lq-music-core.js')
const {
  parseLqLyrics,
  normalizeLqPlaylist,
  findLqActiveLyricIndex,
} = musicCoreModule.default || musicCoreModule

test('parseLqLyrics expands repeated timestamps and strips metadata lines', () => {
  const lyrics = parseLqLyrics([
    '[ti:Test Song]',
    '[00:01.50]first line',
    '[00:05.00][00:07.25]repeat line',
    '[00:10.500]last line',
  ].join('\n'))

  assert.deepEqual(lyrics, [
    { time: 1.5, text: 'first line' },
    { time: 5, text: 'repeat line' },
    { time: 7.25, text: 'repeat line' },
    { time: 10.5, text: 'last line' },
  ])
})

test('normalizeLqPlaylist returns only playable tracks with consistent fields', () => {
  const playlist = normalizeLqPlaylist([
    {
      id: 1,
      name: 'Song A',
      artist: ['Singer 1', 'Singer 2'],
      pic: 'cover-a.jpg',
      url: 'audio-a.mp3',
      lrc: 'lyric-a.lrc',
    },
    {
      id: 2,
      title: 'Song B',
      author: 'Solo Singer',
      cover: 'cover-b.jpg',
      src: 'audio-b.mp3',
      lyric: '[00:01.00]hello',
    },
    {
      id: 3,
      name: 'No Audio',
      artist: 'Ghost',
    },
  ])

  assert.deepEqual(playlist, [
    {
      id: '1',
      title: 'Song A',
      artist: 'Singer 1 / Singer 2',
      cover: 'cover-a.jpg',
      src: 'audio-a.mp3',
      lyric: '',
      lrcUrl: 'lyric-a.lrc',
    },
    {
      id: '2',
      title: 'Song B',
      artist: 'Solo Singer',
      cover: 'cover-b.jpg',
      src: 'audio-b.mp3',
      lyric: '[00:01.00]hello',
      lrcUrl: '',
    },
  ])
})

test('findLqActiveLyricIndex tracks the latest line at the current time', () => {
  const lyrics = [
    { time: 1.5, text: 'first line' },
    { time: 5, text: 'repeat line' },
    { time: 7.25, text: 'repeat line later' },
  ]

  assert.equal(findLqActiveLyricIndex(lyrics, 0.6), -1)
  assert.equal(findLqActiveLyricIndex(lyrics, 1.5), 0)
  assert.equal(findLqActiveLyricIndex(lyrics, 6.8), 1)
  assert.equal(findLqActiveLyricIndex(lyrics, 7.3), 2)
})
