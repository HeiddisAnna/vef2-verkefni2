const xss = require('xss');
const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { sanitize } = require('express-validator/filter');

// const { catchErrors } = require('./utils');
const { saveToDb, fetchData } = require('./db');

const router = express.Router();

const formValidation = [
  check('name')
    .isLength({ min: 1 })
    .withMessage('Nafn má ekki vera tómt'),

  check('email')
    .isLength({ min: 1 })
    .withMessage('Netfang má ekki vera tómt'),

  check('email')
    .isEmail()
    .withMessage('Netfang verður að vera netfang'),
  /*
  check('phone')
    .isInt({ min: 6, max: 7 })
    .withMessage('Símanúmer verður að vera sjö stafa íslenskt símanúmer'),
    */

  check('text')
    .isLength({ min: 100 })
    .withMessage('Kynning skal vera a.m.k. 100 stafir'),
];

const formSanitize = [
  sanitize('name')
    .trim()
    .escape(),
  sanitize('email')
    .normalizeEmail(),
  sanitize('phone')
    //blacklist('-')
    .toInt(),
];

function form(req, res) {
  const data = {
    name: '',
    email: '',
    phone: '',
    text: '',
    job: '',
  };
  const { body: { name, email, phone, text, job } = {} } = req;

  const errors = [];
  res.render('index', { errors, data, title: 'Umsókn' });
}


async function formPost(req, res) {
  // fá öll gögn úr formi
  const {
    body: {
      name = '',
      email = '',
      phone = '',
      text = '',
      job = '',
    } = {},
  } = req;

  // öll gögn hreinsuð úr formi
  const data = {
    name: xss(name),
    email: xss(email),
    phone: xss(phone),
    text: xss(text),
    job: xss(job),
  };

  const validation = validationResult(req);


  if (!validation.isEmpty()) {
    console.log('kemst hingað');
    const errors = validation.array();
    return res.render('index', { errors, data, title: 'Umsókn' });
  }

  await saveToDb(data);

  return res.redirect('/thanks');
}

function thanks(req, res) {
  return res.render('thanks', { title: 'Takk fyrir' });
}

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

router.get('/', form);
router.post('/', formValidation, formSanitize, catchErrors(formPost));
router.get('/thanks', thanks);

module.exports = router;
