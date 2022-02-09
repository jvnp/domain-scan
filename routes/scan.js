var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');
var dns = require('dns');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/')
});

router.post('/', function(req, res, next) {

  const url = req.body.url;

  puppeteer.launch().then(async function(browser) {
    const page = await browser.newPage();
    await page.goto(url);

    // Taking a screenshot of the page and saving it
    await page.screenshot({path: 'public/images/screenshot.png'});

    // Closing the Puppeteer controlled headless browser
    await browser.close();

    // splits url https: // some.com
    urlArray = url.split('//');

    // dns
    dns.resolve4(urlArray[1], (err, addresses) => {
      // if any err
      // log to console
      if (err) {
        console.log(err);
        return;
      }
    
      // otherwise show the first IPv4 address
      // from the array
      // console.log(addresses[0]); // eg: 64.233.191.113

      // send render information
      res.render('scan', { title: 'Puppeteer', url: url, address: addresses[0] });

    });
  });

});

module.exports = router;
