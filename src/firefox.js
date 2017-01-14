import firefox from 'selenium-webdriver/firefox';

export default class Firefox {
    static createProfile() {
        let profile = new firefox.Profile();
        profile.setPreference('network.http.phishy-userpass-length', 255);
        //profile.setPreference('test-xxxxx', 1);

        return profile;
    }

    static build() {
        let profile = Firefox.createProfile();

        let options = new firefox.Options().setProfile(profile);

        return new (require('selenium-webdriver')).Builder()
            .forBrowser('firefox')
            .setFirefoxOptions(options)
            .build();
    }
}