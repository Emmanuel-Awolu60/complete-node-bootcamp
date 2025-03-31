const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./starter/modules/modules');
const { default: slugify } = require('slugify');
const tempOverview = fs.readFileSync(
  `${__dirname}/starter/templates/templates-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/templates-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/templates-product.html`,
  'utf-8'
);

const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'content-type': 'text/html',
    });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHtml);
    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === '/product') {
    const product = dataObj[query.id];
    res.writeHead(200, {
      'content-type': 'text/html',
    });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    // API
  } else if (pathname === '/api') {
    fs.readFile(
      `${__dirname}/starter/dev-data/data.json`,
      'utf-8',
      (err, data) => {
        res.end(data);
      }
    );

    // NOT FOUND
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      'my-hearder': 'Emman',
    });
    res.end('<h1>Page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requsts on port 8000');
});
