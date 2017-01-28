import {USERNAME, PASSWORD, URL} from './settings';
import HomePo from './po/home-po';

describe('Protractor Basic auth login', function () {
    beforeAll(() => {
        browser.ignoreSynchronization = true; // There is no angular here!
        browser.get(`http://${USERNAME}:${PASSWORD}@${URL}`);
    });

    it('should have a title', function () {
        expect(HomePo.title).toEqual('Hello world');
    });
});