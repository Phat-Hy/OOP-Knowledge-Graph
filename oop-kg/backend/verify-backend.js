const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = 5100;
console.log('Starting verification server on port', PORT);

const serverProcess = spawn('node', [path.join(__dirname, 'server.js')], {
  env: { ...process.env, PORT: PORT.toString() }
});

let serverOutput = '';
serverProcess.stdout.on('data', (data) => {
  serverOutput += data.toString();
  console.log('[Server STDOUT]:', data.toString().trim());
});

serverProcess.stderr.on('data', (data) => {
  console.error('[Server STDERR]:', data.toString().trim());
});

// Helper to make HTTP request
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: JSON.parse(body)
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

// Wait for server to boot up, then run tests
setTimeout(async () => {
  try {
    console.log('\n--- Running API Verification Tests ---');

    // Test 1: GET /api/graph
    console.log('Testing GET /api/graph...');
    const getRes = await request('GET', '/api/graph');
    if (getRes.statusCode !== 200) throw new Error(`GET /api/graph failed: ${getRes.statusCode}`);
    if (!Array.isArray(getRes.data.nodes) || !Array.isArray(getRes.data.links)) {
      throw new Error('Graph format is invalid, missing nodes or links');
    }
    console.log(`✓ GET /api/graph passed. Nodes: ${getRes.data.nodes.length}, Links: ${getRes.data.links.length}`);

    // Test 2: POST /api/nodes
    console.log('Testing POST /api/nodes (Add node)...');
    const testNode = {
      id: 'test-node-verify',
      title: 'Verification Node',
      category: 'basic',
      priority: 'high',
      summary: 'A node added during automated test verification.'
    };
    const postNodeRes = await request('POST', '/api/nodes', testNode);
    if (postNodeRes.statusCode !== 200) throw new Error(`POST /api/nodes failed: ${postNodeRes.statusCode}`);
    console.log('✓ POST /api/nodes (Add) passed.');

    // Test 3: POST /api/links
    console.log('Testing POST /api/links (Add connection)...');
    const testLink = {
      source: 'class',
      target: 'test-node-verify'
    };
    const postLinkRes = await request('POST', '/api/links', testLink);
    if (postLinkRes.statusCode !== 200) throw new Error(`POST /api/links failed: ${postLinkRes.statusCode}`);
    console.log('✓ POST /api/links passed.');

    // Test 4: DELETE /api/nodes/:id
    console.log('Testing DELETE /api/nodes/:id...');
    const deleteNodeRes = await request('DELETE', `/api/nodes/${testNode.id}`);
    if (deleteNodeRes.statusCode !== 200) throw new Error(`DELETE /api/nodes failed: ${deleteNodeRes.statusCode}`);
    console.log('✓ DELETE /api/nodes passed.');

    console.log('\n======================================');
    console.log('ALL BACKEND API VERIFICATIONS PASSED!');
    console.log('======================================');

    cleanup(0);
  } catch (error) {
    console.error('\n❌ Verification Failed:', error.message);
    cleanup(1);
  }
}, 1500);

function cleanup(exitCode) {
  console.log('Shutting down verification server...');
  serverProcess.kill('SIGINT');
  setTimeout(() => {
    process.exit(exitCode);
  }, 500);
}
