const apiBase = '/api'
const statusEl = document.getElementById('status')
const yearEl = document.getElementById('year')
const tasksSection = document.getElementById('tasks-section')
const taskList = document.getElementById('task-list')
const taskForm = document.getElementById('task-form')
let token = null

yearEl.textContent = new Date().getFullYear()

async function checkHealth () {
  try {
    const r = await fetch('/health')
    if (!r.ok) throw new Error('health fail')
    const data = await r.json()
    statusEl.textContent = 'API OK (' + data.status + ')'    
  } catch (e) {
    statusEl.textContent = 'API KO'
    statusEl.style.color = '#f87171'
  }
}
checkHealth()

function showResult (formName, payload) {
  const pre = document.querySelector(`pre.result[data-for="${formName}"]`)
  if (pre) pre.textContent = JSON.stringify(payload, null, 2)
}

async function postJSON (url, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw data
  return data
}

async function getJSON (url) {
  const headers = {}
  if (token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(url, { headers })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw data
  return data
}

document.getElementById('register-form').addEventListener('submit', async e => {
  e.preventDefault()
  const fd = new FormData(e.target)
  const body = Object.fromEntries(fd.entries())
  try {
    const data = await postJSON(apiBase + '/auth/register', body, false)
    showResult('register', data)
  } catch (err) {
    showResult('register', err)
  }
})

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault()
  const fd = new FormData(e.target)
  const body = Object.fromEntries(fd.entries())
  try {
    const data = await postJSON(apiBase + '/auth/login', body, false)
    token = data.token
    showResult('login', { token: token ? token.slice(0, 20) + '…' : null })
    tasksSection.classList.remove('hidden')
    loadTasks()
  } catch (err) {
    showResult('login', err)
  }
})

async function loadTasks () {
  try {
    const tasks = await getJSON(apiBase + '/tasks')
    taskList.innerHTML = ''
    tasks.forEach(t => addTaskRow(t))
  } catch (e) {
    taskList.innerHTML = '<li>Erreur chargement tâches</li>'
  }
}

function addTaskRow (task) {
  const li = document.createElement('li')
  li.dataset.id = task.id
  li.className = task.completed ? 'done' : ''
  li.innerHTML = `<span>${escapeHTML(task.title)}</span>` +
    `<div><button data-action="toggle">${task.completed ? '↩︎' : '✓'}</button>` +
    `<button data-action="delete">✕</button></div>`
  li.addEventListener('click', async ev => {
    const btn = ev.target.closest('button')
    if (!btn) return
    const action = btn.dataset.action
    if (action === 'toggle') {
      await fetch(apiBase + '/tasks/' + task.id, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ completed: !task.completed }) })
      loadTasks()
    } else if (action === 'delete') {
      await fetch(apiBase + '/tasks/' + task.id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + token } })
      li.remove()
    }
  })
  taskList.appendChild(li)
}

taskForm.addEventListener('submit', async e => {
  e.preventDefault()
  const fd = new FormData(taskForm)
  const body = Object.fromEntries(fd.entries())
  try {
    await postJSON(apiBase + '/tasks', body)
    taskForm.reset()
    loadTasks()
  } catch (e) {
    alert('Erreur création tâche')
  }
})

function escapeHTML (str) {
  return str.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c))
}
