const { rejects } = require('assert');
const { resolve } = require('path');
const http = require('http');
const hostname = '0.0.0.0';
const port = 3000;

async function render(data) {
    var fs = require('fs');
    var fabric = require('./fabric.js').fabric;
    // const hummus = require('hummus');
    // const memoryStreams = require('memory-streams');

    // const HummusRecipe = require('hummus-recipe');

    let width = data.width, height = data.height;
    if (data.fmt == 'pdf') {
        const pdf = require('pdfjs');

        let pages = [new fabric.StaticCanvas(null, { width: width, height: height })];
        const doc = new pdf.Document();

        let canvas = pages[0];
        let num = Math.ceil(Math.random() * 10) % 8 + 1;
        let p = `data/d0/rand_2000_${num}.json`
        let buf = fs.readFileSync(p, 'utf-8');
        canvas.loadFromJSON(buf);
        canvas.renderAll();

        pages.push(new fabric.StaticCanvas(null, { width: width, height: height }));
        canvas = pages[1];
        num = Math.ceil(Math.random() * 10) % 8 + 1;
        p = `data/d0/rand_2000_${num}.json`
        buf = fs.readFileSync(p, 'utf-8');
        canvas.loadFromJSON(buf);
        canvas.renderAll();

        pages.push(new fabric.StaticCanvas(null, { width: width, height: height }));
        canvas = pages[2];
        num = Math.ceil(Math.random() * 10) % 8 + 1;
        p = `data/d0/rand_2000_${num}.json`
        buf = fs.readFileSync(p, 'utf-8');
        canvas.loadFromJSON(buf);
        canvas.renderAll();

        pages.forEach((c, i) => {
            if (i > 0)
                doc.pageBreak();
            const img = new pdf.Image(fabric.util.getNodeCanvas(c.lowerCanvasEl).toBuffer('pdf'));
            doc.image(img);
            c.clear();
        });
        return doc.asBuffer();
    } else {
        let canvas = new fabric.StaticCanvas(null, { width: width, height: height });
        let num = Math.ceil(Math.random() * 10) % 8 + 1;
        const p = `data/d0/rand_2000_${num}.json`
        let buf = fs.readFileSync(p, 'utf-8');
        canvas.loadFromJSON(buf);
        canvas.renderAll();
        // let res = `<img src="${canvas.toDataURL({format:data.fmt,quality:50})}">`;
        let res = fabric.util.getNodeCanvas(canvas.lowerCanvasEl).toBuffer(data.fmt);
        canvas.clear();
        return res;
    }
    return '';
}

// render({fmt:'pdf',width:2000,height:2000});
(async () => {
    const { job, start, stop } = require("microjob");


    let fmt = 'png';
    try {
        // start the worker pool
        await start({ maxWorkers: 3 });

        // this function will be executed in another thread
        // const data = await job(render);

        const server = http.createServer(async function (req, res) {
            if (req.url != '/') {
                res.statusCode = 200;
                res.write('hello world');
                res.end();
                return;
            }
            const data = await job(render, { data: { fmt: fmt, width: 2000, height: 2000 } });
            res.statusCode = 200;
            if (fmt == 'pdf')
                res.setHeader('Content-Type', 'application/pdf');
            else if (fmt == 'png')
                res.setHeader('Content-Type', 'image/png');
            else if (fmt == 'jpeg' || fmt == 'jpg')
                res.setHeader('Content-Type', 'image/jpeg');
            else if (fmt == 'svg')
                res.setHeader('Content-Type','text/xml')
            res.write(data);
            res.end();
        });

        server.listen(port, hostname, () => {
            console.log(`Server running at http://${hostname}:${port}/`);
        });

        // console.log(res); // 1000000
    } catch (err) {
        console.error(err);
    } finally {
        // // shutdown worker pool
        // await stop();
    }
})();
