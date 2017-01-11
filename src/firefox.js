import FirefoxProfile from 'firefox-profile';
import firefox from 'selenium-webdriver/firefox';

export default class Firefox {
    static xxcreate(webdriver) {
        let myProfile = new FirefoxProfile();
        myProfile.setPreference("network.http.phishy-userpass-length", 255);

        let capabilities = webdriver.Capabilities.firefox();

        return new Promise((resolve) => {
            myProfile.encode((encodedProfile) => {
                capabilities.set('firefox-profile', encodedProfile);
                console.log('xxxxxxxx');
                console.log(encodedProfile);

                let driver = new webdriver.Builder()
                    .withCapabilities(capabilities)
                    .build();

                resolve(driver);
            });
        });
    }

    static create() {
        let profile = new firefox.Profile();
        profile.setPreference('network.http.phishy-userpass-length', 255);

        let options = new firefox.Options().setProfile(profile);

        return new (require('selenium-webdriver')).Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();
    }
}