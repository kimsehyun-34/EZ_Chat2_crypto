# Secure Messaging Application

This project is a secure messaging web application that allows users to communicate in a chat room with encrypted messages. It includes a JSON-based login system and facilitates bidirectional communication using WebSockets.

## Features

- User authentication with username and password.
- Enter a room number to start a conversation.
- Encrypted messaging using AES-GCM.
- Real-time chat functionality with WebSocket support.

## Project Structure

```
secure-messaging-app
├── public
│   ├── main.html        # HTML structure for the application
│   ├── main.js          # JavaScript logic for handling user interactions
│   └── styles.css       # CSS styles for the application
├── db
│   └── user.json        # User data for authentication
├── index.js             # Main server file
├── package.json         # npm configuration file
└── README.md            # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd secure-messaging-app
   ```

2. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the server:
   ```
   node index.js
   ```

2. Open your web browser and navigate to `http://localhost:8081/`.

3. Enter your username and password to log in.

4. Input a room number to enter the chat room.

5. Start sending messages securely!

## Dependencies

- Express: A web framework for Node.js.
- WebSocket: A library for real-time communication.

## License

This project is licensed under the MIT License.