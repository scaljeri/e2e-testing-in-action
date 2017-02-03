import firefox from 'selenium-webdriver/firefox';
import chrome  from 'selenium-webdriver/chrome';
import safari  from 'selenium-webdriver/safari';
import webdriver from 'selenium-webdriver';

export default class Driver {
    constructor(config) {
        this._config = config;

        // Construct capabilities
        this.capabilities = {browserName: config.browser, project: config.project};

        ['os', 'osVersion', 'project', 'build', 'name'].forEach((item) => {
            if (config[item] !== undefined) {
                this.capabilities[item] = config[item];
            }
        });

        if (config.browserVersion) {
            this.capabilities.version = config.browserVersion;
        }

        if (config.browserstackUser) {
            Object.assign(this.capabilities, {
                'browserstack.user':  config.browserstackUser,
                'browserstack.key':   config.browserstackKey,
                'browserstack.local': true,
            });
        }
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
                // TODO:
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

        if (this._config.seleniumStandalone) {
            builder.usingServer(this._config.seleniumHub);
        }

        return builder.withCapabilities(this.capabilities).build();
    }

    static createProfile() {
        let profile = new firefox.Profile();
        profile.setPreference('network.http.phishy-userpass-length', 255);

        return profile;
    }
}