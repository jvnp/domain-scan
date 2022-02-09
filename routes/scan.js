var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/')
});

router.post('/', function(req, res, next) {

  puppeteer.launch().then(async function(browser) {
    const page = await browser.newPage();
    await page.goto(req.body.url);

    // Taking a screenshot of the page and saving it
    await page.screenshot({path: 'public/images/screenshot.png'});

    // Closing the Puppeteer controlled headless browser
    await browser.close();

    res.render('scan', { title: 'Puppeteer', url: req.body.url });
  });

});

module.exports = router;