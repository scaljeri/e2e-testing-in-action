import request from 'request';
import 'should';
import url from 'url';

import HomePo from '../tests/home-po';
import Driver from './utils/driver';
import Browserstack from './utils/browserstack';
import {ARGVS} from './utils/cli';
import {USERNAME, PASSWORD, URL} from '../tests/settings';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const MAIN_URL = `http://${USERNAME}:${PASSWORD}@${URL}`;

let settings = Object.assign({prefix: 'selenium', build: 'selenium'}, ARGVS);
let browserstack = new Browserstack(settings);

class Runner {
    start() {
        if (ARGVS.browser) {
            this.driver = new Driver(Object.assign({name: browserstack.session}, settings)).build();
            global.driver = this.driver;
            this.selenium();

        } else {
            this.nodeOnly();
        }
    }

    selenium() {
        this.driver.get(MAIN_URL);
        HomePo.title.then(titleText => {
            titleText.should.equal('Hello world!');
            console.log('Test passed!');

        });
        this.driver.quit();
    }

    nodeOnly() {
        let headers = {
            Authorization: `Basic ${new Buffer(USERNAME + ':' + PASSWORD).toString("base64")}`
        };

        this.doRequest(MAIN_URL, headers);
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
                body.should.match(/>Hello world!</);
                console.log('Test passed!');

            }
        });
    }
}

new Runner().start();

