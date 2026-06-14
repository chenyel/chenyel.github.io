import test from 'node:test'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { buildTechConstellationData } = require('../themes/argon/scripts/tech-constellation-data.js')

const theme = {
  lq_tech_map: {
    enabled: true,
    page: {
      title: '技术星图',
      eyebrow: 'Tech Constellation',
      summary: '把 Java 后端、大模型和 Agent 的学习轨迹整理成一张可探索的公开成长图。',
      identity: 'Java 后端 / 大模型 / Agent',
    },
    mini_entry: {
      title: '技术星图',
      summary: '看看最近点亮了哪些节点',
    },
    branches: [
      { id: 'java-backend', name: 'Java后端', color: '#5ad1ff', core_position: { x: -22, y: 6, z: -14 } },
      { id: 'llm', name: '大模型', color: '#9c7bff', core_position: { x: 0, y: 14, z: -6 } },
      { id: 'agent', name: 'Agent', color: '#59f2c1', core_position: { x: 22, y: -2, z: -12 } },
    ],
    nodes: [
      {
        id: 'spring-boot',
        name: 'Spring Boot',
        branch: 'java-backend',
        status: '做过项目',
        icon: 'https://cdn.simpleicons.org/springboot/6DB33F',
        short_note: '项目主力框架',
        detail: '做过接口开发、参数校验、异常处理和基础分层。',
        tags: ['后端', '框架'],
        updated_at: '2026-06-10',
        position: { x: -12, y: 14, z: 10 },
        articles: [{ title: 'Spring 入门笔记', url: '/archives' }],
      },
      {
        id: 'rag',
        name: 'RAG',
        branch: 'llm',
        status: '会用',
        icon: 'https://cdn.simpleicons.org/openai/ffffff',
        short_note: '开始搭检索增强链路',
        detail: '已经理解基础链路，正在把向量检索和问答流程串起来。',
        tags: ['LLM', '检索'],
        updated_at: '2026-06-11',
        position: { x: 2, y: 22, z: 6 },
      },
      {
        id: 'tool-calling',
        name: 'Tool Calling',
        branch: 'agent',
        status: '了解',
        icon: 'https://cdn.simpleicons.org/python/3776AB',
        short_note: '刚开始梳理调用模式',
        detail: '正在建立对工具选择、入参与结果回写的整体认知。',
        tags: ['Agent'],
        updated_at: '2026-06-12',
        position: { x: 24, y: 8, z: 8 },
      },
    ],
  },
}

const urlFor = input => input

test('tech constellation helper normalizes branches, nodes, stats, and latest update', () => {
  const result = buildTechConstellationData(theme, urlFor)

  assert.equal(result.page.title, '技术星图')
  assert.equal(result.branches.length, 3)
  assert.equal(result.nodes.length, 3)
  assert.equal(result.stats.totalNodes, 3)
  assert.equal(result.stats.litNodes, 3)
  assert.equal(result.stats.branchCount, 3)
  assert.equal(result.latestNode.id, 'tool-calling')
  assert.equal(result.defaultNodeId, 'spring-boot')
  assert.equal(result.branches[0].nodes.length > 0, true)
  assert.equal(result.nodes[0].position.x !== undefined, true)
  assert.equal(result.nodes[0].statusKey, 'project')
  assert.equal(result.nodes[2].statusKey, 'aware')
})
