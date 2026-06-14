(function () {
  var STATUS_META = {
    '了解': { key: 'aware', order: 1 },
    '会用': { key: 'usable', order: 2 },
    '做过项目': { key: 'project', order: 3 },
    '能输出': { key: 'teaching', order: 4 }
  };

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function parseTechConstellationData(root) {
    const node = root.querySelector('.lq-tech-constellation-data');
    if (!node) return null;

    try {
      return JSON.parse(node.textContent || '{}');
    } catch (error) {
      return null;
    }
  }

  function setActiveNode(root, nodeId) {
    root.querySelectorAll('[data-tech-node]').forEach(button => {
      const isActive = button.dataset.techNode === nodeId;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    root.querySelectorAll('[data-tech-list-node]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.techListNode === nodeId);
    });

    root.querySelectorAll('[data-tech-panel]').forEach(panel => {
      panel.classList.toggle('is-active', panel.dataset.techPanel === nodeId);
    });
  }

  function selectTechNode(root, nodeId) {
    if (!nodeId) return;
    root.dataset.activeNode = nodeId;
    if (root.__techMapState) {
      root.__techMapState.activeNodeId = nodeId;
    }
    setActiveNode(root, nodeId);
    if (root.__techMapPayload && root.__techMapState) {
      renderEditorForm(root, root.__techMapPayload, root.__techMapState);
    }
  }

  function createTechMapState(payload) {
    return {
      viewMode: 'overview',
      activeBranch: 'all',
      query: '',
      activeNodeId: payload && payload.defaultNodeId ? payload.defaultNodeId : '',
      visibleNodeIds: new Set((payload && payload.nodes ? payload.nodes : []).map(node => node.id)),
      fileHandle: null,
      unsaved: false
    };
  }

  function findNodeById(payload, nodeId) {
    return (payload.nodes || []).find(node => node.id === nodeId) || null;
  }

  function syncNodeStatusMeta(node) {
    var meta = STATUS_META[node.status] || STATUS_META['了解'];
    node.statusKey = meta.key;
    node.statusOrder = meta.order;
  }

  function updateButtonBadgeClass(element, statusKey) {
    if (!element) return;
    element.className = element.className
      .replace(/lq-tech-node__badge--[a-z]+/g, '')
      .replace(/lq-tech-detail-panel__status--[a-z]+/g, '')
      .trim();
    if (element.classList.contains('lq-tech-node__badge')) {
      element.classList.add('lq-tech-node__badge--' + statusKey);
    }
    if (element.classList.contains('lq-tech-detail-panel__status')) {
      element.classList.add('lq-tech-detail-panel__status--' + statusKey);
    }
  }

  function updateNodePresentation(root, node) {
    root.querySelectorAll('[data-tech-node="' + node.id + '"]').forEach(button => {
      var note = button.querySelector('.lq-tech-node__note');
      var badge = button.querySelector('.lq-tech-node__badge');
      if (note) note.textContent = node.shortNote || '';
      if (badge) {
        badge.textContent = node.status;
        updateButtonBadgeClass(badge, node.statusKey);
      }
    });

    root.querySelectorAll('[data-tech-panel="' + node.id + '"]').forEach(panel => {
      var status = panel.querySelector('.lq-tech-detail-panel__status');
      var note = panel.querySelector('.lq-tech-detail-panel__note');
      var copy = panel.querySelector('.lq-tech-detail-panel__copy');
      var updated = panel.querySelector('.lq-tech-detail-panel__updated');
      var chips = panel.querySelector('.lq-tech-detail-panel__chips');

      if (status) {
        status.textContent = node.status;
        updateButtonBadgeClass(status, node.statusKey);
      }
      if (note) note.textContent = node.shortNote || '';
      if (copy) copy.textContent = node.detail || '';
      if (updated) updated.textContent = '最近更新：' + (node.updatedAt || '--');

      if (chips) {
        chips.innerHTML = (node.tags || []).map(tag => '<span class="lq-tech-detail-panel__chip">' + tag + '</span>').join('');
      }
    });

    root.querySelectorAll('[data-tech-list-node="' + node.id + '"]').forEach(button => {
      var meta = button.querySelector('.lq-tech-node-list__meta');
      if (meta) {
        meta.textContent = node.branchName + ' · ' + node.status;
      }
    });
  }

  function renderEditorForm(root, payload, state) {
    const editor = root.querySelector('[data-tech-editor-form]');
    if (!editor) return;

    const node = findNodeById(payload, state.activeNodeId) || payload.nodes[0] || null;
    const nameInput = root.querySelector('[data-tech-edit-name]');
    const statusInput = root.querySelector('[data-tech-edit-status]');
    const shortNoteInput = root.querySelector('[data-tech-edit-short-note]');
    const detailInput = root.querySelector('[data-tech-edit-detail]');
    const tagsInput = root.querySelector('[data-tech-edit-tags]');

    if (!node) {
      if (nameInput) nameInput.value = '';
      if (statusInput) statusInput.value = '了解';
      if (shortNoteInput) shortNoteInput.value = '';
      if (detailInput) detailInput.value = '';
      if (tagsInput) tagsInput.value = '';
      return;
    }

    if (nameInput) nameInput.value = node.name || '';
    if (statusInput) statusInput.value = node.status || '了解';
    if (shortNoteInput) shortNoteInput.value = node.shortNote || '';
    if (detailInput) detailInput.value = node.detail || '';
    if (tagsInput) tagsInput.value = (node.tags || []).join(', ');
  }

  function updateEditorStatus(root, text, tone) {
    const statusNode = root.querySelector('[data-tech-editor-status]');
    if (!statusNode) return;
    statusNode.textContent = text;
    statusNode.dataset.tone = tone || 'info';
  }

  function applyViewMode(root, state) {
    root.dataset.techViewMode = state.viewMode;
    root.querySelectorAll('[data-tech-view-mode]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.techViewMode === state.viewMode);
    });

    const detailStack = root.querySelector('[data-tech-detail-stack]');
    const editor = root.querySelector('[data-tech-editor-form]');
    const stage = root.querySelector('.lq-tech-constellation__stage');
    const hint = root.querySelector('.lq-tech-constellation__stage-hint');

    if (detailStack) {
      detailStack.hidden = state.viewMode === 'edit';
    }
    if (editor) {
      editor.hidden = state.viewMode !== 'edit';
    }
    if (hint) {
      hint.hidden = state.viewMode !== 'immersive';
    }
    if (stage) {
      stage.classList.toggle('is-overview', state.viewMode === 'overview');
      stage.classList.toggle('is-immersive', state.viewMode === 'immersive');
      stage.classList.toggle('is-editing', state.viewMode === 'edit');
    }
  }

  function getVisibleNodeIds(payload, state) {
    const query = String(state.query || '').trim().toLowerCase();
    const visibleNodeIds = new Set();

    (payload.nodes || []).forEach(node => {
      const matchesBranch = state.activeBranch === 'all' || node.branch === state.activeBranch;
      const haystack = [
        node.name,
        node.branchName,
        node.shortNote,
        node.detail,
        ...(Array.isArray(node.tags) ? node.tags : [])
      ].join(' ').toLowerCase();
      const matchesQuery = !query || haystack.includes(query);

      if (matchesBranch && matchesQuery) {
        visibleNodeIds.add(node.id);
      }
    });

    return visibleNodeIds;
  }

  function applyTechMapFilters(root, payload, state, three) {
    const visibleNodeIds = getVisibleNodeIds(payload, state);
    state.visibleNodeIds = visibleNodeIds;

    const fallbackButtons = root.querySelectorAll('[data-tech-map-fallback] [data-tech-node]');
    const overlayButtons = root.querySelectorAll('[data-tech-map-overlay] [data-tech-node]');
    const listButtons = root.querySelectorAll('[data-tech-list-node]');
    const panels = root.querySelectorAll('[data-tech-panel]');
    const branchSections = root.querySelectorAll('[data-tech-map-branch]');
    const visibleCount = root.querySelector('[data-tech-visible-count]');
    const emptyState = root.querySelector('[data-tech-empty-state]');

    branchSections.forEach(section => {
      const branchId = section.dataset.techMapBranch;
      const hasVisibleChildren = Array.from(visibleNodeIds).some(nodeId => {
        const source = payload.nodes.find(node => node.id === nodeId);
        return source && source.branch === branchId;
      });
      section.hidden = !hasVisibleChildren;
    });

    fallbackButtons.forEach(button => {
      const isVisible = visibleNodeIds.has(button.dataset.techNode);
      button.hidden = !isVisible;
      button.classList.toggle('is-muted', !isVisible);
    });

    overlayButtons.forEach(button => {
      const isVisible = visibleNodeIds.has(button.dataset.techNode);
      button.hidden = !isVisible;
      button.classList.toggle('is-muted', !isVisible);
    });

    listButtons.forEach(button => {
      const isVisible = visibleNodeIds.has(button.dataset.techListNode);
      button.hidden = !isVisible;
      button.classList.toggle('is-muted', !isVisible);
    });

    if (visibleCount) {
      visibleCount.textContent = visibleNodeIds.size + ' / ' + payload.nodes.length + ' 节点';
    }

    const nextActiveNodeId = visibleNodeIds.has(state.activeNodeId)
      ? state.activeNodeId
      : (payload.nodes.find(node => visibleNodeIds.has(node.id)) || {}).id || '';

    if (nextActiveNodeId) {
      selectTechNode(root, nextActiveNodeId);
    } else {
      root.dataset.activeNode = '';
      setActiveNode(root, '');
    }

    panels.forEach(panel => {
      const shouldShow = panel.dataset.techPanel === nextActiveNodeId && visibleNodeIds.has(panel.dataset.techPanel);
      panel.classList.toggle('is-active', shouldShow);
      panel.hidden = !shouldShow;
    });

    if (emptyState) {
      emptyState.hidden = visibleNodeIds.size > 0;
    }

    root.querySelectorAll('[data-tech-branch-filter]').forEach(button => {
      button.classList.toggle('is-active', button.dataset.techBranchFilter === state.activeBranch);
    });

    if (three && three.nodeObjects && three.lineObjects) {
      payload.nodes.forEach(node => {
        const isVisible = visibleNodeIds.has(node.id);
        const star = three.nodeObjects.get(node.id);
        if (star) {
          star.visible = isVisible;
        }

        const line = three.lineObjects.get(node.id);
        if (line) {
          line.visible = isVisible;
        }
      });

      if (typeof three.requestRender === 'function') {
        three.requestRender();
      }
    }
  }

  function bindTechMapFilters(root, payload, state, three) {
    root.__techMapFilterContext = { payload, state, three };
    if (root.dataset.techMapFiltersBound === 'true') {
      return;
    }
    root.dataset.techMapFiltersBound = 'true';

    const searchInput = root.querySelector('[data-tech-search]');
    const branchButtons = root.querySelectorAll('[data-tech-branch-filter]');
    const listButtons = root.querySelectorAll('[data-tech-list-node]');
    const resetButton = root.querySelector('[data-tech-reset-view]');

    if (searchInput) {
      searchInput.addEventListener('input', event => {
        const context = root.__techMapFilterContext;
        context.state.query = event.target.value || '';
        applyTechMapFilters(root, context.payload, context.state, context.three);
      });

      searchInput.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          searchInput.value = '';
          const context = root.__techMapFilterContext;
          context.state.query = '';
          applyTechMapFilters(root, context.payload, context.state, context.three);
        }
      });
    }

    branchButtons.forEach(button => {
      button.addEventListener('click', () => {
        const context = root.__techMapFilterContext;
        context.state.activeBranch = button.dataset.techBranchFilter || 'all';
        applyTechMapFilters(root, context.payload, context.state, context.three);
      });
    });

    listButtons.forEach(button => {
      button.addEventListener('click', () => {
        selectTechNode(root, button.dataset.techListNode);
      });
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        const context = root.__techMapFilterContext;
        context.state.activeBranch = 'all';
        context.state.query = '';
        if (searchInput) {
          searchInput.value = '';
        }
        applyTechMapFilters(root, context.payload, context.state, context.three);
        if (root.__techMapResetCamera) {
          root.__techMapResetCamera();
        }
      });
    }
  }

  function yamlQuote(value) {
    return "'" + String(value == null ? '' : value).replace(/'/g, "''") + "'";
  }

  function serializeInlineList(values) {
    const list = Array.isArray(values) ? values : [];
    return '[' + list.map(item => yamlQuote(item)).join(', ') + ']';
  }

  function serializeArticles(articles, indent) {
    const list = Array.isArray(articles) ? articles : [];
    if (!list.length) return indent + 'articles: []';

    return [indent + 'articles:']
      .concat(list.map(article => [
        indent + '  - title: ' + yamlQuote(article.title || '相关文章'),
        indent + '    url: ' + yamlQuote(article.url || '/')
      ].join('\n')))
      .join('\n');
  }

  function serializeNodeYaml(node) {
    const indent = '    ';
    const position = node.position || { x: 0, y: 0, z: 0 };
    const lines = [
      indent + '- id: ' + yamlQuote(node.id),
      indent + '  name: ' + yamlQuote(node.name || node.id),
      indent + '  branch: ' + yamlQuote(node.branch),
      indent + '  status: ' + yamlQuote(node.status || '了解'),
      indent + '  icon: ' + yamlQuote(node.icon || ''),
      indent + '  short_note: ' + yamlQuote(node.shortNote || ''),
      indent + '  detail: ' + yamlQuote(node.detail || ''),
      indent + '  tags: ' + serializeInlineList(node.tags || []),
      indent + '  updated_at: ' + yamlQuote(node.updatedAt || ''),
      indent + '  position: { x: ' + position.x + ', y: ' + position.y + ', z: ' + position.z + ' }'
    ];

    if (Array.isArray(node.articles) && node.articles.length) {
      lines.push(serializeArticles(node.articles, indent + '  '));
    }

    return lines.join('\n');
  }

  function buildTechMapNodesYaml(payload) {
    return (payload.nodes || []).map(serializeNodeYaml).join('\n');
  }

  function replaceTechMapNodesBlock(sourceText, payload) {
    const replacement = '\n  nodes:\n' + buildTechMapNodesYaml(payload) + '\n';
    const pattern = /(\n  nodes:\n)([\s\S]*?)(\nlq_rightbar:)/;
    if (!pattern.test(sourceText)) {
      throw new Error('没有在 argon.yml 里找到 lq_tech_map.nodes 区块');
    }

    return sourceText.replace(pattern, function (_, __prefix, _body, suffix) {
      return replacement + suffix;
    });
  }

  async function pickTechMapConfigFile() {
    if (!window.showOpenFilePicker) {
      throw new Error('当前浏览器不支持本地文件编辑，请换用 Chromium 内核浏览器');
    }

    const [fileHandle] = await window.showOpenFilePicker({
      multiple: false,
      excludeAcceptAllOption: false,
      suggestedName: 'argon.yml'
    });

    return fileHandle || null;
  }

  async function saveTechMapConfig(fileHandle, payload) {
    if (!fileHandle) {
      throw new Error('还没有绑定配置文件');
    }

    const file = await fileHandle.getFile();
    const sourceText = await file.text();
    const nextText = replaceTechMapNodesBlock(sourceText, payload);
    const writable = await fileHandle.createWritable();
    await writable.write(nextText);
    await writable.close();
  }

  function bindTechMapEditor(root, payload, state) {
    const modeButtons = root.querySelectorAll('[data-tech-view-mode]');
    const bindFileButton = root.querySelector('[data-tech-bind-file]');
    const saveButton = root.querySelector('[data-tech-save-node]');
    const cancelButton = root.querySelector('[data-tech-cancel-edit]');
    const statusInput = root.querySelector('[data-tech-edit-status]');
    const shortNoteInput = root.querySelector('[data-tech-edit-short-note]');
    const detailInput = root.querySelector('[data-tech-edit-detail]');
    const tagsInput = root.querySelector('[data-tech-edit-tags]');

    modeButtons.forEach(button => {
      button.addEventListener('click', () => {
        state.viewMode = button.dataset.techViewMode || 'overview';
        applyViewMode(root, state);
        renderEditorForm(root, payload, state);
      });
    });

    if (bindFileButton) {
      bindFileButton.addEventListener('click', async () => {
        try {
          state.fileHandle = await pickTechMapConfigFile();
          updateEditorStatus(root, '已绑定配置文件，可以直接保存到 argon.yml。', 'success');
        } catch (error) {
          updateEditorStatus(root, error.message || '绑定配置文件失败。', 'error');
        }
      });
    }

    if (saveButton) {
      saveButton.addEventListener('click', async () => {
        const node = findNodeById(payload, state.activeNodeId);
        if (!node) {
          updateEditorStatus(root, '当前没有选中可编辑节点。', 'error');
          return;
        }

        node.status = statusInput ? statusInput.value : node.status;
        node.shortNote = shortNoteInput ? shortNoteInput.value.trim() : node.shortNote;
        node.detail = detailInput ? detailInput.value.trim() : node.detail;
        node.tags = tagsInput
          ? tagsInput.value.split(',').map(tag => tag.trim()).filter(Boolean)
          : node.tags;
        node.updatedAt = new Date().toISOString().slice(0, 10);
        syncNodeStatusMeta(node);
        state.unsaved = false;

        try {
          await saveTechMapConfig(state.fileHandle, payload);
          updateEditorStatus(root, '已经保存到 argon.yml。Hexo 本地预览刷新后会看到同步结果。', 'success');
        } catch (error) {
          state.unsaved = true;
          updateEditorStatus(root, (error && error.message) || '保存失败。', 'error');
        }

        selectTechNode(root, node.id);
        updateNodePresentation(root, node);
        renderEditorForm(root, payload, state);
        applyTechMapFilters(root, payload, state, root.__techMapFilterContext ? root.__techMapFilterContext.three : null);
      });
    }

    if (cancelButton) {
      cancelButton.addEventListener('click', () => {
        renderEditorForm(root, payload, state);
        updateEditorStatus(root, '已取消本次修改。', 'info');
      });
    }
  }

  function createNodeOverlay(root, nodes) {
    const overlay = root.querySelector('[data-tech-map-overlay]');
    if (!overlay) return [];

    overlay.innerHTML = '';

    return nodes.map(node => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'lq-tech-node lq-tech-node--floating';
      button.dataset.techNode = node.id;
      button.title = node.name;

      const icon = document.createElement('span');
      icon.className = 'lq-tech-node__icon' + (node.icon ? ' has-image' : ' is-fallback');
      if (node.icon) {
        const image = document.createElement('img');
        image.src = node.icon;
        image.alt = node.name;
        image.loading = 'lazy';
        image.addEventListener('error', () => {
          image.hidden = true;
          icon.classList.add('is-fallback');
        });
        icon.appendChild(image);
      }

      const initials = document.createElement('span');
      initials.className = 'lq-tech-node__initials';
      initials.textContent = node.initials;
      icon.appendChild(initials);

      const meta = document.createElement('span');
      meta.className = 'lq-tech-node__meta';

      const name = document.createElement('span');
      name.className = 'lq-tech-node__name';
      name.textContent = node.name;
      meta.appendChild(name);

      if (node.shortNote) {
        const note = document.createElement('span');
        note.className = 'lq-tech-node__note';
        note.textContent = node.shortNote;
        meta.appendChild(note);
      }

      const badge = document.createElement('span');
      badge.className = 'lq-tech-node__badge lq-tech-node__badge--' + node.statusKey;
      badge.textContent = node.status;

      button.appendChild(icon);
      button.appendChild(meta);
      button.appendChild(badge);

      button.addEventListener('mouseenter', () => selectTechNode(root, node.id));
      button.addEventListener('focus', () => selectTechNode(root, node.id));
      button.addEventListener('click', () => selectTechNode(root, node.id));
      overlay.appendChild(button);

      return {
        button,
        vector: new window.THREE.Vector3(node.layoutPosition.x, node.layoutPosition.y, node.layoutPosition.z),
        nodeId: node.id
      };
    });
  }

  function resolveOrbitSlot(index) {
    let remaining = index;
    let ringIndex = 0;
    let capacity = 4;

    while (remaining >= capacity) {
      remaining -= capacity;
      ringIndex += 1;
      capacity += 3;
    }

    return {
      ringIndex,
      slotIndex: remaining,
      capacity
    };
  }

  function createConstellationLayout(payload) {
    const branches = (payload.branches || []).map((branch, branchIndex) => ({
      ...branch,
      layoutOrder: branchIndex,
      corePosition: branch.corePosition || { x: 0, y: 0, z: 0 }
    }));
    const center = branches.length
      ? branches.reduce((accumulator, branch) => {
          accumulator.x += branch.corePosition.x;
          accumulator.y += branch.corePosition.y;
          accumulator.z += branch.corePosition.z;
          return accumulator;
        }, { x: 0, y: 0, z: 0 })
      : { x: 0, y: 0, z: 0 };

    if (branches.length) {
      center.x /= branches.length;
      center.y /= branches.length;
      center.z /= branches.length;
    }

    const branchLookup = new Map(branches.map(branch => [branch.id, branch]));
    const layoutNodes = [];
    let furthestDistance = 24;

    branches.forEach((branch, branchIndex) => {
      const branchNodes = (payload.nodes || []).filter(node => node.branch === branch.id);
      const core = branch.corePosition;
      const outwardAngle = Math.atan2(core.y - center.y, core.x - center.x || 0.0001);
      const total = Math.max(branchNodes.length, 1);

      branchNodes.forEach((node, nodeIndex) => {
        const slot = resolveOrbitSlot(nodeIndex);
        const spread = Math.min(Math.PI * 0.98, 1.12 + slot.ringIndex * 0.22 + Math.min(total, 10) * 0.06);
        const slotRatio = slot.capacity === 1 ? 0.5 : slot.slotIndex / Math.max(slot.capacity - 1, 1);
        const angle = outwardAngle - spread / 2 + spread * slotRatio + (slot.ringIndex % 2 === 0 ? -0.08 : 0.08);
        const radius = 10.5 + slot.ringIndex * 6.5 + (node.statusOrder || 1) * 0.45;
        const rawPosition = {
          x: core.x + Math.cos(angle) * radius,
          y: core.y + Math.sin(angle) * radius * 0.76 + Math.sin(slot.slotIndex * 1.35 + branchIndex) * 2.4,
          z: core.z + Math.cos(slot.slotIndex * 1.18 + branchIndex) * (3.4 + slot.ringIndex * 0.85)
        };
        const manualPosition = node.position || rawPosition;
        const layoutPosition = {
          x: rawPosition.x * 0.84 + manualPosition.x * 0.16,
          y: rawPosition.y * 0.84 + manualPosition.y * 0.16,
          z: rawPosition.z * 0.84 + manualPosition.z * 0.16
        };

        const distance = Math.sqrt(
          Math.pow(layoutPosition.x - center.x, 2) +
          Math.pow(layoutPosition.y - center.y, 2) +
          Math.pow(layoutPosition.z - center.z, 2)
        );
        furthestDistance = Math.max(furthestDistance, distance);

        layoutNodes.push({
          ...node,
          branch: branch.id,
          branchName: branch.name,
          layoutBranchOrder: branchIndex,
          layoutPosition
        });
      });
    });

    return {
      branches,
      branchLookup,
      center,
      nodes: layoutNodes,
      boundsRadius: furthestDistance
    };
  }

  function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.18, 'rgba(214, 239, 255, 0.95)');
    gradient.addColorStop(0.45, 'rgba(125, 206, 255, 0.42)');
    gradient.addColorStop(1, 'rgba(125, 206, 255, 0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);

    return new window.THREE.CanvasTexture(canvas);
  }

  function createStageStarfield(scene, glowTexture, boundsRadius) {
    const positions = [];
    const spread = Math.max(boundsRadius * 2.4, 96);
    const depth = Math.max(boundsRadius * 1.4, 44);
    for (let index = 0; index < 240; index += 1) {
      positions.push(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread * 0.75,
        -18 - Math.random() * depth
      );
    }

    const geometry = new window.THREE.BufferGeometry();
    geometry.setAttribute('position', new window.THREE.Float32BufferAttribute(positions, 3));

    const material = new window.THREE.PointsMaterial({
      color: 0xe8f6ff,
      map: glowTexture,
      transparent: true,
      opacity: 0.78,
      size: 0.72,
      sizeAttenuation: true,
      depthWrite: false,
      blending: window.THREE.AdditiveBlending
    });

    const points = new window.THREE.Points(geometry, material);
    scene.add(points);
    return points;
  }

  function createBranchCore(branch, glowTexture) {
    const color = new window.THREE.Color(branch.color || '#7dd3fc');
    const group = new window.THREE.Group();
    const corePosition = branch.corePosition || { x: 0, y: 0, z: 0 };
    group.position.set(corePosition.x, corePosition.y, corePosition.z);

    const core = new window.THREE.Mesh(
      new window.THREE.SphereGeometry(2.6, 28, 28),
      new window.THREE.MeshStandardMaterial({
        color: color.clone().lerp(new window.THREE.Color('#ffffff'), 0.18),
        emissive: color,
        emissiveIntensity: 1.25,
        roughness: 0.2,
        metalness: 0.08
      })
    );

    const halo = new window.THREE.Sprite(
      new window.THREE.SpriteMaterial({
        map: glowTexture,
        color,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
        blending: window.THREE.AdditiveBlending
      })
    );
    halo.scale.set(12, 12, 1);

    const ring = new window.THREE.Mesh(
      new window.THREE.TorusGeometry(4.4, 0.07, 20, 96),
      new window.THREE.MeshBasicMaterial({
        color: color.clone().lerp(new window.THREE.Color('#ffffff'), 0.22),
        transparent: true,
        opacity: 0.42
      })
    );
    ring.rotation.x = Math.PI / 2.8;

    group.add(halo);
    group.add(core);
    group.add(ring);
    group.userData = {
      twinkleOffset: Math.random() * Math.PI * 2,
      pulseRate: 0.85 + Math.random() * 0.3,
      halo,
      ring,
      baseAuraScale: 12
    };

    return group;
  }

  function createNodeStar(node, branch, glowTexture) {
    const branchColor = new window.THREE.Color((branch && branch.color) || '#7dd3fc');
    const statusScaleMap = {
      aware: 1,
      usable: 1.12,
      project: 1.24,
      teaching: 1.34
    };
    const statusGlowMap = {
      aware: 0.7,
      usable: 0.84,
      project: 1,
      teaching: 1.16
    };
    const size = statusScaleMap[node.statusKey] || 1;
    const glowScale = statusGlowMap[node.statusKey] || 0.84;
    const group = new window.THREE.Group();
    group.position.set(node.layoutPosition.x, node.layoutPosition.y, node.layoutPosition.z);

    const core = new window.THREE.Mesh(
      new window.THREE.IcosahedronGeometry(0.72 * size, 3),
      new window.THREE.MeshStandardMaterial({
        color: branchColor.clone().lerp(new window.THREE.Color('#ffffff'), 0.32),
        emissive: branchColor,
        emissiveIntensity: 1.4,
        roughness: 0.18,
        metalness: 0.04
      })
    );

    const aura = new window.THREE.Sprite(
      new window.THREE.SpriteMaterial({
        map: glowTexture,
        color: branchColor,
        transparent: true,
        opacity: 0.74,
        depthWrite: false,
        blending: window.THREE.AdditiveBlending
      })
    );
    aura.scale.set(5.8 * glowScale, 5.8 * glowScale, 1);

    group.add(aura);
    group.add(core);

    if (node.statusKey === 'project' || node.statusKey === 'teaching') {
      const ring = new window.THREE.Mesh(
        new window.THREE.TorusGeometry(1.34 * size, 0.05, 16, 72),
        new window.THREE.MeshBasicMaterial({
          color: branchColor.clone().lerp(new window.THREE.Color('#ffffff'), 0.28),
          transparent: true,
          opacity: node.statusKey === 'teaching' ? 0.48 : 0.34
        })
      );
      ring.rotation.x = Math.PI / 2.5;
      ring.rotation.y = Math.PI / 5;
      group.add(ring);
      group.userData.ring = ring;
    }

    group.userData.core = core;
    group.userData.aura = aura;
    group.userData.twinkleOffset = Math.random() * Math.PI * 2;
    group.userData.pulseRate = 1 + Math.random() * 0.35;
    group.userData.baseScale = size;
    group.userData.baseAuraScale = 5.8 * glowScale;

    return group;
  }

  function createCameraState(layout) {
    const defaultRadius = Math.max(38, Math.min(108, layout.boundsRadius * 1.92));
    const target = new window.THREE.Vector3(layout.center.x, layout.center.y + 1.8, layout.center.z - 2.6);

    return {
      target,
      radius: defaultRadius,
      theta: 0.42,
      phi: 1.26,
      minRadius: Math.max(24, layout.boundsRadius * 0.92),
      maxRadius: Math.max(72, layout.boundsRadius * 3.3),
      defaultRadius,
      defaultTheta: 0.42,
      defaultPhi: 1.26
    };
  }

  function applyCameraState(camera, cameraState) {
    const safePhi = Math.min(Math.max(cameraState.phi, 0.72), 2.18);
    const sinPhi = Math.sin(safePhi);

    camera.position.set(
      cameraState.target.x + cameraState.radius * sinPhi * Math.cos(cameraState.theta),
      cameraState.target.y + cameraState.radius * Math.cos(safePhi),
      cameraState.target.z + cameraState.radius * sinPhi * Math.sin(cameraState.theta)
    );
    camera.lookAt(cameraState.target);
  }

  function bindStageControls(stage, camera, cameraState, requestRender) {
    if (!stage) return;

    let activePointerId = null;
    let lastPointerX = 0;
    let lastPointerY = 0;

    stage.style.touchAction = 'none';

    stage.addEventListener('pointerdown', event => {
      if (event.button !== 0 || event.target.closest('.lq-tech-node')) {
        return;
      }

      activePointerId = event.pointerId;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      stage.classList.add('is-dragging');

      if (stage.setPointerCapture) {
        stage.setPointerCapture(activePointerId);
      }
    });

    stage.addEventListener('pointermove', event => {
      if (activePointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - lastPointerX;
      const deltaY = event.clientY - lastPointerY;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      cameraState.theta -= deltaX * 0.0084;
      cameraState.phi = Math.min(2.18, Math.max(0.72, cameraState.phi + deltaY * 0.0064));
      applyCameraState(camera, cameraState);
      requestRender();
    });

    const releasePointer = event => {
      if (activePointerId !== event.pointerId) {
        return;
      }

      activePointerId = null;
      stage.classList.remove('is-dragging');

      if (stage.releasePointerCapture) {
        try {
          stage.releasePointerCapture(event.pointerId);
        } catch (error) {
          // Ignore release failures from browsers that already cleared capture.
        }
      }

      requestRender();
    };

    stage.addEventListener('pointerup', releasePointer);
    stage.addEventListener('pointercancel', releasePointer);
    stage.addEventListener('wheel', event => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 1.1 : 0.9;
      cameraState.radius = Math.min(
        cameraState.maxRadius,
        Math.max(cameraState.minRadius, cameraState.radius * zoomFactor)
      );
      applyCameraState(camera, cameraState);
      requestRender();
    }, { passive: false });

    stage.addEventListener('dblclick', () => {
      cameraState.theta = cameraState.defaultTheta;
      cameraState.phi = cameraState.defaultPhi;
      cameraState.radius = cameraState.defaultRadius;
      applyCameraState(camera, cameraState);
      requestRender();
    });
  }

  function createThreeScene(root, layout) {
    const canvas = root.querySelector('[data-tech-map-canvas]');
    if (!canvas) return null;

    const stage = root.querySelector('.lq-tech-constellation__stage');
    const width = stage ? stage.clientWidth : canvas.clientWidth || 960;
    const height = stage ? stage.clientHeight : canvas.clientHeight || 680;
    const renderer = new window.THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);

    const scene = new window.THREE.Scene();
    const camera = new window.THREE.PerspectiveCamera(46, width / height, 0.1, 200);
    camera.position.set(0, 8, 54);

    const ambient = new window.THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambient);
    const coolLight = new window.THREE.PointLight(0xbfe7ff, 1.42, 220, 2);
    coolLight.position.set(layout.center.x - 8, layout.center.y + 24, layout.center.z + 26);
    scene.add(coolLight);
    const accentLight = new window.THREE.PointLight(0x8a74ff, 0.74, 180, 2);
    accentLight.position.set(layout.center.x + 18, layout.center.y - 12, layout.center.z + 12);
    scene.add(accentLight);

    const glowTexture = createGlowTexture();
    const animatedStars = [];
    const nodeObjects = new Map();
    const lineObjects = new Map();

    if (glowTexture) {
      createStageStarfield(scene, glowTexture, layout.boundsRadius);
    }

    layout.branches.forEach(branch => {
      const core = createBranchCore(branch, glowTexture);
      scene.add(core);
      animatedStars.push(core);
    });

    layout.nodes.forEach(node => {
      const branch = layout.branchLookup.get(node.branch);
      if (!branch) return;

      const corePosition = branch.corePosition || { x: 0, y: 0, z: 0 };
      const branchColor = new window.THREE.Color(branch.color || '#7dd3fc');
      const geometry = new window.THREE.BufferGeometry().setFromPoints([
        new window.THREE.Vector3(corePosition.x, corePosition.y, corePosition.z),
        new window.THREE.Vector3(node.layoutPosition.x, node.layoutPosition.y, node.layoutPosition.z)
      ]);

      const line = new window.THREE.Line(
        geometry,
        new window.THREE.LineBasicMaterial({
          color: branchColor.clone().lerp(new window.THREE.Color('#e9f7ff'), 0.18),
          transparent: true,
          opacity: 0.22
        })
      );
      scene.add(line);

      const star = createNodeStar(node, branch, glowTexture);
      scene.add(star);
      animatedStars.push(star);
      nodeObjects.set(node.id, star);
      lineObjects.set(node.id, line);
    });

    return { scene, camera, renderer, animatedStars, nodeObjects, lineObjects };
  }

  function updateOverlayPositions(root, overlayNodes, camera, width, height) {
    overlayNodes.forEach(node => {
      const projected = node.vector.clone();
      projected.project(camera);
      const rawX = (projected.x * 0.5 + 0.5) * width;
      const rawY = (-projected.y * 0.5 + 0.5) * height;
      const boundsPadding = 18;
      const buttonWidth = node.button.offsetWidth || 180;
      const buttonHeight = node.button.offsetHeight || 64;
      const x = Math.min(Math.max(rawX, boundsPadding + buttonWidth / 2), width - boundsPadding - buttonWidth / 2);
      const y = Math.min(Math.max(rawY, boundsPadding + buttonHeight / 2), height - boundsPadding - buttonHeight / 2);
      const isVisible = projected.z > -1 && projected.z < 1;

      node.button.style.transform = 'translate(' + x + 'px, ' + y + 'px) translate(-50%, -50%)';
      node.button.style.opacity = isVisible ? '1' : '0';
      node.button.style.visibility = isVisible ? 'visible' : 'hidden';
      node.button.classList.toggle('is-active', root.dataset.activeNode === node.nodeId);
    });
  }

  function enhanceTechConstellation(root, payload) {
    if (!window.THREE || !window.THREE.Scene) {
      return;
    }
    if (root.dataset.techMapEnhanced === 'true') {
      return;
    }

    const layout = createConstellationLayout(payload);
    const three = createThreeScene(root, layout);
    if (!three) return;

    const stage = root.querySelector('.lq-tech-constellation__stage');
    const overlayNodes = createNodeOverlay(root, layout.nodes);
    const reducedMotion = prefersReducedMotion();
    const cameraState = createCameraState(layout);
    let needsRender = true;
    const requestRender = () => {
      needsRender = true;
    };

    applyCameraState(three.camera, cameraState);
    bindStageControls(stage, three.camera, cameraState, requestRender);
    three.requestRender = requestRender;
    root.__techMapResetCamera = () => {
      cameraState.theta = cameraState.defaultTheta;
      cameraState.phi = cameraState.defaultPhi;
      cameraState.radius = cameraState.defaultRadius;
      applyCameraState(three.camera, cameraState);
      requestRender();
    };

    root.setAttribute('data-tech-map-enhanced', 'true');

    if (root.__techMapState) {
      bindTechMapFilters(root, payload, root.__techMapState, three);
      applyTechMapFilters(root, payload, root.__techMapState, three);
      applyViewMode(root, root.__techMapState);
    }

    const render = () => {
      const width = stage ? stage.clientWidth : 960;
      const height = stage ? stage.clientHeight : 680;
      const time = performance.now() * 0.001;
      const shouldAnimate = !reducedMotion;

      if (shouldAnimate || needsRender) {
        three.camera.aspect = width / Math.max(height, 1);
        three.camera.updateProjectionMatrix();
        three.renderer.setSize(width, height, false);
        applyCameraState(three.camera, cameraState);
        three.animatedStars.forEach(star => {
          const pulse = shouldAnimate
            ? 1 + Math.sin(time * (star.userData.pulseRate || 1) + (star.userData.twinkleOffset || 0)) * 0.04
            : 1;
          star.scale.setScalar(pulse);
          if (star.userData.aura) {
            const auraScale = star.userData.baseAuraScale || 5.8;
            star.userData.aura.material.opacity = shouldAnimate
              ? 0.62 + Math.sin(time * 1.2 + (star.userData.twinkleOffset || 0)) * 0.08
              : 0.68;
            star.userData.aura.scale.setScalar(auraScale * pulse);
          }
          if (star.userData.ring && shouldAnimate) {
            star.userData.ring.rotation.z += 0.0035;
          }
        });
        updateOverlayPositions(root, overlayNodes, three.camera, width, height);
        three.renderer.render(three.scene, three.camera);
        needsRender = false;
      }

      if (shouldAnimate) {
        needsRender = true;
      }

      window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
  }

  function mountTechConstellation(root) {
    if (!root || root.dataset.techMapBound === 'true') return;
    root.dataset.techMapBound = 'true';

    const payload = parseTechConstellationData(root);
    const defaultNodeId = payload && payload.defaultNodeId;
    const techMapState = createTechMapState(payload || { nodes: [] });
    root.__techMapPayload = payload || { nodes: [] };
    root.__techMapState = techMapState;

    root.querySelectorAll('[data-tech-node]').forEach(button => {
      const nodeId = button.dataset.techNode;

      button.addEventListener('mouseenter', () => {
        if (!prefersReducedMotion()) {
          selectTechNode(root, nodeId);
        }
      });
      button.addEventListener('focus', () => selectTechNode(root, nodeId));
      button.addEventListener('click', () => selectTechNode(root, nodeId));
    });

    if (defaultNodeId) {
      selectTechNode(root, defaultNodeId);
    }

    bindTechMapFilters(root, payload || { nodes: [] }, techMapState);
    bindTechMapEditor(root, payload || { nodes: [] }, techMapState);
    applyTechMapFilters(root, payload || { nodes: [] }, techMapState);
    applyViewMode(root, techMapState);
    renderEditorForm(root, payload || { nodes: [] }, techMapState);

    if (!window.THREE) {
      return;
    }

    enhanceTechConstellation(root, payload);
  }

  function initLqTechConstellation() {
    document.querySelectorAll('[data-tech-constellation]').forEach(mountTechConstellation);
  }

  window.addEventListener('lq-three-ready', () => {
    document.querySelectorAll('[data-tech-constellation]').forEach(root => {
      const payload = parseTechConstellationData(root);
      if (payload) {
        enhanceTechConstellation(root, payload);
      }
    });
  });

  window.initLqTechConstellation = initLqTechConstellation;
})();
