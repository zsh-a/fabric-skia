var cluster = require('cluster');
var os = require('os');
var http = require('http')

var fs = require('fs'),
    fabric = require('./fabric.js').fabric;
if (cluster.isMaster){
  for (var i = 0, n = os.cpus().length; i < n; i += 1){
    cluster.fork();
  }
} else {
  http.createServer(function(req, res) {
    let canvas = new fabric.StaticCanvas(null, { width: 2000, height: 2000 });
    let num = Math.ceil(Math.random()*10) % 8 + 1;
    const p = `data/d0/rand_2000_${num}.json`
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    fs.readFile(p, 'utf-8',(err,data)=>{
        if(err){
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + "\n");
            response.end();
        }
        canvas.loadFromJSON(data);
        canvas.renderAll();
        res.end(`<img src="${canvas.toDataURL("png")}">`);
    });
  }).listen(3000);
}