const {execSync, spawn} = require('child_process');
const http = require('http');
const CDP = require('chrome-remote-interface');



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

  const chrome = spawn('google-chrome', [
    '--headless',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    'http://localhost:3007'
    ], {stdio: 'inherit'});


    CDP((client) => {
        // extract domains
        const {Network, Page} = client;
        // setup handlers
        Network.requestWillBeSent((params) => {
            console.log(params.request.url);
        });
        Page.loadEventFired(() => {
            client.close();
        });
        // enable events then start!
        Promise.all([
            Network.enable(),
            Page.enable()
        ]).then(() => {
          console.log('WOAH');
            return Page.navigate({url: 'https://github.com'});
        }).catch((err) => {
            console.error(err);
            client.close();
        });
    }).on('error', (err) => {
        // cannot connect to the remote endpoint
        console.error(err);
    });


  setTimeout(() => {
    process.exit(0);
  }, 60000);
});



