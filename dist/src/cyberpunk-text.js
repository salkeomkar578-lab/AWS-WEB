/**
 * AWS SBG VPKBIET — Cyberpunk Terminal Text Animation
 * Injects a glitching terminal overlay into the hero section
 */

const TERMINAL_SEQUENCES = [
  { prefix: '$ ', text: 'aws deploy --region ap-south-1', color: '#00FFF5', delay: 0 },
  { prefix: '  > ', text: 'Packaging Lambda functions...', color: '#8B95A5', delay: 1200 },
  { prefix: '✓ ', text: 'EcoNutri AI deployed successfully', color: '#39FF14', delay: 2200 },
  { prefix: '$ ', text: 'bedrock invoke-model --model-id claude-3-5', color: '#00FFF5', delay: 3800 },
  { prefix: '  > ', text: 'Processing soil nutrient data...', color: '#8B95A5', delay: 4800 },
  { prefix: '✓ ', text: 'Marathi advisory generated in 1.1s', color: '#39FF14', delay: 5800 },
  { prefix: '$ ', text: 'cdk deploy SkipShopStack --all', color: '#00FFF5', delay: 7400 },
  { prefix: '✓ ', text: 'Checkout latency: 4.5s | Accuracy: 99.2%', color: '#FF9900', delay: 8600 },
  { prefix: '$ ', text: 'aws lambda invoke --region ap-south-1', color: '#00FFF5', delay: 10200 },
  { prefix: '✓ ', text: 'BuildOn AI hackathon: 650+ orders/day', color: '#39FF14', delay: 11400 },
  { prefix: '  ', text: '───────────────────────────────────────', color: '#1e2d3d', delay: 12800 },
  { prefix: '$ ', text: 'git push origin main --force-with-lease', color: '#00FFF5', delay: 13400 },
  { prefix: '✓ ', text: 'CI/CD pipeline triggered. Build #247', color: '#39FF14', delay: 14600 },
];

const GLITCH_CHARS = '!@#$%^&*<>[]{}|\\~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01';

export function initCyberpunkTerminal(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Inject CSS keyframes once
  injectCyberpunkStyles();

  const terminal = document.createElement('div');
  terminal.className = 'cyber-terminal';
  terminal.innerHTML = `
    <div class="cyber-terminal-header">
      <span class="cyber-dot red"></span>
      <span class="cyber-dot yellow"></span>
      <span class="cyber-dot green"></span>
      <span class="cyber-terminal-title">aws-sbg-vpkbiet — terminal v2.1</span>
      <span class="cyber-terminal-region">ap-south-1</span>
    </div>
    <div class="cyber-terminal-body" id="cyber-term-body">
      <div class="cyber-cursor-line">
        <span class="cyber-prompt">SBG@VPKBIET</span>
        <span class="cyber-path">:~/cloud$</span>
        <span class="cyber-blink">▋</span>
      </div>
    </div>
  `;
  container.appendChild(terminal);

  const body = document.getElementById('cyber-term-body');
  let loopTimeout = null;

  function typeText(lineEl, text, color, speed = 42) {
    return new Promise(resolve => {
      let i = 0;
      const span = document.createElement('span');
      span.style.color = color;
      lineEl.appendChild(span);
      const iv = setInterval(() => {
        if (i < text.length) {
          // Occasional glitch character
          if (Math.random() < 0.04) {
            const glitch = document.createElement('span');
            glitch.textContent = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            glitch.style.color = '#FF2D78';
            glitch.style.opacity = '0.7';
            span.appendChild(glitch);
            setTimeout(() => {
              if (glitch.parentNode) glitch.parentNode.removeChild(glitch);
            }, 80);
          }
          span.append(text[i]);
          i++;
        } else {
          clearInterval(iv);
          resolve();
        }
      }, speed);
    });
  }

  async function runSequence() {
    // Clear old lines (keep last 8)
    const lines = body.querySelectorAll('.cyber-line');
    if (lines.length > 8) {
      for (let i = 0; i < lines.length - 8; i++) {
        lines[i].remove();
      }
    }

    for (const seq of TERMINAL_SEQUENCES) {
      await new Promise(res => setTimeout(res, seq.delay === 0 ? 600 : 0));

      const line = document.createElement('div');
      line.className = 'cyber-line';

      const prefix = document.createElement('span');
      prefix.textContent = seq.prefix;
      prefix.className = 'cyber-prefix';
      line.appendChild(prefix);
      body.insertBefore(line, body.lastElementChild);

      await typeText(line, seq.text, seq.color, seq.text.includes('───') ? 5 : 38);

      // Scroll to bottom
      body.scrollTop = body.scrollHeight;
    }

    // Wait then restart
    loopTimeout = setTimeout(runSequence, 3500);
  }

  // Start after short delay
  setTimeout(runSequence, 800);

  return {
    destroy() {
      if (loopTimeout) clearTimeout(loopTimeout);
      container.removeChild(terminal);
    }
  };
}

export function initFloatingCodeWords(parentEl) {
  const words = [
    'Lambda', 'Bedrock', 'S3', 'ECS', 'DynamoDB', 'IAM',
    'CDK', 'Fargate', 'CloudWatch', 'EventBridge', 'Cognito',
    'Amplify', 'AppSync', 'Rekognition', 'Transcribe', 'SageMaker'
  ];

  const container = document.createElement('div');
  container.className = 'cyber-float-words';
  parentEl.appendChild(container);

  words.forEach((word, i) => {
    const el = document.createElement('span');
    el.className = 'cyber-float-word';
    el.textContent = word;
    el.style.cssText = `
      left: ${10 + (i * 6.1) % 80}%;
      animation-delay: ${(i * 0.7) % 8}s;
      animation-duration: ${12 + (i * 1.3) % 10}s;
      font-size: ${0.58 + (i % 3) * 0.08}rem;
      opacity: ${0.12 + (i % 4) * 0.04};
    `;
    container.appendChild(el);
  });
}

function injectCyberpunkStyles() {
  if (document.getElementById('cyber-styles')) return;
  const style = document.createElement('style');
  style.id = 'cyber-styles';
  style.textContent = `
    /* ===== CYBERPUNK TERMINAL ===== */
    .cyber-terminal {
      background: rgba(5, 10, 18, 0.92);
      border: 1px solid rgba(0, 255, 245, 0.2);
      border-radius: 12px;
      overflow: hidden;
      box-shadow:
        0 0 40px rgba(0, 255, 245, 0.06),
        0 0 1px rgba(0, 255, 245, 0.4),
        inset 0 0 40px rgba(0, 0, 0, 0.4);
      max-width: 520px;
      width: 100%;
      backdrop-filter: blur(16px);
      position: relative;
    }

    .cyber-terminal::before {
      content: '';
      position: absolute;
      inset: 0;
      background: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(0, 255, 245, 0.012) 2px,
        rgba(0, 255, 245, 0.012) 4px
      );
      pointer-events: none;
      z-index: 1;
      animation: scanline 8s linear infinite;
    }

    @keyframes scanline {
      0% { background-position: 0 0; }
      100% { background-position: 0 200px; }
    }

    .cyber-terminal-header {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.65rem 1rem;
      background: rgba(0, 255, 245, 0.04);
      border-bottom: 1px solid rgba(0, 255, 245, 0.1);
      position: relative;
      z-index: 2;
    }

    .cyber-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      display: inline-block;
    }
    .cyber-dot.red    { background: #FF4D4D; box-shadow: 0 0 6px #FF4D4D; }
    .cyber-dot.yellow { background: #FFD600; box-shadow: 0 0 6px #FFD600; }
    .cyber-dot.green  { background: #39FF14; box-shadow: 0 0 6px #39FF14; }

    .cyber-terminal-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      color: rgba(0, 255, 245, 0.55);
      flex: 1;
      margin-left: 0.35rem;
    }

    .cyber-terminal-region {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem;
      color: rgba(255, 153, 0, 0.6);
      background: rgba(255, 153, 0, 0.08);
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      border: 1px solid rgba(255, 153, 0, 0.2);
    }

    .cyber-terminal-body {
      padding: 0.85rem 1.1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.72rem;
      line-height: 1.8;
      max-height: 200px;
      overflow-y: hidden;
      position: relative;
      z-index: 2;
    }

    .cyber-line {
      display: flex;
      align-items: baseline;
      gap: 0;
      animation: fadeInLine 0.15s ease;
    }

    @keyframes fadeInLine {
      from { opacity: 0; transform: translateX(-4px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .cyber-prefix {
      color: rgba(139, 149, 165, 0.7);
      white-space: pre;
    }

    .cyber-cursor-line {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-top: 0.3rem;
    }

    .cyber-prompt {
      color: #39FF14;
      font-weight: 700;
      text-shadow: 0 0 8px rgba(57, 255, 20, 0.4);
    }

    .cyber-path {
      color: rgba(0, 255, 245, 0.6);
    }

    .cyber-blink {
      color: #00FFF5;
      animation: blink-cursor 1s step-end infinite;
      text-shadow: 0 0 8px rgba(0, 255, 245, 0.6);
    }

    @keyframes blink-cursor {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    /* ===== FLOATING CODE WORDS ===== */
    .cyber-float-words {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .cyber-float-word {
      position: absolute;
      font-family: 'JetBrains Mono', monospace;
      color: #00A4E4;
      bottom: -30px;
      animation: floatUp linear infinite;
      white-space: nowrap;
    }

    @keyframes floatUp {
      from { transform: translateY(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      to   { transform: translateY(-110vh); opacity: 0; }
    }

    /* ===== CYBERPUNK GLITCH TEXT ===== */
    @keyframes glitch {
      0%   { clip-path: inset(0 0 95% 0); transform: skewX(-2deg); }
      10%  { clip-path: inset(40% 0 50% 0); transform: skewX(2deg); }
      20%  { clip-path: inset(80% 0 10% 0); transform: skewX(-2deg); }
      30%  { clip-path: inset(20% 0 70% 0); transform: skewX(1deg); }
      40%  { clip-path: inset(60% 0 30% 0); transform: skewX(-1deg); }
      50%  { clip-path: inset(100% 0 0 0); transform: skewX(0deg); }
      100% { clip-path: inset(100% 0 0 0); transform: skewX(0deg); }
    }

    @keyframes cyber-pulse {
      0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 245, 0.1), 0 0 1px rgba(0, 255, 245, 0.3); }
      50%       { box-shadow: 0 0 40px rgba(0, 255, 245, 0.2), 0 0 2px rgba(0, 255, 245, 0.6); }
    }

    @keyframes neon-flicker {
      0%, 95%, 100% { opacity: 1; }
      96%            { opacity: 0.7; }
      97%            { opacity: 1; }
      98%            { opacity: 0.5; }
      99%            { opacity: 1; }
    }

    @keyframes cyber-glow-pulse {
      0%, 100% { text-shadow: 0 0 8px currentColor, 0 0 20px currentColor; }
      50%       { text-shadow: 0 0 4px currentColor, 0 0 10px currentColor; }
    }

    /* ===== CYBERPUNK PROJECT CARDS ===== */
    .cyber-project-card {
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
    }

    .cyber-project-card::before {
      content: '';
      position: absolute;
      top: 0; left: -100%;
      width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, #00FFF5, transparent);
      transition: left 0.4s ease;
    }

    .cyber-project-card:hover {
      border-color: rgba(0, 255, 245, 0.35) !important;
      box-shadow: 0 0 30px rgba(0, 255, 245, 0.08), 0 8px 32px rgba(0, 0, 0, 0.4) !important;
      transform: translateY(-3px);
    }

    .cyber-project-card:hover::before {
      left: 100%;
    }

    .cyber-metric-badge {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      background: rgba(0, 255, 245, 0.04);
      border: 1px solid rgba(0, 255, 245, 0.12);
      border-radius: 8px;
      padding: 0.4rem 0.55rem;
      min-width: 70px;
    }

    .cyber-metric-val {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 0.92rem;
      color: #FF9900;
      line-height: 1.1;
      text-shadow: 0 0 12px rgba(255, 153, 0, 0.4);
    }

    .cyber-metric-label {
      font-size: 0.56rem;
      color: rgba(139, 149, 165, 0.85);
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-top: 0.2rem;
    }

    /* ===== CYBERPUNK PROFILE CARDS ===== */
    .cyber-profile-card {
      position: relative;
      overflow: hidden;
      transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
      text-align: left !important;
    }

    .cyber-profile-card::after {
      content: '';
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--member-color, #FF9900), transparent);
      opacity: 0;
      transition: opacity 0.35s ease;
    }

    .cyber-profile-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.5), 0 0 30px rgba(var(--member-color-rgb, 255,153,0), 0.08) !important;
    }

    .cyber-profile-card:hover::after {
      opacity: 1;
    }

    .cyber-avatar {
      width: 58px;
      height: 58px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 1.2rem;
      color: #fff;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    .cyber-avatar::before {
      content: '';
      position: absolute;
      inset: 0;
      background: inherit;
      opacity: 0.15;
      filter: blur(12px);
      transform: scale(1.5);
    }

    .cyber-skill-pill {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.6rem;
      padding: 0.15rem 0.45rem;
      border-radius: 5px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: rgba(241, 243, 245, 0.7);
      white-space: nowrap;
    }

    .cyber-cert-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.6rem;
      padding: 0.15rem 0.5rem;
      border-radius: 5px;
      background: rgba(255, 153, 0, 0.06);
      border: 1px solid rgba(255, 153, 0, 0.18);
      color: rgba(255, 153, 0, 0.85);
    }

    .cyber-social-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .cyber-social-btn:hover {
      background: rgba(255,153,0,0.1);
      border-color: rgba(255,153,0,0.3);
      color: #FF9900;
    }

    /* ===== SCROLL-LINKED LOGO INDICATOR ===== */
    .logo-scroll-indicator {
      position: absolute;
      bottom: 12px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.55rem;
      color: rgba(0, 255, 245, 0.35);
      letter-spacing: 0.1em;
      pointer-events: none;
      z-index: 5;
    }

    /* ===== SECTION CYBERPUNK HEADING ===== */
    .cyber-section-h2 {
      position: relative;
    }

    .cyber-section-h2::after {
      content: attr(data-glitch);
      position: absolute;
      left: 2px; top: 0;
      color: #FF2D78;
      opacity: 0.25;
      clip-path: inset(40% 0 50% 0);
      animation: glitch 6s steps(1) infinite;
      pointer-events: none;
    }

    /* ===== HERO CYBERPUNK BADGE ===== */
    .cyber-section-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      color: #00FFF5;
      background: rgba(0, 255, 245, 0.06);
      border: 1px solid rgba(0, 255, 245, 0.2);
      padding: 0.3rem 0.75rem;
      border-radius: 6px;
      margin-bottom: 1.5rem;
      animation: cyber-pulse 3s ease-in-out infinite;
    }

    .cyber-section-badge::before {
      content: '▶';
      font-size: 0.55rem;
      color: #FF2D78;
      animation: neon-flicker 4s ease-in-out infinite;
    }
  `;
  document.head.appendChild(style);
}
