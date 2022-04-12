function isTestingEnv() {
  return process.env.NODE_ENV == 'test';
}

module.exports = {
  isTestingEnv
};