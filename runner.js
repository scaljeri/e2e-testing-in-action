import request from 'request';
import url from 'url';

import {ARGVS} from './src/setup';
import Driver from './src/driver';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const USERNAME = 'foo',
    PASSWORD = 'bar',
    URL = `http://${USERNAME}:${PASSWORD}@localhost`;

class Runner {
    start() {
        if (ARGVS.browser) {
            this.driver = new Driver(ARGVS).build();
            this.selenium();

        } else {
            this.nodeOnly();
        }
    }

    selenium() {
        this.driver.get(URL);
        this.driver.sleep(1000);
        this.driver.quit();
    }

    nodeOnly() {
        let headers = {
            Authorization: `Basic ${new Buffer(USERNAME + ':' + PASSWORD).toString("base64")}`
        };

        this.doRequest(URL, headers);
    }

    doRequest(goto, headers) {
        request({
            followRedirect: false,
            url: goto,
            headers
        }, (error, response, body) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                let redirectUrl = url.resolve(response.request.href, response.headers.location);

                console.log(`Follow redirect (${response.statusCode}) -> ${redirectUrl}`);
                doRequest(redirectUrl, headers);
            } else {
                console.log(body);
            }
        });
    }
}

new Runner().start();

