const { isTestingEnv } = require('./helpers');

describe('shared/helpers', () => {
  describe('isTestingEnv()', () => {
    const env = { ...process.env };

    afterAll(() => {
      process.env = env;
    });

    it('returns true test env', () => {
      process.env.NODE_ENV = 'test';
      expect(isTestingEnv()).toBe(true);
    });

    it('returns true development env', () => {
      process.env.NODE_ENV = 'development';
      expect(isTestingEnv()).toBe(false);
    });

    it('returns true production env', () => {
      process.env.NODE_ENV = 'production';
      expect(isTestingEnv()).toBe(false);
    });
  });
});