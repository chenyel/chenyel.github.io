const STATUS_META = {
  '了解': { key: 'aware', label: '了解', order: 1 },
  '会用': { key: 'usable', label: '会用', order: 2 },
  '做过项目': { key: 'project', label: '做过项目', order: 3 },
  '能输出': { key: 'teaching', label: '能输出', order: 4 }
};

const DEFAULT_PAGE = {
  title: '技术星图',
  eyebrow: 'Tech Constellation',
  summary: '把正在推进的技术主线整理成一张可以长期公开展示的成长星图。',
  identity: 'Java 后端 / 大模型 / Agent'
};

const DEFAULT_MINI_ENTRY = {
  title: '技术星图',
  summary: '看看最近点亮了哪些节点'
};

const safeArray = value => Array.isArray(value) ? value.filter(Boolean) : [];

const compareDateDesc = (left, right) => String(right || '').localeCompare(String(left || ''));

const createInitials = name => {
  const text = String(name || '').trim();
  if (!text) return 'NA';

  const ascii = text.replace(/[^a-zA-Z0-9]+/g, ' ').trim();
  if (ascii) {
    return ascii
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join('');
  }

  return text.slice(0, 2);
};

function buildTechConstellationData(theme, urlFor) {
  const config = (theme && theme.lq_tech_map) || {};
  const page = { ...DEFAULT_PAGE, ...(config.page || {}) };
  const miniEntry = { ...DEFAULT_MINI_ENTRY, ...(config.mini_entry || {}) };

  const branchMap = new Map();
  safeArray(config.branches).forEach((branch, index) => {
    if (!branch || !branch.id) return;
    branchMap.set(branch.id, {
      id: branch.id,
      name: branch.name || branch.id,
      subtitle: branch.subtitle || '',
      description: branch.description || '',
      icon: branch.icon || '',
      color: branch.color || '#7dd3fc',
      corePosition: branch.core_position || { x: 0, y: 0, z: 0 },
      order: index,
      nodes: []
    });
  });

  const nodes = safeArray(config.nodes)
    .map(node => {
      const branch = branchMap.get(node.branch);
      if (!node || !node.id || !branch) return null;

      const status = STATUS_META[node.status] || STATUS_META['了解'];
      const record = {
        id: node.id,
        name: node.name || node.id,
        branch: branch.id,
        branchName: branch.name,
        icon: node.icon || '',
        initials: createInitials(node.name || node.id),
        status: status.label,
        statusKey: status.key,
        statusOrder: status.order,
        shortNote: node.short_note || '',
        detail: node.detail || '',
        tags: safeArray(node.tags),
        updatedAt: node.updated_at || '',
        articles: safeArray(node.articles).map(article => ({
          title: article.title || '相关文章',
          url: urlFor(article.url || '/')
        })),
        position: node.position || { x: 0, y: 0, z: 0 }
      };

      branch.nodes.push(record);
      return record;
    })
    .filter(Boolean)
    .sort((left, right) => {
      if (right.statusOrder !== left.statusOrder) return right.statusOrder - left.statusOrder;
      return compareDateDesc(left.updatedAt, right.updatedAt);
    });

  const branches = Array.from(branchMap.values())
    .filter(branch => branch.nodes.length > 0)
    .sort((left, right) => left.order - right.order);

  const latestNode = [...nodes].sort((left, right) => compareDateDesc(left.updatedAt, right.updatedAt))[0] || null;
  const defaultNode = [...nodes].sort((left, right) => {
    if (right.statusOrder !== left.statusOrder) return right.statusOrder - left.statusOrder;
    return compareDateDesc(left.updatedAt, right.updatedAt);
  })[0] || null;

  return {
    page,
    miniEntry,
    branches,
    nodes,
    latestNode,
    defaultNodeId: defaultNode ? defaultNode.id : '',
    stats: {
      totalNodes: nodes.length,
      litNodes: nodes.filter(node => node.statusOrder >= 1).length,
      branchCount: branches.length
    }
  };
}

module.exports = {
  buildTechConstellationData
};
