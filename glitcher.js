const Jimp = require('jimp');

const {promisify} = require('./utils');
const Colors = require('./colors');
const glitch = require('./glitch');

module.exports = function(input, config) {
  const findBy = Colors[config.method];
  const treshold = parseInt(config.treshold, 10);
  const invert = config.invert;

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
        consequentRows: config.consequentRows
      });

      console.log(`Glitched ${filename} in ${Date.now() - start}ms`);

      return img;
    });
}
