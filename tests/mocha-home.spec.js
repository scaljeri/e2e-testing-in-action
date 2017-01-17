import firefox from '../src/firefox';
import HomePo from './home-po';

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import webdriver from 'selenium-webdriver';
import test from 'selenium-webdriver/testing';

chai.use(chaiAsPromised);
chai.should();

global.driver = firefox.build();
global.by = webdriver.By;

const URL = 'localhost',
    USERNAME = 'foo',
    PASSWORD = 'bar';

describe('Protractor Basic auth login', function () {
    test.beforeEach(() => {
        driver.get(`http://${USERNAME}:${PASSWORD}@${URL}`);
    });

    test.it('should have a title', function () {
        HomePo.title.should.eventually.equal('Hello world!');
    });

    test.after(function() {
        driver.quit();
    });
});
