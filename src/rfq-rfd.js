const faker = require('faker');
const { exec } = require('child_process');
const sleep = require('thread-sleep');
const fs = require('fs');
const path = require('path');


const isLoanDisbursementForeClousreSummaryJsonSame = false;

const newman = require('newman');
const notify = require('./notification');

let panNumber = '';
let BankAccount = '';

let isPanNumberSame = false;
let invoiceNumber = '';
let notificationMessage = '';
const requestName = '';
const testType = process.argv[3];
function variable()
{
  this.num = `99${faker.random.number({ min: 10000000, max: 99999999 })}`;
  this.conNum = `91${faker.random.number({ min: 10000000, max: 99999999 })}`;
  this.clientFirstName = faker.name.firstName().toLowerCase();
  this.clientLastName = faker.name.lastName();
  this.clientName = `${clientFirstName} ${clientLastName}`;
  this.contactName = faker.name.findName();
  this.contactEmail = faker.internet.email();
  this.suffix = faker.company.companySuffix();
  this.companyName = faker.company.companyName();
  this.organizationName = `${companyName} ${suffix}`;
}
variable();
let sLoanType = '';

//console.log('num: ', num);
//console.log('conNum: ', conNum);
//console.log('client Name: ', clientName);
//console.log('contact Name: ', contactName);
//console.log('contact email: ', contactEmail);
//console.log('suffix: ', suffix);
//console.log('companyName: ', companyName);
//console.log('organizationName: ', organizationName);


const childNum = `99${faker.random.number({ min: 10000000, max: 99999999 })}`;
const childConNum = `91${faker.random.number({ min: 10000000, max: 99999999 })}`;
const childClientFirstName = faker.name.firstName().toLowerCase();
const childClientLastName = faker.name.lastName();
const childClientName = `${clientFirstName} ${clientLastName}`;
const childContactName = faker.name.findName();
const childContactEmail = faker.internet.email();
const childSuffix = faker.company.companySuffix();
const childCompanyName = faker.company.companyName();
const childOrganizationName = childCompanyName;

//console.log('childNum: ', childNum);
//console.log('childConNum: ', childConNum);
//console.log('childClientName Name: ', childClientName);
//console.log('childContactName Name: ', childContactName);
//console.log('childContactEmail email: ', childContactEmail);
//console.log('childSuffix: ', childSuffix);
//console.log('childCompanyName: ', childCompanyName);
//console.log('childOrganizationName: ', childOrganizationName);

if (sLoanType === 'PURCHASE_FINANCING') {
  sLoanType = 'Purchase financing (PF)';
} else if (sLoanType === 'CAPEX_FINANCING') {
  sLoanType = '';
} else if (sLoanType === 'TERM_LOAN') {
  sLoanType = '';
} else if (sLoanType === 'BILL_DISCOUNTING') {
  sLoanType = 'Bill Discounting';
} else if (sLoanType === 'WORK_ORDER_FINANCING') {
  sLoanType = '';
} else if (sLoanType === 'POD') {
  sLoanType = '';
} else if (sLoanType === 'BG') {
  sLoanType = 'Secured Purchase Financing (SPF)';
}

function InfoToBeUpdate(sheetName, rowNumber, cellNumber, cellValue) {
  this.sheetName = sheetName,
  this.rowNumber = rowNumber,
  this.cellNumber = cellNumber,
  this.cellValue = cellValue;
}

//console.log('Running for : ', num);
//console.log('Running for conNum: ', conNum);


module.exports = (callback, environment, loanType, redisKey, collection, ofbFulfilled, test) => {
  notificationMessage = '';
  if (ofbFulfilled === 'no') {
    if (test === 'rfq-rfd-buyOut-da-dd' || test === 'rfq-rfd-marketPlace-ia-id' || test === 'rfq-rfd-buyOut-ia-id') {
      notificationMessage = `*\`RFQ-RFD: ${test.toUpperCase()}\`* ,\n ofbFulfilled: ${ofbFulfilled.toUpperCase()} , env: ${environment.name}, redisKey: ${redisKey}, jsonFile: ${collection.toUpperCase()}, Loan Type: ${loanType} no cms flow supported`;
      notify(notificationMessage);
      callback(null, null);
      return;
    }
  }

  if (loanType === 'BILL_DISCOUNTING' || loanType === 'POD') {
    notificationMessage = '';
    if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
      notificationMessage = `Oops!! You just ran - You just ran - rfq-rfd flow: ${collection.toUpperCase()}, but *\`${requestName}\`* server is down, env: ${environment.name}`;
      notificationMessage(notificationMessage);
      callback(null, null);
    } else {
      console.log(`Running for :loanType ${loanType} env ${environment.name} redisKey ${redisKey} jsonFile ${collection}`);
      notificationMessage = `*\`RFQ-RFD-IA-ID \`* ,\n  Loan Type: ${loanType} no cms flow supported for this loan type`;
      notify(notificationMessage);
      callback(null, null);
    }
    return;
  }

  if (collection === 'channel-partner' && test === 'channel-partner') {
    const clientNameForInvoiceNumber = childOrganizationName.toLowerCase();
    console.log('clientNameForInvoiceNumber:', clientNameForInvoiceNumber);
  } else {
    const clientNameForInvoiceNumber = organizationName.toLowerCase();
    console.log('clientNameForInvoiceNumber:', clientNameForInvoiceNumber);
  }

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
      },
    },
  }, (error, summary) => {
    // if (summary.run.failures.length !== 0) {
    //   callback('FAILED', summary);
    // } else {
    callback(error, summary);
    // }
  }).on('beforeRequest', (err, request) => {
    if (request.item.name === 'addLead') {
      console.log(request.request.body.raw);
    }

    const { path } = request.request.url;
    const len = request.request.url.path.length;
    let path1 = '';
    for (let i = 0; i < len; i++) {
      path1 += `/${path[i]}`;
    }
    if (request.item.name === 'status processing to underwriter' || request.item.name === 'buyerPaymentTermApprove' || request.item.name === 'createOrder' || request.item.name === 'supplierPO' || request.item.name === 'client-save-verified' || request.item.name === 'updateLspDetails' || request.item.name === 'supplierTaxInvoice' || request.item.name === 'taxInvoiceGenerate' || request.item.name === 'UpdateStatus' || request.item.name === 'updateStatusVerified' || request.item.name === 'buyerQuoteAccept' || request.item.name === 'supplierPaymentTermTmt' || request.item.name === 'supplierPaymentTermNirman' || request.item.name === 'supplierPaymentTermMahalaxmi' || request.item.name === 'approveTmtPaymentTerm' || request.item.name === 'approveNirmanPaymentTerm' || request.item.name === 'approveMahalaxmiPaymentTerm' || request.item.name === 'organisationEmployeeUpdateEmail' || request.item.name === 'Create Loan Application' || request.item.name === 'underwritingLoanRequestApproval' || request.item.name === 'submitForApproval' || request.item.name === 'Loan-> Generate Processing fee invoice' || request.item.name === 'uploadInvoice' || request.item.name === 'loanGetDisbursementDetails' || request.item.name === 'supplierPO' || request.item.name === 'minInfo' || request.item.name === 'dispatchDetails' || request.item.name === 'buyerPaymentTerm' || request.item.name === 'createOrder' || request.item.name === 'Loan-> status to Docs sent to sales' || request.item.name === 'Loan-> status to Docs sent to NBFC' || request.item.name === 'status form verified to processing') {
      sleep(5000);
    }
    if (request.item.name === 'Document-> send checklist evaluation' || request.item.name === 'update payment Status to APPROVED')
    {
      sleep(5000);
    }
    if (request.item.name === 'loanRequests' || request.item.name === 'updateAndVerifyClientInfo' || request.item.name === 'checklist')
    {
      console.log(`Sleep Start: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
      sleep(5000);
      console.log(`Sleep Finish: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
        }
    if (request.item.name === 'buyerPaymentTermApprove' || request.item.name === 'supplierPaymentTermApprove' || request.item.name === 'completeStep' || request.item.name === 'rfq-tolerance' || request.item.name === 'createOrder' || request.item.name === 'rfpUpdateStatus' || request.item.name === 'rfpPaid' || request.item.name === 'verifyAddress' || request.item.name === 'underwritingLoanRequestAcceptedByClient' || request.item.name === 'underwritingLoanRequestApproval' || request.item.name === 'Request for payment - > Paid to cancelled') {
      sleep(5000);
    }
    if (request.item.name === 'nickName') {
      const json = JSON.parse(request.request.body.raw);
      json.clientName = clientName;
      json.nickName = clientName;
      json.loanType = sLoanType;
      json.contactPersonMobile = conNum;
      json.contactPersonEmail = contactEmail;
      json.registeredMobileNumber = num;
      request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'otp') {
      request.request.url.query.members[0].value = num;
    }
    if (request.item.name === 'Send Login Otp' || request.item.name === 'otp' || request.item.name === 'loginOtp') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'partnerLogin') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'accountCreate') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'organisationEmployee'){
      json = JSON.parse(request.request.body.raw);
      json.phoneNo = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'getChildOtp') {
      request.request.url.query.members[0].value = childNum;
      request.request.url.query.members[1].value = redisKey;
    } else if (request.item.name === 'Token auth'||request.item.name === 'Request for payment - > Paid to cancelled') {
      request.request.url.query.members[0].value = redisKey;
    } else if (request.item.name === 'application-> credit rating-> Experian') {
      const json = JSON.parse(request.request.body.raw);
      json.contactPersonNumber = conNum;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'Get Otp' || request.item.name === 'getOtp') {
      request.request.url.query.members[0].value = num;
      request.request.url.query.members[1].value = redisKey;
    } else if (request.item.name === 'register on buyer app') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'mark account verified') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = conNum;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'createOrganization') {
      const json = JSON.parse(request.request.body.raw);
      json.organisationName = organizationName;
      json.mobileNo = num;
      json.name = clientName;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'Create rfq') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      json.company = organizationName;
      json.name = clientName;
      json.email = contactEmail;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'mark account as verified') {
      const json = JSON.parse(request.request.body.raw);
      json.mobile = conNum;
      json.companyName = clientName;
      json.name = contactName;
      json.email = contactEmail;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'Keep Lead') {
      const json = JSON.parse(request.request.body.raw);
      json.contactPersonName = contactName;
      json.minOrganisationDto.organisationEmployeeDtoSet[0].fullName = contactName;
      json.minOrganisationDto.organisationEmployeeDtoSet[0].email = contactEmail;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'saveAddress') {
      const json = JSON.parse(request.request.body.raw);
      json.contactPersonName = contactName;
      json.contactPersonNumber = conNum;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'Update sales agent in Lead') {
      const json = JSON.parse(request.request.body.raw);
      json.minOrganisationDto.organisationEmployeeDtoSet[0].mobileNumber = num;
      json.creator.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'underwriting -> loanRequest accepted by client' || request.item.name === 'underwriting-> loanRequest approval' || request.item.name === 'underwriting -> loanRequest') {
      if (loanType === 'CAPEX_FINANCING' || loanType === 'TERM_LOAN') {
        const json = JSON.parse(request.request.body.raw);
        json.loanSubType = 'INTEREST_REDUCING';
        json.numEmis = 5;
        json.moratorium = 3;
        request.request.body.raw = JSON.stringify(json);
      }
      if (loanType === 'PURCHASE_FINANCING') {
        const json = JSON.parse(request.request.body.raw);
        json.loanSubType = 'PF_MONTHLY';
        request.request.body.raw = JSON.stringify(json);
      }
    }
  }).on('exception', async (err, response) => {
    console.log('======ERROR:', err);
    console.log('======ERROR:', response);
  })
    .on('request', async (err, request) => { // on start of run, log to console
      if (request.item.name === 'Mapped Receipt' || request.item.name === 'client-> save client as verified' || request.item.name === 'save gst details' || request.item.name === 'Loan Disbursal->payment request detail' || request.item.name === 'underwritingLoanRequestAcceptedByClient') {
        console.log(`sleep start: ${new Date().getTime()}`);
        sleep(5000);
      }
      if (request.item.name === 'Loan->Get Processing fee Invoice number') {
        if (request.response.code <= 200 || request.response.code >= 304) {
          const responseString = request.response.stream.toString('utf8');
          const jsonData = JSON.parse(responseString);
          invoiceNumber = jsonData.data.invoiceNoStr;
          invoiceNumber = invoiceNumber.replace(/\//g, '_').toLowerCase();
          console.log(`file name${invoiceNumber}`);
          console.log('entering file rename');
          const testFolder = '.';
          fs.readdir(testFolder, (err, files) => {
            files.forEach((file) => {
              if (file.includes('Processing')) {
                fileName = `Processing_fee_${invoiceNumber}_${clientNameForInvoiceNumber}.pdf`;
                fs.rename(file, `Processing_fee_${invoiceNumber}_${clientNameForInvoiceNumber}.pdf`, (err) => {
                  if (err) console.log(`ERROR: ${err}`);
                });
                console.log('Ran Successfully');
              }
            });
          });
        }
      }
      if (request.item.name === 'Get client banks') {
        var request = JSON.parse(request.response.stream.toString());
        BankAccount = request.data[0].bankAccountId;

        const rowsToBeUpdated = [];

        rowsToBeUpdated.push(new InfoToBeUpdate('FINANCIAL SHEET', 1, 2, panNumber));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 8, 18, BankAccount));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 52, 18, BankAccount));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 96, 18, BankAccount));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 140, 18, BankAccount));

        // excelVal(rowsToBeUpdated);
      }

      if (request.item.name === 'client-save-verified') {
        const response2 = JSON.parse(request.response.stream.toString());
        panNumber = response2.data.pan;
      }

      if (request.item.name === 'Application-financial-pan-match') {
        var request = JSON.parse(request.response.stream.toString());
        clientPanNumber = request.data.pan;

        if (clientPanNumber === panNumber) {
          isPanNumberSame = true;
          console.log('Pan Is Same');
        } else {
          isPanNumberSame = false;
          console.log('Pan Is Different');
        }
      }
      if (request.item.name === 'client-> bank activate true') {
        const waitTill = new Date(new Date().getTime() + 20 * 1000);
        while (waitTill > new Date()) { }
      }
    })
    .on('beforeTest', (err, request) => {
      if (request.item.name === 'partnerConfig') {
        request.events[0].script.exec.push(`postman.setGlobalVariable("childNum", "${childNum}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childConNum", "${childConNum}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childClientName", "${childClientName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childContactName", "${childContactName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childContactEmail", "${childContactEmail}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childSuffix", "${childSuffix}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childCompanyName", "${childCompanyName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("childOrganizationName", "${childOrganizationName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("organizationName", "${childOrganizationName}");`); // for file name
      }
      if (request.item.name === 'Create Loan Application' || request.item.name === 'buyerAppHomeScreen' || request.item.name === 'approverAdminAuthToken') {
        request.events[0].script.exec.push(`postman.setGlobalVariable("clientName1", "${clientName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("contactName", "${contactName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("conNum", "${conNum}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("organizationName", "${organizationName}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("phone", "${num}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("contactEmail", "${contactEmail}");`);
        request.events[0].script.exec.push(`postman.setGlobalVariable("sLoanType", "${sLoanType}");`);
        // console.log(request.events[0].script.exec);

        if (loanType === 'CAPEX_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","CAPEX_FINANCING");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        }
        if (loanType === 'BG') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BG");');
        }
        if (loanType === 'BILL_DISCOUNTING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BILL_DISCOUNTING");');
        }
        if (loanType === 'TERM_LOAN') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","TERM_LOAN");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        } else if (loanType === 'PURCHASE_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","PURCHASE_FINANCING");');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","PF_MONTHLY");');
        } else if (loanType === 'WORK_ORDER_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","WORK_ORDER_FINANCING");');
        } else if (loanType === 'POD') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","POD");');
        }
      }
      if (request.item.name === 'Loan Disbursement-> Get Foreclosure summary') {
        request.events[0].script.exec.push(`tests["JsonCompare"] = true === ${isLoanDisbursementForeClousreSummaryJsonSame};`);
      }
      if (request.item.name === 'Application-financial-pan-match') {
        request.events[0].script.exec.push(`tests["JsonCompare"] = true === ${isPanNumberSame};`);
      }
    })
    .on('done', (err, summary) => {
      const iterations = summary.run.stats.iterations.total;
      const items = summary.run.stats.items.total;
      const totalRequests = summary.run.stats.requests.total;
      const failedAssertions = summary.run.stats.assertions.failed;
      notificationMessage = '';
      if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file') {
        notificationMessage = `Oops!! You just ran - rfq-rfd flow: ${test.toUpperCase()}, but *\`${requestName}\`* server is down, env: ${environment.name}`;
        notify(notificationMessage);
      } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
        notificationMessage = `Oops!! You just ran - rfq-rfd flow: ${test.toUpperCase()}, but redis key is not for this env: ${environment.name}`;
        notify(notificationMessage);
      }

      if (test === 'rfq-rfd-marketPlace-ia-id') {
        notificationMessage = `*\`RFQ-RFD-1: ${test}\`* it will turn to rfq-rfd-marketPlace-da-dd as buyer payment term are auto approved ,\n ofbFulfilled: ${ofbFulfilled},\n Organization Name: ${organizationName},\n env: ${environment.name},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      } else if (test === 'channel-partner' || test === 'CancelFlows' || test === 'OrderCancel' || test === 'Blacklist') {
        notificationMessage = `*\`${test.toUpperCase()}\`*,\n Organization Name: ${organizationName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      } else {
        console.log('test,', test);
        notificationMessage = `*\`RFQ-RFD-2: ${test}\`* ,\n ofbFulfilled: ${ofbFulfilled},\n Organization Name: ${organizationName},\n env: ${environment.name},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
        notify(notificationMessage);
      }
      if (testType === 'ALL_OXYZO' || testType === 'ALL_OASYS'){
        variable();
      }
      if (err || summary.error) {
        console.error(`collection run encountered an error.${JSON.stringify(summary)}`);
      } else {
        console.log('collection run completed.');
      }
    });
};
