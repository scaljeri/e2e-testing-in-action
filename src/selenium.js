import request from 'request';
import 'should';
import url from 'url';
import colors from 'colors/safe';

import HomePo from '../tests/po/home-po';
import Driver from './utils/driver';
import Browserstack from './utils/browserstack';
import Cli from './utils/cli';
import {USERNAME, PASSWORD, URL_PATH} from '../tests/settings';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

class Runner {
    start() {
        Cli.defaults = {prefix: 'selenium', build: 'selenium'};

        Cli.buildArgs()
            .then(() => {
                this.browserstack = new Browserstack(Cli.args);
                Cli.name = this.browserstack.session.name;

                if (Cli.args.browser) {
                    this.driver = new Driver(Cli.args).build();
                    // Needed fr HomePo
                    global.driver = this.driver;
                    this.selenium();

                } else {
                    this.nodeOnly();
                }
            });
    }

    selenium() {
        let url = `http://${USERNAME}:${PASSWORD}@${Cli.host}${URL_PATH}`;
        this.driver.get(url);

        HomePo.title.then(titleText => {
            try {
                titleText.should.equal('Hello world!');
                this.testPassed();
            } catch (e) {
                if (Cli.browserstackUser) {
                    this.browserstack.updateSession('failed');
                }

                this.testFailed(e);
            }

        });

        this.driver.quit();
    }

    nodeOnly() {
        let headers = {
            Authorization: `Basic ${new Buffer(USERNAME + ':' + PASSWORD).toString("base64")}`
        };

        this.doRequest(`http://${Cli.host}${URL_PATH}`, headers);
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
                    this.testPassed();
                } catch (e) {
                    this.testFailed(e);
                }
            }
        });
    }

    testPassed() {
        console.log(colors.green('Test passed!'));
    }

    testFailed(e) {
        console.log(colors.red('Test failed'));
        console.log(e.message);
    }
}

new Runner().start();

