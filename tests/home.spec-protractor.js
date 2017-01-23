import HomePo from './po/home-po';

const URL = 'localhost',
    USERNAME = 'foo',
    PASSWORD = 'bar';


describe('Protractor Basic auth login', function () {
    beforeAll(() => {
        browser.ignoreSynchronization = true; // There is no angular here!
        browser.get(`http://${USERNAME}:${PASSWORD}@${URL}`);
    });

    it('should have a title', function () {
        expect(HomePo.title).toEqual('Hello world!');
    });
});