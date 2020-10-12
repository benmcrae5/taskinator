let formEl = document.getElementById("task-form");
let tasksToDoEl = document.querySelector("#tasks-to-do");
let taskIDCounter = 0;
let pageContentEl = document.getElementById("page-content");

let taskFormHandler = function(event) {

    event.preventDefault();
    let taskNameInput = document.querySelector("input[name='task-name']").value;
    let taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("you need to fill out the task form!");
        return false;
    };

    formEl.reset();

    let taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput,        
    }

    createTaskEl(taskDataObj);
};

let createTaskEl = function(taskDataObj) {
    let taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    taskItemEl.setAttribute("data-task-id", taskIDCounter);

    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    taskItemEl.appendChild(taskInfoEl)

    let taskActionsEl = createTaskActions(taskIDCounter);
    taskItemEl.appendChild(taskActionsEl);    

    tasksToDoEl.appendChild(taskItemEl);

    taskIDCounter++;
}

let createTaskActions = function(taskID) {
    let actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    let editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(editButtonEl);

    let deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(deleteButtonEl);

    let statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskID);

    actionContainerEl.appendChild(statusSelectEl);

    let statusChoices = ["To Do", "In Progress", "Completed"];

    for (let i = 0; i < statusChoices.length; i++) {
        let statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

formEl.addEventListener("submit", taskFormHandler);

let taskbuttonHandler = function(event) {
    if(event.target.matches(".delete-btn")) {
        let taskID = event.target.getAttribute("data-task-id");
        console.log("Ouch! Don't delete me!\nTask ID: " + taskID);
        deleteTask(taskID);
    };
}

let deleteTask = function(taskID) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
    taskSelected.remove();
}

pageContentEl.addEventListener("click", taskbuttonHandler);
