const loginDiv = document.getElementById('loginDiv');
const roomDiv = document.getElementById('roomDiv');
const chatDiv = document.getElementById('chatDiv');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginButton = document.getElementById('loginButton');
const roomNumberInput = document.getElementById('roomNumber');
const enterRoomButton = document.getElementById('enterRoomButton');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesDiv = document.getElementById('messages');

let encryptionKey;
let ws;

async function generateKey(key) {
    const rawKey = new Uint8Array(key.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    encryptionKey = await window.crypto.subtle.importKey(
        'raw',
        rawKey,
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
    );
}

async function encryptMessage(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        encryptionKey,
        data
    );
    return { iv, encrypted };
}

async function decryptMessage(encrypted, iv) {
    const decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        encryptionKey,
        encrypted
    );
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
}

loginButton.addEventListener('click', async () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (result.success) {
        loginDiv.style.display = 'none';
        roomDiv.style.display = 'block';
    } else {
        alert('Login failed');
    }
});

enterRoomButton.addEventListener('click', async () => {
    const roomNumber = roomNumberInput.value;
    if (!roomNumber) {
        alert('방번호 입력');
        return;
    }

    const response = await fetch('/enter-room', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ roomNumber })
    });

    const result = await response.json();
    await generateKey(result.key);

    ws = new WebSocket('ws://localhost:8081');

    ws.onopen = () => {
        console.log('WebSocket connected');
        roomDiv.style.display = 'none';
        chatDiv.style.display = 'block';
    };

    ws.onmessage = async (event) => {
        const { username, iv, encrypted } = JSON.parse(event.data);
        const decryptedMessage = await decryptMessage(new Uint8Array(encrypted), new Uint8Array(iv));
        const messageElement = document.createElement('div');
        messageElement.textContent = `${username} :: ${decryptedMessage}`;
        messagesDiv.appendChild(messageElement);
    };
});

sendButton.addEventListener('click', async () => {
    const message = messageInput.value;
    const username = usernameInput.value;
    const { iv, encrypted } = await encryptMessage(message);
    ws.send(JSON.stringify({ username, iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) }));
    messageInput.value = '';
});

messageInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        const message = messageInput.value;
        const username = usernameInput.value;
        const { iv, encrypted } = await encryptMessage(message);
        ws.send(JSON.stringify({ username, iv: Array.from(iv), encrypted: Array.from(new Uint8Array(encrypted)) }));
        messageInput.value = '';
    }
});