require('dotenv').config();

const path = require('path');
const express = require('express');
const apply = require('./apply');
const applications = require('./applications');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

/* todo aðrar stillingar á express appi */
app.use(express.urlencoded({ extended: true }));
app.use('/', apply);
app.use('/', applications);

function notFoundHandler(req, res, next) { // eslint-disable-line
  res.status(404).render('error', { title: '404', error: '404 fannst ekki' });
}

function errorHandler(error, req, res, next) { // eslint-disable-line
  console.error(error);
  res.status(500).render('error', { title: 'Villa', error });
}

function checkInvalid(category, errorMessages) {
  errorTrue = '';
  console.log(errorMessages);
  errorMessages.forEach((error) => {
    if(category == error.param) {
      errorTrue = 'invalid';
    }
  });
  return errorTrue;
}

app.locals.checkInvalid = checkInvalid;

app.use(notFoundHandler);
app.use(errorHandler);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
