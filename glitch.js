const {arrayBufferToBuffer} = require('./utils');

module.exports = function(jimpImg, { startPredicate, endPredicate, sortBy }) {
  const comparator = (a, b) => sortBy(a) < sortBy(b);
  const {data, width, height} = jimpImg.bitmap;

  const bytes = new Uint8Array(data);
  const pixels = new Uint32Array(bytes.buffer);

  glitch(pixels, width, height);

  arrayBufferToBuffer(bytes.buffer).copy(data);

  function glitch(pixels, width, height) {
    for (let y = 0; y < height; y++) {
      const row = new Uint32Array(pixels.buffer, y*width*4, width);
      glitchRow(row);
    }
  }

  function glitchRow(row) {
    let start = 0, end = 0;
    while (true) {
      const rest = row.slice(end);
      start = rest.findIndex(startPredicate);
      if (start === -1) {
        return;
      }
      start += end;

      const newrest = row.slice(start);
      end = newrest.findIndex(endPredicate);
      if (end === -1) {
        end = row.length - 1;
      } else {
        end += start;
      }

      const arr = new Uint32Array(row.buffer, row.byteOffset + start*4, end - start);
      arr.sort(comparator);

      if (end === row.length - 1) {
        return;
      }
    }
  }
};
