const { join } = require('./array');

exports.classify = (rows) => {
  return {
    news: rows.filter(x => !x._id && !x.removed),
    changes: rows.filter(x => x._id && !x.removed),
    removes: rows.filter(x => x.removed),
  };
};

exports.parseResults = (results, { news, changes, removes }) => {
  // TODO: find better solution
  const indices = {
    news: news.length,
    changes: news.length + changes.length,
    removes: news.length + changes.length + removes.length,
  };

  return [
    results.slice(0, indices.news),
    results.slice(indices.news, indices.removes),
    results.slice(indices.removes, results.length),
  ];
};
