require('babel-core/register');
let Driver = require('../src/driver.js').default;
let ARGVS = require('../src/setup').ARGVS;

// Make sure errors are not silently swallowed by Promises
process.on('unhandledRejection', (err) => {
    console.log(err.stack);
    process.exit(1);
});

let driver = new Driver(ARGVS);

let config = {
    framework: 'jasmine2',
    browserstackUser: driver.browserstackUser,
    browserstackKey: driver.browserstackKey,

    capabilities: {
        'browserstack.local': true,
        'browserstack.debug': 'true',
        project: 'protractor-browserstack',

        browserName: driver.browserName,
        version: driver.browserVersion
    },
    specs: ['home.spec.js'],

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
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