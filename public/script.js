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

    function clearMessages() {
        while (messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }
    }

    const emojiMapping = new Map([
        ['react', '⚛️'],
        ['woah', '😯'],
        ['hey', '👋🏼'],
        ['lol', '😂'],
        ['like', '❤️'],
        ['congratulation', '🥳'],
    ]);
    
    const commandMapping = new Map([
        ['/help', () => {
            alert("List of Available Commands! \n -/hlep \n -/clear \n -/reload");
        }],
        ['/clear', () => {
            clearMessages();        
        }],
        ['/reload', () => {
            location.reload();
        }]
    ])



    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const sentence = input.value.trim().toLowerCase();
        let cmd = commandMapping.get(sentence)
        console.log(cmd);
        const words = sentence.split(' ');


        let msg = words.map(word => emojiMapping.get(word) || word).join(' ')

        if(cmd) {
            cmd();
            input.value = '';
        }
        else if (msg !== '') {
            socket.emit('chat message', msg);
            input.value = '';
        } 

    });

    socket.on('chat message', (msg) => {
        const li = document.createElement('li');
        li.textContent = msg;
        messages.appendChild(li);
    });
});

