const glitcher = require('./glitcher');

const args = require('minimist')(process.argv, {
  string: ['input', 'output', 'method', 'treshold', 'minimal-sequence'],
  boolean: ['invert', 'consequent-rows', 'columns']
});

glitcher(args.input, {
  method: args.method,
  treshold: parseInt(args.treshold, 10) || 50,
  invert: args.invert,
  columns: args.columns,
  consequentRows: args['consequent-rows'],
  minimalSequence: parseInt(args['minimal-sequence'], 10) || 0
}).then(img => {
  img.write(args.output);
});
