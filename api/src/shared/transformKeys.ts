export function camelCaseKeys<T>(obj: T): T {
  if (!obj) return obj;

  const result = Object.entries(obj).reduce((newObj, [key, value]) => {
    const transformedKey = key.replace(/(_(\w))/, (_1, _2, a) => a.toUpperCase());
    newObj[transformedKey] = value;
    return newObj;
  }, {});

  return result as T;
}

export function snakeCaseKeys(obj) {
  if (!obj) return;

  return Object.entries(obj).reduce((newObj, [key, value]) => {
    const transformedKey = key.replace(/([A-Z])/, (_1, a) => `_${a.toLowerCase()}`);
    newObj[transformedKey] = value;
    return newObj;
  }, {});
}
