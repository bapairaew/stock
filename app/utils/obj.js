export function omit(obj, filter) {
  return Object.keys(obj)
    .filter(key => filter(obj[key], key))
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
};
