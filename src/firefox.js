//import FirefoxProfile from 'firefox-profile';
import firefox from 'selenium-webdriver/firefox';

var q = require('q');
var FirefoxProfile = require('firefox-profile');

export default class Firefox {
    static createProfile() {
        let profile = new firefox.Profile();
        //profile.setPreference('network.http.phishy-userpass-length', 255);

        return profile;
    }

    static getMultiCapabilities() {

        console.log('xxxxxxxxxxxxxxxxxxxxxx');
        /*
        var deferred = q.defer();

        var firefoxProfile = new FirefoxProfile();
        firefoxProfile.setPreference('browser.newtab.url', 'https://www.angularjs.org');
        firefoxProfile.encoded(function(encodedProfile) {
            var multiCapabilities = [{
                browserName: 'firefox',
                firefox_profile : encodedProfile
            }];
            console.log('done');
            deferred.resolve(multiCapabilities);
        });

        return deferred.promise;
        */

        //let profile = new FirefoxProfile();
        let profile = Firefox.createProfile();

        //profile.setPreference("network.http.phishy-userpass-length", 255);

        return {
            browserName: 'firefox',
            //'firefox-profile': profile

        };

        return new Promise((resolve) => {
            profile.encoded((encodedProfile) => {
                let multiCapabilities = [{
                    browserName: 'firefox',
                    'firefox-profile': encodedProfile
                }];

                resolve(multiCapabilities);
            });
        });
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