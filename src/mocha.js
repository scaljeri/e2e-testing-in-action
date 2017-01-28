import Mocha from 'mocha';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';

import {ARGVS} from './utils/cli';
import Driver from './utils/driver';
import Browserstack from './utils/browserstack';

// Make sure errors are not silently swallowed by Promises
process.on('unhandledRejection', (err) => {
    console.log(err);
    //console.log(err.stack);
    process.exit(1);
});

chai.use(chaiAsPromised);
chai.should();

let settings = Object.assign({prefix: 'mocha', build: 'mocha'}, ARGVS);
let browserstack = new Browserstack(settings);
let myDriver = new Driver(Object.assign({name: browserstack.session.name}, settings));

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
