const {arrayBufferToBuffer} = require('./utils');

module.exports = function(jimpImg, {
  startPredicate,
  endPredicate,
  sortBy,
  consequentRows,
  minimalSequence
}) {
  const comparator = (a, b) => sortBy(a) < sortBy(b);
  const {data, width, height} = jimpImg.bitmap;

  const bytes = new Uint8Array(data);
  const pixels = new Uint32Array(bytes.buffer);

  if (consequentRows) {
    glitchRow(pixels);
  } else {
    glitchRows(pixels, width, height);
  }

  arrayBufferToBuffer(bytes.buffer).copy(data);

  function glitchRows(pixels, width, height) {
    for (let y = 0; y < height; y++) {
      const row = new Uint32Array(pixels.buffer, y*width*4, width);
      glitchRow(row);
    }
  }

  function glitchRow(row) {
    let start = 0, end = 0;
    while (end < row.length - 1) {
      start = findIndexEx(row, startPredicate, end);
      if (start === -1) {
        return;
      }

      end = findIndexEx(row, endPredicate, start);
      if (end === -1) {
        end = row.length - 1;
      }

      if (end - start > minimalSequence) {
        const arr = new Uint32Array(row.buffer, row.byteOffset + start*4, end - start);
        arr.sort(comparator);
      }
    }
  }

  function findIndexEx(arr, predicate, startIx) {
    for (let i = startIx; i < arr.length; i++) {
      if (predicate(arr[i])) {
        return i;
      }
    }

    return -1;
  }
};
