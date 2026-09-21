/* =====================================================
   STACKLY — main.js  (Pure Vanilla JS)
   Preloader · Nav · Typing · Counters · FAQ · Pricing
   GSAP text reveal · AOS · Toast · To-top
===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PRELOADER ---------- */
  const preloader = document.getElementById('preloader');
  const hidePre = () => preloader && preloader.classList.add('hide');
  window.addEventListener('load', () => setTimeout(hidePre, 500));
  setTimeout(hidePre, 3500); // safety fallback

  /* ---------- NAVBAR ---------- */
  const header = document.getElementById('header');
  const burger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const onScroll = () => {
    header && header.classList.toggle('scrolled', window.scrollY > 40);
    toTop && toTop.classList.toggle('show', window.scrollY > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* mark active nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---------- TO TOP ---------- */
  const toTop = document.getElementById('toTop');
  toTop && toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- TYPING ANIMATION ---------- */
  const typer = document.getElementById('typer');
  if (typer) {
    const words = JSON.parse(typer.dataset.words || '["Innovation","Automation","Growth","Creativity"]');
    let w = 0, c = 0, deleting = false;
    (function tick() {
      const word = words[w];
      typer.textContent = word.slice(0, c);
      let delay = deleting ? 55 : 110;
      if (!deleting && c === word.length) { delay = 1600; deleting = true; }
      else if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; delay = 350; }
      else c += deleting ? -1 : 1;
      setTimeout(tick, delay);
    })();
  }

  /* ---------- AOS ---------- */
  if (window.AOS) {
    AOS.init({ duration: 850, easing: 'ease-out-cubic', once: true, offset: 70 });
  }

  /* ---------- GSAP HERO REVEAL ---------- */
  if (window.gsap) {
    gsap.from('.hero .eyebrow', { y: 30, opacity: 0, duration: .8, ease: 'power3.out', delay: .7 });
    gsap.from('.hero h1', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', delay: .85 });
    gsap.from('.hero p.sub', { y: 40, opacity: 0, duration: .9, ease: 'power3.out', delay: 1.05 });
    gsap.from('.hero-cta', { y: 40, opacity: 0, duration: .9, ease: 'power3.out', delay: 1.2 });
    gsap.from('.hero-checks li', { y: 24, opacity: 0, duration: .6, stagger: .12, ease: 'power3.out', delay: 1.35 });
    gsap.from('.hero-visual > *', { y: 80, opacity: 0, scale: .9, duration: 1.1, stagger: .15, ease: 'back.out(1.4)', delay: 1 });
    gsap.to('.fc-stat', { y: -14, duration: 2.4, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.2 });
    gsap.to('.fc-task', { y: -10, duration: 2, yoyo: true, repeat: -1, ease: 'sine.inOut', delay: 2.6 });
  }

  /* ---------- COUNTERS ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = el => {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur = 1800, t0 = performance.now();
    const step = now => {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const cObs = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { runCounter(e.target); cObs.unobserve(e.target); }
  }), { threshold: .5 });
  counters.forEach(c => cObs.observe(c));

  /* ---------- FAQ ACCORDION ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- PRICING TOGGLE ---------- */
  const billSwitch = document.getElementById('billSwitch');
  if (billSwitch) {
    billSwitch.addEventListener('click', () => {
      billSwitch.classList.toggle('on');
      const yearly = billSwitch.classList.contains('on');
      document.querySelectorAll('[data-monthly]').forEach(el => {
        el.innerHTML = yearly ? '$' + el.dataset.yearly + '<small> /mo · billed yearly</small>'
                              : '$' + el.dataset.monthly + '<small> /month</small>';
      });
      document.getElementById('billLabelM').style.color = yearly ? '' : 'var(--blue)';
      document.getElementById('billLabelY').style.color = yearly ? 'var(--blue)' : '';
    });
  }

  /* ---------- CONTACT FORM ---------- */
  const cForm = document.getElementById('contactForm');
  if (cForm) {
    cForm.addEventListener('submit', e => {
      e.preventDefault();
      const msg = document.getElementById('formMsg');
      const name = cForm.name.value.trim(), email = cForm.email.value.trim();
      if (!name || !email.includes('@')) {
        msg.className = 'form-msg err';
        msg.textContent = 'Please fill in your name and a valid email address.';
        return;
      }
      msg.className = 'form-msg ok';
      msg.textContent = `Thanks ${name}! Your message has been sent — we'll reply within 24 hours.`;
      toast('Message sent successfully!');
      cForm.reset();
    });
  }

  /* ---------- NEWSLETTER ---------- */
  document.querySelectorAll('.newsletter').forEach(nl => {
    nl.addEventListener('submit', e => {
      e.preventDefault();
      const inp = nl.querySelector('input');
      if (inp.value.includes('@')) { toast('Subscribed! Welcome to Stackly insights.'); inp.value = ''; }
      else toast('Please enter a valid email.', true);
    });
  });

  /* ---------- SPARKLINE ---------- */
  document.querySelectorAll('.spark').forEach(svg => {
    const pts = (svg.dataset.pts || '0,20 20,14 40,18 60,8 80,12 100,4 120,7 140,2')
      .split(' ').map(p => p.split(','));
    const w = 160, h = 44;
    const X = i => i * (w / (pts.length - 1)), Y = v => h - (v / 22) * h;
    const d = pts.map((p, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(+p[1]).toFixed(1)).join(' ');
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    svg.innerHTML = `<defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#10b981" stop-opacity=".35"/><stop offset="1" stop-color="#10b981" stop-opacity="0"/></linearGradient></defs>
      <path d="${d} L ${w} ${h} L 0 ${h} Z" fill="url(#sg)"/>
      <path d="${d}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round"/>`;
  });
});

/* ---------- TOAST ---------- */
let toastTimer;
function toast(text, isErr) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `<span class="tdot" style="background:${isErr ? '#f87171' : '#4ade80'}"></span>${text}`;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3200);
}
