// =============================================================
//  app.js — Lukman Al Afandi Portfolio
//  Animations: Glitch · Decrypt · Scan · Terminal · Counter · Progress
// =============================================================

// -------------------------------------------------------
// 0. BOOT SCREEN — terminal loading sequence (once per session)
// -------------------------------------------------------
(function bootScreen() {
  const screen = document.getElementById('boot-screen');
  if (!screen) return;

  // Skip animation after first visit this session
  if (sessionStorage.getItem('booted')) {
    screen.remove();
    return;
  }
  sessionStorage.setItem('booted', '1');

  const linesEl = document.getElementById('boot-lines');
  document.body.style.overflow = 'hidden';

  const sequence = [
    { text: '[LA/]$ boot --portfolio --secure', cls: 'cmd', delay: 150 },
    { text: '> Initializing modules...', delay: 600 },
    { text: '> Loading assets ............. <span class="ok">[OK]</span>', delay: 1050, html: true },
    { text: '> Establishing connection ..... <span class="ok">[OK]</span>', delay: 1500, html: true },
    { text: '> Running security checks ..... <span class="ok">[OK]</span>', delay: 1950, html: true },
    { text: '> <span class="ok">Access granted. Welcome, visitor.</span>', delay: 2350, html: true },
  ];

  sequence.forEach(({ text, cls, delay, html }) => {
    setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line' + (cls ? ' ' + cls : '');
      if (html) line.innerHTML = text;
      else line.textContent = text;
      linesEl.appendChild(line);
    }, delay);
  });

  setTimeout(() => {
    screen.classList.add('fade-out');
    setTimeout(() => {
      screen.remove();
      document.body.style.overflow = '';
    }, 650);
  }, 3100);
})();

// -------------------------------------------------------
// 0b. DARK MODE TOGGLE
// -------------------------------------------------------
(function darkMode() {
  const toggle = document.getElementById('themeToggle');
  const html   = document.documentElement;

  // Restore saved preference
  if (localStorage.getItem('theme') === 'dark') {
    html.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
})();

// -------------------------------------------------------
// 1. FOOTER YEAR
// -------------------------------------------------------
document.getElementById('year').textContent = new Date().getFullYear();

// -------------------------------------------------------
// 2. NAVBAR — scroll state & mobile toggle
// -------------------------------------------------------
const navbar     = document.getElementById('navbar');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
const navLinkEls = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinkEls.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// -------------------------------------------------------
// 3. SCROLL REVEAL — IntersectionObserver
// -------------------------------------------------------
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    // Trigger decrypt if applicable
    if (entry.target.classList.contains('decrypt')) {
      setTimeout(() => decryptText(entry.target), 300);
    }
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// Also observe non-reveal decrypt elements (contact section title)
document.querySelectorAll('.decrypt:not(.reveal)').forEach(el => {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      decryptText(entry.target);
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  obs.observe(el);
});

// -------------------------------------------------------
// 4. ACTIVE NAV LINK
// -------------------------------------------------------
const sections = document.querySelectorAll('section[id]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinkEls.forEach(l => l.classList.remove('active'));
    const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (active) active.classList.add('active');
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// -------------------------------------------------------
// 5. SMOOTH SCROLL — offset for fixed navbar
// -------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// -------------------------------------------------------
// 6. CURSOR GLOW (desktop only)
// -------------------------------------------------------
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; width:300px; height:300px; border-radius:50%;
    background: radial-gradient(circle, rgba(8,145,178,0.12) 0%, rgba(124,58,237,0.05) 50%, transparent 70%);
    pointer-events:none; transform:translate(-50%,-50%);
    transition: left .18s ease, top .18s ease, opacity .3s ease;
    z-index:0; opacity:0;
  `;
  document.body.appendChild(glow);

  let glowTimeout;
  document.addEventListener('mousemove', (e) => {
    glow.style.left    = e.clientX + 'px';
    glow.style.top     = e.clientY + 'px';
    glow.style.opacity = '1';
    clearTimeout(glowTimeout);
    glowTimeout = setTimeout(() => { glow.style.opacity = '0'; }, 1200);
  }, { passive: true });
}

// -------------------------------------------------------
// 7. TERMINAL TYPING — role badge (cybersecurity themed)
// -------------------------------------------------------
(function terminalTyping() {
  const badge = document.querySelector('.role-badge');
  if (!badge) return;

  const roles = [
    'Cybersecurity Student',
    'Ethical Hacker',
    'CTF Enthusiast',
    'Network Defender',
    'Penetration Tester'
  ];

  // Restructure badge HTML
  badge.innerHTML = `<span class="terminal-prefix">&gt;&nbsp;</span><span id="term-text"></span><span class="terminal-cursor">_</span>`;
  const termText   = document.getElementById('term-text');
  const cursor     = badge.querySelector('.terminal-cursor');

  let roleIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  let paused    = false;

  function tick() {
    if (paused) return;
    const current = roles[roleIndex];

    if (!deleting) {
      termText.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        paused = true;
        cursor.style.animationPlayState = 'running';
        setTimeout(() => { paused = false; deleting = true; schedule(); }, 2400);
        return;
      }
    } else {
      termText.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting   = false;
        roleIndex  = (roleIndex + 1) % roles.length;
      }
    }
    schedule();
  }

  function schedule() {
    setTimeout(tick, deleting ? 50 : 85);
  }

  setTimeout(schedule, 900);
})();

// -------------------------------------------------------
// 8. GLITCH EFFECT — hero name (runs once on load)
// -------------------------------------------------------
(function glitchHero() {
  const target = document.querySelector('.accent-text');
  if (!target) return;

  // Trigger after page has settled
  setTimeout(() => {
    target.classList.add('glitch-active');
    // Remove class after animation ends (0.5s × 3 repeats = 1.5s)
    setTimeout(() => target.classList.remove('glitch-active'), 1600);
  }, 1200);
})();

// -------------------------------------------------------
// 9. DECRYPT TEXT — section headings scramble & resolve
// -------------------------------------------------------
const CHARS = '!<>-_\\/[]{}—=+*^?#@$%ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function decryptText(el) {
  const original  = el.dataset.originalText || el.textContent;
  el.dataset.originalText = original; // cache for re-runs
  const len       = original.length;
  let   iteration = 0;
  const totalSteps = len * 4;

  const interval = setInterval(() => {
    el.textContent = original
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        // Resolve characters from left to right
        if (i < Math.floor(iteration / 4)) return char;
        return CHARS[Math.floor(Math.random() * CHARS.length)];
      })
      .join('');

    iteration++;
    if (iteration > totalSteps) {
      el.textContent = original;
      clearInterval(interval);
    }
  }, 28);
}

// -------------------------------------------------------
// 10. COUNTING NUMBERS — stats animate 0 → target
// -------------------------------------------------------
(function countingNumbers() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  function easeOutQuad(t) { return t * (2 - t); }

  function animateCount(el) {
    const raw      = el.textContent.trim();
    const suffix   = raw.replace(/[0-9]/g, '');   // e.g. "+"
    const target   = parseInt(raw, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutQuad(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      counterObserver.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => counterObserver.observe(s));
})();

// -------------------------------------------------------
// 11. SCROLL PROGRESS BAR
// -------------------------------------------------------
(function scrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop  = window.scrollY;
    const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
    const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width  = pct + '%';
  }, { passive: true });
})();

// -------------------------------------------------------
// 12. CONTACT FORM — submit via Formspree (free)
//     Sign up at formspree.io, create a form, and replace
//     YOUR_FORM_ID below with your actual form ID.
// -------------------------------------------------------
(function contactForm() {
  const form   = document.getElementById('contactForm');
  if (!form) return;

  const submit = document.getElementById('formSubmit');
  const status = document.getElementById('formStatus');
  const ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID'; // ← replace this

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    submit.textContent = 'Sending...';
    submit.disabled = true;
    status.textContent = '';
    status.className = 'form-status';

    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.textContent = '✓ Message sent! I\'ll get back to you soon.';
        status.className = 'form-status success';
        form.reset();
      } else {
        throw new Error('server error');
      }
    } catch {
      status.textContent = '✗ Something went wrong — email me at luqmanalafande@gmail.com';
      status.className = 'form-status error';
    } finally {
      submit.textContent = 'Send Message';
      submit.disabled = false;
    }
  });
})();

// -------------------------------------------------------
// 13. CARD TILT — project & skill cards (desktop)
// -------------------------------------------------------
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const rotX = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -5;
      const rotY = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  5;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
