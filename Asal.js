document.addEventListener("DOMContentLoaded", function () {
    const addTaskButton = document.getElementById("add_task");
    const todoInput = document.getElementById("new_todo");
    const todoList = document.getElementById("todo-list");
    const errorMessage = document.getElementById("error-message");

    // تحميل المهام من Local Storage عند فتح الصفحة
    loadTasks();

    // إضافة مهمة جديدة
    addTaskButton.addEventListener("click", function () {
        const value = todoInput.value.trim();

        // التحقق من الإدخال
        if (!/^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9 ]+$/.test(value)) {
            errorMessage.textContent = "Only letters, numbers, and spaces are allowed!";
            errorMessage.style.display = "block";
            return;
        } else if (value.length < 5) {
            errorMessage.textContent = "The input must contain at least 5 characters!";
            errorMessage.style.display = "block";
            return;
        }

        // إذا كان الإدخال صحيحًا
        errorMessage.style.display = "none";

        // إنشاء وإضافة المهمة
        addTask(value);

        // حفظ المهمة في Local Storage
        saveTask(value);

        // تفريغ الحقل
        todoInput.value = "";
    });

    // إضافة مهمة إلى القائمة
    function addTask(taskText) {
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        const taskContent = document.createElement("div");
        taskContent.className = "task-content";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                taskTextElement.style.textDecoration = "line-through";
                taskTextElement.style.color = "red";
            } else {
                taskTextElement.style.textDecoration = "none";
                taskTextElement.style.color = "black";
            }
        });

        const taskTextElement = document.createElement("span");
        taskTextElement.textContent = taskText;

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextElement);

        const editButton = document.createElement("button");
        editButton.innerHTML = "✏️";
        editButton.className = "edit-button";
        editButton.addEventListener("click", function () {
            const newTask = prompt("Edit your task:", taskTextElement.textContent);
            if (newTask && newTask.trim() !== "") {
                if (newTask.trim().length >= 5 && /^[\u0621-\u064A\u0660-\u0669a-zA-Z0-9 ]+$/.test(newTask.trim())) {
                    taskTextElement.textContent = newTask.trim();
                    updateTaskInStorage(taskText, newTask.trim());
                } else {
                    alert("The edited task must contain only letters, numbers, and at least 5 characters.");
                }
            }
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "🗑️";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function () {
            todoList.removeChild(taskItem);
            removeTaskFromStorage(taskText);
        });

        taskItem.appendChild(taskContent);
        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);

        todoList.appendChild(taskItem);
    }

    // حفظ المهام في Local Storage
    function saveTask(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // استرجاع المهام من Local Storage
    function loadTasks() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach((task) => addTask(task));
    }

    // تحديث المهمة في Local Storage
    function updateTaskInStorage(oldTask, newTask) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        const taskIndex = tasks.indexOf(oldTask); 
        if (taskIndex !== -1) {
            tasks[taskIndex] = newTask;
        }
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // حذف مهمة من Local Storage
    function removeTaskFromStorage(task) {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter((t) => t !== task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
});
