/**
 * edit.js
 * Client-side logic for the Edit Bulletin page.
 * Responsibilities:
 *  - Read the `id` query parameter from the URL
 *  - Fetch the bulletin data from the API and pre-fill the form
 *  - Submit the updated bulletin to the API using a PATCH request
 *  - Redirect back to the board on success (or on fatal errors)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the `id` from the URL query string (e.g. /edit?id=2)
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    // Grab form elements once to avoid repeated DOM queries
    const form = document.getElementById('edit-bulletin-form');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');
    const messageInput = document.getElementById('message');
    const authorInput = document.getElementById('author');
    const idInput = document.getElementById('bulletin-id');

    // If no id is provided we can't edit anything — go back to the board
    if (!id) {
        alert('No bulletin id provided.');
        window.location.href = '/';
        return;
    }

    // Load bulletin data from the server and populate the form fields
    fetch(`/api/bulletins/id/${id}`)
        .then(res => {
            if (!res.ok) throw new Error('Bulletin not found');
            return res.json();
        })
        .then(data => {
            // Prefill inputs with received data (use safe defaults)
            idInput.value = data.id;
            titleInput.value = data.title || '';
            categoryInput.value = data.category || 'Other';
            messageInput.value = data.message || '';
            authorInput.value = data.author || '';
        })
        .catch(err => {
            // If fetching fails, inform user and return to board
            console.error('Error loading bulletin:', err);
            alert('Failed to load bulletin.');
            window.location.href = '/';
        });

    // Handle the form submission: validate client-side and send PATCH
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const payload = {
            title: titleInput.value,
            category: categoryInput.value,
            message: messageInput.value,
            author: authorInput.value
        };

        try {
            const res = await fetch(`/api/bulletins/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // Show server-side validation or error message
                alert(data.error || 'Failed to update bulletin');
                return;
            }

            // Success — redirect back to the board
            window.location.href = '/';
        } catch (err) {
            console.error('Error updating bulletin:', err);
            alert('Network/server error while updating.');
        }
    });
});
