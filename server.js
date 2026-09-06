const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const SEED_FILE = path.join(__dirname, 'data', 'seed.json');

// Memory cache of DB loaded from file
let db = null;

function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(raw);
    } else if (fs.existsSync(SEED_FILE)) {
      const raw = fs.readFileSync(SEED_FILE, 'utf8');
      db = JSON.parse(raw);
      saveDb();
    } else {
      db = {
        settings: {},
        domains: [],
        projects: [],
        events: [],
        members: [],
        gallery: [],
        recruitments: [],
        messages: []
      };
    }
  } catch (err) {
    console.error('Error loading DB, resetting to defaults:', err);
    db = { settings: {}, domains: [], projects: [], events: [], members: [], gallery: [], recruitments: [], messages: [] };
  }
}

function saveDb() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving DB:', err);
  }
}

loadDb();

// Simple in-memory session token store for admin authentication
let activeAdminSessions = new Set(['demo-admin-session-token']);

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.md': 'text/markdown; charset=UTF-8'
};

function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) { // 5MB limit
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  });
  res.end(JSON.stringify(data));
}

async function handleRequest(req, res) {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
    });
    res.end();
    return;
  }

  const urlObj = new URL(req.url, `http://${req.headers.host}`);
  const pathname = urlObj.pathname;

  // ==========================================
  // REST API ROUTER (/api/*)
  // ==========================================
  if (pathname.startsWith('/api/')) {
    try {
      // 1. System Status & Public Counters
      if (pathname === '/api/status' && req.method === 'GET') {
        return sendJson(res, 200, {
          success: true,
          status: db.settings.communityStatus || 'ACTIVE',
          focus: db.settings.currentFocus || 'AWS • CLOUD • AI • DATA',
          demoMode: db.settings.demoMode !== false,
          enableAiAssistant: db.settings.enableAiAssistant !== false,
          recruitmentOpen: db.settings.recruitmentOpen !== false,
          stats: {
            projectsCount: db.projects.length,
            eventsCount: db.events.length,
            membersCount: db.members.length,
            applicationsCount: db.recruitments.length,
            messagesCount: db.messages.filter(m => !m.isRead).length
          }
        });
      }

      // 2. Settings
      if (pathname === '/api/settings') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { success: true, settings: db.settings });
        }
        if (req.method === 'PUT') {
          const body = await parseRequestBody(req);
          db.settings = { ...db.settings, ...body };
          saveDb();
          return sendJson(res, 200, { success: true, settings: db.settings });
        }
      }

      // 3. Reset to Seed Data
      if (pathname === '/api/seed' && req.method === 'POST') {
        if (fs.existsSync(SEED_FILE)) {
          const raw = fs.readFileSync(SEED_FILE, 'utf8');
          db = JSON.parse(raw);
          saveDb();
          return sendJson(res, 200, { success: true, message: 'Database reset to demo seed data.' });
        }
      }

      // 4. Authentication
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const { username, password } = await parseRequestBody(req);
        // Default demo credentials: admin / awssbg2026
        if ((username === 'admin' && password === 'awssbg2026') || (username === 'leader' && password === 'builder')) {
          const token = 'session_' + Math.random().toString(36).substring(2) + Date.now();
          activeAdminSessions.add(token);
          return sendJson(res, 200, {
            success: true,
            token,
            user: { username, role: 'SUPER_ADMIN', name: 'AWS SBG Admin' }
          });
        }
        return sendJson(res, 401, { success: false, message: 'Invalid credentials. (Hint for demo: admin / awssbg2026)' });
      }

      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        const auth = req.headers.authorization;
        if (auth) {
          const token = auth.replace('Bearer ', '');
          activeAdminSessions.delete(token);
        }
        return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
      }

      // 5. Domains
      if (pathname === '/api/domains' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, domains: db.domains });
      }

      // 6. Projects CRUD
      if (pathname === '/api/projects') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { success: true, projects: db.projects });
        }
        if (req.method === 'POST') {
          const body = await parseRequestBody(req);
          const newProject = {
            id: 'proj-' + Date.now(),
            title: body.title || 'Untitled Project',
            category: body.category || 'Cloud',
            tagline: body.tagline || 'Cloud Project Reference Architecture',
            summary: body.summary || 'Project description coming soon.',
            isDemo: true,
            featured: Boolean(body.featured),
            status: body.status || 'Demo Ready',
            year: body.year || '2026',
            technologies: Array.isArray(body.technologies) ? body.technologies : ['AWS Cloud'],
            awsServices: Array.isArray(body.awsServices) ? body.awsServices : ['AWS Lambda', 'Amazon S3'],
            githubUrl: body.githubUrl || '#',
            demoUrl: body.demoUrl || '#',
            architecture: body.architecture || {
              steps: [
                { title: 'Frontend Client', desc: 'Modern user interface distributed via CDN.' },
                { title: 'API Gateway', desc: 'Managed API routing with rate limiting.' },
                { title: 'Serverless Compute', desc: 'AWS Lambda execution handlers.' }
              ]
            },
            team: Array.isArray(body.team) ? body.team : ['Student Builder']
          };
          db.projects.unshift(newProject);
          saveDb();
          return sendJson(res, 201, { success: true, project: newProject });
        }
      }

      const projectMatch = pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)$/);
      if (projectMatch) {
        const id = projectMatch[1];
        const idx = db.projects.findIndex(p => p.id === id);
        if (req.method === 'GET') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Project not found' });
          return sendJson(res, 200, { success: true, project: db.projects[idx] });
        }
        if (req.method === 'PUT' || req.method === 'PATCH') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Project not found' });
          const body = await parseRequestBody(req);
          db.projects[idx] = { ...db.projects[idx], ...body };
          saveDb();
          return sendJson(res, 200, { success: true, project: db.projects[idx] });
        }
        if (req.method === 'DELETE') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Project not found' });
          const removed = db.projects.splice(idx, 1);
          saveDb();
          return sendJson(res, 200, { success: true, project: removed[0] });
        }
      }

      // 7. Events CRUD
      if (pathname === '/api/events') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { success: true, events: db.events });
        }
        if (req.method === 'POST') {
          const body = await parseRequestBody(req);
          const newEvent = {
            id: 'evt-' + Date.now(),
            title: body.title || 'Untitled SBG Workshop (Demo)',
            type: body.type || 'Workshop',
            category: body.category || 'Cloud',
            date: body.date || new Date().toISOString().split('T')[0],
            time: body.time || '10:00 AM – 01:00 PM IST',
            venue: body.venue || 'VPKBIET Campus / Virtual Stream',
            speaker: body.speaker || 'Guest Speaker (Demo)',
            speakerBio: body.speakerBio || 'Cloud Practitioner',
            description: body.description || 'Hands-on session covering cloud architecture and builder principles.',
            isDemo: true,
            featured: Boolean(body.featured),
            status: body.status || 'Upcoming',
            capacity: body.capacity || '100 Seats',
            agenda: Array.isArray(body.agenda) ? body.agenda : ['Session overview', 'Hands-on coding lab', 'Q&A'],
            prerequisites: body.prerequisites || 'Laptop with browser.',
            registrationUrl: body.registrationUrl || '#recruitments'
          };
          db.events.unshift(newEvent);
          saveDb();
          return sendJson(res, 201, { success: true, event: newEvent });
        }
      }

      const eventMatch = pathname.match(/^\/api\/events\/([a-zA-Z0-9_-]+)$/);
      if (eventMatch) {
        const id = eventMatch[1];
        const idx = db.events.findIndex(e => e.id === id);
        if (req.method === 'GET') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Event not found' });
          return sendJson(res, 200, { success: true, event: db.events[idx] });
        }
        if (req.method === 'PUT' || req.method === 'PATCH') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Event not found' });
          const body = await parseRequestBody(req);
          db.events[idx] = { ...db.events[idx], ...body };
          saveDb();
          return sendJson(res, 200, { success: true, event: db.events[idx] });
        }
        if (req.method === 'DELETE') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Event not found' });
          const removed = db.events.splice(idx, 1);
          saveDb();
          return sendJson(res, 200, { success: true, event: removed[0] });
        }
      }

      // 8. Members CRUD
      if (pathname === '/api/members') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { success: true, members: db.members });
        }
        if (req.method === 'POST') {
          const body = await parseRequestBody(req);
          const newMember = {
            id: 'mem-' + Date.now(),
            name: body.name || 'Team Member Name (Demo)',
            role: body.role || 'Builder',
            tier: body.tier || 'Technical Team',
            domain: body.domain || 'Cloud & DevOps',
            bio: body.bio || 'Passionate student builder at VPKBIET.',
            branch: body.branch || 'Computer Engineering',
            year: body.year || 'TE',
            skills: Array.isArray(body.skills) ? body.skills : ['AWS Cloud', 'Git'],
            github: body.github || 'https://github.com',
            linkedin: body.linkedin || 'https://linkedin.com',
            isDemo: true
          };
          db.members.push(newMember);
          saveDb();
          return sendJson(res, 201, { success: true, member: newMember });
        }
      }

      const memberMatch = pathname.match(/^\/api\/members\/([a-zA-Z0-9_-]+)$/);
      if (memberMatch) {
        const id = memberMatch[1];
        const idx = db.members.findIndex(m => m.id === id);
        if (req.method === 'PUT' || req.method === 'PATCH') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Member not found' });
          const body = await parseRequestBody(req);
          db.members[idx] = { ...db.members[idx], ...body };
          saveDb();
          return sendJson(res, 200, { success: true, member: db.members[idx] });
        }
        if (req.method === 'DELETE') {
          if (idx === -1) return sendJson(res, 404, { success: false, message: 'Member not found' });
          const removed = db.members.splice(idx, 1);
          saveDb();
          return sendJson(res, 200, { success: true, member: removed[0] });
        }
      }

      // 9. Gallery
      if (pathname === '/api/gallery' && req.method === 'GET') {
        return sendJson(res, 200, { success: true, gallery: db.gallery });
      }

      // 10. Recruitments / Join Applications
      if (pathname === '/api/recruitments') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { success: true, recruitments: db.recruitments });
        }
        if (req.method === 'POST') {
          const body = await parseRequestBody(req);
          if (!body.name || !body.email || !body.prn) {
            return sendJson(res, 400, { success: false, message: 'Name, Email, and College PRN are required.' });
          }
          const newApp = {
            id: 'app-' + Date.now().toString().slice(-4),
            name: body.name.trim(),
            email: body.email.trim(),
            prn: body.prn.trim(),
            branch: body.branch || 'Computer Engineering',
            year: body.year || 'TE',
            domain: body.domain || 'Cloud & DevOps',
            skills: body.skills || '',
            github: body.github || '',
            linkedin: body.linkedin || '',
            portfolio: body.portfolio || '',
            pitch: body.pitch || '',
            status: 'Applied',
            createdAt: new Date().toISOString()
          };
          db.recruitments.unshift(newApp);
          saveDb();
          return sendJson(res, 201, {
            success: true,
            message: 'Application received successfully! Status: Applied',
            application: newApp
          });
        }
      }

      const recMatch = pathname.match(/^\/api\/recruitments\/([a-zA-Z0-9_-]+)\/status$/);
      if (recMatch && req.method === 'PATCH') {
        const id = recMatch[1];
        const { status } = await parseRequestBody(req);
        const app = db.recruitments.find(a => a.id === id);
        if (!app) return sendJson(res, 404, { success: false, message: 'Application not found' });
        app.status = status || app.status;
        saveDb();
        return sendJson(res, 200, { success: true, application: app });
      }

      // 11. Contact Messages
      if (pathname === '/api/messages') {
        if (req.method === 'GET') {
          return sendJson(res, 200, { success: true, messages: db.messages });
        }
        if (req.method === 'POST') {
          const body = await parseRequestBody(req);
          if (!body.name || !body.email || !body.message) {
            return sendJson(res, 400, { success: false, message: 'Name, Email, and Message are required.' });
          }
          const newMsg = {
            id: 'msg-' + Date.now().toString().slice(-4),
            name: body.name.trim(),
            email: body.email.trim(),
            subject: body.subject || 'General Inquiry',
            message: body.message.trim(),
            isRead: false,
            createdAt: new Date().toISOString()
          };
          db.messages.unshift(newMsg);
          saveDb();
          return sendJson(res, 201, { success: true, message: 'Message submitted successfully.', item: newMsg });
        }
      }

      const msgReadMatch = pathname.match(/^\/api\/messages\/([a-zA-Z0-9_-]+)\/read$/);
      if (msgReadMatch && req.method === 'PATCH') {
        const id = msgReadMatch[1];
        const msg = db.messages.find(m => m.id === id);
        if (!msg) return sendJson(res, 404, { success: false, message: 'Message not found' });
        msg.isRead = true;
        saveDb();
        return sendJson(res, 200, { success: true, message: msg });
      }

      return sendJson(res, 404, { success: false, message: 'Endpoint not found' });
    } catch (err) {
      console.error('API Error:', err);
      return sendJson(res, 500, { success: false, error: err.message });
    }
  }

  // ==========================================
  // STATIC ASSET & PAGE ROUTER
  // ==========================================
  let reqPath = decodeURI(pathname);

  // Route /admin or /admin/ to admin.html
  if (reqPath === '/admin' || reqPath === '/admin/') {
    reqPath = '/admin.html';
  } else if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  let filePath = path.join(PUBLIC_DIR, reqPath);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      }
    });
  });
}

const server = http.createServer(handleRequest);

// Local development server runner
if (require.main === module || !process.env.VERCEL) {
  function startServer(portToTry) {
    server.removeAllListeners('error');
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️ Port ${portToTry} is already in use.`);
        const nextPort = Number(portToTry) + 1;
        console.log(`🔄 Automatically trying port ${nextPort}...`);
        startServer(nextPort);
      } else {
        console.error('Server error:', err);
      }
    });

    server.listen(portToTry, () => {
      console.log(`🚀 AWS SBG VPKBIET Platform running at http://localhost:${portToTry}`);
      console.log(`⚡ Public Portal: http://localhost:${portToTry}/`);
      console.log(`🛡️ Admin Console: http://localhost:${portToTry}/admin`);
    });
  }

  startServer(PORT);
}

module.exports = handleRequest;
module.exports.server = server;
module.exports.handleRequest = handleRequest;
