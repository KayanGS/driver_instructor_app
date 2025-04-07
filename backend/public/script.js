// const api = 'http://localhost:5000/api'; // API URL


const api = window.location.origin + '/api';
const output = document.getElementById('output');
let isAuthenticated = !!localStorage.getItem('userId');



// ##################### FUNCTIONS FOR NAVIGATION AND UI ######################
/**
 * @param {*} id 
 * @description Show a section by its ID and hide all others
 */
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

/**
 * @param {*} isLoggedIn 
 * @description Show or hide sections and buttons based on authentication status
 */
function showAuthenticatedUI(isLoggedIn) {
    const authOnlySections = ['lesson', 'purchase', 'user'];
    const authOnlyButtons = ['nav-lesson', 'nav-purchase', 'nav-user', 'nav-logout'];
    const guestOnlyButtons = ['nav-login', 'nav-register'];

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

    if (isAuthenticated) {
        fetchUserLessons();
    }

    document.getElementById('nav-login')?.addEventListener('click', () => {
        showSection('login');
    });
});
// ################## END OF FUNCTIONS FOR NAVIGATION AND UI ###################





// ################### USER AUTHENTICATION AND REGISTRATION ###################


document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());

    const errors = validateUserForm(data);
    if (Object.keys(errors).length > 0) {
        output.textContent = '⚠️ ' + Object.values(errors).join('\n');
        return;
    }

    try {
        const res = await fetch(`${api}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            output.textContent = '🎉 Registration successful! You can now log in.';
            showSection('login');
        } else {
            output.textContent = result.message || 'Registration failed.';
        }
    } catch (err) {
        output.textContent = 'Registration error: ' + err.message;
    }
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

            const result = await res.json();

            if (res.ok && result.user && result.user._id) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('userId', result.user._id);

                isAuthenticated = true;
                showAuthenticatedUI(true);
                showSection('main');
                output.textContent = 'Login successful!';
            } else {
                output.textContent = result.message || 'Login failed';
            }

        } catch (err) {
            console.error('Login error:', err);
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
// ################ END OF USER AUTHENTICATION AND REGISTRATION ################





// ################### VALIDATION FORMS ###################
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
// ################### END OF VALIDATION FORMS ###################





// ################################  BUY TOKENS ################################
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
// ############################## END OF BUY TOKENS ###########################





// ############################## USER MANAGEMENT #############################
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

document.getElementById('deleteUser')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
        output.textContent = 'No logged-in user to delete.';
        return;
    }

    if (!confirm("Are you sure you want to delete your account? This cannot be undone.")) {
        return;
    }

    try {
        const res = await fetch(`${api}/users/${userId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const json = await res.json();
        output.textContent = json.message || 'User deleted';

        // Log out user and redirect to home
        localStorage.removeItem('userId');
        localStorage.removeItem('user');
        isAuthenticated = false;
        showAuthenticatedUI(false);
        showSection('home');
    } catch (err) {
        output.textContent = 'Error deleting account: ' + err.message;
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

// ############################# END OF USER MANAGEMENT ##########################




// ############################## LESSON MANAGEMENT ############################
document.getElementById('createLesson')
    .addEventListener('submit', async (e) => {

        e.preventDefault(); // Prevent the form from submitting
        const form = e.target; // Get the form
        // Get the form data
        const data = Object.fromEntries(new FormData(form).entries());
        data.user = localStorage.getItem('userId');

        try { // Send a POST request to the server

            const res = await fetch(`${api}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const json = await res.json(); // Parse the JSON response
            output.textContent = JSON.stringify(json, null, 2); // Display the response

        } catch (err) { // If there is an error, display it
            output.textContent = 'Error: ' + err;
        }
    });

document.getElementById('getAllLessons')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.warn('⚠️ No userId found in localStorage');
        output.textContent = 'User not logged in.';
        return;
    }

    try {
        const res = await fetch(`${api}/lessons`, {
            credentials: 'include'
        });

        const contentType = res.headers.get("content-type");
        const rawText = await res.text();

        console.log("📦 Raw response text:", rawText);

        let allLessons;
        try {
            if (contentType && contentType.includes("application/json")) {
                allLessons = JSON.parse(rawText);
            } else {
                throw new Error("Response is not valid JSON");
            }
        } catch (err) {
            console.error('❌ Failed to parse lessons JSON:', err.message);
            output.textContent = 'Error: API did not return valid JSON.';
            return;
        }

        if (!Array.isArray(allLessons)) {
            console.error('❌ API did not return an array:', allLessons);
            output.textContent = 'Error: Lesson response is not an array.';
            return;
        }

        const userLessons = allLessons.filter(lesson => {
            if (!lesson.user || !lesson.user._id) {
                console.warn('⚠️ Lesson without user._id skipped:', lesson);
                return false;
            }
            return lesson.user._id === userId;
        });

        const container = document.getElementById('lessonList');
        container.innerHTML = '';
        output.textContent = JSON.stringify(userLessons, null, 2);

        if (userLessons.length === 0) {
            container.innerHTML = '<p>No lessons found for your account.</p>';
        }

        userLessons.forEach(lesson => {
            const card = document.createElement('div');
            card.className = 'lesson-card';
            card.style = `
              border: 1px solid #ccc;
              padding: 1rem;
              border-radius: 10px;
              background-color: #f9f9f9;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              position: relative;
            `;

            const dateStr = new Date(lesson.lesson_date).toLocaleDateString('en-GB');
            const timeStr = lesson.lesson_time;

            card.innerHTML = `
              <strong>📅 ${dateStr} at ${timeStr}</strong> - ${lesson.lesson_status}
              <br />
              <button class="update-btn">✏️ Update</button>
              <button class="delete-btn">❌ Delete</button>
              <div class="edit-form-container" style="display: none; margin-top: 1rem;"></div>
            `;

            const editFormContainer = card.querySelector('.edit-form-container');

            // Update Button Logic
            card.querySelector('.update-btn').addEventListener('click', () => {
                const formHTML = `
                <form class="inline-update-form" data-id="${lesson._id}">
                  <label>Date: <input type="date" name="lesson_date" value="${lesson.lesson_date.split('T')[0]}" required /></label>
                  <label>Time:
                    <select name="lesson_time" required>
                      <option value="">-- Select Time --</option>
                      ${["08:00", "09:00", "10:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
                        .map(t => `<option value="${t}" ${lesson.lesson_time === t ? 'selected' : ''}>${t}</option>`).join('')}
                    </select>
                  </label>
                  <label>Status:
                    <select name="lesson_status" required>
                      <option value="scheduled" ${lesson.lesson_status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                      <option value="completed" ${lesson.lesson_status === 'completed' ? 'selected' : ''}>Completed</option>
                      <option value="cancelled" ${lesson.lesson_status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                  </label>
                  <button type="submit">Save</button>
                </form>
              `;
                editFormContainer.innerHTML = formHTML;
                editFormContainer.style.display = 'block';

                // Attach submit handler to this specific form
                const updateForm = editFormContainer.querySelector('form');
                updateForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    const form = e.target;
                    const lessonId = form.getAttribute('data-id');
                    const body = {
                        lesson_date: form.lesson_date.value,
                        lesson_time: form.lesson_time.value,
                        lesson_status: form.lesson_status.value
                    };

                    try {
                        const res = await fetch(`${api}/lessons/${lessonId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(body)
                        });

                        const result = await res.json();
                        output.textContent = '✅ Lesson updated:\n' + JSON.stringify(result, null, 2);
                        editFormContainer.innerHTML = ''; // Hide form on success
                        document.getElementById('getAllLessons').requestSubmit(); // Refresh lessons
                    } catch (err) {
                        output.textContent = 'Update error: ' + err.message;
                    }
                });
            });

            // Delete Button Logic
            card.querySelector('.delete-btn').addEventListener('click', async () => {
                if (!confirm('Are you sure you want to delete this lesson?')) return;
                try {
                    const res = await fetch(`${api}/lessons/${lesson._id}`, {
                        method: 'DELETE'
                    });
                    const json = await res.json();
                    output.textContent = json.message || 'Lesson deleted';
                    document.getElementById('getAllLessons').requestSubmit(); // Refresh lessons
                } catch (err) {
                    output.textContent = 'Delete error: ' + err.message;
                }
            });

            container.appendChild(card);
        });




    } catch (err) {
        console.error('💥 Error fetching lessons:', err);
        output.textContent = 'Error fetching lessons: ' + err.message;
    }
});



// ########################## END OF LESSON MANAGEMENT ########################