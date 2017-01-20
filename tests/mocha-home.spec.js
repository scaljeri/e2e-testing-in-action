import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';

import {ARGVS} from '../src/setup';
import Driver from '../src/driver';
import HomePo from './home-po';

chai.use(chaiAsPromised);
chai.should();

global.driver = new Driver(Object.assign({project: 'mocha'}, ARGVS)).build();
global.by = webdriver.By;

const URL = 'localhost',
    USERNAME = 'foo',
    PASSWORD = 'bar';

describe('Protractor Basic auth login', function () {
    test.before(() => {
        driver.get(`http://${USERNAME}:${PASSWORD}@${URL}`);
    });

    test.it('should have a title', function () {
        HomePo.title.should.eventually.equal('Hello world!');
    });

    test.after(function () {
        driver.quit();
    });
});
