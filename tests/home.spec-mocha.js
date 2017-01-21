import {USERNAME, PASSWORD, URL} from './settings';
import HomePo from './home-po';

test.describe('Protractor Basic auth login', function () {
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