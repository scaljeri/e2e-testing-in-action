import firefox from 'selenium-webdriver/firefox';
import chrome  from 'selenium-webdriver/chrome';
import safari  from 'selenium-webdriver/safari';
import webdriver from 'selenium-webdriver';

const VERSIONS = {
    safari: 10,
    firefox: 47,
    chrome: 55
};

export default class Driver {
    constructor(options) {
        this._options = options;
        this.capabilities = {browserName: this.browserName, project: 'selenium-protractor'};

        ['os', 'osVersion', 'project', 'build', 'name'].forEach((item) => {
            if (options[item] !== undefined) {
                this.capabilities[item] = options[item];
            }
        });

        if (options.browserVersion) {
            this.capabilities.version = options.browserVersion;
        }

        if (this.browserstackUser) {
            Object.assign(this.capabilities, {
                'browserstack.user':  this.browserstackUser,
                'browserstack.key':   this.browserstackKey,
                'browserstack.local': true,

            });
        }
    }

    get browserName() {
        return this._options.browser === 'ff' ? 'firefox' : (this._options.browser || 'chrome');
    }

    get browserstackKey() {
        return this._options['browserstackKey'];
    }

    get browserstackUser() {
        return this._options['browserstackUser'];
    }

    get browserVersion() {
        return this._options['browserVersion'] || VERSIONS[this.browserName];
    }

    get version() {
        return this.browserVersion;
    }

    get os() {
        return this._options.os
    }

    get osVersion() {
        return this._options['osVersion'];
    }

    get seleniumHub() {
        let hubUrl;

        if (this.browserstackUser) {
            hubUrl = `https://${this.browserstackUser}:${this.browserstackKey}@hub-cloud.browserstack.com/wd/hub`;
        } else {
            hubUrl = 'http://localhost:4444/wd/hub';
        }

        return hubUrl;
    }

    get useSeleniumHub() {
        return this._options['seleniumStandalone'] || this.browserstackUser;
    }

    build() {
        let builder = new webdriver.Builder();

        switch (this.browserName) {
            case 'firefox':
                if (!this.browserstackUser) {
                    let profile = Driver.createProfile();

                    this.capabilities.marionette = false;

                    builder.setFirefoxOptions(new firefox.Options().setProfile(profile));
                }
                break;
            case 'chrome':
                // --auto-open-devtools-for-tabs
                //let options = new chrome.Options();
                //options.addArguments(['--disable-web-security', '--user-data-dir', '--auto-open-devtools-for-tabs']);
                //builder.setChromeOptions(options);
                //builder.setChromeOptions(new chrome.Options());

                let options = new chrome.Options();
                builder.setChromeOptions(options);
                break;
            case 'safari':
                builder.setSafariOptions(new safari.Options());
                break;
        }

        if (this.useSeleniumHub) {
            builder.usingServer(this.seleniumHub);
        }

        return builder.withCapabilities(this.capabilities).build();
    }

    static createProfile() {
        let profile = new firefox.Profile();
        profile.setPreference('network.http.phishy-userpass-length', 255);

        return profile;
    }
}