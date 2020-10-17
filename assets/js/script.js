let formEl = document.getElementById("task-form");

let tasksToDoEl = document.querySelector("#tasks-to-do");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompletedEl = document.querySelector("#tasks-completed");

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

    let isEdit = formEl.hasAttribute("data-task-id");

    if (isEdit) {
        let taskID = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskID);
    }
    else {
        let taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,        
        };
        
        createTaskEl(taskDataObj);
    };   
};

let createTaskEl = function(taskDataObj) {
    let taskItemEl = document.createElement("li");
    taskItemEl.className = "task-item";

    taskItemEl.setAttribute("data-task-id", taskIDCounter);
    taskItemEl.setAttribute("draggable", "true");

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

let taskButtonHandler = function(event) {
    let targetEl = event.target;
    
    if(targetEl.matches(".edit-btn")) {
        let taskID = targetEl.getAttribute("data-task-id");
        console.log("Stop touching me!\nTask ID: " + taskID);
        editTask(taskID);
    };
    
    if(targetEl.matches(".delete-btn")) {
        let taskID = targetEl.getAttribute("data-task-id");
        console.log("Ouch! Don't delete me!\nTask ID: " + taskID);
        deleteTask(taskID);
    };
}

let deleteTask = function(taskID) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");
    taskSelected.remove();
}

let editTask = function(taskID) {
    console.log("editing task #" + taskID);

    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    let taskName = taskSelected.querySelector("h3.task-name").textContent;

    let taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskID);

}

let completeEditTask = function(taskName, taskType, taskID) {
    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.getElementById("save-task").textContent = "Add Task";
}

let taskStatusChangeHandler = function(event) {
    let taskID = event.target.getAttribute("data-task-id");

    let statusValue = event.target.value.toLowerCase();

    let taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    console.log(statusValue);

    /*if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } 
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } 
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }; 
    */
    switch (statusValue) {
        case "to do":
            tasksToDoEl.appendChild(taskSelected);
            break;
        case "in progress":
            tasksInProgressEl.appendChild(taskSelected);
            break;
        case "completed":
            tasksCompletedEl.appendChild(taskSelected);
            break;
    };
}

let dragTaskHandler = function(event) {
    let taskID = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskID);
}

let dropZoneDragHandler = function(event) {
    let taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    };

}

let dropTaskHandler = function(event) {
    let id = event.dataTransfer.getData("text/plain");
    let draggableElement = document.querySelector("[data-task-id='" + id + "']");
    let dropZoneEl = event.target.closest(".task-list");
    let statusType = dropZoneEl.id;
    let statusSelectEl = draggableElement.querySelector("select[name='status-change']");
    
    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    }

    dropZoneEl.appendChild(draggableElement);
    dropZoneEl.removeAttribute("style");
}

let dragLeaveHandler = function (event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}

pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
