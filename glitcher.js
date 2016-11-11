const Jimp = require('jimp');

const {promisify} = require('./utils');
const Colors = require('./colors');
const glitch = require('./glitch');

module.exports = function(input, {
  method,
  treshold,
  invert,
  consequentRows,
  minimalSequence
}) {
  const findBy = Colors[method];
  const predicates = [x => findBy(x) > treshold, x => findBy(x) < treshold];
  if (invert) { predicates.reverse(); }

  const [startPredicate, endPredicate] = predicates;

  const start = Date.now();
  return Jimp.read(input)
    .then(img => {
      const filename = typeof input === 'string'
        ? input
        : `${img.bitmap.width}x${img.bitmap.height}`;

      glitch(img, {
        startPredicate,
        endPredicate,
        sortBy: findBy,
        consequentRows: consequentRows,
        minimalSequence: minimalSequence
      });

      console.log(`Glitched ${filename} in ${Date.now() - start}ms`);

      return img;
    });
}
