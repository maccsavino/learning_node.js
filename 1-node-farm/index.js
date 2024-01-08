// these are modules
// fs = file system
const fs = require('fs');
const http = require('http');
const path = require('path');
const { json } = require('stream/consumers');
const url = require('url');
// calling a one made modules
const replaceTemplate = require('./modules/replaceTemplate');
// third party modules
const slugify = require('slugify');
// /////////
// //how to use files
// // blocking synchronous way
// // this code reads the file
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// // the code over here would write in the file.
// const textOut = `this is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync("./txt/output.txt", textOut);
// console.log(`file written!`);

// // nonblocking asynchronous way
// // what happens in this
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile(`./text/final.txt`, `${data1}\n${data2}`, "utf-8", (err) => {
//         console.log(`Your file has been written`);
//       });
//     });
//   });
// });
// console.log(`Will read file`);

//this is reading the files with the html code like connecting it to node.js

const tempOverView = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
//api but sync verison
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

// creating slugs seeing how to creeate things
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// ///////////
//Servers
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // overview page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-Type': 'text/html' });
    const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverView.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);
    // product page
  } else if (pathname === '/product') {
    res.writeHead(200, { 'content-Type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
    //Api
  } else if (pathname === '/api') {
    fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
      // this gets the json code which is a string and makes it a javascript object
      const productData = JSON.parse(data);
      res.writeHead(200, { 'content-Type': 'application/json' });
      console.log(productData);
      res.end(data);
    });
    // not found
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1> Pages not found! </h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('listening to requests on port 8000');
});
