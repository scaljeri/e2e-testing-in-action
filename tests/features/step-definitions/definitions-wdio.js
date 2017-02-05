require('chai').should();

module.exports = function () {
  this.Given(/^I go to the demo website$/, () => {
    browser.url('http://foo:bar@localhost');
  });

  this.Then(/^I expect the title to be "([^"]*)"$/, (title) => {
    browser.getTitle().should.equal(title);
  });
};
