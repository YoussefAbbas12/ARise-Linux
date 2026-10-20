/* ====== EDIT THIS ====== */
const CONFIG = {
  version: "1.0",
  size: "2.1 GB",
  isoUrl: "downloads/ARise-Linux.iso", // or a GitHub Releases / Archive.org / R2 link for big files
  sha256: "PASTE_SHA256_HERE"          // run: sha256sum ARise-Linux.iso
};
/* ======================== */
const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
$$('[data-v]').forEach(e => e.textContent = 'v' + CONFIG.version);
$$('[data-size]').forEach(e => e.textContent = CONFIG.size);
$('#isoBtn').href = CONFIG.isoUrl; $('#sha').textContent = CONFIG.sha256;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Lenis smooth scroll + GSAP sync */
gsap.registerPlugin(ScrollTrigger);
const lenis = new Lenis({ lerp: .09 });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href'); if (id.length < 2) return;
  e.preventDefault(); lenis.scrollTo(id, { offset: -80 });
}));
gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { scrub: 0.3, start: 0, end: 'max' } });

/* Hero terminal reveal */
const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
tl.from('.nav', { y: -60, opacity: 0, duration: .8 })
  .from('.desktop-preview', { y: 30, opacity: 0, duration: .9 }, '-=.4');

/* Scroll reveals */
$$('.reveal').forEach(el => gsap.from(el, { y: 50, opacity: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));

/* Count-up stats */
$$('[data-count]').forEach(el => {
  const to = +el.dataset.count, o = { v: 0 }, plus = 'plus' in el.dataset;
  ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () =>
    gsap.to(o, { v: to, duration: 1.8, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) + (plus ? '+' : '') }) });
});

/* Spotlight cards (React Bits style) */
$$('.spot').forEach(c => c.addEventListener('pointermove', e => {
  const r = c.getBoundingClientRect(); c.style.setProperty('--x', e.clientX - r.left + 'px'); c.style.setProperty('--y', e.clientY - r.top + 'px');
}));

/* 3D tilt */
if (!reduce) $$('.tilt').forEach(c => {
  const rx = gsap.quickTo(c, 'rotationX', { duration: .4 }), ry = gsap.quickTo(c, 'rotationY', { duration: .4 });
  c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - .5) * 12); rx(-((e.clientY - r.top) / r.height - .5) * 12); });
  c.addEventListener('pointerleave', () => { rx(0); ry(0); });
});

/* Magnetic buttons */
if (!reduce) $$('.magnetic').forEach(b => {
  const x = gsap.quickTo(b, 'x', { duration: .4, ease: 'power3' }), y = gsap.quickTo(b, 'y', { duration: .4, ease: 'power3' });
  b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .3); y((e.clientY - r.top - r.height / 2) * .3); });
  b.addEventListener('pointerleave', () => { x(0); y(0); });
});

/* Theme switcher: re-themes the whole page */
$$('#themeBtns button').forEach(b => b.addEventListener('click', () => {
  $$('#themeBtns button').forEach(x => x.classList.remove('on')); b.classList.add('on');
  document.documentElement.dataset.theme = b.dataset.t; readColors();
}));

/* Copy buttons */
$$('.copy').forEach(b => b.addEventListener('click', () => {
  navigator.clipboard.writeText($(b.dataset.copy).textContent); b.textContent = 'Copied'; setTimeout(() => b.textContent = 'Copy', 1400);
}));

/* Interactive terminal preview */
const terminalBody = $('#heroTermBody');
const logo = [
  [' ███ ', '█   █', '█████', '█   █', '█   █'],
  ['████ ', '█   █', '████ ', '█  █ ', '█   █'],
  ['█████', '  █  ', '  █  ', '  █  ', '█████'],
  [' ████', '█    ', ' ███ ', '    █', '████ '],
  ['█████', '█    ', '████ ', '█    ', '█████']
].map(glyph => glyph);
const ariseLogo = Array.from({ length: 5 }, (_, row) => logo.map(glyph => glyph[row]).join('  ')).join('\n');
const terminalOutput = {
  fastfetch: `<span class="terminal-logo">${ariseLogo}</span>
<span class="terminal-details">────────────────────────────────────────────
OS:        ARise Linux x86_64
Host:      arise-linux
WM:        Hyprland
Desktop:   KDE Plasma 6
Shell:     zsh + Starship
Terminal:  Kitty
Developer: Youssef Abbas (ELJO)
Theme:     Cyberpunk Neon</span>`,
  'arise-setup': `<span class="b">ARise Setup</span>
Choose a bundle to install:
  [1] Developer tools
  [2] Gaming tools
  [3] Video editing tools
  [4] System health check`,
  'arise-update': `<span class="b">ARise System Update</span>
Keys:       OK
Packages:   Up to date
AUR:        Checked
Cache:      Clean`,
  'prayer-times': `<span class="b">Prayer Times · Cairo</span>
Fajr · Sunrise · Dhuhr · Asr · Maghrib · Isha
Prayer times are available from the desktop bar.`
};
const renderTerminal = command => {
  if (command === 'clear') {
    terminalBody.innerHTML = `<span class="a">eljo@arise-linux</span>:<span class="b">~</span> $ <span class="terminal-caret"></span>`;
    return;
  }
  if (!command) {
    terminalBody.innerHTML = `<span class="b">Welcome to ARise Linux!</span> Click a command above to explore your system.\n\n<span class="a">eljo@arise-linux</span>:<span class="b">~</span> $ <span class="terminal-caret"></span>`;
    return;
  }
  terminalBody.innerHTML = `<span class="b">Welcome to ARise Linux!</span> Click a command above to explore your system.\n\n<span class="a">eljo@arise-linux</span>:<span class="b">~</span> ⚡ ${command}\n${terminalOutput[command]}\n\n<span class="a">eljo@arise-linux</span>:<span class="b">~</span> $ <span class="terminal-caret"></span>`;
};
$$('[data-terminal-command]').forEach(button => button.addEventListener('click', () => {
  const command = button.dataset.terminalCommand;
  renderTerminal(command);
  $$('[data-terminal-command]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
}));
renderTerminal('fastfetch');

/* Background: connected particles using the theme colors */
const cv = $('#bg'), ctx = cv.getContext('2d'); let W, H, col = ['#b026ff', '#22e3ff'], P = [];
function readColors() { const s = getComputedStyle(document.documentElement); col = [s.getPropertyValue('--a').trim(), s.getPropertyValue('--b').trim()]; }
function size() { W = cv.width = innerWidth; H = cv.height = innerHeight; P = Array.from({ length: Math.min(70, W / 22 | 0) }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35 })); }
addEventListener('resize', size); size(); readColors();
let mx = -999, my = -999; addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
(function draw() {
  ctx.clearRect(0, 0, W, H);
  P.forEach((p, i) => {
    p.x = (p.x + p.vx + W) % W; p.y = (p.y + p.vy + H) % H;
    ctx.fillStyle = col[i % 2]; ctx.globalAlpha = .7; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6, 0, 7); ctx.fill();
    for (let j = i + 1; j < P.length; j++) { const q = P[j], d = Math.hypot(p.x - q.x, p.y - q.y); if (d < 130) { ctx.globalAlpha = (1 - d / 130) * .25; ctx.strokeStyle = col[0]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } }
    const dm = Math.hypot(p.x - mx, p.y - my); if (dm < 160) { ctx.globalAlpha = (1 - dm / 160) * .5; ctx.strokeStyle = col[1]; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mx, my); ctx.stroke(); }
  });
  if (!reduce) requestAnimationFrame(draw);
})();
