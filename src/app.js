/**
 * AWS Student Builder Group (SBG) - VPKBIET
 * Public Portal Controller v2.0 — Premium Cyberpunk Interactive Engine
 */

import { PROJECTS_DATA, MEMBERS_DATA, UPCOMING_EVENTS, DOMAINS_DATA } from './data.js';

const API_BASE = '/api';

const appState = {
  projects: [...PROJECTS_DATA],
  events: [...UPCOMING_EVENTS],
  members: [...MEMBERS_DATA],
  domains: [...DOMAINS_DATA],
  gallery: [],
  settings: {},
  activeProjectCategory: 'All',
  projectSearchQuery: '',
  activeTeamTier: 'All',
  isScoutOpen: false,
  scoutMessages: [
    {
      sender: 'bot',
      text: "Hello! I'm **Ask SBG**, the AI assistant for AWS Student Builder Group at VPKBIET. How can I help you explore our cloud domains, events, or demo architectures today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]
};

const GITHUB_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>`;
const LINKEDIN_ICON_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>`;

function initApp() {
  initHeroThreeCanvas();
  initCommandPalette();
  setupFormSubmissions();
  setupScoutAssistant();
  initScrollRevealObserver();
  initNavbarScroll();
  initHeroTypingAnimation();
  initInteractiveCardTilt();
  initMagneticButtons();

  // Instant render of all core sections from data store
  renderDomains();
  renderProjects();
  setupProjectFilters();
  renderEvents();
  renderMembers();
  setupOrgTreeNav();

  loadPublicData();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

function initLucideIcons() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    try {
      window.lucide.createIcons();
    } catch (e) {
      // Ignore any individual missing icon warnings
    }
  }
}

// ==========================================
// 0. SCROLL REVEAL + NAVBAR SCROLL EFFECTS
// ==========================================
function initScrollRevealObserver() {
  const targets = document.querySelectorAll('.reveal-on-scroll, .stagger-children');
  targets.forEach(el => el.classList.add('visible'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px 60px 0px'
  });

  targets.forEach(el => observer.observe(el));
}

function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  if (!navbar) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 40) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

function initHeroTypingAnimation() {
  const el = document.getElementById('hero-typed-word');
  if (!el) return;

  const words = ['CODING.', 'DEPLOYING.', 'SCALING.', 'INNOVATING.', 'BUILDING.'];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let pauseTimer = 0;

  function tick() {
    const current = words[wordIdx];
    const subStr = current.substring(0, charIdx);
    el.textContent = subStr;
    el.setAttribute('data-text', subStr);

    if (pauseTimer > 0) {
      pauseTimer--;
      requestAnimationFrame(tick);
      return;
    }

    if (!isDeleting) {
      charIdx++;
      el.textContent = current.substring(0, charIdx);
      el.setAttribute('data-text', current.substring(0, charIdx));
      if (charIdx === current.length) {
        pauseTimer = 110; // Pause at end of word
        isDeleting = true;
      }
    } else {
      charIdx--;
      el.textContent = current.substring(0, charIdx);
      el.setAttribute('data-text', current.substring(0, charIdx));
      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        pauseTimer = 25;
      }
    }
    requestAnimationFrame(tick);
  }

  // Start after brief delay
  setTimeout(tick, 800);
}

// ==========================================
// 1. DATA FETCHING FROM REST APIS
// ==========================================
async function loadPublicData() {
  try {
    const [statusRes, domRes, projRes, evtRes, memRes, galRes, setRes] = await Promise.all([
      fetch(`${API_BASE}/status`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/domains`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/projects`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/events`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/members`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/gallery`).then(r => r.json()).catch(() => ({})),
      fetch(`${API_BASE}/settings`).then(r => r.json()).catch(() => ({}))
    ]);

    if (statusRes.success) {
      const statusEl = document.getElementById('strip-status-val');
      if (statusEl) statusEl.textContent = statusRes.status || 'ACTIVE // PROD';
      const focusEl = document.getElementById('strip-focus-val');
      if (focusEl) focusEl.textContent = statusRes.focus || 'AWS • CLOUD • GENAI • DATA';
      const projCountEl = document.getElementById('strip-projects-val');
      if (projCountEl && statusRes.stats?.projectsCount) projCountEl.textContent = `${statusRes.stats.projectsCount} DEMO READY`;
      const evCountEl = document.getElementById('strip-events-val');
      if (evCountEl && statusRes.stats?.eventsCount) evCountEl.textContent = `${statusRes.stats.eventsCount} WORKSHOPS & LABS`;
      const memCountEl = document.getElementById('strip-builders-val');
      if (memCountEl && statusRes.stats?.membersCount) memCountEl.textContent = `${statusRes.stats.membersCount} ACTIVE BUILDERS`;
    }

    if (domRes.success && Array.isArray(domRes.domains) && domRes.domains.length > 0) {
      appState.domains = domRes.domains;
      renderDomains();
    }

    if (projRes.success && Array.isArray(projRes.projects) && projRes.projects.length > 0) {
      appState.projects = projRes.projects;
      renderProjects();
    }

    if (evtRes.success && Array.isArray(evtRes.events) && evtRes.events.length > 0) {
      appState.events = evtRes.events;
      renderEvents();
    }

    if (memRes.success && Array.isArray(memRes.members) && memRes.members.length > 0) {
      appState.members = memRes.members;
      renderMembers();
    }

    if (galRes.success) {
      appState.gallery = galRes.gallery;
      renderGallery();
    }

    if (setRes.success && setRes.settings) {
      appState.settings = setRes.settings;
      const scoutTrigger = document.getElementById('sbg-scout-trigger');
      if (scoutTrigger && setRes.settings.enableAiAssistant === false) {
        scoutTrigger.style.display = 'none';
      }
    }

    initLucideIcons();
  } catch (err) {
    console.error('Error fetching public portal data:', err);
  }
}

// ==========================================
// 2. THREE.JS 3D CONSTELLATION HERO
// ==========================================
function initHeroThreeCanvas() {
  const canvas = document.getElementById('hero-three-canvas');
  if (!canvas || !window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 200;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const isMobile = window.innerWidth < 768;

  // ─── Cyberpunk Coloured Particle Field ───────────────────────────────────
  const particleCount = isMobile ? 45 : 120;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(particleCount * 3);
  const pCol = new Float32Array(particleCount * 3);
  const pVel = [];

  const palette = [
    [0.0,  1.0,  0.96], // #00FFF5 cyber cyan
    [1.0,  0.6,  0.0],  // #FF9900 AWS smile orange
    [0.54, 0.36, 0.96], // #8B5CF6 neon purple
    [0.06, 0.72, 0.50], // #10B981 emerald
    [1.0,  0.18, 0.47], // #FF2D78 neon magenta
  ];

  for (let i = 0; i < particleCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 550;
    pPos[i*3+1] = (Math.random() - 0.5) * 350;
    pPos[i*3+2] = (Math.random() - 0.5) * 160;
    pVel.push({ x: (Math.random()-0.5)*0.08, y: (Math.random()-0.5)*0.06, z: (Math.random()-0.5)*0.05 });
    const c = palette[Math.floor(Math.random() * palette.length)];
    pCol[i*3] = c[0]; pCol[i*3+1] = c[1]; pCol[i*3+2] = c[2];
  }

  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute('color',    new THREE.BufferAttribute(pCol, 3));
  const pMat = new THREE.PointsMaterial({
    size: isMobile ? 1.6 : 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.45,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // ─── AWS Logo — Big, Stationary, Ultra-Shiny Metallic Background ────────
  const logoGroup = new THREE.Group();
  logoGroup.position.set(0, 0, 0); // Stationary in center background
  scene.add(logoGroup);

  // Dynamic Lighting Setup with Travelling Shiny Specular Glint
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(50, 70, 90);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x00FFF5, 2.6);
  rimLight.position.set(-70, 40, 50);
  scene.add(rimLight);

  // Dynamic travelling specular shine light that sweeps across the letters
  const shineLight = new THREE.PointLight(0xffffff, 4.5, 320);
  shineLight.position.set(0, 20, 60);
  scene.add(shineLight);

  const orangeLight = new THREE.PointLight(0xFF9900, 5.5, 300);
  orangeLight.position.set(0, -35, 55);
  scene.add(orangeLight);

  const magentaLight = new THREE.PointLight(0xFF2D78, 1.4, 200);
  magentaLight.position.set(-50, -30, 30);
  scene.add(magentaLight);

  scene.add(new THREE.AmbientLight(0x08121C, 2.5));

  let awsLogoModel = null;
  let arrowMat = null;
  let letterMat = null;

  const LoaderClass = window.THREE.GLTFLoader || window.GLTFLoader;
  if (LoaderClass) {
    new LoaderClass().load('/public/aws_logo.glb', (gltf) => {
      awsLogoModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(awsLogoModel);
      const center = box.getCenter(new THREE.Vector3());
      const size   = box.getSize(new THREE.Vector3());
      // Make it BIG (scale ~92 on desktop, ~68 on mobile)
      const targetSize = isMobile ? 68.0 : 92.0;
      const s = targetSize / (Math.max(size.x, size.y, size.z) || 1);
      awsLogoModel.scale.setScalar(s);
      awsLogoModel.position.set(-center.x * s, -center.y * s, -center.z * s);

      // Ultra-shiny chrome metallic materials
      arrowMat = new THREE.MeshStandardMaterial({
        color: 0xFF9900,
        roughness: 0.10,          // Mirror gloss
        metalness: 0.88,          // High metallic
        emissive: 0xFF7700,
        emissiveIntensity: 0.80
      });
      letterMat = new THREE.MeshStandardMaterial({
        color: 0xF8FAFC,
        roughness: 0.08,          // Ultra-glossy specular reflection
        metalness: 0.96,          // Brilliant chrome finish
        emissive: 0x051220,
        emissiveIntensity: 0.25
      });
      awsLogoModel.traverse(c => {
        if (c.isMesh) c.material = c.name.toLowerCase().includes('arrow') ? arrowMat : letterMat;
      });
      logoGroup.add(awsLogoModel);
    }, undefined, err => console.warn('[AWS SBG] GLTF load error:', err));
  }

  // ─── Rock-Solid Damped Cursor Parallax ──────────────────────────────────
  let rawMX = 0, rawMY = 0, smMX = 0, smMY = 0;
  window.addEventListener('mousemove', e => {
    // Subtle normalized coordinates (-1 to 1)
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    rawMX = nx * 0.12; // Bounded to subtle ~7 degrees
    rawMY = ny * 0.08;
  }, { passive: true });

  // ─── Animation Loop — Stationary, Grand, Shiny ─────────────────────────
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.003;

    // Heavy exponential damping on mouse for rock-solid stability
    smMX += (rawMX - smMX) * 0.025;
    smMY += (rawMY - smMY) * 0.025;

    // Travelling specular shine glint across the shiny letters
    shineLight.position.x = Math.sin(time * 0.85) * 115;
    shineLight.position.y = Math.cos(time * 0.55) * 35;
    shineLight.position.z = 60 + Math.sin(time * 0.4) * 10;

    if (awsLogoModel) {
      // Stationary in center background with slow majestic breathing
      logoGroup.position.set(0, 5 + Math.sin(time * 0.5) * 1.5, 0);
      logoGroup.rotation.y = Math.sin(time * 0.22) * 0.16 + smMX;
      logoGroup.rotation.x = Math.sin(time * 0.16) * 0.06 - smMY;
      logoGroup.scale.setScalar(1 + Math.sin(time * 0.6) * 0.012);
    }

    // Particle field slow drift in background
    const pos = pGeo.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      pos[i*3]   += pVel[i].x;
      pos[i*3+1] += pVel[i].y;
      pos[i*3+2] += pVel[i].z;
      if (Math.abs(pos[i*3])   > 270) pVel[i].x *= -1;
      if (Math.abs(pos[i*3+1]) > 175) pVel[i].y *= -1;
      if (Math.abs(pos[i*3+2]) >  80) pVel[i].z *= -1;
    }
    pGeo.attributes.position.needsUpdate = true;
    particles.rotation.y += 0.00015;
    particles.rotation.x += 0.00004;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    if (!canvas) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ==========================================
// 3. DOMAINS SECTION
// ==========================================

function renderDomains() {
  const container = document.getElementById('domains-grid');
  if (!container) return;

  container.innerHTML = appState.domains.map(dom => `
    <div class="glass-card" style="padding: 1.5rem; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.65rem;">
          <span class="service-pill aws-orange">${dom.status}</span>
          <i data-lucide="cpu" style="width: 16px; height: 16px; color: var(--aws-smile-orange);"></i>
        </div>
        <h3 style="font-size: 1.15rem; margin-bottom: 0.4rem;">${dom.name}</h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.55;">
          ${dom.shortDesc}
        </p>

        <div style="font-size: 0.68rem; text-transform: uppercase; font-weight: 700; color: var(--text-muted); margin-bottom: 0.35rem; letter-spacing: 0.04em;">
          Core Technologies:
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1.25rem;">
          ${dom.technologies.map(t => `<span class="service-pill aws-blue">${t}</span>`).join('')}
        </div>
      </div>

      <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.85rem; font-size: 0.76rem; color: var(--aws-smile-orange); font-family: var(--font-mono);">
        ${dom.leadPlaceholder}
      </div>
    </div>
  `).join('');

  initLucideIcons();
}

// ==========================================
// 4. FEATURED DEMO PROJECTS
// ==========================================
function renderProjects() {
  const container = document.getElementById('public-projects-grid');
  if (!container) return;

  const catColors = {
    agtech: '#10B981', genai: '#8B5CF6', serverless: '#FF9900',
    iot: '#06B6D4', devops: '#F43F5E', default: '#00A4E4',
    cloud: '#00A4E4', ai: '#8B5CF6', web: '#06B6D4', data: '#10B981',
    'open source': '#FF9900'
  };

  const filtered = appState.projects.filter(p => {
    const active = (appState.activeProjectCategory || 'All').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    
    let matchesCat = active === 'all';
    if (!matchesCat) {
      if (active === 'cloud' && (cat.includes('cloud') || cat.includes('serverless') || cat.includes('agtech') || cat.includes('devops'))) matchesCat = true;
      else if (active === 'ai' && (cat.includes('ai') || cat.includes('genai') || cat.includes('vision') || cat.includes('bedrock'))) matchesCat = true;
      else if (active === 'web' && (cat.includes('web') || cat.includes('serverless') || cat.includes('retail') || cat.includes('queue'))) matchesCat = true;
      else if (active === 'data' && (cat.includes('data') || cat.includes('iot') || cat.includes('analytics') || cat.includes('telemetry'))) matchesCat = true;
      else if (active === 'open source' && (cat.includes('open source') || cat.includes('devops') || cat.includes('cdk') || cat.includes('utility'))) matchesCat = true;
      else if (cat.includes(active)) matchesCat = true;
    }

    const q = (appState.projectSearchQuery || '').toLowerCase().trim();
    const matchesQuery = !q ||
      p.title.toLowerCase().includes(q) ||
      (p.tagline || '').toLowerCase().includes(q) ||
      (p.summary || '').toLowerCase().includes(q) ||
      (p.awsServices || []).some(s => s.toLowerCase().includes(q)) ||
      (p.technologies || []).some(t => t.toLowerCase().includes(q));

    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:3rem 1rem;"><i data-lucide="layers" style="width:36px;height:36px;color:var(--text-muted);margin-bottom:0.65rem;"></i><h4>No matching projects found</h4><p style="font-size:0.82rem;color:var(--text-secondary);">Try selecting 'All' or searching for another AWS service.</p></div>`;
    initLucideIcons();
    return;
  }

  container.innerHTML = filtered.map(p => {
    const colKey = (p.category || 'default').toLowerCase();
    let col = catColors.default;
    for (const [k, v] of Object.entries(catColors)) {
      if (colKey.includes(k)) { col = v; break; }
    }

    const rawMetrics = p.metrics || [];
    const metrics = rawMetrics.slice(0, 3).map(m => {
      if (typeof m === 'string') {
        const match = m.match(/label=([^;]+);\s*val=([^}]+)/);
        if (match) return { label: match[1], val: match[2] };
        return { label: 'Metric', val: m };
      }
      return m;
    });

    const contribs = (p.contributors || p.team || []).slice(0, 3);
    const badge = p.badge || p.category || 'Demo Project';

    return `<div class="glass-card cyber-project-card" style="padding:1.5rem;display:flex;flex-direction:column;border:1px solid rgba(255,255,255,0.08);background:rgba(15,20,25,0.85);backdrop-filter:blur(16px);">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:0.75rem;">
        <div style="display:flex;gap:0.35rem;align-items:center;">
          <span style="font-family:var(--font-mono);font-size:0.62rem;font-weight:700;padding:0.18rem 0.5rem;border-radius:5px;background:${col}18;border:1px solid ${col}40;color:${col};text-transform:uppercase;letter-spacing:0.06em;">${p.category}</span>
          <span style="font-family:var(--font-mono);font-size:0.6rem;padding:0.15rem 0.45rem;border-radius:4px;background:rgba(255,153,0,0.08);border:1px solid rgba(255,153,0,0.25);color:#FF9900;">${badge}</span>
        </div>
        <div style="width:8px;height:8px;border-radius:50%;background:${col};box-shadow:0 0 8px ${col};"></div>
      </div>
      <h3 style="font-size:1.15rem;margin-bottom:0.25rem;">${p.title}</h3>
      <p style="font-size:0.8rem;font-weight:600;color:${col};margin-bottom:0.6rem;line-height:1.4;">${p.tagline}</p>
      <p style="font-size:0.8rem;color:var(--text-secondary);line-height:1.55;margin-bottom:1rem;flex-grow:1;">${p.summary}</p>
      ${metrics.length > 0 ? `<div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">${metrics.map(m => `<div class="cyber-metric-badge"><div class="cyber-metric-val">${m.val}</div><div class="cyber-metric-label">${m.label}</div></div>`).join('')}</div>` : ''}
      <div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:1rem;">${(p.awsServices||[]).map(s=>`<span class="service-pill aws-blue">${s}</span>`).join('')}</div>
      ${contribs.length > 0 ? `<div style="font-size:0.68rem;color:var(--text-muted);margin-bottom:0.85rem;font-family:var(--font-mono);">&#128101; ${contribs.join(' &middot; ')}</div>` : ''}
      <div style="border-top:1px solid var(--border-subtle);padding-top:0.85rem;display:flex;align-items:center;justify-content:space-between;">
        <div style="display:flex;gap:0.4rem;">
          <a href="${p.githubUrl||'#'}" target="_blank" class="btn-ghost icon-btn" title="GitHub Repository">${GITHUB_ICON_SVG}</a>
          <a href="${p.demoUrl||'#'}" target="_blank" class="btn-ghost icon-btn" title="Live Demo / Docs"><i data-lucide="external-link" style="width:15px;height:15px;"></i></a>
        </div>
        <button class="btn btn-secondary" style="padding:0.38rem 0.7rem;font-size:0.75rem;border-color:${col}40;" onclick="openProjectArchitectureModal('${p.id}')">Architecture <i data-lucide="arrow-right" style="width:12px;height:12px;"></i></button>
      </div>
    </div>`;
  }).join('');
  initLucideIcons();
}

function setupProjectFilters() {
  document.querySelectorAll('#project-filter-buttons .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#project-filter-buttons .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.activeProjectCategory = btn.getAttribute('data-cat');
      renderProjects();
    });
  });

  const searchInput = document.getElementById('project-search-bar');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      appState.projectSearchQuery = e.target.value;
      renderProjects();
    });
  }
}

window.openProjectArchitectureModal = function(projectId) {
  const p = appState.projects.find(proj => proj.id === projectId);
  if (!p) return;

  const modal = document.getElementById('project-detail-modal');
  const content = document.getElementById('modal-project-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="padding: 1.5rem 1.75rem; border-bottom: 1px solid var(--border-subtle); display: flex; align-items: flex-start; justify-content: space-between;">
      <div>
        <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.35rem;">
          <span class="service-pill aws-orange">${p.category}</span>
          <span class="demo-tag">Reference Architecture / Demo</span>
        </div>
        <h2 style="font-size: 1.6rem;">${p.title}</h2>
        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.2rem;">${p.tagline}</p>
      </div>
      <button class="btn-ghost icon-btn" onclick="document.getElementById('project-detail-modal').style.display='none'">
        <i data-lucide="x" style="width: 18px; height: 18px;"></i>
      </button>
    </div>

    <div style="padding: 1.75rem;">
      <h4 style="color: var(--aws-smile-orange); margin-bottom: 0.45rem; font-size: 0.95rem;">System Overview</h4>
      <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; font-size: 0.88rem;">${p.summary}</p>

      <h4 style="color: var(--aws-cloud-blue); margin-bottom: 0.85rem; font-size: 0.95rem;">AWS Architecture Flow</h4>
      <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.75rem;">
        ${((p.architecture?.steps || p.architecture?.diagramSteps) || []).map((step, idx) => `
          <div style="display: flex; gap: 0.85rem; align-items: flex-start; background: rgba(15, 20, 25, 0.7); border: 1px solid var(--border-subtle); padding: 0.85rem; border-radius: 10px;">
            <div style="width: 26px; height: 26px; border-radius: 8px; background: var(--aws-orange-muted); border: 1px solid rgba(255, 153, 0, 0.2); color: var(--aws-smile-orange); display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--font-mono); font-size: 0.75rem; flex-shrink: 0;">
              ${idx + 1}
            </div>
            <div>
              <div style="font-weight: 600; color: var(--text-primary); font-size: 0.88rem; margin-bottom: 0.15rem;">${step.title}</div>
              <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.5;">${step.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.65rem; border-top: 1px solid var(--border-subtle); padding-top: 1.25rem;">
        <a href="${p.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 0.82rem; display: inline-flex; align-items: center; gap: 0.4rem;">
          ${GITHUB_ICON_SVG} GitHub Template
        </a>
        <button class="btn btn-primary" style="font-size: 0.82rem;" onclick="document.getElementById('project-detail-modal').style.display='none'">
          Close Spec
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  initLucideIcons();
};

// ==========================================
// 5. UPCOMING EVENTS
// ==========================================
function renderEvents() {
  const container = document.getElementById('public-events-list');
  if (!container) return;

  container.innerHTML = appState.events.map(e => `
    <div class="glass-card" style="padding: 1.5rem;">
      <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-start; gap: 0.85rem; margin-bottom: 0.85rem;">
        <div>
          <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.35rem;">
            <span class="service-pill aws-orange">${e.type}</span>
            ${e.isDemo ? '<span class="demo-tag">Demo Event</span>' : ''}
          </div>
          <h3 style="font-size: 1.25rem;">${e.title}</h3>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-mono); font-weight: 700; color: var(--aws-smile-orange); font-size: 0.88rem;">${e.date}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${e.time}</div>
        </div>
      </div>

      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.1rem; line-height: 1.6;">
        ${e.description}
      </p>

      <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.85rem; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
        <div style="font-size: 0.78rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.4rem;">
          <i data-lucide="map-pin" style="width: 13px; height: 13px; color: var(--aws-cloud-blue);"></i>
          ${e.venue || e.location || 'VPKBIET Campus'} • Speaker: <strong style="color: var(--text-primary);">${e.speaker || 'AWS Community Mentors'}</strong>
        </div>

        <button class="btn btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.78rem;" onclick="openEventRegistrationModal('${e.title}')">
          RSVP (Demo) <i data-lucide="chevron-right" style="width: 13px; height: 13px;"></i>
        </button>
      </div>
    </div>
  `).join('');

  initLucideIcons();
}

window.openEventRegistrationModal = function(title) {
  const modal = document.getElementById('event-reg-modal');
  const titleEl = document.getElementById('reg-event-title');
  if (titleEl) titleEl.textContent = title;
  if (modal) modal.style.display = 'flex';
};

// ==========================================
// 6. TEAM DIRECTORY
// ==========================================
function renderMembers() {
  const container = document.getElementById('public-members-grid');
  if (!container) return;

  const filtered = appState.members.filter(m =>
    appState.activeTeamTier === 'All' || m.tier === appState.activeTeamTier
  );

  container.innerHTML = filtered.map(m => {
    const initials = m.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const col = m.avatarColor || '#FF9900';
    const certs = (m.certifications || []).slice(0, 2);
    const skills = (m.skills || []).slice(0, 5);
    const tierIcon = m.tier === 'Faculty Coordination' ? '&#127891;' : m.tier === 'Team Leadership' ? '&#9889;' : '&#128296;';
    return `<div class="glass-card cyber-profile-card" style="padding:1.4rem;--member-color:${col};">
      <div style="display:flex;align-items:flex-start;gap:0.85rem;margin-bottom:0.85rem;">
        <div class="cyber-avatar" style="background:linear-gradient(135deg,${col}22,${col}44);border:1.5px solid ${col}55;">
          <span style="color:${col};font-size:1.05rem;position:relative;z-index:1;">${initials}</span>
        </div>
        <div style="flex:1;min-width:0;">
          <h3 style="font-size:1rem;margin-bottom:0.12rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.name}</h3>
          <div style="font-size:0.72rem;color:${col};font-weight:700;margin-bottom:0.12rem;line-height:1.3;">${m.role}</div>
          <div style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);">${tierIcon} ${m.tier}</div>
        </div>
      </div>
      <div style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono);margin-bottom:0.65rem;background:rgba(255,255,255,0.03);padding:0.3rem 0.6rem;border-radius:6px;border:1px solid var(--border-subtle);">&#128208; ${m.branch || 'CS/IT'} &nbsp;|&nbsp; ${m.year || 'TE'}</div>
      <p style="font-size:0.75rem;color:var(--text-secondary);line-height:1.55;margin-bottom:0.85rem;">${m.bio}</p>
      ${certs.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.65rem;">${certs.map(c=>`<span class="cyber-cert-pill">&#10022; ${c}</span>`).join('')}</div>` : ''}
      ${skills.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:0.25rem;margin-bottom:0.85rem;">${skills.map(s=>`<span class="cyber-skill-pill">${s}</span>`).join('')}</div>` : ''}
      <div style="display:flex;gap:0.5rem;border-top:1px solid var(--border-subtle);padding-top:0.75rem;align-items:center;">
        <a href="${m.github||'#'}" target="_blank" class="cyber-social-btn" title="GitHub Profile">${GITHUB_ICON_SVG}</a>
        <a href="${m.linkedin||'#'}" target="_blank" class="cyber-social-btn" title="LinkedIn Profile">${LINKEDIN_ICON_SVG}</a>
        <span style="flex:1;"></span>
        <span style="font-size:0.62rem;font-family:var(--font-mono);color:var(--text-muted);padding:0.15rem 0.4rem;background:rgba(255,255,255,0.03);border-radius:4px;border:1px solid var(--border-subtle);">${m.domain}</span>
      </div>
    </div>`;
  }).join('');
  initLucideIcons();
}

function setupOrgTreeNav() {
  document.querySelectorAll('#org-tree-nav .org-tree-tier-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#org-tree-nav .org-tree-tier-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      appState.activeTeamTier = btn.getAttribute('data-tier');
      renderMembers();
    });
  });
}

// ==========================================
// 7. GALLERY & LIGHTBOX
// ==========================================
function renderGallery() {
  const container = document.getElementById('public-gallery-grid');
  if (!container) return;

  container.innerHTML = appState.gallery.map(g => `
    <div class="gallery-item" onclick="openLightbox('${g.imageUrl}', '${g.title}', '${g.caption}')">
      <img src="${g.imageUrl}" alt="${g.title}" loading="lazy" />
      <div class="gallery-overlay">
        <span class="service-pill aws-orange" style="margin-bottom: 0.2rem; font-size: 0.62rem;">${g.category}</span>
        <div style="font-weight: 700; color: #FFF; font-size: 0.9rem;">${g.title}</div>
        <div style="font-size: 0.74rem; color: var(--text-secondary);">${g.caption}</div>
      </div>
    </div>
  `).join('');
}

window.openLightbox = function(url, title, caption) {
  const lb = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const t = document.getElementById('lightbox-title');
  const c = document.getElementById('lightbox-caption');

  if (!lb || !img) return;
  img.src = url;
  if (t) t.textContent = title;
  if (c) c.textContent = caption;
  lb.style.display = 'flex';
};

const lbClose = document.getElementById('lightbox-close-btn');
if (lbClose) {
  lbClose.addEventListener('click', () => {
    document.getElementById('lightbox-modal').style.display = 'none';
  });
}

// ==========================================
// 8. FORM SUBMISSIONS
// ==========================================
function setupFormSubmissions() {
  // Recruitment Form
  const recForm = document.getElementById('public-recruitment-form');
  if (recForm) {
    recForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('rec-name').value.trim(),
        email: document.getElementById('rec-email').value.trim(),
        prn: document.getElementById('rec-prn').value.trim(),
        year: document.getElementById('rec-year').value,
        domain: document.getElementById('rec-domain').value,
        skills: document.getElementById('rec-skills').value.trim(),
        github: document.getElementById('rec-github').value.trim(),
        linkedin: document.getElementById('rec-linkedin').value.trim(),
        pitch: document.getElementById('rec-pitch').value.trim()
      };

      try {
        const res = await fetch(`${API_BASE}/recruitments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          recForm.style.display = 'none';
          const successMsg = document.getElementById('recruitment-success-msg');
          if (successMsg) successMsg.style.display = 'block';
        } else {
          alert('Error: ' + json.message);
        }
      } catch (err) {
        alert('Submission failed: ' + err.message);
      }
    });
  }

  // Contact Form
  const cntForm = document.getElementById('public-contact-form');
  if (cntForm) {
    cntForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('cnt-name').value.trim(),
        email: document.getElementById('cnt-email').value.trim(),
        subject: document.getElementById('cnt-subject').value.trim(),
        message: document.getElementById('cnt-msg').value.trim()
      };

      try {
        const res = await fetch(`${API_BASE}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.success) {
          cntForm.reset();
          const succ = document.getElementById('contact-success-msg');
          if (succ) {
            succ.style.display = 'block';
            setTimeout(() => { succ.style.display = 'none'; }, 5000);
          }
        }
      } catch (err) {
        alert('Message submission failed: ' + err.message);
      }
    });
  }
}

window.resetRecruitmentForm = function() {
  const form = document.getElementById('public-recruitment-form');
  const succ = document.getElementById('recruitment-success-msg');
  if (form) {
    form.reset();
    form.style.display = 'block';
  }
  if (succ) succ.style.display = 'none';
};

// ==========================================
// 9. COMMAND PALETTE (CMD + K)
// ==========================================
function initCommandPalette() {
  const modal = document.getElementById('command-palette-modal');
  const trigger = document.getElementById('command-palette-trigger');
  const input = document.getElementById('palette-search-input');

  function toggle(open) {
    if (!modal) return;
    modal.style.display = open ? 'flex' : 'none';
    if (open && input) {
      input.value = '';
      input.focus();
    }
  }

  if (trigger) trigger.addEventListener('click', () => toggle(true));

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggle(true);
    } else if (e.key === 'Escape') {
      toggle(false);
      const projModal = document.getElementById('project-detail-modal');
      if (projModal) projModal.style.display = 'none';
      const lb = document.getElementById('lightbox-modal');
      if (lb) lb.style.display = 'none';
    }
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) toggle(false);
    });
  }

  document.querySelectorAll('.palette-item').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      toggle(false);
      if (action === 'nav') {
        const target = item.getAttribute('data-target');
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'link') {
        window.location.href = item.getAttribute('data-url');
      }
    });
  });
}

// ==========================================
// 10. ASK SBG AI ASSISTANT DRAWER
// ==========================================
function setupScoutAssistant() {
  const trigger = document.getElementById('sbg-scout-trigger');
  const drawer = document.getElementById('sbg-scout-drawer');
  const closeBtn = document.getElementById('scout-close-btn');
  const form = document.getElementById('scout-chat-form');
  const input = document.getElementById('scout-chat-input');
  const container = document.getElementById('scout-messages');

  window.toggleScoutAi = function(open) {
    appState.isScoutOpen = open !== undefined ? open : !appState.isScoutOpen;
    if (drawer) drawer.classList.toggle('open', appState.isScoutOpen);
    if (appState.isScoutOpen && input) input.focus();
  };

  if (trigger) trigger.addEventListener('click', () => toggleScoutAi(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleScoutAi(false));

  document.querySelectorAll('.scout-prompt-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-q');
      handleUserScoutQuery(q);
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      handleUserScoutQuery(text);
    });
  }

  function handleUserScoutQuery(query) {
    appState.scoutMessages.push({
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    renderScoutMessages();

    setTimeout(() => {
      const reply = generateSafeScoutResponse(query);
      appState.scoutMessages.push({
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      renderScoutMessages();
    }, 600);
  }

  function generateSafeScoutResponse(query) {
    const q = query.toLowerCase();

    if (q.includes('what is') || q.includes('about') || q.includes('who')) {
      return "### AWS Student Builder Group — VPKBIET\nWe are a student-run technical community at Vidya Pratishthan's Kamalnayan Bajaj Institute of Engineering and Technology, Baramati.\n\nOur philosophy is **'Learn → Build → Collaborate → Ship → Share'**, focusing on AWS cloud architectures, generative AI, serverless engineering, and open-source practices.";
    }

    if (q.includes('domain') || q.includes('team') || q.includes('track')) {
      return "### Core Technical Domains\nWe operate across 8 specialized domains:\n1. **Cloud & DevOps** (AWS CDK, Terraform, Docker)\n2. **AI & Machine Learning** (Amazon Bedrock, Python)\n3. **Data & Analytics** (Athena, QuickSight, Glue)\n4. **Software Engineering** (Next.js, TypeScript, DynamoDB)\n5. **Open Source & Systems**\n6. **UI/UX & Creative Tech**\n7. **Community & DevRel**\n8. **Events & Operations**";
    }

    if (q.includes('event') || q.includes('workshop') || q.includes('bootcamp')) {
      return "### Upcoming Events (Demo Schedule)\n- **AWS Cloud Foundations Workshop (Demo)** — Introductory session covering EC2, S3, and IAM security.\n- **Serverless Architecture Hands-on Lab (Demo)** — Build event-driven APIs with AWS Lambda & DynamoDB.\n- **Build with Generative AI (Demo Hackathon)** — Model tuning & RAG with Amazon Bedrock.\n\n*RSVP via the Events section on this page!*";
    }

    if (q.includes('join') || q.includes('recruit') || q.includes('apply')) {
      return "### How to Join\nEnrolled VPKBIET students can apply anytime via the **'Become a Builder'** recruitment form on this portal.\n\nSelect your preferred domain, share your technical interests, and your application will be reviewed in the administrative pipeline!";
    }

    if (q.includes('project')) {
      return "### Featured Projects (Reference Demos)\nCheck out our interactive project case studies on the page:\n- **Serverless Community Portal (Demo)**\n- **AI Learning Assistant (Demo)**\n- **Campus Event Platform (Demo)**\n- **Cloud Analytics Dashboard (Demo)**\n\nClick **'Architecture'** on any card to view its cloud flow diagram!";
    }

    return `### AWS Cloud Guidance\nThanks for asking about **"${query}"**!\n\nAs student builders, we follow the **AWS Well-Architected Framework** focusing on Security, Reliability, Performance, and Cost Optimization.\n\nFeel free to explore our domains, check out upcoming demo workshops, or access the admin console via the top navigation bar!`;
  }

  function renderScoutMessages() {
    if (!container) return;

    container.innerHTML = appState.scoutMessages.map(msg => {
      const isBot = msg.sender === 'bot';
      let formatted = msg.text
        .replace(/### (.*?)\n/g, '<div style="font-weight: 700; color: var(--aws-smile-orange); margin-bottom: 0.3rem; font-size: 0.9rem;">$1</div>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');

      return `
        <div class="chat-msg" style="${isBot ? 'align-self: flex-start;' : 'align-self: flex-end;'}">
          <div style="font-size: 0.65rem; color: var(--text-muted); margin-bottom: 0.15rem; ${isBot ? '' : 'text-align: right;'}">
            ${isBot ? '<span class="service-pill aws-orange" style="font-size: 0.58rem; padding: 0.1rem 0.25rem;">Ask SBG</span>' : 'You'} • ${msg.time}
          </div>
          <div class="chat-bubble ${isBot ? 'bot-bubble' : 'user-bubble'}">
            ${formatted}
          </div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
    initLucideIcons();
  }

  renderScoutMessages();
}


// ==========================================
// INTERACTIVE CARD TILT & MAGNETIC BUTTONS
// ==========================================
function initInteractiveCardTilt() {
  function attachTilt() {
    const cards = document.querySelectorAll('.glass-card, .project-card, .event-card, .team-card, .cyber-project-card, .cyber-profile-card');
    cards.forEach(card => {
      if (card.dataset.tiltAttached) return;
      card.dataset.tiltAttached = 'true';
      card.classList.add('tilt-enabled');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        // Subtle, smooth tilt (max 3deg) with smooth interpolation
        card.style.transform = `perspective(1000px) rotateX(${-y * 3.5}deg) rotateY(${x * 3.5}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  attachTilt();
  const observer = new MutationObserver(() => attachTilt());
  const main = document.querySelector('main');
  if (main) observer.observe(main, { childList: true, subtree: true });
}

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-pill-dark, .btn-pill-outline, .cyber-glow-btn, .cyber-ai-btn');
  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      // Gentle, subtle magnetic pull (0.06 factor instead of 0.2)
      btn.style.transform = `translate3d(${x * 0.06}px, ${y * 0.06}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}