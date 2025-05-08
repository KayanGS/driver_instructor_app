const api = 'http://localhost:5000/api'; // API URL
const output = document.getElementById('output');
let isAuthenticated = !!localStorage.getItem('userId');

function showSection(id) {
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('hidden');
    });
    const target = document.getElementById(id);
    if (target) {
        target.classList.remove('hidden');
    } else {
        console.warn(`❗ Section "${id}" not found`);
    }
}

function showAuthenticatedUI(isLoggedIn) {
    const authOnlySections = ['lesson', 'purchase', 'user'];
    const authOnlyButtons = ['nav-lesson', 'nav-purchase', 'nav-user', 'nav-logout'];
    const guestOnlyButtons = ['nav-login'];

    authOnlySections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.toggle('hidden', !isLoggedIn);
    });

    authOnlyButtons.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', !isLoggedIn);
    });

    guestOnlyButtons.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', isLoggedIn);
    });
}

window.addEventListener('DOMContentLoaded', () => {
    showAuthenticatedUI(isAuthenticated);
});

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(loginForm).entries());

        try {
            const res = await fetch(`${api}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(data)
            });

            const rawText = await res.text();
            console.log('🔍 Raw response:', rawText);

            let json;
            try {
                json = JSON.parse(rawText);
            } catch (parseErr) {
                console.error('❌ Failed to parse JSON:', parseErr);
                output.textContent = 'Login error: Server did not return valid JSON.';
                return;
            }

            if (res.ok && json.user && json.user._id) {
                localStorage.setItem('userId', json.user._id);
                isAuthenticated = true;
                showAuthenticatedUI(true);
                showSection('main');
                output.textContent = 'Login successful!';
            } else {
                output.textContent = json.message || 'Login failed';
            }
        } catch (err) {
            output.textContent = 'Login error: ' + err.message;
        }
    });
}

async function logout() {
    try {
        const res = await fetch(`${api}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        const json = await res.json();
        if (res.ok) {
            localStorage.removeItem('userId');
            isAuthenticated = false;
            showAuthenticatedUI(false);
            showSection('home');
            output.textContent = 'You have been logged out.';
        } else {
            output.textContent = json.message || 'Logout failed.';
        }
    } catch (err) {
        output.textContent = 'Logout error: ' + err.message;
    }
}

function validateUserForm(data) {
    let errors = {};

    if (!/^[A-Za-z ]+$/.test(data.user_name)) {
        errors.user_name = 'Name must only contain letters';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user_email)) {
        errors.user_email = 'Invalid email format';
    }

    let pwdErrors = [];
    if (!/[a-zA-Z]/.test(data.user_password)) pwdErrors.push("letters");
    if (!/[0-9]/.test(data.user_password)) pwdErrors.push("numbers");
    if (!/[!@#$%^&*]/.test(data.user_password)) pwdErrors.push("special characters (!@#$%^&*)");
    if (data.user_password.length < 6) pwdErrors.push("minimum 6 characters");

    if (pwdErrors.length > 0) {
        errors.user_password = `Password must include: ${pwdErrors.join(', ')}`;
    }

    return errors;
}

// document.getElementById('createLesson')?.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const form = e.target;
//     const data = Object.fromEntries(new FormData(form).entries());
//     data.user = localStorage.getItem('userId');

//     try {
//         const res = await fetch(`${api}/lessons`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(data)
//         });
//         const json = await res.json();
//         output.textContent = JSON.stringify(json, null, 2);
//     } catch (err) {
//         output.textContent = 'Error: ' + err;
//     }
// });

document.getElementById('buyTokens')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const userId = localStorage.getItem('userId');
    const packageType = form.package.value;

    if (!userId || !packageType) {
        output.textContent = 'Please fill out all fields to buy tokens.';
        return;
    }

    try {
        const res = await fetch(`${api}/users/${userId}/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ package: packageType })
        });

        const json = await res.json();
        output.textContent = JSON.stringify(json, null, 2);
    } catch (err) {
        output.textContent = 'Error: ' + err;
    }
});

// Update User Form - use userId from localStorage
const updateUserForm = document.getElementById('updateUser');
if (updateUserForm) {
    updateUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const userId = localStorage.getItem('userId');
        const body = {
            user_name: form.user_name.value,
            user_email: form.user_email.value,
            user_password: form.user_password.value
        };

        try {
            const res = await fetch(`${api}/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const json = await res.json();
            output.textContent = JSON.stringify(json, null, 2);
        } catch (err) {
            output.textContent = 'Error: ' + err;
        }
    });
}

document.getElementById('deleteUser').addEventListener('submit', async (e) => {

    e.preventDefault(); // Prevent the form from submitting
    const userId = e.target.user_id.value; // Get the user ID

    try { // Send a DELETE request to the server
        const res = await fetch(`${api}/users/${userId}`, {
            method: 'DELETE'
        });

        const json = await res.json(); // Parse the JSON response
        output.textContent = JSON.stringify(json, null, 2); // Display the response

    } catch (err) { // If there is an error, display it
        output.textContent = 'Error: ' + err;
    }
});

// document.getElementById('getAllUsers').addEventListener('submit', async (e) => {
//     e.preventDefault(); // Prevent the form from submitting

//     try { // Send a GET request to the server
//         const res = await fetch(`${api}/users`); // Fetch all users
//         const json = await res.json(); // Parse the JSON response
//         output.textContent = JSON.stringify(json, null, 2); // Display the response

//     } catch (err) { // If there is an error, display it
//         output.textContent = 'Error: ' + err;
//     }
// });

document.getElementById('createLesson')
    .addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the form from submitting
        const form = e.target;
        const data = Object.fromEntries(new FormData(form).entries());

        const userId = localStorage.getItem('userId');

        // ✅ Check if userId is present and valid
        if (!userId || userId.length !== 24) {
            output.textContent = 'Cannot create lesson: invalid or missing user ID.';
            return;
        }

        data.user = userId;

        try {
            const res = await fetch(`${api}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const json = await res.json();
            output.textContent = JSON.stringify(json, null, 2);

        } catch (err) {
            output.textContent = 'Error: ' + err;
        }
    });

document.getElementById('getAllLessons')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
        const res = await fetch(`${api}/lessons`, {
            credentials: 'include'
        });
        const allLessons = await res.json();

        // ✅ Safely filter lessons with user attached
        const userLessons = allLessons.filter(lesson =>
            lesson.user && lesson.user._id === userId
        );

        const container = document.getElementById('lessonList');
        container.innerHTML = ''; // Clear old results
        output.textContent = JSON.stringify(userLessons, null, 2);

        userLessons.forEach(lesson => {
            const btn = document.createElement('button');
            btn.textContent = `📅 ${lesson.lesson_date} @ ${lesson.lesson_time}`;
            btn.onclick = () => {
                document.querySelector('#updateLesson input[name="lesson_id"]').value = lesson._id;
                document.querySelector('#updateLesson input[name="lesson_date"]').value = lesson.lesson_date.split('T')[0];
                document.querySelector('#updateLesson select[name="lesson_time"]').value = lesson.lesson_time;
                document.querySelector('#updateLesson select[name="lesson_status"]').value = lesson.lesson_status;
                showSection('lesson');
            };
            container.appendChild(btn);
        });

    } catch (err) {
        output.textContent = 'Error fetching lessons: ' + err.message;
    }
});


document.getElementById('updateLesson')
    .addEventListener('submit', async (e) => {

        e.preventDefault(); // Prevent the form from submitting
        const form = e.target; // Get the form
        const lessonId = form.lesson_id.value; // Get the lesson ID
        // Create the request body
        const body = {
            lesson_date: form.lesson_date.value,
            lesson_time: form.lesson_time.value,
            lesson_status: form.lesson_status.value
        };

        try { // Send a PUT request to the server

            const res = await fetch(`${api}/lessons/${lessonId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const json = await res.json(); // Parse the JSON response
            output.textContent = JSON.stringify(json, null, 2); // Display the response

        } catch (err) { // If there is an error, display it
            output.textContent = 'Error: ' + err;
        }
    });

document.getElementById('deleteLesson')
    .addEventListener('submit', async (e) => {

        e.preventDefault(); // Prevent the form from submitting
        const lessonId = e.target.lesson_id.value; // Get the lesson ID

        try { // Send a DELETE request to the server
            const res = await fetch(`${api}/lessons/${lessonId}`, {
                method: 'DELETE'
            });

            const json = await res.json(); // Parse the JSON response
            output.textContent = JSON.stringify(json, null, 2); // Display the response

        } catch (err) { // If there is an error, display it
            output.textContent = 'Error: ' + err;
        }
    });
