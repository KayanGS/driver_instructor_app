const api = 'http://localhost:5000/api';
const output = document.getElementById('output');

function showSection(id) {
    document.querySelectorAll('section')
        .forEach(s => s.classList.add('hidden'));

    document.getElementById(id).classList.remove('hidden');
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

    if (!/[!@#$%^&*]/.test(data.user_password))
        pwdErrors.push("special characters (!@#$%^&*)");

    if (data.user_password.length < 6) pwdErrors.push("minimum 6 characters");
    if (pwdErrors.length > 0) {
        errors.user_password = `Password must include: ${pwdErrors.join(', ')}`;
    }

    return errors;
}


document.getElementById('createUser').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form).entries());
    const errors = validateUserForm(data);

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    if (Object.keys(errors).length > 0) {
        for (const key in errors) {
            const errorDiv = document.getElementById(`error_${key}`);
            if (errorDiv) errorDiv.textContent = errors[key];
        }
        return;
    }

    try {
        const res = await fetch(`${api}/users`, {
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

document.getElementById('updateUser').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const userId = form.user_id.value;
    const body = {
        user_name: form.user_name.value,
        user_email: form.user_email.value
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

document.getElementById('deleteUser').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = e.target.user_id.value;
    try {
        const res = await fetch(`${api}/users/${userId}`, {
            method: 'DELETE'
        });
        const json = await res.json();
        output.textContent = JSON.stringify(json, null, 2);
    } catch (err) {
        output.textContent = 'Error: ' + err;
    }
});
document.getElementById('createLesson')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const data = Object.fromEntries(new FormData(form).entries());
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

document.getElementById('getLessons').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const res = await fetch(`${api}/lessons`);
        const json = await res.json();
        output.textContent = JSON.stringify(json, null, 2);
    } catch (err) {
        output.textContent = 'Error: ' + err;
    }
});

document.getElementById('updateLesson')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        const form = e.target;
        const lessonId = form.lesson_id.value;
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
            const json = await res.json();
            output.textContent = JSON.stringify(json, null, 2);
        } catch (err) {
            output.textContent = 'Error: ' + err;
        }
    });

document.getElementById('deleteLesson')
    .addEventListener('submit', async (e) => {
        e.preventDefault();
        const lessonId = e.target.lesson_id.value;
        try {
            const res = await fetch(`${api}/lessons/${lessonId}`, {
                method: 'DELETE'
            });
            const json = await res.json();
            output.textContent = JSON.stringify(json, null, 2);
        } catch (err) {
            output.textContent = 'Error: ' + err;
        }
    });

document.getElementById('buyTokens').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const userId = form.user_id.value.trim();
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