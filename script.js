// Elements
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const errorMessage = document.querySelector('#error-message');
const list = document.querySelector('#task-list');
// now i don't have to keep searching the page every time

// Storage (localStorage can only save strings, not real arrays/objects)
// so I turn my array into text before saving     -->  (stringify)
// and turn it back into an array when I load it  <--  (parse)
function save() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('nextId', JSON.stringify(nextId));
}

function load() {
  const raw = localStorage.getItem('tasks');
  return JSON.parse(raw) || []; // "|| []" --> if there's nothing, just start empty
}

function loadNextId() {
  const raw = localStorage.getItem('nextId');
  return JSON.parse(raw) || 1; // "|| 1" --> start counting from 1 if nothing saved
}

// Data
let tasks = load();
let nextId = loadNextId(); // counter for giving each new task a unique id

// add task / switch task done-not done / remove task:

// adds a new task
function addTask(title) {
  const trimmed = title.trim(); // removes extra spaces before/after

// if after trimming it's empty, don't add it --> show an error
  if (trimmed === '') {
    errorMessage.textContent = 'Task cannot be empty.';
    return;
  }

  errorMessage.textContent = ''; // to clear old error (if there was one)

  const newTask = {
    id: 'task-' + nextId, // simple unique id, "task-1", "task-2"...
    title: trimmed,
    done: false
  };

  nextId = nextId + 1; // get ready for the next task

  tasks.push(newTask);  // add it to the array
  save();               // save the updated array
  renderTasks();        // redraw the list on screen
}

// switches a task between done / not done
function toggleTask(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  );
  save();
  renderTasks();
}

// removes a task
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id); // keep every task EXCEPT the one with this id
  save();
  renderTasks();
}

// Rendering
function taskToListItem(task) {  // builds the actual <li> element for a task
  const li = document.createElement('li');
  li.classList.add('task');
  li.dataset.id = task.id;

  if (task.done) {
    li.classList.add('done'); // makes it look checked
  }

  // the little checkbox button
  const checkbox = document.createElement('button');
  checkbox.type = 'button';
  checkbox.classList.add('checkbox');
  checkbox.textContent = task.done ? '✓' : ''; // shows a checkmark if done

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('task-title');
  titleSpan.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.textContent = 'Delete';

  // putting the checkbox + title together on the left side
  const left = document.createElement('div');
  left.classList.add('task-left');
  left.append(checkbox);
  left.append(titleSpan);

  li.append(left);
  li.append(deleteBtn);

  return li;
}

// drawing the whole list
function renderTasks() {
  list.innerHTML = ''; // clear the list first (or old items adds up)
  tasks
    .map(taskToListItem) // turns each task into an <li>
    .forEach(li => list.append(li));
}

// Events

// to add a task --> click or press enter (both trigger the form's submit)
form.addEventListener('submit', (e) => {
  e.preventDefault(); // stop the page from reloading
  addTask(input.value);
  input.value = ''; // clear the input box after adding
});

// I only put 1 listener on the whole list (not 1 per task)
// a listener on a deleted task would just disappear with it
list.addEventListener('click', (e) => {
  const li = e.target.closest('.task');
  if (!li) return; // clicked somewhere empty --> do nothing

  const id = li.dataset.id;

  // figure out what part was clicked (delete button or checkbox)
  if (e.target.closest('.delete-btn')) {
    deleteTask(id);
    return;
  }

  if (e.target.closest('.checkbox')) {
    toggleTask(id);
  }
});

// Start - run once when the page first loads
// show tasks that were saved from last time
renderTasks();