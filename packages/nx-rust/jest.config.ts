import { readFileSync } from 'fs';

// Reading the SWC compilation config and remove the "exclude"
// for the test files to be compiled by SWC
/* eslint-disable-next-line */
const { exclude: _, ...swcJestConfig } = JSON.parse(
  readFileSync(`${__dirname}/.lib.swcrc`, 'utf-8')
);
export default {
  displayName: 'nx-rust',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/packages/nx-rust',
};
