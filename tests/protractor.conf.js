require('babel-core/register');
let Driver = require('../src/utils/driver.js').default,
    Browserstack = require('../src/utils/browserstack.js').default,
    StatusReporter = require('./reporters/jasmine.js').default;

let Config = require('./config.js').default;

// Make sure errors are not silently swallowed by Promises
process.on('unhandledRejection', (err) => {
    console.log(err.stack);
    process.exit(1);
});

Config.defaults = {
    build: 'protractor',
    prefix: 'protractor',
    browser: 'chrome'
};

let driver = new Driver(Config),
    browserstack = new Browserstack(Config),
    statusReporter = new StatusReporter();

let config = {
    framework: 'jasmine2',
    browserstackUser: Config.browserstackUser,
    browserstackKey:  Config.browserstackKey,

    capabilities: {
        'browserstack.local': true,
        'browserstack.debug': 'true',
        project: 'selenium-protractor',
        build: 'protractor',
        name: browserstack.session.name,

        browserName: Config.browser,
        version: driver.browserVersion
    },
    specs: ['home.spec-protractor.js'],

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    onPrepare: function () {
        jasmine.getEnv().addReporter(statusReporter);
    },
    onComplete: function() {
        //console.log(statusReporter.success);
    }
};

if (driver.osVersion) {
    config.capabilities.os = driver.os;
    config.capabilities.osVersion = driver.osVersion;
}

if (driver.browserName === 'firefox') {
    config.capabilities['firefox_profile'] = Driver.createProfile();

    if (!driver.browserstackUser) {
        config.capabilities.marionette = false;
    }
}

exports.config = config;