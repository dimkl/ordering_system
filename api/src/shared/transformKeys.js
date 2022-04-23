function cameCaseKeys(obj) {
  if (!obj) return;

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    const transformedKey = key.replace(/(\_(\w))/, (_1, _2, a) => a.toUpperCase());
    newObj[transformedKey] = value;
    return newObj;
  }, {});
}

function snakeCaseKeys(obj) {
  if (!obj) return;

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    const transformedKey = key.replace(/([A-Z])/, (_1, a) => `_${a.toLowerCase()}`);
    newObj[transformedKey] = value;
    return newObj;
  }, {});
}

module.exports = { cameCaseKeys, snakeCaseKeys };