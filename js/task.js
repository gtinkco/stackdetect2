document.addEventListener("DOMContentLoaded", () => {
    const taskTitle = document.getElementById("taskTitle");
    const taskDescription = document.getElementById("taskDescription");
    const taskStatus = document.getElementById("taskStatus");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");

    // Load tasks from localStorage
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addTaskToDOM(task));
    };

    // Save tasks to localStorage
    const saveTasks = (tasks) => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    // Add task to DOM
    const addTaskToDOM = (task) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <h3>Task Title: ${task.title}</h3>
            <p>Description: ${task.description}</p>
            <p>Status: <span class="status ${task.status.toLowerCase().replace(" ", "-")}">${task.status}</span></p>
            <button class="btn btn-action" onclick="deleteTask('${task.id}')">Delete</button>
        `;
        taskList.appendChild(li);
    };

    // Add task
    addTaskBtn.addEventListener("click", () => {
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const status = taskStatus.value;

        if (!title || !description) {
            alert("Please enter all fields.");
            return;
        }

        const newTask = {
            id: Date.now().toString(),
            title,
            description,
            status,
        };

        // Add to localStorage
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(newTask);
        saveTasks(tasks);

        // Add to DOM
        addTaskToDOM(newTask);

        // Clear form
        taskTitle.value = "";
        taskDescription.value = "";
    });

    // Delete task
    window.deleteTask = (id) => {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter(task => task.id !== id);
        saveTasks(tasks);

        // Refresh task list
        taskList.innerHTML = "";
        loadTasks();
    };

    // Initial load
    loadTasks();
});
