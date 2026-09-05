/**
 * AWS SBG VPKBIET — Admin Console Controller
 * Real-time CRUD Operations & Dashboard Management
 */

const API_BASE = '/api';

// Admin Application State
const adminState = {
  token: localStorage.getItem('sbg_admin_token') || 'demo-admin-session-token',
  currentTab: 'overview',
  data: {
    status: null,
    projects: [],
    events: [],
    members: [],
    domains: [],
    recruitments: [],
    messages: [],
    settings: {}
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  setupNavEvents();
  setupModalEvents();
  setupFormHandlers();
  loadAllAdminData();
});

function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// ==========================================
// 1. AUTHENTICATION & SESSION
// ==========================================
function initAdminAuth() {
  const loginModal = document.getElementById('admin-login-modal');
  const logoutBtn = document.getElementById('admin-logout-btn');
  const loginForm = document.getElementById('admin-login-form');

  if (!adminState.token) {
    if (loginModal) loginModal.style.display = 'flex';
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();

      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const json = await res.json();
        if (json.success) {
          adminState.token = json.token;
          localStorage.setItem('sbg_admin_token', json.token);
          if (loginModal) loginModal.style.display = 'none';
          showToast('Authenticated as SUPER_ADMIN');
          loadAllAdminData();
        } else {
          alert(json.message || 'Authentication failed');
        }
      } catch (err) {
        alert('Authentication error: ' + err.message);
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminState.token}` }
        });
      } catch (e) {}
      localStorage.removeItem('sbg_admin_token');
      adminState.token = null;
      if (loginModal) loginModal.style.display = 'flex';
    });
  }
}

// ==========================================
// 2. DATA SYNCHRONIZATION
// ==========================================
async function loadAllAdminData() {
  try {
    const [statusRes, projRes, evtRes, memRes, domRes, recRes, msgRes, setRes] = await Promise.all([
      fetch(`${API_BASE}/status`).then(r => r.json()),
      fetch(`${API_BASE}/projects`).then(r => r.json()),
      fetch(`${API_BASE}/events`).then(r => r.json()),
      fetch(`${API_BASE}/members`).then(r => r.json()),
      fetch(`${API_BASE}/domains`).then(r => r.json()),
      fetch(`${API_BASE}/recruitments`).then(r => r.json()),
      fetch(`${API_BASE}/messages`).then(r => r.json()),
      fetch(`${API_BASE}/settings`).then(r => r.json())
    ]);

    if (statusRes.success) adminState.data.status = statusRes;
    if (projRes.success) adminState.data.projects = projRes.projects;
    if (evtRes.success) adminState.data.events = evtRes.events;
    if (memRes.success) adminState.data.members = memRes.members;
    if (domRes.success) adminState.data.domains = domRes.domains;
    if (recRes.success) adminState.data.recruitments = recRes.recruitments;
    if (msgRes.success) adminState.data.messages = msgRes.messages;
    if (setRes.success) adminState.data.settings = setRes.settings;

    renderOverview();
    renderProjectsTable();
    renderEventsTable();
    renderMembersTable();
    renderDomains();
    renderRecruitmentsTable();
    renderMessagesTable();
    populateSettingsForm();
    updateBadgeCounts();
    initLucideIcons();
  } catch (err) {
    console.error('Failed to load admin data:', err);
  }
}

function updateBadgeCounts() {
  const d = adminState.data;
  const pCount = document.getElementById('nav-count-projects');
  const eCount = document.getElementById('nav-count-events');
  const mCount = document.getElementById('nav-count-members');
  const aCount = document.getElementById('nav-count-applications');
  const msgCount = document.getElementById('nav-count-messages');

  if (pCount) pCount.textContent = d.projects.length;
  if (eCount) eCount.textContent = d.events.length;
  if (mCount) mCount.textContent = d.members.length;
  if (aCount) aCount.textContent = d.recruitments.length;
  if (msgCount) msgCount.textContent = d.messages.filter(m => !m.isRead).length;

  const metProj = document.getElementById('metric-projects');
  const metEvt = document.getElementById('metric-events');
  const metMem = document.getElementById('metric-members');
  const metApp = document.getElementById('metric-applications');

  if (metProj) metProj.textContent = d.projects.length;
  if (metEvt) metEvt.textContent = d.events.length;
  if (metMem) metMem.textContent = d.members.length;
  if (metApp) metApp.textContent = d.recruitments.length;
}

// ==========================================
// 3. RENDER VIEWS
// ==========================================
function renderOverview() {
  const tbody = document.getElementById('overview-recent-applications');
  if (!tbody) return;

  const recent = adminState.data.recruitments.slice(0, 5);
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 2rem;">No applications received yet.</td></tr>';
    return;
  }

  tbody.innerHTML = recent.map(app => `
    <tr>
      <td style="font-weight: 600;">${app.name}</td>
      <td style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.8rem;">${app.prn}</td>
      <td><span class="service-pill aws-blue">${app.domain}</span></td>
      <td><span class="status-pill ${app.status.toLowerCase().replace(' ', '-')}">${app.status}</span></td>
      <td>
        <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="switchAdminTab('recruitments')">
          Review
        </button>
      </td>
    </tr>
  `).join('');
}

function renderProjectsTable() {
  const tbody = document.getElementById('table-projects-body');
  if (!tbody) return;

  tbody.innerHTML = adminState.data.projects.map(p => `
    <tr>
      <td style="font-weight: 600;">
        ${p.title}
        ${p.isDemo ? '<span class="demo-tag" style="margin-left: 0.5rem;">Demo</span>' : ''}
      </td>
      <td><span class="service-pill">${p.category}</span></td>
      <td>
        <div style="display: flex; flex-wrap: wrap; gap: 0.3rem;">
          ${(p.awsServices || []).slice(0, 3).map(s => `<span class="service-pill aws-orange">${s}</span>`).join('')}
        </div>
      </td>
      <td><span class="status-pill selected">${p.status || 'Ready'}</span></td>
      <td>${p.featured ? '<i data-lucide="check" style="width: 16px; height: 16px; color: var(--aws-smile-orange);"></i>' : '—'}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-ghost icon-btn" onclick="editProject('${p.id}')" title="Edit">
            <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="btn-ghost icon-btn" style="color: var(--admin-rose);" onclick="deleteProject('${p.id}')" title="Delete">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  initLucideIcons();
}

function renderEventsTable() {
  const tbody = document.getElementById('table-events-body');
  if (!tbody) return;

  tbody.innerHTML = adminState.data.events.map(e => `
    <tr>
      <td style="font-weight: 600;">
        ${e.title}
        ${e.isDemo ? '<span class="demo-tag" style="margin-left: 0.5rem;">Demo</span>' : ''}
      </td>
      <td><span class="service-pill aws-orange">${e.type}</span></td>
      <td style="font-family: var(--font-mono); font-size: 0.8rem;">${e.date}</td>
      <td>${e.speaker}</td>
      <td style="color: var(--text-muted); font-size: 0.8rem;">${e.venue}</td>
      <td>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn-ghost icon-btn" onclick="editEvent('${e.id}')" title="Edit">
            <i data-lucide="edit-2" style="width: 16px; height: 16px;"></i>
          </button>
          <button class="btn-ghost icon-btn" style="color: var(--admin-rose);" onclick="deleteEvent('${e.id}')" title="Delete">
            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  initLucideIcons();
}

function renderMembersTable() {
  const tbody = document.getElementById('table-members-body');
  if (!tbody) return;

  tbody.innerHTML = adminState.data.members.map(m => `
    <tr>
      <td style="font-weight: 600;">${m.name}</td>
      <td><span class="service-pill aws-orange">${m.tier}</span></td>
      <td><span class="service-pill">${m.domain}</span></td>
      <td style="color: var(--text-muted); font-size: 0.8rem;">${m.branch} (${m.year})</td>
      <td>
        <button class="btn-ghost icon-btn" style="color: var(--admin-rose);" onclick="deleteMember('${m.id}')" title="Delete">
          <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      </td>
    </tr>
  `).join('');
  initLucideIcons();
}

function renderDomains() {
  const container = document.getElementById('domains-cards-container');
  if (!container) return;

  container.innerHTML = adminState.data.domains.map(d => `
    <div class="admin-card" style="padding: 1.5rem;">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
        <span class="service-pill aws-orange">${d.status}</span>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${d.id}</span>
      </div>
      <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${d.name}</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">${d.shortDesc}</p>
      <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600; margin-bottom: 0.4rem;">Technologies:</div>
      <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;">
        ${d.technologies.map(t => `<span class="service-pill aws-blue">${t}</span>`).join('')}
      </div>
      <div style="font-size: 0.8rem; color: var(--aws-smile-orange); font-family: var(--font-mono);">${d.leadPlaceholder}</div>
    </div>
  `).join('');
}

function renderRecruitmentsTable() {
  const tbody = document.getElementById('table-recruitments-body');
  if (!tbody) return;

  tbody.innerHTML = adminState.data.recruitments.map(a => `
    <tr>
      <td>
        <div style="font-weight: 600;">${a.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${a.email}</div>
      </td>
      <td style="font-family: var(--font-mono); font-size: 0.8rem;">${a.prn}</td>
      <td><span class="service-pill aws-blue">${a.domain}</span></td>
      <td style="font-size: 0.8rem; max-width: 180px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${a.skills}</td>
      <td>
        <select class="form-select" style="padding: 0.3rem 0.6rem; font-size: 0.75rem; width: auto;" onchange="updateApplicationStatus('${a.id}', this.value)">
          <option value="Applied" ${a.status === 'Applied' ? 'selected' : ''}>Applied</option>
          <option value="Under Review" ${a.status === 'Under Review' ? 'selected' : ''}>Under Review</option>
          <option value="Shortlisted" ${a.status === 'Shortlisted' ? 'selected' : ''}>Shortlisted</option>
          <option value="Selected" ${a.status === 'Selected' ? 'selected' : ''}>Selected</option>
          <option value="Rejected" ${a.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
        </select>
      </td>
      <td style="font-size: 0.8rem; color: var(--text-secondary); max-width: 220px;">${a.pitch}</td>
    </tr>
  `).join('');
}

function renderMessagesTable() {
  const tbody = document.getElementById('table-messages-body');
  if (!tbody) return;

  tbody.innerHTML = adminState.data.messages.map(m => `
    <tr style="${m.isRead ? 'opacity: 0.7;' : 'font-weight: 600;'}">
      <td>
        <div>${m.name}</div>
        <div style="font-size: 0.75rem; color: var(--text-muted);">${m.email}</div>
      </td>
      <td>${m.subject}</td>
      <td style="font-size: 0.85rem; max-width: 280px;">${m.message}</td>
      <td style="font-size: 0.75rem; color: var(--text-muted);">${new Date(m.createdAt).toLocaleDateString()}</td>
      <td>
        ${!m.isRead ? `
          <button class="btn btn-secondary" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;" onclick="markMessageRead('${m.id}')">
            Mark Read
          </button>
        ` : '<span style="color: var(--text-muted); font-size: 0.75rem;">Read</span>'}
      </td>
    </tr>
  `).join('');
}

function populateSettingsForm() {
  const s = adminState.data.settings;
  const siteName = document.getElementById('set-sitename');
  const focus = document.getElementById('set-focus');
  const demoMode = document.getElementById('set-demo-mode');
  const ai = document.getElementById('set-ai-assistant');
  const rec = document.getElementById('set-recruitment');

  if (siteName) siteName.value = s.siteName || '';
  if (focus) focus.value = s.currentFocus || '';
  if (demoMode) demoMode.checked = s.demoMode !== false;
  if (ai) ai.checked = s.enableAiAssistant !== false;
  if (rec) rec.checked = s.recruitmentOpen !== false;
}

// ==========================================
// 4. CRUD HANDLERS
// ==========================================
window.switchAdminTab = function(tabName) {
  adminState.currentTab = tabName;
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-tab') === tabName);
  });
  document.querySelectorAll('.admin-view-panel').forEach(panel => {
    panel.style.display = panel.id === `tab-${tabName}` ? 'block' : 'none';
  });
  initLucideIcons();
};

window.updateApplicationStatus = async function(appId, newStatus) {
  try {
    const res = await fetch(`${API_BASE}/recruitments/${appId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const json = await res.json();
    if (json.success) {
      showToast(`Updated candidate status to: ${newStatus}`);
      loadAllAdminData();
    }
  } catch (err) {
    alert('Error updating status: ' + err.message);
  }
};

window.markMessageRead = async function(msgId) {
  try {
    await fetch(`${API_BASE}/messages/${msgId}/read`, { method: 'PATCH' });
    showToast('Message marked as read');
    loadAllAdminData();
  } catch (err) {
    alert('Error updating message: ' + err.message);
  }
};

window.deleteProject = async function(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  try {
    const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Project deleted');
      loadAllAdminData();
    }
  } catch (err) {
    alert('Error deleting project: ' + err.message);
  }
};

window.deleteEvent = async function(id) {
  if (!confirm('Are you sure you want to delete this event?')) return;
  try {
    const res = await fetch(`${API_BASE}/events/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Event deleted');
      loadAllAdminData();
    }
  } catch (err) {
    alert('Error deleting event: ' + err.message);
  }
};

window.deleteMember = async function(id) {
  if (!confirm('Are you sure you want to delete this team member?')) return;
  try {
    const res = await fetch(`${API_BASE}/members/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (json.success) {
      showToast('Member removed');
      loadAllAdminData();
    }
  } catch (err) {
    alert('Error deleting member: ' + err.message);
  }
};

window.editProject = function(id) {
  const p = adminState.data.projects.find(proj => proj.id === id);
  if (!p) return;
  document.getElementById('proj-id').value = p.id;
  document.getElementById('proj-title').value = p.title;
  document.getElementById('proj-category').value = p.category;
  document.getElementById('proj-tagline').value = p.tagline;
  document.getElementById('proj-summary').value = p.summary;
  document.getElementById('proj-services').value = (p.awsServices || []).join(', ');
  document.getElementById('project-modal-title').textContent = 'Edit Project';
  document.getElementById('project-modal').style.display = 'flex';
};

window.editEvent = function(id) {
  const e = adminState.data.events.find(evt => evt.id === id);
  if (!e) return;
  document.getElementById('evt-id').value = e.id;
  document.getElementById('evt-title').value = e.title;
  document.getElementById('evt-type').value = e.type;
  document.getElementById('evt-date').value = e.date;
  document.getElementById('evt-speaker').value = e.speaker;
  document.getElementById('evt-desc').value = e.description;
  document.getElementById('event-modal-title').textContent = 'Edit Event';
  document.getElementById('event-modal').style.display = 'flex';
};

// ==========================================
// 5. NAVIGATION & MODAL CONTROLLERS
// ==========================================
function setupNavEvents() {
  document.querySelectorAll('.admin-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const tab = item.getAttribute('data-tab');
      switchAdminTab(tab);
    });
  });

  const sidebarToggle = document.getElementById('admin-sidebar-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
  }
}

function setupModalEvents() {
  document.querySelectorAll('.open-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-modal');
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'flex';
        // Reset inputs
        const form = modal.querySelector('form');
        if (form) form.reset();
        const hiddenId = modal.querySelector('input[type="hidden"]');
        if (hiddenId) hiddenId.value = '';
      }
    });
  });

  document.querySelectorAll('.close-modal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) modal.style.display = 'none';
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });
}

function setupFormHandlers() {
  // Project Form
  const projectForm = document.getElementById('project-form');
  if (projectForm) {
    projectForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('proj-id').value;
      const title = document.getElementById('proj-title').value.trim();
      const category = document.getElementById('proj-category').value;
      const tagline = document.getElementById('proj-tagline').value.trim();
      const summary = document.getElementById('proj-summary').value.trim();
      const servicesStr = document.getElementById('proj-services').value.trim();
      const awsServices = servicesStr ? servicesStr.split(',').map(s => s.trim()) : ['AWS Lambda'];

      const payload = { title, category, tagline, summary, awsServices, isDemo: true };

      try {
        let res;
        if (id) {
          res = await fetch(`${API_BASE}/projects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_BASE}/projects`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const json = await res.json();
        if (json.success) {
          showToast(id ? 'Project updated' : 'Project created');
          document.getElementById('project-modal').style.display = 'none';
          loadAllAdminData();
        }
      } catch (err) {
        alert('Error saving project: ' + err.message);
      }
    });
  }

  // Event Form
  const eventForm = document.getElementById('event-form');
  if (eventForm) {
    eventForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('evt-id').value;
      const title = document.getElementById('evt-title').value.trim();
      const type = document.getElementById('evt-type').value;
      const date = document.getElementById('evt-date').value;
      const speaker = document.getElementById('evt-speaker').value.trim();
      const description = document.getElementById('evt-desc').value.trim();

      const payload = { title, type, date, speaker, description, isDemo: true };

      try {
        let res;
        if (id) {
          res = await fetch(`${API_BASE}/events/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        } else {
          res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
        const json = await res.json();
        if (json.success) {
          showToast(id ? 'Event updated' : 'Event created');
          document.getElementById('event-modal').style.display = 'none';
          loadAllAdminData();
        }
      } catch (err) {
        alert('Error saving event: ' + err.message);
      }
    });
  }

  // Member Form
  const memberForm = document.getElementById('member-form');
  if (memberForm) {
    memberForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('mem-name').value.trim();
      const role = document.getElementById('mem-role').value.trim();
      const tier = document.getElementById('mem-tier').value;
      const domain = document.getElementById('mem-domain').value;

      const payload = { name, role, tier, domain, isDemo: true };

      try {
        const res = await fetch(`${API_BASE}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          showToast('Team member added');
          document.getElementById('member-modal').style.display = 'none';
          loadAllAdminData();
        }
      } catch (err) {
        alert('Error saving member: ' + err.message);
      }
    });
  }

  // Settings Form
  const settingsForm = document.getElementById('admin-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        siteName: document.getElementById('set-sitename').value.trim(),
        currentFocus: document.getElementById('set-focus').value.trim(),
        demoMode: document.getElementById('set-demo-mode').checked,
        enableAiAssistant: document.getElementById('set-ai-assistant').checked,
        recruitmentOpen: document.getElementById('set-recruitment').checked
      };

      try {
        const res = await fetch(`${API_BASE}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          showToast('Settings saved successfully');
          loadAllAdminData();
        }
      } catch (err) {
        alert('Error saving settings: ' + err.message);
      }
    });
  }

  // Reset to Seed Button
  const resetBtn = document.getElementById('admin-reset-seed-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      if (!confirm('This will restore all projects, events, and applications back to the clean demo seed data. Continue?')) return;
      try {
        const res = await fetch(`${API_BASE}/seed`, { method: 'POST' });
        const json = await res.json();
        if (json.success) {
          showToast('Database reset to clean demo state');
          loadAllAdminData();
        }
      } catch (err) {
        alert('Error resetting database: ' + err.message);
      }
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i data-lucide="check-circle" style="width: 16px; height: 16px; color: var(--admin-orange);"></i> <span>${message}</span>`;
  container.appendChild(toast);
  initLucideIcons();
  setTimeout(() => {
    toast.remove();
  }, 3500);
}
