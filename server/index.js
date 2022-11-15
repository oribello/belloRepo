const parser = require('body-parser');
const EventEmitter = require('events');
const Stream = new EventEmitter();

const express = require('express');

const app = express();
const cors = require('cors');

app.use(cors());
app.use(parser.json());
app.use(
    parser.urlencoded({
        extended: true,
    }),
);

app.use(express.json());

let clients = [];
let gnrArr = [];

app.get('/my-endpoint', function (req, res) {

    const headers = {
        'Content-Type': 'text/event-stream',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);

    const clientId = Date.now();

    const newClient = {
        id: clientId,
        //response
    };

    clients.push(newClient);

    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(client => client.id !== clientId);
    });

    Stream.addListener('push', function (event, data) {
        res.write('event: ' + String(event) + '\n' + 'data: ' + JSON.stringify(data) + '\n\n');
    });
});

setInterval(function () {
    gnrArr = [];

    for (let itr = 0; itr < 45; itr++) {
        let _num = Math.floor(Math.random() * 4);
        gnrArr.push({
            'id': itr,
            'type': _num
        });
    }

    Stream.emit('push', 'message', gnrArr);
}, 1500);

console.log('Express E2E mock server is running');

//PORT

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

app.addListener('close', () => {
    console.log('Connection Closed!');
});

