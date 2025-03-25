const api = 'http://localhost:5000/api'; // API URL
const output = document.getElementById('output'); // Output element

/**
 * @param {*} id 
 * Show the section with the given id and hide all other sections
 */
function showSection(id) {
    document.querySelectorAll('section')  // Get all sections
        .forEach(s => s.classList.add('hidden')); // Hide all sections

    document.getElementById(id).classList.remove('hidden'); // Show the section with the given id
}

/**
 * @param {*} data
 * Validate user form data
 */
function validateUserForm(data) {

    let errors = {}; // Errors object

    // Check if user_name is empty and only contains letters  
    if (!/^[A-Za-z ]+$/.test(data.user_name)) {
        errors.user_name = 'Name must only contain letters';
    }
    // Check if user_email is empty and has a valid email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.user_email)) {
        errors.user_email = 'Invalid email format';
    }

    let pwdErrors = []; // Password errors array

    // Check if user_password contais letters
    if (!/[a-zA-Z]/.test(data.user_password)) pwdErrors.push("letters");
    // Check if user_password contains numbers
    if (!/[0-9]/.test(data.user_password)) pwdErrors.push("numbers");
    //Check if user_password contains special characters
    if (!/[!@#$%^&*]/.test(data.user_password)) {
        pwdErrors.push("special characters (!@#$%^&*)");
    }
    // Check if user_password has a minimum length of 6 characters
    if (data.user_password.length < 6) pwdErrors.push("minimum 6 characters");
    // Check if user_password is empty and print the errors
    if (pwdErrors.length > 0) {
        errors.user_password = `Password must include: ${pwdErrors.join(', ')}`;
    }

    return errors; // ################# RETURN ###################
}


document.getElementById('createUser').addEventListener('submit', async (e) => {

    e.preventDefault(); // Prevent the form from submitting
    const form = e.target; // Get the form
    const data = Object.fromEntries(new FormData(form).entries()); // Get form data
    const errors = validateUserForm(data); // Validate form data

    // Clear previous errors
    document.querySelectorAll('.error').forEach(el => el.textContent = '');

    // If there are errors, display them and return
    if (Object.keys(errors).length > 0) {
        // For each error, display it in the corresponding div
        for (const key in errors) {
            const errorDiv = document.getElementById(`error_${key}`);
            if (errorDiv) errorDiv.textContent = errors[key];
        }
        return; // ################# RETURN ###################
    }

    // If there are no errors, send the data to the server
    try {
        // Send a POST request to the server
        const res = await fetch(`${api}/users`, {
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

document.getElementById('updateUser').addEventListener('submit', async (e) => {

    e.preventDefault(); // Prevent the form from submitting
    const form = e.target; // Get the form
    const userId = form.user_id.value; // Get the user ID

    const body = { // Create the request body
        user_name: form.user_name.value,
        user_email: form.user_email.value
    };

    try { // Send a PUT request to the server

        const res = await fetch(`${api}/users/${userId}`, {
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

document.getElementById('createLesson')
    .addEventListener('submit', async (e) => {

        e.preventDefault(); // Prevent the form from submitting
        const form = e.target; // Get the form
        // Get the form data
        const data = Object.fromEntries(new FormData(form).entries());

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

document.getElementById('getLessons').addEventListener('submit', async (e) => {

    e.preventDefault(); // Prevent the form from submitting

    try { // Send a GET request to the server

        const res = await fetch(`${api}/lessons`); // Fetch all lessons
        const json = await res.json(); // Parse the JSON response 
        output.textContent = JSON.stringify(json, null, 2); //

    } catch (err) { // If there is an error, display it
        output.textContent = 'Error: ' + err;
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

document.getElementById('buyTokens').addEventListener('submit', async (e) => {

    e.preventDefault(); /// Prevent the form from submitting
    const form = e.target; // Get the form
    const userId = form.user_id.value.trim(); // Get the user ID
    const packageType = form.package.value; // Get the package type

    if (!userId || !packageType) { // Check if the user ID and package type are empty

        output.textContent = 'Please fill out all fields to buy tokens.';
        return; // ################# RETURN ###################
    }

    try {  // Send a POST request to the server

        const res = await fetch(`${api}/users/${userId}/buy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ package: packageType })
        });

        const json = await res.json(); // Parse the JSON response
        output.textContent = JSON.stringify(json, null, 2); // Display the response

    } catch (err) { // If there is an error, display it
        output.textContent = 'Error: ' + err;
    }
});