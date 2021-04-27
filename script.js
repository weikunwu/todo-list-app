// 1. Show how many active tasks left at the left of footer
// 2. Three tabs in center of footer to toggle between All,
//    Active, Completed and show filtered tasks
// 3. Left header button to toggle all tasks. If any task
//    is not completed, set all tasks to completed. If all
//    tasks are completed, set all to active
// 4. Type in the input, press enter key to add the task ->
//    add event listener to 'keyup' and check if it is 'enter' key
// 5. Hover on task, shows pencil icon. Clicking pencil
//    icon allows user to edit the task. Once editing is done,
//    a checkmark icon allows user to save the editing
// 6. During editing, press enter key to save the task ->
//    add event listener to 'keyup' and check if it is 'enter' key
// 7. Close and reopen the application, it should keep all the
//    previous tasks. // localStorage -> save to localStorage on
//    each operation -> load from storage on initial load

// pencil html code: '&#9998;';
// checkmark html code: '&#10003;';

// hover and tab border color: pink

// {checked: boolean, value: string, id: string}
const model = {
    todoList: [],
    nodeInEdit: null //id of the node
  };
  
  const tabs = ["allTab", "activeTab", "completedTab"];
  let currentTab = 0;
  
  const getListContainer = () => {
    return document.querySelector(".list-container");
  };
  
  const createTaskNode = (value, checked, id) => {
    const li = document.createElement("li");
  
    li.id = id;
  
    const span = document.createElement("span");
    span.innerHTML = value;
    if (checked) {
      span.className = "checked";
    }
  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    checkbox.checked = checked;
  
    const editDiv = document.createElement("div");
    editDiv.className = "edit-icon";
    editDiv.innerHTML = "&#9998;";
  
    const deleteDiv = document.createElement("div");
    deleteDiv.className = "delete-icon";
    deleteDiv.innerHTML = "&#10005;";
  
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editDiv);
    li.appendChild(deleteDiv);
    return li;
  };
  
  const createEditNode = (value, checked, id) => {
    const li = document.createElement("li");
  
    li.id = id;
  
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "disabled-checkbox";
    checkbox.checked = checked;
  
    const textInputBox = document.createElement("input");
    textInputBox.className = "text-input";
    textInputBox.defaultValue = value;
  
    const checkDiv = document.createElement("div");
    checkDiv.className = "check-icon";
    checkDiv.innerHTML = "&#10003;";
  
    li.appendChild(checkbox);
    li.appendChild(textInputBox);
    li.appendChild(checkDiv);
    return li;
  };
  
  const updateView = (reset = true) => {
    // Reset view
    if (reset) {
      clearSelectedTab();
      model.nodeInEdit = null;
    }
  
    const listContainer = getListContainer();
  
    listContainer.innerHTML = "";
  
    // Update itemCountElement
    let { todoList } = model;
    const numOfItemsActive = todoList.filter((task) => {
      return !task.checked;
    }).length;
    const itemCountElmt = document.querySelector(".item-count");
    itemCountElmt.textContent = `${numOfItemsActive} item(s) left`;
  
    // Filter items to show
    if (currentTab === 1) {
      todoList = todoList.filter((task) => {
        return !task.checked;
      });
    } else if (currentTab === 2) {
      todoList = todoList.filter((task) => {
        return task.checked;
      });
    }
  
    todoList.forEach((todo) => {
      let taskNode;
      if (todo.id === model.nodeInEdit) {
        taskNode = createEditNode(todo.value, todo.checked, todo.id);
      } else {
        taskNode = createTaskNode(todo.value, todo.checked, todo.id);
      }
      listContainer.appendChild(taskNode);
    });
  
    const curTabElmt = getTab(currentTab);
    curTabElmt.classList.add("selected-tab");
  };
  
  const clearSelectedTab = () => {
    tabs.forEach((tabName) => {
      const tab = document.querySelector(`#${tabName}`);
      tab.classList.remove("selected-tab");
    });
  };
  
  const handleAddNewTask = () => {
    const textInput = document.querySelector(".text-input");
    const { value } = textInput;
  
    if (value === "") {
      return;
    }
    const newTask = {
      checked: false,
      value,
      id: new Date().toISOString()
    };
    model.todoList.push(newTask);
    textInput.value = "";
    updateView();
  };
  
  const handleClearAll = () => {
    model.todoList = [];
    updateView();
  };
  
  const toggleTaskChecked = (id) => {
    //   const targetTask = model.todoList.find((task) => task.id === id);
    //   targetTask.checked = !targetTask.checked;
    const newTaskList = model.todoList.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          checked: !task.checked
        };
      } else {
        return task;
      }
    });
  
    model.todoList = newTaskList;
    updateView();
  };
  
  const removeTaskRow = (id) => {
    const newTaskList = model.todoList.filter((task) => {
      return task.id !== id;
    });
    model.todoList = newTaskList;
    updateView();
  };
  
  const handleTabsContainerClick = (e) => {
    const { target } = e;
    switch (target.id) {
      case "allTab":
        currentTab = 0;
        break;
      case "activeTab":
        currentTab = 1;
        break;
      case "completedTab":
        currentTab = 2;
        break;
      default:
        console.log("no tab selected");
    }
    updateView();
  };
  
  const handleListContainerClick = (e) => {
    const { target } = e;
    if (target.className === "checkbox") {
      const li = target.parentNode;
      const taskId = li.id;
      toggleTaskChecked(taskId);
      return;
    } else if (target.className === "delete-icon") {
      //   removeTaskRow(target);
      const li = target.parentNode;
      const taskId = li.id;
      removeTaskRow(taskId);
    } else if (target.className === "edit-icon") {
      const li = target.parentNode;
      model.nodeInEdit = li.id;
      updateView(false);
    } else if (target.className === "check-icon") {
      const li = target.parentNode;
      const taskId = li.id;
      const textInput = document.querySelectorAll(".text-input");
      const { value } = textInput[1];
      updateTaskValue(taskId, value);
    }
  };
  
  const updateTaskValue = (taskId, value) => {
    const newTaskList = model.todoList.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          value: value
        };
      } else {
        return task;
      }
    });
  
    model.todoList = newTaskList;
    updateView();
  };
  
  const handleEnterKey = (e) => {
    if (e.key === "Enter") {
      if (model.nodeInEdit === null) {
        return handleAddNewTask(e);
      } else {
        const taskId = model.nodeInEdit;
        const textInput = document.querySelectorAll(".text-input");
        const { value } = textInput[1];
        updateTaskValue(taskId, value);
      }
    }
  };
  
  const handleCheckAll = (e) => {
    let allchecked = true;
    model.todoList.forEach((item) => {
      if (!item.checked) {
        allchecked = false;
      }
    });
    if (allchecked) {
      const newTodoList = model.todoList.map((task) => {
        return {
          ...task,
          checked: false
        };
      });
      model.todoList = newTodoList;
    } else {
      const newTodoList = model.todoList.map((task) => {
        return {
          ...task,
          checked: true
        };
      });
      model.todoList = newTodoList;
    }
    updateView();
  };
  
  const getTab = (tabid) => {
    const tabName = tabs[tabid];
    return document.querySelector(`#${tabName}`);
  };
  
  const loadEvents = () => {
    const addButton = document.querySelector("#addButton");
    const clearAllBtn = document.querySelector("#clearButton");
    const checkButton = document.querySelector("#checkButton");
  
    const tabsContainer = document.querySelector(".tabs-container");
  
    const listContainer = getListContainer();
  
    addButton.addEventListener("click", handleAddNewTask);
    clearAllBtn.addEventListener("click", handleClearAll);
    checkButton.addEventListener("click", handleCheckAll);
  
    tabsContainer.addEventListener("click", handleTabsContainerClick);
    listContainer.addEventListener("click", handleListContainerClick);
  
    document.addEventListener("keyup", handleEnterKey);
  };
  
  loadEvents();
  