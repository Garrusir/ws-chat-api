const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config.json');
const app = express();
const port = process.env.PORT || 3333;

app.use(express.json());
app.use(cors());


const schema = new mongoose.Schema({
    name: {type: String, required: true},
    message: {type: String, required: true},
})
const Message = mongoose.model('Message', schema);

const server = http.createServer(app);
const io = require('socket.io')(server);


io.on('connection', (client) => {
    client.on('message', msm => {
        messages.push(msm);
        io.emit('message', msm);
    })
});

app.get('/messages/index', async (req, res) => {
    const messageList = await Message.find({})
    res.json({ value: messageList });
})

app.get('/', (req, res) => {
    res.json('API')
})

app.post('/messages/create', async (req, res) => {
    const { message, name } = req.body;

    const msm = new Message({
        name, message
    })

    await msm.save();

    io.emit('message', msm);
    res.send('ok');
})

mongoose.connect(config.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})
    .then(() => {
        server.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch((e) => {
        console.log('server error:', e.message);
        process.exit(1);
    });

