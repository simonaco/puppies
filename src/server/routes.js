const express = require('express');
const router = express.Router();

const puppyService = require('./puppy.service');

router.get('/puppies', (req, res) => {
  puppyService.getPuppies(req, res);
});

router.post('/puppy', (req, res) => {
  puppyService.postPuppy(req, res);
});

router.put('/puppy/:id', (req, res) => {
  puppyService.putPuppy(req, res);
});

router.delete('/puppy/:id', (req, res) => {
  puppyService.deletePuppy(req, res);
});

module.exports = router;
