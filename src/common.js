 const newman = require('newman');
const commonsCollection = require('../collections/commons.json');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * Postman test to execute common collection of APIS.
 * @param callback    success/failure callback function
 * @param environment postman environment json
 */
 module.exports = (callback, environment) => {
    newman.run({
    collection: commonsCollection,
    iterationData: [{
      var: 'data',
      var_beta: 'other_val',
    }],
    globals: {},
    environment,
    reporters: 'cli',
  }, (error, summary) => {
    if (summary.run.failures.length !== 0) {
      callback('FAILED', summary);
    } else {
      callback(error, summary);
    }
  });
};
