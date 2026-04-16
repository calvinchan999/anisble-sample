// app.js – fetches data from the backend and updates the page
// BACKEND_URL is injected by Ansible into config.js

async function loadHealth() {
  try {
    const res = await fetch(BACKEND_URL + '/api/health');
    const data = await res.json();
    document.getElementById('status').innerHTML = '<span class="badge ok">OK</span>';
    document.getElementById('host').textContent = data.host;
    document.getElementById('msg').textContent = data.message;
  } catch (e) {
    document.getElementById('status').innerHTML = '<span class="badge err">ERROR</span>';
    document.getElementById('msg').textContent = e.message;
  }
}

async function loadUsers() {
  const list = document.getElementById('users');
  const errDiv = document.getElementById('error');
  try {
    const res = await fetch(BACKEND_URL + '/api/users');
    const users = await res.json();
    list.innerHTML = users.length
      ? users.map(u => `<li><b>${u.name}</b> — ${u.email}</li>`).join('')
      : '<li>No users found.</li>';
  } catch (e) {
    list.innerHTML = '';
    errDiv.textContent = 'Could not reach backend: ' + e.message;
  }
}

loadHealth();
loadUsers();
