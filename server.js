// init project
const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');

const {promisify} = require('./utils');
const Colors = require('./colors');
const glitch = require('./glitch');

const app = express();
const upload = multer({ limits: {fileSize: 1*1024*1024 /* 1MB max */ } });

app.use(express.static('public'));

app.post('/', upload.single('image'), (req, res) => {
  const resultType = 'image/png';
  const findBy = Colors[req.body.method] || Colors.grey;
  const treshold = parseInt(req.body.treshold, 10) || 65;
  const invert = req.body.invert === 'on';
  
  const predicates = [x => findBy(x) > treshold, x => findBy(x) < treshold];
  if (invert) { predicates.reverse(); }
  
  const [startPredicate, endPredicate] = predicates;
  
  Jimp.read(req.file.buffer)
    .then(img => {
      glitch(img, { startPredicate, endPredicate, sortBy: findBy });
  
      return promisify(cb => img.getBuffer(resultType, cb));
    })
    .then(imgBuffer => {
      res.set('Content-Type', resultType);
      res.send(imgBuffer);
    });
});

const listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});
