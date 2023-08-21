const socket = io();



document.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelector('#messages');
    const form = document.querySelector('#form');
    const input = document.querySelector('#input');
    const chatContacts = document.querySelector('.chat-contacts');

    const contactName = prompt('Please enter a contact name:');
    if (contactName) {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact');
        contactDiv.textContent = contactName;
        chatContacts.appendChild(contactDiv);

        socket.emit('set contact', contactName); // Emit contact name to server
    }



    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = input.value.trim();
        if (message !== '') {
            socket.emit('chat message', message);
            input.value = '';
        }
    });

    socket.on('chat message', (msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        messages.appendChild(li);
    });
});

