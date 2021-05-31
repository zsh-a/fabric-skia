const http = require('http');
const { FixedThreadPool } = require('./nodejs-threadpool').threadPool;
const path = require('path');
const hostname = '0.0.0.0';
const port = 3000;
const threadPool = new FixedThreadPool({preCreate:true,coreThreads:30});
console.log(threadPool.maxThreads);

// async function handle(req,res){
    
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/html');
//     console.log("req");
//     const worker = await defaultCpuThreadPool.submit(path.resolve(__dirname, 'render.js'));
// 	worker.on('done', function() {
//         res.write(...arguments);
//         res.end(); 
//         // console.log(...arguments)
//     });

//     worker.on('error', function() {
//         console.log(...arguments)
//     })
// }
const server = http.createServer(async function(req,res){
    if(req.url != '/') {
        res.statusCode = 200;
        res.write('hello world');
        res.end();
        return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    const worker = await threadPool.submit(path.resolve(__dirname, 'render.js'));
	worker.on('done', function() {
        res.write(...arguments);
        res.end(); 
        // console.log(...arguments)
    });

    worker.on('error', function() {
        console.log(...arguments)
    })
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
