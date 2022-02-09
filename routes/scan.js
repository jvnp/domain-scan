var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');
var https = require('https');
var dns = require('dns');
var IPToASN = require('ip-to-asn');

var client = new IPToASN();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/')
});

router.post('/', function(req, res, next) {

  const url = req.body.url;

  puppeteer.launch().then(async function(browser) {
    const page = await browser.newPage();
    await page.goto(url);

    // 1 a) Taking a screenshot of the page and saving it
    await page.screenshot({path: 'public/images/screenshot.png'});

    // Closing the Puppeteer controlled headless browser
    await browser.close();

    // splits url https: // some.com
    urlArray = url.split('//');

    // dns for ip
    dns.resolve4(urlArray[1], (err, addresses) => {
      // if any err
      // log to console
      if (err) {
        console.log(err);
        return;
      }

      // address resolved from dns will be used for asn
      client.query(addresses, function (err, results) {
        if (err) {
          console.error(err);
          return;
        }
        // ssl certificate info if https
        if(urlArray[0] === 'https:'){

            var options = {
              host: urlArray[1],
              port: 443,
              method: 'GET'
          };
          
          var req = https.request(options, function(response) {
              var certInfo = response.connection.getPeerCertificate();
              return res.render('scan', { title: 'Puppeteer', url: url, address: addresses[0], asn: results, certInfo: certInfo });
          });
          
          req.end();

        } else {

          // send render information
          return res.render('scan', { title: 'Puppeteer', url: url, address: addresses[0], asn: results });

        }
      });


    });
  });

});

module.exports = router;
