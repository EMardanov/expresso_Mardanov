document.addEventListener("DOMContentLoaded", function() {

    // Define the URL to our PHP API.
    const apiUrl = "/todo-api";

    function loadItems() {
        const userId = document.getElementById('user-id').value;

        fetch(apiUrl + `?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
            const todoList = document.getElementById('todo-list');
            todoList.innerHTML = "";
            data.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.text;
                li.id = item.id;
                if (item.completed) {
                    li.className = "completed";
                }
                const buttons = document.createElement('div');
                buttons.className = 'todo-list-buttons';
                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger';
                deleteButton.textContent = 'Löschen';

                // Handle delete button click
                deleteButton.addEventListener('click', function(evt) {
                    fetch(apiUrl, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: item.id })
                    })
                    .then(response => response.json())
                    .then(() => {
                        li.remove(); // Remove the todo from the list
                    });
                });
                buttons.appendChild(deleteButton);

                const completeButton = document.createElement('button');
                completeButton.className = 'btn btn-success';
                completeButton.textContent = 'Erledigt';

                // Handle complete button click
                completeButton.addEventListener('click', function(evt) {
                    fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: item.id })
                    })
                    .then(response => response.json())
                    .then(() => {
                        loadItems(); // Reload the list
                    });
                });
                buttons.appendChild(completeButton);
                
                li.appendChild(buttons);
                todoList.appendChild(li);
            });
        });
    }

    document.getElementById('todo-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const todoInput = document.getElementById('todo-input').value;
        const userId = document.getElementById('user-id').value;
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: userId, text: todoInput })
        })
        .then(response => response.json())
        .then(data => {
            loadItems();
        });
    });
    loadItems();
});