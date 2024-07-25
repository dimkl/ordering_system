export {};

import type { SuperTest } from "supertest";

declare global {
  export { DataFactory } from "./config/jest/dataFactory";
  export const request: SuperTest;
  export const apiVersion: string;
}
