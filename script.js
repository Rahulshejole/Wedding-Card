/* ─────────────────────────────────────────
   ENVELOPE OPEN
───────────────────────────────────────── */
const openBtn    = document.getElementById('open-btn');
const envScreen  = document.getElementById('envelope-screen');
const invitation = document.getElementById('invitation');

openBtn.addEventListener('click', () => {
  envScreen.classList.add('closing');
  setTimeout(() => {
    envScreen.style.display = 'none';
    invitation.classList.remove('hidden');
    initScratch();
    startCountdown();
    observeReveal();
  }, 620);
});

/* ─────────────────────────────────────────
   COUNTDOWN TIMER  –  target: June 15, 2026 17:00 IST
   IST = UTC+5:30  →  UTC 11:30
───────────────────────────────────────── */
function startCountdown() {
  const target = new Date('2026-06-26T07:40:00Z');

  function tick() {
    const now  = new Date();
    const diff = target - now;

    if (diff <= 0) {
      ['cd-days','cd-hours','cd-mins','cd-secs'].forEach(id => {
        document.getElementById(id).textContent = '00';
      });
      return;
    }

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000)  / 60000);
    const secs  = Math.floor((diff % 60000)    / 1000);

    document.getElementById('cd-days').textContent  = String(days).padStart(2,'0');
    document.getElementById('cd-hours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cd-mins').textContent  = String(mins).padStart(2,'0');
    document.getElementById('cd-secs').textContent  = String(secs).padStart(2,'0');
  }

  tick();
  setInterval(tick, 1000);
}

/* ─────────────────────────────────────────
   SCRATCH CARD
───────────────────────────────────────── */
function initScratch() {
  const canvas = document.getElementById('scratch-canvas');
  if (!canvas) return;
  const ctx    = canvas.getContext('2d');

  // cover layer – gradient silver/gold scratchy surface
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0,   '#c8a97a');
  grad.addColorStop(0.4, '#d4b88a');
  grad.addColorStop(0.7, '#b8935a');
  grad.addColorStop(1,   '#c8a97a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // watermark text on the scratch layer
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.font = 'bold 13px Lato, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦ SCRATCH HERE ✦', canvas.width / 2, canvas.height / 2);

  // scratch logic
  let isDrawing = false;

  function getPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    const src = e.touches ? e.touches[0] : e;
    return {
      x: (src.clientX - rect.left) * scaleX,
      y: (src.clientY - rect.top)  * scaleY,
    };
  }

  function scratch(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener('mousedown',  () => isDrawing = true);
  canvas.addEventListener('mouseup',    () => isDrawing = false);
  canvas.addEventListener('mouseleave', () => isDrawing = false);
  canvas.addEventListener('mousemove',  scratch);

  canvas.addEventListener('touchstart', (e) => { isDrawing = true; e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend',   () => isDrawing = false);
  canvas.addEventListener('touchmove',  scratch, { passive: false });
}

/* ─────────────────────────────────────────
   SCROLL REVEAL  (IntersectionObserver)
───────────────────────────────────────── */
function observeReveal() {
  const sections = document.querySelectorAll('.section, .hero-content, .gallery');
  sections.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  sections.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────
   RSVP FORM
───────────────────────────────────────── */
function handleRsvp(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.send-btn');
  btn.textContent = '✓ Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #7a9e7e, #4f7052)';
  btn.style.color = 'white';
  btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.style.color = '';
    btn.disabled = false;
  }, 3500);
}
