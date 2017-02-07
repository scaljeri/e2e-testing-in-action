require('babel-core/register');

let Browserstack = require('../src/utils/browserstack.js').default,
    StatusReporter = require('./reporters/jasmine.js').default;

let Config = require('./config.js').default;

// Make sure errors are not silently swallowed by Promises
process.on('unhandledRejection', (err) => {
    console.log(err.stack);
    process.exit(1);
});

Config.defaults = {
    build:  (Config.cucumber ? 'cucumber' : 'protractor'),
    prefix: 'protractor',
    browser: 'chrome'
};

let browserstack = new Browserstack(Config),
    statusReporter = new StatusReporter();

let config = {
    framework: 'jasmine2',
    getPageTimeout: 60000,
    allScriptsTimeout: 500000,
    browserstackUser: Config.browserstackUser,
    browserstackKey: Config.browserstackKey,

    capabilities: {
        'browserstack.local': true,
        'browserstack.debug': 'true',
        project: Config.project,
        build: Config.build,
        name: browserstack.session.name,

        browserName: Config.browser,
        version: Config.browserVersion,

        shardTestFiles: true,
        maxInstances: 2
    },

    baseUrl: Config.url,
    specs: ['home.spec-protractor.js'],

    jasmineNodeOpts: {
        showColors: true,
        defaultTimeoutInterval: 30000
    },
    onPrepare: function () {
        if (typeof jasmine !== 'undefined') {
            jasmine.getEnv().addReporter(statusReporter);
        }
    },
    onComplete: function () {
        //console.log(statusReporter.success);
    }
};

if (Config.osVersion) {
    config.capabilities.os = Config.os;
    config.capabilities.osVersion = Config.osVersion;
}

if (Config.browserName === 'firefox') {
    config.capabilities['firefox_profile'] = Driver.createProfile();

    if (!Config.browserstackUser) {
        config.capabilities.marionette = false;
    }
}

if (Config.cucumber) {
    config = Object.assign(config, {
        framework: 'custom',
        frameworkPath: require.resolve('protractor-cucumber-framework'),
        cucumberOpts: {
            require: 'features/step-definitions/definitions-protractor.js',
            tags: false,
            format: 'pretty',
            profile: false,
            'no-source': true
        },
        specs: [
            'features/*.feature'
        ]
    });

    delete config.jasmineNodeOpts;
}

exports.config = config;