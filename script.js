const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

let tasks = [];

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const taskText = document.getElementById('taskInput').value;
  const deadline = new Date(document.getElementById('deadlineInput').value);

  const task = {
    text: taskText,
    deadline: deadline,
    id: Date.now()
  };

  tasks.push(task);
  renderTasks();
  form.reset();
});

function renderTasks() {
  taskList.innerHTML = '';
  const now = new Date();

  tasks.forEach(task => {
    const li = document.createElement('li');
    const timeLeft = (new Date(task.deadline) - now) / 1000; // in seconds

    if (timeLeft < 60 && timeLeft > 0) {
      alert(`Reminder: "${task.text}" is due in less than a minute!`);
    }

    li.innerHTML = `
      ${task.text} - Due: ${new Date(task.deadline).toLocaleString()}
      <button onclick="removeTask(${task.id})">X</button>
    `;
    taskList.appendChild(li);
  });
}

function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
}

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const taskText = document.getElementById('taskInput').value;
  const deadline = new Date(document.getElementById('deadlineInput').value);

  const task = {
    text: taskText,
    deadline: deadline.toISOString(),
    id: Date.now()
  };

  tasks.push(task);
  saveAndRenderTasks();
  form.reset();
});

function saveAndRenderTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';
  const now = new Date();

  tasks.forEach(task => {
    const li = document.createElement('li');
    const timeLeft = (new Date(task.deadline) - now) / 1000;

    li.innerHTML = `
      ${task.text} - Due: ${new Date(task.deadline).toLocaleString()}
      <button onclick="removeTask(${task.id})">X</button>
    `;
    taskList.appendChild(li);
  });
}

function removeTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveAndRenderTasks();
}

if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

setInterval(() => {
  const now = new Date();
  tasks.forEach(task => {
    const timeLeft = (new Date(task.deadline) - now) / 1000;

    // If it's due in less than 60s but hasn't passed yet
    if (timeLeft < 60 && timeLeft > 0 && !task.notified) {
      if (Notification.permission === "granted") {
        new Notification("Reminder", {
          body: `Task: "${task.text}" is due soon!`
        });
      }

      // Mark task as notified so it doesn't repeat
      task.notified = true;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  });
}, 60000); // check every 60 seconds

