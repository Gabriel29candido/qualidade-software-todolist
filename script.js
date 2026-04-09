let profiles = JSON.parse(localStorage.getItem('todo_profiles')) || {};
let currentUserName = localStorage.getItem('active_user');
let calendarDate = new Date();
let selectedFilterDate = null;

function init() {
    updateDate();
    if (!currentUserName || !profiles[currentUserName]) {
        showUserModal(true);
    } else {
        renderApp();
    }
}

function renderApp() {
    if (!currentUserName) return;
    document.getElementById('greeting').innerText = `Olá, ${currentUserName}!`;
    renderTasks();
    renderCalendar();
    updateDashboard();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Pega tarefas e ORDENA POR DATA (mais antigas primeiro)
    let tasks = (profiles[currentUserName] || []).filter(t => !t.completed);
    
    tasks.sort((a, b) => {
        if (!a.date) return 1;
        if (!b.date) return -1;
        return a.date.localeCompare(b.date);
    });

    const filtered = selectedFilterDate ? tasks.filter(t => t.date === selectedFilterDate) : tasks;

    document.getElementById('task-counter').innerText = `${tasks.length} abertas`;
    document.getElementById('clearFilter').classList.toggle('hidden', !selectedFilterDate);
    filtered.length === 0 ? document.getElementById('empty-state').classList.remove('hidden') : document.getElementById('empty-state').classList.add('hidden');

    const fragment = document.createDocumentFragment();
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = `cat-${task.category || 'pessoal'}`;
        
        const isAtrasado = task.date && task.date < todayStr;
        const statusTag = task.date ? `<span class="status-tag ${isAtrasado ? 'status-atrasado' : 'status-emdia'}">${isAtrasado ? 'Atrasado' : 'Em Dia'}</span>` : '';
        const dataFormatada = task.date ? task.date.split('-').reverse().join('/') : 'Sem prazo';

        li.innerHTML = `
            <div id="content-${task.id}">
                <div class="task-main">
                    <span class="task-text">${task.text}</span>
                    <div class="task-actions">
                        <button class="btn-action btn-check" onclick="animateAction(this, ${task.id}, 'success')"><i class="fas fa-check"></i></button>
                        <button class="btn-action btn-edit" onclick="startEdit(${task.id}, '${task.text.replace(/'/g, "\\'")}', '${task.date}', '${task.category}')"><i class="fas fa-pen"></i></button>
                        <button class="btn-action btn-del" onclick="animateAction(this, ${task.id}, 'danger')"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
                <div class="task-date-badge" style="font-size:0.7rem; color:#94a3b8; margin-top:5px">
                    <i class="far fa-calendar"></i> ${dataFormatada} | <b>${task.category.toUpperCase()}</b> ${statusTag}
                </div>
            </div>
        `;
        fragment.appendChild(li);
    });
    list.appendChild(fragment);
}

function updateDashboard() {
    const bar = document.getElementById('dashboard-bar');
    bar.innerHTML = '';
    const tasks = (profiles[currentUserName] || []).filter(t => !t.completed);
    if (tasks.length === 0) return;

    const counts = { urgente: 0, trabalho: 0, estudos: 0, pessoal: 0 };
    tasks.forEach(t => counts[t.category]++);
    const colors = { urgente: 'var(--cat-urgente)', trabalho: 'var(--cat-trabalho)', estudos: 'var(--cat-estudos)', pessoal: 'var(--cat-pessoal)' };

    Object.entries(counts).forEach(([cat, count]) => {
        if (count > 0) {
            const seg = document.createElement('div');
            seg.className = 'dash-seg';
            seg.style.width = `${(count / tasks.length) * 100}%`;
            seg.style.backgroundColor = colors[cat];
            bar.appendChild(seg);
        }
    });
}

function animateAction(btn, id, type) {
    const li = btn.closest('li');
    li.classList.add(`fade-out-${type}`);
    setTimeout(() => {
        if(type === 'success') {
            profiles[currentUserName] = profiles[currentUserName].map(t => t.id === id ? {...t, completed: true} : t);
        } else {
            profiles[currentUserName] = profiles[currentUserName].filter(t => t.id !== id);
        }
        saveData(); renderApp();
    }, 400);
}

function startEdit(id, oldText, oldDate, oldCat) {
    const container = document.getElementById(`content-${id}`);
    container.innerHTML = `
        <div class="edit-container">
            <input type="text" id="edit-text-${id}" class="edit-input" value="${oldText}">
            <div class="input-row">
                <input type="date" id="edit-date-${id}" class="edit-input" value="${oldDate}">
                <select id="edit-cat-${id}" class="edit-input">
                    <option value="pessoal" ${oldCat==='pessoal'?'selected':''}>Pessoal</option>
                    <option value="trabalho" ${oldCat==='trabalho'?'selected':''}>Trabalho</option>
                    <option value="estudos" ${oldCat==='estudos'?'selected':''}>Estudos</option>
                    <option value="urgente" ${oldCat==='urgente'?'selected':''}>Urgente</option>
                </select>
            </div>
            <div class="edit-actions">
                <button class="btn-action btn-check" onclick="saveEdit(${id})"><i class="fas fa-save"></i></button>
                <button class="btn-action btn-del" onclick="renderTasks()"><i class="fas fa-times"></i></button>
            </div>
        </div>`;
}

function saveEdit(id) {
    const text = document.getElementById(`edit-text-${id}`).value.trim();
    const date = document.getElementById(`edit-date-${id}`).value;
    const category = document.getElementById(`edit-cat-${id}`).value;
    if (text) { profiles[currentUserName] = profiles[currentUserName].map(t => t.id === id ? {...t, text, date, category} : t); saveData(); renderApp(); }
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    const year = calendarDate.getFullYear(); const month = calendarDate.getMonth();
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    document.getElementById('calendar-header').innerText = `${monthNames[month]} ${year}`;
    const firstDay = new Date(year, month, 1).getDay(); const daysInMonth = new Date(year, month + 1, 0).getDate();
    const pendingDates = (profiles[currentUserName] || []).filter(t => !t.completed && t.date).map(t => t.date);
    
    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div></div>`;
    for (let d = 1; d <= daysInMonth; d++) {
        const fullDate = `${year}-${String(month + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const isToday = (d === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) ? 'today' : '';
        const dayEl = document.createElement('div');
        dayEl.className = `day ${isToday} ${pendingDates.includes(fullDate) ? 'has-task' : ''} ${selectedFilterDate === fullDate ? 'selected-day' : ''}`;
        dayEl.innerText = d;
        dayEl.onclick = () => { selectedFilterDate = (selectedFilterDate === fullDate) ? null : fullDate; renderApp(); };
        grid.appendChild(dayEl);
    }
}

// Navegação e Eventos
document.getElementById('prevMonth').onclick = () => { calendarDate.setMonth(calendarDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { calendarDate.setMonth(calendarDate.getMonth() + 1); renderCalendar(); };
document.getElementById('clearFilter').onclick = () => { selectedFilterDate = null; renderApp(); };

// Nova função de validação exigida para os testes
function validarTarefa(text) {
    if (!text || text.trim().length < 3) {
        return false;
    }
    return true;
}

document.getElementById('addBtn').onclick = () => {
    const text = document.getElementById('taskInput').value.trim(); 
    const date = document.getElementById('taskDate').value;
    const category = document.getElementById('taskCategory').value; 
    
    // Agora usamos a função de validação
    if(!validarTarefa(text)) {
        alert("A tarefa precisa ter pelo menos 3 caracteres!");
        return;
    }

    if(!profiles[currentUserName]) profiles[currentUserName] = [];
    profiles[currentUserName].push({id: Date.now(), text, date, category, completed: false});
    document.getElementById('taskInput').value = ''; 
    saveData(); 
    renderApp();
};

function showUserModal(isForced = false) {
    const modal = document.getElementById('user-modal'); modal.classList.remove('hidden');
    const list = document.getElementById('user-list'); list.innerHTML = '';
    document.getElementById('close-modal').onclick = () => modal.classList.add('hidden');
    Object.keys(profiles).forEach(name => {
        const card = document.createElement('div'); card.className = 'user-card';
        card.innerHTML = `<span class="user-name-clickable">${name}</span><button onclick="deleteProfile('${name}')" style="margin-right:15px; border:none; background:none; cursor:pointer; color:#94a3b8"><i class="fas fa-trash-alt"></i></button>`;
        card.querySelector('.user-name-clickable').onclick = () => selectUser(name); list.appendChild(card);
    });
}

function selectUser(name) { currentUserName = name; localStorage.setItem('active_user', name); document.getElementById('user-modal').classList.add('hidden'); renderApp(); }
function deleteProfile(name) { if(confirm(`Excluir ${name}?`)) { delete profiles[name]; saveData(); showUserModal(!currentUserName); } }
function saveData() { localStorage.setItem('todo_profiles', JSON.stringify(profiles)); }
function updateDate() { document.getElementById('date-display').innerText = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }); }
document.getElementById('switchUserBtn').onclick = () => showUserModal(false);
document.getElementById('createBtn').onclick = () => {
    const name = document.getElementById('newUserName').value.trim();
    if(name && !profiles[name]) { profiles[name] = []; saveData(); selectUser(name); }
};
function exportData() { const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profiles)); const dl = document.createElement('a'); dl.setAttribute("href", dataStr); dl.setAttribute("download", "backup.json"); dl.click(); }
function importData(e) { const reader = new FileReader(); reader.onload = (ev) => { profiles = JSON.parse(ev.target.result); saveData(); location.reload(); }; reader.readAsText(e.target.files[0]); }
init();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validarTarefa };
}
