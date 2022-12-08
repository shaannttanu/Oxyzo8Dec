
const newman = require('newman');
const sleep = require('thread-sleep');
const { exec } = require('child_process');
const Excel = require('exceljs');
const fs = require('fs');
const path = require('path');

const BankAccount = '';
const notify = require('./notification');

const requestName = '';
let panNumber = '';
let notificationMessage = '';

let isLoanDisbursementForeClousreSummaryJsonSame = false;
let isPanNumberSame = false;
let invoiceNumber = '';
const clientNameForInvoiceNunber = 'test User';
let json = {};
module.exports = (callback, environment, loanType, collection, redisKey, randomRequest) => {
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
     if (request.item.name === 'Get application details' || request.item.name === 'address' || request.item.name === 'keepLead' || request.item.name === 'updateAllDetails' || request.item.name === 'Loan->Get Disbursment details' || request.item.name === 'Loan Invoice tempUpload' || request.item.name === 'Loan Disbursement-> Journal voucher' || request.item.name === 'status processing to underwriter(Tele)' || request.item.name === 'keep' || request.item.name === 'verifyAddress' || request.item.name === 'verifyPan' || request.item.name === 'draftLead' || request.item.name === 'draftKeep') {
      console.log(`sleep start: ${new Date().getTime()}`);
      sleep(1000);
      console.log(`sleep finish: ${new Date().getTime()}`);
    }
    if (request.item.name === 'keep' || request.item.name === 'organizationVerified' || request.item.name === 'getAddress' || request.item.name === 'statusFromVerifiedProcessing' || request.item.name === 'statusProcessingUnderwriter(Tele)') {
      console.log(`sleep start: ${new Date().getTime()}`);
      sleep(3000);
      console.log(`sleep finish: ${new Date().getTime()}`);
    }
    if (request.item.name === 'save gst details' || request.item.name === 'quote-details' || request.item.name === 'submit' || request.item.name === 'Loan-> Change Address for Processing Invoice' || request.item.name === 'status processing to underwriter') {
      console.log(`sleep start: ${new Date().getTime()}`);
      sleep(1000);
      console.log(`sleep finish: ${new Date().getTime()}`);
    }
    if (request.item.name === 'updateAndVerifyClientInfo')
    {
      console.log(`Sleep Start: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
      sleep(3000);
      console.log(`Sleep Finish: ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}:${new Date().getMilliseconds()} `);
    }
    if (request.item.name === 'Get Token') {
      request.request.url.query.members[1].value = redisKey;
    }
    if (request.item.name === 'Financial-file-tempUpload') {
      while (!fs.existsSync('companyFinancials.xlsx')) {
        //
      }
      console.log('companyFinancials now exists');
    }
    if (request.item.name === 'application-> credit rating-> Experian') {
      json = JSON.parse(request.request.body.raw);
      json.contactPersonNumber = num;
      request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'underwriting -> loanRequest accepted by client' || request.item.name === 'underwriting -> loanRequest accepted by client') {
      if (loanType === 'CAPEX_FINANCING' || loanType === 'TERM_LOAN' || loanType === 'DROPLINE_OD' || loanType === 'INVOICE_DISCOUNTING_OPEN') {
        json = JSON.parse(request.request.body.raw);
        json.loanSubType = 'INTEREST_REDUCING';
        json.numEmis = 5;
        json.moratorium = 3;
        json.deductAdvanceEMIs = true;
        json.deductBPI = true;
        json.deductInsurancePremium = true;
        json.deductPF = true;
        json.disbursalAmount = 2910296;
        json.disbursementDate = 1552415400000;
        json.emiAmount = 347376;
        json.emiDate = 1554402600000;
        json.insuranceAmount = 0;
        json.insuranceRequired = false;
        json.breakPeriodInterest = 18904;
        json.loanSecurityAmount = 100000;
        json.loanSecurityType = 'MACHINERY';
        json.numAdvanceEMIs = 0;
        json.overrideDisbursalAmount = false;
        request.request.body.raw = JSON.stringify(json);
      }
    }
    if (loanType === 'PURCHASE_FINANCING') {
       // var json = JSON.parse(request.request.body.raw);
      // json.loanSubType = "PF_MONTHLY";
      // request.request.body.raw = JSON.stringify(json);
    }
    if (request.item.name === 'loginOtp') {
      console.log('redisKey', redisKey);
      request.request.url.query.members[1].value = redisKey;
    }
  })
    .on('request', async (err, request) => {
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
                fs.rename(file, `Processing_fee_${invoiceNumber}_${clientNameForInvoiceNunber}.pdf`, (err) => {
                  if (err) console.log(`ERROR: ${err}`);
                });
                console.log(`Ran Successfully${invoiceNumber}`);
              }
            });
          });
        }
      }
      if (request.item.name === 'actions' || request.item.name === 'client-> save client as verified' || request.item.name === 'save gst details' || request.item.name === 'statusFromVerifiedProcessing' || request.item.name === 'client-> save client as verified' || request.item.name === 'mark account as verified') {
        console.log(`sleep start: ${new Date().getTime()}`);
        sleep(1000);
        console.log(`sleep finish: ${new Date().getTime()}`);
      }
      if (request.item.name === 'mark account as verified' || request.item.name === 'Loan Disbursement-> Get financial Account Id for BALAJEE FABRICATORS' || request.item.name === 'Get application details') {
        console.log(`sleep start: ${new Date().getTime()}`);
        sleep(1000);
        console.log(`sleep finish: ${new Date().getTime()}`);
      }
      if (request.item.name === 'Loan Disbursement-> Get Foreclosure summary') {
        const loanId = request.request.url.path[request.request.url.path.length - 1];
        let responseJsonData = JSON.stringify(JSON.parse(request.response.stream.toString()));
        try {
          const data1 = fs.readFileSync('jsonCompare.json', 'utf8');
          const jsonFormattedData = JSON.parse(data1.toString());
          jsonFormattedData.data.loanId = loanId;
          const dataInJson = JSON.stringify(jsonFormattedData);
          responseJsonData = responseJsonData.replace(/\\/g, '').replace(new RegExp(' ', 'g'), '');

          if (responseJsonData.toLowerCase() === dataInJson.toLowerCase()) {
            isLoanDisbursementForeClousreSummaryJsonSame = true;
            // console.log('Content Is Same' + responseJsonData);
          } else {
            isLoanDisbursementForeClousreSummaryJsonSame = false;
          }
          console.log(isLoanDisbursementForeClousreSummaryJsonSame);
        } catch (e) {
          console.log('Error:', e.stack);
        }
      }

      function InfoToBeUpdate(sheetName, rowNumber, cellNumber, cellValue) {
        this.sheetName = sheetName,
        this.rowNumber = rowNumber,
        this.cellNumber = cellNumber,
        this.cellValue = cellValue;
      }


      if (request.item.name === 'Get client banks') {
        var response = JSON.parse(request.response.stream.toString());
        var BankAccount = response.data[0].bankAccountId;

        const rowsToBeUpdated = [];

        rowsToBeUpdated.push(new InfoToBeUpdate('FINANCIAL SHEET', 1, 2, panNumber));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 8, 18, BankAccount));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 52, 18, BankAccount));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 96, 18, BankAccount));
        rowsToBeUpdated.push(new InfoToBeUpdate('BANKING ANALYSIS', 140, 18, BankAccount));

        excelVal(rowsToBeUpdated);
      }

      if (request.item.name === 'client-save-verified') {
        // console.log(request.item.name);
        const response2 = JSON.parse(request.response.stream.toString());
        panNumber = response2.data.pan;
        // console.log("Data: "+ response2.data);
        console.log(`PAN:${response2.data.pan}`);
      }

      if (request.item.name === 'Application-financial-pan-match') {
        var response = JSON.parse(request.response.stream.toString());
        clientPanNumber = request.data.pan;

        if (clientPanNumber === panNumber) {
          isPanNumberSame = true;
          console.log('Pan Is Same');
        } else {
          isPanNumberSame = false;
          console.log('Pan Is Different');
        }
      }
    })
    .on('beforeTest', async (err, request) => {
      if(request.item.name === 'create'){
        if (loanType === 'CAPEX_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","CAPEX_FINANCING");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        }
        if (loanType === 'BILL_DISCOUNTING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BILL_DISCOUNTING");');
        }
        if (loanType === 'TERM_LOAN') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","TERM_LOAN");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
	}
	  else if (loanType === 'DROPLINE_OD') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","DROPLINE_OD");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        } else if (loanType === 'INVOICE_DISCOUNTING_OPEN') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","INVOICE_DISCOUNTING_OPEN");');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        }
          else if (loanType === 'SECURED_PURCHASE_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BG");');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","PF_MONTHLY");');
        } else if (loanType === 'WCDL') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","WCDL");');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","PF_MONTHLY");');
        }else if (loanType === 'PURCHASE_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","PURCHASE_FINANCING");');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","PF_MONTHLY");');
        } else if (loanType === 'WORK_ORDER_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","WORK_ORDER_FINANCING");');
        } else if (loanType === 'POD') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","POD");');
        }
      }
      if (request.item.name === 'Create Loan Application') {
        if (loanType === 'CAPEX_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","CAPEX_FINANCING");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        }
        if (loanType === 'BILL_DISCOUNTING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BILL_DISCOUNTING");');
        }
        if (loanType === 'TERM_LOAN') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","TERM_LOAN");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
	}
	  else if (loanType === 'DROPLINE_OD') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","DROPLINE_OD");');
          request.events[0].script.exec.push('postman.setGlobalVariable("numEmis",5);');
          request.events[0].script.exec.push('postman.setGlobalVariable("moratorium",3)');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","INTEREST_REDUCING");');
        } 
          else if (loanType === 'SECURED_PURCHASE_FINANCING') {
          request.events[0].script.exec.push('postman.setGlobalVariable("loanType","BG");');
          request.events[0].script.exec.push('postman.setGlobalVariable("loanSubType","PF_MONTHLY");');
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
      if (requestName === 'cms' || requestName === 'oxyzo' || requestName === 'file' || requestName === 'scheduler') {
        notificationMessage = `Oops!! You just ran - Registered-User scenario on env: ${environment.name}, but *\`${requestName.toUpperCase()}\`* server is down`;
      notify(notificationMessage);
      } else if (requestName === 'Get Token') {
        notificationMessage = `Oops!! You just ran - Registered-User scenario, but redis key is not for this, env: ${environment.name}`;
      notify(notificationMessage);
      } else {
        notificationMessage = `*\`Registered user scenario:\`* \n Client Name: ${clientNameForInvoiceNunber.toUpperCase()},\n env: ${environment.name.toUpperCase()},\n Loan Type: ${loanType},\n Iterations: ${iterations},\n Items: ${items},\n Total requests: ${totalRequests},\n Failed Assertions: ${failedAssertions}`;
      notify(notificationMessage);
	}
    });

function excelVal(rowsToBeUpdatedInfo) {
  const workbook = new Excel.Workbook();
  workbook.xlsx.readFile('companyFinancials.xlsx').then(() => {
    rowsToBeUpdatedInfo.forEach((rowDetail) => {
      const worksheet = workbook.getWorksheet(rowDetail.sheetName);
      const row = worksheet.getRow(rowDetail.rowNumber);
      row.getCell(rowDetail.cellNumber).value = rowDetail.cellValue;
      row.commit();
    });
    workbook.xlsx.writeFile('companyFinancials.xlsx').then(() => {
    });
  });
}
};
