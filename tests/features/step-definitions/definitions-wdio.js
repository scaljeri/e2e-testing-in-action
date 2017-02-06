require('chai').should();

module.exports = function () {
    this.Given(/^I go to the demo website$/, () => {
        browser.url('/');
    });

    this.Then(/^I expect the title to be "([^"]*)"$/, (title) => {
        browser.getTitle().should.equal(title);
        browser.getText('h1').should.equal(title);
    });
};
