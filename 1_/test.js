import equal from 'deep-equal';
import { diff as diffObjects } from 'deep-object-diff';
import { diff as diffArrays } from 'fast-array-diff';

import solution from './solution';

let shouldShowSuccess = true;
let shouldTestEvery = true;

export const logDiff = (input, output) => log => {
  if (typeof input === 'object') {
    if (input === null) return;

    if (Array.isArray(input)) {
      log(`Diff: `, diffArrays(input, output));
      return;
    }

    return log(`Diff: `, diffObjects(input, output));
  }
}

export const disableSuccessLogs = () => shouldShowSuccess = false;
export const disableTestingEveryInput = () => (shouldTestEvery = false);

const printLog = (input, output, result) => method => {
  const log = console[method];
  const groupMethod = method === 'error' ? 'group' : 'groupCollapsed';

  console[groupMethod](input);
  log(`Expected: `, output);
  log(`Got: `, result);
  logDiff(input, output)(log)
  
  console.groupEnd();
};

const assert = (input, expected) => {
  const result = solution(input);

  if (equal(result, expected)) {
    shouldShowSuccess && printLog(input, expected, result)('log');
    return true;
  } else {
    printLog(input, expected, result)('error');
    return false;
  }
};

const testOne = (input, output) => {
  return assert(input, output);
};

const testEvery = (inputs, outputs) => {
  return inputs.forEach((input, index) => {
    const output = outputs[index];
    return assert(input, output);
  });
};

export const testFactory = () => {
  const testDictionary = {
    testOne,
    testEvery
  }
  
  const testMethod = shouldTestEvery ? 'testEvery' : 'testOne';
  
  return testDictionary[testMethod];
}
