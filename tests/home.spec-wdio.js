import {USERNAME, PASSWORD, URL} from './settings';

describe('Protractor Basic auth login', () => {
    before(() => {
        browser.url(`http://${USERNAME}:${PASSWORD}@${URL}`);
    });

    it('should have a title', function () {
        browser.getText('h1').should.equal('Hello world!');
    });
});