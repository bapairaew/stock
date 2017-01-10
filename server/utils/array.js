const join = function() { return Array.prototype.concat.apply([], Array.prototype.slice.call(arguments)); }
const flatten = function (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}

module.exports = {
	join,
	flatten,
};
