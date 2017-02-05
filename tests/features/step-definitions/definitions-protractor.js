let chaiAsPromised = require('chai-as-promised');
let chai = require('chai');

chai.use(chaiAsPromised);
chai.should();

module.exports = function () {
    this.Given(/^I go to the demo website$/, () => {
        browser.ignoreSynchronization = true; // There is no angular here!

        browser.get('http://foo:bar@localhost');
    });

    this.Then(/^I expect the title to be "([^"]*)"$/, (title) => {
        browser.getTitle().should.eventually.equal(title);
    });
};

