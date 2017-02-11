exports.join = function () {
  return Array.prototype.concat.apply([], Array.prototype.slice.call(arguments));
};

exports.flatten = function (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
};

exports.chunk = (arr, size) => {
  return arr.reduce((sum, item, index) => {
    const chunkNumber = Math.floor(index / size);

    if (!sum[chunkNumber]) {
      sum[chunkNumber] = [];
    }

    sum[chunkNumber].push(item);

    return sum;
  }, []);
};
