class Task {
  constructor(id, title, description, completed, priority, tag, dueDate) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.completed = completed;
    this.priority = priority;
    this.tag = tag;
    this.dueDate = dueDate;
  }
}

function mapAPIToTasks(data) {
  return data.map(item => {
    return new Task(
      item.id,
      item.title,
      item.description,
      item.completed,
      item.priority,
      item.tag,
      new Date(item.dueDate),
    );
  });

}

function APIToTask(data) {
  return new Task(
    data.id,
    data.title,
    data.description,
    data.completed,
    data.priority,
    data.tag,
    new Date(data.dueDate),
  );
}

function displayTasksView(tasks) {
  clearTable();
  showLoadingMessage();
  if (tasks.length === 0) {
    showNotFoundMessage();
  } else {
    hideMessage();
    displayTasksTable(tasks);
  }
}

function displayClearTasksView() {
  clearTable();
  showInitialMessage();
}

function displayTasksTable(tasks) {
  const tablaBody = document.getElementById('data-table-body');
  tasks.forEach(task => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.completed}</td>
      <td>${task.priority}</td>
      <td>${task.tag}</td>
      <td>${formatDate(task.dueDate)}</td>
      <td>
      <button class="btn-delete btn btn-danger" data-task-id="${task.id}">
      <i class="fas fa-trash-alt"></i> Eliminar
    </button>
    <button class="btn-update btn btn-success" data-task-id="${task.id}">
      <i class="fas fa-edit"></i> Editar
    </button>
      </td>
    `;
    tablaBody.appendChild(row);
  });
  initDeleteTaskButtonHandler();
  initUpdateTaskButtonHandler();

  tableBody.style.display = '';
}

function displayTaskModal(task) {
  const id = document.getElementById("update-task-id");
  const taskTitleField = document.getElementById("update-task-title-field");
  const descriptionField = document.getElementById("update-description-field");
  const completedField = document.getElementById("update-completed-field");
  const priorityField = document.getElementById("update-priority-field");
  const tagField = document.getElementById("update-tag-field");
  const dueDateField = document.getElementById("update-due-date-field");

  id.value = task.id;
  taskTitleField.value = task.title;
  descriptionField.value = task.description;
  completedField.value = task.completed.toString();
  priorityField.value = task.priority.toLowerCase();
  tagField.value = task.tag;

  const dueDate = new Date(task.dueDate);
  const formattedDueDate = dueDate.toISOString().substring(0, 10);
  dueDateField.value = formattedDueDate;
}

function clearTable() {
  const tableBody = document.getElementById('data-table-body');
  tableBody.innerHTML = '';
}

function showLoadingMessage() {
  const message = document.getElementById('message');
  message.innerHTML = 'Cargando...';
  message.style.display = 'block';
}

function showInitialMessage() {
  const message = document.getElementById('message');
  message.innerHTML = 'No se ha realizado una consulta de tareas.';
  message.style.display = 'block';
}

function showNotFoundMessage() {
  const message = document.getElementById('message');
  message.innerHTML = 'No hay tareas en la lista. <i class="fa-regular fa-face-sad-cry"></i> Agrega una tarea para comenzar.';
  message.style.display = 'block';
}

function hideMessage() {
  const message = document.getElementById('message');
  message.style.display = 'none';
}

function initAddTaskButtonsHandler() {
  document.getElementById('addTask').addEventListener('click', () => {
    openAddTaskModal()
  });

  document.getElementById('modal-background').addEventListener('click', () => {
    closeAddTaskModal();
    closeUpdateTaskModal();
  });

  document.getElementById('task-form').addEventListener('submit', event => {
    event.preventDefault();
    processSubmitTask();
  });

  document.getElementById('update-task-form').addEventListener('submit', event => {
    event.preventDefault();
    processUpdateTask();
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    closeAddTaskModal();
    closeUpdateTaskModal();
  });

  document.getElementById('closeModalupdate').addEventListener('click', () => {
    closeAddTaskModal();
    closeUpdateTaskModal();
  });
}

function openAddTaskModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal').style.display = 'block';

}

function openUpdateTaskModal(taskId) {
  getTaskData(taskId);
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'block';
  document.getElementById('modal-update').style.display = 'block';
}


function closeAddTaskModal() {
  document.getElementById('task-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}

function closeUpdateTaskModal() {
  document.getElementById('update-task-form').reset();
  document.getElementById('modal-background').style.display = 'none';
  document.getElementById('modal-update').style.display = 'none';
}
function processSubmitTask() {
  const title = document.getElementById('task-title-field').value;
  const description = document.getElementById('description-field').value;
  const completed = document.getElementById('completed-field').value;
  const priority = document.getElementById('priority-field').value;
  const tag = document.getElementById('tag-field').value;
  const dueDate = document.getElementById('due-date-field').value;

  const taskToSave = new Task(
    null,
    title,
    description,
    completed,
    priority,
    tag,
    dueDate
  );
  createTask(taskToSave);
}

function processUpdateTask() {
  const id = document.getElementById('update-task-id').value
  const title = document.getElementById('update-task-title-field').value;
  const description = document.getElementById('update-description-field').value;
  const completed = document.getElementById('update-completed-field').value;
  const priority = document.getElementById('update-priority-field').value;
  const tag = document.getElementById('update-tag-field').value;
  const dueDate = document.getElementById('update-due-date-field').value;

  const taskToSave = new Task(
    id,
    title,
    description,
    completed,
    priority,
    tag,
    dueDate
  );
  updateTask(taskToSave);
}

function initDeleteTaskButtonHandler() {
  document.querySelectorAll('.btn-delete').forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.getAttribute('data-task-id');
      deleteTask(taskId);
    });
  });
}

function initUpdateTaskButtonHandler() {
  document.querySelectorAll('.btn-update').forEach(button => {
    button.addEventListener('click', () => {
      const taskId = button.getAttribute('data-task-id');
      openUpdateTaskModal(taskId);
    });
  });
}

function getTasksData() {
  fetchAPI(`${apiURL}/users/219205302/tasks`, 'GET')
    .then(data => {
      const tasksList = mapAPIToTasks(data);
      displayTasksView(tasksList);
    });
}

function getTaskData(taskId) {
  fetchAPI(`${apiURL}/users/219205302/tasks/${taskId}`, 'GET')
    .then(data => {
      const task = APIToTask(data);
      displayTaskModal(task);
    });
}

function deleteTask(taskId) {
  const confirm = window.confirm(`¿Estas seguro que quieres eliminar la tarea: ${taskId}?`);
  if (confirm) {
    fetchAPI(`${apiURL}/users/219205302/tasks/${taskId}`, 'DELETE')
      .then(() => {
        getTasksData();
        window.alert("La tarea ha sido eliminada correctamente.");
      });
  }
}

function createTask(task) {
  fetchAPI(`${apiURL}/users/219205302/tasks`, 'POST', task)
    .then(task => {
      closeAddTaskModal();
      getTasksData();
      window.alert(`Tarea ${task.id} creada correctamente.`);
    });
}

function updateTask(task) {
  fetchAPI(`${apiURL}/users/219205302/tasks/${task.id}`, 'PUT', task)
    .then(task => {
      closeUpdateTaskModal();
      getTasksData();
      window.alert(`Tarea ${task.id} actualizada correctamente.`);
    });
}

initAddTaskButtonsHandler();
getTasksData();

