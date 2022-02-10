const puppeteer = require('puppeteer');
const https = require('https');
const dns = require('dns');
const IPToASN = require('ip-to-asn');

const client = new IPToASN();

async function getSiteData (url, filename) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)

    const path = `public/images/scan/${filename}.png`
    await page.screenshot({ path })
    const html = await page.evaluate(() => document.body.outerHTML)

    browser.close()

    return {
        html
    }
}

function getDNS (urlArray) {
    return new Promise((resolve, reject) => {

        dns.resolve4(urlArray[1], (err, addresses) => {
            if (err) return reject(err)

            client.query(addresses, (err, results) => {
                if (err) return reject(err)

                resolve({
                    ip: addresses[0],
                    asnDetails: results
                })
            
            })

        })

    })
}

function getCertificates (host) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            host,
            port: 443,
            method: 'GET'
        }, function(response) {

            const certInfo = response.socket.getPeerCertificate()
            resolve(JSON.stringify(certInfo))
    
        })
        req.on('error', (err) => reject(err))
        req.end()
    })

}

module.exports = { getSiteData, getDNS, getCertificates }