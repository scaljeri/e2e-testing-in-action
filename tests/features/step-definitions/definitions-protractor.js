let chaiAsPromised = require('chai-as-promised');
let chai = require('chai');

chai.use(chaiAsPromised);
chai.should();

module.exports = function () {
    browser.ignoreSynchronization = true;

    this.Given(/^I go to the demo website$/, () => {
        browser.ignoreSynchronization = true; // There is no angular here!

        browser.get('/');
    });

    this.Then(/^I expect the title to be "([^"]*)"$/, (title) => {
        browser.getTitle().should.eventually.equal(title);
        element(by.css('h1')).getText().should.eventually.equal(title);
    });

    this.Given(/^I go to the demo website again$/, () => {
        browser.get('/');
    });

    this.Then(/^I expect the hostname to be present$/, () => {
        element(by.css('h3')).getText().should.eventually.match(/My hostname is [0-9a-g]+$/);
    });
};

