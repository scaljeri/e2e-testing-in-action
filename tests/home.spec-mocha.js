import HomePo from './po/home-po';
import Config from './config';

test.describe('Mocha with Basic auth login', function () {
    test.before(() => {
        driver.get(Config.url);
    });

    test.it('should have a title in the head', function () {
        driver.getTitle().should.eventually.equal('Hello world!');
    });

    test.it('should have a page title', function () {
        HomePo.title.should.eventually.equal('Hello world!');
    });

    test.after(function () {
        driver.quit();
    });
});