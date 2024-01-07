const form = document.querySelector("#form");
const tasksList = document.querySelector("#tasksList");
const taskInput = document.querySelector("#taskInput");
const emptyList = document.querySelector("#emptyList");

let tasks = []

if(localStorage.getItem("tasks")){
	tasks = JSON.parse(localStorage.getItem("tasks"))
}

tasks.forEach(function(task) {
	renderTask(task)
});

checkEmptyList() 

tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);
form.addEventListener("submit", addTask);

function addTask(event){
	event.preventDefault();
	
	const text = taskInput.value;

	const newTask = {
		id: Date.now(),
		text: text,
		done: false,
	}

	tasks.push(newTask);

	renderTask(newTask)

	taskInput.value = " ";
	taskInput.focus();

	saveToLocalStorage()
	checkEmptyList()
}
function deleteTask(event){
	if(event.target.dataset.action !== "delete") return

	const parentNode = event.target.closest(".list-group-item");
	const id = Number(parentNode.id)
	
	const index = tasks.findIndex(function(task){
		if(task.id === id){
			return true
		}
	})

	tasks.splice(index, 1)

	parentNode.remove();

	saveToLocalStorage()
	checkEmptyList()
}
function doneTask(event){
	if(event.target.dataset.action !== "done") return

		const parentNode = event.target.closest(".list-group-item");

		const id = Number(parentNode.id)
	
		const task = tasks.find(function(task){
			if(task.id === id){
				return true
			}
		})

		task.done = !task.done

		const taskTitle = parentNode.querySelector(".task-title");
		taskTitle.classList.toggle("task-title--done");
	
		saveToLocalStorage()
}
function checkEmptyList(){
	if(tasks.length === 0){
		const emptyListHTML = 
		`<li id="emptyList" class="list-group-item empty-list">
			<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
			<div class="empty-list__title">Список дел пуст</div>
		</li>`

		tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
	}
	if(tasks.length > 0){
		const emptyListEl = document.querySelector("#emptyList");
		emptyListEl ? emptyListEl.remove() : null
	}
}
function saveToLocalStorage(){
	localStorage.setItem("tasks", JSON.stringify(tasks))
}
function renderTask(task){
	const cssStyle = task.done ? "task-title task-title--done" : "task-title";

	const taskHTML = 
	`<li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
		<span class="${cssStyle}">${task.text}</span>
		<div class="task-item__buttons">
			<button type="button" data-action="done" class="btn-action">
				<img src="./img/tick.svg" alt="Done" width="18" height="18">
			</button>
			<button type="button" data-action="delete" class="btn-action">
				<img src="./img/cross.svg" alt="Done" width="18" height="18">
			</button>
		</div>
	</li>`

	tasksList.insertAdjacentHTML("beforeend", taskHTML);
}