let tasks = [];

// Load tasks from localStorage when the page loads
window.onload = function() {
    if (localStorage.getItem('tasks')) {
        tasks = JSON.parse(localStorage.getItem('tasks'));
        displayTasks();
    }
};

function displaySuggestions(suggestions) {
    const suggestionsList = document.getElementById('suggestions');
    clearSuggestions();
    suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        listItem.textContent = `${suggestion.name}, ${suggestion.country}`;
        listItem.addEventListener('click', () => {
            document.getElementById('locationInput').value = listItem.textContent;
            clearSuggestions();
        });
        suggestionsList.appendChild(listItem);
    });
}

function clearSuggestions() {
    const suggestionsList = document.getElementById('suggestions');
    suggestionsList.innerHTML = '';
}

function addTask() {
    const taskDescription = document.getElementById('taskDescription').value;
    const startDate = document.getElementById('startDate').value;
    const startTime = document.getElementById('startTime').value;
    const priorityLevel = document.getElementById('priorityLevel').value;
    const dueDate = document.getElementById('dueDate').value;
    const dueTime = document.getElementById('dueTime').value;
    const status = document.getElementById('status').value;

    if (!taskDescription || !startDate || !startTime || !priorityLevel || !dueDate || !dueTime || !status) {
        alert("Please fill out all required fields.");
        return;
    }

    const task = {
        taskDescription,
        startDate,
        startTime,
        priorityLevel,
        dueDate,
        dueTime,
        status
    };

    tasks.push(task);
    saveTasks();
    displayTasks();
    clearTaskInputs();
    setAlertForDueDate(task);
}

function displayTasks(filteredTasks = tasks) {
    const taskTable = document.getElementById('taskTable').getElementsByTagName('tbody')[0];
    taskTable.innerHTML = '';

    filteredTasks.forEach((task, index) => {
        const newRow = taskTable.insertRow();

        newRow.insertCell(0).textContent = index + 1;
        newRow.insertCell(1).textContent = task.taskDescription;
        newRow.insertCell(2).textContent = task.startDate;
        newRow.insertCell(3).textContent = task.startTime;
        newRow.insertCell(4).textContent = task.priorityLevel;
        newRow.insertCell(5).textContent = task.dueDate;
        newRow.insertCell(6).textContent = task.dueTime;
        newRow.insertCell(7).textContent = task.status;

        const alertCell = newRow.insertCell(8);
        if (task.status === 'Completed') {
            alertCell.textContent = 'Completed successfully';
        } else {
            const startDateTime = new Date(`${task.startDate}T${task.startTime}`);
            const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
            const now = new Date();
            const timeDifference = dueDateTime - now;

            if (timeDifference > 0) {
                const hours = Math.floor(timeDifference / (1000 * 60 * 60));
                const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
                alertCell.textContent = `Due in ${hours} hours and ${minutes} minutes`;
            } else {
                const pastHours = Math.abs(Math.floor(timeDifference / (1000 * 60 * 60)));
                const pastMinutes = Math.abs(Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60)));
                alertCell.textContent = `Past due by ${pastHours} hours and ${pastMinutes} minutes`;
            }
        }

        const actionsCell = newRow.insertCell(9);
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editTask(index);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteTask(index);
        actionsCell.appendChild(deleteButton);
    });
}

function clearTaskInputs() {
    document.getElementById('taskDescription').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('priorityLevel').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('dueTime').value = '';
    document.getElementById('status').value = '';
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    displayTasks();
}

function editTask(index) {
    const task = tasks[index];

    document.getElementById('taskDescription').value = task.taskDescription;
    document.getElementById('startDate').value = task.startDate;
    document.getElementById('startTime').value = task.startTime;
    document.getElementById('priorityLevel').value = task.priorityLevel;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('dueTime').value = task.dueTime;
    document.getElementById('status').value = task.status;

    deleteTask(index);
}

function setAlertForDueDate(task) {
    const dueDateTime = new Date(`${task.dueDate}T${task.dueTime}`);
    const now = new Date();
    const timeDifference = dueDateTime - now;

    if (timeDifference > 0) {
        setTimeout(() => {
            alert(`Task "${task.taskDescription}" is due now!`);
        }, timeDifference);
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function searchTasks() {
    const query = document.getElementById('searchBar').value.toLowerCase();
    const filteredTasks = tasks.filter(task => 
        task.taskDescription.toLowerCase().includes(query) ||
        task.priorityLevel.toLowerCase().includes(query) ||
        task.startDate.includes(query) ||
        task.startTime.includes(query) ||
        task.dueDate.includes(query) ||
        task.dueTime.includes(query) ||
        task.status.toLowerCase().includes(query)
    );
    displayTasks(filteredTasks);
}
