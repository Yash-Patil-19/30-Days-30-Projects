

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const text = taskInput.value.trim();
  if (text === "") return;
  tasks.push({ text, completed: false });
  saveTasks();
  taskInput.value = "";
  renderTasks();
}

function toggleTask(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function setFilter(type) {
  filter = type;
  document.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
  document.querySelector(`.filters button[data-filter="${type}"]`).classList.add("active");
  renderTasks();
}

function renderTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks
    .filter(task => filter === "all" || (filter === "active" && !task.completed) || (filter === "completed" && task.completed))
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";
      li.innerHTML = `
        <span onclick="toggleTask(${index})">${task.text}</span>
        <div class="actions">
          <button onclick="deleteTask(${index})">❌</button>
        </div>
      `;
      taskList.appendChild(li);
    });
}

// Event Listeners
document.getElementById("addBtn").addEventListener("click", addTask);
document.getElementById("taskInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") addTask();
});
document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => setFilter(btn.dataset.filter));
});

renderTasks();
