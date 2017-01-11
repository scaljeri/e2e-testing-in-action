import http from 'http';

let server, counter =0;

const PORT = process.env.SERVER_PORT || 8080,
    DEBUG = parseInt(process.env.DEBUG),
    ID = process.env.ID;

function handleRequest(request, response){
    if (DEBUG === 1) {
        console.log('log ' + request.url);
    }
    response.end(`${ID}: It Works!! Path Hit: ${request.url} counter = ${++counter}`);
}

server = http.createServer(handleRequest);

server.listen(PORT, '127.0.0.1', () => {
    if (DEBUG === 1) {
        console.log("Server listening on: http://localhost:%s", PORT);
    }
});