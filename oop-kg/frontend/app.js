// -------------------------------------------------------------
// 1. APPLICATION STATE
// -------------------------------------------------------------
let graphData = { nodes: [], links: [] };
let selectedNode = null;
let hoveredNodeId = null;

let isAdminMode = false;
let isStudyMode = false;
let masteredNodes = new Set(); // Store node IDs

let activeTab = 'overview';
let activeCodeLang = 'java';

// D3 variables
let svg, container, simulation, zoom;
let width, height;

// Category colors matching CSS
const CATEGORY_COLORS = {
  basic: '#a78bfa',     // Purple
  advanced: '#22d3ee',  // Cyan
  solid: '#34d399',     // Emerald
  patterns: '#fb7185'   // Rose
};

// Node sizes mapping priority
const PRIORITY_SIZES = {
  high: 22,
  medium: 16,
  low: 11
};

// -------------------------------------------------------------
// 2. INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initD3();
  loadStateFromLocalStorage();
  setupEventListeners();
  fetchGraph();
  lucide.createIcons();
});

// Load mastered nodes from localStorage
function loadStateFromLocalStorage() {
  const saved = localStorage.getItem('oop_kg_mastered');
  if (saved) {
    try {
      masteredNodes = new Set(JSON.parse(saved));
    } catch (e) {
      console.error('Error loading mastered state:', e);
    }
  }
}

function saveStateToLocalStorage() {
  localStorage.setItem('oop_kg_mastered', JSON.stringify(Array.from(masteredNodes)));
}

// -------------------------------------------------------------
// 3. EVENT LISTENERS SETUP
// -------------------------------------------------------------
function setupEventListeners() {
  // Sidebar Close Buttons
  document.getElementById('close-sidebar-btn').addEventListener('click', () => {
    document.getElementById('details-sidebar').classList.add('hidden');
    selectedNode = null;
    updateGraphVisuals();
  });

  document.getElementById('close-admin-btn').addEventListener('click', () => {
    toggleAdminMode(false);
  });

  // Admin Mode button
  document.getElementById('admin-mode-btn').addEventListener('click', () => {
    toggleAdminMode(!isAdminMode);
  });

  // Study Mode button
  document.getElementById('study-mode-btn').addEventListener('click', () => {
    toggleStudyMode(!isStudyMode);
  });

  document.getElementById('exit-study-btn').addEventListener('click', () => {
    toggleStudyMode(false);
  });

  // Tab Navigation in Details Sidebar
  document.querySelectorAll('#details-sidebar .tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = e.currentTarget.getAttribute('data-tab');
      switchTab(tab);
    });
  });

  // Language Tabs in Code block
  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const lang = e.currentTarget.getAttribute('data-lang');
      switchCodeLang(lang);
    });
  });

  // Search input
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('search-clear-btn');
  
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (value) {
      clearSearchBtn.classList.remove('hidden');
    } else {
      clearSearchBtn.classList.add('hidden');
    }
    filterAndSearchGraph();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    filterAndSearchGraph();
  });

  // Filter Dropdown Toggle
  const filterBtn = document.getElementById('filter-btn');
  const filterDropdown = document.getElementById('filter-dropdown');
  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!filterDropdown.classList.contains('hidden') && !filterDropdown.contains(e.target) && e.target !== filterBtn) {
      filterDropdown.classList.add('hidden');
    }
  });

  // Checkboxes in Filter Dropdown
  ['filter-basic', 'filter-advanced', 'filter-solid', 'filter-patterns'].forEach(id => {
    document.getElementById(id).addEventListener('change', filterAndSearchGraph);
  });

  // Mastered button
  document.getElementById('mark-mastered-btn').addEventListener('click', () => {
    if (!selectedNode) return;
    const nodeId = selectedNode.id;
    if (masteredNodes.has(nodeId)) {
      masteredNodes.delete(nodeId);
      showToast('Đã bỏ đánh dấu thuộc lòng.', 'info');
    } else {
      masteredNodes.add(nodeId);
      showToast('Đã đánh dấu thuộc lòng khái niệm này!', 'success');
    }
    saveStateToLocalStorage();
    updateSidebarProgress();
    updateStudyProgressBanner();
    updateGraphVisuals();
  });

  // Zoom buttons
  document.getElementById('zoom-in-btn').addEventListener('click', () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1.3);
  });

  document.getElementById('zoom-out-btn').addEventListener('click', () => {
    svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.3);
  });

  document.getElementById('zoom-fit-btn').addEventListener('click', () => {
    fitGraph();
  });

  // Code Copy
  document.getElementById('copy-code-btn').addEventListener('click', copyCodeToClipboard);

  // --- ADMIN FORM LISTENERS ---
  const nodeEditForm = document.getElementById('node-edit-form');
  nodeEditForm.addEventListener('submit', handleNodeFormSubmit);

  document.getElementById('delete-node-btn').addEventListener('click', handleDeleteNodeClick);
  document.getElementById('add-qa-field-btn').addEventListener('click', () => addQaField('', ''));
  document.getElementById('create-link-btn').addEventListener('click', handleCreateLinkClick);
  
  // JSON Export / Import
  document.getElementById('export-json-btn').addEventListener('click', handleExportJsonClick);
  
  const importTrigger = document.getElementById('import-json-trigger-btn');
  const importFileInput = document.getElementById('import-json-file');
  importTrigger.addEventListener('click', () => importFileInput.click());
  importFileInput.addEventListener('change', handleImportJsonChange);

  // Resize window
  window.addEventListener('resize', handleResize);
}

// -------------------------------------------------------------
// 4. DATA FETCH & SYNC
// -------------------------------------------------------------
async function fetchGraph() {
  try {
    const res = await fetch('/api/graph');
    if (!res.ok) throw new Error('Không thể tải dữ liệu đồ thị.');
    graphData = await res.json();
    
    // Refresh visual representation
    renderGraph();
    populateAdminDropdowns();
    if (isStudyMode) {
      updateStudyProgressBanner();
    }
  } catch (error) {
    showToast('Lỗi: ' + error.message, 'error');
  }
}

// -------------------------------------------------------------
// 5. D3 GRAPH LOGIC
// -------------------------------------------------------------
function initD3() {
  const workspace = document.querySelector('.graph-workspace');
  width = workspace.clientWidth;
  height = workspace.clientHeight;

  svg = d3.select('#graph-svg');
  
  // Clear any existing defs/groups
  svg.selectAll('*').remove();

  // Create defs for arrows, grids, gradients, and glows
  const defs = svg.append('defs');

  // 1. Dot grid pattern in defs
  defs.append('pattern')
    .attr('id', 'dot-grid')
    .attr('width', 24)
    .attr('height', 24)
    .attr('patternUnits', 'userSpaceOnUse')
    .append('circle')
    .attr('cx', 2)
    .attr('cy', 2)
    .attr('r', 1)
    .attr('fill', 'rgba(255, 255, 255, 0.07)');

  // 2. Draw static background dot grid (does not scale on zoom)
  svg.append('rect')
    .attr('class', 'grid-bg')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('fill', 'url(#dot-grid)')
    .style('pointer-events', 'none');

  // 3. Radial Gradients for premium 3D sphere look
  const gradTypes = [
    { id: 'grad-basic', colors: ['#d8b4fe', '#7c3aed'] },     // Purple
    { id: 'grad-advanced', colors: ['#67e8f9', '#0891b2'] },  // Cyan
    { id: 'grad-solid', colors: ['#6ee7b7', '#059669'] },     // Emerald
    { id: 'grad-patterns', colors: ['#fda4af', '#e11d48'] }   // Rose
  ];

  gradTypes.forEach(g => {
    const grad = defs.append('radialGradient')
      .attr('id', g.id)
      .attr('cx', '35%')
      .attr('cy', '35%')
      .attr('r', '65%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', g.colors[0]);
    grad.append('stop').attr('offset', '100%').attr('stop-color', g.colors[1]);
  });

  // 4. Glow filter for hovered/selected nodes
  const glowFilter = defs.append('filter')
    .attr('id', 'node-glow')
    .attr('x', '-50%')
    .attr('y', '-50%')
    .attr('width', '200%')
    .attr('height', '200%');
    
  glowFilter.append('feGaussianBlur')
    .attr('stdDeviation', '6')
    .attr('result', 'blur');
    
  glowFilter.append('feComponentTransfer')
    .attr('in', 'blur')
    .attr('result', 'glow')
    .append('feFuncA')
    .attr('type', 'linear')
    .attr('slope', '0.65');

  const feMerge = glowFilter.append('feMerge');
  feMerge.append('feMergeNode').attr('in', 'glow');
  feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  
  // Standard arrow marker
  defs.append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 24) // Place arrowhead near node border
    .attr('refY', 0)
    .attr('markerWidth', 7)
    .attr('markerHeight', 7)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-4 L8,0 L0,4')
    .attr('fill', '#475569')
    .style('opacity', '0.6');

  // Highlighted arrow marker
  defs.append('marker')
    .attr('id', 'arrowhead-active')
    .attr('viewBox', '0 -5 10 10')
    .attr('refX', 24)
    .attr('refY', 0)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M0,-4 L8,0 L0,4')
    .attr('fill', '#22d3ee')
    .style('opacity', '0.9');

  // Setup zoom container
  container = svg.append('g').attr('class', 'zoom-container');

  zoom = d3.zoom()
    .scaleExtent([0.15, 3.5])
    .on('zoom', (event) => {
      container.attr('transform', event.transform);
    });

  svg.call(zoom);

  // Setup simulation
  simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(130).strength(0.8))
    .force('charge', d3.forceManyBody().strength(-380).distanceMax(350))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collide', d3.forceCollide().radius(d => PRIORITY_SIZES[d.priority || 'medium'] + 28));
}

function renderGraph() {
  if (!graphData.nodes || graphData.nodes.length === 0) return;

  // Preserve positions for existing nodes to prevent jumpiness on update
  const oldNodes = new Map(container.selectAll('.node-group').data().map(d => [d.id, { x: d.x, y: d.y, vx: d.vx, vy: d.vy }]));
  
  graphData.nodes.forEach(node => {
    if (oldNodes.has(node.id)) {
      const old = oldNodes.get(node.id);
      node.x = old.x;
      node.y = old.y;
      node.vx = old.vx;
      node.vy = old.vy;
    }
  });

  // 1. Draw Links
  const validNodeIds = new Set(graphData.nodes.map(n => n.id));
  const cleanLinks = graphData.links.filter(l => {
    const sId = (l.source && typeof l.source === 'object') ? l.source.id : l.source;
    const tId = (l.target && typeof l.target === 'object') ? l.target.id : l.target;
    return validNodeIds.has(sId) && validNodeIds.has(tId);
  });

  const linksSelection = container.selectAll('.graph-link')
    .data(cleanLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}`);

  // Exit
  linksSelection.exit().remove();

  // Enter + Merge
  const links = linksSelection.enter()
    .append('line')
    .attr('class', 'graph-link')
    .attr('marker-end', 'url(#arrowhead)')
    .merge(linksSelection);

  // 2. Draw Nodes Groups
  const nodesSelection = container.selectAll('.node-group')
    .data(graphData.nodes, d => d.id);

  // Exit
  nodesSelection.exit().remove();

  // Enter
  const nodesEnter = nodesSelection.enter()
    .append('g')
    .attr('class', 'node-group')
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    );

  // Node circle
  nodesEnter.append('circle')
    .attr('class', 'node-circle')
    .on('click', (event, d) => {
      event.stopPropagation();
      selectNode(d);
    })
    .on('mouseover', (event, d) => {
      hoveredNodeId = d.id;
      updateGraphVisuals();
    })
    .on('mouseout', () => {
      hoveredNodeId = null;
      updateGraphVisuals();
    });

  // Node Label text
  nodesEnter.append('text')
    .attr('class', 'node-label')
    .attr('dy', d => PRIORITY_SIZES[d.priority || 'medium'] + 15);

  // Merge
  const nodes = nodesEnter.merge(nodesSelection);

  // 3. Apply Node properties & colors
  nodes.select('.node-circle')
    .attr('r', d => PRIORITY_SIZES[d.priority || 'medium'])
    .attr('fill', d => `url(#grad-${d.category || 'basic'})`) // Radial gradient fill
    .style('color', d => CATEGORY_COLORS[d.category || 'basic']); // For currentColor filter-glows

  nodes.select('.node-label')
    .text(d => d.title);

  // Update simulation
  simulation.nodes(graphData.nodes).on('tick', () => {
    links
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodes.attr('transform', d => `translate(${d.x},${d.y})`);
  });

  simulation.force('link').links(cleanLinks);
  simulation.alpha(0.6).restart();

  // Filter initially based on current checkbox settings
  filterAndSearchGraph();
  
  // Auto zoom fit on initial fetch if there's no selection
  if (!selectedNode) {
    setTimeout(fitGraph, 300);
  }
}

// Drag behaviors
function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function fitGraph() {
  if (!graphData.nodes || graphData.nodes.length === 0) return;
  
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  graphData.nodes.forEach(d => {
    if (d.x < minX) minX = d.x;
    if (d.x > maxX) maxX = d.x;
    if (d.y < minY) minY = d.y;
    if (d.y > maxY) maxY = d.y;
  });

  const pad = 80;
  const dx = maxX - minX + pad * 2;
  const dy = maxY - minY + pad * 2;
  const x = (minX + maxX) / 2;
  const y = (minY + maxY) / 2;
  
  const scale = Math.max(0.2, Math.min(1.5, 0.95 / Math.max(dx / width, dy / height)));
  
  svg.transition().duration(750).call(
    zoom.transform,
    d3.zoomIdentity.translate(width / 2, height / 2).scale(scale).translate(-x, -y)
  );
}

function handleResize() {
  const workspace = document.querySelector('.graph-workspace');
  width = workspace.clientWidth;
  height = workspace.clientHeight;
  simulation.force('center', d3.forceCenter(width / 2, height / 2));
  simulation.alpha(0.2).restart();
}

// -------------------------------------------------------------
// 6. GRAPH VISUAL STATE UPDATES (HOVER/SELECTION)
// -------------------------------------------------------------
function updateGraphVisuals() {
  const activeFilters = getActiveFilters();
  const searchVal = document.getElementById('search-input').value.trim().toLowerCase();

  // If node is hovered, find adjacent nodes
  const adjacentNodeIds = new Set();
  const adjacentLinks = new Set();
  
  if (hoveredNodeId) {
    adjacentNodeIds.add(hoveredNodeId);
    graphData.links.forEach(l => {
      const sId = l.source.id || l.source;
      const tId = l.target.id || l.target;
      if (sId === hoveredNodeId) {
        adjacentNodeIds.add(tId);
        adjacentLinks.add(`${sId}-${tId}`);
      } else if (tId === hoveredNodeId) {
        adjacentNodeIds.add(sId);
        adjacentLinks.add(`${sId}-${tId}`);
      }
    });
  }

  // Update Nodes
  container.selectAll('.node-circle')
    .classed('selected', d => selectedNode && d.id === selectedNode.id)
    .classed('hovered', d => d.id === hoveredNodeId)
    .classed('mastered', d => masteredNodes.has(d.id))
    .classed('faded', d => {
      // Rule 1: Filter out inactive categories
      if (!activeFilters.has(d.category)) return true;
      // Rule 2: Search query mismatch
      if (searchVal && !d.title.toLowerCase().includes(searchVal) && !d.summary.toLowerCase().includes(searchVal)) return true;
      // Rule 3: Hover mode active, fade out non-adjacent nodes
      if (hoveredNodeId && !adjacentNodeIds.has(d.id)) return true;
      return false;
    });

  // Update Labels
  container.selectAll('.node-label')
    .classed('active', d => (selectedNode && d.id === selectedNode.id) || d.id === hoveredNodeId)
    .style('opacity', d => {
      if (!activeFilters.has(d.category)) return 0;
      if (searchVal && !d.title.toLowerCase().includes(searchVal) && !d.summary.toLowerCase().includes(searchVal)) return 0.15;
      if (hoveredNodeId && !adjacentNodeIds.has(d.id)) return 0.2;
      return 1;
    });

  // Update Links
  container.selectAll('.graph-link')
    .classed('highlighted', l => {
      const sId = l.source.id || l.source;
      const tId = l.target.id || l.target;
      return adjacentLinks.has(`${sId}-${tId}`);
    })
    .classed('faded', l => {
      const sId = l.source.id || l.source;
      const tId = l.target.id || l.target;
      
      // If either end node is filtered out, fade/hide the link
      if (!activeFilters.has(l.source.category) || !activeFilters.has(l.target.category)) return true;
      
      // If search query is active and doesn't match both ends, fade out link
      if (searchVal) {
        const sourceMatches = l.source.title.toLowerCase().includes(searchVal);
        const targetMatches = l.target.title.toLowerCase().includes(searchVal);
        if (!sourceMatches || !targetMatches) return true;
      }

      // If hover mode is active, fade out non-adjacent links
      if (hoveredNodeId && !adjacentLinks.has(`${sId}-${tId}`)) return true;
      return false;
    })
    .attr('marker-end', l => {
      const sId = l.source.id || l.source;
      const tId = l.target.id || l.target;
      return adjacentLinks.has(`${sId}-${tId}`) ? 'url(#arrowhead-active)' : 'url(#arrowhead)';
    });
}

function getActiveFilters() {
  const filters = new Set();
  if (document.getElementById('filter-basic').checked) filters.add('basic');
  if (document.getElementById('filter-advanced').checked) filters.add('advanced');
  if (document.getElementById('filter-solid').checked) filters.add('solid');
  if (document.getElementById('filter-patterns').checked) filters.add('patterns');
  return filters;
}

function filterAndSearchGraph() {
  updateGraphVisuals();
}

// -------------------------------------------------------------
// 7. SIDEBAR DETAILS MANAGEMENT (STUDY & CONCEPT READ)
// -------------------------------------------------------------
function selectNode(node) {
  selectedNode = node;
  
  // Center view on selected node with transition
  svg.transition().duration(500).call(
    zoom.translateTo,
    node.x,
    node.y
  );

  // Fill data in sidebar
  document.getElementById('concept-title').innerText = node.title;
  
  const catBadge = document.getElementById('concept-category-badge');
  catBadge.innerText = node.category.toUpperCase();
  catBadge.className = 'badge ' + 'category-' + node.category;

  const priBadge = document.getElementById('concept-priority-badge');
  priBadge.innerText = 'Priority: ' + node.priority.toUpperCase();
  
  document.getElementById('concept-summary').innerText = node.summary;
  document.getElementById('concept-details').innerText = node.details;

  // Mastered badge & button toggle
  updateSidebarProgress();

  // Populate dependency list boxes
  populateDependencies(node);

  // Populate Interview QA Accordion
  populateQA(node.qas || []);

  // Display Code sample
  switchCodeLang(activeCodeLang);

  // Show sidebar
  document.getElementById('details-sidebar').classList.remove('hidden');

  // Trigger admin form pre-fill if Admin panel is open
  if (isAdminMode) {
    fillAdminForm(node);
  }

  updateGraphVisuals();
}

function updateSidebarProgress() {
  if (!selectedNode) return;
  const isMastered = masteredNodes.has(selectedNode.id);
  const badge = document.getElementById('concept-mastered-badge');
  const btn = document.getElementById('mark-mastered-btn');

  if (isMastered) {
    badge.classList.remove('hidden');
    btn.innerHTML = '<i data-lucide="x-circle"></i> Bỏ đánh dấu thuộc lòng';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-secondary');
  } else {
    badge.classList.add('hidden');
    btn.innerHTML = '<i data-lucide="check-circle"></i> Đánh dấu: Đã thuộc lòng';
    btn.classList.remove('btn-secondary');
    btn.classList.add('btn-primary');
  }
  lucide.createIcons();
}

function populateDependencies(node) {
  const prereqList = document.getElementById('prereq-list');
  const nextList = document.getElementById('next-list');
  
  prereqList.innerHTML = '';
  nextList.innerHTML = '';

  const prereqNodes = [];
  const nextNodes = [];

  graphData.links.forEach(l => {
    const s = l.source.id || l.source;
    const t = l.target.id || l.target;

    if (t === node.id) {
      // source is prerequisite of target
      const sNode = graphData.nodes.find(n => n.id === s);
      if (sNode) prereqNodes.push(sNode);
    } else if (s === node.id) {
      // target is next step
      const tNode = graphData.nodes.find(n => n.id === t);
      if (tNode) nextNodes.push(tNode);
    }
  });

  if (prereqNodes.length === 0) {
    prereqList.innerHTML = '<li class="concept-text">Không có</li>';
  } else {
    prereqNodes.forEach(n => {
      const li = document.createElement('li');
      li.className = 'dep-item';
      li.innerText = n.title;
      li.addEventListener('click', () => selectNode(n));
      prereqList.appendChild(li);
    });
  }

  if (nextNodes.length === 0) {
    nextList.innerHTML = '<li class="concept-text">Không có</li>';
  } else {
    nextNodes.forEach(n => {
      const li = document.createElement('li');
      li.className = 'dep-item';
      li.innerText = n.title;
      li.addEventListener('click', () => selectNode(n));
      nextList.appendChild(li);
    });
  }
}

function populateQA(qas) {
  const container = document.getElementById('qa-list-container');
  container.innerHTML = '';

  if (qas.length === 0) {
    container.innerHTML = '<p class="concept-text">Không có câu hỏi phỏng vấn nào cho phần này.</p>';
    return;
  }

  qas.forEach((qa, idx) => {
    const card = document.createElement('div');
    card.className = 'qa-card';

    const header = document.createElement('div');
    header.className = 'qa-header';
    header.innerHTML = `
      <h4>Q${idx + 1}: ${escapeHtml(qa.question)}</h4>
      <i data-lucide="chevron-down" class="qa-icon"></i>
    `;
    
    const body = document.createElement('div');
    body.className = 'qa-body';
    body.innerText = qa.answer;

    header.addEventListener('click', () => {
      card.classList.toggle('open');
    });

    card.appendChild(header);
    card.appendChild(body);
    container.appendChild(card);
  });
  
  lucide.createIcons();
}

function switchTab(tabName) {
  activeTab = tabName;
  
  // Header classes
  document.querySelectorAll('#details-sidebar .tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });

  // Panes visibility
  document.querySelectorAll('#details-sidebar .tab-pane').forEach(pane => {
    pane.classList.toggle('active', pane.getAttribute('id') === `tab-${tabName}`);
  });
}

function switchCodeLang(lang) {
  activeCodeLang = lang;

  document.querySelectorAll('.code-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  const display = document.getElementById('code-snippet-display');
  if (selectedNode && selectedNode.code && selectedNode.code[lang]) {
    display.textContent = selectedNode.code[lang];
  } else {
    display.textContent = '// Không có code minh họa ngôn ngữ này.';
  }
}

function copyCodeToClipboard() {
  const display = document.getElementById('code-snippet-display');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(display.textContent)
      .then(() => {
        showToast('Đã sao chép mã nguồn vào bộ nhớ đệm!', 'success');
      })
      .catch(() => {
        fallbackCopyTextToClipboard(display.textContent);
      });
  } else {
    fallbackCopyTextToClipboard(display.textContent);
  }
}

function fallbackCopyTextToClipboard(text) {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showToast('Đã sao chép mã nguồn vào bộ nhớ đệm!', 'success');
    } else {
      showToast('Không thể sao chép code.', 'error');
    }
  } catch (err) {
    showToast('Không thể sao chép code.', 'error');
  }
  document.body.removeChild(textArea);
}

// -------------------------------------------------------------
// 8. STUDY MODE MANAGEMENT
// -------------------------------------------------------------
function toggleStudyMode(active) {
  isStudyMode = active;
  document.getElementById('study-mode-btn').classList.toggle('active', active);
  
  const banner = document.getElementById('study-banner');
  if (active) {
    banner.classList.remove('hidden');
    updateStudyProgressBanner();
  } else {
    banner.classList.add('hidden');
  }
}

function updateStudyProgressBanner() {
  if (!graphData.nodes || graphData.nodes.length === 0) return;
  const total = graphData.nodes.length;
  const mastered = Array.from(masteredNodes).filter(id => graphData.nodes.some(n => n.id === id)).length;
  const percentage = Math.round((mastered / total) * 100);

  document.getElementById('study-progress-fill').style.width = percentage + '%';
  document.getElementById('study-progress-text').innerText = `Tiến trình: ${percentage}% (${mastered}/${total} hoàn thành)`;
}

// -------------------------------------------------------------
// 9. ADMIN MODE - EDIT & CRUD APIS
// -------------------------------------------------------------
function toggleAdminMode(active) {
  isAdminMode = active;
  document.getElementById('admin-mode-btn').classList.toggle('active', active);
  document.getElementById('admin-sidebar').classList.toggle('hidden', !active);

  const keyIcon = document.querySelector('#admin-mode-btn i');
  if (active) {
    keyIcon.setAttribute('data-lucide', 'unlock');
    showToast('Chế độ quản trị: BẬT. Nhấp đúp vào màn hình để thêm khái niệm mới.', 'info');
    
    // Auto fill if something selected
    if (selectedNode) fillAdminForm(selectedNode);
    else clearAdminForm();

    // Setup double click handler on SVG for adding node
    svg.on('dblclick', (event) => {
      if (event.target === svg.node()) {
        const coords = d3.pointer(event, container.node());
        clearAdminForm();
        // Give form a temp position coords to place the node
        document.getElementById('save-node-btn').scrollIntoView({ behavior: 'smooth' });
        document.getElementById('edit-node-title').focus();
        showToast('Điền thông tin và bấm Lưu để thêm node tại điểm nhấp đúp.', 'info');
        
        // Temp position storage on form
        document.getElementById('node-edit-form').dataset.x = coords[0];
        document.getElementById('node-edit-form').dataset.y = coords[1];
      }
    });
  } else {
    keyIcon.setAttribute('data-lucide', 'lock');
    svg.on('dblclick', null);
  }
  lucide.createIcons();
}

function populateAdminDropdowns() {
  const sourceSelect = document.getElementById('link-source-select');
  const targetSelect = document.getElementById('link-target-select');
  
  sourceSelect.innerHTML = '<option value="">-- Chọn khái niệm gốc --</option>';
  targetSelect.innerHTML = '<option value="">-- Chọn khái niệm phụ thuộc --</option>';

  // Sort nodes alphabetically for easy lookup
  const sorted = [...graphData.nodes].sort((a, b) => a.title.localeCompare(b.title));

  sorted.forEach(node => {
    const opt1 = document.createElement('option');
    opt1.value = node.id;
    opt1.innerText = node.title;
    sourceSelect.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = node.id;
    opt2.innerText = node.title;
    targetSelect.appendChild(opt2);
  });
}

function fillAdminForm(node) {
  document.getElementById('edit-node-id').value = node.id;
  document.getElementById('edit-node-title').value = node.title;
  document.getElementById('edit-node-category').value = node.category;
  document.getElementById('edit-node-priority').value = node.priority;
  document.getElementById('edit-node-summary').value = node.summary;
  document.getElementById('edit-node-details').value = node.details;

  // QA Fields
  const qaContainer = document.getElementById('edit-qa-container');
  qaContainer.innerHTML = '';
  if (node.qas && node.qas.length > 0) {
    node.qas.forEach(qa => addQaField(qa.question, qa.answer));
  }

  // Code Snippets
  document.getElementById('edit-code-java').value = (node.code && node.code.java) || '';
  document.getElementById('edit-code-cpp').value = (node.code && node.code.cpp) || '';
  document.getElementById('edit-code-python').value = (node.code && node.code.python) || '';
  document.getElementById('edit-code-ts').value = (node.code && node.code.typescript) || '';

  // Show delete button
  document.getElementById('delete-node-btn').classList.remove('hidden');
}

function clearAdminForm() {
  document.getElementById('edit-node-id').value = '';
  document.getElementById('node-edit-form').reset();
  document.getElementById('edit-qa-container').innerHTML = '';
  document.getElementById('delete-node-btn').classList.add('hidden');
  
  // Clear coordinates dataset
  delete document.getElementById('node-edit-form').dataset.x;
  delete document.getElementById('node-edit-form').dataset.y;
}

function addQaField(q = '', a = '') {
  const container = document.getElementById('edit-qa-container');
  const card = document.createElement('div');
  card.className = 'qa-edit-card';
  card.innerHTML = `
    <button type="button" class="remove-qa-btn"><i data-lucide="trash-2"></i></button>
    <div class="form-group">
      <label>Câu hỏi</label>
      <input type="text" class="qa-q-input" required placeholder="Câu hỏi thường gặp..." value="${q}">
    </div>
    <div class="form-group">
      <label>Trả lời</label>
      <textarea class="qa-a-input" required rows="2" placeholder="Nội dung câu trả lời chuẩn xác...">${a}</textarea>
    </div>
  `;

  card.querySelector('.remove-qa-btn').addEventListener('click', () => {
    card.remove();
  });

  container.appendChild(card);
  lucide.createIcons();
}

async function handleNodeFormSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('edit-node-title').value.trim();
  const category = document.getElementById('edit-node-category').value;
  const priority = document.getElementById('edit-node-priority').value;
  const summary = document.getElementById('edit-node-summary').value.trim();
  const details = document.getElementById('edit-node-details').value.trim();
  
  // Construct ID if it's a new node
  let id = document.getElementById('edit-node-id').value;
  if (!id) {
    id = title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!id) {
      showToast('Tên khái niệm không hợp lệ để tạo ID.', 'error');
      return;
    }
  }

  // Build QA Array
  const qas = [];
  document.querySelectorAll('.qa-edit-card').forEach(card => {
    const question = card.querySelector('.qa-q-input').value.trim();
    const answer = card.querySelector('.qa-a-input').value.trim();
    if (question && answer) {
      qas.push({ question, answer });
    }
  });

  // Build Code Object
  const code = {
    java: document.getElementById('edit-code-java').value,
    cpp: document.getElementById('edit-code-cpp').value,
    python: document.getElementById('edit-code-python').value,
    typescript: document.getElementById('edit-code-ts').value
  };

  // Compile final node payload
  const nodePayload = {
    id,
    title,
    category,
    priority,
    summary,
    details,
    qas,
    code
  };

  // If new node, check if we have double-clicked position coordinates
  const formDataset = document.getElementById('node-edit-form').dataset;
  if (!document.getElementById('edit-node-id').value && formDataset.x && formDataset.y) {
    nodePayload.x = parseFloat(formDataset.x);
    nodePayload.y = parseFloat(formDataset.y);
  }

  try {
    const res = await fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodePayload)
    });

    if (!res.ok) throw new Error('Không thể lưu thông tin nút.');
    const data = await res.json();

    if (data.warning) {
      showToast(data.warning, 'warning');
    } else {
      showToast('Lưu thông tin khái niệm thành công!', 'success');
    }
    clearAdminForm();
    await fetchGraph();
  } catch (error) {
    showToast('Lỗi: ' + error.message, 'error');
  }
}

async function handleDeleteNodeClick() {
  const id = document.getElementById('edit-node-id').value;
  if (!id) return;

  if (!confirm(`Bạn chắc chắn muốn xóa khái niệm "${id}" cùng toàn bộ các mối quan hệ liên kết của nó?`)) {
    return;
  }

  try {
    const res = await fetch(`/api/nodes/${id}`, {
      method: 'DELETE'
    });

    if (!res.ok) throw new Error('Không thể xóa nút.');
    const data = await res.json();

    if (data.warning) {
      showToast(data.warning, 'warning');
    } else {
      showToast('Đã xóa khái niệm thành công!', 'success');
    }
    clearAdminForm();
    
    // Hide details panel if current node was deleted
    if (selectedNode && selectedNode.id === id) {
      document.getElementById('details-sidebar').classList.add('hidden');
      selectedNode = null;
    }

    await fetchGraph();
  } catch (error) {
    showToast('Lỗi: ' + error.message, 'error');
  }
}

async function handleCreateLinkClick() {
  const source = document.getElementById('link-source-select').value;
  const target = document.getElementById('link-target-select').value;

  if (!source || !target) {
    showToast('Vui lòng chọn cả khái niệm gốc và khái niệm phụ thuộc.', 'warning');
    return;
  }

  if (source === target) {
    showToast('Khái niệm không thể phụ thuộc vào chính nó.', 'warning');
    return;
  }

  try {
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source, target })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Không thể tạo mối liên kết.');
    }

    if (data.warning) {
      showToast(data.warning, 'warning');
    } else {
      showToast('Tạo quan hệ liên kết thành công!', 'success');
    }
    document.getElementById('link-source-select').value = '';
    document.getElementById('link-target-select').value = '';
    await fetchGraph();
  } catch (error) {
    showToast('Lỗi: ' + error.message, 'error');
  }
}

// JSON export handler
function handleExportJsonClick() {
  const cleanNodes = graphData.nodes.map(n => ({
    id: n.id,
    title: n.title,
    category: n.category,
    priority: n.priority,
    summary: n.summary,
    details: n.details,
    qas: n.qas,
    code: n.code
  }));

  const cleanLinks = graphData.links.map(l => ({
    source: (l.source && typeof l.source === 'object') ? l.source.id : l.source,
    target: (l.target && typeof l.target === 'object') ? l.target.id : l.target
  }));

  const cleanGraph = { nodes: cleanNodes, links: cleanLinks };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cleanGraph, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `oop_knowledge_graph_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  showToast('Đã chuẩn bị tải về file graph database JSON.', 'success');
}

// JSON import handler
function handleImportJsonChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (event) => {
    try {
      const parsed = JSON.parse(event.target.result);
      if (!parsed.nodes || !parsed.links) {
        throw new Error('Định dạng JSON không hợp lệ, thiếu mảng nodes hoặc links.');
      }

      if (!confirm('Bạn có muốn ghi đè toàn bộ dữ liệu đồ thị hiện tại bằng dữ liệu trong file này?')) {
        return;
      }

      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      if (!res.ok) throw new Error('Thất bại khi đẩy dữ liệu lên server.');
      const data = await res.json();

      if (data.warning) {
        showToast(data.warning, 'warning');
      } else {
        showToast('Nhập dữ liệu đồ thị thành công!', 'success');
      }
      await fetchGraph();
    } catch (err) {
      showToast('Lỗi nhập dữ liệu: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

// -------------------------------------------------------------
// 10. UTILITIES / TOAST NOTIFICATIONS
// -------------------------------------------------------------
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'info';
  if (type === 'success') icon = 'check-circle';
  else if (type === 'error') icon = 'alert-triangle';
  else if (type === 'warning') icon = 'alert-circle';

  toast.innerHTML = `<i data-lucide="${icon}"></i> `;
  const span = document.createElement('span');
  span.textContent = message;
  toast.appendChild(span);
  container.appendChild(toast);
  lucide.createIcons();

  setTimeout(() => {
    toast.style.animation = 'toast-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

function escapeHtml(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
