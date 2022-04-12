// my-custom-environment
const NodeEnvironment = require('jest-environment-node');

class TestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    // Will trigger if docblock contains @integration-test true
    if (this.docblockPragmas['integration-test'] === 'true') {
      const app = require("../../src/index");
      const request = require("supertest")(app);

      Object.assign(this.global, { app, request });
    }
  }

  async teardown() {
    if (this.docblockPragmas['integration-test'] === 'true' && this.global.app) {
      this.global.app.close();
      this.global.app = null;
      this.global.request = null;
    }

    await super.teardown();
  }
}

module.exports = TestEnvironment;