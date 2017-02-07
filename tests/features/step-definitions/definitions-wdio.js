require('chai').should();

module.exports = function () {
    this.Given(/^I go to the demo website$/, () => {
        browser.url('/');
    });

    this.Then(/^I expect the title to be "([^"]*)"$/, (title) => {
        browser.getTitle().should.equal(title);
        browser.getText('h1').should.equal(title);
    });

    this.Given(/^I go to the demo website again$/, () => {
        browser.url('/');
    });

    this.Then(/^I expect the hostname to be present$/, () => {
        browser.getText('h3').should.match(/My hostname is [0-9a-g]+$/);
    });
};
