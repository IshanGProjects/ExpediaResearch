import {describe, expect, test} from '@jest/globals';
import testSetupVerify from "../testSetupVerify"

describe('sum module', () => {
  test('adds 1 + 2 to equal 3', () => {
    expect(testSetupVerify(1, 2)).toBe(3);
  });
});