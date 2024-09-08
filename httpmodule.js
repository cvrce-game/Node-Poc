import http from 'http'
import url from 'url';

const myServer = http.createServer((req, res) => {
    console.log("Request: " + req.url);
    const myURL = url.parse(req.url, true);
    console.log(myURL);
    switch (req.url) {
        case '/':
            res.end('Home')
            break;
        case '/about': {
            res.end('About');
            break;
        }
        default: res.end('Not found');
            break;
    }
});

myServer.listen(3000, () => console.log("Server Started!"));
