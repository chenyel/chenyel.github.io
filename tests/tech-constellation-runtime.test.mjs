import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const runtimePath = new URL('../themes/argon/source/lq-tech-constellation.js', import.meta.url)

test('tech constellation runtime exposes mount helper, selection logic, reduced-motion handling, and fallback guards', async () => {
  const js = await readFile(runtimePath, 'utf8')

  const requiredSnippets = [
    'function parseTechConstellationData',
    'function selectTechNode',
    'function createThreeScene',
    'function createNodeOverlay',
    'function updateOverlayPositions',
    'function createConstellationLayout',
    'function createTechMapState',
    'function getVisibleNodeIds',
    'function applyTechMapFilters',
    'function applyViewMode',
    'function renderEditorForm',
    'function bindTechMapEditor',
    'function bindTechMapFilters',
    'function bindStageControls',
    'function mountTechConstellation',
    'function prefersReducedMotion',
    'window.initLqTechConstellation = initLqTechConstellation',
    'data-tech-map-enhanced',
    'matchMedia(\'(prefers-reduced-motion: reduce)\')',
    'if (!window.THREE)',
    'new window.THREE.Scene()',
    'new window.THREE.PerspectiveCamera',
    'projected.project(camera)',
    'node.button.offsetWidth',
    "icon.classList.add('is-fallback')",
    'function createGlowTexture',
    'new window.THREE.SpriteMaterial',
    'new window.THREE.Points(',
    'new window.THREE.TorusGeometry',
    'Math.sin(',
    "stage.addEventListener('pointerdown'",
    "stage.addEventListener('wheel'",
    "stage.addEventListener('dblclick'",
    'camera.lookAt(',
    "root.querySelector('[data-tech-search]')",
    "root.querySelectorAll('[data-tech-branch-filter]')",
    "root.querySelectorAll('[data-tech-list-node]')",
    'showOpenFilePicker',
    "root.querySelectorAll('[data-tech-view-mode]')",
  ]

  for (const snippet of requiredSnippets) {
    assert.ok(js.includes(snippet), `Expected lq-tech-constellation.js to include: ${snippet}`)
  }
})
