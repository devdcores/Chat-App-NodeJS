const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io')
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3010;
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {

    socket.emit('message', 'Welcome!!');
    socket.broadcast.emit('message', 'A user has joined the chat!')

    socket.on('sendMessage', (message, callback) => {

        const filter = new Filter();
        if(filter.isProfane(message)){
           return callback('Profanity is not allowed!!')
        }

        io.emit('message', message);
        callback()
    })

    socket.on('disconnect', ()=>{
        io.emit('message', 'A user has left the chat!')
    })

    socket.on('sendLocation', (coords, callback)=>{
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
})


server.listen(port, () => {
    console.log('Server Started on Port : ' + port);
})