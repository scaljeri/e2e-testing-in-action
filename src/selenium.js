import request from 'request';
import 'should';
import url from 'url';
import colors from 'colors/safe';

import HomePo from '../tests/po/home-po';
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
            this.driver = new Driver(Object.assign({name: browserstack.session.name}, settings)).build();
            global.driver = this.driver;
            this.selenium();

        } else {
            this.nodeOnly();
        }
    }

    selenium() {
        this.driver.get(MAIN_URL);

        HomePo.title.then(titleText => {
            try {
                titleText.should.equal('Hello world!');
                console.log('Test passed!');
            } catch(e) {
                browserstack.updateSession('failed');

                console.log(colors.red('Test failed'));
                console.log(e.message);
            }

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

                console.log(colors.yellow(`Follow redirect (${response.statusCode}) -> ${redirectUrl}`));
                doRequest(redirectUrl, headers);
            } else {
                try {
                    body.should.match(/>Hello world!</);
                    console.log(colors.green('Test passed!'));
                } catch(e) {
                    console.log(colors.red('Test failed'));
                    console.log(e.message);
                }
            }
        });
    }
}

new Runner().start();

