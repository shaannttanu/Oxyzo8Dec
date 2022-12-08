const faker = require('faker');

const Excel = require('exceljs');
const sleep = require('thread-sleep');
const fs = require('fs');
const path = require('path');


const newman = require('newman');
const notify = require('./notification');

const testType = process.argv[3];
function variable()
{
  this.num = `99${faker.random.number({ min: 10000000, max: 99999999 })}`;
  this.conNum = `91${faker.random.number({ min: 10000000, max: 99999999 })}`;
  this.clientFirstName = faker.name.firstName().toLowerCase();
  this.clientLastName = faker.name.lastName();
  this.clientName = `${clientFirstName} ${clientLastName}`;
  this.companyName = faker.company.companyName();
  this.contactEmail = faker.internet.email();
}
function InfoToBeUpdate(sheetName, rowNumber, cellNumber, cellValue) {
  this.sheetName = sheetName,
  this.rowNumber = rowNumber,
  this.cellNumber = cellNumber,
  this.cellValue = cellValue;
}

/**
 * Postman test to execute given collection of APIS.
 * @param callback    success/failure callback function
 * @param environment postman environment json
 */
module.exports = (callback, environment, collection, redisKey, randomRequest) => {
  newman.run({
    collection: require(`../collections/${collection}.json`),
    iterationData: [{ var: 'data', var_beta: 'other_val' }],
    globals: {},
    environment,
    reporters: 'htmlextra',
    reporter: {
      htmlextra: {
        export: path.join(__dirname, 'temp/report.html'),
        darkTheme: true
      }
    }
  },
  (error, summary) => {    
    callback(error, summary);  
    console.info('collection run complete!');
  }).on('start', (err, args) => {
    console.log('running a collection...');  
  }).on('beforeRequest', (err, request) => {
    let json = {};
    if (request.item.name === 'Send Login Otp' || request.item.name === 'CreateAccount') {
      json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'Get OTP') {
      request.request.url.query.members[0].value = redisKey;
      request.request.url.query.members[1].value = num;
    }
    if (request.item.name === 'SaveProfile' || request.item.name === 'EmailTenderDetail' || request.item.name === 'EmailTenderList' || request.item.name === 'EmailBidAwardTender' || request.item.name === 'EmailBidAwardList') {
      json = JSON.parse(request.request.body.raw);
      json.name = clientName;
      json.companyName = companyName;
      json.phoneNumber = num;
      json.email = contactEmail;
      request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'Order payment'){
      json = JSON.parse(request.request.body.raw);
      json.billingDetails.name = clientName;
      request.request.body.raw = JSON.stringify(json);
    }
  }).on('request', async (err, request) => { // on start of run, log to console
  }).on('done', (err, summary) => {
    const iterations = summary.run.stats.iterations.total;
      const items = summary.run.stats.items.total;
      const totalRequests = summary.run.stats.requests.total;
      const failedAssertions = summary.run.stats.assertions.failed;
      if (randomRequest === 'BidAssist') {
        notificationMessage = `*\`Running for: BidAssist\`*,\n Client Name: ${clientName.toUpperCase()}, \n Contact Number: ${num}, \n env: ${environment.name.toUpperCase()},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      }
  })
}
