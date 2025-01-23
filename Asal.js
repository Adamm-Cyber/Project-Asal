document.addEventListener("DOMContentLoaded", function () {
    const addTaskButton = document.getElementById("add_task");
    const todoInput = document.getElementById("new_todo");
    const todoList = document.getElementById("todo-list");
    const errorMessage = document.getElementById("error-message");
    const filterAllButton = document.getElementById("filter-all");
    const filterDoneButton = document.getElementById("filter-done");
    const filterTodoButton = document.getElementById("filter-todo");
    const deleteAllTasksButton = document.getElementById("delete_all_tasks"); // الزر الأحمر "Delete All Tasks"
    const deleteDoneTasksButton = document.getElementById("delete_done_tasks"); // الزر الأحمر "Delete Done Tasks"

    // تنظيف localStorage من البيانات غير الصحيحة
    cleanLocalStorage();

    // تحميل المهام من Local Storage عند فتح الصفحة
    loadTasks();

    // إضافة مهمة جديدة
    addTaskButton.addEventListener("click", function () {
        const value = todoInput.value.trim();

        // التحقق من الإدخال
        if (!/^[\u0621-\u064Aa-zA-Z ]+$/.test(value)) {
            errorMessage.textContent = "Only letters and spaces are allowed (no numbers)!";
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
        // التأكد من أن المهمة سلسلة نصية
        if (typeof taskText !== "string") {
            console.error("Invalid task format:", taskText);
            return; // تجاهل المهام غير الصحيحة
        }

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
            filterTasks(); // تصفية المهام عند تغيير حالة المهمة
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
                if (newTask.trim().length >= 5 && /^[\u0621-\u064Aa-zA-Z ]+$/.test(newTask.trim())) {
                    taskTextElement.textContent = newTask.trim();
                    updateTaskInStorage(taskText, newTask.trim());
                } else {
                    alert("The edited task must contain only letters, spaces, and at least 5 characters.");
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
        filterTasks(); // تصفية المهام بعد إضافة مهمة جديدة
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
        tasks.forEach((task) => {
            if (typeof task === "string" && /^[\u0621-\u064Aa-zA-Z ]+$/.test(task)) {
                addTask(task); // إضافة المهمة فقط إذا كانت سلسلة نصية صحيحة
            } else {
                console.error("Invalid task found and removed:", task);
            }
        });
    }

    // تنظيف localStorage من البيانات غير الصحيحة
    function cleanLocalStorage() {
        let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks = tasks.filter((task) => typeof task === "string" && /^[\u0621-\u064Aa-zA-Z ]+$/.test(task));
        localStorage.setItem("tasks", JSON.stringify(tasks));
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

    // حذف جميع المهام
    function deleteAllTasks() {
        // حذف جميع المهام من واجهة المستخدم
        todoList.innerHTML = "";

        // حذف جميع المهام من localStorage
        localStorage.removeItem("tasks");
    }

    // حذف المهام المكتملة
    function deleteDoneTasks() {
        const tasks = document.querySelectorAll(".task-item");
        tasks.forEach((task) => {
            const checkbox = task.querySelector(".task-checkbox");
            if (checkbox.checked) {
                // حذف المهمة من واجهة المستخدم
                todoList.removeChild(task);

                // حذف المهمة من localStorage
                const taskText = task.querySelector("span").textContent;
                removeTaskFromStorage(taskText);
            }
        });
    }

    // إضافة حدث النقر على الزر "Delete All Tasks"
    deleteAllTasksButton.addEventListener("click", deleteAllTasks);

    // إضافة حدث النقر على الزر "Delete Done Tasks"
    deleteDoneTasksButton.addEventListener("click", deleteDoneTasks);

    // تصفية المهام
    function filterTasks() {
        const tasks = document.querySelectorAll(".task-item");
        tasks.forEach(task => {
            const checkbox = task.querySelector(".task-checkbox");
            task.style.display = "flex"; // إظهار جميع المهام بشكل افتراضي

            if (filterDoneButton.classList.contains("active") && !checkbox.checked) {
                task.style.display = "none"; // إخفاء المهام غير المكتملة
            } else if (filterTodoButton.classList.contains("active") && checkbox.checked) {
                task.style.display = "none"; // إخفاء المهام المكتملة
            }
        });
    }

    // إضافة الأحداث لأزرار التصفية
    filterAllButton.addEventListener("click", function () {
        filterAllButton.classList.add("active");
        filterDoneButton.classList.remove("active");
        filterTodoButton.classList.remove("active");
        filterTasks();
    });

    filterDoneButton.addEventListener("click", function () {
        filterDoneButton.classList.add("active");
        filterAllButton.classList.remove("active");
        filterTodoButton.classList.remove("active");
        filterTasks();
    });

    filterTodoButton.addEventListener("click", function () {
        filterTodoButton.classList.add("active");
        filterAllButton.classList.remove("active");
        filterDoneButton.classList.remove("active");
        filterTasks();
    });

    // تفعيل تصفية "All" بشكل افتراضي عند تحميل الصفحة
    filterAllButton.classList.add("active");
    filterTasks();
});