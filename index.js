const glitcher = require('./glitcher');

const args = require('minimist')(process.argv, {
  string: ['input', 'output', 'method', 'treshold'],
  boolean: ['invert', 'consequent-rows']
});

glitcher(args.input, {
  method: args.method,
  treshold: args.treshold,
  invert: args.invert,
  consequentRows: args['consequent-rows']
}).then(img => {
  img.write(args.output);
});
