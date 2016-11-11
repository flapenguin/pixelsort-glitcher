const {arrayBufferToBuffer, findIndexEx} = require('./utils');

module.exports = function(jimpImg, {
  startPredicate,
  endPredicate,
  sortBy,
  consequentRows,
  minimalSequence,
  columns
}) {
  const comparator = (a, b) => sortBy(a) < sortBy(b);

  glitchRows(jimpImg, consequentRows);

  if (columns) {
    jimpImg.rotate(90);
    glitchRows(jimpImg, consequentRows);
    jimpImg.rotate(-90);
  }

  function glitchRows(jimpImg, consequentRows) {
    const {data, width, height} = jimpImg.bitmap;

    const bytes = new Uint8Array(data);
    const pixels = new Uint32Array(bytes.buffer);

    if (consequentRows) {
      glitchRow(pixels);
      return;
    }

    for (let y = 0; y < height; y++) {
      const row = new Uint32Array(pixels.buffer, y*width*4, width);
      glitchRow(row);
    }

    arrayBufferToBuffer(bytes.buffer).copy(data);
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
};
