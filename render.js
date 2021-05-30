var fs = require('fs'),
    fabric = require('./fabric.js').fabric;

module.exports = async function() {
    return new Promise((resolve, reject) => {

        let canvas = new fabric.StaticCanvas(null, { width: 2000, height: 2000 });
        let num = Math.ceil(Math.random()*10) % 8 + 1;
        const p = `data/d0/rand_2000_${num}.json`
        fs.readFile(p, 'utf-8',(err,data)=>{
            canvas.loadFromJSON(data);
            canvas.renderAll();
            resolve(`<img src="${canvas.toDataURL("jpeg")}">`);
        });
    })
} 