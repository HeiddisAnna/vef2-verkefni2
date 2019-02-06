const express = require('express');

const { fetchData, runQuery } = require('./db');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function applications(req, res) {
  const applications = await fetchData();
  
  return res.render('applications', { applications, title: 'Umsóknarlisti' });
}

async function deleteApplication(req, res) {
  console.log('fer hingað inn');
  const applications = await fetchData();

  return res.render('applications', { applications, title: 'Umsóknarlisti' });
  
}

router.post('/applications', catchErrors(deleteApplication));
router.get('/applications', applications);

module.exports = router;
