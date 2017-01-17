import webdriver from 'selenium-webdriver';
import chrome  from 'selenium-webdriver/chrome';
import request from 'request';
import url from 'url';
import Firefox from './src/firefox';

const URL = 'http://foo:bar@localhost';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

class Setup {
    static firefox() {
        return Firefox.build(webdriver);
    }

    static ff() {
        return this.firefox();
    }

    static chrome() {
        let options = new chrome.Options();

        return new webdriver.Builder().withCapabilities(options.toCapabilities()).build();
    }

    static safari() {
       return new webdriver.Builder()
           .forBrowser('safari')
           .build();
    }
}

class Runner {
    constructor() {
    }

    start() {
        let browserName = (process.argv[2] || '').toLowerCase();

        if (browserName && Setup[browserName]) {
            this.driver = Setup[browserName]();
            this.selenium();

        } else {
            this.nodeOnly();
        }
    }

    selenium() {
        this.driver.get(URL);
        //this.browser.close();
    }

    nodeOnly() {
        let uname = 'foo',
            password = 'bar',
            auth = `Basic ${new Buffer(uname + ':' + password).toString("base64")}`;

        this.doRequest(URL, auth);
    }

    doRequest(goto, auth) {
        request({
            followRedirect: false,
            url: goto,
            headers: {
                "Authorization": auth
            }
        }, (error, response, body) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                let redirectUrl = url.resolve(response.request.href, response.headers.location);

                console.log(`Follow redirect (${response.statusCode}) -> ${redirectUrl}`);
                doRequest(redirectUrl, auth);
            } else {
                console.log(body);
            }
        });
    }
}

new Runner().start();

