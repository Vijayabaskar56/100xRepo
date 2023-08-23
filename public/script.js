const socket = io();

const existingContacts = JSON.parse(localStorage.getItem('contacts')) || [];




document.addEventListener('DOMContentLoaded', () => {
    const messages = document.querySelector('#messages');
    const form = document.querySelector('#form');
    const input = document.querySelector('#input');
    const chatContacts = document.querySelector('.chat-contacts');

    function updateContactDisplay() {
    chatContacts.innerHTML = ''; // Clear the existing contact list

    existingContacts.forEach(contact => {
        const contactDiv = document.createElement('div');
        contactDiv.classList.add('contact');
        contactDiv.textContent = contact;
        chatContacts.appendChild(contactDiv);
    });

    const contactCount = document.querySelector('#contactCount');
    contactCount.textContent = existingContacts.length.toString();
}

    const contactName = prompt('Please enter a contact name:');
    if (contactName) { 

        existingContacts.push(contactName);
        
        updateContactDisplay(); 

        localStorage.setItem('contacts', JSON.stringify(existingContacts)); 

        socket.emit('set contact', contactName); 
    }

    const emojiMapping = new Map([

        ['react' || 'React' || 'REACT', '⚛️'],
        ['woah' || 'Woah' || 'WOAH', '😯'],
        ['hey' || 'Hey' || 'HEY', '👋🏼'],
        ['lol' || 'Lol' || 'LOL', '😂'],
        ['like' || 'Like' || 'LIKE', '❤️'],
        ['congratulation' || 'Congratulation' || 'CONGRATULATION', '🥳'],
        ['react:' , 'react'],
        ['woah:' , 'woah'],
        ['hey:' ,'hey'],
        ['lol:', 'lol'],
        ['like:', 'like'],
        ['congratulation:', 'congratulation'],
    ]);

    function clearContactsSession() {
    localStorage.removeItem('contacts'); 
    existingContacts.length = 0; 
    updateContactDisplay(); 
}


    const number = '0123456789';
    let result = "";
    
    const commandMapping = new Map([
        ['/help', () => {
            alert("List of Available Commands! \n -/hlep \n -/clear \n -/reload \n -/random \n -/calc \n -rem");
        }],
        ['/clearcontact', () => {
            while (chatContacts.firstChild) {
            chatContacts.removeChild(chatContacts.firstChild);
            clearContactsSession();
        }
        }],
        ['/clear', () => {
            while (messages.firstChild) {
            messages.removeChild(messages.firstChild);
        }
        }],
        ['/reload', () => {
            location.reload();
        }],
        ['/random', () => {
            for (let i = 0; i < 10; i++) {
                const index = Math.floor(Math.random() * number.length)
                result += number.charAt(index)
            }
            socket.emit('chat message', result);
            result = ''
        }],
        ['/rem', (key, value) => {
            if(key && value) {
                emojiMapping.set(key, value);
                alert('Remembered!!')
            } else if (key) {
                let value = emojiMapping.get(key);
                socket.emit('chat message', value);
                value = '';
            }
        }],
        ['/calc', (numone, operator ,numtwo) => {
            console.log(numone,numtwo);
            const one = Number(numone);
            const two = Number(numtwo);
            let res;
            if(operator === '+') {
                res = one + two;
            } else if (operator === '-') {
                res = one - two;
            } else if (operator === '*') {
                res = one * two;
            } else if (operator === '/') {
                res = one / two;
            } else if (operator === '%') {
                res = one % two;
            }
            console.log(one,two);
            res.toString();
            socket.emit('chat message', res);
            rum = ''
        }]
    ])



    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const sentence = input.value.trim().toLowerCase();
        const words = sentence.split(' ');
        
        if(words.length > 0) {
            var firstWord = words[0];
            var secondword = words[1];
            var thirdword = words[2];
            var fourthword = words[3];
            console.log(firstWord, secondword, thirdword,fourthword);
        }


        let cmd;
            
        cmd = commandMapping.get(firstWord)

        let msg = words.map(word => emojiMapping.get(word) || word).join(' ')
        if(cmd) {
            if(firstWord === '/calc') {
                cmd(secondword, thirdword, fourthword);
            } else
            cmd(secondword, thirdword);
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

