### Bookmarks TODO TODO

   - docs: https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/firefox/index.html
   - protractor: https://github.com/juliemr/protractor-demo
                 http://stackoverflow.com/questions/25873378/set-firefox-profile-with-protractor
                 https://github.com/juliemr/protractor-demo/blob/master/howtos/setFirefoxProfile/helper.js
   - geckodriver: https://github.com/mozilla/geckodriver/releases/
   - chromedriver: https://sites.google.com/a/chromium.org/chromedriver/downloads
   - FF versions (47 needed): https://ftp.mozilla.org/pub/firefox/releases/
   - Protractor changelog: https://github.com/angular/protractor/blob/master/CHANGELOG.md
   - Module selenium-webdriver/testing: http://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/testing/index.html
   - Chai as Promised: http://chaijs.com/plugins/chai-as-promised/
   - Enable local testing: https://www.browserstack.com/local-testing
   - https://jasmine.github.io/2.3/custom_reporter.html

### start server

    
TODO: Replace --link with something else: https://docs.docker.com/engine/userguide/networking/default_network/dockerlinks/

### FF

prevent auto update:

app.update.auto - false

app.update.enabled - false

app.update.silent - false

### Safari

For safari you need to enable "Allow Remote Automation" which is inside the "Develop" menu
If "Develop" is not present you can enable it: 'Safari' -> Preferences -> Advanced -> Check 'Show Develop menu in menu bar'

Remove the phising warning: 'Safari' -> Preferences -> Security -> Uncheck the 'Warn when visiting a fraudulent website'

    
### Runner / Selenium only

    $> npm start -- --browser=safari
    $> npm start -- --browser=ie --browser-version=9 --os=windows --os-version=7 --browserstack-user=<username> --browserstack-key=<key> 
    
    
### Problems with yarn

    $> yarn cache clean
    $> yarn self-update
    $> yarn upgrade
    $> yarn install
   
   
### docker standalone chrome/firefox


    $> docker run -p 127.0.0.1:4444:4444 selenium/standalone-chrome:latest
    $> docker run -p 127.0.0.1:4444:4444 selenium/standalone-firefox:latest
