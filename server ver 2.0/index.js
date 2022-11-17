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

function convertArrayToJson(arr){
    var array = arr;
    var arrayToString = JSON.stringify(Object.assign({}, array));  // convert array to string
    var stringToJsonObject = JSON.parse(arrayToString);  // convert string to json object

    return stringToJsonObject;
}
 
//javascript create JSON object from two dimensional Array
function arrayToJSONObject (arr){
    let formatted = [],

    cols = arr[0].length;

    for (let i=0; i<arr.length; i++) {
            var d = arr;
            var o = {};
            for (var j=0; j<cols; j++){
                    o[cols[j]] = d[j];
            }
            formatted.push(o);
    }
    return formatted;
}



setInterval(function () {
    let gnrArr = Array.from(Array(5), () => new Array(9));

    for (let _x = 0; _x < 5; _x++) {
        let tmpArr = [];
        for (let _y = 0; _y < 9; _y++) {
            let _num = Math.floor(Math.random() * 4);
            let _date = new Date(); 
            
            tmpArr.push({
                'id': { 'x': _x, 'y': _y },
                'type': _num,
                'timeStamp': _date
            });

        }
       
        let convertedJason = convertArrayToJson(tmpArr);
        gnrArr[_x] = convertedJason;

    }

    Stream.emit('push', 'message', gnrArr);
}, 1000);

console.log('Express E2E mock server is running');

//PORT

const port = process.env.PORT || 3001;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

app.addListener('close', () => {
    console.log('Connection Closed!');
});

