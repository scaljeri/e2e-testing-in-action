import optimist from 'optimist';

export default class Config {
    static get defaults() {
        return Config._defaults || {
                'browserstack-user': process.env.BROWSERSTACK_USERNAME,
                'browserstack-key':  process.env.BROWSERSTACK_ACCESS_KEY,

                username: 'foo',
                password: 'bar',
                host: 'localhost',
                'url-path': '',

                project: 'E2E testing in action'
            };
    }

    static set defaults(defaults) {
        this._defaults = Object.assign(this.defaults, defaults);
    }

    static set host(host) {
        this._host = host;
    }

    static set name(name) {
        this._name = name;
    }

    static set prefix(prefix) {
        this._prefix = prefix;
    }

    static set seleniumHub(hub) {
        this._seleniumHub = hub;
    }

    static get browser() {
        return Config.getArgv('browser');
    }

    static get browserName() {
        return Config.browser;
    }

    static get browserVersion() {
        return Config.getArgv('browser-version');
    }

    static get browserstackUser() {
        return Config.getArgv('browserstack-user');
    }

    static get browserstackKey() {
        return Config.getArgv('browserstack-key');
    }

    static get cucumber() {
        return Config.getArgv('cucumber');
    }

    static get build() {
        return Config.getArgv('build');
    }

    static get host() {
        return Config.getArgv('host');
    }

    static get os() {
        return Config.getArgv('os');
    }

    static get osVersion() {
        return Config.getArgv('osVersion');
    }

    static get prefix() {
        return Config.getArgv('prefix');
    }

    static get project() {
        return Config.getArgv('project');
    }


    static get seleniumStandalone() {
        return Config.getArgv('selenium-standalone') || !!Config.browserstackUser;
    }

    static get sessionId() {
        return Config.getArgv('session-id')
    }

    static get version() {
        return Config.getArgv('browser-version');
    }

    static get y() {
        return getArgv('y');
    }

    static get local() {
        return Config.getArgv('local');
    }

    static get name() {
        return Config.getArgv('name');
    }

    static get password() {
        return Config.getArgv('password');
    }

    static get seleniumHub() {
        if (!this._seleniumHub) {
            this._seleniumHub = 'http://localhost:4444/wd/hub';

            if (this.browserstackUser) {
                this._seleniumHub = `https://${this.browserstackUser}:${this.browserstackKey}@hub-cloud.browserstack.com/wd/hub`;
            }
        }

        return this._seleniumHub;
    }

    static get url() {
        let url = 'http://';

        if (Config.username) {
            url += `${Config.username}:${Config.password}@`;
        }

        return url + Config.host + Config.urlPath;
    }

    static get urlPath() {
        return Config.getArgv('url-path');
    }

    static get username() {
        return Config.getArgv('username');
    }

    static getArgv(name) {
        //        set by app      command line args      defaults or environment vars
        return Config[`_${name}`] || optimist.argv[name] || Config.defaults[name];
    }
}
