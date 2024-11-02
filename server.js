const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const chatController = require('./controllers/chatController');
const chatRoutes = require('./routes/chatRoutes');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static('public'));

// Use the chat routes
app.use('/', chatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const decoded = jwt.verify(token, 'Hsdh223#2kddie');
        socket.user = decoded;
        next();
    } catch (error) {
        next(new Error('Authentication error'));
    }
});

io.on('connection', async (socket) => {
    console.log('a user connected', socket.user.id);

    try {
        const history = await chatController.getMessages();
        socket.emit('chat history', history);
    } catch (error) {
        socket.emit('error', {
            message: 'Error loading chat history ', 
            error
        })

    socket.on('chat message', (msg) => {
        const author = socket.user.username;
        const message = chatController.addMessage(msg, author);
        // Emit the new message to all clients
        io.emit('chat message', message);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.user.id);
    });
}});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});