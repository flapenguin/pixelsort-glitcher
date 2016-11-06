module.exports.promisify = function(what) {
  return new Promise((resolve, reject) => {
    what((err, data) => err ? reject(err) : resolve(data));
  });
};

module.exports.arrayBufferToBuffer = function(arrayBuffer) {
  const buf = new Buffer(arrayBuffer);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buf.length; i++) {
    buf[i] = view[i];
  }

  return buf;
};
