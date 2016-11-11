// init project
const express = require('express');
const multer = require('multer');

const {promisify} = require('./utils');
const glitcher = require('./glitcher');

const app = express();
const upload = multer({ limits: {fileSize: 1*1024*1024 /* 1MB max */ } });

app.use(express.static('public'));

app.post('/', upload.single('image'), (req, res) => {
  const resultType = 'image/png';

  glitcher(req.file.buffer, {
    method: req.body.method || 'grey',
    treshold: parseInt(req.body.treshold, 10) || 65,
    invert: req.body.invert === 'on',
    consequentRows: req.body['consequent-rows'] === 'on',
    minimalSequence: parseInt(req.body['minimal-sequence'], 10) || 0,
    columns: req.body.columns === 'on'
  })
    .then(img => promisify(cb => img.getBuffer(resultType, cb)))
    .then(buffer => {
      res.set('Content-Type', resultType);
      res.send(buffer);
    });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
