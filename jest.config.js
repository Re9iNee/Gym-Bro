module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts"],
  verbose: true,
  forceExit: false,
  setupFilesAfterEnv: ["<rootDir>/singleton.ts"],
};
