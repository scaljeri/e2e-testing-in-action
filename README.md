# protractor-basic-auth
How to use basic authentication together with Protractor

[Blogpost])(https://scaljeri.github.io/protractor-basic-auth/)

### Bookmarks

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

### start server

    $> docker run -d --name web dockercloud/hello-world
    $> docker run -d -p 80:80 --link web:web --name auth beevelop/nginx-basic-auth
    
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

### Mocha & Selenium

    $> ./node_modules/.bin/mocha --compilers js:babel-core/register ./tests/mocha-home.spec.js
    
### Browserstack

Start the tunnel for localhost testing

    $> ./BrowserStackLocal --key <Your browserstack key>
    $> ./node_modules/.bin/protractor tests/protractor.conf
    
### Testing

Mocha:

    $> npm run test:mocha -- --browser=safari
    
Protractor:

    $> npm run test:protractor ./tests/protractor-local.conf -- --browser=firefox
    
### Runner / Selenium only

    $> npm start -- --browser=safari
    $> npm start -- --browser=ie --browser-version=9 --os=windows --os-version=7 --browserstack-user=<username> --browserstack-key=<key> 

