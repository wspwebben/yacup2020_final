import { input, output } from './data';

import {
  testFactory,
  // SETTINGS
  disableSuccessLogs,
  disableTestingEveryInput
} from './test';


// toggle to switch from testOne to testEvery
// disableTestingEveryInput(); 

// disable logging test witch happened to pass
disableSuccessLogs();


// ***

const test = testFactory();
test(input, output);
