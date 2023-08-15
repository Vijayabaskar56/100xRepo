const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value.trim()) { // Check if input is not empty or only whitespace
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (message) => {
    const li = document.createElement('li');
    li.textContent = message;
    messages.appendChild(li);

    // Scroll to the bottom of the chat area
    messages.scrollTop = messages.scrollHeight;
});
