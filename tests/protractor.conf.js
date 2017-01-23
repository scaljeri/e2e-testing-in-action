require('babel-core/register');
let Driver = require('../src/utils/driver.js').default,
    Browserstack = require('../src/utils/browserstack.js').default,
    StatusReporter = require('./reporters/jasmine.js').default;

let ARGVS = require('../src/utils/cli').ARGVS;

// Make sure errors are not silently swallowed by Promises
process.on('unhandledRejection', (err) => {
    console.log(err.stack);
    process.exit(1);
});

let driver = new Driver(ARGVS),
    browserstack = new Browserstack({prefix: 'protractor'}),
    statusReporter = new StatusReporter();


let config = {
    framework: 'jasmine2',
    browserstackUser: driver.browserstackUser,
    browserstackKey: driver.browserstackKey,

    capabilities: {
        'browserstack.local': true,
        'browserstack.debug': 'true',
        project: 'selenium-protractor',
        build: 'protractor',
        name: browserstack.session,

        browserName: driver.browserName,
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