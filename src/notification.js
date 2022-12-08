
const { exec } = require('child_process');

const pdf = require('html-pdf');
const path = require('path');
const nodemailer = require('nodemailer');
const sleep = require('thread-sleep');
const fs = require('fs');
const { each } = require('async');



module.exports = (notificationMessage) => {
  let command = "curl -XPOST --data-urlencode \'payload={\"text\": \"###MESSAGE-PLACE-HOLDER###\"}\' \'https://hooks.slack.com/services/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\'";
  command = command.replace('###MESSAGE-PLACE-HOLDER###', notificationMessage);

  child = exec(command, (error, stdout, stderr) => {
    if (error !== null) {
      console.log(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });

  sleep(5000);
  console.log(__dirname);
  console.log(path.join(__dirname, 'temp/report.html'));
  const template = path.join(__dirname, 'temp/report.html');
  const filename = template.replace('.html', '.pdf');
  const templateHtml = fs.readFileSync(template, 'utf8');

  const options = {
    timeout: 400000,
    renderDelay: 10000,
    height: '30in', // allowed units: mm, cm, in, px
    width: '15in',
  };

  pdf
    .create(templateHtml, options)
    .toFile(filename, (err, pdf) => {

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        secure:true,
        auth: {
          user: 'dev-test@ofbusiness.in',
          pass: 'Oxyzo@2018',
        },
      });
    //   const transporter = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true, 
    //     auth: {
    //         user: 'no-reply@ofbusiness.in', 
    //         pass: 'ofb@2016' 
    //     }
    // });

     var recipients = [
       'anurag.dawar@ofbusiness.in',
       'vikas.sharma@ofbusiness.in'
     ]

     recipients.forEach(element => {
      const mailOptions = {
        from: 'no-reply@ofbusiness.in',
        to: element,
        subject: 'Automation mail notification',
        html: `${notificationMessage}<br />` + '<strong><p style="color:green;">To view HTML-report download the attachment.</p></strong>' + '<br />' + '<strong><u>Promotional:</u> <br /> To run any test case: https://stg-jenkins.ofbusiness.in/job/sanity/build?delay=0sec<br /><p style="color:red;">In case donot find the scenario you want to run, revert us with the specific scenario in one or two line on the following channel: https://ofb-tech.slack.com/messages/CDJ11GF4P/ , <font style="color:green;">rest will be taken care by the testing team.</p></strong>',
        attachments: [
          {
            filename: 'report.pdf',
            path: `${__dirname}/temp/report.pdf`,
            contentType: 'application/pdf',
          }, {
            filename: 'report.html',
            path: `${__dirname}/temp/report.html`,
            contentType: 'text/html',
          }],
        
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(`Email sent: ${info.response}`);
        }
      });

     });    
    });
};
