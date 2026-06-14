import { closeSync, existsSync, mkdirSync, openSync, unlinkSync } from 'node:fs'
import path from 'node:path'

const rootDir = process.cwd()
const tempDir = path.join(rootDir, '.tmp')
const lockPath = path.join(tempDir, 'music-page-build.lock')

const sleep = milliseconds => {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds)
}

export const withSiteBuildLock = callback => {
  mkdirSync(tempDir, { recursive: true })

  let handle = null
  while (handle === null) {
    try {
      handle = openSync(lockPath, 'wx')
    } catch (error) {
      if (error && error.code === 'EEXIST') {
        sleep(100)
        continue
      }
      throw error
    }
  }

  try {
    return callback()
  } finally {
    closeSync(handle)
    if (existsSync(lockPath)) {
      unlinkSync(lockPath)
    }
  }
}
