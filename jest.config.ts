import { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.ts'
  // ]
  testTimeout: 30000,
}

export default config;