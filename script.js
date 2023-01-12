const listscontainer = document.querySelector('[data-lists]');
const newListForm = document.querySelector('[data-new-list-form]');
const newListInput = document.querySelector('[data-new-list-input]');
const deleteListButton = document.querySelector('[data-delete-list-button]')
const listDisplayContainer = document.querySelector('[data-list-display-container]')
const listTitleElement = document.querySelector('[data-list-title]')
const listCountElement = document.querySelector('[data-list-count]')
const tasksContainer = document.querySelector('[data-tasks]')
const taskTemplate = document.getElementById('task-template')
const newTaskForm = document.querySelector('[data-new-task-form]') 
const newTaskInput = document.querySelector('[data-new-task-input]')
const clearCompleteTasksButton = document.querySelector('[data-clear-complete-tasks-button]')


const LOCAL_STORAGE_LIST_KEY = 'task.lists'
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = 'task.selectedlistId'
let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || []
selectedlistId = localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)

listscontainer.addEventListener('click' , e =>{
    if(e.target.tagName.toLowerCase()==='li'){
        selectedlistId =e.target.dataset.listId
        saveAndrender()
    }
})

tasksContainer.addEventListener('click', e => {
    if (e.target.tagName.toLowerCase() === 'input') {
      const selectedlist = lists.find(list => list.id === selectedlistId)
      const selectedTask = selectedlist.tasks.find(task => task.id === e.target.id)
      selectedTask.complete = e.target.checked
      save()
      renderTaskCount(selectedlist)
    }
  })
  
  clearCompleteTasksButton.addEventListener('click',e=>{
      const selectedlist= lists.find(list => list.id === selectedlistId)
      selectedlist.tasks =selectedlist.tasks.filter(task => !task.complete)
      saveAndrender()
  })



deleteListButton.addEventListener('click' , e=>{
    lists=lists.filter(list => list.id != selectedlistId) //will show non selected list only
    selectedlistId=null //nothing selected so selectedlist is null
    saveAndrender()
} )
newListForm.addEventListener('submit', e => {
    e.preventDefault()
    const listName = newListInput.value
    if (listName == null || listName === '') return
    const list = createList(listName)
    newListInput.value = null
    lists.push(list)
    saveAndrender()
  })

  newTaskForm.addEventListener('submit', e => {
    e.preventDefault()
    const TaskName = newTaskInput.value
    if (TaskName == null || TaskName === '') return
    const task = createTask(TaskName)
    newTaskInput.value = null
    const selectedlist = lists.find(list => list.id ===selectedlistId)
    selectedlist.tasks.push(task)
    saveAndrender()
  })

function createList(name){
    return { id: Date.now().toString() , name: name ,tasks :[] }
}

function createTask(name){
    return { id: Date.now().toString() , name: name ,complete: false }
}


function saveAndrender() {
    save()
    render()
}

function save() {
   // syntax: setItem(key , value)
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY , JSON.stringify(lists))
    localStorage.setItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY,selectedlistId)
}

function render(){
    clearElement(listscontainer)

    renderLists()
    selectedlist = lists.find(list => list.id === selectedlistId)
    if(selectedlistId==null){
        listDisplayContainer.style.display='none'
    }
    else{
        listDisplayContainer.style.display=''
        listTitleElement.innerText=selectedlist.name
    }
    renderTaskCount(selectedlist)
    clearElement(tasksContainer)
    renderTasks(selectedlist)
    // clearElement(tasksContainer)
   
}

function renderTasks(selectedlist){
    selectedlist.tasks.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true)
        const checkbox =taskElement.querySelector('input')
        checkbox.id = task.id
        checkbox.checked = task.complete
        const label = taskElement.querySelector('label')
        label.htmlFor = task.id
        label.append(task.name)
        tasksContainer.appendChild(taskElement)

    })
}

function renderTaskCount(selectedlist) {
    const incompleteTaskCount = selectedlist.tasks.filter(task => !task.complete).length
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks"
    listCountElement.innerText = `${incompleteTaskCount} ${taskString} remaining`
  }

function renderLists(){
    lists.forEach(list =>{
        const listElement = document.createElement('li')
        listElement.dataset.listId = list.id // converted to : data-listId ="list.id"
        listElement.classList.add('list-name')
        listElement.innerText=list.name 
        if(list.id == selectedlistId){
            listElement.classList.add('active-list')
        }
        listscontainer.appendChild(listElement)
    })

}

function clearElement(Element){
    while(Element.firstChild){
        Element.removeChild(Element.firstChild)
    }

}

render()