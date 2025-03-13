import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

const PORT = 3001;

const players: { [key: string]: { position: { x: number, y: number }, direction: number, phase: number } } = {};

io.on('connection', (socket) => {
    // console.log('a user connected');

    players[socket.id] = {
        position: { x: 0, y: 0 },
        direction: 0,
        phase: 0
    };

    socket.emit('players-update', players);

    socket.broadcast.emit('player-connected', socket.id);

    socket.on('player-move', (data) => {
        players[socket.id] = data;
        socket.broadcast.emit('player-moved', {
            id: socket.id,
            position: data.position,
            direction: data.direction,
            phase: data.phase
        });
    });

    // Handle chat messages
    socket.on('send-chat', (message) => {
        socket.broadcast.emit('chat-message', {
            sender: socket.id.slice(0, 6), // Use first 6 chars of socket ID as sender name
            message,
            isMine: false
        });
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        io.emit('player-disconnected', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});