// js/admin.js — 100% WORKING

const BASE_URL = 'http://localhost:8080/api/admin';
const credentials = btoa('admin:admin');
// admin.js ke top mein yeh add kar do
document.getElementById('logout')?.addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
});

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + credentials
    };
}

// Safe string for onclick
function escape(str) {
    return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// Global functions (must be outside DOMContentLoaded)
window.openEditArticle = function(id, title, description, imageUrl, category, isMini) {
    const modal = document.getElementById('edit-article-modal');
    if (!modal) return alert('Modal not found!');
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-title').value = title;
    document.getElementById('edit-description').value = description;
    document.getElementById('edit-imageUrl').value = imageUrl;
    document.getElementById('edit-category').value = category;
    document.getElementById('edit-isMini').checked = isMini;
    modal.style.display = 'block';
};

window.openEditCategory = function(id, name) {
    const modal = document.getElementById('edit-category-modal');
    if (!modal) return alert('Modal not found!');
    document.getElementById('edit-cat-id').value = id;
    document.getElementById('edit-cat-name').value = name;
    modal.style.display = 'block';
};

window.deleteItem = async function(type, id) {
    if (confirm('Delete?')) {
        try {
            await fetch(`${BASE_URL}/${type}/${id}`, {
                method: 'DELETE',
                headers: authHeaders()
            });
            if (type === 'articles') fetchArticles();
            else fetchCategories();
        } catch (err) {
            alert('Error: ' + err.message);
        }
    }
};

// DOM Ready
document.addEventListener('DOMContentLoaded', function () {
    fetchArticles();
    fetchCategories();

    // Add Article
    const addForm = document.getElementById('add-form');
    if (addForm) {
        addForm.onsubmit = async function (e) {
            e.preventDefault();
            const article = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                imageUrl: document.getElementById('imageUrl').value,
                category: document.getElementById('category').value,
                isMini: document.getElementById('isMini').checked
            };
            try {
                const res = await fetch(`${BASE_URL}/articles`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify(article)
                });
                if (res.ok) {
                    alert('Added!');
                    addForm.reset();
                    fetchArticles();
                } else {
                    alert('Error: ' + await res.text());
                }
            } catch (err) {
                alert('Network Error');
            }
        };
    }

    // Add Category
    const catForm = document.getElementById('category-form');
    if (catForm) {
        catForm.onsubmit = async function (e) {
            e.preventDefault();
            const category = { name: document.getElementById('category-name').value };
            try {
                const res = await fetch(`${BASE_URL}/categories`, {
                    method: 'POST',
                    headers: authHeaders(),
                    body: JSON.stringify(category)
                });
                if (res.ok) {
                    alert('Added!');
                    catForm.reset();
                    fetchCategories();
                }
            } catch (err) {
                alert('Error');
            }
        };
    }

    // Update Article
    const editForm = document.getElementById('edit-article-form');
    if (editForm) {
        editForm.onsubmit = async function (e) {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const article = {
                title: document.getElementById('edit-title').value,
                description: document.getElementById('edit-description').value,
                imageUrl: document.getElementById('edit-imageUrl').value,
                category: document.getElementById('edit-category').value,
                isMini: document.getElementById('edit-isMini').checked
            };
            try {
                const res = await fetch(`${BASE_URL}/articles/${id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(article)
                });
                if (res.ok) {
                    alert('Updated!');
                    document.getElementById('edit-article-modal').style.display = 'none';
                    fetchArticles();
                }
            } catch (err) {
                alert('Error');
            }
        };
    }

    // Update Category
    const editCatForm = document.getElementById('edit-category-form');
    if (editCatForm) {
        editCatForm.onsubmit = async function (e) {
            e.preventDefault();
            const id = document.getElementById('edit-cat-id').value;
            const category = { name: document.getElementById('edit-cat-name').value };
            try {
                const res = await fetch(`${BASE_URL}/categories/${id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify(category)
                });
                if (res.ok) {
                    alert('Updated!');
                    document.getElementById('edit-category-modal').style.display = 'none';
                    fetchCategories();
                }
            } catch (err) {
                alert('Error');
            }
        };
    }

    // Close modals
    document.querySelectorAll('.close').forEach(btn => {
        btn.onclick = () => {
            document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
        };
    });

    window.onclick = e => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    };
});

async function fetchArticles() {
    try {
        const res = await fetch(`${BASE_URL}/articles`, { headers: authHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        const list = document.getElementById('articles-list');
        if (list) {
            list.innerHTML = '';
            data.forEach(a => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${a.id}</td>
                    <td>${a.title}</td>
                    <td>${a.description.substring(0, 50)}...</td>
                    <td><a href="${a.imageUrl}" target="_blank">View</a></td>
                    <td>${a.category}</td>
                    <td>${a.isMini ? 'Yes' : 'No'}</td>
                    <td>
                        <button class="edit-article-btn">Edit</button>
                        <button class="delete-article-btn">Delete</button>
                    </td>
                `;
                // Attach handlers safely
                row.querySelector('.edit-article-btn').onclick = () =>
                    openEditArticle(a.id, a.title, a.description, a.imageUrl, a.category, a.isMini);

                row.querySelector('.delete-article-btn').onclick = () =>
                    deleteItem('articles', a.id);

                list.appendChild(row);
            });
        }
    } catch (err) {
        console.error(err);
    }
}



async function fetchCategories() {
    try {
        const res = await fetch(`${BASE_URL}/categories`, { headers: authHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        const list = document.getElementById('categories-list');
        if (list) {
            list.innerHTML = '';
            data.forEach(c => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${c.id}</td>
                    <td>${c.name}</td>
                    <td>
                        <button class="edit-category-btn">Edit</button>
                        <button class="delete-category-btn">Delete</button>
                    </td>
                `;
                row.querySelector('.edit-category-btn').onclick = () =>
                    openEditCategory(c.id, c.name);

                row.querySelector('.delete-category-btn').onclick = () =>
                    deleteItem('categories', c.id);

                list.appendChild(row);
            });
        }
    } catch (err) {
        console.error(err);
    }
}
