// Select elements
const addTaskButton = document.querySelector('.add-task-btn');
const taskInput = document.querySelector('.task-input');
const todoColumn = document.querySelector('.to-do'); // Select the TO-DO column
const columns = document.querySelectorAll('.project__column');

// Variable to store the currently dragged task
let draggedTask = null;

// Function to add a new task
function addTask() {
    if (taskInput.value.trim() === '') {
        alert('Please enter a task name.');
        return; // Exit if the input is empty
    }

    // Create a new task item
    const newTask = document.createElement('div');
    newTask.classList.add('column-item');
    newTask.setAttribute('draggable', 'true'); // Make the new task draggable

    // Set the inner HTML of the new task
    newTask.innerHTML = `
        <i class="fa-solid fa-xmark"></i>
        <div class="item-priority high">high priority</div>
        <div class="item-title">${taskInput.value}</div>
        <div class="item-date">
            <span class="date-icon"><i class="fa-regular fa-calendar"></i></span>
            <p class="date">Jan 12th, 2028</p>
        </div>
    `;

    // Insert the new task at the top of the TO-DO column
    todoColumn.insertBefore(newTask, document.querySelector('.add-task'));
    
    // Clear the input field
    taskInput.value = '';

    // Add close functionality to the new task's close icon
    const closeIcon = newTask.querySelector('.fa-xmark'); 
    closeIcon.addEventListener('click', () => {
        newTask.style.display = 'none'; // Hide the new task
    });

    // Add drag-and-drop functionality to the new task
    newTask.addEventListener('dragstart', (e) => {
        draggedTask = newTask;
        setTimeout(() => {
            newTask.style.opacity = '0.5';
        }, 0);
    });

    newTask.addEventListener('dragend', () => {
        draggedTask.style.opacity = '1';
        draggedTask = null;
        columns.forEach(column => {
            column.style.backgroundColor = 'var(--column-color)';
            const tasksInColumn = column.querySelectorAll('.column-item');
            tasksInColumn.forEach(task => {
                task.style.borderTop = 'none';
                task.style.borderBottom = 'none';
            });
            // Reset border on add-task div
            const addTaskDiv = column.querySelector('.add-task');
            if (addTaskDiv) {
                addTaskDiv.style.borderTop = 'none';
                addTaskDiv.style.borderBottom = 'none';
            }
        });
    });
}

// Event listener for the "Add Task" button
addTaskButton.addEventListener('click', addTask);

// Event listener for the task input field to listen for the Enter key
taskInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        addTask(); // Call the addTask function when Enter is pressed
    }
});

// Function to add close functionality to existing tasks
function addCloseFunctionality() {
    const closeIcons = document.querySelectorAll('.fa-xmark');

    closeIcons.forEach(closeIcon => {
        closeIcon.addEventListener('click', () => {
            const taskItem = closeIcon.parentElement; // Get the parent column-item
            taskItem.style.display = 'none'; // Hide the task item
        });
    });
}

// Add drag-and-drop functionality to existing tasks
function addDragAndDropFunctionality() {
    // Function to add drag events to a task
    function addDragEventsToTask(task) {
        // When a task starts being dragged
        task.addEventListener('dragstart', (e) => {
            draggedTask = task; // Store the dragged task
            setTimeout(() => {
                task.style.opacity = '0.5'; // Add visual feedback during drag
            }, 0);
        });

        // When dragging ends (either dropped or canceled)
        task.addEventListener('dragend', () => {
            draggedTask.style.opacity = '1'; // Reset opacity
            draggedTask = null; // Clear the dragged task
            // Remove any placeholder styles
            columns.forEach(column => {
                column.style.backgroundColor = 'var(--column-color)';
                const tasksInColumn = column.querySelectorAll('.column-item');
                tasksInColumn.forEach(task => {
                    task.style.borderTop = 'none';
                    task.style.borderBottom = 'none';
                });
                // Reset border on add-task div
                const addTaskDiv = column.querySelector('.add-task');
                if (addTaskDiv) {
                    addTaskDiv.style.borderTop = 'none';
                    addTaskDiv.style.borderBottom = 'none';
                }
            });
        });
    }

    // Add drag-and-drop functionality to each column
    columns.forEach(column => {
        // Allow dropping by preventing the default behavior
        column.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow dropping
            column.style.backgroundColor = '#e0e0e0'; // Highlight the column

            // Find the closest task to the mouse position
            const tasksInColumn = Array.from(column.querySelectorAll('.column-item'));
            const addTaskDiv = column.querySelector('.add-task');
            let closestTask = null;
            let insertBefore = true;

            // Get the mouse's Y position
            const mouseY = e.clientY;

            // If there are no tasks, we can drop at the top (before add-task if it exists)
            if (tasksInColumn.length === 0) {
                if (addTaskDiv) {
                    closestTask = addTaskDiv;
                    insertBefore = true;
                }
            } else {
                // Loop through tasks to find the closest one
                for (let i = 0; i < tasksInColumn.length; i++) {
                    const task = tasksInColumn[i];
                    if (task === draggedTask) continue; // Skip the dragged task

                    const taskRect = task.getBoundingClientRect();
                    const taskMiddle = taskRect.top + taskRect.height / 2;

                    // If mouse is above the first task, insert at the top
                    if (i === 0 && mouseY < taskRect.top) {
                        closestTask = task;
                        insertBefore = true;
                        break;
                    }

                    // If mouse is below the last task, insert after it
                    if (i === tasksInColumn.length - 1 && mouseY > taskRect.bottom) {
                        closestTask = task;
                        insertBefore = false;
                        break;
                    }

                    // If mouse is between tasks, find the closest one
                    if (mouseY < taskMiddle) {
                        closestTask = task;
                        insertBefore = true;
                        break;
                    } else if (!closestTask) {
                        closestTask = task;
                        insertBefore = false;
                    }
                }
            }

            // Add a visual placeholder only to column-items (not add-task)
            tasksInColumn.forEach(task => {
                task.style.borderTop = 'none';
                task.style.borderBottom = 'none';
            });
            if (closestTask && closestTask.classList.contains('column-item')) {
                if (insertBefore) {
                    closestTask.style.borderTop = '2px dashed #1A73E8';
                } else {
                    closestTask.style.borderBottom = '2px dashed #1A73E8';
                }
            }
        });

        // Reset the column's background and borders when the task leaves
        column.addEventListener('dragleave', () => {
            column.style.backgroundColor = 'var(--column-color)';
            const tasksInColumn = column.querySelectorAll('.column-item');
            tasksInColumn.forEach(task => {
                task.style.borderTop = 'none';
                task.style.borderBottom = 'none';
            });
            // Reset border on add-task div
            const addTaskDiv = column.querySelector('.add-task');
            if (addTaskDiv) {
                addTaskDiv.style.borderTop = 'none';
                addTaskDiv.style.borderBottom = 'none';
            }
        });

        // Handle the drop event
        column.addEventListener('drop', (e) => {
            e.preventDefault(); // Prevent default behavior
            if (!draggedTask) return;

            // Find the closest task to the mouse position
            const tasksInColumn = Array.from(column.querySelectorAll('.column-item'));
            const addTaskDiv = column.querySelector('.add-task');
            let closestTask = null;
            let insertBefore = true;

            // Get the mouse's Y position
            const mouseY = e.clientY;

            // If there are no tasks, we can drop at the top (before add-task if it exists)
            if (tasksInColumn.length === 0) {
                if (addTaskDiv) {
                    column.insertBefore(draggedTask, addTaskDiv);
                } else {
                    column.appendChild(draggedTask);
                }
            } else {
                // Loop through tasks to find the closest one
                for (let i = 0; i < tasksInColumn.length; i++) {
                    const task = tasksInColumn[i];
                    if (task === draggedTask) continue; // Skip the dragged task

                    const taskRect = task.getBoundingClientRect();
                    const taskMiddle = taskRect.top + taskRect.height / 2;

                    // If mouse is above the first task, insert at the top
                    if (i === 0 && mouseY < taskRect.top) {
                        closestTask = task;
                        insertBefore = true;
                        break;
                    }

                    // If mouse is below the last task, insert after it
                    if (i === tasksInColumn.length - 1 && mouseY > taskRect.bottom) {
                        closestTask = task;
                        insertBefore = false;
                        break;
                    }

                    // If mouse is between tasks, find the closest one
                    if (mouseY < taskMiddle) {
                        closestTask = task;
                        insertBefore = true;
                        break;
                    } else if (!closestTask) {
                        closestTask = task;
                        insertBefore = false;
                    }
                }

                // Insert the dragged task
                if (closestTask) {
                    if (insertBefore) {
                        column.insertBefore(draggedTask, closestTask);
                    } else {
                        closestTask.insertAdjacentElement('afterend', draggedTask);
                    }
                } else {
                    // If no tasks in the column, append to the end (or before add-task)
                    if (addTaskDiv) {
                        column.insertBefore(draggedTask, addTaskDiv);
                    } else {
                        column.appendChild(draggedTask);
                    }
                }
            }

            // Reset styles
            column.style.backgroundColor = 'var(--column-color)';
            tasksInColumn.forEach(task => {
                task.style.borderTop = 'none';
                task.style.borderBottom = 'none';
            });
            // Reset border on add-task div
            if (addTaskDiv) {
                addTaskDiv.style.borderTop = 'none';
                addTaskDiv.style.borderBottom = 'none';
            }
        });
    });

    // Add drag events to all existing tasks
    document.querySelectorAll('.column-item').forEach(task => {
        addDragEventsToTask(task);
    });
}

// Call the functions to add close and drag-and-drop functionality on page load
addCloseFunctionality();
addDragAndDropFunctionality();