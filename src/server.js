const http = require('http'); // pull in http module

const url = require('url');

const query = require('querystring');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getCSS,
  '/index': htmlHandler.getIndex,
  '/success': jsonHandler.success,
  '/badRequest': jsonHandler.badRequest,
  '/unauthorized': jsonHandler.unauthorized,
  '/forbidden': jsonHandler.forbidden,
  '/internal': jsonHandler.internal,
  '/notImplemented': jsonHandler.notImplemented,
  '/notFound': jsonHandler.notFound,
  index: htmlHandler.getIndex,
  notFound: jsonHandler.notFound,
};


const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const parsedUrl = url.parse(request.url);

  // store parameters
  const params = query.parse(parsedUrl.query);

  switch (request.method) {
    case 'GET':
      if (parsedUrl.pathname === '/') {
        // if homepage, send index
        htmlHandler.getIndex(request, response);
      } else if (parsedUrl.pathname === '/style.css') {
        // if stylesheet, send stylesheet
        htmlHandler.getCSS(request, response);
      } else if (parsedUrl.pathname === '/getUsers') {
        // if get users, send user object back
        jsonHandler.getUsers(request, response);
      } else if (parsedUrl.pathname === '/success') {
        // if success is selected
        urlStruct[parsedUrl.pathname](request, response);
      } else if (parsedUrl.pathname === '/badRequest') {
        urlStruct[parsedUrl.pathname](request, response, params);
      } else if (parsedUrl.pathname === '/unauthorized') {
        urlStruct[parsedUrl.pathname](request, response, params);
      } else if (parsedUrl.pathname === '/forbidden') {
        urlStruct[parsedUrl.pathname](request, response);
      } else if (parsedUrl.pathname === '/internal') {
        urlStruct[parsedUrl.pathname](request, response);
      } else if (parsedUrl.pathname === '/notImplemented') {
        urlStruct[parsedUrl.pathname](request, response);
      } else {
        // if not found, send 404 message
        jsonHandler.notFound(request, response);
      }
      break;

    case 'HEAD':
      if (parsedUrl.pathname === '/getUsers') {
        // if get users, send meta data back
        jsonHandler.getUsersMeta(request, response);
      } else {
        // if not found send 404 without body
        jsonHandler.notFoundMeta(request, response);
      }
      break;

    case 'POST':
      // if post is to /addUser (our only POST url)
      if (parsedUrl.pathname === '/addUser') {
        const res = response;

        // uploads come in as a byte stream that we need
        // to reassemble once it's all arrived
        const body = [];

        // if the upload stream errors out, just throw a
        // a bad request and send it back
        request.on('error', (err) => {
          console.dir(err);
          res.statusCode = 400;
          res.end();
        });

        // on 'data' is for each byte of data that comes in
        // from the upload. We will add it to our byte array.
        request.on('data', (chunk) => {
          body.push(chunk);
        });

        // on end of upload stream.
        request.on('end', () => {
          // combine our byte array (using Buffer.concat)
          // and convert it to a string value (in this instance)
          const bodyString = Buffer.concat(body).toString();
          // since we are getting x-www-form-urlencoded data
          // the format will be the same as querystrings
          // Parse the string into an object by field name
          const bodyParams = query.parse(bodyString);

          // pass to our addUser function
          jsonHandler.addUser(request, res, bodyParams);
        });
      }
      break;
    default:
      // send 404 in any other case
      jsonHandler.notFound(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
