import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  verbose: true,
  preset: "ts-jest/presets/js-with-babel",
  testEnvironment: "node",
  setupFiles: ["./jest.setup.ts"],
  transform: {
    "^.+\\.ts?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest",
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transformIgnorePatterns: ["node_modules/(?!axios)"],
};

export default config;
