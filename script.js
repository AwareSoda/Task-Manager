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
