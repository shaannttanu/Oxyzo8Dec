const faker = require('faker');

const Excel = require('exceljs');
const sleep = require('thread-sleep');
const fs = require('fs');
const path = require('path');


const newman = require('newman');
const notify = require('./notification');

const isLoanDisbursementForeClousreSummaryJsonSame = false;

let panNumber = '';
let BankAccount = '';
let sLoanType = '';
let notificationMessage = '';

let isPanNumberSame = false;
let requestName = '';
let invoiceNumber = '';
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
//console.log('contact Name: ', contactName);
//console.log('contact email: ', contactEmail);
//console.log('client Name: ', clientName);
//console.log('suffix: ', suffix);
//console.log('companyName: ', companyName);
//console.log('organizationName: ', organizationName);

const childNumber = `99${faker.random.number({ min: 10000000, max: 99999999 })}`;
const childConNum = `91${faker.random.number({ min: 10000000, max: 99999999 })}`;
const childClientFirstName = faker.name.firstName().toLowerCase();
const childClientLastName = faker.name.lastName();
const childClientName = `${clientFirstName} ${clientLastName}`;
const childContactName = faker.name.findName();
const childContactEmail = faker.internet.email();
const childSuffix = faker.company.companySuffix();
const childCompanyName = faker.company.companyName();
const childOrganizationName = childCompanyName;

//console.log('childNumber: ', childNumber);
//console.log('childConNum: ', childConNum);
//console.log('childClientName Name: ', childClientName);
//console.log('childContactName Name: ', childContactName);
//console.log('childContactEmail email: ', childContactEmail);
//console.log('childSuffix: ', childSuffix);
//console.log('childCompanyName: ', childCompanyName);
//console.log('childOrganizationName: ', childOrganizationName);

if(sLoanType==='ALL'){
  sLoanType = 'PURCHASE_FINANCING';
}else if (sLoanType === 'PURCHASE_FINANCING') {
  sLoanType = 'PURCHASE_FINANCING';
}else if (sLoanType === 'TERM_LOAN_3') {
  sLoanType = 'TERM_LOAN_3';
} 
else if (sLoanType === 'CAPEX_FINANCING') {
  sLoanType = '';
} else if (sLoanType === 'TERM_LOAN') {
  sLoanType = '';
}
else if (sLoanType === 'WCDL') {
  sLoanType = 'Short Term Revolving Finance';
}else if (sLoanType === 'BILL_DISCOUNTING') {
  sLoanType = 'Bill Discounting';
} else if (sLoanType === 'WORK_ORDER_FINANCING') {
  sLoanType = '';
} else if (sLoanType === 'POD') {
  sLoanType = 'POD';
} else if (sLoanType === 'BG') {
  sLoanType = 'Secured Purchase Financing (SPF)';
} else if (sLoanType === 'SSPF') {
  sLoanType = 'SEMI_SECURED_FINANCING';
} else if (sLoanType === 'DROPLINE_OD') {
  sLoanType = '';
} else if (sLoanType === 'INVOICE_DISCOUNTING_OPEN') {
  sLoanType = '';
}else if(sLoanType === 'SEMI_SECURED_FINANCING'){
  sLoanType = 'SEMI_SECURED_FINANCING';
}
const clientNameForInvoiceNumber = organizationName.toLowerCase();

function InfoToBeUpdate(sheetName, rowNumber, cellNumber, cellValue) {
  this.sheetName = sheetName,
  this.rowNumber = rowNumber,
  this.cellNumber = cellNumber,
  this.cellValue = cellValue;
}

//console.log('Running for : ', num);
//console.log('Running for conNum: ', conNum);

/**
 * Postman test to execute given collection of APIS.
 * @param callback    success/failure callback function
 * @param environment postman environment json
 */
module.exports = (callback, environment, loanType, redisKey, collection, creditInstrument, tds) => {
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
  }, (error, summary) => {
    // if (summary.run.failures.length !== 0) {
    //   callback('FAILED', summary);
    // } else {
    callback(error, summary);
    // }
  }).on('beforeRequest', (err, request) => {
    requestName = request.item.name;
    const { path } = request.request.url;
    const len = request.request.url.path.length;
    let path1 = '';
    for (let i = 0; i < len; i++) {
      path1 += `/${path[i]}`;
    }
    sLoanType = loanType;
    if (request.item.name === 'companyBankStatement' || request.item.name === 'underwriting -> loanRequest approval' || request.item.name === 'underwritingLoanRequest' || request.item.name === 'requestForPayments' || request.item.name === 'updateTransporterShipmentPayment' || request.item.name === 'updateStatusRfp' || request.item.name === 'save gst details' || request.item.name === 'Loan Invoice tempUpload' || request.item.name === 'Update Loan Application' || request.item.name === 'getPdFormId' || request.item.name === 'draftLeadKeep' || request.item.name === 'submitForApproval' || request.item.name === 'verified' || request.item.name === 'underwritingLoanRequest' || request.item.name === 'loanRequests' || request.item.name === 'getFinancialAccountIdForBALAJEEFABRICATORS' || request.item.name === 'submit' || request.item.name === 'financierInfo' || request.item.name === 'createShipment' || request.item.name === 'updateStatusCreditInstrument' || request.item.name === 'taxInvoiceGenerate' || request.item.name === 'createOrder' || request.item.name === 'minInfo'  || request.item.name === 'updateStatusPaymentRequest'|| request.item.name === 'researchKeepLead' || request.item.name === 'verify Branch_Region'||request.item.name === 'status processing to underwriter') {
      console.log(`Sleep Start: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
      console.log(request.request.body.raw);
      sleep(5000);
      console.log(`Sleep Finish: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
        }
    if (request.item.name === 'loanRequests'|| request.item.name === 'TempUpload2' || request.item.name === 'status processing to underwriter(Tele)'|| request.item.name === 'updateAndVerifyClientInfo'|| request.item.name === 'checklist' || request.item.name === 'Document-> send checklist evaluation'|| request.item.name === 'Loan Disbursal status-> pending disbursment')
    {
      console.log(`Sleep Start: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
      sleep(1000);
      console.log(`Sleep Finish: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
    }
    if (request.item.name === 'updateAndVerifyClientInfo')
    {
      console.log(`Sleep Start: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
      sleep(1000);
      console.log(`Sleep Finish: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
        }

        
    if (request.item.name === 'Get Otp' || request.item.name === 'getOtp') {
      request.request.url.query.members[0].value = num;
      request.request.url.query.members[1].value = redisKey;
    }
    if (request.item.name === 'getNodeOtp') {
      request.request.url.query.members[1].value = redisKey;
    }
    let json = {};
     if(request.item.name === 'addContactEmail'){
       json = JSON.parse(request.request.body.raw);
       json.mobile = num ;
       request.request.body.raw = JSON.stringify(json);
     }
     if (request.item.name === 'organisationEmployee'){
      json = JSON.parse(request.request.body.raw);
      json.phoneNo = childNumber;
      request.request.body.raw = JSON.stringify(json);
    }
    if(request.item.name === 'createnewLoanApplication'){
      json = JSON.parse(request.request.body.raw);
      json.loanType = sLoanType;
      request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'Send Login Otp' || request.item.name === 'otp' || request.item.name === 'sendLoginOtp') {
      json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    }else if (request.item.name === 'Employee Login Otp') {
      json = JSON.parse(request.request.body.raw);
      json.mobile = childNumber;
      request.request.body.raw = JSON.stringify(json);
    }else if (request.item.name === 'create Anchor Organization') {
      json = JSON.parse(request.request.body.raw);
      json.mobileNo = childNumber;
      json.accountLoginDto.mobile = childNumber;
      json.organisationName = childOrganizationName;
      request.request.body.raw = JSON.stringify(json);
    } 
      else if (request.item.name === 'getOtpPrimaryEmployee') {
      request.request.url.query.members[0].value = conNum;
      request.request.url.query.members[1].value = redisKey;
    }
      else if (request.item.name === 'getOtpAnchorEmployee') {
      request.request.url.query.members[0].value = childNumber;
      request.request.url.query.members[1].value = redisKey;

    } else if (request.item.name === 'accountCreate') {
      json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'getChildOtp') {
      request.request.url.query.members[0].value = childNum;
      request.request.url.query.members[1].value = redisKey;
    } else if (request.item.name === 'Token auth') {
      request.request.url.query.members[0].value = redisKey;
    } else if (request.item.name === 'storePanInRedis') {
      request.request.url.query.members[0].value = redisKey;
    } else if (request.item.name === 'Employee Get Otp') {
      request.request.url.query.members[0].value = childNumber;
      request.request.url.query.members[1].value = redisKey;
    } else if (request.item.name === 'Financial-file-tempUpload') {
      while (!fs.existsSync('companyFinancials.xlsx')) {
        //
      }
      console.log('companyFinancials now exists');
    } else if (request.item.name === 'application-> credit rating-> Experian') {
      json = JSON.parse(request.request.body.raw);
      json.contactPersonNumber = conNum;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'register on buyer app') {
      json = JSON.parse(request.request.body.raw);
      json.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'mark account verified') {
      json = JSON.parse(request.request.body.raw);
      json.mobile = conNum;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'createOrganization') {
      json = JSON.parse(request.request.body.raw);
      json.orgName = organizationName;
      json.contactMobile = num;
      json.contactName = clientName;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'AddDSA') {
      json = JSON.parse(request.request.body.raw);
      json.minOrganisationDto.organisationEmployeeDtoSet[0].fullName = childContactName;
      json.minOrganisationDto.organisationEmployeeDtoSet[0].mobileNumber = childNumber;
      json.minOrganisationDto.organisationEmployeeDtoSet[0].emails[0] = childContactEmail;
      json.minOrganisationDto.name = childOrganizationName;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'Keep Lead') {
      json = JSON.parse(request.request.body.raw);
      json.minOrganisationDto.organisationEmployeeDtoSet[0].fullName = contactName;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'save address' || request.item.name === 'saveAddress') {
      json = JSON.parse(request.request.body.raw);
      json.contactPersonName = contactName;
      json.contactPersonNumber = conNum;
      request.request.body.raw = JSON.stringify(json);
    }else if (request.item.name === 'Create Loan Application') {
      json = JSON.parse(request.request.body.raw);
      json.contactPersonNumber = conNum;
      json.contactPersonName = contactName;
      json.clientName = clientName;
      json.contactPersonEmail = contactEmail;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'save address') {
      json = JSON.parse(request.request.body.raw);
      json.contactPersonName = contactName;
      json.contactPersonNumber = conNum;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'Update sales agent in Lead') {
      json = JSON.parse(request.request.body.raw);
      json.minOrganisationDto.organisationEmployeeDtoSet[0].mobileNumber = num;
      json.creator.mobile = num;
      request.request.body.raw = JSON.stringify(json);
    } else if (request.item.name === 'underwriting -> loanRequest accepted by client' || request.item.name === 'underwriting -> loanRequest approval' || request.item.name === 'underwritingLoanRequest') {
      if (loanType === 'CAPEX_FINANCING' || loanType === 'TERM_LOAN' || loanType === 'TERM_LOAN_3' || loanType === 'DROPLINE_OD' || loanType === 'WCDL') {
        json = JSON.parse(request.request.body.raw);
        json.loanSubType = 'INTEREST_REDUCING';
        json.numEmis = 24;
        json.moratorium = 3;
        json.emiType = "MONTHLY";
        json.deductAdvanceEMIs = true;
        json.deductBPI = true;
        json.deductInsurancePremium = true;
        json.deductPF = true;
        json.disbursalAmount = 2910296;
        json.disbursementDate = 1552415400000;
        json.emiAmount = 347376;
        json.emiDate = 1554402600000;
        json.insuranceAmount = 0;
        json.insuranceRequired = true;
        json.breakPeriodInterest = 18904;
        json.loanSecurityAmount = 100000;
        json.loanSecurityType = 'MACHINERY';
        json.numAdvanceEMIs = 0;
        json.overrideDisbursalAmount = false;
        request.request.body.raw = JSON.stringify(json);
      }
      if (loanType === 'PURCHASE_FINANCING') {
        json = JSON.parse(request.request.body.raw);
        json.loanSubType = 'PF_MONTHLY';
        request.request.body.raw = JSON.stringify(json);
      }
    }
  }).on('request', async (err, request) => { // on start of run, log to console
    if (request.item.name === 'Loan->Get Processing fee Invoice number') {
      if (request.response.code <= 200 || request.response.code >= 304) {
        const responseString = request.response.stream.toString('utf8');
        const jsonData = JSON.parse(responseString);
        invoiceNumber = jsonData.data.invoiceNoStr;
        invoiceNumber = invoiceNumber.replace(/\//g, '_').toLowerCase();
        console.log(`file name${invoiceNumber}`);
        console.log('entering file rename');
        const testFolder = '.';
        const fs = require('fs');
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
    if (request.item.name === 'actions' || request.item.name === 'client-> save client as verified' || request.item.name === 'save gst details' || request.item.name === 'organisationEmployeeUpdate') {
      if (request.item.name === 'requestForPayments' || request.item.name === 'client-> save client as verified' || request.item.name === 'updateTransporterShipmentPayment' || request.item.name === 'updateStatusRfp' || request.item.name === 'submitForApproval' || request.item.name === 'submit' || request.item.name === 'updateStatusPaymentRequest' || request.item.name === 'updateShipmentAgentPayment' || request.item.name === 'underwritingLoanRequest' || request.item.name === 'updateShipmentAgentPayment') {
        console.log(`Sleep Start: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
        sleep(1000);
        console.log(`Sleep Finish: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);   
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
      while (waitTill > new Date()) {
        //
      }
    } else if (request.item.name === 'Application-> pdform underwriter') {
      //
    }
  }).on('beforeTest', (err, request) => {
    if (collection === 'node-subnode' && request.item.name === 'addOxyzoSuperAdmin') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("num", "${num}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("client", "${clientName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactName", "${contactName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactEmail", "${contactEmail}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("organizationName", "${organizationName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("conNum", "${conNum}");`);
    }
    if (collection === 'Anchor' && request.item.name === 'addOxyzoSuperAdmin') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("num", "${num}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("client", "${clientName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactName", "${contactName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactEmail", "${contactEmail}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("organizationName", "${organizationName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("conNum", "${conNum}");`);
    }
    if (request.item.name === 'createApproverAccount') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactEmail", "${contactEmail}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactName", "${contactName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("conNum", "${conNum}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("client", "${clientName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("num", "${num}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("invoiceType", "${tds}");`);
    }
    if (request.item.name === 'getLeadDetails') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactEmail", "${contactEmail}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactName", "${contactName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("conNum", "${conNum}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("clientName", "${clientName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("randomMobile", "${num}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("creditInstrument", "${creditInstrument}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("tds", "${tds}");`);
    }
    if (request.item.name === 'Create Loan Application') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("clientName", "${clientName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("conNum", "${conNum}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("organizationName", "${organizationName}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("randomMobile", "${num}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("contactEmail", "${contactEmail}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("sLoanType", "${sLoanType}");`);
      request.events[0].script.exec.push(`postman.setGlobalVariable("limit", "${creditInstrument}");`);

      if (loanType === 'CAPEX_FINANCING') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","CAPEX_FINANCING");');
        request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
        request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
        request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
      }
      if (loanType === 'BG') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BG");');
      }
      if (loanType === 'WCDL') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","WCDL");');
      }
      if (loanType === 'SSPF') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","SEMI_SECURED_FINANCING");');
      }
      if (loanType === 'BILL_DISCOUNTING') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BILL_DISCOUNTING");');
      }
      if (loanType === 'TERM_LOAN_3') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","TERM_LOAN_3");');
        request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",24);');
        request.events[0].script.exec.push('postman.setGlobalVariable("emiType","MONTHLY");');
        request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
        request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
      }
      if (loanType === 'TERM_LOAN') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","TERM_LOAN");');
        request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",24);');
        request.events[0].script.exec.push('postman.setGlobalVariable("emiType","MONTHLY");');
        request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
        request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
      }
	else if (loanType === 'DROPLINE_OD') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","DROPLINE_OD");');
        request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
        request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
        request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
      }
	else if (loanType === 'INVOICE_DISCOUNTING_OPEN') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","INVOICE_DISCOUNTING_OPEN");');
      }
	else if (loanType === 'PURCHASE_FINANCING') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","PURCHASE_FINANCING");');
        request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","PF_MONTHLY");');
      } else if (loanType === 'WORK_ORDER_FINANCING') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","WORK_ORDER_FINANCING");');
      } else if (loanType === 'POD') {
        request.events[0].script.exec.push('postman.setGlobalVariable("loanType","POD");');
      }
    }
    if (request.item.name === 'Create Loan Application' || request.item.name === 'Loan-> Generate Processing fee invoice') {
      request.events[0].script.exec.push(`postman.setGlobalVariable("clientName", "${clientName}");`);
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
      if (collection === 'rfqCredit') {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - Order using credit Instrument: ${creditInstrument}on env: ${environment}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - Order using credit Instrument: ${creditInstrument}, but redis key is not for this, env: ${environment}`;
          notify(notificationMessage);
        } else if (tds === 'ADHOC_INVOICE' || tds === 'ADHOC_INVOICE_INTEREST' || tds === 'ADHOC_INVOICE_SERVICE') {
          notificationMessage = `*\`${tds}\`*: \n${creditInstrument}, Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`Order using credit Instrument\`*: \n${creditInstrument}, Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        }
      } else if (collection === 'multipleLC') {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - Multiple Order using credit Instrument: ${creditInstrument}on env: ${environment}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - Multiple Order using credit Instrument: ${creditInstrument}, but redis key is not for this, env: ${environment}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`Multiple Order using credit Instrument\`*: \n${creditInstrument}, Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        }
      } else if (collection === 'tds-lsp-agent') {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - ${tds} flow on env: ${environment}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - ${tds} flow, but redis key is not for this, env: ${environment}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`${tds} flow\`*,\n Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        }
      } else if (collection === 'node-subnode' || collection ==='Anchor') {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - ${tds} flow on env: ${environment.name}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - ${collection
          } flow, but redis key is not for this, env: ${environment.name}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`${collection
          } flow\`*,\n Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        }
      } else if (collection === 'DSA') {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - DSA flow on env: ${environment.name}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - ${collection
          } flow, but redis key is not for this, env: ${environment.name}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`${collection
          } flow\`*,\n Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        }
	}else if (collection === 'leadLms' || collection === 'multipleLogin') {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - Lead from lms and cibil consent, flow on env: ${environment.name}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - ${collection
          } flow, but redis key is not for this, env: ${environment.name}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`${collection
          } flow\`*,\n Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        }
      } else {
        if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
          notificationMessage = `Oops!! You just ran - New user scenario: ${loanType} on env: ${environment.name}, but *\`${requestName}\`* server is down`;
          notify(notificationMessage);
        } else if (requestName === 'Get Otp' || requestName === 'getOtp') {
          notificationMessage = `Oops!! You just ran - New user scenario: Loan Type: ${loanType}, but redis key is not for this, env: ${environment.name}`;
          notify(notificationMessage);
        } else
        if (creditInstrument === 'adhoc-limit') {
          notificationMessage = `*\`Adhoc-limit created\`*,\n Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
          notify(notificationMessage);
        } else {
          notificationMessage = `*\`New user scenario\`*,\n Client Name: ${clientName.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;   
          notify(notificationMessage);
      }
    }
    });
    if (testType === 'ALL_OXYZO' || testType === 'ALL_OASYS'){
      variable();
    }
  function excelVal(rowsToBeUpdatedInfo) {
    const workbook = new Excel.Workbook();
    workbook.xlsx.readFile('companyFinancials.xlsx').then(() => {
      rowsToBeUpdatedInfo.forEach((rowDetail) => {
        const worksheet = workbook.getWorksheet(rowDetail.sheetName);
        const row = worksheet.getRow(rowDetail.rowNumber);
        row.getCell(rowDetail.cellNumber).value = rowDetail.cellValue; // B1's value set to Pan card number

        row.commit();
      });

      workbook.xlsx.writeFile('companyFinancials.xlsx').then(() => {
      });
    });
  }
};
