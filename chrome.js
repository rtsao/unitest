const {execSync, spawn} = require('child_process');
const http = require('http');

const chromeBin = execSync('which google-chrome', {encoding: 'utf8'});

console.log('chrome path:', chromeBin);

const requestHandler = (request, response) => {  
  console.log('request', request.url);
  response.end(`
    <html>
    <head>
      <title>page</title>
    </head>
    <body>
      <script>console.log('hello from chrome')</script>
    </body>
    </html>
  `)
}

const server = http.createServer(requestHandler);

server.listen(3007, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening`);

  const chrome = spawn('chrome', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    'http://localhost:3007'
    ], {stdio: 'inherit'});

  setTimeout(() => {
    process.exit(0);
  }, 5000);
});



