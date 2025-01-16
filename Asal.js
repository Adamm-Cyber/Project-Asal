document.addEventListener("DOMContentLoaded", function () {
    const addTaskButton = document.getElementById("add_task");
    const todoInput = document.getElementById("new_todo");
    const todoList = document.getElementById("todo-list");
    const errorMessage = document.getElementById("error-message");

    // إضافة مهمة جديدة
    addTaskButton.addEventListener("click", function () {
        const value = todoInput.value.trim();

        // التحقق من الإدخال
        // السماح بالأحرف العربية والإنجليزية
        if (!/^[\w\s\u0600-\u06FF]+$/.test(value)) {
            errorMessage.textContent = "Only letters (English or Arabic) are allowed!";
            errorMessage.style.display = "block";
            return;
        } else if (value.length < 5) {
            errorMessage.textContent = "The input must contain at least 5 characters!";
            errorMessage.style.display = "block";
            return;
        }

        // إذا كان الإدخال صحيحًا
        errorMessage.style.display = "none";

        // إنشاء عنصر المهمة
        const taskItem = document.createElement("li");
        taskItem.className = "task-item";

        const taskText = document.createElement("span");
        taskText.textContent = value;

        // إنشاء مربع تحديد (Checkbox)
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.addEventListener("change", function () {
            if (checkbox.checked) {
                taskText.style.textDecoration = "line-through";
                taskText.style.color = "red";
            } else {
                taskText.style.textDecoration = "none";
                taskText.style.color = "black";
            }
        });

        // زر "حذف"
        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "&#128465;";
        deleteButton.className = "delete-button";
        deleteButton.addEventListener("click", function () {
            todoList.removeChild(taskItem);
        });

        // إضافة العناصر إلى المهمة
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskText);
        taskItem.appendChild(deleteButton);

        // إضافة المهمة إلى القائمة
        todoList.appendChild(taskItem);

        // تفريغ الحقل
        todoInput.value = "";
    });
});
