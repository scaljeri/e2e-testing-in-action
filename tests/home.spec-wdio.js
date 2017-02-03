import Config from './config';

describe('Protractor Basic auth login', () => {
    before(() => {
        browser.url(Config.url);
    });

    it('should have a title', function () {
        //browser.saveViewportScreenshot('./screenshot.png');

        browser.getText('h1').should.equal('Hello world!');
    });
});