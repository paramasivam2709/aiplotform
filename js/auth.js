/* =====================================================
   STACKLY — auth.js  (demo auth with roles: user/admin)
===================================================== */

const USERS_KEY = 'stackly_users';
const SESSION_KEY = 'stackly_session';

const seedUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([
      { name: 'Admin', email: 'admin@stackly.com', password: 'admin123', role: 'admin' },
      { name: 'Demo User', email: 'user@stackly.com', password: 'user123', role: 'user' },
    ]));
  }
};
seedUsers();

const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
const setSession = s => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
const clearSession = () => localStorage.removeItem(SESSION_KEY);

/* ---- LOGIN ---- */
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  let role = 'user';

  document.querySelectorAll('#roleTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#roleTabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      role = btn.dataset.role;
    });
  });

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = loginForm.email.value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast('Enter a valid email address.', true); return;
      }
      const name = email.split('@')[0];
      // Front-end demo only: selected role is not secure authorization.
      setSession({ name, email, role });
      toast(`Demo sign-in successful. Opening ${role} dashboard…`);
      setTimeout(() => {
        location.href = role === 'admin' ? 'admin.html' : 'dashboard.html';
      }, 500);
    });
  }

  /* ---- REGISTER ---- */
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = regForm.name.value.trim();
      if (!/^[A-Za-z ]+$/.test(name)) { toast('Name must contain letters and spaces only.', true); regForm.name.focus(); return; }
      const email = regForm.email.value.trim().toLowerCase();
      const pass = regForm.password.value;
      const confirm = regForm.confirm.value;

      if (pass.length < 6) { toast('Password must be at least 6 characters.', true); return; }
      if (pass !== confirm) { toast('Passwords do not match.', true); return; }
      if (getUsers().some(u => u.email === email)) { toast('Email already registered.', true); return; }

      const users = getUsers();
      users.push({ name, email, password: pass, role: 'user' });
      saveUsers(users);
      toast('Account created! Redirecting to login…');
      setTimeout(() => location.href = 'login.html', 900);
    });
  }

  /* ---- GUARD DASHBOARDS ---- */
  const needsRole = document.body.dataset.needsRole;
  if (needsRole) {
    const s = getSession();
    if (!s || s.role !== needsRole) {
      location.replace('login.html');
    } else {
      document.querySelectorAll('[data-user-name]').forEach(el => el.textContent = s.name);
      document.querySelectorAll('[data-user-email]').forEach(el => el.textContent = s.email);
      document.querySelectorAll('[data-user-initial]').forEach(el => el.textContent = s.name.charAt(0).toUpperCase());
      document.querySelectorAll('[data-user-role]').forEach(el => el.textContent = s.role === 'admin' ? 'Administrator' : 'User Account');
    }
  }

  /* ---- LOGOUT ---- */
  document.querySelectorAll('.logout-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      clearSession();
      toast('Logged out. See you soon!');
      setTimeout(() => location.href = 'login.html', 600);
    }));

  /* ---- SIDEBAR (mobile) ---- */
  const sidebar = document.getElementById('sidebar');
  document.querySelectorAll('[data-sidebar-toggle]').forEach(sbBtn =>
    sbBtn.addEventListener('click', () => sidebar.classList.toggle('open')));
});

/* Helper for demo login buttons */
function quickLogin(role) {
  const creds = role === 'admin'
    ? { email: 'admin@stackly.com', password: 'admin123' }
    : { email: 'user@stackly.com', password: 'user123' };
  const user = getUsers().find(u => u.email === creds.email);
  setSession({ name: user.name, email: user.email, role: user.role });
  location.href = role === 'admin' ? 'admin.html' : 'dashboard.html';
}
