import optimist from 'optimist';

export default class Config {
    // Return all default values
    static get defaults() {
        return Config._defaults || {
                'browserstack-user': process.env.BROWSERSTACK_USERNAME,
                'browserstack-key': process.env.BROWSERSTACK_ACCESS_KEY,
                'max-instances': 2,
                'max-sessions': -1,

                username: 'foo',
                password: 'bar',
                host: 'localhost',
                'url-path': '',

                project: 'E2E testing in action'
            };
    }

    // Remove all properties for which the value is `undefined`
    static deleteUndefined(obj) {
        let clone = {};

        for (let key in obj) {
            if (obj[key] !== undefined) {
                clone[key] = obj[key];
            }
        }

        return clone;
    }

    static buildCapabilities(defaults = {}) {
        return Config.deleteUndefined({
            'browserstack.local': true,
            'browserstack.debug': 'true',
            project: Config.project,
            build:   Config.build,
            name:    (defaults.session || Config.session),

            browserName: (defaults.browser || Config.browser),
            version:     (defaults.browser ? Config.browserVersion : undefined),

            shardTestFiles: true,
            maxInstances: (defaults.maxInstances || 2)
        });
    }

    // Set default values
    static set defaults(defaults) {
        this._defaults = Object.assign(this.defaults, defaults);
    }

    // Set the hostname
    static set host(host) {
        this._host = host;
    }

    // Set the name of the session
    static set session(name) {
        this._session = name;
    }

    // Part of Browserstack session name
    static set prefix(prefix) {
        this._prefix = prefix;
    }

    // Set a specific selenium server address
    static set seleniumHub(hub) {
        this._seleniumHub = hub;
    }

    // Name of the browser to be used for testing
    static get browser() {
        return Config.getArgv('browser');
    }

    // Name of the browser to be used for testing
    static get browserName() {
        return Config.browser;
    }

    // Browser version
    static get browserVersion() {
        return Config.getArgv('browser-version');
    }

    // Browserstack username
    static get browserstackUser() {
        return Config.getArgv('browserstack-user');
    }

    // Browserstack access key
    static get browserstackKey() {
        return Config.getArgv('browserstack-key');
    }

    // Run cucmber tests
    static get cucumber() {
        return Config.getArgv('cucumber');
    }


    // Name of the project, used by Browserstack
    static get project() {
        return Config.getArgv('project');
    }

    // The build name is used by Browserstack (internal use only)
    static get build() {
        return Config.getArgv('build');
    }

    // This property is used as the name of the browserstack session-name
    static get session() {
        return Config.getArgv('session');
    }

    // Idem as `session`
    static get name() {
        return Config.getArgv('session');
    }

    // Used by task scripts only, its the name of the browserstack session
    static get sessionId() {
        return Config.getArgv('session-id')
    }

    // Url host name
    static get host() {
        return Config.getArgv('host');
    }

    // Max browser instances per capability
    static get maxInstances() {
        return Config.getArgv('max-instances');
    }

    // Total allowed browser instances
    static get maxSessions() {
        return Config.getArgv('max-sessions');
    }

    // OS
    static get os() {
        return Config.getArgv('os');
    }

    // OS version
    static get osVersion() {
        return Config.getArgv('osVersion');
    }

    // The prefix is used as part of browserstack's session name
    static get prefix() {
        return Config.getArgv('prefix');
    }


    // Use a selenium standalone server which is already up-and-running
    static get seleniumStandalone() {
        return Config.getArgv('selenium-standalone') || !!Config.browserstackUser;
    }


    // Browser version
    static get version() {
        return Config.getArgv('browser-version');
    }


    // Returns a local or browserstacl selenium server url
    static get seleniumHub() {
        if (!this._seleniumHub) {
            this._seleniumHub = 'http://localhost:4444/wd/hub';

            if (this.browserstackUser) {
                this._seleniumHub = `https://${this.browserstackUser}:${this.browserstackKey}@hub-cloud.browserstack.com/wd/hub`;
            }
        }

        return this._seleniumHub;
    }

    // Construct the complete url
    static get url() {
        let url = 'http://';

        if (Config.username) {
            url += `${Config.username}:${Config.password}@`;
        }

        return url + Config.host + Config.urlPath;
    }

    // The path of the url
    static get urlPath() {
        return Config.getArgv('url-path');
    }

    // Basic Auth password
    static get password() {
        return Config.getArgv('password');
    }

    // Basic Auth username
    static get username() {
        return Config.getArgv('username');
    }

    // Extract the value from somewhere
    static getArgv(name) {
        //        set by app      command line args      defaults or environment vars
        return Config[`_${name}`] || optimist.argv[name] || Config.defaults[name];
    }
}
