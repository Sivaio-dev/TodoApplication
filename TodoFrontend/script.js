const SERVER_URL = "http://localhost:8080";
const token = localStorage.getItem("token");

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(data.message || "Login failed!");
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("token", data.token);
        window.location.href = "todos.html";
    })
    .catch(error => {
        alert(error.message);
    })
}

function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${SERVER_URL}/auth/register`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password})
    })
    .then(response => {
        if(response.ok) {
            alert("Registration Successful!, Please Login!");
            window.location.href = "login.html";
        } else {
            return response.json().then(data => { throw new Error(data.message || "Registration failed!")});
        }
    }).catch(error => {
        alert(error.message);
    })
}

function createTodoCard(todo) {
    const card = document.createElement("div");
    card.className = "todo-card";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.isCompleted;
    checkbox.addEventListener("change", function() {
        const updatedTodo = {...todo, isCompleted: checkbox.checked}
        updateTodoStatus(updatedTodo);
    });

    const span = document.createElement("span");
    span.textContent = todo.title;

    if(todo.isCompleted) {
        span.style.textDecoration = "line-through";
        span.style.color = "#aaa";
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.onclick = function() {deleteTodo(todo.id);}

    card.appendChild(checkbox);
    card.appendChild(span);
    card.appendChild(deleteBtn);

    return card;

}

function loadTodos() {
    if(!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }
    
    fetch(`${SERVER_URL}/api/v1/todo`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(data.message || "Failed to get todos!");
        }
        return response.json();
    })
    .then((todos) => {
        //console.log("Todos received:",todos);
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        if(!todos || todos.length === 0) {
            todoList.innerHTML = `<p id="empty-message">No todos yet. Add one below!</p>`;
        } else {
            todos.forEach(todo => {
                todoList.appendChild(createTodoCard(todo));                
            });
        }
    })
    .catch(error => {
        console.error("LOAD TODOS ERROR:", error);
        document.getElementById("todo-list").innerHTML = `<p style="color:red">Failed to load todos!</p>`;
    })
}

function loadTodosPaged(page = 0, size = 5) {
    if(!token) {
        alert("Please login first!");
        window.location.href = "login.html";
        return;
    }

    fetch(`${SERVER_URL}/api/v1/todo/page?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => res.json())
    .then(data => {
        console.log("Paginated Response:", data);
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";
        const todos = data.content; // IMPORTANT FIX
        todos.forEach(todo => {
            todoList.appendChild(createTodoCard(todo));
        });
        // store pagination info (optional but useful)
        window.totalPages = data.totalPages;
        window.currentPage = data.number;
        updatePaginationUI();
    })
    .catch(err => {
        console.error("Pagination error:", err);
        document.getElementById("todo-list").innerHTML = `<p style="color:red">Failed to load todos!</p>`;
    });
}

function addTodo() {
    const input = document.getElementById("new-todo");
    const todoText = input.value.trim();

    if(!todoText) return;

    fetch(`${SERVER_URL}/api/v1/todo/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({title: todoText, isCompleted: false})
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(data.message || "Failed to update todo!");
        }
        return response.json();
    })
    .then((newTodo) => {
        input.value = "";
        loadTodosPaged(0, 5);
    })
    .catch(error => {
        alert(error.message);
    })
}

function updateTodoStatus(todo) {
    fetch(`${SERVER_URL}/api/v1/todo`, {
        method: "PUT",
        headers: {"Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(todo)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(data.message || "Failed to update todo!");
        }
        return response.json();
    })
    .then(() => loadTodosPaged(0, 5))
    .catch(error => {
        alert(error.message);
    })
}

function deleteTodo(id) {
    fetch(`${SERVER_URL}/api/v1/todo/${id}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
    })
    .then(response => {
        if(!response.ok) {
            throw new Error(data.message || "Failed to delete todo!");
        }
        return response.text();
    })
    .then(() => loadTodosPaged(0, 5))
    .catch(error => {
        alert(error.message);
    })
}

function updatePaginationUI() {
    const paginationDiv = document.getElementById("pagination");
    if (!totalPages || totalPages === 0) {
        paginationDiv.innerHTML = "";
        return;
    }
    let buttons = "";
    for (let i = 0; i < totalPages; i++) {
        buttons += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
                onclick="loadTodosPaged(${i})">
                ${i + 1}
            </button>`;
    }
    paginationDiv.innerHTML = buttons;
}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function() {
    if(document.getElementById("todo-list")) {
        loadTodosPaged(0, 5);
    }
})