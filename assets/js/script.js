let formEl = document.getElementById("task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");

let taskFormHandler = function(event) {

    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    let taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,        
    }

    createTaskEl(taskDataObj);
};

let createTaskEl = function(taskDataObj) {
    let taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    taskItemEl.appendChild(taskInfoEl)

    tasksToDoEl.appendChild(taskItemEl);
}

formEl.addEventListener("submit", taskFormHandler);