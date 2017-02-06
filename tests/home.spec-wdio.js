import Config from './config';

describe('WebdriverIO with Basic auth login', () => {
    before(() => {
        browser.url(Config.url);
    });

    it('should have a title in the head', function () {
        //browser.saveViewportScreenshot('./screenshot.png');

        browser.getTitle().should.equal('Hello world!');
    });

    it('should have a page title', function () {
        browser.getText('h1').should.equal('Hello world!');
    });
});