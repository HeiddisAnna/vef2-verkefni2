const express = require('express');

const { fetchData, runQuery } = require('./db');

const router = express.Router();

function catchErrors(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
}

async function applications(req, res) {
  const applications = await fetchData();
  console.log(applications);
  
  return res.render('applications', { applications, title: 'Umsóknarlisti' });
}

async function deleteApplication(req, res) {
  console.log(req.params);
  const deletedList = await runQuery('DELETE FROM applications WHERE id=2');
  // const deletedList = await runQuery('DELETE FROM applications WHERE id=${id}');

  return res.redirect('/applications');
}

async function processApplication(req, res) {
  console.log('fer inn í processApplication');
  console.log(req.params);
  const updateApplication = await runQuery('UPDATE applications SET processed = TRUE WHERE id = 4');

  return res.redirect('/applications');
}


router.post('/applications/remove', catchErrors(deleteApplication));
router.post('/applications/processed', catchErrors(processApplication));
router.get('/applications', applications);


module.exports = router;
