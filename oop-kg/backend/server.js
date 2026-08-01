const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_PATH = path.join(__dirname, 'data', 'graph.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Global in-memory cache for Serverless/Read-only environments
let inMemoryGraph = null;

// Helper functions to read/write data safely
function readGraph() {
  if (inMemoryGraph) {
    return inMemoryGraph;
  }
  try {
    if (!fs.existsSync(DATA_PATH)) {
      // Create path directories if they don't exist
      fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
      fs.writeFileSync(DATA_PATH, JSON.stringify({ nodes: [], links: [] }, null, 2));
      inMemoryGraph = { nodes: [], links: [] };
      return inMemoryGraph;
    }
    const data = fs.readFileSync(DATA_PATH, 'utf8');
    inMemoryGraph = JSON.parse(data);
    return inMemoryGraph;
  } catch (error) {
    console.error('Error reading graph database:', error);
    return { nodes: [], links: [] };
  }
}

function writeGraph(graph) {
  // Sanitize links to ensure source/target are strings, not objects (which D3.js mutates on frontend)
  if (graph && Array.isArray(graph.links)) {
    graph.links = graph.links.map(l => {
      const source = (l.source && typeof l.source === 'object') ? l.source.id : l.source;
      const target = (l.target && typeof l.target === 'object') ? l.target.id : l.target;
      return { source, target };
    });
  }

  inMemoryGraph = graph; // Update cache

  try {
    fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    // Atomic write: write to a temp file, then rename
    const tmpPath = DATA_PATH + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(graph, null, 2), 'utf8');
    fs.renameSync(tmpPath, DATA_PATH);
    return { success: true, warning: null };
  } catch (error) {
    console.warn('Warning: Failed to write graph database to disk (likely Vercel read-only fs):', error.message);
    return {
      success: true, // Memory cache was successfully updated, so API succeeds
      warning: 'Đồ thị được cập nhật tạm thời trong bộ nhớ đệm. Vì chạy serverless trên Vercel, vui lòng bấm "Tải về JSON" để lưu các thay đổi của bạn!'
    };
  }
}

// REST API Endpoints
// 1. Get entire graph
app.get('/api/graph', (req, res) => {
  const graph = readGraph();
  res.json(graph);
});

// 2. Add or update node
app.post('/api/nodes', (req, res) => {
  const node = req.body;
  if (!node || !node.id) {
    return res.status(400).json({ error: 'Node must contain a unique id.' });
  }

  // Sanitize ID (lowercase, replace spaces with hyphens)
  node.id = node.id.toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  const graph = readGraph();
  const index = graph.nodes.findIndex(n => n.id === node.id);

  if (index !== -1) {
    // Update existing node
    graph.nodes[index] = { ...graph.nodes[index], ...node };
  } else {
    // Add new node
    graph.nodes.push({
      category: 'basic',
      priority: 'medium',
      summary: '',
      details: '',
      qas: [],
      code: {},
      ...node
    });
  }

  const writeResult = writeGraph(graph);
  res.json({ 
    message: 'Node saved successfully.', 
    node,
    warning: writeResult.warning 
  });
});

// 3. Delete node
app.delete('/api/nodes/:id', (req, res) => {
  const nodeId = req.params.id;
  const graph = readGraph();

  // Filter out node
  const nodeExists = graph.nodes.some(n => n.id === nodeId);
  if (!nodeExists) {
    return res.status(404).json({ error: 'Node not found.' });
  }

  graph.nodes = graph.nodes.filter(n => n.id !== nodeId);

  // Filter out links pointing to or from this node
  graph.links = graph.links.filter(l => l.source !== nodeId && l.target !== nodeId);

  const writeResult = writeGraph(graph);
  res.json({ 
    message: 'Node and its links deleted successfully.',
    warning: writeResult.warning
  });
});

// 4. Add dependency link
app.post('/api/links', (req, res) => {
  const { source, target } = req.body;
  if (!source || !target) {
    return res.status(400).json({ error: 'Source and target node IDs are required.' });
  }

  const graph = readGraph();

  // Validate nodes exist
  const sourceExists = graph.nodes.some(n => n.id === source);
  const targetExists = graph.nodes.some(n => n.id === target);

  if (!sourceExists || !targetExists) {
    return res.status(400).json({ error: 'Both source and target nodes must exist in the graph.' });
  }

  // Check if link already exists
  const linkExists = graph.links.some(
    l => (l.source === source && l.target === target)
  );

  if (linkExists) {
    return res.status(400).json({ error: 'Link already exists.' });
  }

  graph.links.push({ source, target });

  const writeResult = writeGraph(graph);
  res.json({ 
    message: 'Link created successfully.', 
    link: { source, target },
    warning: writeResult.warning
  });
});

// 5. Delete link
app.delete('/api/links', (req, res) => {
  const source = req.body?.source || req.query?.source;
  const target = req.body?.target || req.query?.target;
  if (!source || !target) {
    return res.status(400).json({ error: 'Source and target parameters are required.' });
  }

  const graph = readGraph();

  const originalLength = graph.links.length;
  graph.links = graph.links.filter(
    l => !(l.source === source && l.target === target)
  );

  if (graph.links.length === originalLength) {
    return res.status(404).json({ error: 'Link not found.' });
  }

  const writeResult = writeGraph(graph);
  res.json({ 
    message: 'Link deleted successfully.',
    warning: writeResult.warning
  });
});

// 6. Overwrite / Import entire graph
app.post('/api/import', (req, res) => {
  const { nodes, links } = req.body;
  if (!Array.isArray(nodes) || !Array.isArray(links)) {
    return res.status(400).json({ error: 'Invalid graph format. Must contain nodes and links arrays.' });
  }

  const newGraph = { nodes, links };
  const writeResult = writeGraph(newGraph);
  res.json({ 
    message: 'Graph imported successfully.', 
    graph: newGraph,
    warning: writeResult.warning
  });
});

// Serve frontend static assets
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Fallback for SPA Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
