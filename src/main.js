// Dependencies
const async = require('async');

const redis = require('./redis-key');
const commonTest = require('./common');
const newUserTest = require('./new-user');
const fileTest = require('./file');
const rfqRfdTest = require('./rfq-rfd');
const BidAssist = require('./BidAssist');
const registeredUserTest = require('./registered-user');

const configName = process.argv[2];
console.log('configName: ', configName);
const postmanEnv = require(`../config/${configName}.json`); // eslint-disable-line import/no-dynamic-require

const testType = process.argv[3];

const redisKey = redis(configName);
console.log(redisKey);
// Set of tests to execute.
const TESTS = [];

// Always test common
if (testType !== 'BidAssist'){
  TESTS.push(callback => commonTest(callback, postmanEnv));
}
switch (testType) {
  case 'ALL_OASYS':
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'rfq-rfd-flow', 'yes', 'rfq-rfd-buyOut-ia-id'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'rfq-rfd-da-dd', 'yes', 'rfq-rfd-buyOut-da-dd'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'PureMarketPlace-SupplierInvoice','PureMarketPlace-SupplierInvoice'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'PureMarketPlace-BuyerPO','PureMarketPlace-BuyerPO'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'rfq-rfd-mp-y-ia-id', 'yes', 'rfq-rfd-marketPlace-ia-id'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'rfq-rfd-mp-y-da-dd', 'yes', 'rfq-rfd-marketPlace-da-dd'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'UnlockRFQ', 'yes', 'UnlockRFQ'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'NA', redisKey, 'BuyOut-POL', 'POL-Loan-BuyOut-Order'));
    // TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'CancelFlows', 'yes', 'CancelFlows'));  
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'RfqDeclined', 'yes', 'RfqDeclined'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'Blacklist', 'yes', 'Blacklist'));
    // TESTS.push(callback => newUserTest(callback, postmanEnv,'PURCHASE_FINANCING', redisKey, 'DSA'));
    TESTS.push(callback => newUserTest(callback, postmanEnv,'PURCHASE_FINANCING', redisKey, 'rfqCredit', 'LC', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv,'PURCHASE_FINANCING', redisKey, 'leadLms'));
    break;
  case 'ALL_OXYZO':
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'TERM_LOAN', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'BG', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'WORK_ORDER_FINANCING', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'CAPEX_FINANCING', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'BILL_DISCOUNTING', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'POD', redisKey, 'oxyzo', 'no'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'DROPLINE_OD', redisKey, 'oxyzo', 'no'));    TESTS.push(callback => newUserTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'node-subnode', 'no'));
    TESTS.push(callback => rfqRfdTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'channel-partner', 'no', 'channel-partner'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'DSA'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'leadLms'));
    TESTS.push(callback => newUserTest(callback, postmanEnv, 'PURCHASE_FINANCING', redisKey, 'oxyzo', 'adhoc-limit'));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'PURCHASE_FINANCING', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'TERM_LOAN', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'BG', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'WORK_ORDER_FINANCING', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'CAPEX_FINANCING', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'BILL_DISCOUNTING', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'POD', 'registered-user', redisKey));
    TESTS.push(callback => registeredUserTest(callback, postmanEnv, 'DROPLINE_OD', 'registered-user', redisKey));    
    TESTS.push(callback => fileTest(callback, postmanEnv, 'oxyzoLinks', redisKey, 'oxyzoFacility'));
    TESTS.push(callback => fileTest(callback, postmanEnv, 'oxyzoLinks', redisKey, 'no'));
    break;
  case 'BidAssist':
    TESTS.push(callback => BidAssist(callback, postmanEnv, 'BidAssist', redisKey, 'BidAssist'));
    break;
  case 'CUSTOM':
    const loanType = process.argv[4];
    const testName = process.argv[5];
    switch (testName) {
      case 'PureMarketplace-SupplierInvoice':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'PureMarketPlace-SupplierInvoice','PureMarketPlace-SupplierInvoice'));
        break;
      case 'PureMarketplace-BuyerPO':
          TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'PureMarketPlace-BuyerPO','PureMarketPlace-BuyerPO'));
        break;
      case 'Ofb-Marketplace-Order':
          TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'Ofb-Marketplace-Order','Ofb-Marketplace-Order'));
      break;
      case 'rfq':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq', 'yes', 'rfq'));
        break;
      case 'create-new-verified-org':
          TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'CreateVerifiedOrg', 'create-new-verified-org'));
        break;
      case 'create-termloan3-or-invoicediscountingopen-new-user':
          TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'For New client(Term Loan3 and Invoice Discounting Open)', 'no'));
        break;   
      case 'POL-Loan-BuyOut-Order':
          TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'BuyOut-POL', 'POL-Loan-BuyOut-Order'));
        break;
      case 'rfq-rfd-buyOut-ia-id-y':
       TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq-rfd-flow', 'yes', 'rfq-rfd-buyOut-ia-id'));
        break;
      case 'rfq-rfd-buyOut-da-dd-y':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq-rfd-da-dd', 'yes', 'rfq-rfd-buyOut-da-dd'));
        break;
      case 'rfq-rfd-marketPlace-ia-id-y':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq-rfd-mp-y-ia-id', 'yes', 'rfq-rfd-marketPlace-ia-id'));
        break;
      case 'rfq-rfd-marketPlace-ia-id-n':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq-rfd-mp-y-ia-id', 'no', 'rfq-rfd-marketPlace-ia-id'));
        break;
      case 'rfq-rfd-marketPlace-da-dd-y':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq-rfd-mp-y-da-dd', 'yes', 'rfq-rfd-marketPlace-da-dd'));
        break;
      case 'rfq-rfd-marketPlace-da-dd-n':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'rfq-rfd-mp-n-da-dd', 'no', 'rfq-rfd-marketPlace-da-dd'));
        break;
      case 'channel-partner':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'channel-partner', 'yes', 'channel-partner'));
        break;
      case 'cmsLinks':
        TESTS.push(callback => fileTest(callback, postmanEnv, 'cmsLinks', redisKey));
        break;
      case 'Credit-LC':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'rfqCredit', 'LC', 'no'));
        break;
      case 'Credit-BG':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'rfqCredit', 'BG', 'no'));
        break;
      case 'Credit-PDC':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'rfqCredit', 'PDC', 'no'));
        break;
      case 'multiple-LC':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'multipleLC', 'LC', 'no'));
        break;
      case 'multiple-BG':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'multipleLC', 'BG', 'no'));
        break;
      case 'multiple-PDC':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'multipleLC', 'PDC', 'no'));
        break;
      case 'lsp-tds-2-percentage':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'tds-lsp-agent', 'LC', 'lsp-tds-2-percentage'));
        break;
      case 'lsp-no-tds':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'tds-lsp-agent', 'LC', 'lsp-no-tds'));
        break;
      case 'agent-tds':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'tds-lsp-agent', 'LC', 'agent-tds'));
        break;
      case 'agent-no-tds':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'tds-lsp-agent', 'LC', 'agent-no-tds'));
        break;
      case 'leadLms':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'leadLms'));
        break;
      case 'adhoc-invoice':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'rfqCredit', 'LC', 'ADHOC_INVOICE'));
        break;
      case 'adhoc-invoice-interest':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'rfqCredit', 'LC', 'ADHOC_INVOICE_INTEREST'));
        break;
      case 'adhoc-invoice-service':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'rfqCredit', 'LC', 'ADHOC_INVOICE_SERVICE'));
        break;
      case 'create-all-loans-new-user':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'oxyzoAllLoans', 'no'));
        break; 
      case 'create-loan-new-user':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'oxyzo', 'no'));
        break;
      case 'create-orion-loan-new-user':
          TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'orion-loan'));
        break;
      case 'loanApplication':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'loanApplication', 'no'));
        break;  
      case 'create-loan-registered-user':
        TESTS.push(callback => registeredUserTest(callback, postmanEnv, loanType, 'registered-user', redisKey));
        break;
      case 'cibil-consent-message':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'leadLms'));
        break;
      case 'diesel-flow':
        TESTS.push(callback => fileTest(callback, postmanEnv, 'diesel', redisKey, 'diesel'));
        break;
      case 'lenders-oxyzo':
        TESTS.push(callback => fileTest(callback, postmanEnv, 'oxyzoLinks', redisKey, 'oxyzoFacility'));
        break;
      case 'loan-adhoc-limit':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'oxyzo', 'adhoc-limit'));
        break;
      case 'node-subnode':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'node-subnode', 'no'));
        break;
      case 'Anchor':
        TESTS.push(callback => newUserTest(callback, postmanEnv, 'INVOICE_DISCOUNTING_OPEN', redisKey, 'Anchor'));
        break;
      case 'DSA':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'DSA'));
        break;
      case 'UnlockRFQ':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'UnlockRFQ', 'yes', 'UnlockRFQ'));
        break;
      case 'multipleLogin':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'multipleLogin'));
        break;
      case 'RfqDeclined':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'RfqDeclined', 'yes', 'RfqDeclined'));
        break;
      case 'OrderCancel':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'OrderCancel', 'yes', 'OrderCancel'));
        break;
      case 'CancelFlows':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'CancelFlows', 'yes', 'CancelFlows'));
        break;
      case 'Blacklist':
        TESTS.push(callback => rfqRfdTest(callback, postmanEnv, loanType, redisKey, 'Blacklist', 'yes', 'Blacklist'));
        break;
      case 'Insurance':
        TESTS.push(callback => newUserTest(callback, postmanEnv, loanType, redisKey, 'Insurance'));
        break;
      case 'OrderAdvancePayment':
        TESTS.push(callback => rfqRfdTest(callback , postmanEnv , loanType , redisKey, 'OrderAdvancePayment' ));
        break;
      case 'InstaFlow':
          TESTS.push(callback => newUserTest(callback , postmanEnv , loanType , redisKey, 'InstaFlow' ));
        break;
      case 'Inventory':
          TESTS.push(callback => newUserTest(callback , postmanEnv , loanType , redisKey, 'Inventory' ));
        break;
      case 'oxyzoLinks':
        TESTS.push(callback => fileTest(callback, postmanEnv, 'oxyzoLinks', redisKey, 'no'));
        break;
      default:
        throw Error('!!!!!');
    }
    break;
    default:
    throw new Error(`Invalid test type: ${testType}`);
}

// Finally executes all the requested tests in series.
async.series(TESTS, (err) => {
  if (err) {
    throw err;
  }
  console.info('Done!');
});
