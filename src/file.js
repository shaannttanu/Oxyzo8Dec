const sleep = require('thread-sleep');
const fs = require('fs');
const pdf = require('html-pdf');
const path = require('path');
const nodemailer = require('nodemailer');

let orderId = null;
let postPaidOrderId = null;
let notificationMessage = '';

const newman = require('newman');
const { exec } = require('child_process');
const notify = require('./notification');

module.exports = (callback, environment, collection, redisKey, randomRequest) => {
  newman.run({
    collection: require(`../collections/${collection}.json`),
    iterationData: [{ var: 'data', var_beta: 'other_val' }],
    globals: {

    },
    environment,
    reporters: 'htmlextra',
    reporter: {
      htmlextra: {
        export: path.join(__dirname, 'temp/report.html'),
       darkTheme: true
      },
    },
  }, (err, summary) => {
    if (err) { throw err; }
    console.info('collection run complete!');
  }).on('start', (err, args) => {
    console.log('running a collection...');
  }).on('beforeTest', (err, request) => {
    if (request.item.name === 'createAutomationAccount') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("randomRequest", "${randomRequest}");`);
    }
  }).on('beforeRequest', (err, request) => {
    if (request.item.name === 'rfdrfq' || request.item.name === 'summary' || request.item.name === 'postPaidSummary') {
      console.log(`sleep start: ${new Date().getTime()}`);
      sleep(50000);
      console.log(`sleep finish: ${new Date().getTime()}`);
    }
  })
    .on('request', async (err, request) => {
      if (request.item.name === 'summary' || request.item.name === 'postPaidSummary') {
        const response = JSON.parse(request.response.stream.toString());
        if (request.item.name === 'summary') {
          orderId = response.data.orderId;
        }
        if (request.item.name === 'postPaidSummary') {
          postPaidOrderId = response.data.orderId;
        }
      }
    })
    .on('done', (err, summary) => {
      const iterations = summary.run.stats.iterations.total;
      const items = summary.run.stats.items.total;
      const totalRequests = summary.run.stats.requests.total;
      const failedAssertions = summary.run.stats.assertions.failed;

      if (randomRequest === 'oxyzoFacility') {
        notificationMessage = `Running for: Lenders module in oxyzo, env: ${environment.name.toUpperCase()}, Iterations: ${iterations}, Items: ${items}, Total requests: ${totalRequests}, Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      }
      if (collection === 'diesel') {
        notificationMessage = `Running for: ${collection.toUpperCase()}, pre-paid orderId: ${orderId}\n, post-paid orderId: ${postPaidOrderId}\n, env: ${environment.name.toUpperCase()}, Iterations: ${iterations}, Items: ${items}, Total requests: ${totalRequests}, Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      } else {
        notificationMessage = `Running for: ${collection.toUpperCase()}, env: ${environment.name.toUpperCase()}, Iterations: ${iterations}, Items: ${items}, Total requests: ${totalRequests}, Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      }
    });
};
