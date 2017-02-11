const { join } = require('./array');

exports.classify = (rows) => {
  return {
    adds: rows.filter(x => !x._id && !x.removed),
    changes: rows.filter(x => x._id && !x.removed),
    removes: rows.filter(x => x.removed),
  };
};

exports.parseResults = (results, { adds, changes, removes }) => {
  // TODO: find better solution
  const indices = {
    adds: adds.length,
    changes: adds.length + changes.length,
    removes: adds.length + changes.length + removes.length,
  };

  return [
    results.slice(0, indices.adds),
    results.slice(indices.adds, indices.removes),
    results.slice(indices.removes, results.length),
  ];
};
