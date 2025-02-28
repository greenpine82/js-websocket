import express from 'express'
import http from 'http'
import { WebSocketServer, WebSocket } from 'ws'

const app = express()
const PORT = process.env.PORT || 3000
const server = http.createServer(app)

const wss = new WebSocketServer({ server })

// Array to keep track of all connected clients
const clients = [];

wss.on('connection', connection => {
    console.log("WS connection arrived");

    // Add the new connection to our list of clients
    clients.push(connection);

    connection.on('message', message => {
        console.log('received: %s', message);

        // Broadcast the message to all clients
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                console.log("message", message.toString())
                client.send(message.toString());
            }
        });
    });

    connection.on('close', () => {
        // Remove the client from the array when it disconnects
        const index = clients.indexOf(connection);
        if (index > -1) {
            clients.splice(index, 1);
        }
    });

    // Send a welcome message on new connection
    connection.send('Welcome to the chat!');
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

