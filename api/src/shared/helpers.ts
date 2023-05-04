export function isTestingEnv() {
  return process.env.NODE_ENV == "test";
}
