import Config from './config';
import HomePo from './po/home-po';

describe('Protractor Basic auth login', function () {
    beforeAll(() => {
        browser.ignoreSynchronization = true; // There is no angular here!
        browser.get(Config.url);
    });

    it('should have a title', function () {
        expect(HomePo.title).toEqual('Hello world!');
    });
});