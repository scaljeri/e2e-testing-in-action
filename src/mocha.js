import Mocha from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';

import Config from '../tests/config';
import Cli from './utils/cli';
import Driver from './utils/driver';
import Browserstack from './utils/browserstack';

// Make sure errors are not silently swallowed by Promises
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

chai.use(chaiAsPromised);
chai.should();

Config.defaults = {browser: 'chrome', build: 'mocha', prefix: 'mocha'};

function run() {
    let browserstack = new Browserstack(Config),
        myDriver = new Driver(Config);

    global.driver = myDriver.build();
    global.by = webdriver.By;
    global.test = test;

    let mocha = new Mocha({timeout: 30000});
    mocha.addFile('./tests/home.spec-mocha.js');

    mocha.run(failures => {
        if (browserstack.user) {
            browserstack.updateSession(failures > 0 ? 'failed' : 'passed').then(() => {
            });
        }

        process.on('exit', function () {
            process.exit(failures);  // exit with non-zero status if there were failures
        });
    });
}

if (Config.seleniumStandalone && !Config.browserstackUser) {
    Cli.transformHostToIp(Config)
        .then(run);
} else {
    run();
}
