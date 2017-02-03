import request from 'request';
import 'should';
import url from 'url';
import colors from 'colors/safe';

import HomePo from '../tests/po/home-po';
import Driver from './utils/driver';
import Browserstack from './utils/browserstack';
import Cli from './utils/cli';
import Config from '../tests/config';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

class Runner {
    start() {
        Config.defaults = {build: 'selenium', prefix: 'selenium'};

        if (Config.seleniumStandalone && !Config.browserstackUser) {
            Cli.transformHostToIp(Config)
                .then(() => this.pickTest());
        } else {
            this.pickTest();
        }
    }

    pickTest() {
        this.browserstack = new Browserstack(Config);

        if (Config.browser) {
            this.driver = new Driver(Config).build();

            // HomePo needs this
            global.driver = this.driver;

            this.selenium();

        } else {
            this.nodeOnly();
        }
    }

    selenium() {
        this.driver.get(Config.url);

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
            Authorization: `Basic ${new Buffer(Config.username + ':' + Config.password).toString("base64")}`
        };

        this.doRequest(`http://${Config.host}${Config.urlPath}`, headers);
    }

    doRequest(gotoUrl, headers) {
        request({
            followRedirect: false,
            url: gotoUrl,
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

