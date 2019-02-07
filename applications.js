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
  const thisID = req.params.id;
  const deletedList = await runQuery('DELETE FROM applications WHERE id=' +thisID);

  return res.redirect('/applications');
}

async function processApplication(req, res) {
  const thisID = req.params.id;
  const updateApplication = await runQuery('UPDATE applications SET processed = TRUE WHERE id =' +thisID);

  return res.redirect('/applications');
}

router.post('/applications/remove/:id', catchErrors(deleteApplication));
router.post('/applications/processed/:id', catchErrors(processApplication));
router.get('/applications', applications);

module.exports = router;
