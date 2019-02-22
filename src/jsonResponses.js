const users = {};

// function to respond with a json object
const respondJSON = (request, response, status, object) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response with json object
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};


// json meta
const respondJSONMeta = (request, response, status) => {
  // object for our headers
  // Content-Type for json
  const headers = {
    'Content-Type': 'application/json',
  };

  // send response without json object, just headers
  response.writeHead(status, headers);
  response.end();
};


// getUsers
const getUsers = (request, response) => {
  // json object to send
  const responseJSON = {
    users,
  };

  // return 200 with message
  return respondJSON(request, response, 200, responseJSON);
};

// users meta
// return 200 without message, just the meta data
const getUsersMeta = (request, response) => {
  respondJSONMeta(request, response, 200);
};


// function to add a user from a POST body
const addUser = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name and task are both required.',
  };

  // If either are missing, send back an error message as a 400 badRequest
  if (!body.name || !body.task) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  // default status code to 201 created
  let responseCode = 201;

  // if that user's name already exists in our object
  // then switch to a 204 updated status
  if (users[body.name]) {
    users[body.name].task = body.task;
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    users[body.name] = {};
  }

  // add or update fields for this user name
  users[body.name].name = body.name;
  users[body.name].task = body.task;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};


// success
const success = (request, response) => {
  const responseJSON = {
    message: 'This is a sucessful response',
    id: 'Success',
  };

  return respondJSON(request, response, 200, responseJSON);
};

// bad request
const badRequest = (request, response, params) => {
  const responseJSON = {
    message: 'This query has required parameter ',
    id: 'Bad Request',
  };

  if (params.valid !== 'true') {
    return respondJSON(request, response, 400, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// unauthorized
const unauthorized = (request, response, params) => {
  const responseJSON = {
    message: 'You have successfuly view content',
    id: 'Unauthorized',
  };

  if (params.loggedIn !== 'yes') {
    return respondJSON(request, response, 401, responseJSON);
  }

  return respondJSON(request, response, 200, responseJSON);
};

// forbidden
const forbidden = (request, response) => {
  const responseJSON = {
    message: 'You do not have access to this content',
    id: 'Forbidden',
  };

  return respondJSON(request, response, 403, responseJSON);
};


// internal
const internal = (request, response) => {
  const responseJSON = {
    message: 'Something wrong with the server',
    id: 'Internal Server Error',
  };

  return respondJSON(request, response, 500, responseJSON);
};


// not implemented
const notImplemented = (request, response) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented',
    id: 'Not Implemented',
  };

  return respondJSON(request, response, 501, responseJSON);
};


// not found
const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you were looking for was not found',
    id: 'notFound',
  };

  return respondJSON(request, response, 404, responseJSON);
};

// meta notfound
const notFoundMeta = (request, response) => {
  // return a 404 without an error message
  respondJSONMeta(request, response, 404);
};


// public exports
module.exports = {
  getUsers,
  getUsersMeta,
  addUser,
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
  notFoundMeta,
};
