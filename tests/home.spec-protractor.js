import HomePo from './po/home-po';

describe('Protractor Basic auth login', function () {
    beforeAll(() => {
        browser.ignoreSynchronization = true; // There is no angular here!
        browser.get('/');
    });

    it('should have a title', function () {
        expect(HomePo.title).toEqual('Hello world!');
    });
});