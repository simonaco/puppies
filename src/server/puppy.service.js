const Puppy = require('./puppy.model');
const ReadPreference = require('mongodb').ReadPreference;

require('./mongo').connect();

function getPuppies(req, res) {
  const docquery = Puppy.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(puppies => {
      res.status(200).json(puppies);
    })
    .catch(error => {
      res.status(500).send(error);
      return;
    });
}

function postPuppy(req, res) {
  const originalPuppy = {
    id: req.body.id,
    name: req.body.name,
    saying: req.body.saying
  };
  const puppy = new Puppy(originalPuppy);
  puppy.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(puppy);
    console.log('Puppy created successfully!');
  });
}

function putPuppy(req, res) {
  const originalPuppy = {
    id: parseInt(req.params.id, 10),
    name: req.body.name,
    saying: req.body.saying
  };
  Puppy.findOne({ id: originalPuppy.id }, (error, puppy) => {
    if (checkServerError(res, error)) return;
    if (!checkFound(res, puppy)) return;

    puppy.name = originalPuppy.name;
    puppy.saying = originalPuppy.saying;
    puppy.save(error => {
      if (checkServerError(res, error)) return;
      res.status(200).json(puppy);
      console.log('Puppy updated successfully!');
    });
  });
}

function deletePuppy(req, res) {
  const id = parseInt(req.params.id, 10);
  Puppy.findOneAndRemove({ id: id })
    .then(puppy => {
      if (!checkFound(res, puppy)) return;
      res.status(200).json(puppy);
      console.log('Puppy deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}

function checkServerError(res, error) {
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

function checkFound(res, puppy) {
  if (!puppy) {
    res.status(404).send('Puppy not found.');
    return;
  }
  return puppy;
}

module.exports = {
  getPuppies,
  postPuppy,
  putPuppy,
  deletePuppy
};
