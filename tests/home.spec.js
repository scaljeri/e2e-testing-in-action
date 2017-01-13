import HomePo from './home-po';

const URL = 'localhost',
    USERNAME = 'foo',
    PASSWORD = 'bar';


describe('Protractor Basic auth login', function () {
    beforeAll(() => {
        console.log('begin');
        browser.ignoreSynchronization = true; // There is no angular here!
        browser.get(`http://${USERNAME}:${PASSWORD}@${URL}`);
    });

    it('should have a title', function () {
        expect(HomePo.title).toEqual('Hello world!');
        //browser.pause();
    });
});