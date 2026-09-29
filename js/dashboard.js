/* =====================================================
   STACKLY — dashboard.js  (charts, ring, tables)
===================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- SIDEBAR VIEWS ---- */
  const sidebar = document.getElementById('sidebar');
  const viewButtons = document.querySelectorAll('.side-link[data-view]');
  const viewPanels = document.querySelectorAll('[data-view-panel]');
  viewButtons.forEach(button => button.addEventListener('click', () => {
    const view = button.dataset.view;
    viewButtons.forEach(item => {
      const isActive = item === button;
      item.classList.toggle('active', isActive);
      if (isActive) item.setAttribute('aria-current', 'page');
      else item.removeAttribute('aria-current');
    });
    viewPanels.forEach(panel => { panel.hidden = panel.dataset.viewPanel !== view; });
    sidebar && sidebar.classList.remove('open');
  }));

  /* ---- WORKSPACE PREFERENCES ---- */
  const preferencesForm = document.getElementById('preferencesForm');
  if (preferencesForm) {
    const preferences = JSON.parse(localStorage.getItem('stackly_dashboard_preferences') || '{}');
    preferencesForm.elements.weeklySummary.checked = preferences.weeklySummary !== false;
    preferencesForm.elements.productUpdates.checked = preferences.productUpdates !== false;
    preferencesForm.addEventListener('submit', event => {
      event.preventDefault();
      localStorage.setItem('stackly_dashboard_preferences', JSON.stringify({
        weeklySummary: preferencesForm.elements.weeklySummary.checked,
        productUpdates: preferencesForm.elements.productUpdates.checked,
      }));
      toast('Workspace preferences saved.');
    });
  }

  /* ---- ANIMATED BAR CHART ---- */
  document.querySelectorAll('.chart[data-values]').forEach(chart => {
    const data = JSON.parse(chart.dataset.values || '[40,65,50,80,58,92,70,100,62,85,74,95]');
    const labels = JSON.parse(chart.dataset.labels || '["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]');
    const max = Math.max(...data);
    chart.innerHTML = data.map((v, i) => `
      <div class="bar-col" title="${labels[i]}: ${v}">
        <div class="bar" data-h="${(v / max) * 100}"></div><span>${labels[i]}</span>
      </div>`).join('');
    const bars = chart.querySelectorAll('.bar');
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        bars.forEach((b, i) => setTimeout(() => b.style.height = b.dataset.h + '%', i * 70));
        obs.disconnect();
      }
    }), { threshold: .3 });
    obs.observe(chart);
  });

  /* ---- PROGRESS RING ---- */
  const ring = document.querySelector('.ring-svg .fg');
  if (ring) {
    const pct = +ring.dataset.pct || 75;
    const obs = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        ring.style.strokeDashoffset = 339 - (339 * pct / 100);
        obs.disconnect();
      }
    }), { threshold: .4 });
    obs.observe(ring);
    const lbl = document.getElementById('ringPct');
    if (lbl) {
      let p = 0;
      const t = setInterval(() => {
        p += 2; if (p >= pct) { p = pct; clearInterval(t); }
        lbl.textContent = p + '%';
      }, 26);
    }
  }

  /* ---- SORTABLE TABLE (demo) ---- */
  document.querySelectorAll('[data-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const tbody = th.closest('table').querySelector('tbody');
      const idx = [...th.parentNode.children].indexOf(th);
      const rows = [...tbody.rows];
      rows.sort((a, b) => a.cells[idx].textContent.localeCompare(b.cells[idx].textContent, undefined, { numeric: true }));
      rows.forEach(r => tbody.appendChild(r));
      toast('Table sorted by ' + th.textContent.trim());
    });
  });

  /* ---- LIVE CLOCK ---- */
  const clock = document.getElementById('dashClock');
  if (clock) {
    const upd = () => {
      const d = new Date();
      clock.textContent = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) + ' · ' +
                          d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };
    upd(); setInterval(upd, 30000);
  }
});
