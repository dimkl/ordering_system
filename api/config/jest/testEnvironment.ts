// my-custom-environment
import NodeEnvironment from "jest-environment-node";
import type { JestEnvironmentConfig, EnvironmentContext } from "@jest/environment";
import { DataFactory } from "./dataFactory";
import app from "../../src/index";
import supertest from "supertest";

class TestEnvironment extends NodeEnvironment {
  testPath: string;
  docblockPragmas: Record<string, string | string[]>;

  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.testPath = context.testPath;
    this.docblockPragmas = context.docblockPragmas;
  }

  async setup() {
    await super.setup();

    // Will trigger if docblock contains @integration-test true
    if (this.docblockPragmas["integration-test"] === "true") {
      const request = supertest(app);
      const apiVersion = "2024-07-26";

      Object.assign(this.global, { app, request, apiVersion });
    }

    // Will trigger if docblock contains @data-factory true
    if (this.docblockPragmas["data-factory"] === "true") {
      Object.assign(this.global, { DataFactory });
    }
  }

  async teardown() {
    if (this.docblockPragmas["integration-test"] === "true" && this.global.app) {
      // @ts-expect-error The `app` is not defined in the global
      this.global.app.close();
      this.global.app = null;
      this.global.request = null;
      this.global.apiVersion = null;
    }

    if (this.docblockPragmas["data-factory"] === "true" && this.global.DataFactory) {
      this.global.DataFactory = null;
    }

    await super.teardown();
  }
}

module.exports = TestEnvironment;
