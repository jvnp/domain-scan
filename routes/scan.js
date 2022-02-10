var express = require('express');
var router = express.Router();
var puppeteer = require('puppeteer');
var https = require('https');
var dns = require('dns');
var IPToASN = require('ip-to-asn');

var client = new IPToASN();

var {getSiteData, getDNS, getCertificates} = require('../lib');

// db
var Scan = require('../db');

/* GET: /scan */
router.get('/', function(req, res, next) {
  res.redirect('/')
});

/* POST: /scan */
router.post('/', async function(req, res, next) {

  // timestamp as key and image name
  const key = + new Date()
  // url input from user
  const url = req.body.url;
  // splits url ['https', 'some.com']
  const urlArray = url.split('://');
  // default certificate value
  let ssl = false;

  const { html } = await getSiteData(url, key)
  const { ip, asnDetails } = await getDNS(urlArray)
  const natural = html.replace(/<[^>]*>?/gm, '')
  const asn = JSON.stringify(asnDetails)

  console.log(asn)

  if (urlArray[0] === 'https') {

    ssl = await getCertificates(urlArray[1])
    ssl = JSON.stringify(ssl)

    // save instance
    var saveInstance = new Scan({
      key,
      url,
      ip,
      asn,
      ssl,
      html,
      natural
    });

  } else {

    // save instance
    var saveInstance = new Scan({
      key,
      url,
      ip,
      asn,
      html,
      natural
    });

  }

  // save prepared object
  saveInstance.save(function (err){
    if (err){
      console.log('Your information couldn\'t be updated.');
    }
  });

  res.render('scan', {
    title: 'Domain Scan',
    key,
    html,
    url,
    ip,
    asn,
    ssl,
    natural
  })

});

module.exports = router;
