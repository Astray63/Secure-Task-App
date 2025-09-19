// Configuration et variables globales
const apiBase = '/api'
let token = localStorage.getItem('authToken')

// Initialisation commune
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = new Date().getFullYear()
  
  // Vérifier l'API sur toutes les pages
  checkApiHealth()
  
  // Router selon la page actuelle
  const currentPage = getCurrentPage()
  initPage(currentPage)
})

function getCurrentPage() {
  const path = window.location.pathname
  if (path === '/' || path === '/index.html') return 'home'
  if (path === '/login.html') return 'login'
  if (path === '/register.html') return 'register'
  if (path === '/dashboard.html') return 'dashboard'
  return 'unknown'
}

function initPage(page) {
  switch (page) {
    case 'home':
      initHomePage()
      break
    case 'login':
      initLoginPage()
      break
    case 'register':
      initRegisterPage()
      break
    case 'dashboard':
      initDashboardPage()
      break
  }
}

// Vérification santé API
async function checkApiHealth() {
  const statusEl = document.getElementById('status')
  if (!statusEl) return
  
  try {
    const r = await fetch('/health')
    if (!r.ok) throw new Error('health fail')
    const data = await r.json()
    statusEl.textContent = 'API OK (' + data.status + ')'
    statusEl.style.color = '#10b981'
  } catch (e) {
    statusEl.textContent = 'API indisponible'
    statusEl.style.color = '#f87171'
  }
}

// Utilitaires API
async function postJSON(url, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw data
  return data
}

async function getJSON(url) {
  const headers = {}
  if (token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(url, { headers })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw data
  return data
}

async function patchJSON(url, body) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw data
  return data
}

async function deleteJSON(url) {
  const headers = {}
  if (token) headers.Authorization = 'Bearer ' + token
  const r = await fetch(url, { method: 'DELETE', headers })
  if (!r.ok) throw new Error('Échec de la suppression')
}

// Gestion authentification
function saveToken(newToken) {
  token = newToken
  localStorage.setItem('authToken', newToken)
}

function logout() {
  token = null
  localStorage.removeItem('authToken')
  window.location.href = '/'
}

function requireAuth() {
  if (!token) {
    window.location.href = '/login.html'
    return false
  }
  return true
}

// Pages spécifiques
function initHomePage() {
  // Page d'accueil - pas de logique spéciale nécessaire
}

function initLoginPage() {
  // Rediriger si déjà connecté
  if (token) {
    window.location.href = '/dashboard.html'
    return
  }
  
  const loginForm = document.getElementById('login-form')
  const resultEl = document.getElementById('login-result')
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const body = Object.fromEntries(fd.entries())
      
      try {
        const data = await postJSON(apiBase + '/auth/login', body, false)
        saveToken(data.token)
        showResult(resultEl, { success: 'Connexion réussie!' }, 'success')
        setTimeout(() => {
          window.location.href = '/dashboard.html'
        }, 1000)
      } catch (err) {
        showResult(resultEl, err, 'error')
      }
    })
  }
}

function initRegisterPage() {
  // Rediriger si déjà connecté
  if (token) {
    window.location.href = '/dashboard.html'
    return
  }
  
  const registerForm = document.getElementById('register-form')
  const resultEl = document.getElementById('register-result')
  
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const body = Object.fromEntries(fd.entries())
      
      try {
        const data = await postJSON(apiBase + '/auth/register', body, false)
        showResult(resultEl, { success: 'Inscription réussie! Vous pouvez maintenant vous connecter.' }, 'success')
        setTimeout(() => {
          window.location.href = '/login.html'
        }, 2000)
      } catch (err) {
        showResult(resultEl, err, 'error')
      }
    })
  }
}

function initDashboardPage() {
  if (!requireAuth()) return
  
  const logoutBtn = document.getElementById('logout-btn')
  const taskForm = document.getElementById('task-form')
  const taskList = document.getElementById('task-list')
  const taskCount = document.getElementById('task-count')
  const filterBtns = document.querySelectorAll('.filter-btn')
  
  let currentFilter = 'all'
  let allTasks = []
  
  // Déconnexion
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
  }
  
  // Filtres
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'))
      e.target.classList.add('active')
      currentFilter = e.target.dataset.filter
      renderTasks()
    })
  })
  
  // Ajout de tâche
  if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault()
      const fd = new FormData(e.target)
      const body = Object.fromEntries(fd.entries())
      
      try {
        await postJSON(apiBase + '/tasks', body)
        taskForm.reset()
        loadTasks()
      } catch (e) {
        alert('Erreur lors de la création de la tâche')
      }
    })
  }
  
  // Charger les tâches
  async function loadTasks() {
    try {
      allTasks = await getJSON(apiBase + '/tasks')
      renderTasks()
      updateTaskCount()
    } catch (e) {
      taskList.innerHTML = '<li class="error">Erreur lors du chargement des tâches</li>'
    }
  }
  
  function renderTasks() {
    const filteredTasks = filterTasks(allTasks, currentFilter)
    
    if (filteredTasks.length === 0) {
      taskList.innerHTML = '<li class="no-tasks">Aucune tâche pour ce filtre</li>'
      return
    }
    
    taskList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('')
    
    // Ajouter les event listeners
    taskList.querySelectorAll('.task-item').forEach(item => {
      const taskId = parseInt(item.dataset.id)
      const task = allTasks.find(t => t.id === taskId)
      
      const editBtn = item.querySelector('.task-edit')
      const toggleBtn = item.querySelector('.task-toggle')
      const deleteBtn = item.querySelector('.task-delete')
      
      if (editBtn) {
        editBtn.addEventListener('click', () => editTask(task, item))
      }
      
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => toggleTask(task))
      }
      
      if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteTask(task))
      }
    })
  }
  
  function filterTasks(tasks, filter) {
    switch (filter) {
      case 'pending':
        return tasks.filter(t => !t.completed)
      case 'completed':
        return tasks.filter(t => t.completed)
      default:
        return tasks
    }
  }
  
  function createTaskHTML(task) {
    return `
      <li class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
        <div class="task-content">
          <h3 class="task-title" data-field="title">${escapeHTML(task.title)}</h3>
          ${task.description ? `<p class="task-description" data-field="description">${escapeHTML(task.description)}</p>` : ''}
          <small class="task-date">Créée le ${new Date(task.created_at).toLocaleDateString()}</small>
        </div>
        <div class="task-actions">
          <button class="btn btn-small task-edit" title="Modifier">
            ✏️
          </button>
          <button class="btn btn-small task-toggle" title="${task.completed ? 'Marquer comme non terminée' : 'Marquer comme terminée'}">
            ${task.completed ? '↩️' : '✅'}
          </button>
          <button class="btn btn-small btn-danger task-delete" title="Supprimer">
            🗑️
          </button>
        </div>
      </li>
    `
  }
  
  function editTask(task, itemElement) {
    const titleElement = itemElement.querySelector('.task-title')
    const descriptionElement = itemElement.querySelector('.task-description')
    const editBtn = itemElement.querySelector('.task-edit')
    
    // Si déjà en mode édition, sauvegarder
    if (editBtn.textContent === '💾') {
      saveTaskEdit(task, itemElement)
      return
    }
    
    // Passer en mode édition
    editBtn.textContent = '💾'
    editBtn.title = 'Sauvegarder'
    
    // Remplacer le titre par un input
    const currentTitle = titleElement.textContent
    titleElement.innerHTML = `<input type="text" class="edit-title" value="${escapeHTML(currentTitle)}" style="background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 4px; border-radius: 4px; width: 100%;">`
    
    // Remplacer la description par un input (ou créer si n'existe pas)
    let currentDescription = ''
    if (descriptionElement) {
      currentDescription = descriptionElement.textContent
      descriptionElement.innerHTML = `<input type="text" class="edit-description" value="${escapeHTML(currentDescription)}" style="background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 4px; border-radius: 4px; width: 100%;">`
    } else {
      // Créer un élément description s'il n'existe pas
      const dateElement = itemElement.querySelector('.task-date')
      const descInput = document.createElement('p')
      descInput.className = 'task-description'
      descInput.innerHTML = `<input type="text" class="edit-description" value="" placeholder="Ajouter une description..." style="background: #1a1a1a; border: 1px solid #444; color: #fff; padding: 4px; border-radius: 4px; width: 100%;">`
      dateElement.parentNode.insertBefore(descInput, dateElement)
    }
    
    // Focus sur le titre
    const titleInput = itemElement.querySelector('.edit-title')
    if (titleInput) {
      titleInput.focus()
      titleInput.select()
    }
  }
  
  async function saveTaskEdit(task, itemElement) {
    const titleInput = itemElement.querySelector('.edit-title')
    const descriptionInput = itemElement.querySelector('.edit-description')
    const editBtn = itemElement.querySelector('.task-edit')
    
    if (!titleInput) return
    
    const newTitle = titleInput.value.trim()
    const newDescription = descriptionInput ? descriptionInput.value.trim() : ''
    
    if (!newTitle) {
      alert('Le titre ne peut pas être vide')
      return
    }
    
    try {
      await patchJSON(apiBase + '/tasks/' + task.id, { 
        title: newTitle, 
        description: newDescription
      })
      
      // Recharger les tâches pour voir les changements
      loadTasks()
    } catch (e) {
      console.error('Erreur lors de la modification de la tâche:', e)
      alert('Erreur lors de la modification de la tâche')
      
      // Revenir en mode normal en cas d'erreur
      editBtn.textContent = '✏️'
      editBtn.title = 'Modifier'
      loadTasks()
    }
  }
  
  async function toggleTask(task) {
    try {
      await patchJSON(apiBase + '/tasks/' + task.id, { completed: !task.completed })
      loadTasks()
    } catch (e) {
      console.error('Erreur lors du basculement de la tâche:', e)
      if (e.error && e.error.includes('non trouvée')) {
        alert('Cette tâche n\'existe plus. Actualisation de la liste...')
        loadTasks()
      } else {
        alert('Erreur lors de la modification de la tâche')
      }
    }
  }
  
  async function deleteTask(task) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return
    
    try {
      await deleteJSON(apiBase + '/tasks/' + task.id)
      loadTasks()
    } catch (e) {
      console.error('Erreur lors de la suppression de la tâche:', e)
      if (e.error && e.error.includes('non trouvée')) {
        alert('Cette tâche n\'existe plus. Actualisation de la liste...')
        loadTasks()
      } else {
        alert('Erreur lors de la suppression de la tâche')
      }
    }
  }
  
  function updateTaskCount() {
    if (taskCount) {
      const pending = allTasks.filter(t => !t.completed).length
      const total = allTasks.length
      taskCount.textContent = `${total} tâche(s) • ${pending} en cours`
    }
  }
  
  // Charger les tâches au démarrage
  loadTasks()
}

// Utilitaires
function showResult(element, payload, type = 'info') {
  if (!element) return
  
  element.classList.remove('hidden')
  element.className = `result ${type}`
  
  if (typeof payload === 'string') {
    element.textContent = payload
  } else if (payload.success) {
    element.textContent = payload.success
  } else {
    element.textContent = JSON.stringify(payload, null, 2)
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, c => ({ 
    '&': '&amp;', 
    '<': '&lt;', 
    '>': '&gt;', 
    '"': '&quot;', 
    "'": '&#39;' 
  }[c] || c))
}
