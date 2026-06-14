const { stripHTML, unescapeHTML } = require('hexo-util');

const BRANCH_DEFINITIONS = [
  {
    id: 'frontend',
    label: 'Interface Bloom',
    summary: 'UI frameworks, rendering ideas, and interaction craft.',
    hue: 188,
    keywords: ['frontend', 'front-end', 'react', 'vue', 'next', 'nuxt', 'vite', 'svelte', 'angular', 'html', 'css', 'tailwind', 'canvas', 'webgl', 'ui', 'ux', '前端', '页面', '交互']
  },
  {
    id: 'backend',
    label: 'Service Spine',
    summary: 'APIs, services, and the logic running behind the glass.',
    hue: 209,
    keywords: ['backend', 'back-end', 'server', 'api', 'node', 'express', 'koa', 'nest', 'spring', 'django', 'flask', 'fastapi', 'gin', 'laravel', 'php', '后端', '服务端', '接口']
  },
  {
    id: 'data',
    label: 'Data Vein',
    summary: 'Persistence, queries, caches, and durable knowledge.',
    hue: 153,
    keywords: ['mysql', 'postgres', 'postgresql', 'redis', 'mongodb', 'sqlite', 'sql', 'database', 'db', 'supabase', 'prisma', 'orm', '数据库', '数据']
  },
  {
    id: 'algorithm',
    label: 'Algorithm Core',
    summary: 'Problem solving, contest thinking, and computational structure.',
    hue: 34,
    keywords: ['algorithm', 'algorithms', 'leetcode', 'acm', 'oj', 'csp', 'ccf', 'graph', 'dp', 'dfs', 'bfs', 'math', '算法', '数据结构', '图论', '动态规划', '机试']
  },
  {
    id: 'engineering',
    label: 'Ops Orbit',
    summary: 'Toolchains, systems, deployment, and workflow hardening.',
    hue: 275,
    keywords: ['linux', 'docker', 'k8s', 'kubernetes', 'nginx', 'ci', 'cd', 'devops', 'rollup', 'webpack', 'babel', 'testing', 'test', 'tooling', 'build', '运维', '工程化']
  },
  {
    id: 'ai',
    label: 'AI Pulse',
    summary: 'Models, prompts, agents, and machine-assisted workflows.',
    hue: 317,
    keywords: ['ai', 'llm', 'gpt', 'openai', 'rag', 'agent', 'prompt', 'langchain', 'embedding', 'transformer', 'ml', 'machine learning', 'deep learning', '人工智能', '机器学习', '深度学习']
  },
  {
    id: 'language',
    label: 'Language Mesh',
    summary: 'Programming languages, syntax choices, and systems thinking.',
    hue: 234,
    keywords: ['c++', 'cpp', 'c#', 'java', 'python', 'rust', 'golang', 'go', 'javascript', 'typescript', 'swift', 'kotlin', '编程', '代码', '语言']
  },
  {
    id: 'records',
    label: 'Field Notes',
    summary: 'Study logs, writing traces, and the human side of growth.',
    hue: 12,
    keywords: ['markdown', 'note', 'notes', 'blog', 'writing', 'study', '考研', '复试', '学习', '笔记', '写作', '碎碎念', '生活', '随笔']
  },
  {
    id: 'explore',
    label: 'Exploration Deck',
    summary: 'Everything still branching out into its eventual home.',
    hue: 86,
    keywords: []
  }
];

const normalizeText = value => String(value || '').trim().toLowerCase();

const slugify = value => normalizeText(value)
  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'tag-node';

const unique = values => Array.from(new Set(values.filter(Boolean)));

const createExcerpt = content => {
  const text = stripHTML(unescapeHTML(content || '')).replace(/\s+/g, ' ').trim();
  if (!text) {
    return 'Open this tag to browse the connected articles.';
  }
  return text.length > 110 ? `${text.slice(0, 110)}...` : text;
};

const getPostCategories = post => {
  const categories = [];
  if (!post || !post.categories || typeof post.categories.each !== 'function') {
    return categories;
  }
  post.categories.each(category => {
    if (category && category.name) {
      categories.push(category.name);
    }
  });
  return unique(categories);
};

const collectPosts = tag => {
  const posts = [];
  if (!tag || !tag.posts || typeof tag.posts.sort !== 'function') {
    return posts;
  }

  tag.posts.sort('date', -1).each(post => {
    posts.push(post);
  });

  return posts;
};

const getTagKeywords = tagRecord => {
  return normalizeText([
    tagRecord.name,
    tagRecord.categories.join(' '),
    tagRecord.posts.map(post => post.title).join(' ')
  ].join(' '));
};

const scoreBranch = (branch, text) => {
  return branch.keywords.reduce((score, keyword) => {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) {
      return score;
    }
    if (text.includes(normalizedKeyword)) {
      return score + Math.max(2, Math.min(normalizedKeyword.length, 6));
    }
    return score;
  }, 0);
};

const chooseBranch = tagRecord => {
  const keywordText = getTagKeywords(tagRecord);
  let bestBranch = BRANCH_DEFINITIONS[BRANCH_DEFINITIONS.length - 1];
  let bestScore = 0;

  BRANCH_DEFINITIONS.forEach(branch => {
    const score = scoreBranch(branch, keywordText);
    if (score > bestScore) {
      bestBranch = branch;
      bestScore = score;
    }
  });

  return bestBranch;
};

const buildTagRecord = (tag, urlFor, maxCount) => {
  const posts = collectPosts(tag);
  const categories = unique(posts.flatMap(getPostCategories));
  const count = Number(tag.length) || posts.length || 1;
  const density = maxCount > 0 ? count / maxCount : 0.5;
  const size = Math.round(44 + density * 28);
  const emphasis = Number((0.45 + density * 0.55).toFixed(3));

  return {
    name: tag.name,
    slug: slugify(tag.name),
    count,
    url: urlFor(tag.path),
    categories,
    size,
    emphasis,
    posts: posts.slice(0, 3).map(post => ({
      title: post.title,
      url: urlFor(post.path),
      date: post.date && typeof post.date.format === 'function' ? post.date.format('YYYY-MM-DD') : '',
      excerpt: createExcerpt(post.excerpt || post.content)
    }))
  };
};

const sortBranches = branches => {
  return branches
    .filter(branch => branch.tags.length > 0)
    .sort((left, right) => {
      if (right.weight !== left.weight) {
        return right.weight - left.weight;
      }
      return left.order - right.order;
    })
    .map((branch, index) => ({
      ...branch,
      side: index % 2 === 0 ? 'left' : 'right'
    }));
};

function buildTagTreeData(site, urlFor) {
  const tags = [];
  if (!site || !site.tags || typeof site.tags.each !== 'function') {
    return {
      totalTags: 0,
      totalTaggedPosts: 0,
      totalBranches: 0,
      featuredTagSlug: '',
      branches: [],
      tags: []
    };
  }

  site.tags.each(tag => {
    if (tag && tag.name) {
      tags.push(tag);
    }
  });

  const maxCount = tags.reduce((maximum, tag) => Math.max(maximum, Number(tag.length) || 0), 0);
  const tagRecords = tags
    .map(tag => buildTagRecord(tag, urlFor, maxCount))
    .sort((left, right) => {
      if (right.count !== left.count) {
        return right.count - left.count;
      }
      return left.name.localeCompare(right.name);
    });

  const branchMap = new Map(
    BRANCH_DEFINITIONS.map((branch, order) => [
      branch.id,
      {
        id: branch.id,
        label: branch.label,
        summary: branch.summary,
        hue: branch.hue,
        order,
        tags: [],
        weight: 0
      }
    ])
  );

  tagRecords.forEach(tagRecord => {
    const branch = chooseBranch(tagRecord);
    const bucket = branchMap.get(branch.id);
    bucket.tags.push({
      ...tagRecord,
      branchId: bucket.id,
      branchLabel: bucket.label,
      hue: bucket.hue
    });
    bucket.weight += tagRecord.count;
  });

  const branches = sortBranches(Array.from(branchMap.values()));
  const orderedTags = branches.flatMap(branch => branch.tags);

  return {
    totalTags: orderedTags.length,
    totalTaggedPosts: orderedTags.reduce((total, tag) => total + tag.count, 0),
    totalBranches: branches.length,
    featuredTagSlug: orderedTags[0] ? orderedTags[0].slug : '',
    branches,
    tags: orderedTags
  };
}

module.exports = {
  buildTagTreeData,
  slugify
};
