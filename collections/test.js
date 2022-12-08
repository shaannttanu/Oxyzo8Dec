const newman = require('newman'); // require newman in your project

newman.run({
    collection: require('/home/ofb-289/Desktop/oxyzo-postman-suite-8Dec/collections/OxyzoLoan Renewal.postman_collection.json'),
    environment :require('/home/ofb-289/Desktop/oxyzo-postman-suite-8Dec/config/stg.json'),
    globals: require('/home/ofb-289/Desktop/oxyzo-postman-suite-8Dec/collections/workspace.postman_globals.json'),
    reporters: 'cli'
}, function (err) {
	if (err) { throw err; }
    console.log('collection run complete!');
});