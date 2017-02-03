// https://gist.github.com/pyrtsa/8270927
function getIn(x, ks) {
  for (var i = 0, n = ks.length; x != null && i < n; i++) x = x[ks[i]];
  return x;
}

exports.get = (x, path) => {
  if (path == '') return x;
  if (path[0] != '.') return;
  return getIn(x, path.slice(1).split(/\./i));
}
