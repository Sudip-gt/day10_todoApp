import './style.css';

const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");

const todoList = document.getElementById("todoList");
const doingList = document.getElementById("doingList");
const doneList = document.getElementById("doneList");

todoList.dataset.status = "todo";
doingList.dataset.status = "doing";
doneList.dataset.status = "done";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
console.log(tasks);
tasks.forEach(task => {
    createTaskItem(task.text, task.completed, task.taskStatus || "todo");
});


form.addEventListener("submit", function (e) {
    e.preventDefault();
    const task = input.value.trim();

    // check if task is empty or already exists
    if (task === "") return;
    const duplicate = tasks.some(t => t.text.toLowerCase() === task.toLowerCase());
    if (duplicate) {
        alert("Task already exists.");
        return;
    };

    tasks.push({ text: task, completed: false, taskStatus: "todo" });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTaskItem(task, false, "todo");
    input.value = "";
});

function createTaskItem(taskText, completed, taskStatus = "todo") {
    const li = document.createElement("li");
    let statusColor = {
        todo: "border-red-500 text-red-500",
        doing: "border-yellow-500 text-yellow-500",
        done: "border-green-500 text-green-500"
    };

    li.className = `flex justify-between items-center p-2 border ${statusColor[taskStatus]} rounded`;
    li.draggable = true;
    li.dataset.text = taskText;
    li.dataset.taskStatus = taskStatus;

    const span = document.createElement("span");
    span.textContent = taskText;

    // Edit button 
    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.className = "px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2";

    editButton.addEventListener("click", function () {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.value = taskText;
        inputField.className = "flex-1 mr-2 px-2 py-1 border border-gray-300 rounded";

        li.replaceChild(inputField, span);
        inputField.focus();

        const saveEdit = () => {
            const newText = inputField.value.trim();
            if (
                newText === "" ||
                tasks.some(t => t.text.toLowerCase() === newText.toLowerCase() && t.text.toLowerCase() !== taskText.toLowerCase())
            ) {
                alert("Invalid or duplicate task.");
                li.replaceChild(span, inputField);
                return;
            }

            // Update in array and localStorage
            const index = tasks.findIndex(t => t.text === taskText);
            if (index !== -1) {
                tasks[index].text = newText;
                localStorage.setItem("tasks", JSON.stringify(tasks));
            }

            // Update span text and event handlers
            span.textContent = newText;
            taskText = newText; // update reference for future use
            li.dataset.text = newText;
            li.replaceChild(span, inputField);
        };

        inputField.addEventListener("blur", saveEdit);
        inputField.addEventListener("keydown", function (e) {
            if (e.key === "Enter") saveEdit();
        });
    });


    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className =
        "px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600";

    deleteButton.addEventListener("click", function () {
        li.remove();

        // remove (task text that doesn't match clicked button) from array and update storage
        tasks = tasks.filter(t => t.text !== taskText);
        localStorage.setItem("tasks", JSON.stringify(tasks));
    });


    li.appendChild(span);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    li.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", li.dataset.text);
    });
    const container = document.getElementById(`${taskStatus}List`);
    container.appendChild(li);
}

["todoList", "doingList", "doneList"].forEach(listId => {
    const list = document.getElementById(listId);
    const newTaskStatus = list.dataset.status;

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        list.classList.add("ring-2", "ring-blue-400");
    });
    list.addEventListener("dragleave", () => {
        list.classList.remove("ring-2", "ring-blue-400");
    });
    list.addEventListener("drop", (e) => {
        e.preventDefault();
        list.classList.remove("ring-2", "ring-blue-400");

        const taskText = e.dataTransfer.getData("text/plain");
        const li = [...document.querySelectorAll("li")].find(li => li.dataset.text === taskText);
        if (!li) return;

        list.appendChild(li);

        const index = tasks.findIndex(t => t.text === taskText);
        if (index !== -1) {
            tasks[index].taskStatus = newTaskStatus;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }

        li.dataset.taskStatus = newTaskStatus;
    });
});